import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// TODO: Wire to DB: insert into consent_events (user_id, event, policy_version, ip)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const policy_version = String(body.policy_version || "v1");
    const event = String(body.event || "policy_accept");

    // Get client IP from headers
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ||
               headersList.get("x-real-ip") ||
               "unknown";

    // TODO: In production, insert into consent_events table:
    // INSERT INTO consent_events (user_id, event, policy_version, ip, created_at)
    // VALUES ($1, $2, $3, $4, NOW())

    // For now, log the consent event
    console.log("Consent event:", {
      event,
      policy_version,
      ip: ip === "unknown" ? "redacted" : "redacted", // Always redact IP in logs
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, policy_version, event }, { status: 200 });
  } catch (error) {
    console.error("Consent API error:", error);
    return NextResponse.json(
      { error: "Failed to process consent" },
      { status: 500 }
    );
  }
}
