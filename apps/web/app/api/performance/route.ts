import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const headersList = await headers();
        const userAgent = headersList.get("user-agent") || "unknown";
        const ip = headersList.get("x-forwarded-for") ||
            headersList.get("x-real-ip") ||
            "unknown";

        const performanceData = await req.json();

        // Validate performance data
        if (!performanceData || typeof performanceData !== "object") {
            return NextResponse.json(
                { error: "Invalid performance data" },
                { status: 400 },
            );
        }

        // Add server-side metadata
        const enrichedData = {
            ...performanceData,
            serverTimestamp: Date.now(),
            userAgent,
            ip,
            environment: process.env.NODE_ENV,
            version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
        };

        // Log performance data (in production, you might want to send to analytics service)
        // eslint-disable-next-line no-console
        console.log("Performance Report:", {
            url: enrichedData.url,
            score: enrichedData.score,
            lcp: enrichedData.metrics?.lcp,
            fid: enrichedData.metrics?.fid,
            cls: enrichedData.metrics?.cls,
            pageLoadTime: enrichedData.metrics?.pageLoadTime,
            timestamp: enrichedData.timestamp,
        });

        // In a real application, you would:
        // 1. Store in database
        // 2. Send to analytics service (e.g., Google Analytics, Mixpanel)
        // 3. Alert if performance thresholds are exceeded
        // 4. Aggregate for reporting

        // Example: Alert if performance score is below threshold
        if (enrichedData.score < 50) {
            console.warn("Poor performance detected:", {
                url: enrichedData.url,
                score: enrichedData.score,
                recommendations: enrichedData.recommendations,
            });
        }

        return NextResponse.json({
            success: true,
            message: "Performance data recorded",
            score: enrichedData.score,
        });
    } catch (error) {
        console.error("Error processing performance data:", error);
        return NextResponse.json(
            { error: "Failed to process performance data" },
            { status: 500 },
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get("url");
        const days = parseInt(searchParams.get("days") || "7");

        // In a real application, you would query your database
        // For now, return mock aggregated data
        const mockData = {
            url: url || "all",
            period: `${days} days`,
            metrics: {
                averageScore: 85,
                averageLCP: 2.1,
                averageFID: 45,
                averageCLS: 0.08,
                averagePageLoadTime: 2.8,
            },
            trends: {
                score: "+5%",
                lcp: "-12%",
                fid: "-8%",
                cls: "-15%",
                pageLoadTime: "-10%",
            },
            recommendations: [
                "Optimize images for faster loading",
                "Implement code splitting for better performance",
                "Consider using a CDN for static assets",
            ],
        };

        return NextResponse.json(mockData);
    } catch (error) {
        console.error("Error fetching performance data:", error);
        return NextResponse.json(
            { error: "Failed to fetch performance data" },
            { status: 500 },
        );
    }
}
