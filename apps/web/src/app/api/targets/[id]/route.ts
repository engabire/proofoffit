import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireUserId();
    const { id } = params;

    const target = await prisma.target.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
      },
      include: {
        weights: {
          include: {
            proof: true,
          },
        },
        auditLinks: {
          where: {
            isRevoked: false,
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!target) {
      return NextResponse.json(
        { error: "Target not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json(target);
  } catch (error) {
    console.error("Error fetching target:", error);
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
    const { title, role, companyHint, layout, rubricJson, lastJdJson } = await req.json();

    const target = await prisma.target.findFirst({
      where: {
        id,
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

    const updatedTarget = await prisma.target.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(role !== undefined && { role }),
        ...(companyHint !== undefined && { companyHint }),
        ...(layout !== undefined && { layout }),
        ...(rubricJson !== undefined && { rubricJson }),
        ...(lastJdJson !== undefined && { lastJdJson }),
      },
    });

    return NextResponse.json(updatedTarget);
  } catch (error) {
    console.error("Error updating target:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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

    const target = await prisma.target.findFirst({
      where: {
        id,
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

    // Soft delete
    await prisma.target.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting target:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
