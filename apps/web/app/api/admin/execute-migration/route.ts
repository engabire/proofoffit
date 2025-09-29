import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { sql } = await request.json()
    
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        error: 'SQL is required' 
      }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Execute the SQL migration
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      console.error('Migration error:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Migration failed',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Migration executed successfully',
      data 
    })

  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to execute migration',
      details: error.message 
    }, { status: 500 })
  }
}
