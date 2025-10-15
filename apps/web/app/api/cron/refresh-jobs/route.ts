import { NextRequest, NextResponse } from "next/server";
import { jobFeedManager } from "@/lib/job-feeds";

export async function GET(req: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "default-secret";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (process.env.NODE_ENV !== "production") {
      console.info("Starting scheduled job feed refresh...");
    }

    // Refresh job feeds
    await jobFeedManager.refreshJobFeeds();

    if (process.env.NODE_ENV !== "production") {
      console.info("Scheduled job feed refresh completed");
    }

    return NextResponse.json({
      success: true,
      message: "Job feeds refreshed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in scheduled job refresh:", error);
    }
    return NextResponse.json(
      { error: "Failed to refresh job feeds" },
      { status: 500 },
    );
  }
}

// Also support POST for webhook-style calls
export async function POST(req: NextRequest) {
  return GET(req);
}
