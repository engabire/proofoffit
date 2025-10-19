-- ProofOfFit Core Database Schema
-- Implements the foundational tables for job matching, consent management,
-- reliability tracking, and audit logging as per architectural doctrine.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Jobs table with compound ID (source:id)
CREATE TABLE jobs (
    id TEXT PRIMARY KEY, -- Compound ID: source:id (e.g., "seed:1", "google:abc123")
    source TEXT NOT NULL CHECK (source IN ('seed', 'manual', 'google', 'greenhouse')),
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    remote BOOLEAN DEFAULT FALSE,
    salary_min INTEGER,
    salary_max INTEGER,
    currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP', 'CAD', 'AUD')),
    posted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    apply_url TEXT,
    raw_data JSONB,
    flags JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE
);

-- Consent events for GDPR/CCPA compliance
CREATE TABLE consent_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN (
        'policy_accept', 'data_export', 'data_delete', 
        'marketing_opt_in', 'marketing_opt_out'
    )),
    policy_version TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Work events for reliability and audit trail
CREATE TABLE work_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT NOT NULL,
    signature TEXT NOT NULL,
    prev_hash TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    event_type TEXT NOT NULL,
    data JSONB NOT NULL,
    verified BOOLEAN DEFAULT FALSE
);

-- Policy registry for versioned policies
CREATE TABLE policy_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_type TEXT NOT NULL CHECK (policy_type IN (
        'privacy', 'terms', 'cookie', 'data_processing'
    )),
    version TEXT NOT NULL,
    effective_date TIMESTAMP WITH TIME ZONE NOT NULL,
    content TEXT NOT NULL,
    checksum TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Job search events linked to consent
CREATE TABLE job_search_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT,
    session_id TEXT NOT NULL,
    consent_id UUID NOT NULL REFERENCES consent_events(id),
    query JSONB NOT NULL,
    results JSONB NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Job metadata for structured extras
CREATE TABLE job_meta (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(job_id, key)
);

-- Reliability metrics for providers
CREATE TABLE reliability_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    metrics JSONB NOT NULL,
    events JSONB NOT NULL
);

-- FitScore results cache
CREATE TABLE fitscore_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id TEXT NOT NULL,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    breakdown JSONB NOT NULL,
    explanation TEXT NOT NULL,
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    bias_check JSONB NOT NULL,
    reliability JSONB NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '7 days')
);

-- Salary detection results
CREATE TABLE salary_detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    detected_ranges JSONB NOT NULL,
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    source TEXT NOT NULL,
    raw_text TEXT,
    detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Admin audit logs
CREATE TABLE admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Rate limiting tracking
CREATE TABLE rate_limit_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(key, window_start)
);

-- Indexes for performance
CREATE INDEX idx_jobs_source ON jobs(source);
CREATE INDEX idx_jobs_posted_at ON jobs(posted_at);
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_remote ON jobs(remote);
CREATE INDEX idx_jobs_salary_range ON jobs(salary_min, salary_max);
CREATE INDEX idx_jobs_closed_at ON jobs(closed_at);

CREATE INDEX idx_consent_events_user_id ON consent_events(user_id);
CREATE INDEX idx_consent_events_timestamp ON consent_events(timestamp);
CREATE INDEX idx_consent_events_event_type ON consent_events(event_type);

CREATE INDEX idx_work_events_source ON work_events(source);
CREATE INDEX idx_work_events_timestamp ON work_events(timestamp);
CREATE INDEX idx_work_events_event_type ON work_events(event_type);

CREATE INDEX idx_policy_registry_type_version ON policy_registry(policy_type, version);
CREATE INDEX idx_policy_registry_effective_date ON policy_registry(effective_date);
CREATE INDEX idx_policy_registry_active ON policy_registry(is_active);

CREATE INDEX idx_job_search_events_user_id ON job_search_events(user_id);
CREATE INDEX idx_job_search_events_session_id ON job_search_events(session_id);
CREATE INDEX idx_job_search_events_consent_id ON job_search_events(consent_id);
CREATE INDEX idx_job_search_events_timestamp ON job_search_events(timestamp);

