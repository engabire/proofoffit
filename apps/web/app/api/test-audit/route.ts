import { NextRequest, NextResponse } from "next/server";
import { auditLogger, AUDIT_ACTIONS } from "@/lib/audit/audit-log";
import { consentLedger, CONSENT_ACTIONS } from "@/lib/audit/consent-ledger";

export async function POST(req: NextRequest) {
    try {
        // Create some test audit log entries
        const testAuditEntries = [
            {
                userId: "user-123",
                action: AUDIT_ACTIONS.USER_LOGIN,
                resource: "auth",
                resourceId: "session-456",
                details: { method: "email", provider: "supabase" },
                ipAddress: "192.168.1.100",
                userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            },
            {
                userId: "user-123",
                action: AUDIT_ACTIONS.PROFILE_UPDATE,
                resource: "profile",
                resourceId: "profile-789",
                details: { fields: ["name", "email"], method: "form" },
                ipAddress: "192.168.1.100",
                userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            },
            {
                userId: "user-456",
                action: AUDIT_ACTIONS.JOB_SAVE,
                resource: "job",
                resourceId: "job-101",
                details: { jobTitle: "Senior Developer", company: "TechCorp" },
                ipAddress: "192.168.1.200",
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            },
            {
                userId: "user-789",
                action: AUDIT_ACTIONS.APPLICATION_CREATE,
                resource: "application",
                resourceId: "app-202",
                details: { jobId: "job-101", status: "submitted" },
                ipAddress: "192.168.1.300",
                userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)",
            },
        ];

        // Create some test consent ledger entries
        const testConsentEntries = [
            {
                userId: "user-123",
                packageId: "package-001",
                consentId: "consent-001",
                action: CONSENT_ACTIONS.SUBMITTED,
                jobId: "job-101",
                metadata: { jobTitle: "Senior Developer", company: "TechCorp" },
            },
            {
                userId: "user-123",
                packageId: "package-001",
                consentId: "consent-002",
                action: CONSENT_ACTIONS.SUBMITTED,
                jobId: "job-102",
                metadata: { jobTitle: "Product Manager", company: "StartupXYZ" },
            },
            {
                userId: "user-456",
                packageId: "package-002",
                consentId: "consent-003",
                action: CONSENT_ACTIONS.FAILED,
                jobId: "job-103",
                metadata: { error: "Application form incomplete" },
            },
            {
                userId: "user-789",
                packageId: "package-003",
                consentId: "consent-004",
                action: CONSENT_ACTIONS.SKIPPED,
                jobId: "job-104",
                metadata: { reason: "Salary below minimum" },
            },
            {
                userId: "user-123",
                packageId: "package-001",
                consentId: "consent-005",
                action: CONSENT_ACTIONS.DUPLICATE,
                jobId: "job-101",
                metadata: { reason: "Already applied" },
            },
        ];

        // Create audit log entries
        const auditResults = testAuditEntries.map((entry) =>
            auditLogger.createEntry(entry)
        );

        // Create consent ledger entries
        const consentResults = testConsentEntries.map((entry) =>
            consentLedger.createEntry(entry)
        );

        return NextResponse.json({
            success: true,
            message: "Test data created successfully",
            data: {
                auditEntries: auditResults.length,
                consentEntries: consentResults.length,
                auditStats: auditLogger.getStats(),
                consentStats: consentLedger.getStats(),
            },
        });
    } catch (error) {
        console.error("Error creating test data:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
