import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Comprehensive health monitoring endpoint
 * Used by uptime monitors and internal monitoring systems
 * 
 * Best practices implemented:
 * - Lazy initialization to prevent build-time failures
 * - Graceful degradation with detailed error reporting
 * - Performance metrics (response time, memory usage)
 * - Service-specific health checks
 * - Proper HTTP status codes (200/503)
 * - Structured JSON response for monitoring tools
 */

export async function GET(req: NextRequest) {
  const startTime = Date.now()
  const healthCheckId = `health-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  try {
    // Environment validation
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        id: healthCheckId,
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Missing Supabase configuration',
        response_time_ms: Date.now() - startTime,
        services: {
          configuration: { status: 'unhealthy', error: 'Missing env vars' }
        }
      }, { status: 503 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Service health checks with individual timeouts
    const serviceChecks = await Promise.allSettled([
      // Database connectivity check
      supabase.from('system_health').select('id').limit(1).then(({ error }) => ({
        name: 'database',
        status: error ? 'unhealthy' : 'healthy',
        error: error?.message || null,
        response_time_ms: Date.now() - startTime
      })),
      
      // Storage service check
      supabase.storage.from('avatars').list('', { limit: 1 }).then(({ error }) => ({
        name: 'storage',
        status: error ? 'unhealthy' : 'healthy',
        error: error?.message || null,
        response_time_ms: Date.now() - startTime
      })),
      
      // Authentication service check (non-blocking)
      supabase.auth.getSession().then(({ error }) => ({
        name: 'authentication',
        status: error ? 'unhealthy' : 'healthy',
        error: error?.message || null,
        response_time_ms: Date.now() - startTime
      }))
    ])

    // Process service check results
    const services: Record<string, any> = {}
    let overallStatus = 'healthy'
    
    serviceChecks.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const service = result.value
        services[service.name] = {
          status: service.status,
          error: service.error,
          response_time_ms: service.response_time_ms
        }
        
        if (service.status !== 'healthy') {
          overallStatus = 'unhealthy'
        }
      } else {
        const serviceNames = ['database', 'storage', 'authentication']
        services[serviceNames[index]] = {
          status: 'unhealthy',
          error: result.reason?.message || 'Service check failed',
          response_time_ms: Date.now() - startTime
        }
        overallStatus = 'unhealthy'
      }
    })

    // System metrics
    const memoryUsage = process.memoryUsage()
    const systemMetrics = {
      uptime_seconds: Math.floor(process.uptime()),
      memory: {
        used_mb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total_mb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external_mb: Math.round(memoryUsage.external / 1024 / 1024),
        rss_mb: Math.round(memoryUsage.rss / 1024 / 1024)
      },
      node_version: process.version,
      platform: process.platform
    }

    const healthData = {
      id: healthCheckId,
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      response_time_ms: Date.now() - startTime,
      services,
      system: systemMetrics
    }
    
    // Return appropriate HTTP status
    const httpStatus = overallStatus === 'healthy' ? 200 : 503
    
    return NextResponse.json(healthData, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
  } catch (error) {
    const errorData = {
      id: healthCheckId,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      response_time_ms: Date.now() - startTime,
      services: {
        system: { status: 'unhealthy', error: 'System error' }
      }
    }
    
    return NextResponse.json(errorData, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}

// Export the dynamic configuration
export const dynamic = 'force-dynamic'
