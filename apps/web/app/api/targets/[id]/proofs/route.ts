import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireUserId();
    const { id: targetId } = params;

    // Verify target ownership
    const target = await prisma.target.findFirst({
      where: {
        id: targetId,
        userId,
        isDeleted: false,
      },
    });

    if (!target) {
      return NextResponse.json(
        { error: "Target not found or access denied" },
        { status: 404 }
      );
    }

    // Get all user's proofs with their weights for this target
    const proofs = await prisma.proof.findMany({
      where: { userId },
      include: {
        weights: {
          where: { targetId },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(proofs);
  } catch (error) {
    console.error("Error fetching target proofs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireUserId();
    const { id: targetId } = params;
    const { proofWeights } = await req.json();

    // Verify target ownership
    const target = await prisma.target.findFirst({
      where: {
        id: targetId,
        userId,
        isDeleted: false,
      },
    });

    if (!target) {
      return NextResponse.json(
        { error: "Target not found or access denied" },
        { status: 404 }
      );
    }

    // Update proof weights in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete existing weights for this target
      await tx.targetProofWeight.deleteMany({
        where: { targetId },
      });

      // Insert new weights
      if (proofWeights && proofWeights.length > 0) {
        await tx.targetProofWeight.createMany({
          data: proofWeights.map((pw: { proofId: string; weight: number }) => ({
            targetId,
            proofId: pw.proofId,
            weight: pw.weight,
          })),
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating proof weights:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


