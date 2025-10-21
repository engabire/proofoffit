"use client";

import React, { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ConsentLedgerEntry {
    id: string;
    userId: string;
    packageId: string;
    consentId: string;
    action: "submitted" | "failed" | "skipped" | "duplicate";
    jobId: string | null;
    timestamp: string;
    metadata: Record<string, any>;
    previousHash: string | null;
    hash: string;
}

interface ConsentLedgerStats {
    totalEntries: number;
    entriesByAction: Record<string, number>;
    entriesByUser: Record<string, number>;
    entriesByPackage: Record<string, number>;
    recentActivity: ConsentLedgerEntry[];
    hashChainValid: boolean;
    averageEntriesPerDay: number;
    topActions: Array<{ action: string; count: number }>;
    topUsers: Array<{ userId: string; count: number }>;
    topPackages: Array<{ packageId: string; count: number }>;
    successRate: number;
}

export default function ConsentLedgerPage() {
    const [entries, setEntries] = useState<ConsentLedgerEntry[]>([]);
    const [stats, setStats] = useState<ConsentLedgerStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        userId: "",
        packageId: "",
        consentId: "",
        action: "",
        limit: 100,
    });

    const fetchEntries = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (filters.userId) params.append("userId", filters.userId);
            if (filters.packageId) {
                params.append("packageId", filters.packageId);
            }
            if (filters.consentId) {
                params.append("consentId", filters.consentId);
            }
            if (filters.action) params.append("action", filters.action);
            if (filters.limit) params.append("limit", filters.limit.toString());

            const response = await fetch(`/api/admin/consent-ledger?${params}`);
            if (!response.ok) {
                throw new Error("Failed to fetch consent ledger entries");
            }

            const data = await response.json();
            setEntries(data.data.entries);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/consent-ledger/stats");
            if (!response.ok) throw new Error("Failed to fetch stats");

            const data = await response.json();
            setStats(data.data);
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    }, []);

    useEffect(() => {
        fetchEntries();
        fetchStats();
    }, [fetchEntries, fetchStats]);

    const getActionBadgeVariant = (action: string) => {
        switch (action) {
            case "submitted":
                return "success";
            case "failed":
                return "error";
            case "skipped":
                return "warning";
            case "duplicate":
                return "secondary";
            default:
                return "default";
        }
    };

    const columns = [
        {
            key: "timestamp" as keyof ConsentLedgerEntry,
            title: "Timestamp",
            sortable: true,
            render: (value: string) => new Date(value).toLocaleString(),
        },
        {
            key: "userId" as keyof ConsentLedgerEntry,
            title: "User ID",
            sortable: true,
            render: (value: string) => (
                <Badge variant="secondary">{value.slice(0, 8)}...</Badge>
            ),
        },
        {
            key: "packageId" as keyof ConsentLedgerEntry,
            title: "Package ID",
            sortable: true,
            render: (value: string) => (
                <Badge variant="info">{value.slice(0, 8)}...</Badge>
            ),
        },
        {
            key: "consentId" as keyof ConsentLedgerEntry,
            title: "Consent ID",
            sortable: true,
            render: (value: string) => (
                <Badge variant="outline">{value.slice(0, 8)}...</Badge>
            ),
        },
        {
            key: "action" as keyof ConsentLedgerEntry,
            title: "Action",
            sortable: true,
            render: (value: string) => (
                <Badge variant={getActionBadgeVariant(value) as any}>
                    {value.toUpperCase()}
                </Badge>
            ),
        },
        {
            key: "jobId" as keyof ConsentLedgerEntry,
            title: "Job ID",
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
            key: "hash" as keyof ConsentLedgerEntry,
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
                        Consent Ledger
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Immutable record of automated job application activity
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
                                Success Rate
                            </h3>
                            <p className="text-2xl font-bold text-green-600">
                                {stats.successRate.toFixed(1)}%
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
                    </div>
                )}

                {/* Action Breakdown */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {stats.topActions.map((action) => (
                            <div
                                key={action.action}
                                className="bg-white p-6 rounded-lg shadow"
                            >
                                <h3 className="text-sm font-medium text-gray-500 capitalize">
                                    {action.action.replace("_", " ")}
                                </h3>
                                <p className="text-2xl font-bold text-gray-900">
                                    {action.count}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Filters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                                Package ID
                            </label>
                            <input
                                type="text"
                                value={filters.packageId}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        packageId: e.target.value,
                                    })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Filter by package ID"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Consent ID
                            </label>
                            <input
                                type="text"
                                value={filters.consentId}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        consentId: e.target.value,
                                    })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Filter by consent ID"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Action
                            </label>
                            <select
                                value={filters.action}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        action: e.target.value,
                                    })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Actions</option>
                                <option value="submitted">Submitted</option>
                                <option value="failed">Failed</option>
                                <option value="skipped">Skipped</option>
                                <option value="duplicate">Duplicate</option>
                            </select>
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
                    <div className="mt-4">
                        <button
                            onClick={fetchEntries}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Entries Table */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Consent Ledger Entries
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
                                    data={entries}
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
