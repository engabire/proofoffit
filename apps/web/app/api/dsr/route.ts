import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

// Initialize Supabase client with service role key
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase configuration missing");
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, reason, additionalInfo } = body;

    // Validate request type - expanded to include all GDPR rights
    const validTypes = [
      "export", // Right of access / data portability
      "delete", // Right to erasure
      "rectify", // Right to rectification
      "restrict", // Right to restriction of processing
      "object", // Right to object
      "portability", // Right to data portability
      "withdraw_consent", // Withdraw consent
      "automated_decision_review", // Right to human review of automated decisions
    ];

    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        {
          error: `Invalid request type. Must be one of: ${
            validTypes.join(", ")
          }`,
        },
        { status: 400 },
      );
    }

    // Get user ID from headers (assuming you have auth middleware)
    const headersList = await headers();
    const userId = headersList.get("x-user-id"); // Adjust based on your auth setup

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Generate unique ticket ID
    const ticketId = `DSR-${Date.now()}-${
      Math.random().toString(36).substr(2, 9)
    }`;

    // Create DSR request record
    const { data: dsrRequest, error: insertError } = await getSupabaseClient()
      .from("dsr_requests")
      .insert({
        ticket_id: ticketId,
        user_id: userId,
        type: type,
        reason: reason || null,
        additional_info: additionalInfo || null,
        status: "received",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error creating DSR request:", insertError);
      }
      return NextResponse.json(
        { error: "Failed to create data request" },
        { status: 500 },
      );
    }

    // Log the DSR request for audit purposes
    await getSupabaseClient()
      .from("audit_events")
      .insert({
        event_type: "dsr_request",
        user_id: userId,
        details: {
          ticket_id: ticketId,
          request_type: type,
          reason: reason,
        },
        created_at: new Date().toISOString(),
      });

    // Send email receipt (implement your email service)
    await sendDSRReceipt(userId, ticketId, type);

    // Return success response
    return NextResponse.json({
      success: true,
      ticket_id: ticketId,
      message: "Data request received successfully",
      estimated_completion: getEstimatedCompletion(type),
      contact_email: "dsr@proofoffit.com",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("DSR API error:", error);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get("ticket_id");

    if (!ticketId) {
      return NextResponse.json(
        { error: "Ticket ID required" },
        { status: 400 },
      );
    }

    // Get user ID from headers
    const headersList = await headers();
    const userId = headersList.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Fetch DSR request status
    const { data: dsrRequest, error } = await getSupabaseClient()
      .from("dsr_requests")
      .select("*")
      .eq("ticket_id", ticketId)
      .eq("user_id", userId)
      .single();

    if (error || !dsrRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ticket_id: dsrRequest.ticket_id,
      type: dsrRequest.type,
      status: dsrRequest.status,
      created_at: dsrRequest.created_at,
      updated_at: dsrRequest.updated_at,
      estimated_completion: dsrRequest.estimated_completion,
      notes: dsrRequest.notes,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("DSR status check error:", error);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Helper function to get estimated completion time
function getEstimatedCompletion(type: string): string {
  const estimates = {
    export: "7-14 business days",
    delete: "30 days (grace period)",
    rectify: "7-14 business days",
    restrict: "7-14 business days",
    object: "7-14 business days",
    portability: "7-14 business days",
    withdraw_consent: "24-48 hours",
    automated_decision_review: "7-14 business days",
  };
  return estimates[type as keyof typeof estimates] || "7-14 business days";
}

// Helper function to get request description
function getRequestDescription(type: string): string {
  const descriptions = {
    export: "Export all personal data in a structured format",
    delete: "Delete all personal data and close account",
    rectify: "Correct or update inaccurate personal data",
    restrict: "Restrict processing of personal data",
    object: "Object to processing of personal data",
    portability: "Receive personal data in a portable format",
    withdraw_consent: "Withdraw consent for data processing",
    automated_decision_review: "Request human review of automated decisions",
  };
  return descriptions[type as keyof typeof descriptions] ||
    "Process data subject request";
}

// Helper function to send DSR receipt email
async function sendDSRReceipt(userId: string, ticketId: string, type: string) {
  try {
    // Get user email from Supabase
    const { data: user } = await getSupabaseClient()
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();

    if (!user?.email) {
      if (process.env.NODE_ENV !== "production") {
        console.error("User email not found for DSR receipt");
      }
      return;
    }

    // Send email using your email service (Resend, SendGrid, etc.)
    const emailData = {
      to: user.email,
      subject: `Data Request Received - ${ticketId}`,
      html: `
        <h2>Data Request Received</h2>
        <p>Your data request has been received and is being processed.</p>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <p><strong>Request Type:</strong> ${type}</p>
        <p><strong>Estimated Completion:</strong> ${
        getEstimatedCompletion(type)
      }</p>
        <p>You can check the status of your request at any time.</p>
        <p>If you have any questions, please contact us at dsr@proofoffit.com</p>
      `,
    };

    // Implement your email sending logic here
    // await sendEmail(emailData)
    if (process.env.NODE_ENV !== "production") {
      console.info("DSR receipt email would be sent:", emailData);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error sending DSR receipt:", error);
    }
  }
}

// Export the dynamic configuration
export const dynamic = "force-dynamic";
