import { NextResponse } from "next/server";

// TODO: replace with real DB query. For now, return an empty list to keep UI working.
// When wiring DB, select last 100 from job_search_events ordered by created_at desc.
export async function GET() {
    // Example shape placeholder
    return NextResponse.json({ rows: [] });
}
