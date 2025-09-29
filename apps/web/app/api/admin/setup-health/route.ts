import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Admin endpoint to set up health monitoring
 * This creates the system_health table and initial data
 */
export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Missing Supabase configuration',
        message: 'Please check environment variables'
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Try to create the table using a simple insert approach
    // This will fail if the table doesn't exist, which is what we want
    const { error: testError } = await supabase
      .from('system_health')
      .select('id')
      .limit(1)

    if (testError && testError.message.includes('relation "public.system_health" does not exist')) {
      // Table doesn't exist - provide SQL instructions
      return NextResponse.json({
        success: false,
        message: 'System health table does not exist',
        action: 'manual_setup_required',
        instructions: 'Please run the following SQL in your Supabase Dashboard SQL Editor:',
        sql: `
-- Create the system_health table
CREATE TABLE IF NOT EXISTS public.system_health (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  status TEXT NOT NULL DEFAULT 'healthy',
  message TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create performance index
CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON public.system_health(timestamp DESC);

-- Insert initial health record
INSERT INTO public.system_health (status, message, metadata) 
VALUES (
  'healthy', 
  'System initialized successfully',
  '{"version": "1.0.0", "initialized_at": "' || NOW()::text || '"}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Service role can manage system health" ON public.system_health
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anon can read system health" ON public.system_health
  FOR SELECT USING (true);
        `,
        next_steps: [
          '1. Copy the SQL above',
          '2. Go to your Supabase Dashboard → SQL Editor',
          '3. Paste and run the SQL',
          '4. Test the health endpoint: GET /api/health',
          '5. Verify the degraded banner behavior'
        ]
      }, { status: 404 })
    }

    if (testError) {
      return NextResponse.json({ 
        error: testError.message,
        message: 'Database connection failed'
      }, { status: 500 })
    }

    // Table exists - insert a new health record
    const { error: insertError } = await supabase
      .from('system_health')
      .insert({
        status: 'healthy',
        message: 'Health monitoring setup completed',
        metadata: {
          version: '1.0.0',
          setup_completed_at: new Date().toISOString(),
          endpoint: '/api/admin/setup-health'
        }
      })

    if (insertError) {
      return NextResponse.json({ 
        error: insertError.message,
        message: 'Failed to insert health record'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Health monitoring setup completed successfully',
      table_exists: true,
      record_inserted: true,
      next_steps: [
        '1. Test the health endpoint: GET /api/health',
        '2. Verify the degraded banner behavior',
        '3. Check the health monitoring dashboard'
      ]
    })

  } catch (error) {
    console.error('Health setup failed:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Health monitoring setup failed'
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
