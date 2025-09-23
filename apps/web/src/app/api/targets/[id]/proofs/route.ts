// Commented out - target model doesn't exist in current schema
/*
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireUserId();
    const { id } = params;
    const { proofId, weight } = await req.json();

    const target = await prisma.target.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!target) {
      return NextResponse.json(
        { error: "Target not found" },
        { status: 404 }
      );
    }

    const targetProofWeight = await prisma.targetProofWeight.create({
      data: {
        targetId: id,
        proofId,
        weight,
      },
    });

    return NextResponse.json(targetProofWeight);
  } catch (error) {
    console.error("Error adding proof to target:", error);
    return NextResponse.json(
      { error: "Failed to add proof to target" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireUserId();
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const proofId = searchParams.get("proofId");

    if (!proofId) {
      return NextResponse.json(
        { error: "Proof ID is required" },
        { status: 400 }
      );
    }

    const target = await prisma.target.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!target) {
      return NextResponse.json(
        { error: "Target not found" },
        { status: 404 }
      );
    }

    await prisma.targetProofWeight.deleteMany({
      where: {
        targetId: id,
        proofId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing proof from target:", error);
    return NextResponse.json(
      { error: "Failed to remove proof from target" },
      { status: 500 }
    );
  }
}
*/

// Temporary placeholders
export async function POST() {
  return new Response(JSON.stringify({ error: "Not implemented - target model missing" }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE() {
  return new Response(JSON.stringify({ error: "Not implemented - target model missing" }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}