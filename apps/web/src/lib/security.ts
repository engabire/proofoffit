import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";

// CSRF Token Management
const CSRF_TOKEN_HEADER = "x-csrf-token";
const CSRF_TOKEN_COOKIE = "csrf-token";

export function generateCSRFToken(): string {
  return randomBytes(32).toString("hex");
}

export function generateCSRFHash(token: string, secret: string): string {
  return createHash("sha256").update(token + secret).digest("hex");
}

export function validateCSRFToken(
  token: string,
  hash: string,
  secret: string,
): boolean {
  const expectedHash = generateCSRFHash(token, secret);
  return hash === expectedHash;
}

// Security Headers
export const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://*.vercel.app",
    "frame-src 'self' https://vercel.live",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; "),
};

// Apply security headers to response
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// CSRF Protection Middleware
export function csrfProtection(request: NextRequest): NextResponse | null {
  const method = request.method;
  const secret = process.env.CSRF_SECRET ||
    "default-secret-change-in-production";

  // Skip CSRF for safe methods
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return null;
  }

  // Skip CSRF for API routes that don't need it (like auth callbacks and CSRF token endpoint)
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/api/webhooks/") ||
    pathname === "/api/csrf-token"
  ) {
    return null;
  }

  const token = request.headers.get(CSRF_TOKEN_HEADER);
  const cookieToken = request.cookies.get(CSRF_TOKEN_COOKIE)?.value;

  if (!token || !cookieToken) {
    return new NextResponse("CSRF token missing", { status: 403 });
  }

  // Validate token
  if (!validateCSRFToken(token, cookieToken, secret)) {
    return new NextResponse("CSRF token invalid", { status: 403 });
  }

  return null;
}

// Rate Limiting
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (request: NextRequest) => string;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const getClientIp = (request: NextRequest): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return "unknown";
};

export function rateLimit(config: RateLimitConfig) {
  return (request: NextRequest): NextResponse | null => {
    const key = config.keyGenerator
      ? config.keyGenerator(request)
      : getClientIp(request);

    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean up expired entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }

    const current = rateLimitStore.get(key);

    if (!current || current.resetTime < now) {
      // First request or window expired
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return null;
    }

    if (current.count >= config.maxRequests) {
      return new NextResponse("Rate limit exceeded", {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((current.resetTime - now) / 1000).toString(),
        },
      });
    }

    current.count++;
    return null;
  };
}

// Input Sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
}

// SQL Injection Prevention (basic)
export function sanitizeSQL(input: string): string {
  return input
    .replace(/['"]/g, "") // Remove quotes
    .replace(/;/g, "") // Remove semicolons
    .replace(/--/g, "") // Remove SQL comments
    .replace(/\/\*/g, "") // Remove block comments
    .replace(/\*\//g, "");
}

// XSS Prevention
export function escapeHTML(input: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
  };

  return input.replace(/[&<>"'/]/g, (s) => map[s]);
}

// Content Security Policy for specific pages
export const cspPolicies = {
  default: securityHeaders["Content-Security-Policy"],
  auth: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co",
    "frame-src 'self' https://vercel.live",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; "),
  dashboard: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://*.vercel.app",
    "frame-src 'self' https://*.supabase.co",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; "),
};

// Security middleware for Next.js
export function securityMiddleware(request: NextRequest): NextResponse {
  let response = NextResponse.next();

  // Apply security headers
  response = applySecurityHeaders(response);

  // CSRF protection
  const csrfError = csrfProtection(request);
  if (csrfError) {
    return csrfError;
  }

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const rateLimitError = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // 100 requests per window
      keyGenerator: getClientIp,
    })(request);

    if (rateLimitError) {
      return rateLimitError;
    }
  }

  // Add CSRF token to response cookies for forms
  if (request.method === "GET" && !request.cookies.get(CSRF_TOKEN_COOKIE)) {
    const token = generateCSRFToken();
    const secret = process.env.CSRF_SECRET ||
      "default-secret-change-in-production";
    const hash = generateCSRFHash(token, secret);

    response.cookies.set(CSRF_TOKEN_COOKIE, hash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }

  return response;
}
