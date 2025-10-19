#!/usr/bin/env tsx

/**
 * ProofOfFit Architectural Audit Script
 *
 * Scans the repository for required modules and reports compliance
 * with the ProofOfFit architectural doctrine:
 * - Trust Engine (verifiable reputation & reliability metrics)
 * - FitScore Intelligence (calibrated, explainable, bias-checked matching)
 * - Ethical Infrastructure (GDPR/CCPA compliance, consent logs, transparency)
 * - Coverage Architecture (lawful job ingestion via providers)
 * - Operational Armor (rate limiting, circuit breakers, fallback logic)
 * - Observability & Security (metrics, RBAC admin views, redacted logs)
 * - CI Guardrails (automated audit enforcing all invariants)
 */

import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, resolve } from "path";
import { execSync } from "child_process";

interface AuditResult {
    category: string;
    check: string;
    status: "PASS" | "FAIL" | "WARN";
    file?: string;
    line?: number;
    message: string;
    critical: boolean;
}

interface AuditSummary {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    critical_failures: number;
    score: number;
}

class ProofOfFitAuditor {
    private results: AuditResult[] = [];
    private rootDir: string;
    private appsDir: string;
    private packagesDir: string;

    constructor() {
        this.rootDir = resolve(process.cwd());
        this.appsDir = join(this.rootDir, "apps");
        this.packagesDir = join(this.rootDir, "packages");
    }

    private addResult(
        category: string,
        check: string,
        status: "PASS" | "FAIL" | "WARN",
        message: string,
        critical: boolean = false,
        file?: string,
        line?: number,
    ) {
        this.results.push({
            category,
            check,
            status,
            message,
            critical,
            file,
            line,
        });
    }

    private findFiles(pattern: RegExp, dir: string = this.rootDir): string[] {
        const files: string[] = [];

        const scanDir = (currentDir: string) => {
            if (!existsSync(currentDir)) return;

            const items = readdirSync(currentDir);
            for (const item of items) {
                const fullPath = join(currentDir, item);
                const stat = statSync(fullPath);

                if (stat.isDirectory()) {
                    // Skip node_modules and other irrelevant directories
                    if (
                        !["node_modules", ".git", ".next", "dist", "build"]
                            .includes(item)
                    ) {
                        scanDir(fullPath);
                    }
                } else if (stat.isFile() && pattern.test(item)) {
                    files.push(fullPath);
                }
            }
        };

        scanDir(dir);
        return files;
    }

    private readFileContent(filePath: string): string {
        try {
            return readFileSync(filePath, "utf-8");
        } catch {
            return "";
        }
    }

    private searchInFiles(
        pattern: RegExp,
        files: string[],
    ): { file: string; matches: number }[] {
        const results: { file: string; matches: number }[] = [];

        for (const file of files) {
            const content = this.readFileContent(file);
            const matches = (content.match(pattern) || []).length;
            if (matches > 0) {
                results.push({ file, matches });
            }
        }

        return results;
    }

    // Step 1: Provider Architecture Audit
    private auditProviderArchitecture() {
        const category = "Provider Architecture";

        // Check for JobProvider interface
        const providerFiles = this.findFiles(/provider|jobs\.ts|domain/);
        // Also check server/providers directory specifically
        const serverProviderFiles = this.findFiles(
            /.*/,
            join(this.rootDir, "server", "providers"),
        );
        const allProviderFiles = [...providerFiles, ...serverProviderFiles];

        const hasJobProvider = allProviderFiles.some((file) => {
            const content = this.readFileContent(file);
            return /interface\s+JobProvider|type\s+JobProvider|export.*JobProvider/
                .test(content);
        });

        this.addResult(
            category,
            "JobProvider Interface",
            hasJobProvider ? "PASS" : "FAIL",
            hasJobProvider
                ? "JobProvider interface found"
                : "JobProvider interface missing",
            true,
        );

        // Check for Provider Factory
        const hasProviderFactory = allProviderFiles.some((file) => {
            const content = this.readFileContent(file);
            return /getJobProvider|ProviderFactory|createProvider/.test(
                content,
            );
        });

        this.addResult(
            category,
            "Provider Factory",
            hasProviderFactory ? "PASS" : "FAIL",
            hasProviderFactory
                ? "Provider factory found"
                : "Provider factory missing",
            true,
        );

        // Check for SeedProvider
        const hasSeedProvider = allProviderFiles.some((file) => {
            const content = this.readFileContent(file);
            return /SeedProvider|seed.*provider/i.test(content);
        });

        this.addResult(
            category,
            "SeedProvider Implementation",
            hasSeedProvider ? "PASS" : "FAIL",
            hasSeedProvider ? "SeedProvider found" : "SeedProvider missing",
            true,
        );

        // Check for SafeProvider/Circuit Breaker
        const hasSafeProvider = allProviderFiles.some((file) => {
            const content = this.readFileContent(file);
            return /SafeProvider|CircuitBreaker|circuit.*breaker/i.test(
                content,
            );
        });

        this.addResult(
            category,
            "Circuit Breaker/SafeProvider",
            hasSafeProvider ? "PASS" : "WARN",
            hasSafeProvider
                ? "Circuit breaker found"
                : "Circuit breaker missing",
            false,
        );
    }

