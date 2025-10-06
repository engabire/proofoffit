import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireUserId();
    const { id } = await params;

    const link = await prisma.auditLink.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Audit link not found" },
        { status: 404 }
      );
    }

    await prisma.auditLink.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting audit link:", error);
    return NextResponse.json(
      { error: "Failed to delete audit link" },
      { status: 500 }
    );
  }
}

