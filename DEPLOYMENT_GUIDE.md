# 🚀 ProofOfFit Deployment Guide

**Version:** 2.0  
**Last Updated:** October 23, 2024  
**Target Platform:** Vercel

## 📋 Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] External service integrations tested
- [ ] SSL certificates configured
- [ ] Domain DNS settings updated

### ✅ Code Quality
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] ESLint checks passed
- [ ] Build process completed successfully
- [ ] Security vulnerabilities addressed

### ✅ Performance
- [ ] Bundle size optimized
- [ ] Core Web Vitals within targets
- [ ] Image optimization configured
- [ ] Caching strategies implemented
- [ ] CDN configuration verified

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://www.proofoffit.com

# External Integrations
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
RESEND_API_KEY=re_...
SENTRY_DSN=https://...

# Monitoring
MONITORING_WEBHOOK_URL=https://hooks.slack.com/...
SECURITY_WEBHOOK_URL=https://hooks.slack.com/...
PAYMENT_WEBHOOK_URL=https://hooks.slack.com/...

# Job Feed APIs
USAJOBS_API_KEY=your_usa_jobs_key
LINKEDIN_CLIENT_ID=your_linkedin_id
LINKEDIN_CLIENT_SECRET=your_linkedin_secret
```

### Optional Environment Variables

```bash
# Analytics
GOOGLE_ANALYTICS_ID=GA-...
MIXPANEL_TOKEN=your_mixpanel_token

# Email Templates
EMAIL_FROM=noreply@proofoffit.com
EMAIL_REPLY_TO=support@proofoffit.com

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_MONITORING=true
ENABLE_AI_FEATURES=true
```

## 🏗️ Build Configuration

### Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "buildCommand": "npm run build:web",
  "outputDirectory": "apps/web/.next",
  "installCommand": "npm ci",
  "ignoreCommand": "node vercel-deployment-guard.js",
  "build": {
    "env": {
      "FORCE_REBUILD": "true"
    }
  },
  "crons": [
    {
      "path": "/api/scrape",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cleanup", 
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/ai/analyze",
      "schedule": "30 */3 * * *"
    }
  ],
  "functions": {
    "app/api/scrape/route.ts": {
      "maxDuration": 300
    },
    "app/api/cleanup/route.ts": {
      "maxDuration": 120
    },
    "app/api/ai/analyze/route.ts": {
      "maxDuration": 300
    }
  }
}
```

### Next.js Configuration (`next.config.js`)

```javascript
const withNextIntl = require('next-intl/plugin')(
  './src/i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    _next_intl_trailing_slash: 'false'
  },
  trailingSlash: false,
  serverExternalPackages: ['@supabase/supabase-js', 'undici'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'www.svgrepo.com',
        port: '',
        pathname: '/show/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
```

## 🗄️ Database Setup

### Supabase Configuration

1. **Create Supabase Project**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link to your project
   supabase link --project-ref your-project-ref
   ```

2. **Run Migrations**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema changes
   npm run db:push
   
   # Run migrations
   npm run db:migrate
   ```

3. **Configure Row Level Security (RLS)**
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
   
   -- Create policies
   CREATE POLICY "Users can view own profile" ON users
     FOR SELECT USING (auth.uid() = id);
   
   CREATE POLICY "Users can update own profile" ON users
     FOR UPDATE USING (auth.uid() = id);
   ```

### Database Seeding

```bash
# Seed development data
npm run db:seed

# Seed production data (if needed)
npm run db:seed:production
```

## 🔐 Security Configuration

### SSL/TLS Setup

1. **Vercel SSL**
   - Automatic SSL certificates via Vercel
   - Custom domain configuration
   - HTTPS redirect enforcement

2. **Security Headers**
   ```javascript
   // Already configured in next.config.js
   async headers() {
     return [
       {
         source: '/(.*)',
         headers: [
           {
             key: 'X-Frame-Options',
             value: 'DENY',
           },
           {
             key: 'X-Content-Type-Options',
             value: 'nosniff',
           },
           {
             key: 'Referrer-Policy',
             value: 'origin-when-cross-origin',
           },
         ],
       },
     ];
   }
   ```

### Authentication Setup

1. **Supabase Auth Configuration**
   ```javascript
   // Configure auth providers
   const authConfig = {
     providers: ['email', 'google', 'github'],
     redirectTo: 'https://www.proofoffit.com/auth/callback',
     siteUrl: 'https://www.proofoffit.com'
   };
   ```

2. **JWT Configuration**
   ```javascript
   // JWT settings
   const jwtConfig = {
     expiresIn: '1h',
     refreshTokenExpiresIn: '7d',
     algorithm: 'HS256'
   };
   ```

## 📊 Monitoring Setup

### Health Checks

1. **Health Endpoint**
   ```typescript
   // /api/health
   export async function GET() {
     const health = await checkSystemHealth();
     return NextResponse.json(health);
   }
   ```

2. **Monitoring Dashboard**
   - Accessible at `/monitoring`
   - Real-time system metrics
   - Alert configuration

### Error Tracking

1. **Sentry Configuration**
   ```javascript
   // sentry.client.config.js
   import * as Sentry from '@sentry/nextjs';
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

