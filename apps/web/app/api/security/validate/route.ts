import { NextRequest, NextResponse } from "next/server";
import { SecurityHardener } from "@/lib/security/security-hardening";

export async function GET(request: NextRequest) {
    try {
        // Only allow this endpoint in development or for admin users
        if (process.env.NODE_ENV === "production") {
            // In production, require admin authentication
            const authHeader = request.headers.get("authorization");
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return NextResponse.json(
                    { error: "Unauthorized" },
                    { status: 401 },
                );
            }
        }

        const validation = SecurityHardener.validateEnvironment();

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            security: {
                isValid: validation.isValid,
                errors: validation.errors,
                warnings: validation.warnings,
                criticalVarsCount: SecurityHardener["CRITICAL_ENV_VARS"].length,
                warningVarsCount: SecurityHardener["WARNING_ENV_VARS"].length,
            },
            recommendations: generateRecommendations(validation),
        });
    } catch (error) {
        console.error("Security validation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

function generateRecommendations(validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}): string[] {
    const recommendations: string[] = [];

    if (!validation.isValid) {
        recommendations.push(
            "CRITICAL: Fix all security errors before production deployment",
        );
        recommendations.push("Remove all hardcoded API keys and secrets");
        recommendations.push("Set all required environment variables");
    }

    if (validation.warnings.length > 0) {
        recommendations.push(
            "Review and configure optional environment variables",
        );
        recommendations.push(
            "Consider setting up monitoring for missing configuration",
        );
    }

    if (validation.isValid && validation.warnings.length === 0) {
        recommendations.push("Security configuration looks good!");
        recommendations.push(
            "Consider implementing additional security monitoring",
        );
        recommendations.push("Regular security audits are recommended");
    }

    return recommendations;
}
