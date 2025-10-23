-- Add performance indexes for AI matching engine
-- This migration adds critical indexes to improve query performance

-- Index for jobs table - frequently queried by status
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

-- Index for jobs table - frequently queried by company
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);

-- Index for jobs table - frequently queried by location
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);

-- Index for jobs table - frequently queried by created_at for ordering
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- Index for candidate_profiles table - frequently queried by updated_at
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_updated_at ON candidate_profiles(updated_at DESC);

-- Index for candidate_profiles table - frequently queried by user_id
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_user_id ON candidate_profiles(user_id);

-- Index for applications table - frequently queried by user_id
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);

-- Index for applications table - frequently queried by job_id
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);

-- Index for applications table - frequently queried by status
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Index for applications table - frequently queried by applied_at
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON applications(applied_at DESC);

-- Composite index for applications table - common query pattern
CREATE INDEX IF NOT EXISTS idx_applications_user_status ON applications(user_id, status);

-- Index for user_profiles table - frequently queried by email
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Index for user_profiles table - frequently queried by created_at
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at DESC);

-- Index for analytics events - frequently queried by timestamp
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp DESC);

-- Index for analytics events - frequently queried by event_type
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);

-- Composite index for analytics events - common query pattern
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_timestamp ON analytics_events(event_type, timestamp DESC);

-- Index for audit_logs table - frequently queried by timestamp
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- Index for audit_logs table - frequently queried by user_id
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Composite index for audit_logs table - common query pattern
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_timestamp ON audit_logs(user_id, timestamp DESC);

-- Add comments for documentation
COMMENT ON INDEX idx_jobs_status IS 'Optimizes queries filtering jobs by status (active, closed, etc.)';
COMMENT ON INDEX idx_jobs_company IS 'Optimizes queries filtering jobs by company name';
COMMENT ON INDEX idx_jobs_location IS 'Optimizes queries filtering jobs by location';
COMMENT ON INDEX idx_jobs_created_at IS 'Optimizes queries ordering jobs by creation date';
COMMENT ON INDEX idx_candidate_profiles_updated_at IS 'Optimizes queries ordering candidate profiles by update date';
COMMENT ON INDEX idx_candidate_profiles_user_id IS 'Optimizes queries joining candidate profiles with users';
COMMENT ON INDEX idx_applications_user_id IS 'Optimizes queries fetching applications by user';
COMMENT ON INDEX idx_applications_job_id IS 'Optimizes queries fetching applications by job';
COMMENT ON INDEX idx_applications_status IS 'Optimizes queries filtering applications by status';
COMMENT ON INDEX idx_applications_applied_at IS 'Optimizes queries ordering applications by application date';
COMMENT ON INDEX idx_applications_user_status IS 'Optimizes common query pattern: user applications by status';
COMMENT ON INDEX idx_user_profiles_email IS 'Optimizes user lookup by email';
COMMENT ON INDEX idx_user_profiles_created_at IS 'Optimizes queries ordering users by creation date';
COMMENT ON INDEX idx_analytics_events_timestamp IS 'Optimizes analytics queries by timestamp';
COMMENT ON INDEX idx_analytics_events_type IS 'Optimizes analytics queries by event type';
COMMENT ON INDEX idx_analytics_events_type_timestamp IS 'Optimizes common analytics query pattern';
COMMENT ON INDEX idx_audit_logs_timestamp IS 'Optimizes audit log queries by timestamp';
COMMENT ON INDEX idx_audit_logs_user_id IS 'Optimizes audit log queries by user';
COMMENT ON INDEX idx_audit_logs_user_timestamp IS 'Optimizes common audit log query pattern';
