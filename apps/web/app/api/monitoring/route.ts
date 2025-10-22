import { NextRequest, NextResponse } from "next/server";
import { monitoringEngine } from "@/lib/monitoring/monitoring-engine";
import { requireUserId } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        // Skip authentication for testing - in production, uncomment the line below
        // await requireUserId(); // Ensure user is authenticated

        const { searchParams } = new URL(request.url);
        const action = searchParams.get("action");

        switch (action) {
            case "dashboard":
                const dashboardData = monitoringEngine.getDashboardData();
                return NextResponse.json({
                    success: true,
                    data: dashboardData,
                });

            case "events":
                const filters = {
                    type: searchParams.get("type") as any || undefined,
                    severity: searchParams.get("severity") as any || undefined,
                    source: searchParams.get("source") || undefined,
                    limit: parseInt(searchParams.get("limit") || "50"),
                    since: searchParams.get("since")
                        ? new Date(searchParams.get("since")!)
                        : undefined,
                };

                const events = monitoringEngine.getEvents(filters);
                return NextResponse.json({ success: true, data: events });

            case "alerts":
                const alerts = monitoringEngine.getAlerts();
                return NextResponse.json({ success: true, data: alerts });

            case "alert-history":
                const alertHistory = monitoringEngine.getAlertHistory();
                return NextResponse.json({ success: true, data: alertHistory });

            case "performance-metrics":
                const performanceMetrics = monitoringEngine
                    .getPerformanceMetrics();
                return NextResponse.json({
                    success: true,
                    data: performanceMetrics,
                });

            case "business-metrics":
                const businessMetrics = monitoringEngine.getBusinessMetrics();
                return NextResponse.json({
                    success: true,
                    data: businessMetrics,
                });

            default:
                return NextResponse.json({ error: "Invalid action" }, {
                    status: 400,
                });
        }
    } catch (error) {
        console.error("Error in monitoring API:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch monitoring data",
                details: error instanceof Error
                    ? error.message
                    : "Unknown error",
            },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Skip authentication for testing - in production, uncomment the line below
        // await requireUserId(); // Ensure user is authenticated

        const body = await request.json();
        const { action, data } = body;

        switch (action) {
            case "log-event":
                const { type, severity, source, details, metrics, tags } = data;
                if (!type || !severity || !source || !details) {
                    return NextResponse.json({
                        error: "Missing required fields",
                    }, { status: 400 });
                }

                monitoringEngine.logEvent(
                    type,
                    severity,
                    source,
                    details,
                    metrics,
                    tags,
                );
                return NextResponse.json({
                    success: true,
                    data: { message: "Event logged successfully" },
                });

            case "create-alert":
                const {
                    name,
                    description,
                    condition,
                    severity: alertSeverity,
                    enabled,
                    cooldownMs,
                    notificationChannels,
                } = data;
                if (!name || !description || !condition || !alertSeverity) {
                    return NextResponse.json({
                        error: "Missing required fields",
                    }, { status: 400 });
                }

                const alertId = monitoringEngine.createAlert({
                    name,
                    description,
                    condition,
                    severity: alertSeverity,
                    enabled: enabled !== false,
                    cooldownMs: cooldownMs || 300000, // 5 minutes default
                    notificationChannels: notificationChannels || [],
                });
                return NextResponse.json({ success: true, data: { alertId } });

            case "update-alert":
                const { alertId: updateAlertId, updates } = data;
                if (!updateAlertId || !updates) {
                    return NextResponse.json({
                        error: "alertId and updates are required",
                    }, { status: 400 });
                }

                const updateSuccess = monitoringEngine.updateAlert(
                    updateAlertId,
                    updates,
                );
                return NextResponse.json({
                    success: updateSuccess,
                    data: { alertId: updateAlertId, updated: updateSuccess },
                });

            case "delete-alert":
                const { alertId: deleteAlertId } = data;
                if (!deleteAlertId) {
                    return NextResponse.json({ error: "alertId is required" }, {
                        status: 400,
                    });
                }

                const deleteSuccess = monitoringEngine.deleteAlert(
                    deleteAlertId,
                );
                return NextResponse.json({
                    success: deleteSuccess,
                    data: { alertId: deleteAlertId, deleted: deleteSuccess },
                });

            default:
                return NextResponse.json({ error: "Invalid action" }, {
                    status: 400,
                });
        }
    } catch (error) {
        console.error("Error in monitoring API:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to process monitoring action",
                details: error instanceof Error
                    ? error.message
                    : "Unknown error",
            },
            { status: 500 },
        );
    }
}
