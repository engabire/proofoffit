import { prisma } from "@/lib/db";
import crypto from "crypto";

export type SecurityEventType = 
  | "login_attempt"
  | "failed_login"
  | "audit_link_created"
  | "audit_link_accessed"
  | "data_export"
  | "data_deletion"
  | "suspicious_activity";

export interface SecurityEvent {
  eventType: SecurityEventType;
  userId?: string;
  targetId?: string;
  metadata?: Record<string, any>;
  severity?: "low" | "medium" | "high" | "critical";
}

export async function logSecurityEvent(event: SecurityEvent) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventType: event.eventType,
        userId: event.userId,
        targetId: event.targetId,
        metadata: {
          ...event.metadata,
          severity: event.severity || "low",
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Failed to log security event:", error);
    // Don't throw - security logging failures shouldn't break the app
  }
}

export async function validateAuditLink(token: string) {
  try {
    const link = await prisma.auditLink.findUnique({
      where: { token },
      include: {
        target: {
          include: {
            weights: {
              include: {
                proof: true,
              },
            },
          },
        },
      },
    });

    if (!link) {
      return { valid: false, error: "Invalid link" };
    }

    if (link.isRevoked) {
      return { valid: false, error: "Link has been revoked" };
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      return { valid: false, error: "Link has expired" };
    }

    if (link.maxViews && link.viewsCount >= link.maxViews) {
      return { valid: false, error: "Link has reached maximum views" };
    }

    // Increment view count
    await prisma.auditLink.update({
      where: { id: link.id },
      data: {
        viewsCount: link.viewsCount + 1,
      },
    });

    // Log the access
    await logSecurityEvent({
      eventType: "audit_link_accessed",
      userId: link.userId,
      targetId: link.targetId,
      metadata: {
        linkId: link.id,
        viewsCount: link.viewsCount + 1,
      },
    });

    return { valid: true, link };
  } catch (error) {
    console.error("Error validating audit link:", error);
    return { valid: false, error: "Internal error" };
  }
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

export async function checkRateLimit(
  identifier: string, 
  action: string, 
  limit: number, 
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const key = `${action}:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  // This is a simplified rate limiting implementation
  // In production, you'd want to use Redis or a proper rate limiting service
  try {
    const recentEvents = await prisma.analyticsEvent.count({
      where: {
        eventType: action,
        metadata: {
          path: ['identifier'],
          equals: identifier,
        },
        createdAt: {
          gte: new Date(windowStart),
        },
      },
    });

    const remaining = Math.max(0, limit - recentEvents);
    const resetTime = now + windowMs;

    return {
      allowed: remaining > 0,
      remaining,
      resetTime,
    };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // Fail open - allow the request if rate limiting fails
    return {
      allowed: true,
      remaining: limit,
      resetTime: now + windowMs,
    };
  }
}