    // Step 2: FitScore Intelligence Audit
    private auditFitScoreIntelligence() {
        const category = "FitScore Intelligence";

        // Check for FitScore implementation
        const fitScoreFiles = this.findFiles(/fitscore|matching|score/i);
        const hasFitScore = fitScoreFiles.some((file) => {
            const content = this.readFileContent(file);
            return /FitScore|fitScore|calculateScore|matching.*score/i.test(
                content,
            );
        });

        this.addResult(
            category,
            "FitScore Implementation",
            hasFitScore ? "PASS" : "FAIL",
            hasFitScore
                ? "FitScore implementation found"
                : "FitScore implementation missing",
            true,
        );

        // Check for explainability
        const hasExplainability = fitScoreFiles.some((file) => {
            const content = this.readFileContent(file);
            return /explain|explanation|breakdown|reasoning/i.test(content);
        });

        this.addResult(
            category,
            "Explainability Functions",
            hasExplainability ? "PASS" : "WARN",
            hasExplainability
                ? "Explainability functions found"
                : "Explainability functions missing",
            false,
        );

        // Check for bias checking
        const hasBiasChecking = fitScoreFiles.some((file) => {
            const content = this.readFileContent(file);
            return /bias|fairness|discrimination|equity/i.test(content);
        });

        this.addResult(
            category,
            "Bias Checking",
            hasBiasChecking ? "PASS" : "WARN",
            hasBiasChecking ? "Bias checking found" : "Bias checking missing",
            false,
        );

        // Check for calibration
        const hasCalibration = fitScoreFiles.some((file) => {
            const content = this.readFileContent(file);
            return /calibrat|logistic|sigmoid|normalize/i.test(content);
        });

        this.addResult(
            category,
            "Score Calibration",
            hasCalibration ? "PASS" : "WARN",
            hasCalibration
                ? "Score calibration found"
                : "Score calibration missing",
            false,
        );
    }

    // Step 3: Ethical Infrastructure Audit
    private auditEthicalInfrastructure() {
        const category = "Ethical Infrastructure";

        // Check for consent management
        const consentFiles = this.findFiles(/consent|privacy|gdpr|ccpa/i);
        // Also check server/middleware directory for compliance middleware
        const middlewareFiles = this.findFiles(
            /.*/,
            join(this.rootDir, "server", "middleware"),
        );
        const allConsentFiles = [...consentFiles, ...middlewareFiles];

        const hasConsentManagement = allConsentFiles.some((file) => {
            const content = this.readFileContent(file);
            return /consent.*event|policy.*version|consent.*log/i.test(content);
        });

        this.addResult(
            category,
            "Consent Management",
            hasConsentManagement ? "PASS" : "FAIL",
            hasConsentManagement
                ? "Consent management found"
                : "Consent management missing",
            true,
        );

        // Check for GDPR/CCPA compliance
        const hasCompliance = allConsentFiles.some((file) => {
            const content = this.readFileContent(file);
            return /GDPR|CCPA|data.*protection|privacy.*policy/i.test(content);
        });

        this.addResult(
            category,
            "GDPR/CCPA Compliance",
            hasCompliance ? "PASS" : "WARN",
            hasCompliance
                ? "GDPR/CCPA compliance found"
                : "GDPR/CCPA compliance missing",
            false,
        );

        // Check for transparency features
        const hasTransparency = allConsentFiles.some((file) => {
            const content = this.readFileContent(file);
            return /transparency|audit.*log|data.*usage|privacy.*dashboard/i
                .test(content);
        });

        this.addResult(
            category,
            "Transparency Features",
            hasTransparency ? "PASS" : "WARN",
            hasTransparency
                ? "Transparency features found"
                : "Transparency features missing",
            false,
        );

        // Check for pay disclosure
        const hasPayDisclosure = allConsentFiles.some((file) => {
            const content = this.readFileContent(file);
            return /pay.*disclosure|salary.*transparency|compensation.*disclosure/i
                .test(content);
        });

        this.addResult(
            category,
            "Pay Disclosure",
            hasPayDisclosure ? "PASS" : "WARN",
            hasPayDisclosure
                ? "Pay disclosure found"
                : "Pay disclosure missing",
            false,
        );
    }

