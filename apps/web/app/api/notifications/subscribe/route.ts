import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const headersList = await headers();
        const userAgent = headersList.get("user-agent") || "unknown";
        const ip = headersList.get("x-forwarded-for") ||
            headersList.get("x-real-ip") ||
            "unknown";

        const { subscription, userAgent: clientUserAgent, timestamp } =
            await req.json();

        // Validate subscription data
        if (!subscription || !subscription.endpoint) {
            return NextResponse.json(
                { error: "Invalid subscription data" },
                { status: 400 },
            );
        }

        // In a real application, you would:
        // 1. Store the subscription in your database
        // 2. Associate it with a user account
        // 3. Set up notification preferences

        const subscriptionData = {
            endpoint: subscription.endpoint,
            keys: subscription.keys,
            userAgent: clientUserAgent || userAgent,
            ip,
            timestamp: timestamp || new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };

        // Log subscription (in production, store in database)
        console.log("Push subscription received:", {
            endpoint: subscription.endpoint,
            userAgent: subscriptionData.userAgent,
            timestamp: subscriptionData.timestamp,
        });

        // In a real application, you would store this in your database
        // await db.pushSubscriptions.create({
        //   data: subscriptionData
        // });

        return NextResponse.json({
            success: true,
            message: "Subscription saved successfully",
            subscriptionId: `sub_${Date.now()}`,
        });
    } catch (error) {
        console.error("Error saving push subscription:", error);
        return NextResponse.json(
            { error: "Failed to save subscription" },
            { status: 500 },
        );
    }
}
