/**
 * Telemetry Redaction System
 * 
 * Provides PII redaction and structured logging for ProofOfFit
 * Implements the trust engine's transparency requirements
 */

export function redact<T extends Record<string, any>>(evt: T): T {
  const clone = { ...evt } as any;
  
  // Redact IP addresses
  if ("ip" in clone) clone.ip = "redacted";
  if ("clientIp" in clone) clone.clientIp = "redacted";
  if ("xForwardedFor" in clone) clone.xForwardedFor = "redacted";
  
  // Redact user identifiers (keep hashed versions)
  if ("userId" in clone && typeof clone.userId === "string") {
    clone.userId = `user_${hashString(clone.userId)}`;
  }
  if ("email" in clone) clone.email = "redacted";
  if ("phone" in clone) clone.phone = "redacted";
  
  // Remove potentially sensitive query data
  if ("query" in clone && typeof clone.query === "object") {
    const query = clone.query as any;
    if (query.q) {
      // Keep search terms but hash them for analytics
      query.q = `search_${hashString(query.q)}`;
    }
    if (query.userId) {
      query.userId = `user_${hashString(query.userId)}`;
    }
  }
  
  // Redact any nested objects that might contain PII
  if ("metadata" in clone && typeof clone.metadata === "object") {
    const metadata = clone.metadata as any;
    if (metadata.userAgent) {
      // Keep browser type but remove version details
      metadata.userAgent = metadata.userAgent.split(" ")[0] + " [redacted]";
    }
  }
  
  return clone as T;
}

export function log(evt: Record<string, any>) {
  const redacted = redact(evt);
  console.info(JSON.stringify(redacted));
}

export function logSearchEvent(params: {
  provider: string;
  latency_ms: number;
  result_count: number;
  query?: any;
  userId?: string;
}) {
  log({
    event: "job_search",
    timestamp: new Date().toISOString(),
    ...params,
  });
}

export function logConsentEvent(params: {
  event: string;
  policy_version: string;
  userId?: string;
}) {
  log({
    timestamp: new Date().toISOString(),
    ...params,
  });
}

export function logWorkEvent(params: {
  type: string;
  candidate_id?: string;
  employer_id?: string;
  job_id?: string;
}) {
  log({
    event: "work_event",
    timestamp: new Date().toISOString(),
    ...params,
  });
}

// Simple hash function for anonymizing identifiers
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}