CREATE INDEX idx_job_meta_job_id ON job_meta(job_id);
CREATE INDEX idx_job_meta_key ON job_meta(key);

CREATE INDEX idx_reliability_metrics_provider_id ON reliability_metrics(provider_id);
CREATE INDEX idx_reliability_metrics_timestamp ON reliability_metrics(timestamp);

CREATE INDEX idx_fitscore_results_candidate_job ON fitscore_results(candidate_id, job_id);
CREATE INDEX idx_fitscore_results_overall_score ON fitscore_results(overall_score);
CREATE INDEX idx_fitscore_results_calculated_at ON fitscore_results(calculated_at);
CREATE INDEX idx_fitscore_results_expires_at ON fitscore_results(expires_at);

CREATE INDEX idx_salary_detections_job_id ON salary_detections(job_id);
CREATE INDEX idx_salary_detections_confidence ON salary_detections(confidence);

CREATE INDEX idx_admin_audit_logs_admin_user_id ON admin_audit_logs(admin_user_id);
CREATE INDEX idx_admin_audit_logs_timestamp ON admin_audit_logs(timestamp);
CREATE INDEX idx_admin_audit_logs_action ON admin_audit_logs(action);

CREATE INDEX idx_rate_limit_tracking_key_window ON rate_limit_tracking(key, window_start);

-- Row Level Security (RLS) policies
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitscore_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Jobs: Public read access, admin write access
CREATE POLICY jobs_read_policy ON jobs FOR SELECT USING (true);
CREATE POLICY jobs_write_policy ON jobs FOR ALL USING (
    current_setting('app.current_user_role', true) = 'admin'
);

-- Consent events: Users can only see their own events
CREATE POLICY consent_events_user_policy ON consent_events FOR ALL USING (
    user_id = current_setting('app.current_user_id', true)
);

-- Job search events: Users can only see their own events
CREATE POLICY job_search_events_user_policy ON job_search_events FOR ALL USING (
    user_id = current_setting('app.current_user_id', true) OR
    current_setting('app.current_user_role', true) = 'admin'
);

-- FitScore results: Users can only see their own results
CREATE POLICY fitscore_results_user_policy ON fitscore_results FOR ALL USING (
    candidate_id = current_setting('app.current_user_id', true) OR
    current_setting('app.current_user_role', true) = 'admin'
);

-- Admin audit logs: Only admins can access
CREATE POLICY admin_audit_logs_admin_policy ON admin_audit_logs FOR ALL USING (
    current_setting('app.current_user_role', true) = 'admin'
);

-- Functions for data integrity and automation

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired FitScore results
CREATE OR REPLACE FUNCTION cleanup_expired_fitscores()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM fitscore_results WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old rate limit tracking
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM rate_limit_tracking WHERE created_at < NOW() - INTERVAL '24 hours';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get job statistics
CREATE OR REPLACE FUNCTION get_job_statistics()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_jobs', COUNT(*),
        'open_jobs', COUNT(*) FILTER (WHERE closed_at IS NULL),
        'closed_jobs', COUNT(*) FILTER (WHERE closed_at IS NOT NULL),
        'remote_jobs', COUNT(*) FILTER (WHERE remote = TRUE),
        'jobs_with_salary', COUNT(*) FILTER (WHERE salary_min IS NOT NULL),
        'by_source', jsonb_object_agg(source, source_count)
    ) INTO result
    FROM (
        SELECT source, COUNT(*) as source_count
        FROM jobs
        GROUP BY source
    ) source_stats
    CROSS JOIN jobs;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to validate consent before job search
CREATE OR REPLACE FUNCTION validate_consent_for_search(user_id_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    has_valid_consent BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM consent_events
        WHERE user_id = user_id_param
        AND event_type = 'policy_accept'
        AND timestamp > NOW() - INTERVAL '1 year'
        ORDER BY timestamp DESC
        LIMIT 1
    ) INTO has_valid_consent;
    
    RETURN has_valid_consent;
