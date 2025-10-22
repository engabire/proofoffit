import { NextRequest } from "next/server";
import { createHash, randomBytes } from "crypto";

// Security Event Types
export interface SecurityEvent {
    id: string;
    timestamp: Date;
    type: SecurityEventType;
    severity: SecuritySeverity;
    source: string;
    details: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    userId?: string;
    resolved: boolean;
    resolvedAt?: Date;
    resolvedBy?: string;
}

export type SecurityEventType =
    | "AUTHENTICATION_FAILURE"
    | "AUTHORIZATION_FAILURE"
    | "RATE_LIMIT_EXCEEDED"
    | "SUSPICIOUS_ACTIVITY"
    | "DATA_ACCESS_VIOLATION"
    | "CSRF_ATTACK"
    | "XSS_ATTEMPT"
    | "SQL_INJECTION_ATTEMPT"
    | "BRUTE_FORCE_ATTACK"
    | "UNUSUAL_LOCATION"
    | "MULTIPLE_FAILED_LOGINS"
    | "PRIVILEGE_ESCALATION"
    | "DATA_EXFILTRATION"
    | "MALICIOUS_FILE_UPLOAD"
    | "API_ABUSE";

export type SecuritySeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// Security Monitor Configuration
interface SecurityMonitorConfig {
    maxFailedLogins: number;
    loginWindowMs: number;
    suspiciousActivityThreshold: number;
    rateLimitThreshold: number;
    enableGeolocationTracking: boolean;
    enableBehavioralAnalysis: boolean;
    alertThresholds: {
        low: number;
        medium: number;
        high: number;
        critical: number;
    };
}

// Default Configuration
const defaultConfig: SecurityMonitorConfig = {
    maxFailedLogins: 5,
    loginWindowMs: 15 * 60 * 1000, // 15 minutes
    suspiciousActivityThreshold: 10,
    rateLimitThreshold: 100,
    enableGeolocationTracking: true,
    enableBehavioralAnalysis: true,
    alertThresholds: {
        low: 10,
        medium: 5,
        high: 3,
        critical: 1,
    },
};

// Security Event Storage (In production, use a proper database)
const securityEvents: SecurityEvent[] = [];
const failedLoginAttempts = new Map<
    string,
    { count: number; lastAttempt: Date; blocked: boolean }
>();
const suspiciousIPs = new Set<string>();
const userBehaviorPatterns = new Map<
    string,
    { lastLogin: Date; locations: string[]; devices: string[] }
>();

class SecurityMonitor {
    private config: SecurityMonitorConfig;

    constructor(config: Partial<SecurityMonitorConfig> = {}) {
        this.config = { ...defaultConfig, ...config };
    }

    /**
     * Log a security event
     */
    public logEvent(
        type: SecurityEventType,
        severity: SecuritySeverity,
        source: string,
        details: Record<string, any>,
        request: NextRequest,
        userId?: string,
    ): void {
        const event: SecurityEvent = {
            id: this.generateEventId(),
            timestamp: new Date(),
            type,
            severity,
            source,
            details,
            ipAddress: this.getClientIP(request),
            userAgent: request.headers.get("user-agent") || "unknown",
            userId,
            resolved: false,
        };

        securityEvents.push(event);

        // Check if this event should trigger an alert
        this.checkAlertThresholds(event);

        // Update behavior patterns
        if (userId) {
            this.updateUserBehaviorPattern(userId, event);
        }

        // Log to console (in production, send to monitoring service)
        console.log(`Security Event [${severity}]: ${type}`, {
            id: event.id,
            timestamp: event.timestamp,
            ip: event.ipAddress,
            userAgent: event.userAgent,
            details,
        });
    }

    /**
     * Check for brute force attacks
     */
    public checkBruteForceAttack(ipAddress: string, success: boolean): boolean {
        const now = new Date();
        const attempts = failedLoginAttempts.get(ipAddress);

        if (success) {
            // Reset failed attempts on successful login
            failedLoginAttempts.delete(ipAddress);
            return false;
        }

        if (!attempts) {
            failedLoginAttempts.set(ipAddress, {
                count: 1,
                lastAttempt: now,
                blocked: false,
            });
            return false;
        }

        // Check if window has expired
        if (
            now.getTime() - attempts.lastAttempt.getTime() >
                this.config.loginWindowMs
        ) {
            failedLoginAttempts.set(ipAddress, {
                count: 1,
                lastAttempt: now,
                blocked: false,
            });
            return false;
        }

        // Increment failed attempts
        attempts.count++;
        attempts.lastAttempt = now;

        if (attempts.count >= this.config.maxFailedLogins) {
            attempts.blocked = true;
            suspiciousIPs.add(ipAddress);
            return true;
        }

        return false;
    }

