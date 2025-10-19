"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import { Button } from "@proof-of-fit/ui";
import { Alert, AlertDescription, AlertTitle } from "@proof-of-fit/ui";
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    Shield,
    TrendingDown,
    TrendingUp,
    Zap,
} from "lucide-react";

interface PerformanceAlert {
    id: string;
    type: "warning" | "error" | "info" | "success";
    title: string;
    description: string;
    metric: string;
    value: number;
    threshold: number;
    timestamp: Date;
    severity: "low" | "medium" | "high" | "critical";
    resolved: boolean;
}

interface PerformanceAlertsProps {
    onAlertClick?: (alert: PerformanceAlert) => void;
}

export function PerformanceAlerts({ onAlertClick }: PerformanceAlertsProps) {
    const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching performance alerts
        const fetchAlerts = async () => {
            setIsLoading(true);

            // Mock data - in production, this would come from your monitoring system
            const mockAlerts: PerformanceAlert[] = [
                {
                    id: "1",
                    type: "warning",
                    title: "High LCP Detected",
                    description:
                        "Largest Contentful Paint exceeded 2.5s threshold",
                    metric: "LCP",
                    value: 3.2,
                    threshold: 2.5,
                    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
                    severity: "medium",
                    resolved: false,
                },
                {
                    id: "2",
                    type: "error",
                    title: "Memory Usage Spike",
                    description: "JavaScript heap usage exceeded 80%",
                    metric: "Memory",
                    value: 85,
                    threshold: 80,
                    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
                    severity: "high",
                    resolved: false,
                },
                {
                    id: "3",
                    type: "success",
                    title: "Performance Improved",
                    description: "Core Web Vitals scores improved by 15%",
                    metric: "Overall Score",
                    value: 92,
                    threshold: 85,
                    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
                    severity: "low",
                    resolved: true,
                },
            ];

            setAlerts(mockAlerts);
            setIsLoading(false);
        };

        fetchAlerts();

        // Set up real-time monitoring
        const interval = setInterval(fetchAlerts, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const getAlertIcon = (type: string, severity: string) => {
        if (type === "error" || severity === "critical") {
            return <AlertTriangle className="h-4 w-4 text-red-500" />;
        }
        if (type === "warning" || severity === "high") {
            return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        }
        if (type === "success") {
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        }
        return <Activity className="h-4 w-4 text-blue-500" />;
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "critical":
                return "destructive";
            case "high":
                return "destructive";
            case "medium":
                return "secondary";
            case "low":
                return "outline";
            default:
                return "outline";
        }
    };

    const resolveAlert = (alertId: string) => {
        setAlerts((prev) =>
            prev.map((alert) =>
                alert.id === alertId ? { ...alert, resolved: true } : alert
            )
        );
    };

    const activeAlerts = alerts.filter((alert) => !alert.resolved);
    const resolvedAlerts = alerts.filter((alert) => alert.resolved);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Performance Alerts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600">
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Active Alerts */}
            {activeAlerts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Active Alerts ({activeAlerts.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeAlerts.map((alert) => (
                            <Alert
                                key={alert.id}
                                className="border-l-4 border-l-red-500"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        {getAlertIcon(
                                            alert.type,
                                            alert.severity,
                                        )}
                                        <div className="flex-1">
                                            <AlertTitle className="flex items-center gap-2">
                                                {alert.title}
                                                <Badge
                                                    variant={getSeverityColor(
                                                        alert.severity,
                                                    )}
                                                >
                                                    {alert.severity}
                                                </Badge>
                                            </AlertTitle>
                                            <AlertDescription className="mt-1">
                                                {alert.description}
                                            </AlertDescription>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <TrendingDown className="h-3 w-3" />
                                                    {alert.metric}:{" "}
                                                    {alert.value} (threshold:
                                                    {" "}
                                                    {alert.threshold})
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {alert.timestamp
                                                        .toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => resolveAlert(alert.id)}
                                    >
                                        Resolve
                                    </Button>
                                </div>
                            </Alert>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Resolved Alerts */}
            {resolvedAlerts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            Resolved Alerts ({resolvedAlerts.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {resolvedAlerts.map((alert) => (
                            <Alert
                                key={alert.id}
                                className="border-l-4 border-l-green-500 opacity-75"
                            >
                                <div className="flex items-start gap-3">
                                    {getAlertIcon(alert.type, alert.severity)}
                                    <div className="flex-1">
                                        <AlertTitle className="flex items-center gap-2">
                                            {alert.title}
                                            <Badge
                                                variant="outline"
                                                className="text-green-600"
                                            >
                                                Resolved
                                            </Badge>
                                        </AlertTitle>
                                        <AlertDescription className="mt-1">
                                            {alert.description}
                                        </AlertDescription>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <TrendingUp className="h-3 w-3" />
                                                {alert.metric}: {alert.value}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {alert.timestamp
                                                    .toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Alert>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* No Alerts */}
            {alerts.length === 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-500" />
                            Performance Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                All Systems Operational
                            </h3>
                            <p className="text-gray-600">
                                No performance alerts detected. Your application
                                is running smoothly.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
