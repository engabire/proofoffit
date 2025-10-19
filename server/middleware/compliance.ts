/**
 * Compliance and Consent Middleware
 *
 * Enforces GDPR/CCPA compliance, consent management, and policy acceptance
 * before allowing application actions. Links every job_search_event to a consent_event.
 */

import { NextRequest, NextResponse } from "next/server";
import type { ConsentEvent, PolicyRegistry } from "../../domain/jobs";

export interface ComplianceConfig {
    requireConsent: boolean;
    consentTimeoutDays: number;
    policyVersion: string;
    logConsentEvents: boolean;
    enforceDataRetention: boolean;
    dataRetentionDays: number;
}

export class ComplianceMiddleware {
    private readonly config: ComplianceConfig;

    constructor(config?: Partial<ComplianceConfig>) {
        this.config = {
            requireConsent: true,
            consentTimeoutDays: 365, // 1 year
            policyVersion: "1.0.0",
            logConsentEvents: true,
            enforceDataRetention: true,
            dataRetentionDays: 2555, // 7 years
            ...config,
        };
    }

    /**
     * Middleware to enforce consent before job search actions
     */
    async enforceConsent(
        request: NextRequest,
        userId?: string,
        sessionId?: string,
    ): Promise<NextResponse | null> {
        // Skip consent check for public endpoints
        if (this.isPublicEndpoint(request)) {
            return null;
        }

        // Skip consent check if not required
        if (!this.config.requireConsent) {
            return null;
        }

        // Extract user information
        const user = userId || this.extractUserId(request);
        const session = sessionId || this.extractSessionId(request);

        if (!user) {
            return this.createConsentRequiredResponse(
                "User identification required",
            );
        }

        // Check for valid consent
        const hasValidConsent = await this.checkValidConsent(user);

        if (!hasValidConsent) {
            return this.createConsentRequiredResponse("Valid consent required");
        }

        // Log the consent verification
        if (this.config.logConsentEvents) {
            await this.logConsentVerification(user, session, request);
        }

        return null; // Consent is valid, continue
    }

    /**
     * Create a consent event when user accepts policies
     */
    async createConsentEvent(
        userId: string,
        eventType: ConsentEvent["eventType"],
        request: NextRequest,
        metadata?: Record<string, unknown>,
    ): Promise<ConsentEvent> {
        const consentEvent: ConsentEvent = {
            id: this.generateId(),
            userId,
            eventType,
            policyVersion: this.config.policyVersion,
            timestamp: new Date(),
            ipAddress: this.extractIPAddress(request),
            userAgent: request.headers.get("user-agent") || undefined,
            metadata: {
                ...metadata,
                middlewareVersion: "1.0.0",
                timestamp: Date.now(),
            },
        };

        // Store consent event (in real implementation, this would be stored in database)
        await this.storeConsentEvent(consentEvent);

        return consentEvent;
    }

    /**
     * Get current policy version and content
     */
    async getCurrentPolicy(
        policyType: PolicyRegistry["policyType"],
    ): Promise<PolicyRegistry | null> {
        // In real implementation, this would query the database
        return {
            id: this.generateId(),
            policyType,
            version: this.config.policyVersion,
            effectiveDate: new Date(),
            content: this.getDefaultPolicyContent(policyType),
            checksum: this.calculateChecksum(
                this.getDefaultPolicyContent(policyType),
            ),
            isActive: true,
        };
    }

    /**
     * Validate data retention policies
     */
    async validateDataRetention(userId: string): Promise<{
        canRetain: boolean;
        retentionPeriod: number;
        expiresAt: Date;
    }> {
        if (!this.config.enforceDataRetention) {
            return {
                canRetain: true,
                retentionPeriod: this.config.dataRetentionDays,
                expiresAt: new Date(
                    Date.now() +
                        this.config.dataRetentionDays * 24 * 60 * 60 * 1000,
                ),
            };
        }

        // Check user's consent for data retention
        const consent = await this.getLatestConsent(userId, "policy_accept");

        if (!consent) {
            return {
                canRetain: false,
                retentionPeriod: 0,
                expiresAt: new Date(),
            };
        }

        const retentionPeriod = this.config.dataRetentionDays;
        const expiresAt = new Date(
            consent.timestamp.getTime() + retentionPeriod * 24 * 60 * 60 * 1000,
        );

        return {
            canRetain: true,
            retentionPeriod,
            expiresAt,
        };
    }

    /**
     * Handle data deletion requests (GDPR Right to be Forgotten)
     */
    async handleDataDeletion(userId: string, request: NextRequest): Promise<{
        success: boolean;
        deletedRecords: number;
        errors: string[];
    }> {
        const errors: string[] = [];
        let deletedRecords = 0;

        try {
            // Log the deletion request
            await this.createConsentEvent(userId, "data_delete", request, {
                deletionRequested: true,
                timestamp: Date.now(),
            });

            // Delete user data (in real implementation, this would delete from database)
            // This is a simplified version - in reality, you'd need to handle:
            // - Anonymizing vs deleting
            // - Legal hold requirements
            // - Backup retention
            // - Related data cleanup

            deletedRecords = await this.deleteUserData(userId);

            return {
                success: true,
                deletedRecords,
                errors,
            };
        } catch (error) {
            errors.push(
                `Data deletion failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
            return {
                success: false,
                deletedRecords,
                errors,
            };
        }
    }

    /**
     * Handle data export requests (GDPR Right to Data Portability)
     */
    async handleDataExport(userId: string, request: NextRequest): Promise<{
        success: boolean;
        data: Record<string, unknown>;
        errors: string[];
    }> {
        const errors: string[] = [];

        try {
            // Log the export request
            await this.createConsentEvent(userId, "data_export", request, {
                exportRequested: true,
                timestamp: Date.now(),
            });

            // Collect user data (in real implementation, this would query the database)
            const userData = await this.collectUserData(userId);

            return {
                success: true,
                data: userData,
                errors,
            };
        } catch (error) {
            errors.push(
                `Data export failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
            return {
                success: false,
                data: {},
                errors,
            };
        }
    }

    private isPublicEndpoint(request: NextRequest): boolean {
        const publicPaths = [
            "/api/health",
            "/api/policies",
            "/privacy-policy",
            "/terms-of-service",
            "/legal/",
        ];

        const pathname = request.nextUrl.pathname;
        return publicPaths.some((path) => pathname.startsWith(path));
    }

    private extractUserId(request: NextRequest): string | null {
        // Extract user ID from various sources
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            // In real implementation, decode JWT token
            return "user_from_token";
        }

        const userId = request.headers.get("x-user-id");
        if (userId) {
            return userId;
        }

        // Extract from cookies
        const userCookie = request.cookies.get("user_id");
        if (userCookie) {
            return userCookie.value;
        }

        return null;
    }