2. **Error Boundaries**
   ```typescript
   // Error boundary components
   export function ErrorBoundary({ error }: { error: Error }) {
     Sentry.captureException(error);
     return <ErrorFallback error={error} />;
   }
   ```

## 🚀 Deployment Process

### Automated Deployment (Recommended)

1. **GitHub Actions**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to Production
   
   on:
     push:
       branches: [main]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
         - run: npm ci
         - run: npm run build
         - uses: amondnet/vercel-action@v20
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.ORG_ID }}
             vercel-project-id: ${{ secrets.PROJECT_ID }}
   ```

2. **Vercel Integration**
   - Connect GitHub repository
   - Configure automatic deployments
   - Set up preview deployments for PRs

### Manual Deployment

1. **Build Locally**
   ```bash
   # Install dependencies
   npm ci
   
   # Run tests
   npm run test
   
   # Build for production
   npm run build
   
   # Deploy to Vercel
   vercel --prod
   ```

2. **Verify Deployment**
   ```bash
   # Check health endpoint
   curl https://www.proofoffit.com/api/health
   
   # Check monitoring dashboard
   curl https://www.proofoffit.com/monitoring
   ```

## 🔍 Post-Deployment Verification

### Health Checks

1. **System Health**
   ```bash
   # Check all services
   curl https://www.proofoffit.com/api/health
   
   # Expected response
   {
     "status": "healthy",
     "services": {
       "database": "healthy",
       "storage": "healthy",
       "external": "healthy"
     }
   }
   ```

2. **Performance Metrics**
   ```bash
   # Check Core Web Vitals
   curl https://www.proofoffit.com/api/performance/metrics
   
   # Expected metrics
   {
     "lcp": 1.2,
     "fid": 50,
     "cls": 0.05
   }
   ```

### Functionality Tests

1. **Authentication**
   - [ ] User registration works
   - [ ] User login works
   - [ ] Password reset works
   - [ ] Magic link authentication works

2. **Core Features**
   - [ ] Job search functionality
   - [ ] Job matching algorithm
   - [ ] Application submission
   - [ ] Analytics dashboard

3. **Integrations**
   - [ ] Email notifications
   - [ ] Payment processing
   - [ ] Calendar sync
   - [ ] External job feeds

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   vercel logs --follow
   
   # Common fixes
   npm ci --prefer-offline
   npm run build --verbose
   ```

2. **Environment Variables**
   ```bash
   # Verify environment variables
   vercel env ls
   
   # Add missing variables
   vercel env add VARIABLE_NAME
   ```

3. **Database Connection**
   ```bash
   # Test database connection
   npm run db:test-connection
   
   # Check Supabase status
   curl https://status.supabase.com/api/v2/status.json
   ```

### Performance Issues

1. **Slow Page Loads**
   - Check bundle size
   - Optimize images
   - Enable caching
   - Use CDN

2. **API Timeouts**
   - Check function timeout settings
   - Optimize database queries
   - Implement caching
   - Use background jobs

## 📈 Monitoring & Maintenance

### Regular Maintenance

1. **Weekly Tasks**
   - [ ] Review error logs
   - [ ] Check performance metrics
   - [ ] Update dependencies
   - [ ] Review security alerts

2. **Monthly Tasks**
   - [ ] Database optimization
   - [ ] Security audit
   - [ ] Performance review
   - [ ] Backup verification

### Monitoring Alerts

1. **Critical Alerts**
   - System downtime
   - High error rates
   - Security breaches
   - Payment failures

2. **Warning Alerts**
   - Performance degradation
   - High resource usage
   - Failed integrations
   - Unusual traffic patterns

## 📞 Support

### Deployment Support

- **Documentation**: Check this guide and related docs
- **Issues**: Report deployment issues via GitHub
- **Email**: deployment@proofoffit.com
- **Slack**: #deployment-support channel

### Emergency Procedures

1. **Rollback Process**
   ```bash
   # Rollback to previous deployment
   vercel rollback
   
   # Or deploy specific commit
   vercel --prod --force
   ```

2. **Emergency Contacts**
   - **On-call Engineer**: +1-XXX-XXX-XXXX
   - **DevOps Team**: devops@proofoffit.com
   - **Security Team**: security@proofoffit.com

---

**Deployment Status**: ✅ **PRODUCTION READY**  
**Last Verified**: October 23, 2024  
**Next Review**: November 23, 2024
