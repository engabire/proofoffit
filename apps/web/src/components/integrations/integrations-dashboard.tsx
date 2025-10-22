"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertCircle,
    Briefcase,
    Calendar,
    CheckCircle,
    Edit,
    ExternalLink,
    Eye,
    Mail,
    Plus,
    RefreshCw,
    Settings,
    Trash2,
    XCircle,
} from "lucide-react";

interface Integration {
    id: string;
    name: string;
    provider: string;
    type: "email" | "calendar" | "ats";
    status: "connected" | "disconnected" | "error";
    lastSync?: string;
    config?: any;
}

interface IntegrationStats {
    total: number;
    connected: number;
    disconnected: number;
    errors: number;
}

export function IntegrationsDashboard() {
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [stats, setStats] = useState<IntegrationStats>({
        total: 0,
        connected: 0,
        disconnected: 0,
        errors: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");

    const fetchIntegrations = async () => {
        setLoading(true);
        setError(null);

        try {
            // Mock data for demonstration
            const mockIntegrations: Integration[] = [
                {
                    id: "1",
                    name: "Resend Email",
                    provider: "resend",
                    type: "email",
                    status: "connected",
                    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000)
                        .toISOString(),
                    config: { domain: "proofoffit.com" },
                },
                {
                    id: "2",
                    name: "Google Calendar",
                    provider: "google",
                    type: "calendar",
                    status: "connected",
                    lastSync: new Date(Date.now() - 30 * 60 * 1000)
                        .toISOString(),
                },
                {
                    id: "3",
                    name: "Greenhouse ATS",
                    provider: "greenhouse",
                    type: "ats",
                    status: "connected",
                    lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000)
                        .toISOString(),
                },
                {
                    id: "4",
                    name: "Outlook Calendar",
                    provider: "outlook",
                    type: "calendar",
                    status: "disconnected",
                },
                {
                    id: "5",
                    name: "Lever ATS",
                    provider: "lever",
                    type: "ats",
                    status: "error",
                    lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000)
                        .toISOString(),
                },
            ];

            setIntegrations(mockIntegrations);

            // Calculate stats
            const newStats = {
                total: mockIntegrations.length,
                connected: mockIntegrations.filter((i) =>
                    i.status === "connected"
                ).length,
                disconnected: mockIntegrations.filter((i) =>
                    i.status === "disconnected"
                ).length,
                errors: mockIntegrations.filter((i) =>
                    i.status === "error"
                ).length,
            };

            setStats(newStats);
        } catch (err) {
            setError("Failed to fetch integrations");
            console.error("Error fetching integrations:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIntegrations();
    }, []);

    const handleConnect = async (provider: string, type: string) => {
        try {
            // In a real implementation, this would initiate OAuth flow
            console.log(`Connecting ${provider} ${type} integration`);

            // Mock connection
            const newIntegration: Integration = {
                id: Date.now().toString(),
                name: `${
                    provider.charAt(0).toUpperCase() + provider.slice(1)
                } ${type.toUpperCase()}`,
                provider,
                type: type as any,
                status: "connected",
                lastSync: new Date().toISOString(),
            };

            setIntegrations((prev) => [...prev, newIntegration]);
            setStats((prev) => ({
                ...prev,
                total: prev.total + 1,
                connected: prev.connected + 1,
            }));
        } catch (err) {
            console.error("Connection error:", err);
        }
    };

    const handleDisconnect = async (integrationId: string) => {
        try {
            setIntegrations((prev) =>
                prev.map((integration) =>
                    integration.id === integrationId
                        ? { ...integration, status: "disconnected" as const }
                        : integration
                )
            );

            setStats((prev) => ({
                ...prev,
                connected: prev.connected - 1,
                disconnected: prev.disconnected + 1,
            }));
        } catch (err) {
            console.error("Disconnection error:", err);
        }
    };

    const handleSync = async (integrationId: string) => {
        try {
            setIntegrations((prev) =>
                prev.map((integration) =>
                    integration.id === integrationId
                        ? { ...integration, lastSync: new Date().toISOString() }
                        : integration
                )
            );
        } catch (err) {
            console.error("Sync error:", err);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "connected":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "disconnected":
                return <XCircle className="h-4 w-4 text-gray-400" />;
            case "error":
                return <AlertCircle className="h-4 w-4 text-red-600" />;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "connected":
                return "bg-green-100 text-green-800";
            case "disconnected":
                return "bg-gray-100 text-gray-800";
            case "error":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "email":
                return <Mail className="h-5 w-5" />;
            case "calendar":
                return <Calendar className="h-5 w-5" />;
            case "ats":
                return <Briefcase className="h-5 w-5" />;
            default:
                return <Settings className="h-5 w-5" />;
        }
    };

    const formatLastSync = (lastSync?: string) => {
        if (!lastSync) return "Never";

        const date = new Date(lastSync);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="text-lg font-medium text-gray-600">
                        Loading integrations...
                    </span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">Error: {error}</span>
                    </div>
                    <p className="text-sm text-red-600 mt-2">
                        Please try again or contact support if the issue
                        persists.
                    </p>
                    <Button
                        onClick={fetchIntegrations}
                        variant="outline"
                        size="sm"
                        className="mt-4"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Integrations
                    </h2>
                    <p className="text-gray-600">
                        Connect and manage third-party services
                    </p>
                </div>
                <Button onClick={fetchIntegrations} variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Settings className="h-8 w-8 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {stats.total}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Connected
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.connected}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <XCircle className="h-8 w-8 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Disconnected
                                </p>
                                <p className="text-2xl font-bold text-gray-600">
                                    {stats.disconnected}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Errors
                                </p>
                                <p className="text-2xl font-bold text-red-600">
                                    {stats.errors}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Integration Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    <TabsTrigger value="ats">ATS</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* All Integrations */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Settings className="h-5 w-5" />
                                    <span>All Integrations</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {integrations.map((integration) => (
                                        <div
                                            key={integration.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                {getTypeIcon(integration.type)}
                                                <div>
                                                    <p className="font-medium">
                                                        {integration.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Last sync:{" "}
                                                        {formatLastSync(
                                                            integration
                                                                .lastSync,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge
                                                    className={getStatusColor(
                                                        integration.status,
                                                    )}
                                                >
                                                    {integration.status}
                                                </Badge>
                                                {integration.status ===
                                                        "connected" && (
                                                    <Button
                                                        onClick={() =>
                                                            handleSync(
                                                                integration.id,
                                                            )}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <RefreshCw className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={() =>
                                                        handleDisconnect(
                                                            integration.id,
                                                        )}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Plus className="h-5 w-5" />
                                    <span>Quick Actions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-3">
                                        <Button
                                            onClick={() =>
                                                handleConnect(
                                                    "resend",
                                                    "email",
                                                )}
                                            variant="outline"
                                            className="justify-start"
                                        >
                                            <Mail className="mr-2 h-4 w-4" />
                                            Connect Email Service
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleConnect(
                                                    "google",
                                                    "calendar",
                                                )}
                                            variant="outline"
                                            className="justify-start"
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Connect Calendar
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleConnect(
                                                    "greenhouse",
                                                    "ats",
                                                )}
                                            variant="outline"
                                            className="justify-start"
                                        >
                                            <Briefcase className="mr-2 h-4 w-4" />
                                            Connect ATS
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Mail className="h-5 w-5" />
                                <span>Email Integrations</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {integrations
                                    .filter((i) => i.type === "email")
                                    .map((integration) => (
                                        <div
                                            key={integration.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Mail className="h-5 w-5 text-blue-600" />
                                                <div>
                                                    <p className="font-medium">
                                                        {integration.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Provider:{" "}
                                                        {integration.provider}
                                                    </p>
                                                    {integration.config
                                                        ?.domain && (
                                                        <p className="text-sm text-gray-500">
                                                            Domain:{" "}
                                                            {integration.config
                                                                .domain}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(
                                                    integration.status,
                                                )}
                                                <Badge
                                                    className={getStatusColor(
                                                        integration.status,
                                                    )}
                                                >
                                                    {integration.status}
                                                </Badge>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="calendar" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5" />
                                <span>Calendar Integrations</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {integrations
                                    .filter((i) => i.type === "calendar")
                                    .map((integration) => (
                                        <div
                                            key={integration.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Calendar className="h-5 w-5 text-green-600" />
                                                <div>
                                                    <p className="font-medium">
                                                        {integration.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Provider:{" "}
                                                        {integration.provider}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Last sync:{" "}
                                                        {formatLastSync(
                                                            integration
                                                                .lastSync,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(
                                                    integration.status,
                                                )}
                                                <Badge
                                                    className={getStatusColor(
                                                        integration.status,
                                                    )}
                                                >
                                                    {integration.status}
                                                </Badge>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ats" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Briefcase className="h-5 w-5" />
                                <span>ATS Integrations</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {integrations
                                    .filter((i) => i.type === "ats")
                                    .map((integration) => (
                                        <div
                                            key={integration.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Briefcase className="h-5 w-5 text-purple-600" />
                                                <div>
                                                    <p className="font-medium">
                                                        {integration.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Provider:{" "}
                                                        {integration.provider}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Last sync:{" "}
                                                        {formatLastSync(
                                                            integration
                                                                .lastSync,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(
                                                    integration.status,
                                                )}
                                                <Badge
                                                    className={getStatusColor(
                                                        integration.status,
                                                    )}
                                                >
                                                    {integration.status}
                                                </Badge>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

