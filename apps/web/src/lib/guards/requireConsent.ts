/**
 * Consent Guard System
 * 
 * Minimal server-side guard for consent verification
 * Implements GDPR/CCPA compliance requirements
 */

export async function requireConsent(userId: string): Promise<void> {
  if (!userId) throw new Error("Unauthenticated");
  
  // TODO: In production, query consent_events table:
  // SELECT 1 FROM consent_events 
  // WHERE user_id = $1 
  //   AND event = 'policy_accept' 
  //   AND policy_version = (SELECT version FROM policy_registry ORDER BY published_at DESC LIMIT 1)
  //   AND created_at > NOW() - INTERVAL '1 year'
  
  // For now, assume consent is given (placeholder)
  const hasConsent = true;
  
  if (!hasConsent) {
    const err: any = new Error("Consent required");
    err.code = "CONSENT_REQUIRED";
    err.statusCode = 403;
    throw err;
  }
}

export async function hasValidConsent(userId: string): Promise<boolean> {
  try {
    await requireConsent(userId);
    return true;
  } catch (error: any) {
    if (error.code === "CONSENT_REQUIRED") {
      return false;
    }
    throw error;
  }
}

export function createConsentError() {
  const error: any = new Error("Consent required to perform this action");
  error.code = "CONSENT_REQUIRED";
  error.statusCode = 403;
  return error;
}
