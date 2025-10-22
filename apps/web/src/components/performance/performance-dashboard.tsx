"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    Database,
    Download,
    Image,
    Layers,
    RefreshCw,
    Settings,
    TrendingDown,
    TrendingUp,
    Zap,
} from "lucide-react";
import {
    type OptimizationRecommendation,
    type PerformanceBudget,
    performanceOptimizationEngine,
} from "@/lib/performance/optimization-engine";
import { cacheUtils } from "@/lib/performance/cache-manager";
import { imageOptimizer } from "@/lib/performance/image-optimizer";
import { bundleAnalyzer, bundleUtils } from "@/lib/performance/bundle-analyzer";

interface PerformanceDashboardProps {
    autoRefresh?: boolean;
    refreshInterval?: number;
}

export function PerformanceDashboard({
    autoRefresh = true,
    refreshInterval = 30000,
}: PerformanceDashboardProps) {
    const [analysis, setAnalysis] = useState<any>(null);
    const [bundleAnalysis, setBundleAnalysis] = useState<any>(null);
    const [cacheStats, setCacheStats] = useState<any>(null);
    const [imageStats, setImageStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");

    const fetchPerformanceData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Get performance optimization analysis
            const perfAnalysis = await performanceOptimizationEngine
                .analyzeAndOptimize();
            setAnalysis(perfAnalysis);

            // Get bundle analysis
            const bundleData = await bundleAnalyzer.analyzeBundle();
            setBundleAnalysis(bundleData);

            // Get cache statistics
            const cacheData = cacheUtils.getPerformanceReport();
            setCacheStats(cacheData);

            // Get image optimization statistics
            const imageData = imageOptimizer.getPerformanceSummary();
            setImageStats(imageData);
        } catch (err) {
            setError("Failed to fetch performance data");
            console.error("Performance data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformanceData();

        if (autoRefresh) {
            const interval = setInterval(fetchPerformanceData, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, refreshInterval]);

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-600";
        if (score >= 70) return "text-yellow-600";
        return "text-red-600";
    };

    const getScoreBg = (score: number) => {
        if (score >= 90) return "bg-green-100";
        if (score >= 70) return "bg-yellow-100";
        return "bg-red-100";
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "critical":
                return "bg-red-100 text-red-800";
            case "high":
                return "bg-orange-100 text-orange-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "low":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getEffortColor = (effort: string) => {
        switch (effort) {
            case "low":
                return "text-green-600";
            case "medium":
                return "text-yellow-600";
            case "high":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="text-lg font-medium text-gray-600">
                        Analyzing performance...
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
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-medium">Error: {error}</span>
                    </div>
                    <p className="text-sm text-red-600 mt-2">
                        Please try again or contact support if the issue
                        persists.
                    </p>
                    <Button
                        onClick={fetchPerformanceData}
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
                        Performance Dashboard
                    </h2>
                    <p className="text-gray-600">
                        Monitor and optimize application performance
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <Select defaultValue="30s">
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10s">10s</SelectItem>
                            <SelectItem value="30s">30s</SelectItem>
                            <SelectItem value="1m">1m</SelectItem>
                            <SelectItem value="5m">5m</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={fetchPerformanceData}
                        variant="outline"
                        size="sm"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Performance Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Activity className="h-8 w-8 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Overall Score
                                </p>
                                <p
                                    className={`text-2xl font-bold ${
                                        getScoreColor(
                                            analysis?.overallScore || 0,
                                        )
                                    }`}
                                >
                                    {analysis?.overallScore || 0}
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-600">
                                        +{analysis?.improvementPotential || 0}%
                                        potential
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Layers className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Bundle Size
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {bundleUtils.formatBytes(
                                        bundleAnalysis?.gzippedSize || 0,
                                    )}
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                    <Database className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm text-blue-600">
                                        {bundleAnalysis?.chunks?.length || 0}
                                        {" "}
                                        chunks
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Zap className="h-8 w-8 text-purple-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Cache Hit Rate
                                </p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {Math.round(
                                        (cacheStats?.api?.hitRate || 0) * 100,
                                    )}%
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-600">
                                        {cacheStats?.api?.hits || 0} hits
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Image className="h-8 w-8 text-orange-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Image Savings
                                </p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {bundleUtils.formatBytes(
                                        imageStats?.totalSavings || 0,
                                    )}
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                    <TrendingDown className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-600">
                                        {Math.round(
                                            (imageStats
                                                ?.averageCompressionRatio ||
                                                0) * 100,
                                        )}% compression
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="bundle">Bundle</TabsTrigger>
                    <TabsTrigger value="cache">Cache</TabsTrigger>
                    <TabsTrigger value="recommendations">
                        Recommendations
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Performance Budgets */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Settings className="h-5 w-5" />
                                    <span>Performance Budgets</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analysis?.performanceBudgets?.map((
                                        budget: PerformanceBudget,
                                    ) => (
                                        <div
                                            key={budget.metric}
                                            className="space-y-2"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">
                                                    {budget.metric}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-600">
                                                        {budget.current.toFixed(
                                                            0,
                                                        )}
                                                        {budget.metric === "CLS"
                                                            ? ""
                                                            : "ms"}
                                                    </span>
                                                    <Badge
                                                        className={budget
                                                                .status ===
                                                                "pass"
                                                            ? "bg-green-100 text-green-800"
                                                            : budget.status ===
                                                                    "warning"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"}
                                                    >
                                                        {budget.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Progress
                                                value={(budget.current /
                                                    budget.threshold) * 100}
                                                className="h-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Zap className="h-5 w-5" />
                                    <span>Quick Actions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Clear All Caches
                                    </Button>
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Export Performance Report
                                    </Button>
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        Configure Performance Budgets
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="metrics" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Core Web Vitals */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Activity className="h-5 w-5" />
                                    <span>Core Web Vitals</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">
                                                Largest Contentful Paint
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                LCP
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-blue-600">
                                                {analysis?.performanceBudgets
                                                    ?.find((b: any) =>
                                                        b.metric === "LCP"
                                                    )?.current?.toFixed(0) ||
                                                    0}ms
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">
                                                First Input Delay
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                FID
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-600">
                                                {analysis?.performanceBudgets
                                                    ?.find((b: any) =>
                                                        b.metric === "FID"
                                                    )?.current?.toFixed(0) ||
                                                    0}ms
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">
                                                Cumulative Layout Shift
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                CLS
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-purple-600">
                                                {analysis?.performanceBudgets
                                                    ?.find((b: any) =>
                                                        b.metric === "CLS"
                                                    )?.current?.toFixed(3) || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Performance Trends */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <TrendingUp className="h-5 w-5" />
                                    <span>Performance Trends</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-center py-8">
                                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">
                                            Performance trends will be available
                                            with historical data
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="bundle" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Bundle Analysis */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Layers className="h-5 w-5" />
                                    <span>Bundle Analysis</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">
                                            Total Size
                                        </span>
                                        <span className="font-bold">
                                            {bundleUtils.formatBytes(
                                                bundleAnalysis?.totalSize || 0,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">
                                            Gzipped Size
                                        </span>
                                        <span className="font-bold text-green-600">
                                            {bundleUtils.formatBytes(
                                                bundleAnalysis?.gzippedSize ||
                                                    0,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">
                                            Compression Ratio
                                        </span>
                                        <span className="font-bold">
                                            {bundleUtils
                                                .calculateCompressionRatio(
                                                    bundleAnalysis?.totalSize ||
                                                        0,
                                                    bundleAnalysis
                                                        ?.gzippedSize || 0,
                                                ).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">
                                            Number of Chunks
                                        </span>
                                        <span className="font-bold">
                                            {bundleAnalysis?.chunks?.length ||
                                                0}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Chunk Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Database className="h-5 w-5" />
                                    <span>Chunk Breakdown</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {bundleAnalysis?.chunks?.slice(0, 5).map((
                                        chunk: any,
                                    ) => (
                                        <div
                                            key={chunk.name}
                                            className="flex justify-between items-center p-2 border rounded"
                                        >
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {chunk.name}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {chunk.modules} modules
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold">
                                                    {bundleUtils.formatBytes(
                                                        chunk.size,
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {bundleUtils.formatBytes(
                                                        chunk.gzippedSize,
                                                    )} gzipped
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="cache" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Cache Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Zap className="h-5 w-5" />
                                    <span>Cache Statistics</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(cacheStats || {}).map((
                                        [name, stats]: [string, any],
                                    ) => (
                                        <div
                                            key={name}
                                            className="p-3 border rounded-lg"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium capitalize">
                                                    {name}
                                                </span>
                                                <Badge variant="secondary">
                                                    {Math.round(
                                                        (stats.hitRate || 0) *
                                                            100,
                                                    )}% hit rate
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="text-gray-600">
                                                        Hits:
                                                    </span>
                                                    <span className="ml-1 font-medium">
                                                        {stats.hits || 0}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">
                                                        Misses:
                                                    </span>
                                                    <span className="ml-1 font-medium">
                                                        {stats.misses || 0}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">
                                                        Size:
                                                    </span>
                                                    <span className="ml-1 font-medium">
                                                        {stats.size || 0}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">
                                                        Memory:
                                                    </span>
                                                    <span className="ml-1 font-medium">
                                                        {bundleUtils
                                                            .formatBytes(
                                                                stats
                                                                    .memoryUsage ||
                                                                    0,
                                                            )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cache Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Activity className="h-5 w-5" />
                                    <span>Cache Performance</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-center py-8">
                                        <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">
                                            Cache performance metrics will be
                                            available with usage data
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-6">
                    <div className="space-y-4">
                        {analysis?.recommendations?.map((
                            rec: OptimizationRecommendation,
                            index: number,
                        ) => (
                            <Card
                                key={rec.id}
                                className="border-l-4 border-l-blue-500"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="font-semibold">
                                                    {rec.title}
                                                </h3>
                                                <Badge
                                                    className={getPriorityColor(
                                                        rec.type,
                                                    )}
                                                >
                                                    {rec.type.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <p className="text-gray-600 mb-3">
                                                {rec.description}
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm">
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-gray-600">
                                                        Impact:
                                                    </span>
                                                    <span className="font-medium">
                                                        {rec.impact}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-gray-600">
                                                        Effort:
                                                    </span>
                                                    <span
                                                        className={`font-medium ${
                                                            getEffortColor(
                                                                rec.effort,
                                                            )
                                                        }`}
                                                    >
                                                        {rec.effort}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-gray-600">
                                                        Savings:
                                                    </span>
                                                    <span className="font-medium text-green-600">
                                                        {rec.estimatedImprovement}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Implement
                                        </Button>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">
                                            Implementation Steps:
                                        </h4>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                            {rec.implementation.split(", ").map(
                                                (step, stepIndex) => (
                                                    <li key={stepIndex}>
                                                        {step}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
