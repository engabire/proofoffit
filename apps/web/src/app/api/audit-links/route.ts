import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { targetId, expiresAt, maxViews } = await req.json();

    // Verify target belongs to user
    const target = await prisma.target.findFirst({
      where: {
        id: targetId,
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

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    const link = await prisma.auditLink.create({
      data: {
        targetId,
        userId,
        token,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxViews: maxViews || null,
      },
    });

    return NextResponse.json({
      id: link.id,
      token: link.token,
      expiresAt: link.expiresAt,
      maxViews: link.maxViews,
      createdAt: link.createdAt,
    });
  } catch (error) {
    console.error("Error creating audit link:", error);
    return NextResponse.json(
      { error: "Failed to create audit link" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("targetId");

    const whereClause: any = {
      userId,
    };

    if (targetId) {
      whereClause.targetId = targetId;
    }

    const links = await prisma.auditLink.findMany({
      where: whereClause,
      include: {
        target: {
          select: {
            id: true,
            title: true,
            role: true,
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
      { error: "Failed to fetch audit links" },
      { status: 500 }
    );
  }
}

