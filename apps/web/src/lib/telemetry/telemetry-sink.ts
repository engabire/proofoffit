/**
 * Telemetry Sink
 *
 * This module handles sending analytics events to downstream telemetry systems
 * for GTM (Go-to-Market) tracking and business intelligence.
 */

import { monitoringEngine } from "../monitoring/monitoring-engine";
import { securityMonitor } from "../security/security-monitor";

export interface TelemetryEvent {
    eventId: string;
    timestamp: Date;
    eventType: string;
    userId?: string;
    sessionId?: string;
    properties: Record<string, any>;
    metrics?: Record<string, number>;
    tags?: Record<string, string>;
}

export interface TelemetrySinkConfig {
    enabled: boolean;
    endpoints: {
        gtm: string;
        analytics: string;
        monitoring: string;
    };
    batchSize: number;
    flushIntervalMs: number;
    retryAttempts: number;
    retryDelayMs: number;
}

class TelemetrySink {
    private config: TelemetrySinkConfig;
    private eventQueue: TelemetryEvent[] = [];
    private flushTimer?: NodeJS.Timeout;
    private isProcessing = false;

    constructor() {
        this.config = this.getConfig();
        this.initializeFlushTimer();
    }

    /**
     * Send a telemetry event
     */
    public async sendEvent(
        event: Omit<TelemetryEvent, "eventId" | "timestamp">,
    ): Promise<void> {
        if (!this.config.enabled) {
            console.log("Telemetry disabled, skipping event:", event.eventType);
            return;
        }

        const telemetryEvent: TelemetryEvent = {
            ...event,
            eventId: this.generateEventId(),
            timestamp: new Date(),
        };

        // Add to queue
        this.eventQueue.push(telemetryEvent);

        // Log to monitoring system
        this.logToMonitoring(telemetryEvent);

        // Log to security system if it's a security-related event
        if (this.isSecurityEvent(telemetryEvent)) {
            this.logToSecurity(telemetryEvent);
        }

        // Flush if queue is full
        if (this.eventQueue.length >= this.config.batchSize) {
            await this.flush();
        }
    }

    /**
     * Send job search performed event specifically for GTM tracking
     */
    public async sendJobSearchEvent(data: {
        userId?: string;
        sessionId?: string;
        searchQuery: string;
        filters: Record<string, any>;
        resultsCount: number;
        responseTime: number;
        isRealData: boolean;
        source: "external" | "supabase" | "mock";
    }): Promise<void> {
        await this.sendEvent({
            eventType: "job_search_performed",
            userId: data.userId,
            sessionId: data.sessionId,
            properties: {
                searchQuery: data.searchQuery,
                filters: data.filters,
                resultsCount: data.resultsCount,
                isRealData: data.isRealData,
                source: data.source,
            },
            metrics: {
                responseTime: data.responseTime,
                resultsCount: data.resultsCount,
            },
            tags: {
                feature: "job_search",
                data_source: data.source,
                real_data: data.isRealData.toString(),
            },
        });
    }

    /**
     * Send user engagement event
     */
    public async sendUserEngagementEvent(data: {
        userId: string;
        sessionId?: string;
        action: string;
        page: string;
        duration?: number;
        properties?: Record<string, any>;
    }): Promise<void> {
        await this.sendEvent({
            eventType: "user_engagement",
            userId: data.userId,
            sessionId: data.sessionId,
            properties: {
                action: data.action,
                page: data.page,
                ...data.properties,
            },
            metrics: {
                duration: data.duration || 0,
            },
            tags: {
                feature: "user_engagement",
                action: data.action,
                page: data.page,
            },
        });
    }

    /**
     * Send conversion event
     */
    public async sendConversionEvent(data: {
        userId: string;
        sessionId?: string;
        conversionType:
            | "job_application"
            | "profile_completion"
            | "subscription"
            | "signup";
        value?: number;
        properties?: Record<string, any>;
    }): Promise<void> {
        await this.sendEvent({
            eventType: "conversion",
            userId: data.userId,
            sessionId: data.sessionId,
            properties: {
                conversionType: data.conversionType,
                ...data.properties,
            },
            metrics: {
                value: data.value || 0,
            },
            tags: {
                feature: "conversion",
                conversion_type: data.conversionType,
            },
        });
    }

    /**
     * Send performance event
     */
    public async sendPerformanceEvent(data: {
        eventType: string;
        userId?: string;
        sessionId?: string;
        metrics: Record<string, number>;
        properties?: Record<string, any>;
    }): Promise<void> {
        await this.sendEvent({
            eventType: data.eventType,
            userId: data.userId,
            sessionId: data.sessionId,
            properties: data.properties || {},
            metrics: data.metrics,
            tags: {
                feature: "performance",
                event_type: data.eventType,
            },
        });
    }