END;
$$ LANGUAGE plpgsql;

-- Views for common queries

-- View for active jobs with salary information
CREATE VIEW active_jobs_with_salary AS
SELECT 
    j.*,
    sd.detected_ranges as salary_ranges,
    sd.confidence as salary_confidence
FROM jobs j
LEFT JOIN salary_detections sd ON j.id = sd.job_id
WHERE j.closed_at IS NULL
AND (j.salary_min IS NOT NULL OR sd.detected_ranges IS NOT NULL);

-- View for job search analytics
CREATE VIEW job_search_analytics AS
SELECT 
    DATE_TRUNC('day', timestamp) as search_date,
    COUNT(*) as total_searches,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions,
    AVG((results->>'totalFound')::INTEGER) as avg_results_per_search
FROM job_search_events
GROUP BY DATE_TRUNC('day', timestamp)
ORDER BY search_date DESC;

-- View for reliability metrics summary
CREATE VIEW provider_reliability_summary AS
SELECT 
    provider_id,
    DATE_TRUNC('hour', timestamp) as hour_bucket,
    AVG((metrics->>'uptime')::DECIMAL) as avg_uptime,
    AVG((metrics->>'responseTime')::DECIMAL) as avg_response_time,
    AVG((metrics->>'errorRate')::DECIMAL) as avg_error_rate,
    SUM((events->>'successful')::INTEGER) as total_successful,
    SUM((events->>'failed')::INTEGER) as total_failed
FROM reliability_metrics
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY provider_id, DATE_TRUNC('hour', timestamp)
ORDER BY provider_id, hour_bucket DESC;

-- Initial data setup

-- Insert default policies
INSERT INTO policy_registry (policy_type, version, effective_date, content, checksum) VALUES
('privacy', '1.0.0', NOW(), 'Default privacy policy content', encode(digest('Default privacy policy content', 'sha256'), 'hex')),
('terms', '1.0.0', NOW(), 'Default terms of service content', encode(digest('Default terms of service content', 'sha256'), 'hex'));

-- Create a scheduled job for cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-fitscores', '0 2 * * *', 'SELECT cleanup_expired_fitscores();');
-- SELECT cron.schedule('cleanup-rate-limits', '0 */6 * * *', 'SELECT cleanup_old_rate_limits();');

-- Comments for documentation
COMMENT ON TABLE jobs IS 'Core jobs table with compound ID (source:id) for multi-provider support';
COMMENT ON TABLE consent_events IS 'GDPR/CCPA consent tracking for compliance';
COMMENT ON TABLE work_events IS 'Reliability and audit trail with cryptographic signatures';
COMMENT ON TABLE policy_registry IS 'Versioned policy management for transparency';
COMMENT ON TABLE job_search_events IS 'Search analytics linked to consent for privacy compliance';
COMMENT ON TABLE job_meta IS 'Flexible metadata storage for job-specific data';
COMMENT ON TABLE reliability_metrics IS 'Provider health and performance tracking';
COMMENT ON TABLE fitscore_results IS 'Cached FitScore calculations with expiration';
COMMENT ON TABLE salary_detections IS 'AI-detected salary information from job descriptions';
COMMENT ON TABLE admin_audit_logs IS 'Administrative action logging for security';
COMMENT ON TABLE rate_limit_tracking IS 'Rate limiting state management';

COMMENT ON COLUMN jobs.id IS 'Compound ID format: source:id (e.g., seed:1, google:abc123)';
COMMENT ON COLUMN jobs.raw_data IS 'Provider-specific raw data for debugging and analysis';
COMMENT ON COLUMN jobs.flags IS 'Flexible flags for job state and metadata';
COMMENT ON COLUMN work_events.signature IS 'Cryptographic signature for integrity verification';
COMMENT ON COLUMN work_events.prev_hash IS 'Previous event hash for chain verification';
COMMENT ON COLUMN fitscore_results.expires_at IS 'Cache expiration for performance optimization';
