import { NextRequest, NextResponse } from "next/server";

// TODO: replace with real DB query. For now, return an empty list to keep UI working.
// When wiring DB, select last 100 from job_search_events ordered by created_at desc.
export async function GET(req: NextRequest) {
  try {
    // TODO: In production, query the database:
    // SELECT id, created_at, provider, latency_ms, result_count
    // FROM job_search_events 
    // ORDER BY created_at DESC 
    // LIMIT 100

    // For now, return mock data to demonstrate the UI
    const mockData = {
      rows: [
        {
          id: "search_001",
          created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          provider: "seed",
          latency_ms: 245,
          result_count: 12,
        },
        {
          id: "search_002", 
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          provider: "seed",
          latency_ms: 189,
          result_count: 8,
        },
        {
          id: "search_003",
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          provider: "seed", 
          latency_ms: 312,
          result_count: 15,
        },
      ],
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Admin searches API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search events" },
      { status: 500 }
    );
  }
}