    // Step 4: Operational Armor Audit
    private auditOperationalArmor() {
        const category = "Operational Armor";

        // Check for rate limiting
        const rateLimitFiles = this.findFiles(/rate.*limit|ratelimit/i);
        // Also check server/middleware directory for rate limiting middleware
        const middlewareFiles = this.findFiles(
            /.*/,
            join(this.rootDir, "server", "middleware"),
        );
        const allRateLimitFiles = [...rateLimitFiles, ...middlewareFiles];
        const hasRateLimiting = allRateLimitFiles.length > 0;

        this.addResult(
            category,
            "Rate Limiting",
            hasRateLimiting ? "PASS" : "FAIL",
            hasRateLimiting ? "Rate limiting found" : "Rate limiting missing",
            true,
        );

        // Check for circuit breakers
        const hasCircuitBreakers = allRateLimitFiles.some((file) => {
            const content = this.readFileContent(file);
            return /circuit.*breaker|fallback|retry.*logic/i.test(content);
        });

        this.addResult(
            category,
            "Circuit Breakers",
            hasCircuitBreakers ? "PASS" : "WARN",
            hasCircuitBreakers
                ? "Circuit breakers found"
                : "Circuit breakers missing",
            false,
        );

        // Check for telemetry
        const telemetryFiles = this.findFiles(/telemetry|metrics|monitoring/i);
        // Also check server/observability directory
        const observabilityFiles = this.findFiles(
            /.*/,
            join(this.rootDir, "server", "observability"),
        );
        const allTelemetryFiles = [...telemetryFiles, ...observabilityFiles];
        const hasTelemetry = allTelemetryFiles.length > 0;

        this.addResult(
            category,
            "Telemetry",
            hasTelemetry ? "PASS" : "WARN",
            hasTelemetry ? "Telemetry found" : "Telemetry missing",
            false,
        );

        // Check for auditability
        const hasAuditability = allTelemetryFiles.some((file) => {
            const content = this.readFileContent(file);
            return /audit.*log|event.*log|action.*log/i.test(content);
        });

        this.addResult(
            category,
            "Auditability",
            hasAuditability ? "PASS" : "WARN",
            hasAuditability
                ? "Auditability features found"
                : "Auditability features missing",
            false,
        );
    }