    /**
     * Check for suspicious activity patterns
     */
    public checkSuspiciousActivity(
        ipAddress: string,
        userId?: string,
    ): boolean {
        const recentEvents = securityEvents.filter(
            (event) =>
                event.ipAddress === ipAddress &&
                event.timestamp.getTime() >
                    Date.now() - this.config.loginWindowMs,
        );

        const suspiciousEventCount = recentEvents.filter(
            (event) =>
                event.severity === "HIGH" || event.severity === "CRITICAL",
        ).length;

        if (suspiciousEventCount >= this.config.suspiciousActivityThreshold) {
            suspiciousIPs.add(ipAddress);
            return true;
        }

        return false;
    }

    /**
     * Check for unusual location access
     */
    public checkUnusualLocation(ipAddress: string, userId: string): boolean {
        if (!this.config.enableGeolocationTracking) {
            return false;
        }

        const userPattern = userBehaviorPatterns.get(userId);
        if (!userPattern) {
            return false;
        }

        // In a real implementation, you'd use a geolocation service
        const currentLocation = this.getLocationFromIP(ipAddress);

        if (
            userPattern.locations.length > 0 &&
            !userPattern.locations.includes(currentLocation)
        ) {
            // Check if this is a new location
            const isRecentLocation = userPattern.locations.some(
                (location) => this.isLocationNearby(location, currentLocation),
            );

            if (!isRecentLocation) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get security events for a specific user or IP
     */
    public getSecurityEvents(filters: {
        userId?: string;
        ipAddress?: string;
        type?: SecurityEventType;
        severity?: SecuritySeverity;
        resolved?: boolean;
        limit?: number;
    }): SecurityEvent[] {
        let filteredEvents = securityEvents;

        if (filters.userId) {
            filteredEvents = filteredEvents.filter((event) =>
                event.userId === filters.userId
            );
        }

        if (filters.ipAddress) {
            filteredEvents = filteredEvents.filter((event) =>
                event.ipAddress === filters.ipAddress
            );
        }

        if (filters.type) {
            filteredEvents = filteredEvents.filter((event) =>
                event.type === filters.type
            );
        }

        if (filters.severity) {
            filteredEvents = filteredEvents.filter((event) =>
                event.severity === filters.severity
            );
        }

        if (filters.resolved !== undefined) {
            filteredEvents = filteredEvents.filter((event) =>
                event.resolved === filters.resolved
            );
        }

        // Sort by timestamp (newest first)
        filteredEvents.sort((a, b) =>
            b.timestamp.getTime() - a.timestamp.getTime()
        );

        if (filters.limit) {
            filteredEvents = filteredEvents.slice(0, filters.limit);
        }

        return filteredEvents;
    }

    /**
     * Resolve a security event
     */
    public resolveEvent(eventId: string, resolvedBy: string): boolean {
        const event = securityEvents.find((e) => e.id === eventId);
        if (event) {
            event.resolved = true;
            event.resolvedAt = new Date();
            event.resolvedBy = resolvedBy;
            return true;
        }
        return false;
    }

    /**
     * Get security statistics
     */
    public getSecurityStats(): {
        totalEvents: number;
        eventsByType: Record<SecurityEventType, number>;
        eventsBySeverity: Record<SecuritySeverity, number>;
        unresolvedEvents: number;
        suspiciousIPs: number;
        blockedIPs: number;
    } {
        const stats = {
            totalEvents: securityEvents.length,
            eventsByType: {} as Record<SecurityEventType, number>,
            eventsBySeverity: {} as Record<SecuritySeverity, number>,
            unresolvedEvents: 0,
            suspiciousIPs: suspiciousIPs.size,
            blockedIPs: 0,
        };

        // Initialize counters
        const eventTypes: SecurityEventType[] = [
            "AUTHENTICATION_FAILURE",
            "AUTHORIZATION_FAILURE",
            "RATE_LIMIT_EXCEEDED",
            "SUSPICIOUS_ACTIVITY",
            "DATA_ACCESS_VIOLATION",
            "CSRF_ATTACK",
            "XSS_ATTEMPT",
            "SQL_INJECTION_ATTEMPT",
            "BRUTE_FORCE_ATTACK",
            "UNUSUAL_LOCATION",
            "MULTIPLE_FAILED_LOGINS",
            "PRIVILEGE_ESCALATION",
            "DATA_EXFILTRATION",
            "MALICIOUS_FILE_UPLOAD",
            "API_ABUSE",
        ];

        const severities: SecuritySeverity[] = [
            "LOW",
            "MEDIUM",
            "HIGH",
            "CRITICAL",
        ];

        eventTypes.forEach((type) => {
            stats.eventsByType[type] = 0;
        });

        severities.forEach((severity) => {
            stats.eventsBySeverity[severity] = 0;
        });

        // Count events
        securityEvents.forEach((event) => {
            stats.eventsByType[event.type]++;
            stats.eventsBySeverity[event.severity]++;
            if (!event.resolved) {
                stats.unresolvedEvents++;
            }
        });

        // Count blocked IPs
        failedLoginAttempts.forEach((attempt) => {
            if (attempt.blocked) {
                stats.blockedIPs++;
            }
        });

        return stats;
    }

    /**
     * Check if an IP is blocked
     */
    public isIPBlocked(ipAddress: string): boolean {
        const attempts = failedLoginAttempts.get(ipAddress);
        return attempts?.blocked || false;
    }

    /**
     * Check if an IP is suspicious
     */
    public isIPSuspicious(ipAddress: string): boolean {
        return suspiciousIPs.has(ipAddress);
    }

    /**
     * Unblock an IP address
     */
    public unblockIP(ipAddress: string): boolean {
        const attempts = failedLoginAttempts.get(ipAddress);
        if (attempts) {
            attempts.blocked = false;
            attempts.count = 0;
            suspiciousIPs.delete(ipAddress);
            return true;
        }
        return false;
    }

    // Private helper methods
    private generateEventId(): string {
        return randomBytes(16).toString("hex");
    }

    private getClientIP(request: NextRequest): string {
        const forwarded = request.headers.get("x-forwarded-for");
        if (forwarded) {
            const first = forwarded.split(",")[0]?.trim();
            if (first) {
                return first;
            }
        }

        const realIp = request.headers.get("x-real-ip");
        if (realIp) {
            return realIp;
        }

        const cfConnectingIp = request.headers.get("cf-connecting-ip");
        if (cfConnectingIp) {
            return cfConnectingIp;
        }

        return "unknown";
    }

    private checkAlertThresholds(event: SecurityEvent): void {
        const recentEvents = securityEvents.filter(
            (e) => e.timestamp.getTime() > Date.now() - 60 * 60 * 1000, // Last hour
        );

        const severityCounts = {
            low: recentEvents.filter((e) => e.severity === "LOW").length,
            medium: recentEvents.filter((e) => e.severity === "MEDIUM").length,
            high: recentEvents.filter((e) => e.severity === "HIGH").length,
            critical:
                recentEvents.filter((e) => e.severity === "CRITICAL").length,
        };

        // Check if thresholds are exceeded
        if (severityCounts.critical >= this.config.alertThresholds.critical) {
            this.sendAlert(
                "CRITICAL",
                `Critical security events threshold exceeded: ${severityCounts.critical}`,
            );
        } else if (severityCounts.high >= this.config.alertThresholds.high) {
            this.sendAlert(
                "HIGH",
                `High severity security events threshold exceeded: ${severityCounts.high}`,
            );
        } else if (
            severityCounts.medium >= this.config.alertThresholds.medium
        ) {
            this.sendAlert(
                "MEDIUM",
                `Medium severity security events threshold exceeded: ${severityCounts.medium}`,
            );
        } else if (severityCounts.low >= this.config.alertThresholds.low) {
            this.sendAlert(
                "LOW",
                `Low severity security events threshold exceeded: ${severityCounts.low}`,
            );
        }
    }

    private updateUserBehaviorPattern(
        userId: string,
        event: SecurityEvent,
    ): void {
        const pattern = userBehaviorPatterns.get(userId) || {
            lastLogin: new Date(),
            locations: [],
            devices: [],
        };

        pattern.lastLogin = new Date();

        const location = this.getLocationFromIP(event.ipAddress);
        if (location && !pattern.locations.includes(location)) {
            pattern.locations.push(location);
        }

        const device = this.getDeviceFromUserAgent(event.userAgent);
        if (device && !pattern.devices.includes(device)) {
            pattern.devices.push(device);
        }

        userBehaviorPatterns.set(userId, pattern);
    }

    private getLocationFromIP(ipAddress: string): string {
        // In a real implementation, you'd use a geolocation service like MaxMind
        // For now, return a mock location
        return `Location-${ipAddress.split(".").slice(0, 2).join(".")}`;
    }

    private isLocationNearby(location1: string, location2: string): boolean {
        // In a real implementation, you'd calculate actual distance
        // For now, return true if locations are similar
        return location1 === location2;
    }

    private getDeviceFromUserAgent(userAgent: string): string {
        // Simple device detection
        if (userAgent.includes("Mobile")) {
            return "Mobile";
        } else if (userAgent.includes("Tablet")) {
            return "Tablet";
        } else {
            return "Desktop";
        }
    }

    private sendAlert(severity: SecuritySeverity, message: string): void {
        // In production, send to monitoring service (e.g., PagerDuty, Slack, etc.)
        console.log(`SECURITY ALERT [${severity}]: ${message}`);

        // You could also send emails, SMS, or webhooks here
        if (process.env.SECURITY_WEBHOOK_URL) {
            // Send webhook notification
            fetch(process.env.SECURITY_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    severity,
                    message,
                    timestamp: new Date().toISOString(),
                }),
            }).catch(console.error);
        }
    }
}

// Export singleton instance
export const securityMonitor = new SecurityMonitor();
