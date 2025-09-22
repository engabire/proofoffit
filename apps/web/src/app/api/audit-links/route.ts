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

    // Get user email for notifications
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    // Send notification email about audit link creation
    if (user?.email) {
      try {
        const { sendAuditLinkNotification } = await import('@/lib/email/audit-notifications');
        await sendAuditLinkNotification({
          userEmail: user.email,
          targetTitle: target.title,
          auditUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.proofoffit.com'}/a/${token}`,
          expiresAt: link.expiresAt,
          maxViews: link.maxViews,
          watermark: link.watermark
        });
      } catch (emailError) {
        console.error('Failed to send audit link notification:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      id: link.id,
      url: `/a/${token}`,
      expiresAt: link.expiresAt,
      maxViews: link.maxViews,
      watermark: link.watermark,
      message: "Audit link created successfully! A confirmation email has been sent to your registered email address.",
      guidance: {
        title: "Audit Link Created Successfully",
        steps: [
          "Share the link with stakeholders who need to review your evidence",
          "The link includes security features like expiration and view limits",
          "All access is logged and tracked for compliance purposes",
          "You can revoke access at any time from your dashboard"
        ],
        security: {
          expiresAt: link.expiresAt ? `Expires on ${link.expiresAt.toLocaleDateString()}` : "No expiration",
          maxViews: link.maxViews ? `Limited to ${link.maxViews} views` : "Unlimited views",
          watermark: link.watermark ? "Watermarked for security" : "No watermark"
        }
      }
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