    // Step 5: Observability & Security Audit
    private auditObservabilitySecurity() {
        const category = "Observability & Security";

        // Check for admin RBAC
        const adminFiles = this.findFiles(/admin|rbac|role/i);
        // Also check apps/web/app/api/admin directory
        const apiAdminFiles = this.findFiles(
            /.*/,
            join(this.rootDir, "apps", "web", "app", "api", "admin"),
        );
        const allAdminFiles = [...adminFiles, ...apiAdminFiles];

        const hasAdminRBAC = allAdminFiles.some((file) => {
            const content = this.readFileContent(file);
            return /admin.*role|rbac|role.*based|permission/i.test(content);
        });

        this.addResult(
            category,
            "Admin RBAC",
            hasAdminRBAC ? "PASS" : "WARN",
            hasAdminRBAC ? "Admin RBAC found" : "Admin RBAC missing",
            false,
        );

        // Check for log redaction
        const hasLogRedaction = allAdminFiles.some((file) => {
            const content = this.readFileContent(file);
            return /redact|sanitize|pii.*removal/i.test(content);
        });

        this.addResult(
            category,
            "Log Redaction",
            hasLogRedaction ? "PASS" : "WARN",
            hasLogRedaction ? "Log redaction found" : "Log redaction missing",
            false,
        );

        // Check for CSV/URL sanitization
        const hasSanitization = allAdminFiles.some((file) => {
            const content = this.readFileContent(file);
            return /csv.*sanitize|url.*sanitize|input.*validation/i.test(
                content,
            );
        });

        this.addResult(
            category,
            "CSV/URL Sanitization",
            hasSanitization ? "PASS" : "WARN",
            hasSanitization
                ? "CSV/URL sanitization found"
                : "CSV/URL sanitization missing",
            false,
        );

        // Check for golden signals
        const hasGoldenSignals = allAdminFiles.some((file) => {
            const content = this.readFileContent(file);
            return /latency|error.*rate|throughput|availability/i.test(content);
        });

        this.addResult(
            category,
            "Golden Signals",
            hasGoldenSignals ? "PASS" : "WARN",
            hasGoldenSignals
                ? "Golden signals found"
                : "Golden signals missing",
            false,
        );
    }

    // Step 6: Salary Detection Audit
    private auditSalaryDetection() {
        const category = "Salary Detection";

        // Check for salary detector
        const salaryFiles = this.findFiles(/salary|compensation|pay/i);
        // Also check server/lib directory for salary detector
        const libFiles = this.findFiles(
            /.*/,
            join(this.rootDir, "server", "lib"),
        );
        const allSalaryFiles = [...salaryFiles, ...libFiles];

        const hasSalaryDetector = allSalaryFiles.some((file) => {
            const content = this.readFileContent(file);
            return /salary.*detect|compensation.*parse|pay.*range/i.test(
                content,
            );
        });

        this.addResult(
            category,
            "Salary Detector",
            hasSalaryDetector ? "PASS" : "WARN",
            hasSalaryDetector
                ? "Salary detector found"
                : "Salary detector missing",
            false,
        );

        // Check for currency support
        const hasCurrencySupport = allSalaryFiles.some((file) => {
            const content = this.readFileContent(file);
            return /\$|€|£|currency|usd|eur|gbp/i.test(content);
        });

        this.addResult(
            category,
            "Currency Support",
            hasCurrencySupport ? "PASS" : "WARN",
            hasCurrencySupport
                ? "Currency support found"
                : "Currency support missing",
            false,
        );

        // Check for unit inference
        const hasUnitInference = allSalaryFiles.some((file) => {
            const content = this.readFileContent(file);
            return /hour|hr|year|annual|monthly|unit.*inference/i.test(content);
        });

        this.addResult(
            category,
            "Unit Inference",
            hasUnitInference ? "PASS" : "WARN",
            hasUnitInference
                ? "Unit inference found"
                : "Unit inference missing",
            false,
        );
    }

    // Step 7: Database Schema Audit
    private auditDatabaseSchema() {
        const category = "Database Schema";

        // Check for migrations
        const migrationFiles = this.findFiles(/migration|schema|sql/i);
        const hasMigrations = migrationFiles.length > 0;

        this.addResult(
            category,
            "Database Migrations",
            hasMigrations ? "PASS" : "WARN",
            hasMigrations
                ? "Database migrations found"
                : "Database migrations missing",
            false,
        );

        // Check for required tables
        const hasRequiredTables = migrationFiles.some((file) => {
            const content = this.readFileContent(file);
            return /jobs|consent.*event|work.*event|policy.*registry/i.test(
                content,
            );
        });

        this.addResult(
            category,
            "Required Tables",
            hasRequiredTables ? "PASS" : "WARN",
            hasRequiredTables
                ? "Required tables found"
                : "Required tables missing",
            false,
        );
    }

