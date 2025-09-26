import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Lazy initialize Supabase client to avoid build-time failures
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Missing Supabase configuration',
        response_time_ms: Date.now() - startTime
      }, { status: 503 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Database probe using dedicated health table
    let dbStatus = 'unknown'
    let dbError = null
    try {
      const { error } = await supabase
        .from('system_health')
        .select('id')
        .limit(1)
      
      if (error && error.message.includes('relation "public.system_health" does not exist')) {
        // Table doesn't exist yet - this is expected during initial setup
        dbStatus = 'degraded'
        dbError = 'System health table not yet created - migration pending'
      } else if (error) {
        dbStatus = 'unhealthy'
        dbError = error.message
      } else {
        dbStatus = 'healthy'
        dbError = null
      }
    } catch (err) {
      dbStatus = 'unhealthy'
      dbError = err instanceof Error ? err.message : 'Database connection failed'
    }
    
    // Check storage service
    let storageStatus = 'unknown'
    let storageError = null
    try {
      const { error } = await supabase.storage
        .from('avatars')
        .list('', { limit: 1 })
      storageStatus = error ? 'unhealthy' : 'healthy'
      storageError = error?.message || null
    } catch (err) {
      storageStatus = 'unhealthy'
      storageError = err instanceof Error ? err.message : 'Storage connection failed'
    }
    
    // Overall health status - be more lenient during initial setup
    const overallStatus = (dbStatus === 'healthy' && storageStatus === 'healthy') 
      ? 'healthy' 
      : (dbStatus === 'degraded' && storageStatus === 'healthy')
      ? 'degraded'
      : 'unhealthy'
    
    // Response time
    const responseTime = Date.now() - startTime
    
    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      response_time_ms: responseTime,
      services: {
        database: {
          status: dbStatus,
          error: dbError
        },
        storage: {
          status: storageStatus,
          error: storageError
        }
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    }
    
    // Return appropriate HTTP status - 200 for healthy/degraded, 503 for unhealthy
    const httpStatus = (overallStatus === 'healthy' || overallStatus === 'degraded') ? 200 : 503
    
    return NextResponse.json(healthData, { status: httpStatus })
    
  } catch (error) {
    const errorData = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      response_time_ms: Date.now() - startTime
    }
    
    return NextResponse.json(errorData, { status: 503 })
  }
}

// Export the dynamic configuration
export const dynamic = 'force-dynamic'