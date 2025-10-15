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
import { scrapingClient } from "@/lib/scraping/client";
import { ScrapingDashboard } from "./ScrapingDashboard";
import { ScrapedItemsList } from "./ScrapedItemsList";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  PlayCircle,
  RefreshCw,
  TrendingUp,
  XCircle,
} from "lucide-react";

interface JobMetrics {
  job_id: string;
  status: string;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  urls_processed: number;
  items_scraped: number;
  items_changed: number;
  success_rate?: number;
}

interface SloMetric {
  metric_name: string;
  source_domain?: string;
  value: number;
  threshold?: number;
  passed: boolean;
  measured_at: string;
}

export function ScrapingMonitor() {
  const [jobs, setJobs] = useState<JobMetrics[]>([]);
  const [sloMetrics, setSloMetrics] = useState<SloMetric[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [jobHistory, slos, scrapingStats] = await Promise.all([
        scrapingClient.getJobHistory(),
        scrapingClient.getSloMetrics(),
        scrapingClient.getStats(),
      ]);

      setJobs(jobHistory);
      setSloMetrics(slos);
      setStats(scrapingStats);
    } catch (error) {
      console.error("Failed to load monitoring data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [loadData]);

  const triggerScraping = async () => {
    setTriggering(true);
    try {
      await scrapingClient.triggerScraping();
      // Refresh data after triggering
      setTimeout(loadData, 2000);
    } catch (error) {
      console.error("Failed to trigger scraping:", error);
    } finally {
      setTriggering(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "killed":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800 border-green-200",
      running: "bg-blue-100 text-blue-800 border-blue-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      killed: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    return (
      <Badge
        className={variants[status as keyof typeof variants] ||
          "bg-gray-100 text-gray-800"}
      >
        {status}
      </Badge>
    );
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return "N/A";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
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

  // Calculate overall health metrics
  const recentJobs = jobs.slice(0, 10);
  const successfulJobs =
    recentJobs.filter((j) => j.status === "completed").length;
  const failedJobs = recentJobs.filter((j) => j.status === "failed").length;
  const healthScore = recentJobs.length > 0
    ? (successfulJobs / recentJobs.length) * 100
    : 100;

  const passingSlos = sloMetrics.filter((s) => s.passed).length;
  const totalSlos = sloMetrics.length;
  const sloScore = totalSlos > 0 ? (passingSlos / totalSlos) * 100 : 100;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading monitoring data...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  System Health
                </p>
                <p className="text-2xl font-bold">
                  {healthScore.toFixed(0)}%
                </p>
              </div>
              <Activity
                className={`h-8 w-8 ${
                  healthScore >= 90
                    ? "text-green-600"
                    : healthScore >= 70
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  SLO Compliance
                </p>
                <p className="text-2xl font-bold">
                  {sloScore.toFixed(0)}%
                </p>
              </div>
              <TrendingUp
                className={`h-8 w-8 ${
                  sloScore >= 95
                    ? "text-green-600"
                    : sloScore >= 80
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Recent Jobs
                </p>
                <p className="text-2xl font-bold">
                  {successfulJobs}/{recentJobs.length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Last Run
                </p>
                <p className="text-lg font-semibold">
                  {jobs[0] ? formatTimeAgo(jobs[0].started_at) : "Never"}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Job History</TabsTrigger>
            <TabsTrigger value="slos">SLO Metrics</TabsTrigger>
            <TabsTrigger value="testing">System Tests</TabsTrigger>
            <TabsTrigger value="data">Scraped Data</TabsTrigger>
          </TabsList>

          <Button
            onClick={triggerScraping}
            disabled={triggering}
            className="flex items-center gap-2"
          >
            {triggering
              ? <RefreshCw className="h-4 w-4 animate-spin" />
              : <PlayCircle className="h-4 w-4" />}
            Trigger Scraping
          </Button>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>📊 System Overview</CardTitle>
              <CardDescription>
                Real-time monitoring of the scraping system performance and
                health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Job Status */}
                <div>
                  <h4 className="font-semibold mb-3">Recent Job Execution</h4>
                  <div className="space-y-2">
                    {recentJobs.slice(0, 5).map((job) => (
                      <div
                        key={job.job_id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(job.status)}
                          <span className="text-sm font-mono">
                            {job.job_id.slice(0, 12)}...
                          </span>
                          {getStatusBadge(job.status)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeAgo(job.started_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SLO Status */}
                <div>
                  <h4 className="font-semibold mb-3">
                    Service Level Objectives
                  </h4>
                  <div className="space-y-2">
                    {sloMetrics.slice(0, 5).map((slo, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center gap-2">
                          {slo.passed
                            ? <CheckCircle className="h-4 w-4 text-green-600" />
                            : <XCircle className="h-4 w-4 text-red-600" />}
                          <span className="text-sm">{slo.metric_name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {slo.value.toFixed(2)}
                          {slo.threshold && ` / ${slo.threshold}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🔄 Job Execution History</CardTitle>
              <CardDescription>
                Detailed history of scraping job executions with performance
                metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.job_id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <span className="font-mono text-sm">{job.job_id}</span>
                        {getStatusBadge(job.status)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatTimeAgo(job.started_at)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="font-medium">
                          {formatDuration(job.duration_ms)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">URLs:</span>
                        <div className="font-medium">{job.urls_processed}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Items:</span>
                        <div className="font-medium">{job.items_scraped}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Changed:</span>
                        <div className="font-medium">{job.items_changed}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Success Rate:
                        </span>
                        <div className="font-medium">
                          {job.success_rate
                            ? `${(job.success_rate * 100).toFixed(1)}%`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>📈 Service Level Objectives</CardTitle>
              <CardDescription>
                SLO compliance metrics for system reliability and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sloMetrics.map((slo, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {slo.passed
                          ? <CheckCircle className="h-5 w-5 text-green-600" />
                          : <XCircle className="h-5 w-5 text-red-600" />}
                        <span className="font-semibold">{slo.metric_name}</span>
                        {slo.source_domain && (
                          <Badge variant="outline">{slo.source_domain}</Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatTimeAgo(slo.measured_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold">
                        {slo.value.toFixed(2)}
                      </div>
                      {slo.threshold && (
                        <div className="text-muted-foreground">
                          / {slo.threshold} threshold
                        </div>
                      )}
                      <div
                        className={`ml-auto ${
                          slo.passed ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {slo.passed ? "PASS" : "FAIL"}
                      </div>
                    </div>
                  </div>
                ))}

                {sloMetrics.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No SLO metrics available. Metrics are calculated during
                    scraping runs.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing">
          <ScrapingDashboard />
        </TabsContent>

        <TabsContent value="data">
          <ScrapedItemsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
