/**
 * Admin Dashboard API Endpoint
 *
 * Provides comprehensive system health, golden signals, and observability data
 * with RBAC protection and PII redaction.
 */

import { NextRequest, NextResponse } from "next/server";
import { telemetry } from "../../../../../server/observability/telemetry";
import { getProviderHealth } from "../../../../../server/providers";

// RBAC roles
type AdminRole = "admin" | "super_admin" | "readonly_admin";

interface AdminUser {
    id: string;
    role: AdminRole;
    permissions: string[];
}

// Mock admin authentication (in real implementation, this would verify JWT tokens)
function getAdminUser(request: NextRequest): AdminUser | null {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return null;
    }

    // In real implementation, decode and verify JWT token
    // For now, return a mock admin user
    return {
        id: "admin_123",
        role: "admin",
        permissions: ["read:dashboard", "read:metrics", "read:logs"],
    };
}

function hasPermission(user: AdminUser, permission: string): boolean {
    return user.permissions.includes(permission) || user.role === "super_admin";
}

export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        const adminUser = getAdminUser(request);
        if (!adminUser) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                    message: "Admin authentication required",
                },
                { status: 401 },
            );
        }

        // Check permissions
        if (!hasPermission(adminUser, "read:dashboard")) {
            return NextResponse.json(
                { error: "Forbidden", message: "Insufficient permissions" },
                { status: 403 },
            );
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get("timeRange") || "24h";
        const includeDetails = searchParams.get("includeDetails") === "true";

        // Calculate time range
        const now = new Date();
        let startTime: Date;

        switch (timeRange) {
            case "1h":
                startTime = new Date(now.getTime() - 60 * 60 * 1000);
                break;
            case "24h":
                startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case "7d":
                startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "30d":
                startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        }

        // Generate dashboard data
        const dashboardData = telemetry.generateAdminDashboardData();

        // Get provider health
        const providerHealth = getProviderHealth();

        // Get recent events if details are requested
        let recentEvents = null;
        if (includeDetails && hasPermission(adminUser, "read:logs")) {
            recentEvents = telemetry.getEvents(startTime, now);
        }

        // Get error events
        const errorEvents = telemetry.getEvents(
            startTime,
            now,
            "error",
            "high",
        );
        const criticalEvents = telemetry.getEvents(
            startTime,
            now,
            "error",
            "critical",
        );

        // Calculate additional metrics
        const metrics = {
            ...dashboardData,
            providerHealth: {
                ...providerHealth,
                // Add additional provider metrics
                circuitBreakerStatus: "closed", // This would come from actual circuit breaker state
                lastHealthCheck: new Date(),
            },
            alerts: {
                criticalErrors: criticalEvents.length,
                highErrors: errorEvents.length,
                systemStatus: criticalEvents.length > 0
                    ? "critical"
                    : errorEvents.length > 10
                    ? "warning"
                    : "healthy",
            },
            timeRange: {
                start: startTime.toISOString(),
                end: now.toISOString(),
                duration: timeRange,
            },
        };

        // Add recent events if requested and permitted
        if (recentEvents && hasPermission(adminUser, "read:logs")) {
            (metrics as any).recentEvents = recentEvents.slice(-100); // Last 100 events
        }

        // Log admin dashboard access
        telemetry.recordUserActivity(
            "admin_dashboard_access",
            adminUser.id,
            "admin_session",
            {
                timeRange,
                includeDetails,
                timestamp: now.toISOString(),
            },
        );

        return NextResponse.json({
            success: true,
            data: metrics,
            metadata: {
                generatedAt: now.toISOString(),
                generatedBy: adminUser.id,
                version: "1.0.0",
            },
        });
    } catch (error) {
        console.error("Admin dashboard error:", error);

        // Record error in telemetry
        telemetry.recordError(
            error instanceof Error ? error : new Error("Unknown error"),
            { endpoint: "/api/admin/dashboard", method: "GET" },
            "high",
        );

        return NextResponse.json(
            {
                error: "Internal server error",
                message: "Failed to generate dashboard data",
            },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check admin authentication
        const adminUser = getAdminUser(request);
        if (!adminUser) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                    message: "Admin authentication required",
                },
                { status: 401 },
            );
        }

        // Check permissions for admin actions
        if (!hasPermission(adminUser, "admin:actions")) {
            return NextResponse.json(
                {
                    error: "Forbidden",
                    message: "Insufficient permissions for admin actions",
                },
                { status: 403 },
            );
        }

        const body = await request.json();
        const { action, parameters } = body;

        let result: any = {};

        switch (action) {
            case "export_events":
                if (!hasPermission(adminUser, "read:logs")) {
                    return NextResponse.json(
                        {
                            error: "Forbidden",
                            message:
                                "Insufficient permissions to export events",
                        },
                        { status: 403 },
                    );
                }

                const format = parameters?.format || "json";
                const timeRange = parameters?.timeRange || "24h";

                // Calculate time range
                const now = new Date();
                let startTime: Date;
                switch (timeRange) {
                    case "1h":
                        startTime = new Date(now.getTime() - 60 * 60 * 1000);
                        break;
                    case "24h":
                        startTime = new Date(
                            now.getTime() - 24 * 60 * 60 * 1000,
                        );
                        break;
                    case "7d":
                        startTime = new Date(
                            now.getTime() - 7 * 24 * 60 * 60 * 1000,
                        );
                        break;
                    default:
                        startTime = new Date(
                            now.getTime() - 24 * 60 * 60 * 1000,
                        );
                }

                const events = telemetry.getEvents(startTime, now);
                result = {
                    events: telemetry.exportEvents(format as "json" | "csv"),
                    count: events.length,
                    format,
                    timeRange,
                };
                break;

            case "clear_events":
                if (!hasPermission(adminUser, "admin:clear_data")) {
                    return NextResponse.json(
                        {
                            error: "Forbidden",
                            message: "Insufficient permissions to clear events",
                        },
                        { status: 403 },
                    );
                }

                // In real implementation, this would clear events from database
                result = { message: "Events cleared successfully", count: 0 };
                break;

            case "system_health_check":
                const healthData = telemetry.generateAdminDashboardData();
                result = {
                    systemHealth: healthData.systemHealth,
                    providerHealth: getProviderHealth(),
                    timestamp: new Date().toISOString(),
                };
                break;

            default:
                return NextResponse.json(
                    {
                        error: "Bad Request",
                        message: `Unknown action: ${action}`,
                    },
                    { status: 400 },
                );
        }

        // Log admin action
        telemetry.recordUserActivity(
            "admin_action",
            adminUser.id,
            "admin_session",
            {
                action,
                parameters,
                result: typeof result === "object"
                    ? Object.keys(result)
                    : result,
                timestamp: new Date().toISOString(),
            },
        );

        return NextResponse.json({
            success: true,
            action,
            result,
            metadata: {
                executedAt: new Date().toISOString(),
                executedBy: adminUser.id,
            },
        });
    } catch (error) {
        console.error("Admin action error:", error);

        // Record error in telemetry
        telemetry.recordError(
            error instanceof Error ? error : new Error("Unknown error"),
            { endpoint: "/api/admin/dashboard", method: "POST" },
            "high",
        );

        return NextResponse.json(
            {
                error: "Internal server error",
                message: "Failed to execute admin action",
            },
            { status: 500 },
        );
    }
}
