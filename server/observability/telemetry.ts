/**
 * Telemetry Module with PII Redaction
 *
 * Provides comprehensive observability with automatic PII redaction,
 * golden signals monitoring, and admin dashboard data aggregation.
 */

import type { ReliabilityMetrics } from "../../domain/jobs";

export interface TelemetryEvent {
    id: string;
    timestamp: Date;
    eventType: string;
    source: string;
    userId?: string;
    sessionId?: string;
    metadata: Record<string, unknown>;
    severity: "low" | "medium" | "high" | "critical";
}

export interface GoldenSignals {
    latency: {
        p50: number;
        p95: number;
        p99: number;
        average: number;
    };
    errorRate: {
        percentage: number;
        count: number;
        total: number;
    };
    throughput: {
        requestsPerSecond: number;
        requestsPerMinute: number;
        requestsPerHour: number;
    };
    availability: {
        percentage: number;
        uptime: number;
        downtime: number;
    };
}

export interface AdminDashboardData {
    systemHealth: {
        status: "healthy" | "degraded" | "unhealthy";
        uptime: number;
        lastCheck: Date;
    };
    goldenSignals: GoldenSignals;
    providerHealth: Array<{
        providerId: string;
        status: "healthy" | "degraded" | "unhealthy";
        metrics: ReliabilityMetrics["metrics"];
        lastCheck: Date;
    }>;
    userActivity: {
        activeUsers: number;
        totalSessions: number;
        jobSearches: number;
        fitScoreCalculations: number;
    };
    errorSummary: Array<{
        errorType: string;
        count: number;
        lastOccurrence: Date;
        severity: "low" | "medium" | "high" | "critical";
    }>;
    performanceMetrics: {
        averageResponseTime: number;
        slowestEndpoints: Array<{
            endpoint: string;
            averageTime: number;
            requestCount: number;
        }>;
        memoryUsage: {
            used: number;
            total: number;
            percentage: number;
        };
    };
}

export class TelemetryModule {
    private events: TelemetryEvent[] = [];
    private readonly maxEvents = 10000;
    private readonly piiPatterns: RegExp[] = [
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
        /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
        /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, // Credit card
        /\b\d{3}-\d{3}-\d{4}\b/g, // Phone number
        /\b[A-Za-z0-9]{8,}\b/g, // Potential passwords/tokens
    ];

    /**
     * Record a telemetry event with automatic PII redaction
     */
    recordEvent(
        eventType: string,
        source: string,
        metadata: Record<string, unknown> = {},
        severity: TelemetryEvent["severity"] = "low",
        userId?: string,
        sessionId?: string,
    ): void {
        const event: TelemetryEvent = {
            id: this.generateEventId(),
            timestamp: new Date(),
            eventType,
            source,
            userId: userId ? this.redactUserId(userId) : undefined,
            sessionId: sessionId ? this.redactSessionId(sessionId) : undefined,
            metadata: this.redactMetadata(metadata),
            severity,
        };

        this.events.push(event);

        // Maintain event limit
        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(-this.maxEvents);
        }

