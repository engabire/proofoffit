import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    // Verify monitoring token
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (token !== process.env.MONITORING_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await req.json()
    const { status, response_time_ms, database_status, auth_status, storage_status, timestamp } = body
    
    // Log uptime check to database
    const { data, error } = await supabase
      .from('uptime_checks')
      .insert({
        status,
        response_time_ms,
        database_status,
        auth_status,
        storage_status,
        timestamp: timestamp || new Date().toISOString()
      })
    
    if (error) {
      console.error('Error logging uptime check:', error)
      return NextResponse.json({ error: 'Failed to log uptime check' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    console.error('Uptime monitoring error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
