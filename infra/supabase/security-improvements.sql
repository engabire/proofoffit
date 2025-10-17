-- Supabase Security Improvements
-- Run these commands in your Supabase SQL editor to improve security

-- 1. Enable audit logging for all tables
CREATE EXTENSION IF NOT EXISTS "pg_audit";

-- Enable audit logging for sensitive tables
SELECT audit.enable('users');
SELECT audit.enable('candidate_profiles');
SELECT audit.enable('jobs');
SELECT audit.enable('employer_intakes');
SELECT audit.enable('applications');
SELECT audit.enable('action_log');

-- 2. Create additional security policies
-- Ensure users can only access their own data
CREATE POLICY IF NOT EXISTS "users_own_data" ON users
FOR ALL USING (auth.uid() = id);

-- Prevent users from accessing other tenants' data
CREATE POLICY IF NOT EXISTS "strict_tenant_isolation" ON users
FOR ALL USING (
  tenant_id = (auth.jwt()->>'tenant_id')::uuid
);

-- 3. Add security functions
-- Function to check if user belongs to tenant
CREATE OR REPLACE FUNCTION auth.user_belongs_to_tenant(tenant_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND tenant_id = tenant_uuid
  );
$$;

-- Function to get user's tenant
CREATE OR REPLACE FUNCTION auth.get_user_tenant()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT tenant_id FROM users WHERE id = auth.uid();
$$;

-- 4. Enhanced RLS policies using the new functions
-- Update existing policies to use the new functions
DROP POLICY IF EXISTS "tenant_isolation_candidate_profiles" ON candidate_profiles;
CREATE POLICY "tenant_isolation_candidate_profiles" ON candidate_profiles
FOR ALL USING (
  auth.user_belongs_to_tenant(tenant_id)
);

-- 5. Create security monitoring views
CREATE OR REPLACE VIEW security.failed_logins AS
SELECT 
  created_at,
  email,
  ip_address,
  user_agent
FROM auth.audit_log_entries
WHERE event_type = 'sign_in_failed'
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW security.suspicious_activity AS
SELECT 
  created_at,
  user_id,
  event_type,
  ip_address,
  user_agent
FROM auth.audit_log_entries
WHERE event_type IN ('sign_in_failed', 'token_refresh_failed', 'password_reset_requested')
ORDER BY created_at DESC;

-- 6. Add rate limiting for authentication
CREATE OR REPLACE FUNCTION auth.check_rate_limit(
  identifier text,
  max_attempts integer DEFAULT 5,
  window_minutes integer DEFAULT 15
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  attempt_count integer;
BEGIN
  -- Count failed attempts in the time window
  SELECT COUNT(*)
  INTO attempt_count
  FROM auth.audit_log_entries
  WHERE event_type = 'sign_in_failed'
    AND email = identifier
    AND created_at > NOW() - INTERVAL '1 minute' * window_minutes;
  
  -- Return true if under limit
  RETURN attempt_count < max_attempts;
END;
$$;

-- 7. Create security alerts function
CREATE OR REPLACE FUNCTION security.create_alert(
  alert_type text,
  message text,
  severity text DEFAULT 'medium'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO security.alerts (type, message, severity, created_at)
  VALUES (alert_type, message, severity, NOW());
END;
$$;

-- 8. Create alerts table if it doesn't exist
CREATE TABLE IF NOT EXISTS security.alerts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL,
  message text NOT NULL,
  severity text DEFAULT 'medium',
  resolved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT NOW(),
  resolved_at timestamp with time zone
);

-- Enable RLS on alerts table
ALTER TABLE security.alerts ENABLE ROW LEVEL SECURITY;

-- Only admins can see alerts
CREATE POLICY "admin_only_alerts" ON security.alerts
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 9. Add data encryption for sensitive fields
-- Create function to encrypt sensitive data
CREATE OR REPLACE FUNCTION security.encrypt_sensitive_data(data text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use pgcrypto for encryption
  RETURN encode(
    pgp_sym_encrypt(data, current_setting('app.encryption_key', true)),
    'base64'
  );
END;
$$;

-- Create function to decrypt sensitive data
CREATE OR REPLACE FUNCTION security.decrypt_sensitive_data(encrypted_data text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use pgcrypto for decryption
  RETURN pgp_sym_decrypt(
    decode(encrypted_data, 'base64'),
    current_setting('app.encryption_key', true)
  );
END;
$$;

-- 10. Add security settings
-- Set encryption key (replace with your own secure key)
-- ALTER SYSTEM SET app.encryption_key = 'your-secure-encryption-key-here';

-- Enable row security for all new tables by default
ALTER DATABASE postgres SET row_security = on;

-- 11. Create security monitoring dashboard data
CREATE OR REPLACE VIEW security.dashboard_metrics AS
SELECT 
  (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '24 hours') as new_users_24h,
  (SELECT COUNT(*) FROM auth.audit_log_entries WHERE event_type = 'sign_in_failed' AND created_at > NOW() - INTERVAL '24 hours') as failed_logins_24h,
  (SELECT COUNT(*) FROM security.alerts WHERE resolved = false) as active_alerts,
  (SELECT COUNT(*) FROM users WHERE last_sign_in_at > NOW() - INTERVAL '7 days') as active_users_7d;

-- 12. Add security constraints
-- Ensure email addresses are valid
ALTER TABLE users ADD CONSTRAINT valid_email 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Ensure tenant_id is not null for non-admin users
ALTER TABLE users ADD CONSTRAINT tenant_required 
CHECK (role = 'admin' OR tenant_id IS NOT NULL);

-- 13. Create security cleanup function
CREATE OR REPLACE FUNCTION security.cleanup_old_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete audit logs older than 90 days
  DELETE FROM auth.audit_log_entries 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Delete resolved alerts older than 30 days
  DELETE FROM security.alerts 
  WHERE resolved = true 
  AND resolved_at < NOW() - INTERVAL '30 days';
END;
$$;

-- 14. Schedule cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-security-logs', '0 2 * * *', 'SELECT security.cleanup_old_logs();');

-- 15. Add security indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_audit_log_entries_created_at ON auth.audit_log_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_entries_event_type ON auth.audit_log_entries(event_type);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON security.alerts(resolved);

-- 16. Grant necessary permissions
GRANT USAGE ON SCHEMA security TO authenticated;
GRANT SELECT ON security.dashboard_metrics TO authenticated;
GRANT SELECT ON security.failed_logins TO authenticated;
GRANT SELECT ON security.suspicious_activity TO authenticated;

-- 17. Create security documentation
COMMENT ON SCHEMA security IS 'Security-related functions, views, and tables for monitoring and alerting';
COMMENT ON FUNCTION auth.user_belongs_to_tenant IS 'Check if the current user belongs to the specified tenant';
COMMENT ON FUNCTION auth.get_user_tenant IS 'Get the tenant ID for the current user';
COMMENT ON FUNCTION auth.check_rate_limit IS 'Check if a user has exceeded rate limits for authentication';
COMMENT ON FUNCTION security.create_alert IS 'Create a security alert';
COMMENT ON FUNCTION security.cleanup_old_logs IS 'Clean up old security logs and alerts';
