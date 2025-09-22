import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireUserId();
    const { id } = params;

    const link = await prisma.auditLink.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Audit link not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.auditLink.update({
      where: { id },
      data: { isRevoked: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error revoking audit link:", error);
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
    const { id } = params;
    const { expiresAt, maxViews, watermark } = await req.json();

    const link = await prisma.auditLink.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Audit link not found or access denied" },
        { status: 404 }
      );
    }

    const updatedLink = await prisma.auditLink.update({
      where: { id },
      data: {
        ...(expiresAt !== undefined && { expiresAt }),
        ...(maxViews !== undefined && { maxViews }),
        ...(watermark !== undefined && { watermark }),
      },
    });

    return NextResponse.json(updatedLink);
  } catch (error) {
    console.error("Error updating audit link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
