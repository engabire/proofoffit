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
    | "BUSINESS_METRIC";

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
}

export interface AlertCondition {
    metric: string;
    operator: "gt" | "lt" | "eq" | "gte" | "lte";
    threshold: number;
    timeWindowMs: number;
}

export interface NotificationChannel {
    type: "email" | "webhook" | "slack" | "sms";
    config: Record<string, any>;
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
}

class MonitoringEngine {
    private events: MonitoringEvent[] = [];
    private alerts: AlertConfig[] = [];
    private metrics: Map<string, number[]> = new Map();
    private alertHistory: Array<
        { alertId: string; triggeredAt: Date; resolvedAt?: Date }
    > = [];

    constructor() {
        this.initializeDefaultAlerts();
    }

    /**
     * Log a monitoring event
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
                if (!this.metrics.has(key)) {
                    this.metrics.set(key, []);
                }
                this.metrics.get(key)!.push(value);

                // Keep only last 1000 values per metric
                if (this.metrics.get(key)!.length > 1000) {
                    this.metrics.get(key)!.shift();
                }
            });
        }

        // Check for alerts
        this.checkAlerts(event);

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
     * Get performance metrics
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
            databaseQueryTime: this.getMetricAverage("database_query_time") ||
                0,
            apiResponseTime: this.getMetricAverage("api_response_time") || 0,
        };
    }

    /**
     * Get business metrics
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
        };
    }

    /**
     * Get monitoring events
     */
    public getEvents(filters: {
        type?: MonitoringEventType;
        severity?: MonitoringSeverity;
        source?: string;
        limit?: number;
        since?: Date;
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
     * Get alert history
     */
    public getAlertHistory(): Array<
        { alertId: string; triggeredAt: Date; resolvedAt?: Date }
    > {
        return this.alertHistory;
    }

    /**
     * Get monitoring dashboard data
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
    } {
        const performanceMetrics = this.getPerformanceMetrics();
        const businessMetrics = this.getBusinessMetrics();
        const recentEvents = this.getEvents({ limit: 50 });
        const activeAlerts = this.alerts.filter((alert) => alert.enabled);

        // Calculate system health
        const systemHealth = this.calculateSystemHealth(performanceMetrics);

        return {
            performanceMetrics,
            businessMetrics,
            recentEvents,
            activeAlerts,
            systemHealth,
        };
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
            this.sendNotification(channel, alert, event);
        });

        console.log(`Alert triggered: ${alert.name}`, {
            alertId: alert.id,
            eventId: event.id,
            condition: alert.condition,
            eventMetrics: event.metrics,
        });
    }

    private sendNotification(
        channel: NotificationChannel,
        alert: AlertConfig,
        event: MonitoringEvent,
    ): void {
        const message = {
            alert: alert.name,
            description: alert.description,
            severity: alert.severity,
            timestamp: new Date().toISOString(),
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
                },
            ],
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
                },
            ],
        });
    }
}

// Export singleton instance
export const monitoringEngine = new MonitoringEngine();
