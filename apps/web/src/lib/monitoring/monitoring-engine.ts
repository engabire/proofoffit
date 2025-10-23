import { NextRequest } from "next/server";

// Monitoring Event Types
export interface MonitoringEvent {
    id: string;
    timestamp: Date;
    type: MonitoringEventType;
    severity: MonitoringSeverity;
    source: string;
    details: Record<string, any>;
    metrics?: Record<string, number>;
    tags?: Record<string, string>;
}

export type MonitoringEventType =
    | "PERFORMANCE_METRIC"
    | "ERROR_OCCURRED"
    | "USER_ACTION"
    | "SYSTEM_EVENT"
    | "API_CALL"
    | "DATABASE_QUERY"
    | "CACHE_HIT"
    | "CACHE_MISS"
    | "EXTERNAL_SERVICE_CALL"
    | "RESOURCE_USAGE"
    | "SECURITY_EVENT"
    | "BUSINESS_METRIC"
    | "AUTHENTICATION_EVENT"
    | "PAYMENT_EVENT"
    | "INTEGRATION_EVENT"
    | "DEPLOYMENT_EVENT";

export type MonitoringSeverity = "INFO" | "WARNING" | "ERROR" | "CRITICAL";

// Alert Configuration
export interface AlertConfig {
    id: string;
    name: string;
    description: string;
    condition: AlertCondition;
    severity: MonitoringSeverity;
    enabled: boolean;
    cooldownMs: number;
    lastTriggered?: Date;
    notificationChannels: NotificationChannel[];
    escalationPolicy?: EscalationPolicy;
}

export interface AlertCondition {
    metric: string;
    operator: "gt" | "lt" | "eq" | "gte" | "lte" | "contains" | "regex";
    threshold: number | string;
    timeWindowMs: number;
    aggregation?: "avg" | "sum" | "max" | "min" | "count";
}

export interface NotificationChannel {
    type: "email" | "webhook" | "slack" | "sms" | "discord" | "teams";
    config: Record<string, any>;
    enabled: boolean;
}

export interface EscalationPolicy {
    levels: EscalationLevel[];
    maxEscalations: number;
}

export interface EscalationLevel {
    delayMs: number;
    channels: NotificationChannel[];
    message?: string;
}

// Performance Metrics
export interface PerformanceMetrics {
    responseTime: number;
    throughput: number;
    errorRate: number;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
    cacheHitRate: number;
    databaseQueryTime: number;
    apiResponseTime: number;
    bundleSize: number;
    pageLoadTime: number;
    timeToInteractive: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
}

// Business Metrics
export interface BusinessMetrics {
    activeUsers: number;
    newUsers: number;
    jobApplications: number;
    jobPostings: number;
    revenue: number;
    conversionRate: number;
    userEngagement: number;
    systemUptime: number;
    subscriptionGrowth: number;
    churnRate: number;
    averageSessionDuration: number;
    pageViews: number;
    bounceRate: number;
}

// Enhanced monitoring with real-time capabilities
class MonitoringEngine {
    private events: MonitoringEvent[] = [];
    private alerts: AlertConfig[] = [];
    private metrics: Map<string, number[]> = new Map();
    private alertHistory: Array<
        { alertId: string; triggeredAt: Date; resolvedAt?: Date; escalatedLevel?: number }
    > = [];
    private realTimeSubscribers: Set<(event: MonitoringEvent) => void> = new Set();
    private metricsBuffer: Map<string, number[]> = new Map();
    private flushInterval: NodeJS.Timeout | null = null;

    constructor() {
        this.initializeDefaultAlerts();
        this.startMetricsFlush();
    }

