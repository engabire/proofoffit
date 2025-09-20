import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { assertWithinLimits } from "@/lib/guards";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { title, role, companyHint, layout = "REPORT", rubricJson } = await req.json();

    // Check quota limits
    await assertWithinLimits(userId);

    const target = await prisma.target.create({
      data: {
        userId,
        title,
        role,
        companyHint,
        layout,
        rubricJson: rubricJson || {},
      },
    });

    return NextResponse.json(target);
  } catch (error) {
    console.error("Error creating target:", error);
    
    if (error instanceof Error && error.name === "QuotaExceededError") {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get("includeDeleted") === "true";

    const targets = await prisma.target.findMany({
      where: {
        userId,
        ...(includeDeleted ? {} : { isDeleted: false }),
      },
      include: {
        weights: {
          include: {
            proof: true,
          },
        },
        _count: {
          select: {
            auditLinks: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(targets);
  } catch (error) {
    console.error("Error fetching targets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


