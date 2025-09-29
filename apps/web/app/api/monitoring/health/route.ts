import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get system health data
    const { data: healthData, error: healthError } = await supabase
      .from('system_health')
      .select('*')
      .order('last_check', { ascending: false })

    if (healthError) {
      return NextResponse.json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Failed to fetch health data',
        details: healthError.message
      }, { status: 500 })
    }

    // Calculate overall system status
    const overallStatus = healthData?.every(service => service.status === 'healthy') 
      ? 'healthy' 
      : healthData?.some(service => service.status === 'unhealthy') 
        ? 'unhealthy' 
        : 'degraded'

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: healthData?.reduce((acc, service) => {
        acc[service.service_name] = {
          status: service.status,
          last_check: service.last_check,
          response_time_ms: service.response_time_ms,
          error: service.error_message,
          metadata: service.metadata
        }
        return acc
      }, {} as Record<string, any>) || {},
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 500 })
  }
}
