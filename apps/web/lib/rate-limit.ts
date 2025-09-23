import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
}

export class RateLimitError extends Error {
  constructor(
    public retryAfter: number,
    message: string = "Rate limit exceeded"
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<void> {
  const { windowMs, maxRequests } = config;
  
  const window = Math.floor(Date.now() / windowMs);
  const rateLimitKey = `rate_limit:${key}:${window}`;
  
  try {
    const current = await redis.incr(rateLimitKey);
    
    if (current === 1) {
      // Set expiration for the window
      await redis.expire(rateLimitKey, Math.ceil(windowMs / 1000));
    }
    
    if (current > maxRequests) {
      const retryAfter = windowMs - (Date.now() % windowMs);
      throw new RateLimitError(retryAfter);
    }
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    
    // If Redis is down, allow the request but log the error
    console.error("Rate limit check failed:", error);
  }
}

export function getRateLimitKey(req: Request, identifier?: string): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";
  
  if (identifier) {
    return `${identifier}:${ip}`;
  }
  
  return ip;
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  AUDIT_VIEW: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 views per minute per IP
  },
  AI_GENERATION: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 generations per minute per user
  },
  API_GENERAL: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute per IP
  },
  AUTH_ATTEMPTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 auth attempts per 15 minutes per IP
  },
} as const;