    // Step 8: CI Guardrails Audit
    private auditCIGuardrails() {
        const category = "CI Guardrails";

        // Check for GitHub Actions
        const ciFiles = this.findFiles(
            /\.yml$|\.yaml$/,
            join(this.rootDir, ".github"),
        );
        const hasCIConfig = ciFiles.length > 0;

        this.addResult(
            category,
            "CI Configuration",
            hasCIConfig ? "PASS" : "WARN",
            hasCIConfig ? "CI configuration found" : "CI configuration missing",
            false,
        );

        // Check for audit script integration
        const hasAuditIntegration = ciFiles.some((file) => {
            const content = this.readFileContent(file);
            return /audit|npm.*run.*audit/i.test(content);
        });

        this.addResult(
            category,
            "Audit Integration",
            hasAuditIntegration ? "PASS" : "WARN",
            hasAuditIntegration
                ? "Audit integration found"
                : "Audit integration missing",
            false,
        );
    }

    // Run all audits
    public runAudit(): AuditSummary {
        console.log("🔍 Starting ProofOfFit Architectural Audit...\n");

        this.auditProviderArchitecture();
        this.auditFitScoreIntelligence();
        this.auditEthicalInfrastructure();
        this.auditOperationalArmor();
        this.auditObservabilitySecurity();
        this.auditSalaryDetection();
        this.auditDatabaseSchema();
        this.auditCIGuardrails();

        return this.generateSummary();
    }

    private generateSummary(): AuditSummary {
        const total = this.results.length;
        const passed = this.results.filter((r) => r.status === "PASS").length;
        const failed = this.results.filter((r) => r.status === "FAIL").length;
        const warnings = this.results.filter((r) => r.status === "WARN").length;
        const critical_failures =
            this.results.filter((r) => r.critical && r.status === "FAIL")
                .length;
        const score = Math.round((passed / total) * 100);

        return {
            total,
            passed,
            failed,
            warnings,
            critical_failures,
            score,
        };
    }

    public printResults() {
        console.log("📊 AUDIT RESULTS\n");
        console.log("=".repeat(80));

        // Group results by category
        const categories = [...new Set(this.results.map((r) => r.category))];

        for (const category of categories) {
            const categoryResults = this.results.filter((r) =>
                r.category === category
            );
            console.log(`\n📁 ${category}`);
            console.log("-".repeat(40));

            for (const result of categoryResults) {
                const icon = result.status === "PASS"
                    ? "✅"
                    : result.status === "FAIL"
                    ? "❌"
                    : "⚠️";
                const critical = result.critical ? " [CRITICAL]" : "";
                console.log(`${icon} ${result.check}${critical}`);
                console.log(`   ${result.message}`);
                if (result.file) {
                    console.log(`   📄 ${result.file}`);
                }
                console.log();
            }
        }

        const summary = this.generateSummary();
        console.log("=".repeat(80));
        console.log("📈 SUMMARY");
        console.log("=".repeat(80));
        console.log(`Total Checks: ${summary.total}`);
        console.log(`✅ Passed: ${summary.passed}`);
        console.log(`❌ Failed: ${summary.failed}`);
        console.log(`⚠️  Warnings: ${summary.warnings}`);
        console.log(`🚨 Critical Failures: ${summary.critical_failures}`);
        console.log(`📊 Audit Score: ${summary.score}%`);

        if (summary.critical_failures > 0) {
            console.log("\n🚨 CRITICAL FAILURES DETECTED - BUILD SHOULD FAIL");
            process.exit(1);
        } else if (summary.failed > 0) {
            console.log(
                "\n⚠️  NON-CRITICAL FAILURES DETECTED - BUILD SHOULD WARN",
            );
            process.exit(0);
        } else {
            console.log("\n✅ ALL CHECKS PASSED - BUILD SUCCESSFUL");
            process.exit(0);
        }
    }

    public exportJSON(): string {
        const summary = this.generateSummary();
        return JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                summary,
                results: this.results,
            },
            null,
            2,
        );
    }
}

// Main execution
if (require.main === module) {
    const auditor = new ProofOfFitAuditor();
    auditor.runAudit();
    auditor.printResults();

    // Export JSON for CI/CD integration
    const jsonOutput = auditor.exportJSON();
    require("fs").writeFileSync("audit-results.json", jsonOutput);
    console.log("\n📄 Detailed results exported to audit-results.json");
}

export { ProofOfFitAuditor };
