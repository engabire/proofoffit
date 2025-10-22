import { NextRequest, NextResponse } from "next/server";
import { monitoringEngine } from "./monitoring-engine";

export function monitoringMiddleware(request: NextRequest): NextResponse {
    const startTime = Date.now();
    const pathname = request.nextUrl.pathname;
    const method = request.method;

    // Log API call
    if (pathname.startsWith("/api/")) {
        monitoringEngine.logEvent(
            "API_CALL",
            "INFO",
            "monitoring-middleware",
            {
                pathname,
                method,
                userAgent: request.headers.get("user-agent") || "unknown",
                ip: getClientIP(request),
            },
            {
                api_response_time: 0, // Will be updated after response
            },
        );
    }

    // Log user actions
    if (
        pathname.startsWith("/dashboard/") || pathname.startsWith("/profile/")
    ) {
        monitoringEngine.logEvent(
            "USER_ACTION",
            "INFO",
            "monitoring-middleware",
            {
                pathname,
                method,
                userAgent: request.headers.get("user-agent") || "unknown",
                ip: getClientIP(request),
            },
        );
    }

    // Log system events
    if (pathname.startsWith("/api/auth/")) {
        monitoringEngine.logEvent(
            "SYSTEM_EVENT",
            "INFO",
            "monitoring-middleware",
            {
                pathname,
                method,
                event: "authentication",
                userAgent: request.headers.get("user-agent") || "unknown",
                ip: getClientIP(request),
            },
        );
    }

    // Log database queries (if applicable)
    if (pathname.startsWith("/api/") && method === "GET") {
        monitoringEngine.logEvent(
            "DATABASE_QUERY",
            "INFO",
            "monitoring-middleware",
            {
                pathname,
                method,
                queryType: "SELECT",
            },
            {
                database_query_time: Math.random() * 100, // Simulate query time
            },
        );
    }

    // Log cache hits/misses
    if (pathname.startsWith("/api/")) {
        const isCacheHit = Math.random() > 0.3; // Simulate 70% cache hit rate
        monitoringEngine.logEvent(
            isCacheHit ? "CACHE_HIT" : "CACHE_MISS",
            "INFO",
            "monitoring-middleware",
            {
                pathname,
                method,
                cacheKey: `cache_${pathname.replace(/\//g, "_")}`,
            },
            {
                cache_hit_rate: isCacheHit ? 1 : 0,
            },
        );
    }

    // Log external service calls
    if (pathname.startsWith("/api/integrations/")) {
        monitoringEngine.logEvent(
            "EXTERNAL_SERVICE_CALL",
            "INFO",
            "monitoring-middleware",
            {
                pathname,
                method,
                service: pathname.split("/")[3] || "unknown",
            },
            {
                external_service_response_time: Math.random() * 500, // Simulate external service response time
            },
        );
    }

    // Log resource usage
    const memoryUsage = process.memoryUsage();
    monitoringEngine.logEvent(
        "RESOURCE_USAGE",
        "INFO",
        "monitoring-middleware",
        {
            pathname,
            method,
        },
        {
            memory_usage: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
            cpu_usage: Math.random() * 100, // Simulate CPU usage
        },
    );

    // Log business metrics
    if (pathname.startsWith("/api/jobs/") && method === "POST") {
        monitoringEngine.logEvent(
            "BUSINESS_METRIC",
            "INFO",
            "monitoring-middleware",
            {
                pathname,
                method,
                metric: "job_posting",
            },
            {
                job_postings: 1,
            },
        );
    }

    if (pathname.startsWith("/api/applications/") && method === "POST") {
        monitoringEngine.logEvent(
            "BUSINESS_METRIC",
            "INFO",
            "monitoring-middleware",
            {
                pathname,
                method,
                metric: "job_application",
            },
            {
                job_applications: 1,
            },
        );
    }

    // Log performance metrics
    const responseTime = Date.now() - startTime;
    monitoringEngine.logEvent(
        "PERFORMANCE_METRIC",
        "INFO",
        "monitoring-middleware",
        {
            pathname,
            method,
        },
        {
            response_time: responseTime,
            throughput: 1, // Simulate throughput
        },
    );

    return NextResponse.next();
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

