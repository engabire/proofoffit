import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Store verification codes in memory (in production, use Redis or database)
const verificationCodes = new Map<string, {
  code: string;
  email: string;
  expiresAt: number;
  attempts: number;
}>();

// Clean up expired codes every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of verificationCodes.entries()) {
    if (data.expiresAt < now) {
      verificationCodes.delete(key);
    }
  }
}, 5 * 60 * 1000);

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { action, email, code } = await request.json();

    if (action === "generate") {
      return await generateCode(email);
    } else if (action === "verify") {
      return await verifyCode(email, code);
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'generate' or 'verify'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Verification code error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateCode(email: string) {
  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id, email_confirmed")
    .eq("email", email)
    .single();

  if (existingUser && existingUser.email_confirmed) {
    return NextResponse.json(
      { error: "Email is already verified" },
      { status: 400 }
    );
  }

  // Generate new verification code
  const verificationCode = generateVerificationCode();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store the code
  verificationCodes.set(email, {
    code: verificationCode,
    email,
    expiresAt,
    attempts: 0,
  });

  // Log the verification code (in production, this would be sent via email/SMS)
  console.log(`🔐 Verification code for ${email}: ${verificationCode}`);
  console.log(`⏰ Code expires at: ${new Date(expiresAt).toISOString()}`);

  return NextResponse.json({
    success: true,
    message: "Verification code generated",
    // In development, return the code for testing
    ...(process.env.NODE_ENV === "development" && { 
      code: verificationCode,
      expiresIn: "10 minutes"
    }),
  });
}

async function verifyCode(email: string, code: string) {
  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and code are required" },
      { status: 400 }
    );
  }

  const storedData = verificationCodes.get(email);

  if (!storedData) {
    return NextResponse.json(
      { error: "No verification code found for this email" },
      { status: 400 }
    );
  }

  // Check if code has expired
  if (storedData.expiresAt < Date.now()) {
    verificationCodes.delete(email);
    return NextResponse.json(
      { error: "Verification code has expired" },
      { status: 400 }
    );
  }

  // Check attempt limit
  if (storedData.attempts >= 3) {
    verificationCodes.delete(email);
    return NextResponse.json(
      { error: "Too many failed attempts. Please request a new code" },
      { status: 400 }
    );
  }

  // Verify the code
  if (storedData.code !== code) {
    storedData.attempts++;
    return NextResponse.json(
      { error: "Invalid verification code" },
      { status: 400 }
    );
  }

  // Code is valid - mark email as confirmed
  try {
    // Update user email confirmation status
    const { error: updateError } = await supabase
      .from("users")
      .update({ 
        email_confirmed: true,
        email_confirmed_at: new Date().toISOString()
      })
      .eq("email", email);

    if (updateError) {
      console.error("Error updating user email confirmation:", updateError);
      return NextResponse.json(
        { error: "Failed to confirm email" },
        { status: 500 }
      );
    }

    // Clean up the verification code
    verificationCodes.delete(email);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}

// GET endpoint to check verification status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const storedData = verificationCodes.get(email);
    const hasCode = !!storedData;
    const isExpired = storedData ? storedData.expiresAt < Date.now() : false;

    return NextResponse.json({
      hasCode,
      isExpired,
      attempts: storedData?.attempts || 0,
      expiresAt: storedData?.expiresAt || null,
    });
  } catch (error) {
    console.error("Error checking verification status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
