"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui';
import { 
  Activity, 
  Clock, 
  Database, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface PerformanceMetrics {
  responseTime: number;
  databaseQueries: number;
  cacheHitRate: number;
  errorRate: number;
  throughput: number;
  memoryUsage: number;
}

interface PerformanceMonitorProps {
  className?: string;
}

export function PerformanceMonitor({ className }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    responseTime: 0,
    databaseQueries: 0,
    cacheHitRate: 0,
    errorRate: 0,
    throughput: 0,
    memoryUsage: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/performance/metrics');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error('Failed to fetch performance metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch metrics immediately
    fetchMetrics();

    // Set up interval to fetch metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (value: number, threshold: number, isLowerBetter = false) => {
    const isGood = isLowerBetter ? value <= threshold : value >= threshold;
    return isGood ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
    );
  };

  const getStatusColor = (value: number, threshold: number, isLowerBetter = false) => {
    const isGood = isLowerBetter ? value <= threshold : value >= threshold;
    return isGood ? 'text-green-600' : 'text-yellow-600';
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Monitor
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
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Performance Monitor
        </CardTitle>
        <p className="text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Response Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-medium">Response Time</p>
              <p className="text-sm text-gray-500">Average API response time</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              {getStatusIcon(metrics.responseTime, 500, true)}
              <span className={`font-semibold ${getStatusColor(metrics.responseTime, 500, true)}`}>
                {metrics.responseTime}ms
              </span>
            </div>
          </div>
        </div>

        {/* Database Queries */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium">Database Queries</p>
              <p className="text-sm text-gray-500">Queries per minute</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              {getStatusIcon(metrics.databaseQueries, 100, true)}
              <span className={`font-semibold ${getStatusColor(metrics.databaseQueries, 100, true)}`}>
                {metrics.databaseQueries}
              </span>
            </div>
          </div>
        </div>

        {/* Cache Hit Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="font-medium">Cache Hit Rate</p>
              <p className="text-sm text-gray-500">Percentage of cache hits</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              {getStatusIcon(metrics.cacheHitRate, 80)}
              <span className={`font-semibold ${getStatusColor(metrics.cacheHitRate, 80)}`}>
                {metrics.cacheHitRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Error Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium">Error Rate</p>
              <p className="text-sm text-gray-500">Percentage of failed requests</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              {getStatusIcon(metrics.errorRate, 5, true)}
              <span className={`font-semibold ${getStatusColor(metrics.errorRate, 5, true)}`}>
                {metrics.errorRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Throughput */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <div>
              <p className="font-medium">Throughput</p>
              <p className="text-sm text-gray-500">Requests per minute</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              {getStatusIcon(metrics.throughput, 1000)}
              <span className={`font-semibold ${getStatusColor(metrics.throughput, 1000)}`}>
                {metrics.throughput}
              </span>
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="font-medium">Memory Usage</p>
              <p className="text-sm text-gray-500">Current memory consumption</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              {getStatusIcon(metrics.memoryUsage, 80, true)}
              <span className={`font-semibold ${getStatusColor(metrics.memoryUsage, 80, true)}`}>
                {metrics.memoryUsage}%
              </span>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Status</span>
            <div className="flex items-center gap-2">
              {metrics.responseTime <= 500 && 
               metrics.databaseQueries <= 100 && 
               metrics.cacheHitRate >= 80 && 
               metrics.errorRate <= 5 ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
              <span className="text-sm font-medium">
                {metrics.responseTime <= 500 && 
                 metrics.databaseQueries <= 100 && 
                 metrics.cacheHitRate >= 80 && 
                 metrics.errorRate <= 5 ? 'Optimal' : 'Needs Attention'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
