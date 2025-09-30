-- Database Setup Script for ProofOfFit
-- Execute this SQL in your Supabase SQL Editor

-- 1. Create system_health table
CREATE TABLE IF NOT EXISTS public.system_health (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('healthy', 'degraded', 'unhealthy')),
    last_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_time_ms INTEGER,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for system_health
CREATE INDEX IF NOT EXISTS idx_system_health_service_name ON public.system_health(service_name);
CREATE INDEX IF NOT EXISTS idx_system_health_status ON public.system_health(status);
CREATE INDEX IF NOT EXISTS idx_system_health_last_check ON public.system_health(last_check);

-- Enable RLS for system_health
ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

-- Policies for system_health
DROP POLICY IF EXISTS "Service role can manage system health" ON public.system_health;
CREATE POLICY "Service role can manage system health" ON public.system_health
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Anon can read system health" ON public.system_health;
CREATE POLICY "Anon can read system health" ON public.system_health
    FOR SELECT USING (true);

-- 2. Create audit_events table
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

-- Add indexes for audit_events
CREATE INDEX IF NOT EXISTS idx_audit_events_event_type ON public.audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_events_entity_type ON public.audit_events(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON public.audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON public.audit_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON public.audit_events(action);

-- Enable RLS for audit_events
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Policies for audit_events
DROP POLICY IF EXISTS "Service role can manage audit events" ON public.audit_events;
CREATE POLICY "Service role can manage audit events" ON public.audit_events
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can read their own audit events" ON public.audit_events;
CREATE POLICY "Users can read their own audit events" ON public.audit_events
    FOR SELECT USING (auth.uid()::text = user_id);

-- 3. Insert initial data
INSERT INTO public.system_health (service_name, status, response_time_ms, metadata) VALUES
    ('database', 'healthy', 5, '{"version": "16.1", "connections": 10}'),
    ('storage', 'healthy', 15, '{"bucket": "proofoffit-storage", "region": "us-east-1"}'),
    ('auth', 'healthy', 8, '{"provider": "supabase", "users": 0}'),
    ('api', 'healthy', 12, '{"version": "1.0.0", "endpoints": 25}')
ON CONFLICT (service_name) DO UPDATE SET
    status = EXCLUDED.status,
    last_check = EXCLUDED.last_check,
    response_time_ms = EXCLUDED.response_time_ms,
    error_message = EXCLUDED.error_message,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();

INSERT INTO public.audit_events (event_type, entity_type, action, details, metadata) VALUES
    ('system', 'application', 'startup', '{"version": "1.0.0", "environment": "production"}', '{"source": "migration"}'),
    ('user', 'profile', 'created', '{"profile_type": "candidate"}', '{"source": "migration"}'),
    ('compliance', 'data_processing', 'consent_given', '{"consent_type": "data_processing"}', '{"source": "migration"}')
ON CONFLICT (id) DO NOTHING;

-- 4. Create update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_system_health_updated_at ON public.system_health;
CREATE TRIGGER update_system_health_updated_at
    BEFORE UPDATE ON public.system_health
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_audit_events_updated_at ON public.audit_events;
CREATE TRIGGER update_audit_events_updated_at
    BEFORE UPDATE ON public.audit_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
