-- Create system_health table for health monitoring
CREATE TABLE IF NOT EXISTS public.system_health (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    status TEXT NOT NULL DEFAULT 'healthy',
    message TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON public.system_health(timestamp DESC);

-- Insert initial health record
INSERT INTO public.system_health (status, message, metadata) 
VALUES (
    'healthy', 
    'System initialized successfully',
    '{"version": "1.0.0", "initialized_at": "' || NOW()::text || '"}'::jsonb
) ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can manage system health" ON public.system_health
    FOR ALL USING (auth.role() = 'service_role');

-- Create policy for anon access (read-only for health checks)
CREATE POLICY "Anon can read system health" ON public.system_health
    FOR SELECT USING (true);
