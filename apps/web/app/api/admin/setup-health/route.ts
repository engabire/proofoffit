import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if system_health table exists
    const { data: healthData, error: healthError } = await supabase
      .from('system_health')
      .select('id')
      .limit(1)

    if (healthError) {
      return NextResponse.json({ 
        success: false, 
        error: 'system_health table does not exist',
        details: healthError.message,
        setup_required: true
      }, { status: 404 })
    }

    // Initialize health data if table exists but is empty
    const { data: existingData, error: countError } = await supabase
      .from('system_health')
      .select('id')

    if (countError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to check existing health data',
        details: countError.message 
      }, { status: 500 })
    }

    if (!existingData || existingData.length === 0) {
      // Insert initial health data
      const { error: insertError } = await supabase
        .from('system_health')
        .insert([
          {
            service_name: 'database',
            status: 'healthy',
            response_time_ms: 5,
            metadata: { version: '16.1', connections: 10 }
          },
          {
            service_name: 'storage',
            status: 'healthy',
            response_time_ms: 15,
            metadata: { bucket: 'proofoffit-storage', region: 'us-east-1' }
          },
          {
            service_name: 'auth',
            status: 'healthy',
            response_time_ms: 8,
            metadata: { provider: 'supabase', users: 0 }
          },
          {
            service_name: 'api',
            status: 'healthy',
            response_time_ms: 12,
            metadata: { version: '1.0.0', endpoints: 25 }
          }
        ])

      if (insertError) {
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to insert initial health data',
          details: insertError.message 
        }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Health monitoring setup completed',
        data_initialized: true
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Health monitoring is already set up',
      data_exists: true
    })

  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to setup health monitoring',
      details: error.message 
    }, { status: 500 })
  }
}
