import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { addDays } from "date-fns";
import { makeToken } from "@/lib/token";
import { assertWithinLimits } from "@/lib/guards";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { targetId, ttlDays = 14, maxViews = null, watermark = true } = await req.json();

    // Validate target ownership
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

    // Check quota limits
    await assertWithinLimits(userId);

    const token = makeToken();
    const expiresAt = ttlDays ? addDays(new Date(), ttlDays) : null;

    const link = await prisma.auditLink.create({
      data: {
        userId,
        targetId,
        token,
        expiresAt,
        maxViews,
        watermark,
      },
    });

    return NextResponse.json({
      id: link.id,
      url: `/a/${token}`,
      expiresAt: link.expiresAt,
      maxViews: link.maxViews,
    });
  } catch (error) {
    console.error("Error creating audit link:", error);
    
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
    const targetId = searchParams.get("targetId");

    const where = {
      userId,
      ...(targetId && { targetId }),
    };

    const links = await prisma.auditLink.findMany({
      where,
      include: {
        target: {
          select: {
            id: true,
            title: true,
            role: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error("Error fetching audit links:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


