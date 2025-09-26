import { NextRequest, NextResponse } from 'next/server'

/**
 * Simple health endpoint that doesn't depend on database tables
 * Use this as a temporary fix while the system_health table is being created
 */
export async function GET(req: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Basic health check without database dependency
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      response_time_ms: Date.now() - startTime,
      services: {
        system: {
          status: 'healthy',
          message: 'Basic health check passed'
        }
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    }
    
    return NextResponse.json(healthData, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
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

export const dynamic = 'force-dynamic'
