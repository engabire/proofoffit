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
    AlertCircle,
    BarChart3,
    Briefcase,
    Building,
    CheckCircle,
    Clock,
    DollarSign,
    Download,
    FileText,
    MapPin,
    RefreshCw,
    Target,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react";
import { AnalyticsMetrics } from "@/lib/analytics/analytics-engine";

interface AnalyticsDashboardProps {
    timeRange?: string;
    onTimeRangeChange?: (timeRange: string) => void;
}

export function AnalyticsDashboard({
    timeRange = "30d",
    onTimeRangeChange,
}: AnalyticsDashboardProps) {
    const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

    const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/analytics?timeRange=${selectedTimeRange}`,
            );
            const data = await response.json();

            if (data.success) {
                setMetrics(data.data.metrics);
            } else {
                setError(data.error || "Failed to fetch analytics");
            }
        } catch (err) {
            setError("Network error occurred");
            console.error("Error fetching analytics:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [selectedTimeRange]);

    const handleTimeRangeChange = (newTimeRange: string) => {
        setSelectedTimeRange(newTimeRange);
        onTimeRangeChange?.(newTimeRange);
    };

    const handleExport = async (format: "json" | "csv") => {
        try {
            const response = await fetch(
                `/api/analytics?format=export&exportFormat=${format}`,
            );
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `analytics-export.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Export failed:", err);
        }
    };

    const getTrendIcon = (value: number, isPositive: boolean = true) => {
        if (isPositive ? value > 0 : value < 0) {
            return <TrendingUp className="h-4 w-4 text-green-600" />;
        }
        return <TrendingDown className="h-4 w-4 text-red-600" />;
    };

    const getTrendColor = (value: number, isPositive: boolean = true) => {
        if (isPositive ? value > 0 : value < 0) {
            return "text-green-600";
        }
        return "text-red-600";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="text-lg font-medium text-gray-600">
                        Loading analytics...
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
                        onClick={fetchAnalytics}
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

    if (!metrics) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No analytics data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Analytics Dashboard
                    </h2>
                    <p className="text-gray-600">
                        Comprehensive insights into platform performance and
                        user activity
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <Select
                        value={selectedTimeRange}
                        onValueChange={handleTimeRangeChange}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                            <SelectItem value="1y">Last year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={fetchAnalytics}
                        variant="outline"
                        size="sm"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                    <div className="flex space-x-2">
                        <Button
                            onClick={() => handleExport("json")}
                            variant="outline"
                            size="sm"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            JSON
                        </Button>
                        <Button
                            onClick={() => handleExport("csv")}
                            variant="outline"
                            size="sm"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            CSV
                        </Button>
                    </div>
                </div>
            </div>

            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Users className="h-8 w-8 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Users
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {metrics.user.totalUsers.toLocaleString()}
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                    {getTrendIcon(metrics.user.userGrowth)}
                                    <span
                                        className={`text-sm ${
                                            getTrendColor(
                                                metrics.user.userGrowth,
                                            )
                                        }`}
                                    >
                                        {metrics.user.userGrowth.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Briefcase className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Jobs
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {metrics.jobs.totalJobs.toLocaleString()}
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                    {getTrendIcon(metrics.jobs.jobGrowth)}
                                    <span
                                        className={`text-sm ${
                                            getTrendColor(
                                                metrics.jobs.jobGrowth,
                                            )
                                        }`}
                                    >
                                        {metrics.jobs.jobGrowth.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <FileText className="h-8 w-8 text-purple-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Applications
                                </p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {metrics.applications.totalApplications
                                        .toLocaleString()}
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-600">
                                        {metrics.applications.successRate
                                            .toFixed(1)}% success
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Target className="h-8 w-8 text-orange-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Match Score
                                </p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {(metrics.performance.averageMatchScore *
                                        100).toFixed(1)}%
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                    <Activity className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm text-blue-600">
                                        {(metrics.performance
                                            .averageConfidence * 100).toFixed(
                                                1,
                                            )}% confidence
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Analytics Tabs */}
            <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="jobs">Jobs</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="market">Market</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Users className="h-5 w-5" />
                                    <span>User Activity</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Active Users
                                    </span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {metrics.user.activeUsers}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        New Users
                                    </span>
                                    <span className="text-lg font-bold text-green-600">
                                        {metrics.user.newUsers}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Profile Completeness</span>
                                        <span>
                                            {(metrics.user.profileCompleteness
                                                .average * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={metrics.user.profileCompleteness
                                            .average * 100}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <BarChart3 className="h-5 w-5" />
                                    <span>Skill Distribution</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {Object.entries(
                                        metrics.user.skillDistribution,
                                    )
                                        .sort(([, a], [, b]) => b - a)
                                        .slice(0, 5)
                                        .map(([skill, count]) => (
                                            <div
                                                key={skill}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-sm">
                                                    {skill}
                                                </span>
                                                <Badge variant="secondary">
                                                    {count}
                                                </Badge>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="jobs" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Briefcase className="h-5 w-5" />
                                    <span>Job Statistics</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Active Jobs
                                    </span>
                                    <span className="text-lg font-bold text-green-600">
                                        {metrics.jobs.activeJobs}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        New Jobs
                                    </span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {metrics.jobs.newJobs}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Remote Jobs
                                    </span>
                                    <span className="text-lg font-bold text-purple-600">
                                        {metrics.jobs.remoteJobs}{" "}
                                        ({metrics.jobs.remotePercentage.toFixed(
                                            1,
                                        )}%)
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Average Salary
                                    </span>
                                    <span className="text-lg font-bold text-orange-600">
                                        ${metrics.jobs.averageSalary
                                            .toLocaleString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Building className="h-5 w-5" />
                                    <span>Industry Distribution</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {Object.entries(
                                        metrics.jobs.industryDistribution,
                                    )
                                        .sort(([, a], [, b]) => b - a)
                                        .slice(0, 5)
                                        .map(([industry, count]) => (
                                            <div
                                                key={industry}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-sm">
                                                    {industry}
                                                </span>
                                                <Badge variant="secondary">
                                                    {count}
                                                </Badge>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="applications" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <FileText className="h-5 w-5" />
                                    <span>Application Metrics</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Total Applications
                                    </span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {metrics.applications.totalApplications}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Successful
                                    </span>
                                    <span className="text-lg font-bold text-green-600">
                                        {metrics.applications
                                            .successfulApplications}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Success Rate
                                    </span>
                                    <span className="text-lg font-bold text-purple-600">
                                        {metrics.applications.successRate
                                            .toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Avg. Time to Apply
                                    </span>
                                    <span className="text-lg font-bold text-orange-600">
                                        {metrics.applications.averageTimeToApply
                                            .toFixed(1)} days
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <BarChart3 className="h-5 w-5" />
                                    <span>Conversion Funnel</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Views</span>
                                        <span className="font-medium">
                                            {metrics.applications
                                                .conversionFunnel.views}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            Applications
                                        </span>
                                        <span className="font-medium">
                                            {metrics.applications
                                                .conversionFunnel.applications}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            Interviews
                                        </span>
                                        <span className="font-medium">
                                            {metrics.applications
                                                .conversionFunnel.interviews}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Offers</span>
                                        <span className="font-medium">
                                            {metrics.applications
                                                .conversionFunnel.offers}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Hires</span>
                                        <span className="font-medium">
                                            {metrics.applications
                                                .conversionFunnel.hires}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Target className="h-5 w-5" />
                                    <span>Matching Performance</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Average Match Score
                                    </span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {(metrics.performance
                                            .averageMatchScore * 100).toFixed(
                                                1,
                                            )}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Average Confidence
                                    </span>
                                    <span className="text-lg font-bold text-green-600">
                                        {(metrics.performance
                                            .averageConfidence * 100).toFixed(
                                                1,
                                            )}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Recommendation Accuracy
                                    </span>
                                    <span className="text-lg font-bold text-purple-600">
                                        {(metrics.performance
                                            .recommendationAccuracy * 100)
                                            .toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        User Satisfaction
                                    </span>
                                    <span className="text-lg font-bold text-orange-600">
                                        {metrics.performance
                                            .userSatisfaction}/5.0
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Activity className="h-5 w-5" />
                                    <span>System Performance</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        System Uptime
                                    </span>
                                    <span className="text-lg font-bold text-green-600">
                                        {metrics.performance.systemUptime}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Response Time
                                    </span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {metrics.performance.responseTime}ms
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Error Rate
                                    </span>
                                    <span className="text-lg font-bold text-red-600">
                                        {metrics.performance.errorRate}%
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="market" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <TrendingUp className="h-5 w-5" />
                                    <span>Trending Skills</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {metrics.market.trendingSkills.slice(0, 5)
                                        .map((skill, index) => (
                                            <div
                                                key={skill.skill}
                                                className="flex justify-between items-center"
                                            >
                                                <div>
                                                    <span className="text-sm font-medium">
                                                        {skill.skill}
                                                    </span>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className="text-xs text-gray-500">
                                                            {skill.growth
                                                                .toFixed(1)}%
                                                            growth
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {skill.demand}{" "}
                                                            demand
                                                        </span>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary">
                                                    #{index + 1}
                                                </Badge>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <DollarSign className="h-5 w-5" />
                                    <span>Salary Trends</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {metrics.market.salaryTrends.slice(0, 4)
                                        .map((trend) => (
                                            <div
                                                key={trend.period}
                                                className="flex justify-between items-center"
                                            >
                                                <div>
                                                    <span className="text-sm font-medium">
                                                        {trend.period}
                                                    </span>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className="text-xs text-gray-500">
                                                            ${trend.average
                                                                .toLocaleString()}
                                                        </span>
                                                        <span
                                                            className={`text-xs ${
                                                                getTrendColor(
                                                                    trend
                                                                        .change,
                                                                )
                                                            }`}
                                                        >
                                                            {trend.change > 0
                                                                ? "+"
                                                                : ""}
                                                            {trend.change
                                                                .toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </div>
                                                {getTrendIcon(trend.change)}
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Building className="h-5 w-5" />
                                <span>Market Insights</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-green-600 mb-2">
                                        Hot Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {metrics.market.marketInsights.hotSkills
                                            .map((skill) => (
                                                <Badge
                                                    key={skill}
                                                    variant="secondary"
                                                    className="bg-green-100 text-green-800"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-red-600 mb-2">
                                        Declining Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {metrics.market.marketInsights
                                            .decliningSkills.map((skill) => (
                                                <Badge
                                                    key={skill}
                                                    variant="outline"
                                                    className="border-red-300 text-red-700"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-600 mb-2">
                                        Emerging Roles
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {metrics.market.marketInsights
                                            .emergingRoles.map((role) => (
                                                <Badge
                                                    key={role}
                                                    variant="secondary"
                                                    className="bg-blue-100 text-blue-800"
                                                >
                                                    {role}
                                                </Badge>
                                            ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-orange-600 mb-2">
                                        Salary Inflation
                                    </h4>
                                    <div className="text-2xl font-bold text-orange-600">
                                        {metrics.market.marketInsights
                                            .salaryInflation}%
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

