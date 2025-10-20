import { NextRequest, NextResponse } from 'next/server';

export interface RateLimitConfig {
  requests: number;
  windowMs: number;
  keyGenerator?: (req: NextRequest) => string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: Date;
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Check if request is within rate limit
   */
  checkLimit(
    key: string,
    config: RateLimitConfig
  ): { allowed: boolean; info: RateLimitInfo } {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    // Get or create entry
    let entry = this.store.get(key);
    
    if (!entry || entry.resetTime <= now) {
      // Create new entry or reset expired one
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
      };
    }

    // Check if limit exceeded
    if (entry.count >= config.requests) {
      const retryAfter = new Date(entry.resetTime);
      return {
        allowed: false,
        info: {
          limit: config.requests,
          remaining: 0,
          reset: new Date(entry.resetTime),
          retryAfter,
        },
      };
    }

    // Increment counter
    entry.count++;
    this.store.set(key, entry);

    return {
      allowed: true,
      info: {
        limit: config.requests,
        remaining: config.requests - entry.count,
        reset: new Date(entry.resetTime),
      },
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime <= now) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Get rate limit info without incrementing counter
   */
  getInfo(key: string, config: RateLimitConfig): RateLimitInfo {
    const entry = this.store.get(key);
    const now = Date.now();
    
    if (!entry || entry.resetTime <= now) {
      return {
        limit: config.requests,
        remaining: config.requests,
        reset: new Date(now + config.windowMs),
      };
    }

    return {
      limit: config.requests,
      remaining: Math.max(0, config.requests - entry.count),
      reset: new Date(entry.resetTime),
    };
  }

  /**
   * Clear all rate limit data
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Destroy the rate limiter and cleanup interval
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Predefined rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  API: {
    requests: 30,
    windowMs: 60 * 1000, // 1 minute
  },
  AUTH: {
    requests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  UPLOAD: {
    requests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
  STRICT: {
    requests: 3,
    windowMs: 60 * 1000, // 1 minute
  },
} as const;

/**
 * Generate rate limit key from request
 */
export function generateRateLimitKey(req: NextRequest, config: RateLimitConfig): string {
  if (config.keyGenerator) {
    return config.keyGenerator(req);
  }

  // Default key generation: IP + User-Agent hash
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || req.headers.get('x-client-ip') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const path = req.nextUrl.pathname;
  
  // Create a hash of user agent for privacy
  const userAgentHash = Buffer.from(userAgent).toString('base64').slice(0, 16);
  
  return `${ip}:${userAgentHash}:${path}`;
}

/**
 * Create rate limit middleware
 */
export function createRateLimitMiddleware(config: RateLimitConfig) {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    const key = generateRateLimitKey(req, config);
    const { allowed, info } = rateLimiter.checkLimit(key, config);

    // Create response headers
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', info.limit.toString());
    headers.set('X-RateLimit-Remaining', info.remaining.toString());
    headers.set('X-RateLimit-Reset', Math.ceil(info.reset.getTime() / 1000).toString());

    if (!allowed) {
      const response = NextResponse.json(
        {
          error: 'Too many requests',
          retryAfter: info.retryAfter?.toISOString(),
        },
        { status: 429, headers }
      );
      return response;
    }

    // Return null to continue processing, but we need to add headers to the response
    // This will be handled by the calling middleware
    return null;
  };
}

/**
 * Rate limit decorator for API routes
 */
export function withRateLimit(config: RateLimitConfig) {
  return function (handler: Function) {
    return async function (req: NextRequest, ...args: any[]) {
      const key = generateRateLimitKey(req, config);
      const { allowed, info } = rateLimiter.checkLimit(key, config);

      if (!allowed) {
        return NextResponse.json(
          {
            error: 'Too many requests',
            retryAfter: info.retryAfter?.toISOString(),
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': info.limit.toString(),
              'X-RateLimit-Remaining': info.remaining.toString(),
              'X-RateLimit-Reset': Math.ceil(info.reset.getTime() / 1000).toString(),
            },
          }
        );
      }

      // Call the original handler
      const response = await handler(req, ...args);

      // Add rate limit headers to successful responses
      if (response instanceof NextResponse) {
        response.headers.set('X-RateLimit-Limit', info.limit.toString());
        response.headers.set('X-RateLimit-Remaining', info.remaining.toString());
        response.headers.set('X-RateLimit-Reset', Math.ceil(info.reset.getTime() / 1000).toString());
      }

      return response;
    };
  };
}
