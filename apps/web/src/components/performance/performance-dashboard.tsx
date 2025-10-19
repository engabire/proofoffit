'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui';
import { Badge } from '@proof-of-fit/ui';
import { Button } from '@proof-of-fit/ui';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download, 
  Eye, 
  Gauge, 
  HardDrive, 
  Network, 
  RefreshCw, 
  TrendingDown, 
  TrendingUp,
  Zap
} from 'lucide-react';
import { usePerformanceMonitor } from '@/lib/performance/performance-monitor';

interface PerformanceDashboardProps {
  className?: string;
}

export function PerformanceDashboard({ className }: PerformanceDashboardProps) {
  const { metrics, score, recommendations, generateReport, sendReport } = usePerformanceMonitor();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const updateMetrics = async () => {
    setIsLoading(true);
    try {
      await sendReport('/api/performance');
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to update metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-5 w-5" />;
    if (score >= 70) return <AlertTriangle className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  const formatMetric = (value: number | undefined, unit: string = 'ms') => {
    if (value === undefined) return 'N/A';
    if (unit === 'ms') return `${Math.round(value)}ms`;
    if (unit === 's') return `${(value / 1000).toFixed(2)}s`;
    if (unit === '%') return `${Math.round(value)}%`;
    return `${value}`;
  };

  const getMetricStatus = (metric: string, value: number | undefined) => {
    if (value === undefined) return { status: 'unknown', color: 'text-gray-500' };
    
    switch (metric) {
      case 'lcp':
        if (value <= 2500) return { status: 'good', color: 'text-green-600' };
        if (value <= 4000) return { status: 'needs-improvement', color: 'text-yellow-600' };
        return { status: 'poor', color: 'text-red-600' };
      
      case 'fid':
        if (value <= 100) return { status: 'good', color: 'text-green-600' };
        if (value <= 300) return { status: 'needs-improvement', color: 'text-yellow-600' };
        return { status: 'poor', color: 'text-red-600' };
      
      case 'cls':
        if (value <= 0.1) return { status: 'good', color: 'text-green-600' };
        if (value <= 0.25) return { status: 'needs-improvement', color: 'text-yellow-600' };
        return { status: 'poor', color: 'text-red-600' };
      
      case 'pageLoadTime':
        if (value <= 3000) return { status: 'good', color: 'text-green-600' };
        if (value <= 5000) return { status: 'needs-improvement', color: 'text-yellow-600' };
        return { status: 'poor', color: 'text-red-600' };
      
      default:
        return { status: 'unknown', color: 'text-gray-500' };
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
          <p className="text-gray-600">Monitor your application's performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button
            onClick={updateMetrics}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gauge className="h-5 w-5" />
            <span>Overall Performance Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${getScoreColor(score)}`}>
              {getScoreIcon(score)}
              <span className="text-2xl font-bold">{score}/100</span>
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>LCP</span>
            </CardTitle>
            <CardDescription>Largest Contentful Paint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getMetricStatus('lcp', metrics.lcp).color}`}>
                {formatMetric(metrics.lcp)}
              </div>
              <Badge variant={getMetricStatus('lcp', metrics.lcp).status === 'good' ? 'default' : 'destructive'}>
                {getMetricStatus('lcp', metrics.lcp).status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>FID</span>
            </CardTitle>
            <CardDescription>First Input Delay</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getMetricStatus('fid', metrics.fid).color}`}>
                {formatMetric(metrics.fid)}
              </div>
              <Badge variant={getMetricStatus('fid', metrics.fid).status === 'good' ? 'default' : 'destructive'}>
                {getMetricStatus('fid', metrics.fid).status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>CLS</span>
            </CardTitle>
            <CardDescription>Cumulative Layout Shift</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getMetricStatus('cls', metrics.cls).color}`}>
                {formatMetric(metrics.cls, '')}
              </div>
              <Badge variant={getMetricStatus('cls', metrics.cls).status === 'good' ? 'default' : 'destructive'}>
                {getMetricStatus('cls', metrics.cls).status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Page Load</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${getMetricStatus('pageLoadTime', metrics.pageLoadTime).color}`}>
              {formatMetric(metrics.pageLoadTime, 's')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-5 w-5" />
              <span>Network</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-sm text-gray-600">
                Latency: {formatMetric(metrics.networkLatency)}
              </div>
              <div className="text-sm text-gray-600">
                Bandwidth: {formatMetric(metrics.bandwidth, 'Mbps')}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5" />
              <span>Memory</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-sm text-gray-600">
                Usage: {formatMetric((metrics.memoryUsage || 0) * 100, '%')}
              </div>
              {metrics.memoryLeaks && metrics.memoryLeaks > 0 && (
                <div className="text-sm text-red-600">
                  Leaks: {metrics.memoryLeaks}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Bundle Size</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900">
              {formatMetric(metrics.bundleSize, 'MB')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance Recommendations</span>
            </CardTitle>
            <CardDescription>
              Based on your current performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Actions</CardTitle>
          <CardDescription>
            Tools and actions to improve your application's performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                const report = generateReport();
                const blob = new Blob([JSON.stringify(report, null, 2)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `performance-report-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button
              onClick={() => {
                window.open('https://pagespeed.web.dev/', '_blank');
              }}
              variant="outline"
            >
              <Eye className="h-4 w-4 mr-2" />
              PageSpeed Insights
            </Button>
            <Button
              onClick={() => {
                window.open('https://web.dev/vitals/', '_blank');
              }}
              variant="outline"
            >
              <Activity className="h-4 w-4 mr-2" />
              Web Vitals Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
