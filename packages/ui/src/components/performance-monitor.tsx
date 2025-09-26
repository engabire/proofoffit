import React, { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { Progress } from './progress'
import { 
  Activity, 
  Zap, 
  Database, 
  Globe, 
  Clock, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'

interface PerformanceMetrics {
  timestamp: string
  responseTime: number
  memoryUsage: {
    used: number
    total: number
    external: number
    rss: number
  }
  uptime: number
  services: {
    database: {
      status: 'healthy' | 'degraded' | 'unhealthy'
      responseTime: number
      error?: string
    }
    storage: {
      status: 'healthy' | 'degraded' | 'unhealthy'
      responseTime: number
      error?: string
    }
    authentication: {
      status: 'healthy' | 'degraded' | 'unhealthy'
      responseTime: number
      error?: string
    }
  }
  system: {
    nodeVersion: string
    platform: string
    environment: string
  }
}

interface PerformanceMonitorProps {
  className?: string
  refreshInterval?: number
  showDetails?: boolean
  compact?: boolean
}

export function PerformanceMonitor({
  className,
  refreshInterval = 30000,
  showDetails = true,
  compact = false
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchMetrics = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/monitoring/health', {
        cache: 'no-store'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setMetrics(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMetrics()
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchMetrics, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchMetrics, refreshInterval])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-emerald-600 dark:text-emerald-400'
      case 'degraded':
        return 'text-amber-600 dark:text-amber-400'
      case 'unhealthy':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-slate-600 dark:text-slate-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4" />
      case 'degraded':
        return <AlertTriangle className="h-4 w-4" />
      case 'unhealthy':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  if (compact) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
                ) : error ? (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                ) : (
                  <Activity className="h-4 w-4 text-emerald-500" />
                )}
                <span className="text-sm font-medium">System Status</span>
              </div>
              {metrics && (
                <Badge
                  variant={metrics.services.database.status === 'healthy' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {metrics.services.database.status}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              {metrics && (
                <>
                  <span>{metrics.responseTime}ms</span>
                  <span>{formatBytes(metrics.memoryUsage.used * 1024 * 1024)}</span>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchMetrics}
                disabled={loading}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className={cn('h-3 w-3', loading && 'animate-spin')} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Monitor
            </CardTitle>
            <CardDescription>
              Real-time system performance metrics
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMetrics}
              disabled={loading}
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/50">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Error loading metrics</span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
          </div>
        )}

        {metrics && (
          <>
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium">Response Time</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {metrics.responseTime}ms
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  API endpoint response
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium">Memory Usage</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {formatBytes(metrics.memoryUsage.used * 1024 * 1024)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {Math.round((metrics.memoryUsage.used / metrics.memoryUsage.total) * 100)}% of total
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium">Uptime</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {formatUptime(metrics.uptime)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  System uptime
                </div>
              </div>
            </div>

            {/* Service Status */}
            {showDetails && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Service Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(metrics.services).map(([service, data]) => (
                    <div
                      key={service}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {service === 'database' && <Database className="h-4 w-4" />}
                          {service === 'storage' && <Globe className="h-4 w-4" />}
                          {service === 'authentication' && <Activity className="h-4 w-4" />}
                          <span className="text-sm font-medium capitalize">
                            {service}
                          </span>
                        </div>
                        <div className={cn('flex items-center gap-1', getStatusColor(data.status))}>
                          {getStatusIcon(data.status)}
                          <span className="text-xs font-medium capitalize">
                            {data.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Response: {data.responseTime}ms
                      </div>
                      {data.error && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {data.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Information */}
            {showDetails && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  System Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Node Version:</span>
                    <span className="ml-2 font-mono">{metrics.system.nodeVersion}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Platform:</span>
                    <span className="ml-2 font-mono">{metrics.system.platform}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Environment:</span>
                    <span className="ml-2 font-mono">{metrics.system.environment}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Last Updated:</span>
                    <span className="ml-2 font-mono">
                      {new Date(metrics.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
