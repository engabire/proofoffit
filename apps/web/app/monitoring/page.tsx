"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@proof-of-fit/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@proof-of-fit/ui";
import { Button } from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Bell,
    CheckCircle,
    Monitor,
    RefreshCw,
    Settings,
    Smartphone,
    TestTube,
    TrendingUp,
    Zap,
} from "lucide-react";
import { MonitoringDashboard } from "@/components/monitoring/monitoring-dashboard";
import { NotificationSettings } from "@/components/notifications/notification-settings";

export default function MonitoringPage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [systemStatus, setSystemStatus] = useState({
        performance: "healthy",
        pwa: "healthy",
        analytics: "healthy",
        testing: "healthy",
    });

    const refreshAll = () => {
        setLastRefresh(new Date());
        // Trigger refresh of all components
        window.dispatchEvent(new CustomEvent("refresh-monitoring"));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "healthy":
                return "default";
            case "warning":
                return "secondary";
            case "critical":
                return "destructive";
            default:
                return "outline";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "healthy":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "warning":
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case "critical":
                return <AlertTriangle className="h-4 w-4 text-red-500" />;
            default:
                return <Activity className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Monitoring & Testing
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Monitor application performance, test PWA
                                features, review analytics, and run
                                comprehensive tests.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">
                                Last updated: {lastRefresh.toLocaleTimeString()}
                            </div>
                            <Button
                                onClick={refreshAll}
                                variant="outline"
                                size="sm"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh All
                            </Button>
                        </div>
                    </div>
                </div>

                {/* System Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(systemStatus.performance)}
                                    <div>
                                        <p className="font-medium">
                                            Performance
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Core Web Vitals
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    variant={getStatusColor(
                                        systemStatus.performance,
                                    )}
                                >
                                    {systemStatus.performance}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(systemStatus.pwa)}
                                    <div>
                                        <p className="font-medium">
                                            PWA Features
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Offline & Install
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    variant={getStatusColor(systemStatus.pwa)}
                                >
                                    {systemStatus.pwa}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(systemStatus.analytics)}
                                    <div>
                                        <p className="font-medium">Analytics</p>
                                        <p className="text-sm text-gray-600">
                                            User Behavior
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    variant={getStatusColor(
                                        systemStatus.analytics,
                                    )}
                                >
                                    {systemStatus.analytics}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(systemStatus.testing)}
                                    <div>
                                        <p className="font-medium">Testing</p>
                                        <p className="text-sm text-gray-600">
                                            Test Suite
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    variant={getStatusColor(
                                        systemStatus.testing,
                                    )}
                                >
                                    {systemStatus.testing}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger
                            value="overview"
                            className="flex items-center gap-2"
                        >
                            <Monitor className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="performance"
                            className="flex items-center gap-2"
                        >
                            <Activity className="h-4 w-4" />
                            Performance
                        </TabsTrigger>
                        <TabsTrigger
                            value="pwa"
                            className="flex items-center gap-2"
                        >
                            <Smartphone className="h-4 w-4" />
                            PWA Testing
                        </TabsTrigger>
                        <TabsTrigger
                            value="analytics"
                            className="flex items-center gap-2"
                        >
                            <BarChart3 className="h-4 w-4" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger
                            value="testing"
                            className="flex items-center gap-2"
                        >
                            <TestTube className="h-4 w-4" />
                            Testing
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Quick Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Quick Stats
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                Performance Score
                                            </span>
                                            <span className="font-semibold text-green-600">
                                                92/100
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                PWA Score
                                            </span>
                                            <span className="font-semibold text-green-600">
                                                100/100
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                Test Coverage
                                            </span>
                                            <span className="font-semibold text-blue-600">
                                                87%
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                Active Users
                                            </span>
                                            <span className="font-semibold text-purple-600">
                                                1,247
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Alerts */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5" />
                                        Recent Alerts
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Performance Improved
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    Core Web Vitals scores
                                                    improved by 15%
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    High LCP Detected
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    Largest Contentful Paint
                                                    exceeded 2.5s
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                            <Zap className="h-4 w-4 text-blue-500" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    PWA Tests Passed
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    All PWA features working
                                                    correctly
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Button
                                        onClick={() =>
                                            setActiveTab("performance")}
                                        variant="outline"
                                        className="h-20 flex flex-col items-center justify-center gap-2"
                                    >
                                        <Activity className="h-6 w-6 text-blue-500" />
                                        <span>Check Performance</span>
                                    </Button>

                                    <Button
                                        onClick={() => setActiveTab("pwa")}
                                        variant="outline"
                                        className="h-20 flex flex-col items-center justify-center gap-2"
                                    >
                                        <Smartphone className="h-6 w-6 text-green-500" />
                                        <span>Test PWA Features</span>
                                    </Button>

                                    <Button
                                        onClick={() =>
                                            setActiveTab("analytics")}
                                        variant="outline"
                                        className="h-20 flex flex-col items-center justify-center gap-2"
                                    >
                                        <BarChart3 className="h-6 w-6 text-purple-500" />
                                        <span>Review Analytics</span>
                                    </Button>

                                    <Button
                                        onClick={() => setActiveTab("testing")}
                                        variant="outline"
                                        className="h-20 flex flex-col items-center justify-center gap-2"
                                    >
                                        <TestTube className="h-6 w-6 text-orange-500" />
                                        <span>Run Tests</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Performance Tab */}
                    <TabsContent value="performance">
                        <MonitoringDashboard />
                    </TabsContent>

                    {/* PWA Tab */}
                    <TabsContent value="pwa">
                        <MonitoringDashboard />
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics">
                        <MonitoringDashboard />
                    </TabsContent>

                    {/* Testing Tab */}
                    <TabsContent value="testing">
                        <MonitoringDashboard />
                    </TabsContent>
                </Tabs>

                {/* Notification Settings */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notification Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <NotificationSettings />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
