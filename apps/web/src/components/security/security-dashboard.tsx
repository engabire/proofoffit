"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    Eye,
    Filter,
    Globe,
    Lock,
    RefreshCw,
    Shield,
    Unlock,
    Users,
    XCircle,
} from "lucide-react";
import {
    SecurityEvent,
    SecurityEventType,
    securityMonitor,
    SecuritySeverity,
} from "@/lib/security/security-monitor";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SecurityDashboardProps {
    // No props needed for now, as data is fetched internally
}

export function SecurityDashboard({}: SecurityDashboardProps) {
    const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
    const [securityStats, setSecurityStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        type: "all" as SecurityEventType | "all",
        severity: "all" as SecuritySeverity | "all",
        resolved: "all" as "all" | "true" | "false",
        limit: 50,
    });
    const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(
        null,
    );

    useEffect(() => {
        const fetchSecurityData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Simulate fetching security data
                // In a real app, this would come from an API endpoint
                const events = securityMonitor.getSecurityEvents({
                    type: filters.type === "all" ? undefined : filters.type,
                    severity: filters.severity === "all"
                        ? undefined
                        : filters.severity,
                    resolved: filters.resolved === "all"
                        ? undefined
                        : filters.resolved === "true",
                    limit: filters.limit,
                });

                const stats = securityMonitor.getSecurityStats();

                setSecurityEvents(events);
                setSecurityStats(stats);
            } catch (err) {
                setError("Failed to fetch security data");
                console.error("Security dashboard error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSecurityData();
    }, [filters]);

    const getSeverityColor = (severity: SecuritySeverity) => {
        switch (severity) {
            case "LOW":
                return "bg-blue-500";
            case "MEDIUM":
                return "bg-yellow-500";
            case "HIGH":
                return "bg-orange-500";
            case "CRITICAL":
                return "bg-red-500";
        }
    };

    const getSeverityIcon = (severity: SecuritySeverity) => {
        switch (severity) {
            case "LOW":
                return <CheckCircle className="h-4 w-4 text-blue-500" />;
            case "MEDIUM":
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case "HIGH":
                return <AlertTriangle className="h-4 w-4 text-orange-500" />;
            case "CRITICAL":
                return <XCircle className="h-4 w-4 text-red-500" />;
        }
    };

    const formatEventType = (type: SecurityEventType): string => {
        return type.replace(/_/g, " ").toLowerCase().replace(
            /\b\w/g,
            (l) => l.toUpperCase(),
        );
    };

    const formatTimestamp = (timestamp: Date): string => {
        return new Date(timestamp).toLocaleString();
    };

    const handleResolveEvent = async (eventId: string) => {
        try {
            const success = securityMonitor.resolveEvent(eventId, "admin");
            if (success) {
                // Refresh the data
                const events = securityMonitor.getSecurityEvents({
                    type: filters.type === "all" ? undefined : filters.type,
                    severity: filters.severity === "all"
                        ? undefined
                        : filters.severity,
                    resolved: filters.resolved === "all"
                        ? undefined
                        : filters.resolved === "true",
                    limit: filters.limit,
                });
                setSecurityEvents(events);
            }
        } catch (error) {
            console.error("Failed to resolve event:", error);
        }
    };

    const handleUnblockIP = async (ipAddress: string) => {
        try {
            const success = securityMonitor.unblockIP(ipAddress);
            if (success) {
                // Refresh the data
                const stats = securityMonitor.getSecurityStats();
                setSecurityStats(stats);
            }
        } catch (error) {
            console.error("Failed to unblock IP:", error);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-lg text-gray-600">
                    Loading security data...
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

    if (!securityStats) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No security data available.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Security Dashboard</h2>
                <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                >
                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
            </div>

            {/* Security Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Events
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {securityStats.totalEvents}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {securityStats.unresolvedEvents} unresolved
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Critical Events
                        </CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {securityStats.eventsBySeverity.CRITICAL || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Immediate attention required
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Suspicious IPs
                        </CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {securityStats.suspiciousIPs}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {securityStats.blockedIPs} blocked
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Security Score
                        </CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {Math.max(
                                0,
                                100 -
                                    (securityStats.eventsBySeverity.CRITICAL ||
                                            0) * 10 -
                                    (securityStats.eventsBySeverity.HIGH || 0) *
                                        5,
                            )}
                        </div>
                        <Progress
                            value={Math.max(
                                0,
                                100 -
                                    (securityStats.eventsBySeverity.CRITICAL ||
                                            0) * 10 -
                                    (securityStats.eventsBySeverity.HIGH || 0) *
                                        5,
                            )}
                            className="h-2 mt-2"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Event Type Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle>Event Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {Object.entries(securityStats.eventsBySeverity).map((
                            [severity, count],
                        ) => (
                            <div
                                key={severity}
                                className="flex items-center space-x-2"
                            >
                                {getSeverityIcon(severity as SecuritySeverity)}
                                <span className="text-sm font-medium">
                                    {severity}
                                </span>
                                <Badge variant="outline">
                                    {count as number}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Filter className="h-5 w-5 mr-2" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <Label htmlFor="type-filter">Event Type</Label>
                            <Select
                                value={filters.type}
                                onValueChange={(value) =>
                                    setFilters({
                                        ...filters,
                                        type: value as
                                            | SecurityEventType
                                            | "all",
                                    })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Types
                                    </SelectItem>
                                    <SelectItem value="AUTHENTICATION_FAILURE">
                                        Authentication Failure
                                    </SelectItem>
                                    <SelectItem value="AUTHORIZATION_FAILURE">
                                        Authorization Failure
                                    </SelectItem>
                                    <SelectItem value="RATE_LIMIT_EXCEEDED">
                                        Rate Limit Exceeded
                                    </SelectItem>
                                    <SelectItem value="SUSPICIOUS_ACTIVITY">
                                        Suspicious Activity
                                    </SelectItem>
                                    <SelectItem value="CSRF_ATTACK">
                                        CSRF Attack
                                    </SelectItem>
                                    <SelectItem value="XSS_ATTEMPT">
                                        XSS Attempt
                                    </SelectItem>
                                    <SelectItem value="SQL_INJECTION_ATTEMPT">
                                        SQL Injection Attempt
                                    </SelectItem>
                                    <SelectItem value="BRUTE_FORCE_ATTACK">
                                        Brute Force Attack
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="severity-filter">Severity</Label>
                            <Select
                                value={filters.severity}
                                onValueChange={(value) =>
                                    setFilters({
                                        ...filters,
                                        severity: value as
                                            | SecuritySeverity
                                            | "all",
                                    })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Severities
                                    </SelectItem>
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                    <SelectItem value="CRITICAL">
                                        Critical
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="resolved-filter">Status</Label>
                            <Select
                                value={filters.resolved}
                                onValueChange={(value) =>
                                    setFilters({
                                        ...filters,
                                        resolved: value as
                                            | "all"
                                            | "true"
                                            | "false",
                                    })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="false">
                                        Unresolved
                                    </SelectItem>
                                    <SelectItem value="true">
                                        Resolved
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="limit-filter">Limit</Label>
                            <Input
                                id="limit-filter"
                                type="number"
                                value={filters.limit}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        limit: parseInt(e.target.value) || 50,
                                    })}
                                min="1"
                                max="1000"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security Events */}
            <Card>
                <CardHeader>
                    <CardTitle>Security Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {securityEvents.length === 0
                            ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <p>
                                        No security events found matching your
                                        filters.
                                    </p>
                                </div>
                            )
                            : (
                                securityEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => setSelectedEvent(event)}
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
                                                        {event.ipAddress} •{" "}
                                                        {formatTimestamp(
                                                            event.timestamp,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge
                                                    variant={event.resolved
                                                        ? "default"
                                                        : "error"}
                                                    className={event.resolved
                                                        ? "bg-green-500"
                                                        : ""}
                                                >
                                                    {event.resolved
                                                        ? "Resolved"
                                                        : "Unresolved"}
                                                </Badge>
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
                                                {!event.resolved && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleResolveEvent(
                                                                event.id,
                                                            );
                                                        }}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Resolve
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                    </div>
                </CardContent>
            </Card>

            {/* Event Details Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Event Details
                            </h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedEvent(null)}
                            >
                                <XCircle className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label>Event Type</Label>
                                <p className="font-medium">
                                    {formatEventType(selectedEvent.type)}
                                </p>
                            </div>

                            <div>
                                <Label>Severity</Label>
                                <Badge
                                    variant="outline"
                                    className={`${
                                        getSeverityColor(selectedEvent.severity)
                                    } text-white`}
                                >
                                    {selectedEvent.severity}
                                </Badge>
                            </div>

                            <div>
                                <Label>Timestamp</Label>
                                <p>
                                    {formatTimestamp(selectedEvent.timestamp)}
                                </p>
                            </div>

                            <div>
                                <Label>IP Address</Label>
                                <p>{selectedEvent.ipAddress}</p>
                            </div>

                            <div>
                                <Label>User Agent</Label>
                                <p className="text-sm text-gray-600 break-all">
                                    {selectedEvent.userAgent}
                                </p>
                            </div>

                            {selectedEvent.userId && (
                                <div>
                                    <Label>User ID</Label>
                                    <p>{selectedEvent.userId}</p>
                                </div>
                            )}

                            <div>
                                <Label>Details</Label>
                                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {JSON.stringify(selectedEvent.details, null, 2)}
                                </pre>
                            </div>

                            <div>
                                <Label>Status</Label>
                                <Badge
                                    variant={selectedEvent.resolved
                                        ? "default"
                                        : "error"}
                                    className={selectedEvent.resolved
                                        ? "bg-green-500"
                                        : ""}
                                >
                                    {selectedEvent.resolved
                                        ? "Resolved"
                                        : "Unresolved"}
                                </Badge>
                            </div>

                            {selectedEvent.resolved &&
                                selectedEvent.resolvedAt &&
                                selectedEvent.resolvedBy && (
                                <div>
                                    <Label>Resolved</Label>
                                    <p>
                                        By {selectedEvent.resolvedBy} on{" "}
                                        {formatTimestamp(
                                            selectedEvent.resolvedAt,
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            {!selectedEvent.resolved && (
                                <Button
                                    onClick={() => {
                                        handleResolveEvent(selectedEvent.id);
                                        setSelectedEvent(null);
                                    }}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Resolve Event
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                onClick={() => setSelectedEvent(null)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
