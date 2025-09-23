// Commented out - target model doesn't exist in current schema
/*
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { targetId, jdText } = await req.json();

    // Get target with proofs
    const target = await prisma.target.findFirst({
      where: {
        id: targetId,
        userId,
      },
      include: {
        weights: {
          include: {
            proof: true,
          },
        },
      },
    });

    if (!target) {
      return NextResponse.json(
        { error: "Target not found" },
        { status: 404 }
      );
    }

    // Calculate fit score
    const proofs = target.weights.map(w => w.proof);
    const fitScore = calculateFitScore(proofs, jdText);

    // Save JD snapshot to target
    await prisma.target.update({
      where: { id: targetId },
      data: {
        jdSnapshot: jdText,
        fitScore,
        lastAnalyzedAt: new Date(),
      },
    });

    return NextResponse.json({
      fitScore,
      targetId,
      analyzedAt: new Date(),
    });
  } catch (error) {
    console.error("Error analyzing requirement fit:", error);
    return NextResponse.json(
      { error: "Failed to analyze requirement fit" },
      { status: 500 }
    );
  }
}

function calculateFitScore(proofs: any[], jdText: string): number {
  // Simple keyword matching for demo
  const jdKeywords = jdText.toLowerCase().split(/\s+/);
  let matches = 0;
  
  proofs.forEach(proof => {
    const proofText = (proof.title + ' ' + proof.summary).toLowerCase();
    jdKeywords.forEach(keyword => {
      if (proofText.includes(keyword) && keyword.length > 3) {
        matches++;
      }
    });
  });
  
  return Math.min(100, (matches / jdKeywords.length) * 100);
}
*/

// Temporary placeholder
export async function POST() {
  return new Response(JSON.stringify({ error: "Not implemented - target model missing" }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}