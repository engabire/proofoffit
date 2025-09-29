-- System Health Table Migration
-- Execute this SQL in your Supabase SQL Editor

-- Create the system_health table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_system_health_service_name ON public.system_health(service_name);
CREATE INDEX IF NOT EXISTS idx_system_health_status ON public.system_health(status);
CREATE INDEX IF NOT EXISTS idx_system_health_last_check ON public.system_health(last_check);

-- Enable Row Level Security
ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow service role to manage system health" ON public.system_health
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow authenticated users to read system health" ON public.system_health
    FOR SELECT USING (auth.role() = 'authenticated');

-- Insert initial health data
INSERT INTO public.system_health (service_name, status, response_time_ms, metadata) VALUES
    ('database', 'healthy', 5, '{"version": "16.1", "connections": 10}'),
    ('storage', 'healthy', 15, '{"bucket": "proofoffit-storage", "region": "us-east-1"}'),
    ('auth', 'healthy', 8, '{"provider": "supabase", "users": 0}'),
    ('api', 'healthy', 12, '{"version": "1.0.0", "endpoints": 25}')
ON CONFLICT DO NOTHING;

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_system_health_updated_at 
    BEFORE UPDATE ON public.system_health 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created
SELECT 'system_health table created successfully' as status;
SELECT COUNT(*) as initial_records FROM public.system_health;
