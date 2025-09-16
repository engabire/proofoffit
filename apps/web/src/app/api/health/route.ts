import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/env'

export async function GET() {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: isSupabaseConfigured() ? 'configured' : 'demo_mode',
        stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'demo_mode',
        auth: isSupabaseConfigured() ? 'configured' : 'demo_mode'
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      deployment: {
        domain: process.env.VERCEL_URL || 'localhost',
        region: process.env.VERCEL_REGION || 'local'
      }
    }

    return NextResponse.json(health, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}

// Force dynamic rendering for health checks
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
