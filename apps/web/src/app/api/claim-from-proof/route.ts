import { requireUserId } from "@/lib/auth";
import { generateClaimFromProof, CitationViolationError } from "@/lib/claimFromProof";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { targetId, prompt, maxLength } = await req.json();

    if (!targetId || !prompt) {
      return NextResponse.json(
        { error: "targetId and prompt are required" },
        { status: 400 }
      );
    }

    const result = await generateClaimFromProof(userId, {
      targetId,
      prompt,
      maxLength,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating claim from proof:", error);
    
    if (error instanceof CitationViolationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
