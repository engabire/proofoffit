import { NextRequest, NextResponse } from 'next/server'
import { env, isSupabaseConfigured, isDemoMode } from '@/lib/env'

export async function GET(request: NextRequest) {
  // Only allow in development or with special header
  const debugHeader = request.headers.get('x-debug-env')
  const isDev = process.env.NODE_ENV === 'development'
  
  if (!isDev && debugHeader !== 'proofoffit-debug') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  return NextResponse.json({
    environment: {
      nodeEnv: process.env.NODE_ENV,
      supabaseUrl: env.supabase.url ? 'SET' : 'NOT_SET',
      supabaseAnonKey: env.supabase.anonKey ? 'SET' : 'NOT_SET',
      supabaseServiceRoleKey: env.supabase.serviceRoleKey ? 'SET' : 'NOT_SET',
      demoMode: env.app.demoMode,
      isSupabaseConfigured: isSupabaseConfigured(),
      isDemoMode: isDemoMode(),
    },
    rawEnv: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
      NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
    }
  })
}
