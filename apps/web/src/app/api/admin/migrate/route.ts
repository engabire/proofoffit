import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Admin endpoint to create system_health table
 * This should be protected in production
 */
export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Missing Supabase configuration' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Try to create the table by inserting a test record
    // This will fail if the table doesn't exist, which is what we want
    const { error: testError } = await supabase
      .from('system_health')
      .select('id')
      .limit(1)

    if (testError && testError.message.includes('relation "public.system_health" does not exist')) {
      // Table doesn't exist, we need to create it
      // For now, return instructions for manual creation
      return NextResponse.json({ 
        error: 'Table does not exist',
        instructions: 'Please run the following SQL in Supabase Dashboard:',
        sql: `
CREATE TABLE IF NOT EXISTS public.system_health (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  status TEXT NOT NULL DEFAULT 'healthy',
  message TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON public.system_health(timestamp DESC);

INSERT INTO public.system_health (status, message, metadata) 
VALUES (
  'healthy', 
  'System initialized successfully',
  '{"version": "1.0.0", "initialized_at": "' || NOW()::text || '"}'::jsonb
);

ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage system health" ON public.system_health
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anon can read system health" ON public.system_health
  FOR SELECT USING (true);
        `
      }, { status: 404 })
    }

    if (testError) {
      return NextResponse.json({ error: testError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'System health table already exists' 
    })

  } catch (error) {
    console.error('Migration check failed:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
