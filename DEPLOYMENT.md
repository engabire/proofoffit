# 🚀 ProofOfFit.com Deployment Guide

This guide provides step-by-step instructions for deploying ProofOfFit.com to production.

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] GitHub repository with admin access
- [ ] Vercel account (free tier available)
- [ ] Supabase account (free tier available)
- [ ] Stripe account (for payments)
- [ ] Domain name (optional, Vercel provides free subdomain)

## 🔧 Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to your users
3. Set a strong database password
4. Wait for the project to be provisioned

### 1.2 Configure Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the following SQL scripts in order:

```sql
-- Enable required extensions
\i infra/supabase/000_extensions.sql

-- Set up Row-Level Security
\i infra/supabase/010_rls.sql

-- Create immutable action log
\i infra/supabase/020_actionlog.sql

-- Complete RLS policies
\i infra/supabase/030_remaining_rls.sql

-- Gifting tables and policies
\i infra/supabase/040_gifting.sql
```

### 1.3 Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this secret!)

### 1.4 Deploy Edge Function

If you haven’t already, install the [Supabase CLI](https://supabase.com/docs/reference/cli/installation) and run:

```bash
supabase functions deploy redeem-gift-code
```

## 🔧 Step 2: Set Up Vercel

### 2.1 Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Import your GitHub repository
4. Set the **Root Directory** to `apps/web`
5. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 2.2 Get Vercel Credentials

1. Go to **Settings** → **General**
2. Copy your **Project ID**
3. Go to **Settings** → **Tokens**
4. Create a new token with **Full Access**
5. Copy the token (you'll need this for GitHub Actions)

## 🔧 Step 3: Configure GitHub Secrets

### 3.1 Add Repository Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add the following secrets:

#### Supabase Secrets
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Vercel Secrets
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

#### Stripe Secrets
```
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRO_PRICE_ID=your_stripe_pro_price_id
```

#### App Secrets
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_random_secret_key
```

### 3.2 How to Get Vercel Org ID

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel whoami`
3. Run: `vercel teams list` (if using team account)
4. The org ID is shown in the output

## 🔧 Step 4: Configure Environment Variables

### 4.1 Vercel Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables for **Production**, **Preview**, and **Development**:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRO_PRICE_ID=your_stripe_pro_price_id

# App
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_random_secret_key

# Optional: AI/LLM (for future features)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional: Email
RESEND_API_KEY=your_resend_api_key
```

## 🔧 Step 5: Set Up Stripe (Optional)

### 5.1 Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account setup process
3. Get your API keys from the **Developers** → **API keys** section

### 5.2 Configure Webhooks

1. Go to **Developers** → **Webhooks**
2. Add endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the webhook signing secret

## 🚀 Step 6: Deploy

### 6.1 Automatic Deployment

1. Push your code to the `main` branch
2. GitHub Actions will automatically:
   - Run tests
   - Build the application
   - Deploy to Vercel

### 6.2 Manual Deployment

If you prefer manual deployment:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Deploy to Vercel
npx vercel --prod
```

## 🔧 Step 7: Post-Deployment Setup

### 7.1 Run Database Migrations

```bash
# Generate Prisma client
cd apps/web
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data (optional)
npx prisma db seed
```

### 7.2 Verify Deployment

1. Visit your Vercel URL
2. Test the following:
   - [ ] Landing page loads
   - [ ] Sign-up flow works
   - [ ] Authentication works
   - [ ] Dashboard loads
   - [ ] Database connections work

### 7.3 Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable

## 🔍 Step 8: Monitoring & Maintenance

### 8.1 Set Up Monitoring

1. **Vercel Analytics**: Automatically enabled
2. **Error Tracking**: Consider adding Sentry
3. **Uptime Monitoring**: Use services like UptimeRobot

### 8.2 Regular Maintenance

- Monitor application performance
- Review error logs
- Update dependencies regularly
- Backup database regularly
- Monitor Stripe webhook deliveries

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules
rm -rf apps/web/.next
npm install
npm run build
```

#### 2. Database Connection Issues
- Verify Supabase credentials
- Check RLS policies are applied
- Ensure database is not paused

#### 3. Authentication Issues
- Verify Supabase Auth settings
- Check redirect URLs in Supabase
- Ensure environment variables are set

#### 4. Stripe Webhook Issues
- Verify webhook endpoint URL
- Check webhook signing secret
- Review webhook event logs

### Getting Help

- Check the [README.md](README.md) for general setup
- Review [TESTING.md](TESTING.md) for testing procedures
- Check GitHub Issues for known problems
- Contact support if needed

## 📊 Deployment Checklist

### Pre-Deployment
- [ ] Supabase project created and configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Vercel project created
- [ ] GitHub secrets configured
- [ ] Environment variables set
- [ ] Stripe account configured (if using payments)
- [ ] All tests passing
- [ ] Build successful locally

### Post-Deployment
- [ ] Application accessible via URL
- [ ] Authentication working
- [ ] Database connections working
- [ ] Error tracking configured
- [ ] Monitoring set up
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Performance monitoring active

## 🎯 Success Metrics

After deployment, monitor these key metrics:

- **Uptime**: >99.9%
- **Response Time**: <250ms average
- **Error Rate**: <1%
- **User Registration**: Track sign-ups
- **Database Performance**: Monitor query times
- **Stripe Integration**: Monitor payment success rates

## 🔄 Updates and Maintenance

### Regular Updates
- Update dependencies monthly
- Review security patches weekly
- Monitor performance metrics daily
- Backup database weekly

### Scaling Considerations
- Monitor database performance
- Consider upgrading Supabase plan
- Implement caching strategies
- Monitor API rate limits

---

## 📞 Support

For deployment issues:
- Check the troubleshooting section above
- Review GitHub Issues
- Contact the development team
- Check Vercel and Supabase documentation

**Happy Deploying! 🚀**
