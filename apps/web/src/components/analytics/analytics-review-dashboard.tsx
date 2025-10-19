"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@proof-of-fit/ui";
import { Button } from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@proof-of-fit/ui";
import { 
  BarChart3, 
  Users, 
  MousePointer, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Filter,
  Calendar
} from "lucide-react";

interface AnalyticsMetric {
  name: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
  format: "number" | "percentage" | "duration";
}

interface UserJourney {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  steps: number;
  conversionAchieved: boolean;
  bounceRate: boolean;
}

interface AnalyticsInsight {
  type: "trend" | "anomaly" | "recommendation" | "alert";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  data: any;
  timestamp: Date;
}

interface AnalyticsReviewDashboardProps {
  timeRange?: "1h" | "24h" | "7d" | "30d";
  onInsightClick?: (insight: AnalyticsInsight) => void;
}

export function AnalyticsReviewDashboard({ 
  timeRange = "24h", 
  onInsightClick 
}: AnalyticsReviewDashboardProps) {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [userJourneys, setUserJourneys] = useState<UserJourney[]>([]);
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  useEffect(() => {
    fetchAnalyticsData();
    
    // Set up real-time updates
    const interval = setInterval(fetchAnalyticsData, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    
    // Mock data - in production, this would come from your analytics API
    const mockMetrics: AnalyticsMetric[] = [
      {
        name: "Page Views",
        value: 1247,
        change: 12.5,
        trend: "up",
        format: "number"
      },
      {
        name: "Unique Users",
        value: 892,
        change: 8.3,
        trend: "up",
        format: "number"
      },
      {
        name: "Bounce Rate",
        value: 34.2,
        change: -5.1,
        trend: "down",
        format: "percentage"
      },
      {
        name: "Avg Session Duration",
        value: 4.2,
        change: 15.7,
        trend: "up",
        format: "duration"
      },
      {
        name: "Conversion Rate",
        value: 3.8,
        change: 2.1,
        trend: "up",
        format: "percentage"
      },
      {
        name: "Error Rate",
        value: 1.2,
        change: -0.8,
        trend: "down",
        format: "percentage"
      }
    ];

    const mockJourneys: UserJourney[] = [
      {
        sessionId: "sess_001",
        userId: "user_123",
        startTime: new Date(Date.now() - 30 * 60 * 1000),
        endTime: new Date(Date.now() - 25 * 60 * 1000),
        steps: 8,
        conversionAchieved: true,
        bounceRate: false
      },
      {
        sessionId: "sess_002",
        userId: "user_456",
        startTime: new Date(Date.now() - 45 * 60 * 1000),
        endTime: new Date(Date.now() - 44 * 60 * 1000),
        steps: 2,
        conversionAchieved: false,
        bounceRate: true
      },
      {
        sessionId: "sess_003",
        userId: "user_789",
        startTime: new Date(Date.now() - 60 * 60 * 1000),
        endTime: new Date(Date.now() - 50 * 60 * 1000),
        steps: 12,
        conversionAchieved: true,
        bounceRate: false
      }
    ];

    const mockInsights: AnalyticsInsight[] = [
      {
        type: "trend",
        title: "Traffic Increase Detected",
        description: "Page views increased by 12.5% compared to previous period",
        severity: "low",
        data: { metric: "page_views", change: 12.5 },
        timestamp: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        type: "anomaly",
        title: "High Bounce Rate on Landing Page",
        description: "Bounce rate on /landing is 67%, significantly higher than average",
        severity: "medium",
        data: { page: "/landing", bounceRate: 67, average: 34 },
        timestamp: new Date(Date.now() - 20 * 60 * 1000)
      },
      {
        type: "recommendation",
        title: "Optimize Mobile Experience",
        description: "Mobile users have 23% lower conversion rate than desktop users",
        severity: "medium",
        data: { mobileConversion: 2.1, desktopConversion: 2.7 },
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        type: "alert",
        title: "Error Rate Spike",
        description: "JavaScript errors increased by 150% in the last hour",
        severity: "high",
        data: { errorCount: 45, previousHour: 18 },
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      }
    ];

    setMetrics(mockMetrics);
    setUserJourneys(mockJourneys);
    setInsights(mockInsights);
    setIsLoading(false);
  };

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case "percentage":
        return `${value.toFixed(1)}%`;
      case "duration":
        return `${value.toFixed(1)}m`;
      default:
        return value.toLocaleString();
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full" />;
    }
  };

  const getInsightIcon = (type: string, severity: string) => {
    if (type === "alert" || severity === "high" || severity === "critical") {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (type === "recommendation" || severity === "medium") {
      return <CheckCircle className="h-4 w-4 text-yellow-500" />;
    }
    return <TrendingUp className="h-4 w-4 text-blue-500" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const exportAnalytics = () => {
    const data = {
      metrics,
      userJourneys,
      insights,
      timestamp: new Date().toISOString(),
      timeRange: selectedTimeRange
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-review-${selectedTimeRange}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics Review Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <select 
                value={selectedTimeRange} 
                onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <Button onClick={fetchAnalyticsData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button onClick={exportAnalytics} variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="user-journeys">User Journeys</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                      <p className="text-2xl font-bold">{formatValue(metric.value, metric.format)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm font-medium ${
                        metric.trend === "up" ? "text-green-600" : 
                        metric.trend === "down" ? "text-red-600" : "text-gray-600"
                      }`}>
                        {metric.change > 0 ? "+" : ""}{metric.change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* User Journeys Tab */}
        <TabsContent value="user-journeys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Journey Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userJourneys.map((journey) => (
                  <div key={journey.sessionId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{journey.sessionId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {Math.round((journey.endTime.getTime() - journey.startTime.getTime()) / 60000)}m
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MousePointer className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{journey.steps} steps</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {journey.conversionAchieved && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Converted
                        </Badge>
                      )}
                      {journey.bounceRate && (
                        <Badge variant="destructive">
                          Bounced
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analytics Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => onInsightClick?.(insight)}
                  >
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type, insight.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{insight.title}</h3>
                        <Badge variant={getSeverityColor(insight.severity)}>
                          {insight.severity}
                        </Badge>
                        <Badge variant="outline">
                          {insight.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <p className="text-xs text-gray-500">
                        {insight.timestamp.toLocaleString()}
                      </p>
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
