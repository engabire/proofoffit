import { NextRequest, NextResponse } from "next/server";
import { securityMonitor } from "./security-monitor";
import { securityMiddleware } from "../security";

export function enhancedSecurityMiddleware(request: NextRequest): NextResponse {
    // Apply base security middleware first
    const baseResponse = securityMiddleware(request);
    if (baseResponse.status !== 200) {
        return baseResponse;
    }

    const ipAddress = getClientIP(request);
    const pathname = request.nextUrl.pathname;

    // Check for brute force attacks
    if (pathname.startsWith("/api/auth/")) {
        const isBruteForce = securityMonitor.checkBruteForceAttack(
            ipAddress,
            false,
        );
        if (isBruteForce) {
            securityMonitor.logEvent(
                "BRUTE_FORCE_ATTACK",
                "HIGH",
                "enhanced-middleware",
                { pathname, method: request.method },
                request,
            );
            return new NextResponse("Too many failed login attempts", {
                status: 429,
            });
        }
    }

    // Check for suspicious activity
    if (securityMonitor.checkSuspiciousActivity(ipAddress)) {
        securityMonitor.logEvent(
            "SUSPICIOUS_ACTIVITY",
            "MEDIUM",
            "enhanced-middleware",
            { pathname, method: request.method },
            request,
        );
    }

    // Check for blocked IPs
    if (securityMonitor.isIPBlocked(ipAddress)) {
        securityMonitor.logEvent(
            "AUTHORIZATION_FAILURE",
            "HIGH",
            "enhanced-middleware",
            { pathname, method: request.method, reason: "IP blocked" },
            request,
        );
        return new NextResponse("Access denied", { status: 403 });
    }

    return baseResponse;
}

function getClientIP(request: NextRequest): string {
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
}

