-- Error logging table for comprehensive error tracking
CREATE TABLE IF NOT EXISTS public.error_logs (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    stack TEXT,
    code VARCHAR(50),
    status_code INTEGER,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    request_id VARCHAR(255),
    endpoint VARCHAR(500),
    method VARCHAR(10),
    user_agent TEXT,
    ip INET,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_endpoint ON public.error_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_error_logs_status_code ON public.error_logs(status_code);
CREATE INDEX IF NOT EXISTS idx_error_logs_code ON public.error_logs(code);
CREATE INDEX IF NOT EXISTS idx_error_logs_request_id ON public.error_logs(request_id);

-- Enable RLS
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Service role can manage all error logs" ON public.error_logs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can view their own error logs" ON public.error_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Create function to clean up old error logs (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_error_logs()
RETURNS void AS $$
BEGIN
    -- Delete error logs older than 90 days
    DELETE FROM public.error_logs 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Log cleanup activity
    INSERT INTO public.action_log (
        action,
        objType,
        objId,
        payloadHash
    ) VALUES (
        'error_logs_cleanup',
        'system',
        'error_logs',
        'cleanup_90_days'
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to get error statistics
CREATE OR REPLACE FUNCTION get_error_statistics(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
    total_errors BIGINT,
    errors_by_type JSONB,
    errors_by_endpoint JSONB,
    errors_by_status_code JSONB,
    recent_errors JSONB
) AS $$
BEGIN
    RETURN QUERY
    WITH error_stats AS (
        SELECT 
            COUNT(*) as total,
            jsonb_object_agg(
                COALESCE(metadata->>'type', 'unknown'), 
                type_count
            ) as by_type,
            jsonb_object_agg(
                COALESCE(endpoint, 'unknown'), 
                endpoint_count
            ) as by_endpoint,
            jsonb_object_agg(
                COALESCE(status_code::text, 'unknown'), 
                status_count
            ) as by_status
        FROM (
            SELECT 
                metadata->>'type',
                endpoint,
                status_code,
                COUNT(*) as type_count,
                COUNT(*) as endpoint_count,
                COUNT(*) as status_count
            FROM public.error_logs
            WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL
            GROUP BY metadata->>'type', endpoint, status_code
        ) stats
    ),
    recent_errors AS (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', id,
                'message', message,
                'code', code,
                'status_code', status_code,
                'endpoint', endpoint,
                'method', method,
                'created_at', created_at,
                'metadata', metadata
            )
        ) as recent
        FROM (
            SELECT id, message, code, status_code, endpoint, method, created_at, metadata
            FROM public.error_logs
            WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL
            ORDER BY created_at DESC
            LIMIT 10
        ) recent
    )
    SELECT 
        COALESCE(error_stats.total, 0)::BIGINT,
        COALESCE(error_stats.by_type, '{}'::jsonb),
        COALESCE(error_stats.by_endpoint, '{}'::jsonb),
        COALESCE(error_stats.by_status, '{}'::jsonb),
        COALESCE(recent_errors.recent, '[]'::jsonb)
    FROM error_stats, recent_errors;
END;
$$ LANGUAGE plpgsql;

-- Create function to get error trends
CREATE OR REPLACE FUNCTION get_error_trends(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
    date DATE,
    error_count BIGINT,
    unique_users BIGINT,
    top_errors JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(created_at) as date,
        COUNT(*) as error_count,
        COUNT(DISTINCT user_id) as unique_users,
        jsonb_agg(
            jsonb_build_object(
                'message', message,
                'count', message_count
            )
        ) as top_errors
    FROM (
        SELECT 
            DATE(created_at) as created_at,
            user_id,
            message,
            COUNT(*) as message_count
        FROM public.error_logs
        WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL
        GROUP BY DATE(created_at), user_id, message
        ORDER BY message_count DESC
    ) trends
    GROUP BY DATE(created_at)
    ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically log errors to action_log
CREATE OR REPLACE FUNCTION log_error_to_action_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.action_log (
        action,
        objType,
        objId,
        payloadHash
    ) VALUES (
        'error_logged',
        'error_log',
        NEW.id::text,
        COALESCE(NEW.code, 'unknown')
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_error_to_action_log
    AFTER INSERT ON public.error_logs
    FOR EACH ROW
    EXECUTE FUNCTION log_error_to_action_log();

-- Create view for error dashboard
CREATE OR REPLACE VIEW public.error_dashboard AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_errors,
    COUNT(DISTINCT user_id) as affected_users,
    COUNT(DISTINCT endpoint) as affected_endpoints,
    AVG(CASE WHEN status_code IS NOT NULL THEN status_code ELSE 0 END) as avg_status_code,
    jsonb_agg(
        DISTINCT jsonb_build_object(
            'message', message,
            'count', message_count
        )
    ) as top_errors
FROM (
    SELECT 
        created_at,
        user_id,
        endpoint,
        status_code,
        message,
        COUNT(*) as message_count
    FROM public.error_logs
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY created_at, user_id, endpoint, status_code, message
) error_summary
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Grant permissions
GRANT SELECT ON public.error_dashboard TO authenticated;
GRANT EXECUTE ON FUNCTION get_error_statistics(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_error_trends(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_error_logs() TO service_role;
