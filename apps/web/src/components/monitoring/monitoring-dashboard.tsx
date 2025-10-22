"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Activity,
    AlertTriangle,
    Bell,
    CheckCircle,
    Clock,
    Cpu,
    Database,
    Eye,
    Globe,
    HardDrive,
    Network,
    RefreshCw,
    Settings,
    TrendingDown,
    TrendingUp,
    Users,
    XCircle,
} from "lucide-react";
import {
    AlertConfig,
    monitoringEngine,
    MonitoringEvent,
    MonitoringEventType,
    MonitoringSeverity,
} from "@/lib/monitoring/monitoring-engine";

interface MonitoringDashboardProps {
    // No props needed for now
}

export function MonitoringDashboard({}: MonitoringDashboardProps) {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState<
        "overview" | "events" | "alerts"
    >("overview");

    useEffect(() => {
        const fetchMonitoringData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Simulate fetching monitoring data
                // In a real app, this would come from an API endpoint
                const data = monitoringEngine.getDashboardData();
                setDashboardData(data);
            } catch (err) {
                setError("Failed to fetch monitoring data");
                console.error("Monitoring dashboard error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMonitoringData();

        // Set up real-time updates
        const interval = setInterval(fetchMonitoringData, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const getSeverityColor = (severity: MonitoringSeverity) => {
        switch (severity) {
            case "INFO":
                return "bg-blue-500";
            case "WARNING":
                return "bg-yellow-500";
            case "ERROR":
                return "bg-orange-500";
            case "CRITICAL":
                return "bg-red-500";
        }
    };

    const getSeverityIcon = (severity: MonitoringSeverity) => {
        switch (severity) {
            case "INFO":
                return <CheckCircle className="h-4 w-4 text-blue-500" />;
            case "WARNING":
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case "ERROR":
                return <XCircle className="h-4 w-4 text-orange-500" />;
            case "CRITICAL":
                return <XCircle className="h-4 w-4 text-red-500" />;
        }
    };

    const getHealthStatusColor = (status: string) => {
        switch (status) {
            case "healthy":
                return "text-green-600";
            case "warning":
                return "text-yellow-600";
            case "critical":
                return "text-red-600";
        }
    };

    const formatEventType = (type: MonitoringEventType): string => {
        return type.replace(/_/g, " ").toLowerCase().replace(
            /\b\w/g,
            (l) => l.toUpperCase(),
        );
    };

    const formatTimestamp = (timestamp: Date): string => {
        return new Date(timestamp).toLocaleString();
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-lg text-gray-600">
                    Loading monitoring data...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-600">
                <p className="text-lg">Error: {error}</p>
                <p className="text-sm text-gray-500">
                    Please try refreshing the page.
                </p>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No monitoring data available.</p>
            </div>
        );
    }

    const {
        performanceMetrics,
        businessMetrics,
        recentEvents,
        activeAlerts,
        systemHealth,
    } = dashboardData;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Monitoring Dashboard</h2>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                    <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" /> Settings
                    </Button>
                </div>
            </div>

            {/* System Health */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        System Health
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <div
                                className={`text-2xl font-bold ${
                                    getHealthStatusColor(systemHealth.status)
                                }`}
                            >
                                {systemHealth.score}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Status: {systemHealth.status.toUpperCase()}
                            </p>
                        </div>
                        <div className="flex-1 ml-4">
                            <Progress
                                value={systemHealth.score}
                                className="h-3"
                            />
                        </div>
                    </div>
                    {systemHealth.issues.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-red-600 mb-2">
                                Issues:
                            </p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {systemHealth.issues.map((issue: string, index: number) => (
                                    <li key={index}>{issue}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Response Time
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {performanceMetrics.responseTime.toFixed(0)}ms
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {performanceMetrics.responseTime > 1000
                                ? (
                                    <span className="text-red-500 flex items-center">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        Above threshold
                                    </span>
                                )
                                : (
                                    <span className="text-green-500 flex items-center">
                                        <TrendingDown className="h-3 w-3 mr-1" />
                                        Within threshold
                                    </span>
                                )}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Error Rate
                        </CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {performanceMetrics.errorRate.toFixed(2)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {performanceMetrics.errorRate > 5
                                ? (
                                    <span className="text-red-500 flex items-center">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        Above threshold
                                    </span>
                                )
                                : (
                                    <span className="text-green-500 flex items-center">
                                        <TrendingDown className="h-3 w-3 mr-1" />
                                        Within threshold
                                    </span>
                                )}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            CPU Usage
                        </CardTitle>
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {performanceMetrics.cpuUsage.toFixed(1)}%
                        </div>
                        <Progress
                            value={performanceMetrics.cpuUsage}
                            className="h-2 mt-2"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Memory Usage
                        </CardTitle>
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {performanceMetrics.memoryUsage.toFixed(1)}%
                        </div>
                        <Progress
                            value={performanceMetrics.memoryUsage}
                            className="h-2 mt-2"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Business Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {businessMetrics.activeUsers}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +{businessMetrics.newUsers} new users
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Job Applications
                        </CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {businessMetrics.jobApplications}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {businessMetrics.jobPostings} job postings
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Conversion Rate
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {businessMetrics.conversionRate.toFixed(2)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            User engagement:{" "}
                            {businessMetrics.userEngagement.toFixed(1)}%
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            System Uptime
                        </CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {businessMetrics.systemUptime.toFixed(2)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Last 24 hours
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b">
                <Button
                    variant={selectedTab === "overview" ? "default" : "ghost"}
                    onClick={() => setSelectedTab("overview")}
                >
                    <Eye className="h-4 w-4 mr-2" />
                    Overview
                </Button>
                <Button
                    variant={selectedTab === "events" ? "default" : "ghost"}
                    onClick={() => setSelectedTab("events")}
                >
                    <Activity className="h-4 w-4 mr-2" />
                    Events ({recentEvents.length})
                </Button>
                <Button
                    variant={selectedTab === "alerts" ? "default" : "ghost"}
                    onClick={() => setSelectedTab("alerts")}
                >
                    <Bell className="h-4 w-4 mr-2" />
                    Alerts ({activeAlerts.length})
                </Button>
            </div>

            {/* Tab Content */}
            {selectedTab === "overview" && (
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentEvents.slice(0, 5).map((event: any) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center space-x-3"
                                    >
                                        {getSeverityIcon(event.severity)}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                {formatEventType(event.type)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {event.source}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`${
                                                getSeverityColor(event.severity)
                                            } text-white`}
                                        >
                                            {event.severity}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Active Alerts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {activeAlerts.slice(0, 5).map((alert: any) => (
                                    <div
                                        key={alert.id}
                                        className="flex items-center space-x-3"
                                    >
                                        <Bell className="h-4 w-4 text-yellow-500" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                {alert.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {alert.description}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`${
                                                getSeverityColor(alert.severity)
                                            } text-white`}
                                        >
                                            {alert.severity}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {selectedTab === "events" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentEvents.length === 0
                                ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <p>No recent events found.</p>
                                    </div>
                                )
                                : (
                                    recentEvents.map((event: any) => (
                                        <div
                                            key={event.id}
                                            className="border rounded-lg p-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    {getSeverityIcon(
                                                        event.severity,
                                                    )}
                                                    <div>
                                                        <h4 className="font-medium">
                                                            {formatEventType(
                                                                event.type,
                                                            )}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">
                                                            {event.source} •
                                                            {" "}
                                                            {formatTimestamp(
                                                                event.timestamp,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={`${
                                                        getSeverityColor(
                                                            event.severity,
                                                        )
                                                    } text-white`}
                                                >
                                                    {event.severity}
                                                </Badge>
                                            </div>
                                            {event.details &&
                                                Object.keys(event.details)
                                                        .length > 0 &&
                                                (
                                                    <div className="mt-3">
                                                        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                          {JSON.stringify(event.details, null, 2)}
                                                        </pre>
                                                    </div>
                                                )}
                                        </div>
                                    ))
                                )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {selectedTab === "alerts" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Active Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activeAlerts.length === 0
                                ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <p>No active alerts.</p>
                                    </div>
                                )
                                : (
                                    activeAlerts.map((alert: any) => (
                                        <div
                                            key={alert.id}
                                            className="border rounded-lg p-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Bell className="h-5 w-5 text-yellow-500" />
                                                    <div>
                                                        <h4 className="font-medium">
                                                            {alert.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">
                                                            {alert.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={`${
                                                            getSeverityColor(
                                                                alert.severity,
                                                            )
                                                        } text-white`}
                                                    >
                                                        {alert.severity}
                                                    </Badge>
                                                    <Badge
                                                        variant={alert.enabled
                                                            ? "default"
                                                            : "secondary"}
                                                    >
                                                        {alert.enabled
                                                            ? "Enabled"
                                                            : "Disabled"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-sm text-gray-600">
                                                <p>
                                                    <strong>Condition:</strong>
                                                    {" "}
                                                    {alert.condition.metric}
                                                    {" "}
                                                    {alert.condition.operator}
                                                    {" "}
                                                    {alert.condition.threshold}
                                                </p>
                                                <p>
                                                    <strong>Cooldown:</strong>
                                                    {" "}
                                                    {alert.cooldownMs / 1000}s
                                                </p>
                                                {alert.lastTriggered && (
                                                    <p>
                                                        <strong>
                                                            Last Triggered:
                                                        </strong>{" "}
                                                        {formatTimestamp(
                                                            alert.lastTriggered,
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
