// Commented out - target model doesn't exist in current schema
/*
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
      },
      include: {
        weights: {
          include: {
            proof: true,
          },
        },
        // auditLinks: { // Model doesn't exist
        //   where: {
        //     isRevoked: false,
        //     OR: [
        //       { expiresAt: null },
        //       { expiresAt: { gt: new Date() } },
        //     ],
        //   },
        //   orderBy: {
        //     createdAt: "desc",
        //   },
        // },
      },
    });

    if (!target) {
      return NextResponse.json(
        { error: "Target not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(target);
  } catch (error) {
    console.error("Error fetching target:", error);
    return NextResponse.json(
      { error: "Failed to fetch target" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireUserId();
    const { id } = params;
    const { title, role, companyHint, layout, rubricJson } = await req.json();

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

    const updatedTarget = await prisma.target.update({
      where: { id },
      data: {
        title,
        role,
        companyHint,
        layout,
        rubricJson,
      },
    });

    return NextResponse.json(updatedTarget);
  } catch (error) {
    console.error("Error updating target:", error);
    return NextResponse.json(
      { error: "Failed to update target" },
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
      },
    });

    if (!target) {
      return NextResponse.json(
        { error: "Target not found" },
        { status: 404 }
      );
    }

    await prisma.target.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting target:", error);
    return NextResponse.json(
      { error: "Failed to delete target" },
      { status: 500 }
    );
  }
}
*/

// Temporary placeholders
export async function GET() {
  return new Response(JSON.stringify({ error: "Not implemented - target model missing" }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT() {
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