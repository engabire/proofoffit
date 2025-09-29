import { requireUserId } from "@/lib/auth";
import { generateClaimFromProof } from "@/lib/claimFromProof";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { targetId, prompt, allowedProofIds } = await req.json();

    if (!targetId) {
      return NextResponse.json(
        { error: "targetId is required" },
        { status: 400 }
      );
    }

    const result = await generateClaimFromProof({
      targetId,
      userId,
      prompt,
      allowedProofIds,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating claim from proof:", error);

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
