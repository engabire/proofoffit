import { headers } from "next/headers";
import { hmac } from "@/lib/hash";
import { prisma } from "@/lib/db";

export interface SecurityContext {
  correlationId: string;
  userId?: string;
  targetId?: string;
  tokenSuffix?: string;
  ipHash: string;
  userAgentHash: string;
}

export function generateCorrelationId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getSecurityContext(req: Request, userId?: string): SecurityContext {
  const headersList = headers();
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const userAgent = req.headers.get("user-agent") || "";
  
  const ip = forwarded?.split(",")[0] || realIp || "unknown";
  
  return {
    correlationId: generateCorrelationId(),
    userId,
    ipHash: hmac(ip),
    userAgentHash: hmac(userAgent),
  };
}

export async function logSecurityEvent(
  event: string,
  context: SecurityContext,
  metadata?: Record<string, any>
) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventType: `security_${event}` as any,
        userId: context.userId,
        targetId: context.targetId,
        metadata: {
          correlationId: context.correlationId,
          tokenSuffix: context.tokenSuffix,
          ipHash: context.ipHash,
          userAgentHash: context.userAgentHash,
          ...metadata,
        },
      },
    });
  } catch (error) {
    console.error("Failed to log security event:", error);
    // Don't throw - logging failures shouldn't break the app
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 10000); // Limit length
}

export function validateToken(token: string): boolean {
  // Validate token format (base64url, 16-32 characters)
  const tokenRegex = /^[A-Za-z0-9_-]{16,32}$/;
  return tokenRegex.test(token);
}

export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function getTokenSuffix(token: string): string {
  return token.substring(token.length - 6);
}

export async function checkAuditLinkSecurity(
  token: string,
  context: SecurityContext
): Promise<{ isValid: boolean; reason?: string }> {
  if (!validateToken(token)) {
    await logSecurityEvent("invalid_token", context, { token: getTokenSuffix(token) });
    return { isValid: false, reason: "Invalid token format" };
  }

  const link = await prisma.auditLink.findUnique({
    where: { token },
    select: {
      id: true,
      isRevoked: true,
      expiresAt: true,
      maxViews: true,
      viewsCount: true,
      targetId: true,
    },
  });

  if (!link) {
    await logSecurityEvent("token_not_found", context, { token: getTokenSuffix(token) });
    return { isValid: false, reason: "Token not found" };
  }

  if (link.isRevoked) {
    await logSecurityEvent("token_revoked", context, { 
      token: getTokenSuffix(token),
      targetId: link.targetId,
    });
    return { isValid: false, reason: "Token has been revoked" };
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    await logSecurityEvent("token_expired", context, { 
      token: getTokenSuffix(token),
      targetId: link.targetId,
    });
    return { isValid: false, reason: "Token has expired" };
  }

  if (link.maxViews && link.viewsCount >= link.maxViews) {
    await logSecurityEvent("token_max_views", context, { 
      token: getTokenSuffix(token),
      targetId: link.targetId,
    });
    return { isValid: false, reason: "Maximum views exceeded" };
  }

  return { isValid: true };
}


