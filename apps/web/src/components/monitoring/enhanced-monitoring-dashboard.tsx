"use client";

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Globe,
  HardDrive,
  Loader2,
  RefreshCw,
  Server,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@proof-of-fit/ui';

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
  services: {
    database: 'up' | 'down' | 'degraded';
    auth: 'up' | 'down' | 'degraded';
    jobs: 'up' | 'down' | 'degraded';
    analytics: 'up' | 'down' | 'degraded';
  };
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

interface ErrorStats {
  total: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  recent: number;
}

interface SecurityStatus {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export function EnhancedMonitoringDashboard() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [errorStats, setErrorStats] = useState<ErrorStats | null>(null);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch system health
      const healthResponse = await fetch('/api/monitoring/health');
      const healthData = await healthResponse.json();
      setSystemHealth(healthData.health);

      // Fetch error statistics
      const errorsResponse = await fetch('/api/monitoring/errors');
      const errorsData = await errorsResponse.json();
      setErrorStats(errorsData.errors.stats);

      // Fetch security status
      const securityResponse = await fetch('/api/security/validate');
      const securityData = await securityResponse.json();
      setSecurityStatus(securityData);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'up':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'down':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'up':
        return <CheckCircle className="h-4 w-4" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4" />;
      case 'critical':
      case 'down':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading && !systemHealth) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading monitoring data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Monitoring</h2>
          <p className="text-gray-600">
            Real-time system health and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* System Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {systemHealth && getStatusIcon(systemHealth.status)}
                  <Badge className={getStatusColor(systemHealth?.status || 'unknown')}>
                    {systemHealth?.status || 'Unknown'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Uptime: {systemHealth?.uptime ? `${Math.floor(systemHealth.uptime / 3600)}h` : 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemHealth?.responseTime ? `${systemHealth.responseTime}ms` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average response time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemHealth?.errorRate ? `${(systemHealth.errorRate * 100).toFixed(2)}%` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 24 hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Throughput</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemHealth?.throughput ? `${systemHealth.throughput}/min` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requests per minute
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Services Status */}
          <Card>
            <CardHeader>
              <CardTitle>Services Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {systemHealth?.services && Object.entries(systemHealth.services).map(([service, status]) => (
                  <div key={service} className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <span className="capitalize">{service}</span>
                    <Badge className={getStatusColor(status)}>
                      {status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resource Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth?.metrics && Object.entries(systemHealth.metrics).map(([metric, value]) => (
                  <div key={metric} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{metric}</span>
                      <span>{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {errorStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{errorStats.total}</div>
                      <div className="text-sm text-muted-foreground">Total Errors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{errorStats.recent}</div>
                      <div className="text-sm text-muted-foreground">Recent (1h)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {errorStats.bySeverity.CRITICAL || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Critical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {errorStats.bySeverity.HIGH || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">High</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Errors by Type</h4>
                      <div className="space-y-1">
                        {Object.entries(errorStats.byType).map(([type, count]) => (
                          <div key={type} className="flex justify-between text-sm">
                            <span className="capitalize">{type.toLowerCase()}</span>
                            <span>{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Errors by Severity</h4>
                      <div className="space-y-1">
                        {Object.entries(errorStats.bySeverity).map(([severity, count]) => (
                          <div key={severity} className="flex justify-between text-sm">
                            <span className="capitalize">{severity.toLowerCase()}</span>
                            <span>{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No error data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
            </CardHeader>
            <CardContent>
              {securityStatus ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {securityStatus.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <Badge className={getStatusColor(securityStatus.isValid ? 'healthy' : 'critical')}>
                      {securityStatus.isValid ? 'Secure' : 'Issues Found'}
                    </Badge>
                  </div>

                  {securityStatus.errors.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-600 mb-2">Security Errors</h4>
                      <ul className="space-y-1">
                        {securityStatus.errors.map((error, index) => (
                          <li key={index} className="text-sm text-red-600">• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {securityStatus.warnings.length > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-600 mb-2">Warnings</h4>
                      <ul className="space-y-1">
                        {securityStatus.warnings.map((warning, index) => (
                          <li key={index} className="text-sm text-yellow-600">• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {securityStatus.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {securityStatus.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No security data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Performance metrics coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
