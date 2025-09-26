import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { supabase_status, vercel_status, stripe_status, overall_status, timestamp } = body

    // Validate required fields
    if (!supabase_status || !vercel_status || !stripe_status || !overall_status || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Log dependency status to audit_events table
    const { error } = await supabase
      .from('audit_events')
      .insert({
        event_type: 'dependency_status_check',
        user_id: 'system',
        metadata: {
          supabase_status,
          vercel_status,
          stripe_status,
          overall_status,
          timestamp,
          source: 'dependency_monitor'
        },
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Failed to log dependency status:', error)
      return NextResponse.json(
        { error: 'Failed to log dependency status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Dependency status logged successfully',
      data: {
        supabase_status,
        vercel_status,
        stripe_status,
        overall_status,
        timestamp
      }
    })

  } catch (error) {
    console.error('Error in dependency monitoring endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get recent dependency status checks
    const { data, error } = await supabase
      .from('audit_events')
      .select('*')
      .eq('event_type', 'dependency_status_check')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Failed to fetch dependency status:', error)
      return NextResponse.json(
        { error: 'Failed to fetch dependency status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error) {
    console.error('Error fetching dependency status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
