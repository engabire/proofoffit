import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if audit_events table exists
    const { error } = await supabase
      .from('audit_events')
      .select('id')
      .limit(1)

    if (!error) {
      return NextResponse.json({ 
        success: true, 
        message: 'audit_events table already exists' 
      })
    }

    // If table doesn't exist, provide SQL for manual execution
    const createTableSQL = `
-- Create audit_events table for compliance and audit logging
CREATE TABLE IF NOT EXISTS public.audit_events (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id TEXT,
    user_id TEXT,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_events_event_type ON public.audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_events_entity_type ON public.audit_events(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON public.audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON public.audit_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON public.audit_events(action);

-- Enable Row Level Security
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Policy for service role to manage audit events
DROP POLICY IF EXISTS "Service role can manage audit events" ON public.audit_events;
CREATE POLICY "Service role can manage audit events" ON public.audit_events
    FOR ALL USING (auth.role() = 'service_role');

-- Policy for authenticated users to read their own audit events
DROP POLICY IF EXISTS "Users can read their own audit events" ON public.audit_events;
CREATE POLICY "Users can read their own audit events" ON public.audit_events
    FOR SELECT USING (auth.uid()::text = user_id);

-- Policy for admin users to read all audit events
DROP POLICY IF EXISTS "Admin can read all audit events" ON public.audit_events;
CREATE POLICY "Admin can read all audit events" ON public.audit_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid()::text 
            AND profiles.role = 'admin'
        )
    );

-- Function to update 'updated_at' timestamp automatically
CREATE OR REPLACE FUNCTION update_audit_events_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call the update function on updates
DROP TRIGGER IF EXISTS update_audit_events_updated_at ON public.audit_events;
CREATE TRIGGER update_audit_events_updated_at
    BEFORE UPDATE ON public.audit_events
    FOR EACH ROW EXECUTE FUNCTION update_audit_events_updated_at_column();

-- Insert some sample audit events for testing
INSERT INTO public.audit_events (event_type, entity_type, action, details, metadata) VALUES
    ('system', 'application', 'startup', '{"version": "1.0.0", "environment": "production"}', '{"source": "migration"}'),
    ('user', 'profile', 'created', '{"profile_type": "candidate"}', '{"source": "migration"}'),
    ('compliance', 'data_processing', 'consent_given', '{"consent_type": "data_processing"}', '{"source": "migration"}')
ON CONFLICT (id) DO NOTHING;
    `

    return NextResponse.json({ 
      success: false, 
      message: 'audit_events table does not exist. Please execute the following SQL in your Supabase SQL Editor:',
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
      error: 'Failed to check audit_events table',
      details: error.message 
    }, { status: 500 })
  }
}
