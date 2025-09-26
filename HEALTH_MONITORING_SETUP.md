# Health Monitoring Setup Guide

This guide will help you complete the setup of the comprehensive health monitoring system for ProofOfFit.

## Current Status

✅ **Completed:**
- Health endpoint infrastructure (`/api/health`, `/api/health-simple`)
- Degraded banner system
- CI/CD workflows
- Temporary fix for 503 errors

⚠️ **Pending:**
- Database table creation (`system_health`)
- Switch to comprehensive monitoring

## Quick Setup (Recommended)

### Option 1: Automated Setup Script

```bash
# Run the setup script
cd /Users/ngabire.emmanuel/Development/proofoffit
node scripts/setup-health-monitoring.js
```

### Option 2: Manual SQL Setup

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/kvreiaigryeerhfdhbgw)
2. Navigate to **SQL Editor**
3. Run the following SQL:

```sql
CREATE TABLE IF NOT EXISTS public.system_health (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  status TEXT NOT NULL DEFAULT 'healthy',
  message TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON public.system_health(timestamp DESC);

INSERT INTO public.system_health (status, message, metadata) 
VALUES (
  'healthy', 
  'System initialized successfully',
  '{"version": "1.0.0", "initialized_at": "' || NOW()::text || '"}'::jsonb
);

ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage system health" ON public.system_health
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anon can read system health" ON public.system_health
  FOR SELECT USING (true);
```

## After Database Setup

Once the `system_health` table is created, run these commands to complete the setup:

```bash
# 1. Switch back to comprehensive health monitoring
git checkout main
# (The code is already updated to use the proper health endpoint)

# 2. Test the health endpoint
curl https://www.proofoffit.com/api/health | jq .

# 3. Verify the degraded banner is working
# Visit https://www.proofoffit.com and check if the banner shows proper status
```

## Health Monitoring Features

### Endpoints

- **`/api/health`** - Comprehensive health monitoring with database, storage, and auth checks
- **`/api/monitoring/health`** - Detailed monitoring with performance metrics
- **`/api/health-simple`** - Basic health check (temporary, will be removed)

### Monitoring Capabilities

- **Service Health**: Database, Storage, Authentication
- **Performance Metrics**: Response time, memory usage, uptime
- **Error Tracking**: Detailed error messages and service status
- **Real-time Updates**: Banner updates every 30 seconds

### Health Status Levels

- **`healthy`** - All services operational (HTTP 200)
- **`degraded`** - Some services have issues but system is functional (HTTP 200)
- **`unhealthy`** - Critical services are down (HTTP 503)

## Troubleshooting

### If Health Endpoint Returns 503

1. Check if `system_health` table exists:
   ```sql
   SELECT * FROM public.system_health LIMIT 1;
   ```

2. Verify RLS policies:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'system_health';
   ```

3. Test with service role:
   ```bash
   curl -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
        https://www.proofoffit.com/api/health
   ```

### If Degraded Banner Shows Incorrectly

1. Check browser console for errors
2. Verify the health endpoint is accessible
3. Check network tab for failed requests

## Cleanup (After Setup Complete)

Once the comprehensive health monitoring is working:

1. Remove the temporary simple health endpoint:
   ```bash
   rm apps/web/src/app/api/health-simple/route.ts
   rm apps/web/app/api/health-simple/route.ts
   ```

2. Update the degraded banner to use `/api/health` instead of `/api/health-simple`

3. Commit the cleanup:
   ```bash
   git add -A
   git commit -m "cleanup: remove temporary health-simple endpoint"
   git push origin main
   ```

## Monitoring Dashboard

The health monitoring system provides:

- **Real-time Status**: Service health displayed in the banner
- **Performance Metrics**: Response times and system resources
- **Error Tracking**: Detailed error messages for debugging
- **Uptime Monitoring**: GitHub Actions workflow for external monitoring

## Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/engabire/proofoffit/issues)
2. Review the health endpoint responses
3. Check Supabase logs for database errors
4. Verify environment variables are set correctly

---

**Next Step**: Run the SQL setup above, then the health monitoring system will be fully operational! 🚀