    /**
     * Log a monitoring event with enhanced capabilities
     */
    public logEvent(
        type: MonitoringEventType,
        severity: MonitoringSeverity,
        source: string,
        details: Record<string, any>,
        metrics?: Record<string, number>,
        tags?: Record<string, string>,
    ): void {
        const event: MonitoringEvent = {
            id: this.generateEventId(),
            timestamp: new Date(),
            type,
            severity,
            source,
            details,
            metrics,
            tags,
        };

        this.events.push(event);

        // Store metrics for alerting
        if (metrics) {
            Object.entries(metrics).forEach(([key, value]) => {
                if (!this.metricsBuffer.has(key)) {
                    this.metricsBuffer.set(key, []);
                }
                this.metricsBuffer.get(key)!.push(value);
            });
        }

        // Check for alerts
        this.checkAlerts(event);

        // Notify real-time subscribers
        this.notifySubscribers(event);

        // Log to console (in production, send to monitoring service)
        console.log(`Monitoring Event [${severity}]: ${type}`, {
            id: event.id,
            timestamp: event.timestamp,
            source,
            details,
            metrics,
        });
    }

    /**
     * Subscribe to real-time monitoring events
     */
    public subscribe(callback: (event: MonitoringEvent) => void): () => void {
        this.realTimeSubscribers.add(callback);
        return () => this.realTimeSubscribers.delete(callback);
    }

    /**
     * Get performance metrics with enhanced data
     */
    public getPerformanceMetrics(): PerformanceMetrics {
        return {
            responseTime: this.getMetricAverage("response_time") || 0,
            throughput: this.getMetricAverage("throughput") || 0,
            errorRate: this.getMetricAverage("error_rate") || 0,
            cpuUsage: this.getMetricAverage("cpu_usage") || 0,
            memoryUsage: this.getMetricAverage("memory_usage") || 0,
            diskUsage: this.getMetricAverage("disk_usage") || 0,
            networkLatency: this.getMetricAverage("network_latency") || 0,
            cacheHitRate: this.getMetricAverage("cache_hit_rate") || 0,
            databaseQueryTime: this.getMetricAverage("database_query_time") || 0,
            apiResponseTime: this.getMetricAverage("api_response_time") || 0,
            bundleSize: this.getMetricAverage("bundle_size") || 0,
            pageLoadTime: this.getMetricAverage("page_load_time") || 0,
            timeToInteractive: this.getMetricAverage("time_to_interactive") || 0,
            firstContentfulPaint: this.getMetricAverage("first_contentful_paint") || 0,
            largestContentfulPaint: this.getMetricAverage("largest_contentful_paint") || 0,
            cumulativeLayoutShift: this.getMetricAverage("cumulative_layout_shift") || 0,
        };
    }

    /**
     * Get business metrics with enhanced data
     */
    public getBusinessMetrics(): BusinessMetrics {
        return {
            activeUsers: this.getMetricAverage("active_users") || 0,
            newUsers: this.getMetricAverage("new_users") || 0,
            jobApplications: this.getMetricAverage("job_applications") || 0,
            jobPostings: this.getMetricAverage("job_postings") || 0,
            revenue: this.getMetricAverage("revenue") || 0,
            conversionRate: this.getMetricAverage("conversion_rate") || 0,
            userEngagement: this.getMetricAverage("user_engagement") || 0,
            systemUptime: this.getMetricAverage("system_uptime") || 0,
            subscriptionGrowth: this.getMetricAverage("subscription_growth") || 0,
            churnRate: this.getMetricAverage("churn_rate") || 0,
            averageSessionDuration: this.getMetricAverage("average_session_duration") || 0,
            pageViews: this.getMetricAverage("page_views") || 0,
            bounceRate: this.getMetricAverage("bounce_rate") || 0,
        };
    }

