import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { title, description, expiresAt } = await req.json();

    // Generate unique slug
    const slug = crypto.randomBytes(16).toString("hex");

    const link = await prisma.auditLink.create({
      data: {
        userId,
        slug,
        title: title || "My Portfolio",
        description: description || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({
      id: link.id,
      slug: link.slug,
      title: link.title,
      description: link.description,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt,
    });
  } catch (error) {
    console.error("Error creating audit link:", error);
    return NextResponse.json(
      { error: "Failed to create audit link" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();

    const links = await prisma.auditLink.findMany({
      where: {
        userId,
      },
      include: {
        auditLinkProofs: {
          include: {
            proof: {
              select: {
                id: true,
                title: true,
                kind: true,
                description: true,
              },
            },
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
      { status: 500 },
    );
  }
}
