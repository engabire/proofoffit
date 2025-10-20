import { NextRequest, NextResponse } from "next/server";
import { auditLogger } from "@/lib/audit/audit-log";
import { withRateLimit } from "@/lib/audit/rate-limit";
import { RATE_LIMIT_CONFIGS } from "@/lib/audit/rate-limit";

// Apply rate limiting to admin endpoints
const rateLimitedHandler = withRateLimit(RATE_LIMIT_CONFIGS.STRICT);

export const GET = rateLimitedHandler(async (req: NextRequest) => {
    try {
        const stats = auditLogger.getStats();

        return NextResponse.json({
            success: true,
            data: {
                ...stats,
                // Add additional computed statistics
                averageEntriesPerDay: stats.totalEntries > 0
                    ? Math.round(
                        stats.totalEntries /
                            Math.max(
                                1,
                                Math.ceil(
                                    (Date.now() -
                                        new Date("2024-01-01").getTime()) /
                                        (1000 * 60 * 60 * 24),
                                ),
                            ),
                    )
                    : 0,
                topActions: Object.entries(stats.entriesByAction)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([action, count]) => ({ action, count })),
                topResources: Object.entries(stats.entriesByResource)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([resource, count]) => ({ resource, count })),
                topUsers: Object.entries(stats.entriesByUser)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([userId, count]) => ({ userId, count })),
            },
        });
    } catch (error) {
        console.error("Error fetching audit log stats:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
});