    /**
     * Get monitoring events with enhanced filtering
     */
    public getEvents(filters: {
        type?: MonitoringEventType;
        severity?: MonitoringSeverity;
        source?: string;
        limit?: number;
        since?: Date;
        tags?: Record<string, string>;
    }): MonitoringEvent[] {
        let filteredEvents = this.events;

        if (filters.type) {
            filteredEvents = filteredEvents.filter((event) =>
                event.type === filters.type
            );
        }

        if (filters.severity) {
            filteredEvents = filteredEvents.filter((event) =>
                event.severity === filters.severity
            );
        }

        if (filters.source) {
            filteredEvents = filteredEvents.filter((event) =>
                event.source === filters.source
            );
        }

        if (filters.since) {
            filteredEvents = filteredEvents.filter((event) =>
                event.timestamp >= filters.since!
            );
        }

        if (filters.tags) {
            filteredEvents = filteredEvents.filter((event) => {
                if (!event.tags) return false;
                return Object.entries(filters.tags!).every(([key, value]) =>
                    event.tags![key] === value
                );
            });
        }

        // Sort by timestamp (newest first)
        filteredEvents.sort((a, b) =>
            b.timestamp.getTime() - a.timestamp.getTime()
        );

        if (filters.limit) {
            filteredEvents = filteredEvents.slice(0, filters.limit);
        }

        return filteredEvents;
    }

    /**
     * Get alert configurations
     */
    public getAlerts(): AlertConfig[] {
        return this.alerts;
    }

    /**
     * Create a new alert
     */
    public createAlert(alert: Omit<AlertConfig, "id">): string {
        const newAlert: AlertConfig = {
            ...alert,
            id: this.generateEventId(),
        };
        this.alerts.push(newAlert);
        return newAlert.id;
    }

    /**
     * Update an alert
     */
    public updateAlert(
        alertId: string,
        updates: Partial<AlertConfig>,
    ): boolean {
        const alertIndex = this.alerts.findIndex((alert) =>
            alert.id === alertId
        );
        if (alertIndex !== -1) {
            this.alerts[alertIndex] = {
                ...this.alerts[alertIndex],
                ...updates,
            };
            return true;
        }
        return false;
    }

    /**
     * Delete an alert
     */
    public deleteAlert(alertId: string): boolean {
        const alertIndex = this.alerts.findIndex((alert) =>
            alert.id === alertId
        );
        if (alertIndex !== -1) {
            this.alerts.splice(alertIndex, 1);
            return true;
        }
        return false;
    }

    /**
     * Get alert history with escalation tracking
     */
    public getAlertHistory(): Array<
        { alertId: string; triggeredAt: Date; resolvedAt?: Date; escalatedLevel?: number }
    > {
        return this.alertHistory;
    }

    /**
     * Get monitoring dashboard data with enhanced metrics
     */
    public getDashboardData(): {
        performanceMetrics: PerformanceMetrics;
        businessMetrics: BusinessMetrics;
        recentEvents: MonitoringEvent[];
        activeAlerts: AlertConfig[];
        systemHealth: {
            status: "healthy" | "warning" | "critical";
            score: number;
            issues: string[];
        };
        trends: {
            performance: Record<string, number[]>;
            business: Record<string, number[]>;
        };
    } {
        const performanceMetrics = this.getPerformanceMetrics();
        const businessMetrics = this.getBusinessMetrics();
        const recentEvents = this.getEvents({ limit: 50 });
        const activeAlerts = this.alerts.filter((alert) => alert.enabled);

        // Calculate system health
        const systemHealth = this.calculateSystemHealth(performanceMetrics);

        // Get trends data
        const trends = this.getTrendsData();

        return {
            performanceMetrics,
            businessMetrics,
            recentEvents,
            activeAlerts,
            systemHealth,
            trends,
        };
    }

    /**
     * Get trends data for charts
     */
    public getTrendsData(): {
        performance: Record<string, number[]>;
        business: Record<string, number[]>;
    } {
        const performance: Record<string, number[]> = {};
        const business: Record<string, number[]> = {};

        // Performance metrics
        const perfKeys = [
            "response_time", "throughput", "error_rate", "cpu_usage",
            "memory_usage", "cache_hit_rate", "page_load_time"
        ];
        
        perfKeys.forEach(key => {
            const values = this.metrics.get(key) || [];
            performance[key] = values.slice(-24); // Last 24 data points
        });

        // Business metrics
        const businessKeys = [
            "active_users", "new_users", "job_applications", "revenue",
            "conversion_rate", "user_engagement"
        ];
        
        businessKeys.forEach(key => {
            const values = this.metrics.get(key) || [];
            business[key] = values.slice(-24); // Last 24 data points
        });

        return { performance, business };
    }

