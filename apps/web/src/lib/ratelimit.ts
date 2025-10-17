import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

import { env } from "@/lib/env";

const WINDOW_MS = 60_000;
const DEFAULT_LIMIT =
  Number.isFinite(env.jobs.rateLimitPerMinute) && env.jobs.rateLimitPerMinute > 0
    ? env.jobs.rateLimitPerMinute
    : 30;

export type RateLimitState = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

type RateLimiter = {
  limit(identifier: string): Promise<RateLimitState>;
};

let jobsLimiter: RateLimiter | null | undefined;

function createUpstashLimiter(): RateLimiter | null {
  if (!env.upstash.redisUrl || !env.upstash.redisToken) {
    return null;
  }

  try {
    const redis = new Redis({
      url: env.upstash.redisUrl,
      token: env.upstash.redisToken,
    });

    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(DEFAULT_LIMIT, "1 m"),
      analytics: true,
    });

    return {
      async limit(identifier: string) {
        const result = await ratelimit.limit(identifier);
        return {
          success: result.success,
          limit: result.limit,
          remaining: result.remaining,
          reset: result.reset,
        };
      },
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("jobs.rate_limit.upstash_unavailable", { error });
    }
    return null;
  }
}

function createMemoryLimiter(): RateLimiter {
  const store = new Map<string, { count: number; reset: number }>();

  const scheduleCleanup = (key: string, reset: number) => {
    const ttl = Math.max(0, reset - Date.now());
    const timeout = setTimeout(() => store.delete(key), ttl);
    if (typeof (timeout as any)?.unref === "function") {
      (timeout as any).unref();
    }
  };

  return {
    async limit(identifier: string) {
      const now = Date.now();
      const entry = store.get(identifier);

      if (!entry || entry.reset <= now) {
        const reset = now + WINDOW_MS;
        store.set(identifier, { count: 1, reset });
        scheduleCleanup(identifier, reset);
        return {
          success: true,
          limit: DEFAULT_LIMIT,
          remaining: Math.max(0, DEFAULT_LIMIT - 1),
          reset,
        };
      }

      entry.count += 1;
      const remaining = Math.max(0, DEFAULT_LIMIT - entry.count);
      const success = entry.count <= DEFAULT_LIMIT;
      return {
        success,
        limit: DEFAULT_LIMIT,
        remaining,
        reset: entry.reset,
      };
    },
  };
}

function getJobsLimiter(): RateLimiter | null {
  if (jobsLimiter === undefined) {
    jobsLimiter = createUpstashLimiter() ?? createMemoryLimiter();
  }
  return jobsLimiter;
}

export function resolveClientIdentifier(request: NextRequest): string {
  // Note: request.ip is not available in NextRequest, we'll use headers instead

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const clientIp = forwardedFor.split(",")[0]?.trim();
    if (clientIp) return clientIp;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

export async function limitJobSearch(
  request: NextRequest,
): Promise<RateLimitState | null> {
  const limiter = getJobsLimiter();
  if (!limiter) {
    return null;
  }

  const identifier = `jobs:${resolveClientIdentifier(request)}`;

  try {
    return await limiter.limit(identifier);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("jobs.rate_limit.failed", { error });
    }
    return null;
  }
}

export function toRateLimitHeaders(result: RateLimitState | null): Record<string, string> {
  if (!result) {
    return {
      "X-RateLimit-Limit": "0",
      "X-RateLimit-Remaining": "0", 
      "X-RateLimit-Reset": "0",
    };
  }
  
  const resetSeconds = Math.max(
    0,
    Math.ceil((result.reset - Date.now()) / 1000),
  );

  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(Math.max(0, result.remaining)),
    "X-RateLimit-Reset": String(resetSeconds),
  };
}

export const JOBS_RATE_LIMIT_WINDOW_MS = WINDOW_MS;
