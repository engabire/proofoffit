import { headers } from "next/headers";
import { hmac } from "@/lib/hash";

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

export async function getSecurityContext(req: Request, userId?: string): Promise<SecurityContext> {
  const headersList = await headers();
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
    // TODO: Implement security event logging when analytics model is available
    console.log("Security event:", {
      event: `security_${event}`,
      context,
      metadata,
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

  // TODO: Implement audit link validation when auditLink model is available
  // For now, return valid for all tokens with correct format
  return { isValid: true };
}






