"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import { Button } from "@proof-of-fit/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@proof-of-fit/ui";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  PieChart,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Tag,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";

interface AnalysisSummary {
  total_analyses: number;
  total_trends: number;
  sentiment_distribution: Record<string, number>;
  trend_distribution: Record<string, number>;
  category_distribution: Record<string, number>;
}

interface TrendData {
  id: string;
  trend_type: "emerging" | "growing" | "declining" | "stable" | "viral";
  topic: string;
  category: string;
  current_volume: number;
  volume_change_24h: number;
  growth_rate: number;
  confidence_level: number;
  trend_strength: number;
}

interface AnalysisData {
  id: string;
  sentiment: "positive" | "negative" | "neutral" | "mixed";
  confidence_score: number;
  primary_category: string;
  topics: string[];
  keywords: string[];
  ai_summary: string;
  ai_tags: string[];
  key_insights: string[];
  relevance_score: number;
  priority_score: number;
  analyzed_at: string;
  scraped_items: {
    id: string;
    title: string;
    author?: string;
    source_domain: string;
    canonical_item_url: string;
    last_seen_at: string;
  };
}

export function AIIntelligenceDashboard() {
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [lastProcessed, setLastProcessed] = useState<any>(null);

  const loadData = useCallback(async () => {
    try {
      const [summaryRes, trendsRes, analysesRes] = await Promise.all([
        fetch("/api/ai/analyze?type=summary"),
        fetch(
          `/api/ai/analyze?type=trends&limit=20${
            selectedCategory ? `&category=${selectedCategory}` : ""
          }`,
        ),
        fetch(
          `/api/ai/analyze?type=analysis&limit=20${
            selectedCategory ? `&category=${selectedCategory}` : ""
          }`,
        ),
      ]);

      const [summaryData, trendsData, analysesData] = await Promise.all([
        summaryRes.json(),
        trendsRes.json(),
        analysesRes.json(),
      ]);

      setSummary(summaryData.summary);
      setTrends(trendsData.trends || []);
      setAnalyses(analysesData.analyses || []);
    } catch (error) {
      console.error("Failed to load AI data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [selectedCategory, loadData]);

  const triggerAnalysis = async (mode = "batch", limit = 10) => {
    setProcessing(true);
    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-run": "1",
        },
        body: JSON.stringify({ mode, limit }),
      });

      const result = await response.json();
      setLastProcessed(result);

      // Refresh data after processing
      setTimeout(loadData, 2000);
    } catch (error) {
      console.error("Failed to trigger analysis:", error);
    } finally {
      setProcessing(false);
    }
  };

  const getTrendIcon = (type: string) => {
    switch (type) {
      case "viral":
        return <Zap className="h-4 w-4 text-red-500" />;
      case "growing":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "emerging":
        return <Sparkles className="h-4 w-4 text-blue-500" />;
      case "declining":
        return <Activity className="h-4 w-4 text-orange-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendBadge = (type: string) => {
    const variants = {
      viral: "bg-red-100 text-red-800 border-red-200",
      growing: "bg-green-100 text-green-800 border-green-200",
      emerging: "bg-blue-100 text-blue-800 border-blue-200",
      declining: "bg-orange-100 text-orange-800 border-orange-200",
      stable: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <Badge
        className={variants[type as keyof typeof variants] || variants.stable}
      >
        {type}
      </Badge>
    );
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "negative":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "mixed":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  const categories = summary ? Object.keys(summary.category_distribution) : [];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading AI intelligence data...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Intelligence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Content Analyzed
                </p>
                <p className="text-2xl font-bold">
                  {summary?.total_analyses?.toLocaleString() || 0}
                </p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Trends
                </p>
                <p className="text-2xl font-bold">
                  {summary?.total_trends || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Categories
                </p>
                <p className="text-2xl font-bold">
                  {Object.keys(summary?.category_distribution || {}).length}
                </p>
              </div>
              <Tag className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Positive Sentiment
                </p>
                <p className="text-2xl font-bold">
                  {summary?.sentiment_distribution?.positive || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="trends" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="trends">🔥 Trends</TabsTrigger>
            <TabsTrigger value="analysis">🧠 Analysis</TabsTrigger>
            <TabsTrigger value="insights">💡 Insights</TabsTrigger>
            <TabsTrigger value="processing">⚙️ Processing</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category} ({summary?.category_distribution[category]})
                </option>
              ))}
            </select>

            <Button
              onClick={() => triggerAnalysis("batch", 10)}
              disabled={processing}
              size="sm"
              className="flex items-center gap-2"
            >
              {processing
                ? <RefreshCw className="h-4 w-4 animate-spin" />
                : <PlayCircle className="h-4 w-4" />}
              Analyze Content
            </Button>
          </div>
        </div>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔥 Trending Topics
                <Badge variant="secondary">{trends.length} trends</Badge>
              </CardTitle>
              <CardDescription>
                AI-detected trends from recent content analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trends.map((trend) => (
                  <div key={trend.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(trend.trend_type)}
                        <h3 className="font-semibold">{trend.topic}</h3>
                        {getTrendBadge(trend.trend_type)}
                        <Badge variant="outline">{trend.category}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {(trend.trend_strength * 100).toFixed(0)}% strength
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Volume:</span>
                        <div className="font-medium">
                          {trend.current_volume}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          24h Change:
                        </span>
                        <div
                          className={`font-medium ${
                            trend.volume_change_24h > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {trend.volume_change_24h > 0 ? "+" : ""}
                          {trend.volume_change_24h.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Growth Rate:
                        </span>
                        <div className="font-medium">
                          {trend.growth_rate.toFixed(2)}x
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Confidence:
                        </span>
                        <div className="font-medium">
                          {(trend.confidence_level * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {trends.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No trends detected yet. Run content analysis to identify
                    trending topics.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🧠 Content Analysis Results
                <Badge variant="secondary">{analyses.length} analyzed</Badge>
              </CardTitle>
              <CardDescription>
                AI-powered analysis of scraped content with insights and
                categorization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <Card
                    key={analysis.id}
                    className="border-l-4"
                    style={{
                      borderLeftColor: analysis.sentiment === "positive"
                        ? "#10b981"
                        : analysis.sentiment === "negative"
                        ? "#ef4444"
                        : analysis.sentiment === "mixed"
                        ? "#f59e0b"
                        : "#6b7280",
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                            {analysis.scraped_items.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                            <span>{analysis.scraped_items.source_domain}</span>
                            {analysis.scraped_items.author && (
                              <>
                                <span>•</span>
                                <span>by {analysis.scraped_items.author}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{formatTimeAgo(analysis.analyzed_at)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getSentimentIcon(analysis.sentiment)}
                          <Badge variant="outline">
                            {analysis.primary_category}
                          </Badge>
                          <div className="text-sm font-medium">
                            P{analysis.priority_score}
                          </div>
                        </div>
                      </div>

                      {analysis.ai_summary && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {analysis.ai_summary}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1 mb-3">
                        {analysis.ai_tags.slice(0, 5).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {analysis.key_insights.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <strong>Key Insight:</strong>{" "}
                          {analysis.key_insights[0]}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            Relevance:{" "}
                            {(analysis.relevance_score * 100).toFixed(0)}%
                          </span>
                          <span>
                            Confidence:{" "}
                            {(analysis.confidence_score * 100).toFixed(0)}%
                          </span>
                          <span>Topics: {analysis.topics.length}</span>
                        </div>
                        <a
                          href={analysis.scraped_items.canonical_item_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {analyses.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No analysis results yet. Run content analysis to see AI
                    insights.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentiment Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Sentiment Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {summary &&
                    Object.entries(summary.sentiment_distribution).map((
                      [sentiment, count],
                    ) => (
                      <div
                        key={sentiment}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {getSentimentIcon(sentiment)}
                          <span className="capitalize">{sentiment}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                sentiment === "positive"
                                  ? "bg-green-500"
                                  : sentiment === "negative"
                                  ? "bg-red-500"
                                  : sentiment === "mixed"
                                  ? "bg-yellow-500"
                                  : "bg-gray-500"
                              }`}
                              style={{
                                width: `${
                                  (count /
                                    Math.max(
                                      ...Object.values(
                                        summary.sentiment_distribution,
                                      ),
                                    )) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium min-w-[2rem]">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {summary && Object.entries(summary.category_distribution)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 6)
                    .map(([category, count]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{
                                width: `${
                                  (count /
                                    Math.max(
                                      ...Object.values(
                                        summary.category_distribution,
                                      ),
                                    )) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium min-w-[2rem]">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Trend Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trend Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {summary &&
                    Object.entries(summary.trend_distribution).map((
                      [type, count],
                    ) => (
                      <div
                        key={type}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {getTrendIcon(type)}
                          <span className="capitalize">{type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                type === "viral"
                                  ? "bg-red-500"
                                  : type === "growing"
                                  ? "bg-green-500"
                                  : type === "emerging"
                                  ? "bg-blue-500"
                                  : type === "declining"
                                  ? "bg-orange-500"
                                  : "bg-gray-500"
                              }`}
                              style={{
                                width: `${
                                  (count /
                                    Math.max(
                                      ...Object.values(
                                        summary.trend_distribution,
                                      ),
                                    )) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium min-w-[2rem]">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Processing Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  AI Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lastProcessed
                  ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Items Processed:</span>
                        <span className="font-medium">
                          {lastProcessed.results?.processed || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Success Rate:</span>
                        <span className="font-medium">
                          {lastProcessed.results?.success_rate || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Processing Time:</span>
                        <span className="font-medium">
                          {lastProcessed.results?.duration_ms || 0}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Trends Detected:</span>
                        <span className="font-medium">
                          {lastProcessed.results?.trends_detected || 0}
                        </span>
                      </div>
                    </div>
                  )
                  : (
                    <p className="text-sm text-muted-foreground">
                      No recent processing data available. Run content analysis
                      to see performance metrics.
                    </p>
                  )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚙️ AI Processing Control
              </CardTitle>
              <CardDescription>
                Control and monitor AI content analysis processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Button
                  onClick={() => triggerAnalysis("batch", 10)}
                  disabled={processing}
                  className="flex items-center gap-2"
                >
                  {processing
                    ? <RefreshCw className="h-4 w-4 animate-spin" />
                    : <PlayCircle className="h-4 w-4" />}
                  Analyze 10 Items
                </Button>

                <Button
                  onClick={() => triggerAnalysis("batch", 50)}
                  disabled={processing}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {processing
                    ? <RefreshCw className="h-4 w-4 animate-spin" />
                    : <PlayCircle className="h-4 w-4" />}
                  Analyze 50 Items
                </Button>

                <Button
                  onClick={() => triggerAnalysis("reanalyze", 20)}
                  disabled={processing}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {processing
                    ? <RefreshCw className="h-4 w-4 animate-spin" />
                    : <RefreshCw className="h-4 w-4" />}
                  Reanalyze Old
                </Button>
              </div>

              {lastProcessed && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-semibold mb-2">Last Processing Result</h4>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(lastProcessed, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
