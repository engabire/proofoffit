# Environment Setup Guide

## Quick Setup Instructions

### 1. Create Environment File
Create `apps/web/.env.local` with the following content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe Configuration (Optional for MVP)
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
STRIPE_PRO_PRICE_ID=price_your_pro_monthly_price_id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3006
NEXTAUTH_SECRET=your_nextauth_secret_here

# AI/LLM Configuration (Optional)
OPENAI_API_KEY=sk-your_openai_api_key
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key

# Email Configuration (Optional)
RESEND_API_KEY=re_your_resend_api_key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# USAJOBS API (Optional)
USAJOBS_API_KEY=your_usajobs_api_key

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3006
```

### 2. Database Setup
Once environment variables are configured, create the system_health table:

#### Option A: Using API Endpoint
```bash
curl -X POST http://localhost:3006/api/admin/create-system-health
```

#### Option B: Manual SQL Execution
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Execute the following SQL:

```sql
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

CREATE INDEX IF NOT EXISTS idx_system_health_service_name ON public.system_health(service_name);
CREATE INDEX IF NOT EXISTS idx_system_health_status ON public.system_health(status);
CREATE INDEX IF NOT EXISTS idx_system_health_last_check ON public.system_health(last_check);

ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role to manage system health" ON public.system_health
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow authenticated users to read system health" ON public.system_health
    FOR SELECT USING (auth.role() = 'authenticated');

INSERT INTO public.system_health (service_name, status, response_time_ms, metadata) VALUES
    ('database', 'healthy', 5, '{"version": "16.1", "connections": 10}'),
    ('storage', 'healthy', 15, '{"bucket": "proofoffit-storage", "region": "us-east-1"}'),
    ('auth', 'healthy', 8, '{"provider": "supabase", "users": 0}'),
    ('api', 'healthy', 12, '{"version": "1.0.0", "endpoints": 25}')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_system_health_updated_at 
    BEFORE UPDATE ON public.system_health 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Test the Setup
After setting up environment variables and database:

```bash
# Test health endpoint
curl http://localhost:3006/api/health

# Test simple health endpoint
curl http://localhost:3006/api/health-simple

# Test admin endpoints (after env setup)
curl -X POST http://localhost:3006/api/admin/setup-health
```

### 4. Production Deployment
For Vercel deployment, add the same environment variables in your Vercel dashboard:
- Go to your Vercel project settings
- Navigate to Environment Variables
- Add all the variables from your .env.local file
- Redeploy your application

## Current Status
- ✅ Development server running on http://localhost:3006
- ✅ All API routes restored and functional
- ✅ Health monitoring system implemented
- ⏳ Environment variables need to be configured
- ⏳ Database table needs to be created
- ⏳ Production deployment pending
