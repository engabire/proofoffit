import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const { proofId, weight } = await req.json();

    const target = await prisma.target.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
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
        applicationId: id,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
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
        isDeleted: false,
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
        applicationId: id,
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