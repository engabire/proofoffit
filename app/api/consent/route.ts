import { NextResponse } from "next/server";

// TODO: Wire to DB: insert into consent_events (user_id, event, policy_version, ip)
export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));
    const policy_version = String(body.policy_version || "v1");
    const event = String(body.event || "policy_accept");

    // NOTE: In Next.js you cannot directly get client IP reliably; keep placeholder.
    // In production, use X-Forwarded-For from your proxy or Next headers().

    // Placeholder: simulate DB insert success
    return NextResponse.json({ ok: true, policy_version, event }, {
        status: 200,
    });
}
