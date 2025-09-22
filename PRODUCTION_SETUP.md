# 🚀 Production Setup Guide for ProofOfFit

## Environment Variables Required

Create a `.env.local` file in `apps/web/` with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Job Feed APIs
USAJOBS_API_KEY=your_usajobs_api_key
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
INDEED_PUBLISHER_ID=your_indeed_publisher_id

# Admin & Security
ADMIN_API_KEY=your_secure_admin_key
CRON_SECRET=your_cron_secret

# Stripe (for premium features)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRO_PRICE_ID=price_pro_monthly

# App Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret

# AI/LLM (for document generation)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Email (for notifications)
RESEND_API_KEY=your_resend_api_key
```

## API Keys Setup

### 1. USAJOBS API
- Visit: https://data.usajobs.gov/
- Register for free API access
- Get your API key for government job feeds

### 2. LinkedIn API
- Visit: https://developer.linkedin.com/
- Create a LinkedIn app
- Get Client ID and Client Secret
- Request job posting API access

### 3. Indeed API
- Visit: https://ads.indeed.com/jobroll/xmlfeed
- Register for Indeed Publisher API
- Get your Publisher ID

### 4. Supabase Setup
- Create a Supabase project
- Get your project URL and API keys
- Set up the database schema

## Deployment Steps

### 1. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel --prod
```

### 2. Environment Variables in Vercel
- Add all environment variables in Vercel dashboard
- Set up Vercel Cron for job feed refresh

### 3. Database Setup
```bash
# Run migrations
npx prisma db push

# Seed initial data
npx prisma db seed
```

## Scheduled Jobs

Set up Vercel Cron to refresh job feeds every 6 hours:

```json
{
  "crons": [
    {
      "path": "/api/cron/refresh-jobs",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

## Testing Production

1. **Test Job Search API**: `https://your-domain.com/api/jobs/search`
2. **Test Employer Dashboard**: `https://your-domain.com/employer/dashboard`
3. **Test Application Tracking**: `https://your-domain.com/candidate/applications`

## Monitoring

- Set up error tracking (Sentry)
- Monitor API usage and rate limits
- Track job feed refresh success rates
- Monitor application submission success

## Security Checklist

- [ ] All API keys are secure and not exposed
- [ ] Rate limiting is configured
- [ ] CORS is properly set up
- [ ] Authentication is working
- [ ] Database RLS policies are active
- [ ] HTTPS is enforced
- [ ] Security headers are configured

## Performance Optimization

- [ ] Enable Next.js caching
- [ ] Set up CDN for static assets
- [ ] Optimize database queries
- [ ] Implement job feed caching
- [ ] Set up monitoring and alerting

