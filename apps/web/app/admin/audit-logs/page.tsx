"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AuditLogEntry {
    id: string;
    timestamp: string;
    userId: string | null;
    action: string;
    resource: string;
    resourceId: string | null;
    details: any;
    ipAddress: string | null;
    userAgent: string | null;
    previousHash: string | null;
    hash: string;
}

interface AuditLogStats {
    totalEntries: number;
    entriesByAction: Record<string, number>;
    entriesByResource: Record<string, number>;
    entriesByUser: Record<string, number>;
    recentActivity: AuditLogEntry[];
    hashChainValid: boolean;
    averageEntriesPerDay: number;
    topActions: Array<{ action: string; count: number }>;
    topResources: Array<{ resource: string; count: number }>;
    topUsers: Array<{ userId: string; count: number }>;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [stats, setStats] = useState<AuditLogStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        userId: "",
        action: "",
        resource: "",
        limit: 100,
    });

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (filters.userId) params.append("userId", filters.userId);
            if (filters.action) params.append("action", filters.action);
            if (filters.resource) params.append("resource", filters.resource);
            if (filters.limit) params.append("limit", filters.limit.toString());

            const response = await fetch(`/api/admin/audit-logs?${params}`);
            if (!response.ok) throw new Error("Failed to fetch audit logs");

            const data = await response.json();
            setLogs(data.data.logs);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/admin/audit-logs/stats");
            if (!response.ok) throw new Error("Failed to fetch stats");

            const data = await response.json();
            setStats(data.data);
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    };

    const verifyHashChain = async () => {
        try {
            const response = await fetch("/api/admin/audit-logs/verify", {
                method: "POST",
            });
            const data = await response.json();

            if (data.success) {
                alert("Hash chain verification successful!");
            } else {
                alert("Hash chain verification failed!");
            }
        } catch (err) {
            alert("Failed to verify hash chain");
        }
    };

    useEffect(() => {
        fetchLogs();
        fetchStats();
    }, [filters]);

    const columns = [
        {
            key: "timestamp" as keyof AuditLogEntry,
            title: "Timestamp",
            sortable: true,
            render: (value: string) => new Date(value).toLocaleString(),
        },
        {
            key: "userId" as keyof AuditLogEntry,
            title: "User ID",
            sortable: true,
            render: (value: string | null) =>
                value
                    ? <Badge variant="secondary">{value.slice(0, 8)}...</Badge>
                    : <Badge variant="outline">Anonymous</Badge>,
        },
        {
            key: "action" as keyof AuditLogEntry,
            title: "Action",
            sortable: true,
            render: (value: string) => <Badge variant="info">{value}</Badge>,
        },
        {
            key: "resource" as keyof AuditLogEntry,
            title: "Resource",
            sortable: true,
            render: (value: string) => <Badge variant="default">{value}</Badge>,
        },
        {
            key: "resourceId" as keyof AuditLogEntry,
            title: "Resource ID",
            sortable: true,
            render: (value: string | null) =>
                value
                    ? (
                        <span className="font-mono text-xs">
                            {value.slice(0, 8)}...
                        </span>
                    )
                    : <span className="text-gray-400">-</span>,
        },
        {
            key: "ipAddress" as keyof AuditLogEntry,
            title: "IP Address",
            sortable: true,
            render: (value: string | null) => (
                <span className="font-mono text-xs">{value || "-"}</span>
            ),
        },
        {
            key: "hash" as keyof AuditLogEntry,
            title: "Hash",
            sortable: true,
            render: (value: string) => (
                <span className="font-mono text-xs">
                    {value.slice(0, 12)}...
                </span>
            ),
        },
    ];

    if (loading && !stats) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Audit Logs
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Tamper-proof, compliance-ready audit trail for all
                        critical actions
                    </p>
                </div>

                {/* Stats Overview */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500">
                                Total Entries
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.totalEntries.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500">
                                Hash Chain Status
                            </h3>
                            <p
                                className={`text-2xl font-bold ${
                                    stats.hashChainValid
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {stats.hashChainValid ? "Valid" : "Invalid"}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500">
                                Avg/Day
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.averageEntriesPerDay}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500">
                                Success Rate
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.topActions.find((a) =>
                                    a.action === "USER_LOGIN"
                                )?.count || 0}
                            </p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Filters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                User ID
                            </label>
                            <input
                                type="text"
                                value={filters.userId}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        userId: e.target.value,
                                    })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Filter by user ID"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Action
                            </label>
                            <input
                                type="text"
                                value={filters.action}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        action: e.target.value,
                                    })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Filter by action"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Resource
                            </label>
                            <input
                                type="text"
                                value={filters.resource}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        resource: e.target.value,
                                    })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Filter by resource"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Limit
                            </label>
                            <select
                                value={filters.limit}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        limit: parseInt(e.target.value),
                                    })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={250}>250</option>
                                <option value={500}>500</option>
                                <option value={1000}>1000</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={fetchLogs}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={verifyHashChain}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Verify Hash Chain
                        </button>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Audit Log Entries
                        </h3>
                    </div>
                    {error && (
                        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}
                    <div className="p-6">
                        {loading
                            ? (
                                <div className="flex justify-center py-8">
                                    <LoadingSpinner size="lg" />
                                </div>
                            )
                            : (
                                <DataTable
                                    data={logs}
                                    columns={columns}
                                    className="w-full"
                                />
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
