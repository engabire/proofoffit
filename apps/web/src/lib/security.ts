// Simplified security - models don't exist in current schema

export interface SecurityContext {
  userId: string;
  targetId?: string;
  correlationId: string;
  tokenSuffix: string;
  ipHash: string;
  userAgentHash: string;
}

export async function logSecurityEvent(
  event: string,
  context: SecurityContext,
  metadata?: Record<string, any>
) {
  try {
    // Temporary logging until analyticsEvent model is added
    console.log("Security event:", event, context, metadata);
  } catch (error) {
    console.error("Failed to log security event:", error);
    // Don't throw - logging failures shouldn't break the app
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

export function validateToken(token: string): boolean {
  // Basic token validation
  return typeof token === 'string' && token.length >= 10;
}

export function getTokenSuffix(token: string): string {
  return token.slice(-4);
}

export function generateCorrelationId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function hashSensitiveData(data: string): string {
  // Simple hash for demo - use proper crypto in production
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

export async function validateAuditToken(
  token: string,
  context: SecurityContext
): Promise<{ isValid: boolean; reason?: string }> {
  // Temporary placeholder - auditLink model doesn't exist
  console.log("Audit token validation skipped - auditLink model not available");
  return { isValid: false, reason: "Audit tokens not available" };
}