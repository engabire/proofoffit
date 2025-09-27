import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Execute the migration using direct SQL
    const { error } = await supabase
      .from('system_health')
      .select('id')
      .limit(1)

    if (!error) {
      return NextResponse.json({ 
        success: true, 
        message: 'system_health table already exists' 
      })
    }

    // If table doesn't exist, we need to create it via SQL
    // Since we can't execute DDL directly, let's provide the SQL for manual execution
    const createTableSQL = `
-- Execute this SQL in your Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS public.system_health (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('healthy', 'degraded', 'unhealthy')),
    last_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_time_ms INTEGER,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_system_health_service_name ON public.system_health(service_name);
CREATE INDEX IF NOT EXISTS idx_system_health_status ON public.system_health(status);
CREATE INDEX IF NOT EXISTS idx_system_health_last_check ON public.system_health(last_check);

ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role to manage system health" ON public.system_health
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow authenticated users to read system health" ON public.system_health
    FOR SELECT USING (auth.role() = 'authenticated');

INSERT INTO public.system_health (service_name, status, response_time_ms, metadata) VALUES
    ('database', 'healthy', 5, '{"version": "16.1", "connections": 10}'),
    ('storage', 'healthy', 15, '{"bucket": "proofoffit-storage", "region": "us-east-1"}'),
    ('auth', 'healthy', 8, '{"provider": "supabase", "users": 0}'),
    ('api', 'healthy', 12, '{"version": "1.0.0", "endpoints": 25}')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_system_health_updated_at 
    BEFORE UPDATE ON public.system_health 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `

    return NextResponse.json({ 
      success: false, 
      message: 'system_health table does not exist. Please execute the following SQL in your Supabase SQL Editor:',
      sql: createTableSQL,
      instructions: [
        '1. Go to your Supabase Dashboard',
        '2. Navigate to SQL Editor',
        '3. Copy and paste the SQL above',
        '4. Execute the SQL',
        '5. Verify the table was created successfully'
      ]
    })

  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check system_health table',
      details: error.message 
    }, { status: 500 })
  }
}
