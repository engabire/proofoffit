import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
    try {
        // Check if Supabase is properly configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error("Supabase configuration missing");
            return NextResponse.json(
                { error: "Service configuration error" },
                { status: 503 },
            );
        }

        const body = await req.json();
        const {
            tenantId,
            actorType,
            actorId,
            action,
            objType,
            objId,
            payloadHash,
        } = body;

        // Validate required fields
        if (
            !tenantId || !actorType || !actorId || !action || !objType || !objId
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        // Insert into action_log table
        const { data, error } = await supabase
            .from("action_log")
            .insert({
                tenantId,
                actorType,
                actorId,
                action,
                objType,
                objId,
                payloadHash: payloadHash || "default_hash",
            })
            .select();

        if (error) {
            console.error("Error inserting action log:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            return NextResponse.json(
                { error: "Failed to log action", details: error.message },
                { status: 500 },
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Action log API error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 },
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const tenantId = searchParams.get("tenantId");
        const limit = parseInt(searchParams.get("limit") || "100");

        let query = supabase
            .from("action_log")
            .select("*")
            .order("ts", { ascending: false })
            .limit(limit);

        if (tenantId) {
            query = query.eq("tenantId", tenantId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching action log:", error);
            return NextResponse.json(
                { error: "Failed to fetch action log" },
                { status: 500 },
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Action log GET API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

export const dynamic = "force-dynamic";
