import { NextRequest, NextResponse } from "next/server";
import { securityMonitor } from "@/lib/security/security-monitor";
import { requireUserId } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        await requireUserId(); // Ensure user is authenticated

        const { searchParams } = new URL(request.url);
        const action = searchParams.get("action");

        switch (action) {
            case "events":
                const filters = {
                    userId: searchParams.get("userId") || undefined,
                    ipAddress: searchParams.get("ipAddress") || undefined,
                    type: searchParams.get("type") as any || undefined,
                    severity: searchParams.get("severity") as any || undefined,
                    resolved: searchParams.get("resolved") === "true"
                        ? true
                        : searchParams.get("resolved") === "false"
                        ? false
                        : undefined,
                    limit: parseInt(searchParams.get("limit") || "50"),
                };

                const events = securityMonitor.getSecurityEvents(filters);
                return NextResponse.json({ success: true, data: events });

            case "stats":
                const stats = securityMonitor.getSecurityStats();
                return NextResponse.json({ success: true, data: stats });

            case "check-ip":
                const ipAddress = searchParams.get("ip");
                if (!ipAddress) {
                    return NextResponse.json({
                        error: "IP address is required",
                    }, { status: 400 });
                }

                const isBlocked = securityMonitor.isIPBlocked(ipAddress);
                const isSuspicious = securityMonitor.isIPSuspicious(ipAddress);

                return NextResponse.json({
                    success: true,
                    data: {
                        ipAddress,
                        isBlocked,
                        isSuspicious,
                    },
                });

            default:
                return NextResponse.json({ error: "Invalid action" }, {
                    status: 400,
                });
        }
    } catch (error) {
        console.error("Error in security API:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch security data",
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
        await requireUserId(); // Ensure user is authenticated

        const body = await request.json();
        const { action, data } = body;

        switch (action) {
            case "resolve-event":
                const { eventId, resolvedBy } = data;
                if (!eventId || !resolvedBy) {
                    return NextResponse.json({
                        error: "eventId and resolvedBy are required",
                    }, { status: 400 });
                }

                const success = securityMonitor.resolveEvent(
                    eventId,
                    resolvedBy,
                );
                return NextResponse.json({
                    success,
                    data: { eventId, resolved: success },
                });

            case "unblock-ip":
                const { ipAddress } = data;
                if (!ipAddress) {
                    return NextResponse.json(
                        { error: "ipAddress is required" },
                        { status: 400 },
                    );
                }

                const unblockSuccess = securityMonitor.unblockIP(ipAddress);
                return NextResponse.json({
                    success: unblockSuccess,
                    data: { ipAddress, unblocked: unblockSuccess },
                });

            case "log-event":
                const { type, severity, source, details, userId } = data;
                if (!type || !severity || !source || !details) {
                    return NextResponse.json({
                        error: "Missing required fields",
                    }, { status: 400 });
                }

                securityMonitor.logEvent(
                    type,
                    severity,
                    source,
                    details,
                    request,
                    userId,
                );
                return NextResponse.json({
                    success: true,
                    data: { message: "Event logged successfully" },
                });

            default:
                return NextResponse.json({ error: "Invalid action" }, {
                    status: 400,
                });
        }
    } catch (error) {
        console.error("Error in security API:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to process security action",
                details: error instanceof Error
                    ? error.message
                    : "Unknown error",
            },
            { status: 500 },
        );
    }
}

