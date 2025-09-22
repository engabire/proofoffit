import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Check database connectivity
    const { data: dbCheck, error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    const dbStatus = dbError ? 'unhealthy' : 'healthy'
    const dbResponseTime = Date.now() - startTime
    
    // Check authentication service
    const { data: authCheck, error: authError } = await supabase.auth.getSession()
    const authStatus = authError ? 'unhealthy' : 'healthy'
    
    // Check storage service
    const { data: storageCheck, error: storageError } = await supabase.storage
      .from('avatars')
      .list('', { limit: 1 })
    const storageStatus = storageError ? 'unhealthy' : 'healthy'
    
    // Overall health status
    const overallStatus = (dbStatus === 'healthy' && authStatus === 'healthy' && storageStatus === 'healthy') 
      ? 'healthy' 
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
          response_time_ms: dbResponseTime,
          error: dbError?.message || null
        },
        authentication: {
          status: authStatus,
          error: authError?.message || null
        },
        storage: {
          status: storageStatus,
          error: storageError?.message || null
        }
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    }
    
    // Return appropriate HTTP status
    const httpStatus = overallStatus === 'healthy' ? 200 : 503
    
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