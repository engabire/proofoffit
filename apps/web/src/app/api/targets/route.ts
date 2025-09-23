// Commented out - target model doesn't exist in current schema
/*
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { title, role, companyHint, layout, rubricJson } = await req.json();

    const target = await prisma.target.create({
      data: {
        userId,
        title,
        role,
        companyHint,
        layout,
        rubricJson,
      },
    });

    return NextResponse.json(target);
  } catch (error) {
    console.error("Error creating target:", error);
    return NextResponse.json(
      { error: "Failed to create target" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const targets = await prisma.target.findMany({
      where: { userId },
      include: {
        weights: {
          include: {
            proof: true,
          },
        },
        _count: {
          select: {
            // auditLinks: true, // Model doesn't exist
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    const total = await prisma.target.count({
      where: { userId },
    });

    return NextResponse.json({
      targets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching targets:", error);
    return NextResponse.json(
      { error: "Failed to fetch targets" },
      { status: 500 }
    );
  }
}
*/

// Temporary placeholder
export async function POST() {
  return new Response(JSON.stringify({ error: "Not implemented - target model missing" }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET() {
  return new Response(JSON.stringify({ error: "Not implemented - target model missing" }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}