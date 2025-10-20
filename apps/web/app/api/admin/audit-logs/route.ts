import { NextRequest, NextResponse } from "next/server";
import { auditLogger } from "@/lib/audit/audit-log";
import { withRateLimit } from "@/lib/audit/rate-limit";
import { RATE_LIMIT_CONFIGS } from "@/lib/audit/rate-limit";

// Apply rate limiting to admin endpoints
const rateLimitedHandler = withRateLimit(RATE_LIMIT_CONFIGS.STRICT);

export const GET = rateLimitedHandler(async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);

        // Parse query parameters
        const userId = searchParams.get("userId") || undefined;
        const action = searchParams.get("action") || undefined;
        const resource = searchParams.get("resource") || undefined;
        const startDate = searchParams.get("startDate")
            ? new Date(searchParams.get("startDate")!)
            : undefined;
        const endDate = searchParams.get("endDate")
            ? new Date(searchParams.get("endDate")!)
            : undefined;
        const limit = searchParams.get("limit")
            ? parseInt(searchParams.get("limit")!)
            : undefined;

        // Validate parameters
        if (limit && (limit < 1 || limit > 1000)) {
            return NextResponse.json(
                { error: "Limit must be between 1 and 1000" },
                { status: 400 },
            );
        }

        if (startDate && isNaN(startDate.getTime())) {
            return NextResponse.json(
                { error: "Invalid startDate format" },
                { status: 400 },
            );
        }

        if (endDate && isNaN(endDate.getTime())) {
            return NextResponse.json(
                { error: "Invalid endDate format" },
                { status: 400 },
            );
        }

        // Get filtered audit logs
        const logs = auditLogger.getLogs({
            userId,
            action,
            resource,
            startDate,
            endDate,
            limit,
        });

        return NextResponse.json({
            success: true,
            data: {
                logs,
                count: logs.length,
                filters: {
                    userId,
                    action,
                    resource,
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString(),
                    limit,
                },
            },
        });
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
});