        // Log to console in development
        if (process.env.NODE_ENV === "development") {
            console.log("Telemetry Event:", event);
        }
    }

    /**
     * Record performance metrics
     */
    recordPerformanceMetrics(
        endpoint: string,
        responseTime: number,
        statusCode: number,
        metadata: Record<string, unknown> = {},
    ): void {
        const severity = this.determineSeverityFromResponseTime(
            responseTime,
            statusCode,
        );

        this.recordEvent(
            "performance_metric",
            "api",
            {
                endpoint,
                responseTime,
                statusCode,
                ...metadata,
            },
            severity,
        );
    }

    /**
     * Record error events
     */
    recordError(
        error: Error,
        context: Record<string, unknown> = {},
        severity: TelemetryEvent["severity"] = "medium",
    ): void {
        this.recordEvent(
            "error",
            "application",
            {
                errorName: error.name,
                errorMessage: this.redactString(error.message),
                errorStack: this.redactString(error.stack || ""),
                ...context,
            },
            severity,
        );
    }

    /**
     * Record user activity
     */
    recordUserActivity(
        activity: string,
        userId: string,
        sessionId: string,
        metadata: Record<string, unknown> = {},
    ): void {
        this.recordEvent(
            "user_activity",
            "user",
            {
                activity,
                ...metadata,
            },
            "low",
            userId,
            sessionId,
        );
    }

    /**
     * Record provider health metrics
     */
    recordProviderHealth(
        providerId: string,
        metrics: ReliabilityMetrics["metrics"],
        events: ReliabilityMetrics["events"],
    ): void {
        const status = this.determineProviderStatus(metrics);
        const severity = status === "unhealthy"
            ? "high"
            : status === "degraded"
            ? "medium"
            : "low";

        this.recordEvent(
            "provider_health",
            "provider",
            {
                providerId,
                metrics,
                events,
                status,
            },
            severity,
        );
    }

    /**
     * Generate admin dashboard data
     */
    generateAdminDashboardData(): AdminDashboardData {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const recentEvents = this.events.filter((e) =>
            e.timestamp >= last24Hours
        );

        return {
            systemHealth: this.calculateSystemHealth(),
            goldenSignals: this.calculateGoldenSignals(recentEvents),
            providerHealth: this.calculateProviderHealth(recentEvents),
            userActivity: this.calculateUserActivity(recentEvents),
            errorSummary: this.calculateErrorSummary(recentEvents),
            performanceMetrics: this.calculatePerformanceMetrics(recentEvents),
        };
    }

    /**
     * Get events for a specific time range
     */
    getEvents(
        startTime: Date,
        endTime: Date,
        eventType?: string,
        severity?: TelemetryEvent["severity"],
    ): TelemetryEvent[] {
        return this.events.filter((event) => {
            const inTimeRange = event.timestamp >= startTime &&
                event.timestamp <= endTime;
            const matchesType = !eventType || event.eventType === eventType;
            const matchesSeverity = !severity || event.severity === severity;

            return inTimeRange && matchesType && matchesSeverity;
        });
    }

    /**
     * Export events for external monitoring systems
     */
    exportEvents(format: "json" | "csv" = "json"): string {
        if (format === "csv") {
            return this.exportToCSV();
        }

        return JSON.stringify(this.events, null, 2);
    }

    private redactMetadata(
        metadata: Record<string, unknown>,
    ): Record<string, unknown> {
        const redacted: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(metadata)) {
            if (typeof value === "string") {
                redacted[key] = this.redactString(value);
            } else if (typeof value === "object" && value !== null) {
                redacted[key] = this.redactMetadata(
                    value as Record<string, unknown>,
                );
            } else {
                redacted[key] = value;
            }
        }

        return redacted;
    }

    private redactString(str: string): string {
        let redacted = str;

        for (const pattern of this.piiPatterns) {
            redacted = redacted.replace(pattern, "[REDACTED]");
        }

        return redacted;
    }

    private redactUserId(userId: string): string {
        // Hash the user ID for privacy while maintaining uniqueness
        return `user_${this.hashString(userId).substring(0, 8)}`;
    }

    private redactSessionId(sessionId: string): string {
        // Hash the session ID for privacy while maintaining uniqueness
        return `session_${this.hashString(sessionId).substring(0, 8)}`;
    }

    private hashString(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    private determineSeverityFromResponseTime(
        responseTime: number,
        statusCode: number,
    ): TelemetryEvent["severity"] {
        if (statusCode >= 500) return "critical";
        if (statusCode >= 400) return "high";
        if (responseTime > 5000) return "high";
        if (responseTime > 2000) return "medium";
        return "low";
    }

    private determineProviderStatus(
        metrics: ReliabilityMetrics["metrics"],
    ): "healthy" | "degraded" | "unhealthy" {
        if (metrics.uptime < 0.95 || metrics.errorRate > 0.1) {
            return "unhealthy";
        }
        if (metrics.uptime < 0.99 || metrics.errorRate > 0.05) {
            return "degraded";
        }
        return "healthy";
    }

    private calculateSystemHealth(): AdminDashboardData["systemHealth"] {
        const now = new Date();
        const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
        const recentEvents = this.events.filter((e) => e.timestamp >= lastHour);

        const errorEvents = recentEvents.filter((e) =>
            e.eventType === "error" && e.severity === "critical"
        );
        const status = errorEvents.length > 0 ? "unhealthy" : "healthy";

        return {
            status,
            uptime: this.calculateUptime(),
            lastCheck: now,
        };
    }

    private calculateUptime(): number {
        // Simplified uptime calculation
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const recentEvents = this.events.filter((e) =>
            e.timestamp >= last24Hours
        );

        const downtimeEvents = recentEvents.filter((e) =>
            e.eventType === "error" && e.severity === "critical"
        );

        const downtimeMinutes = downtimeEvents.length * 5; // Assume 5 minutes per critical error
        const totalMinutes = 24 * 60;

        return Math.max(0, (totalMinutes - downtimeMinutes) / totalMinutes);
    }

    private calculateGoldenSignals(events: TelemetryEvent[]): GoldenSignals {
        const performanceEvents = events.filter((e) =>
            e.eventType === "performance_metric"
        );
        const responseTimes = performanceEvents
            .map((e) => e.metadata.responseTime as number)
            .filter((rt) => typeof rt === "number")
            .sort((a, b) => a - b);

        const errorEvents = events.filter((e) => e.eventType === "error");
        const totalRequests = performanceEvents.length;
        const errorCount = errorEvents.length;

        return {
            latency: {
                p50: this.percentile(responseTimes, 0.5),
                p95: this.percentile(responseTimes, 0.95),
                p99: this.percentile(responseTimes, 0.99),
                average:
                    responseTimes.reduce((a, b) => a + b, 0) /
                        responseTimes.length || 0,
            },
            errorRate: {
                percentage: totalRequests > 0
                    ? (errorCount / totalRequests) * 100
                    : 0,
                count: errorCount,
                total: totalRequests,
            },
            throughput: {
                requestsPerSecond: totalRequests / (24 * 60 * 60),
                requestsPerMinute: totalRequests / (24 * 60),
                requestsPerHour: totalRequests / 24,
            },
            availability: {
                percentage: this.calculateUptime() * 100,
                uptime: this.calculateUptime(),
                downtime: 1 - this.calculateUptime(),
            },
        };
    }

    private calculateProviderHealth(
        events: TelemetryEvent[],
    ): AdminDashboardData["providerHealth"] {
        const providerEvents = events.filter((e) =>
            e.eventType === "provider_health"
        );
        const providers = new Map<string, any>();

        for (const event of providerEvents) {
            const providerId = event.metadata.providerId as string;
            if (!providers.has(providerId)) {
                providers.set(providerId, {
                    providerId,
                    status: event.metadata.status,
                    metrics: event.metadata.metrics,
                    lastCheck: event.timestamp,
                });
            }
        }

        return Array.from(providers.values());
    }

    private calculateUserActivity(
        events: TelemetryEvent[],
    ): AdminDashboardData["userActivity"] {
        const userEvents = events.filter((e) =>
            e.eventType === "user_activity"
        );
        const uniqueUsers = new Set(
            userEvents.map((e) => e.userId).filter(Boolean),
        );
        const uniqueSessions = new Set(
            userEvents.map((e) => e.sessionId).filter(Boolean),
        );

        const jobSearches =
            events.filter((e) => e.eventType === "job_search").length;
        const fitScoreCalculations =
            events.filter((e) => e.eventType === "fitscore_calculation").length;

        return {
            activeUsers: uniqueUsers.size,
            totalSessions: uniqueSessions.size,
            jobSearches,
            fitScoreCalculations,
        };
    }

    private calculateErrorSummary(
        events: TelemetryEvent[],
    ): AdminDashboardData["errorSummary"] {
        const errorEvents = events.filter((e) => e.eventType === "error");
        const errorCounts = new Map<
            string,
            {
                count: number;
                lastOccurrence: Date;
                severity: TelemetryEvent["severity"];
            }
        >();

        for (const event of errorEvents) {
            const errorType = event.metadata.errorName as string || "Unknown";
            const existing = errorCounts.get(errorType);

            if (existing) {
                existing.count++;
                if (event.timestamp > existing.lastOccurrence) {
                    existing.lastOccurrence = event.timestamp;
                }
                if (
                    this.getSeverityLevel(event.severity) >
                        this.getSeverityLevel(existing.severity)
                ) {
                    existing.severity = event.severity;
                }
            } else {
                errorCounts.set(errorType, {
                    count: 1,
                    lastOccurrence: event.timestamp,
                    severity: event.severity,
                });
            }
        }

        return Array.from(errorCounts.entries()).map(([errorType, data]) => ({
            errorType,
            ...data,
        }));
    }

    private calculatePerformanceMetrics(
        events: TelemetryEvent[],
    ): AdminDashboardData["performanceMetrics"] {
        const performanceEvents = events.filter((e) =>
            e.eventType === "performance_metric"
        );
        const endpointTimes = new Map<string, number[]>();

        for (const event of performanceEvents) {
            const endpoint = event.metadata.endpoint as string;
            const responseTime = event.metadata.responseTime as number;

            if (!endpointTimes.has(endpoint)) {
                endpointTimes.set(endpoint, []);
            }
            endpointTimes.get(endpoint)!.push(responseTime);
        }

        const slowestEndpoints = Array.from(endpointTimes.entries())
            .map(([endpoint, times]) => ({
                endpoint,
                averageTime: times.reduce((a, b) => a + b, 0) / times.length,
                requestCount: times.length,
            }))
            .sort((a, b) => b.averageTime - a.averageTime)
            .slice(0, 10);

        const allResponseTimes = performanceEvents
            .map((e) => e.metadata.responseTime as number)
            .filter((rt) => typeof rt === "number");

        return {
            averageResponseTime:
                allResponseTimes.reduce((a, b) => a + b, 0) /
                    allResponseTimes.length || 0,
            slowestEndpoints,
            memoryUsage: {
                used: process.memoryUsage().heapUsed,
                total: process.memoryUsage().heapTotal,
                percentage:
                    (process.memoryUsage().heapUsed /
                        process.memoryUsage().heapTotal) * 100,
            },
        };
    }

    private percentile(sortedArray: number[], p: number): number {
        if (sortedArray.length === 0) return 0;
        const index = Math.ceil(sortedArray.length * p) - 1;
        return sortedArray[Math.max(0, index)];
    }

    private getSeverityLevel(severity: TelemetryEvent["severity"]): number {
        const levels = { low: 1, medium: 2, high: 3, critical: 4 };
        return levels[severity];
    }

    private generateEventId(): string {
        return `event_${Date.now()}_${
            Math.random().toString(36).substring(2, 9)
        }`;
    }

    private exportToCSV(): string {
        if (this.events.length === 0) return "";

        const headers = [
            "id",
            "timestamp",
            "eventType",
            "source",
            "userId",
            "sessionId",
            "severity",
            "metadata",
        ];
        const rows = this.events.map((event) => [
            event.id,
            event.timestamp.toISOString(),
            event.eventType,
            event.source,
            event.userId || "",
            event.sessionId || "",
            event.severity,
            JSON.stringify(event.metadata),
        ]);

        return [headers, ...rows].map((row) => row.join(",")).join("\n");
    }
}

// Global telemetry instance
export const telemetry = new TelemetryModule();