    /**
     * Flush all queued events
     */
    public async flush(): Promise<void> {
        if (this.isProcessing || this.eventQueue.length === 0) {
            return;
        }

        this.isProcessing = true;
        const events = [...this.eventQueue];
        this.eventQueue = [];

        try {
            await this.sendBatch(events);
        } catch (error) {
            console.error("Failed to flush telemetry events:", error);
            // Re-queue events for retry (with limit to prevent memory issues)
            if (this.eventQueue.length < 1000) {
                this.eventQueue.unshift(...events);
            }
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Get telemetry configuration
     */
    private getConfig(): TelemetrySinkConfig {
        return {
            enabled: process.env.ENABLE_TELEMETRY === "true",
            endpoints: {
                gtm: process.env.TELEMETRY_GTM_ENDPOINT || "",
                analytics: process.env.TELEMETRY_ANALYTICS_ENDPOINT || "",
                monitoring: process.env.TELEMETRY_MONITORING_ENDPOINT || "",
            },
            batchSize: parseInt(process.env.TELEMETRY_BATCH_SIZE || "10"),
            flushIntervalMs: parseInt(
                process.env.TELEMETRY_FLUSH_INTERVAL_MS || "30000",
            ), // 30 seconds
            retryAttempts: parseInt(
                process.env.TELEMETRY_RETRY_ATTEMPTS || "3",
            ),
            retryDelayMs: parseInt(
                process.env.TELEMETRY_RETRY_DELAY_MS || "1000",
            ),
        };
    }

    /**
     * Initialize flush timer
     */
    private initializeFlushTimer(): void {
        if (this.config.enabled) {
            this.flushTimer = setInterval(() => {
                this.flush();
            }, this.config.flushIntervalMs);
        }
    }

    /**
     * Send batch of events to endpoints
     */
    private async sendBatch(events: TelemetryEvent[]): Promise<void> {
        const promises: Promise<void>[] = [];

        // Send to GTM endpoint
        if (this.config.endpoints.gtm) {
            promises.push(
                this.sendToEndpoint(this.config.endpoints.gtm, events, "GTM"),
            );
        }

        // Send to analytics endpoint
        if (this.config.endpoints.analytics) {
            promises.push(
                this.sendToEndpoint(
                    this.config.endpoints.analytics,
                    events,
                    "Analytics",
                ),
            );
        }

        // Send to monitoring endpoint
        if (this.config.endpoints.monitoring) {
            promises.push(
                this.sendToEndpoint(
                    this.config.endpoints.monitoring,
                    events,
                    "Monitoring",
                ),
            );
        }

        await Promise.allSettled(promises);
    }

    /**
     * Send events to a specific endpoint
     */
    private async sendToEndpoint(
        endpoint: string,
        events: TelemetryEvent[],
        endpointName: string,
    ): Promise<void> {
        for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":
                            `Bearer ${process.env.TELEMETRY_API_KEY}`,
                        "User-Agent": "ProofOfFit-Telemetry/1.0",
                    },
                    body: JSON.stringify({
                        events,
                        metadata: {
                            source: "proofoffit",
                            timestamp: new Date().toISOString(),
                            batchSize: events.length,
                        },
                    }),
                });

                if (!response.ok) {
                    throw new Error(
                        `HTTP ${response.status}: ${response.statusText}`,
                    );
                }

                console.log(
                    `Successfully sent ${events.length} events to ${endpointName}`,
                );
                return;
            } catch (error) {
                console.error(
                    `Failed to send events to ${endpointName} (attempt ${attempt}):`,
                    error,
                );

                if (attempt < this.config.retryAttempts) {
                    await this.delay(this.config.retryDelayMs * attempt);
                } else {
                    throw error;
                }
            }
        }
    }

    /**
     * Log event to monitoring system
     */
    private logToMonitoring(event: TelemetryEvent): void {
        monitoringEngine.logEvent(
            "BUSINESS_METRIC",
            "INFO",
            "telemetry-sink",
            {
                eventType: event.eventType,
                userId: event.userId,
                sessionId: event.sessionId,
                properties: event.properties,
                tags: event.tags,
            },
            event.metrics,
            event.tags,
        );
    }

    /**
     * Log event to security system
     */
    private logToSecurity(event: TelemetryEvent): void {
        // Only log security-related events
        if (
            event.eventType.includes("security") ||
            event.eventType.includes("auth")
        ) {
            securityMonitor.logEvent(
                "SUSPICIOUS_ACTIVITY",
                "LOW",
                "telemetry-sink",
                {
                    eventType: event.eventType,
                    userId: event.userId,
                    properties: event.properties,
                },
                undefined as any, // Request object not available here
                event.userId,
            );
        }
    }

    /**
     * Check if event is security-related
     */
    private isSecurityEvent(event: TelemetryEvent): boolean {
        const securityEventTypes = [
            "user_login",
            "user_logout",
            "user_signup",
            "password_change",
            "security_event",
            "auth_failure",
            "suspicious_activity",
        ];

        return securityEventTypes.some((type) =>
            event.eventType.includes(type)
        );
    }

    /**
     * Generate unique event ID
     */
    private generateEventId(): string {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Delay utility
     */
    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Cleanup resources
     */
    public destroy(): void {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        // Flush remaining events
        this.flush();
    }
}

// Export singleton instance
export const telemetrySink = new TelemetrySink();
