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

// Improved Security Headers with stricter CSP
export const securityHeaders = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "origin-when-cross-origin",
    "Permissions-Policy":
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'nonce-{NONCE}' https://vercel.live",
        "style-src 'self' 'nonce-{NONCE}' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://*.supabase.co https://*.vercel.app wss://*.supabase.co",
        "frame-src 'self' https://vercel.live",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
        "block-all-mixed-content",
    ].join("; "),
};

// Generate nonce for CSP
export function generateNonce(): string {
    return randomBytes(16).toString("base64");
}

// Apply security headers to response with nonce
export function applySecurityHeaders(
    response: NextResponse,
    nonce?: string,
): NextResponse {
    const headers = { ...securityHeaders };

    if (nonce) {
        headers["Content-Security-Policy"] = headers["Content-Security-Policy"]
            .replace(/{NONCE}/g, nonce);
    } else {
        // Remove nonce placeholders if no nonce provided
        headers["Content-Security-Policy"] = headers["Content-Security-Policy"]
            .replace(/'nonce-{NONCE}'/g, "");
    }

    Object.entries(headers).forEach(([key, value]) => {
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

    // Skip CSRF for API routes that don't need it
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

// Enhanced Rate Limiting with Redis-like storage
interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    keyGenerator?: (request: NextRequest) => string;
    skipSuccessfulRequests?: boolean;
}

const rateLimitStore = new Map<
    string,
    { count: number; resetTime: number; blocked: boolean }
>();

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
                blocked: false,
            });
            return null;
        }

        if (current.count >= config.maxRequests) {
            current.blocked = true;
            return new NextResponse("Rate limit exceeded", {
                status: 429,
                headers: {
                    "Retry-After": Math.ceil((current.resetTime - now) / 1000)
                        .toString(),
                    "X-RateLimit-Limit": config.maxRequests.toString(),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": new Date(current.resetTime)
                        .toISOString(),
                },
            });
        }

        current.count++;
        return null;
    };
}

// Enhanced Input Sanitization
export function sanitizeInput(input: string): string {
    return input
        .replace(/[<>]/g, "") // Remove potential HTML tags
        .replace(/javascript:/gi, "") // Remove javascript: protocol
        .replace(/on\w+=/gi, "") // Remove event handlers
        .replace(/data:/gi, "") // Remove data: protocol
        .replace(/vbscript:/gi, "") // Remove vbscript: protocol
        .trim();
}

// SQL Injection Prevention (enhanced)
export function sanitizeSQL(input: string): string {
    return input
        .replace(/['"]/g, "") // Remove quotes
        .replace(/;/g, "") // Remove semicolons
        .replace(/--/g, "") // Remove SQL comments
        .replace(/\/\*/g, "") // Remove block comments
        .replace(/\*\//g, "")
        .replace(/xp_/gi, "") // Remove xp_ procedures
        .replace(/sp_/gi, "") // Remove sp_ procedures
        .replace(/exec/gi, "") // Remove exec statements
        .replace(/execute/gi, ""); // Remove execute statements
}

// Enhanced XSS Prevention
export function escapeHTML(input: string): string {
    const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;",
        "`": "&#x60;",
        "=": "&#x3D;",
    };

    return input.replace(/[&<>"'/`=]/g, (s) => map[s]);
}

// Content Security Policy for specific pages (improved)
export const cspPolicies = {
    default: securityHeaders["Content-Security-Policy"],
    auth: [
        "default-src 'self'",
        "script-src 'self' 'nonce-{NONCE}'",
        "style-src 'self' 'nonce-{NONCE}' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://*.supabase.co",
        "frame-src 'self' https://vercel.live",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
    ].join("; "),
    dashboard: [
        "default-src 'self'",
        "script-src 'self' 'nonce-{NONCE}' https://vercel.live",
        "style-src 'self' 'nonce-{NONCE}' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://*.supabase.co https://*.vercel.app wss://*.supabase.co",
        "frame-src 'self' https://*.supabase.co",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
    ].join("; "),
};

// Enhanced security middleware for Next.js
export function securityMiddleware(request: NextRequest): NextResponse {
    let response = NextResponse.next();
    const nonce = generateNonce();

    // Apply security headers with nonce
    response = applySecurityHeaders(response, nonce);

    // Add nonce to response headers for client-side use
    response.headers.set("X-Nonce", nonce);

    // CSRF protection
    const csrfError = csrfProtection(request);
    if (csrfError) {
        return csrfError;
    }

    // Enhanced rate limiting for API routes
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

    // Stricter rate limiting for auth endpoints
    if (request.nextUrl.pathname.startsWith("/api/auth/")) {
        const authRateLimitError = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            maxRequests: 10, // 10 auth requests per window
            keyGenerator: getClientIp,
        })(request);

        if (authRateLimitError) {
            return authRateLimitError;
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

// Security validation functions
export function validateEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
}

export function validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }

    if (!/\d/.test(password)) {
        errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Password must contain at least one special character");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

// Security headers for API responses
export function addSecurityHeadersToAPI(response: NextResponse): NextResponse {
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "origin-when-cross-origin");

    return response;
}

// Security logging
export function logSecurityEvent(
    event: string,
    details: Record<string, any>,
    request?: NextRequest,
): void {
    const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        details,
        ip: request ? getClientIp(request) : "unknown",
        userAgent: request?.headers.get("user-agent") || "unknown",
    };

    // In production, send to your logging service
    if (process.env.NODE_ENV === "production") {
        // Send to logging service (e.g., Sentry, LogRocket, etc.)
        // eslint-disable-next-line no-console
        console.log("Security Event:", logEntry);
    } else {
        // eslint-disable-next-line no-console
        console.log("Security Event:", logEntry);
    }
}