    // Private helper methods
    private generateEventId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private getMetricAverage(metricName: string): number {
        const values = this.metrics.get(metricName);
        if (!values || values.length === 0) {
            return 0;
        }
        return values.reduce((sum, value) => sum + value, 0) / values.length;
    }

    private startMetricsFlush(): void {
        // Flush metrics buffer every 30 seconds
        this.flushInterval = setInterval(() => {
            this.flushMetricsBuffer();
        }, 30000);
    }

    private flushMetricsBuffer(): void {
        this.metricsBuffer.forEach((values, key) => {
            if (!this.metrics.has(key)) {
                this.metrics.set(key, []);
            }
            this.metrics.get(key)!.push(...values);
            
            // Keep only last 1000 values per metric
            const currentValues = this.metrics.get(key)!;
            if (currentValues.length > 1000) {
                this.metrics.set(key, currentValues.slice(-1000));
            }
        });
        
        this.metricsBuffer.clear();
    }

    private notifySubscribers(event: MonitoringEvent): void {
        this.realTimeSubscribers.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error("Error in monitoring subscriber:", error);
            }
        });
    }

    private checkAlerts(event: MonitoringEvent): void {
        this.alerts.forEach((alert) => {
            if (!alert.enabled) return;

            // Check cooldown
            if (alert.lastTriggered) {
                const timeSinceLastTrigger = Date.now() -
                    alert.lastTriggered.getTime();
                if (timeSinceLastTrigger < alert.cooldownMs) {
                    return;
                }
            }

            // Check if event matches alert condition
            if (
                event.metrics &&
                event.metrics[alert.condition.metric] !== undefined
            ) {
                const value = event.metrics[alert.condition.metric];
                const threshold = alert.condition.threshold;
                let conditionMet = false;

                switch (alert.condition.operator) {
                    case "gt":
                        conditionMet = value > threshold;
                        break;
                    case "lt":
                        conditionMet = value < threshold;
                        break;
                    case "eq":
                        conditionMet = value === threshold;
                        break;
                    case "gte":
                        conditionMet = value >= threshold;
                        break;
                    case "lte":
                        conditionMet = value <= threshold;
                        break;
                    case "contains":
                        conditionMet = String(value).includes(String(threshold));
                        break;
                    case "regex":
                        try {
                            const regex = new RegExp(String(threshold));
                            conditionMet = regex.test(String(value));
                        } catch (e) {
                            console.error("Invalid regex in alert condition:", e);
                        }
                        break;
                }

                if (conditionMet) {
                    this.triggerAlert(alert, event);
                }
            }
        });
    }

    private triggerAlert(alert: AlertConfig, event: MonitoringEvent): void {
        alert.lastTriggered = new Date();
        this.alertHistory.push({
            alertId: alert.id,
            triggeredAt: new Date(),
        });

        // Send notifications
        alert.notificationChannels.forEach((channel) => {
            if (channel.enabled) {
                this.sendNotification(channel, alert, event);
            }
        });

        // Handle escalation if configured
        if (alert.escalationPolicy) {
            this.scheduleEscalation(alert, event);
        }

        console.log(`Alert triggered: ${alert.name}`, {
            alertId: alert.id,
            eventId: event.id,
            condition: alert.condition,
            eventMetrics: event.metrics,
        });
    }

    private scheduleEscalation(alert: AlertConfig, event: MonitoringEvent): void {
        if (!alert.escalationPolicy) return;

        alert.escalationPolicy.levels.forEach((level, index) => {
            setTimeout(() => {
                // Check if alert is still active
                const recentHistory = this.alertHistory.filter(
                    h => h.alertId === alert.id && 
                    h.triggeredAt >= new Date(Date.now() - alert.escalationPolicy!.levels[index].delayMs)
                );

                if (recentHistory.length > 0 && !recentHistory[0].resolvedAt) {
                    level.channels.forEach(channel => {
                        if (channel.enabled) {
                            this.sendNotification(channel, alert, event, level.message);
                        }
                    });

                    // Update escalation level in history
                    const historyEntry = this.alertHistory.find(
                        h => h.alertId === alert.id && h.triggeredAt === alert.lastTriggered
                    );
                    if (historyEntry) {
                        historyEntry.escalatedLevel = index + 1;
                    }
                }
            }, level.delayMs);
        });
    }

    private sendNotification(
        channel: NotificationChannel,
        alert: AlertConfig,
        event: MonitoringEvent,
        customMessage?: string,
    ): void {
        const message = {
            alert: alert.name,
            description: alert.description,
            severity: alert.severity,
            timestamp: new Date().toISOString(),
            customMessage,
            event: {
                type: event.type,
                source: event.source,
                details: event.details,
                metrics: event.metrics,
            },
        };

        switch (channel.type) {
            case "email":
                // In production, send email
                console.log("Email notification:", message);
                break;
            case "webhook":
                // In production, send webhook
                if (channel.config.url) {
                    fetch(channel.config.url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(message),
                    }).catch(console.error);
                }
                break;
            case "slack":
                // In production, send Slack message
                console.log("Slack notification:", message);
                break;
            case "discord":
                // In production, send Discord message
                console.log("Discord notification:", message);
                break;
            case "teams":
                // In production, send Teams message
                console.log("Teams notification:", message);
                break;
            case "sms":
                // In production, send SMS
                console.log("SMS notification:", message);
                break;
        }
    }

    private calculateSystemHealth(metrics: PerformanceMetrics): {
        status: "healthy" | "warning" | "critical";
        score: number;
        issues: string[];
    } {
        const issues: string[] = [];
        let score = 100;

        // Check response time
        if (metrics.responseTime > 2000) {
            issues.push("High response time");
            score -= 20;
        } else if (metrics.responseTime > 1000) {
            issues.push("Elevated response time");
            score -= 10;
        }

        // Check error rate
        if (metrics.errorRate > 5) {
            issues.push("High error rate");
            score -= 25;
        } else if (metrics.errorRate > 1) {
            issues.push("Elevated error rate");
            score -= 15;
        }

        // Check CPU usage
        if (metrics.cpuUsage > 90) {
            issues.push("High CPU usage");
            score -= 20;
        } else if (metrics.cpuUsage > 70) {
            issues.push("Elevated CPU usage");
            score -= 10;
        }

        // Check memory usage
        if (metrics.memoryUsage > 90) {
            issues.push("High memory usage");
            score -= 20;
        } else if (metrics.memoryUsage > 70) {
            issues.push("Elevated memory usage");
            score -= 10;
        }

        // Check cache hit rate
        if (metrics.cacheHitRate < 70) {
            issues.push("Low cache hit rate");
            score -= 10;
        }

        // Check page load time
        if (metrics.pageLoadTime > 3000) {
            issues.push("Slow page load time");
            score -= 15;
        } else if (metrics.pageLoadTime > 2000) {
            issues.push("Elevated page load time");
            score -= 8;
        }

        // Check Core Web Vitals
        if (metrics.largestContentfulPaint > 2500) {
            issues.push("Poor Largest Contentful Paint");
            score -= 10;
        }

        if (metrics.cumulativeLayoutShift > 0.1) {
            issues.push("High Cumulative Layout Shift");
            score -= 10;
        }

        let status: "healthy" | "warning" | "critical";
        if (score >= 80) {
            status = "healthy";
        } else if (score >= 60) {
            status = "warning";
        } else {
            status = "critical";
        }

        return { status, score: Math.max(0, score), issues };
    }

    private initializeDefaultAlerts(): void {
        // High response time alert
        this.createAlert({
            name: "High Response Time",
            description: "API response time is above acceptable threshold",
            condition: {
                metric: "response_time",
                operator: "gt",
                threshold: 2000,
                timeWindowMs: 300000, // 5 minutes
            },
            severity: "WARNING",
            enabled: true,
            cooldownMs: 300000, // 5 minutes
            notificationChannels: [
                {
                    type: "webhook",
                    config: { url: process.env.MONITORING_WEBHOOK_URL },
                    enabled: true,
                },
            ],
        });

        // High error rate alert
        this.createAlert({
            name: "High Error Rate",
            description: "Error rate is above acceptable threshold",
            condition: {
                metric: "error_rate",
                operator: "gt",
                threshold: 5,
                timeWindowMs: 300000, // 5 minutes
            },
            severity: "CRITICAL",
            enabled: true,
            cooldownMs: 300000, // 5 minutes
            notificationChannels: [
                {
                    type: "webhook",
                    config: { url: process.env.MONITORING_WEBHOOK_URL },
                    enabled: true,
                },
            ],
            escalationPolicy: {
                levels: [
                    {
                        delayMs: 600000, // 10 minutes
                        channels: [
                            {
                                type: "email",
                                config: { to: process.env.ALERT_EMAIL },
                                enabled: true,
                            },
                        ],
                        message: "Error rate still elevated after 10 minutes",
                    },
                ],
                maxEscalations: 3,
            },
        });

        // High CPU usage alert
        this.createAlert({
            name: "High CPU Usage",
            description: "CPU usage is above acceptable threshold",
            condition: {
                metric: "cpu_usage",
                operator: "gt",
                threshold: 90,
                timeWindowMs: 300000, // 5 minutes
            },
            severity: "WARNING",
            enabled: true,
            cooldownMs: 300000, // 5 minutes
            notificationChannels: [
                {
                    type: "webhook",
                    config: { url: process.env.MONITORING_WEBHOOK_URL },
                    enabled: true,
                },
            ],
        });

        // Low cache hit rate alert
        this.createAlert({
            name: "Low Cache Hit Rate",
            description: "Cache hit rate is below acceptable threshold",
            condition: {
                metric: "cache_hit_rate",
                operator: "lt",
                threshold: 70,
                timeWindowMs: 300000, // 5 minutes
            },
            severity: "WARNING",
            enabled: true,
            cooldownMs: 300000, // 5 minutes
            notificationChannels: [
                {
                    type: "webhook",
                    config: { url: process.env.MONITORING_WEBHOOK_URL },
                    enabled: true,
                },
            ],
        });

        // Authentication failure alert
        this.createAlert({
            name: "High Authentication Failures",
            description: "Unusual number of authentication failures detected",
            condition: {
                metric: "auth_failures",
                operator: "gt",
                threshold: 10,
                timeWindowMs: 300000, // 5 minutes
            },
            severity: "CRITICAL",
            enabled: true,
            cooldownMs: 300000, // 5 minutes
            notificationChannels: [
                {
                    type: "webhook",
                    config: { url: process.env.SECURITY_WEBHOOK_URL },
                    enabled: true,
                },
            ],
        });

        // Payment processing alert
        this.createAlert({
            name: "Payment Processing Issues",
            description: "Payment processing error rate is elevated",
            condition: {
                metric: "payment_error_rate",
                operator: "gt",
                threshold: 2,
                timeWindowMs: 300000, // 5 minutes
            },
            severity: "CRITICAL",
            enabled: true,
            cooldownMs: 300000, // 5 minutes
            notificationChannels: [
                {
                    type: "webhook",
                    config: { url: process.env.PAYMENT_WEBHOOK_URL },
                    enabled: true,
                },
            ],
        });
    }

    /**
     * Cleanup method to stop intervals
     */
    public destroy(): void {
        if (this.flushInterval) {
            clearInterval(this.flushInterval);
        }
    }
}

// Export singleton instance
export const monitoringEngine = new MonitoringEngine();

