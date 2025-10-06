-- Audit Events schema to ensure builds do not fail when queried
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

CREATE INDEX IF NOT EXISTS idx_audit_events_event_type ON public.audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON public.audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON public.audit_events(created_at DESC);

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage audit events" ON public.audit_events;
CREATE POLICY "Service role can manage audit events" ON public.audit_events
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can read their own audit events" ON public.audit_events;
CREATE POLICY "Users can read their own audit events" ON public.audit_events
  FOR SELECT USING (auth.uid()::text = user_id);