    private extractSessionId(request: NextRequest): string | null {
        return request.headers.get("x-session-id") ||
            request.cookies.get("session_id")?.value ||
            null;
    }

    private extractIPAddress(request: NextRequest): string | undefined {
        return request.headers.get("x-forwarded-for")?.split(",")[0] ||
            request.headers.get("x-real-ip") ||
            request.ip ||
            undefined;
    }

    private async checkValidConsent(userId: string): Promise<boolean> {
        // In real implementation, this would query the database
        // For now, return true for demonstration
        return true;
    }

    private async logConsentVerification(
        userId: string,
        sessionId: string | null,
        request: NextRequest,
    ): Promise<void> {
        // Log consent verification for audit trail
        console.log("Consent verified", {
            userId,
            sessionId,
            timestamp: new Date().toISOString(),
            ipAddress: this.extractIPAddress(request),
            userAgent: request.headers.get("user-agent"),
        });
    }

    private async storeConsentEvent(consentEvent: ConsentEvent): Promise<void> {
        // In real implementation, this would store in database
        console.log("Storing consent event", consentEvent);
    }

    private async getLatestConsent(
        userId: string,
        eventType: ConsentEvent["eventType"],
    ): Promise<ConsentEvent | null> {
        // In real implementation, this would query the database
        return null;
    }

    private async deleteUserData(userId: string): Promise<number> {
        // In real implementation, this would delete from database
        // Return mock count for demonstration
        return 5;
    }

    private async collectUserData(
        userId: string,
    ): Promise<Record<string, unknown>> {
        // In real implementation, this would collect from database
        return {
            userId,
            consentEvents: [],
            jobSearches: [],
            fitScores: [],
            exportedAt: new Date().toISOString(),
        };
    }

    private createConsentRequiredResponse(message: string): NextResponse {
        return NextResponse.json(
            {
                error: "Consent Required",
                message,
                consentRequired: true,
                policyUrl: "/privacy-policy",
                consentUrl: "/consent",
            },
            { status: 403 },
        );
    }

    private getDefaultPolicyContent(
        policyType: PolicyRegistry["policyType"],
    ): string {
        const policies = {
            privacy: `
# Privacy Policy

## Data Collection
We collect the following data:
- Job search queries and preferences
- Application history
- Profile information

## Data Usage
Your data is used to:
- Provide job matching services
- Improve our algorithms
- Comply with legal requirements

## Data Sharing
We do not sell your personal data. We may share data with:
- Job providers (with your consent)
- Legal authorities (when required)

## Your Rights
You have the right to:
- Access your data
- Correct your data
- Delete your data
- Export your data
- Withdraw consent
      `,
            terms: `
# Terms of Service

## Service Description
ProofOfFit provides job matching and application services.

## User Responsibilities
Users must:
- Provide accurate information
- Respect intellectual property
- Comply with applicable laws

## Service Availability
We strive for 99.9% uptime but do not guarantee uninterrupted service.

## Limitation of Liability
Our liability is limited to the amount paid for the service.
      `,
            cookie: `
# Cookie Policy

## Essential Cookies
We use essential cookies for:
- Authentication
- Security
- Basic functionality

## Analytics Cookies
We use analytics cookies to:
- Understand usage patterns
- Improve our service
- Measure performance

## Marketing Cookies
We use marketing cookies to:
- Show relevant job recommendations
- Personalize your experience
      `,
            data_processing: `
# Data Processing Agreement

## Processing Purpose
We process your data to provide job matching services.

## Legal Basis
Processing is based on:
- Your consent
- Contract performance
- Legitimate interests

## Data Categories
We process:
- Personal identification data
- Professional information
- Usage analytics
      `,
        };

        return policies[policyType] || "Policy content not available";
    }

    private calculateChecksum(content: string): string {
        // Simple checksum calculation (in real implementation, use crypto)
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(16);
    }

    private generateId(): string {
        return `consent_${Date.now()}_${
            Math.random().toString(36).substring(2, 9)
        }`;
    }
}

// Middleware factory function
export function createComplianceMiddleware(config?: Partial<ComplianceConfig>) {
    const middleware = new ComplianceMiddleware(config);

    return {
        enforceConsent: middleware.enforceConsent.bind(middleware),
        createConsentEvent: middleware.createConsentEvent.bind(middleware),
        getCurrentPolicy: middleware.getCurrentPolicy.bind(middleware),
        validateDataRetention: middleware.validateDataRetention.bind(
            middleware,
        ),
        handleDataDeletion: middleware.handleDataDeletion.bind(middleware),
        handleDataExport: middleware.handleDataExport.bind(middleware),
    };
}

// Default middleware instance
export const complianceMiddleware = createComplianceMiddleware();
