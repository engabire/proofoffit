import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";

export async function POST(req: NextRequest) {
    try {
        const { endpoint } = await req.json();

        if (!endpoint) {
            return NextResponse.json(
                { error: "Endpoint is required" },
                { status: 400 },
            );
        }

        // In a real application, you would:
        // 1. Find the subscription in your database
        // 2. Remove it from the database
        // 3. Clean up any associated data

        // Log unsubscription (in production, remove from database)
        logger.info("Push subscription removed:", {
            endpoint,
            timestamp: new Date().toISOString(),
        });

        // In a real application, you would remove this from your database
        // await db.pushSubscriptions.delete({
        //   where: { endpoint }
        // });

        return NextResponse.json({
            success: true,
            message: "Subscription removed successfully",
        });
    } catch (error) {
        logger.error("Error removing push subscription:", error);
        return NextResponse.json(
            { error: "Failed to remove subscription" },
            { status: 500 },
        );
    }
}
