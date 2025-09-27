# 🚀 Production Environment Setup Guide

## 📋 **Required Environment Variables**

Add these environment variables to your Vercel project settings:

### **Supabase Configuration**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://depgEt-5tumse-nebxic.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### **Stripe Configuration**
```bash
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51S83Ea5r3cXmAzLDY68T3VZeoVtQnvpYS4pg9jR13Qv5u06ELjCqpRtexG4apd6Nrj5GFaYI4bTO7xB1fKbXiXYX00rYLEvEHq
STRIPE_WEBHOOK_SECRET=your_webhook_secret_here
```

### **Google OAuth Configuration**
```bash
GOOGLE_CLIENT_ID=200285779525-9prjj2o3heaarbq8n9kd842fvmikkapb.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://www.proofoffit.com/auth/callback/google
```

### **Application Configuration**
```bash
NEXT_PUBLIC_APP_URL=https://www.proofoffit.com
NEXT_PUBLIC_SITE_URL=https://www.proofoffit.com
```

## 🔧 **Setup Instructions**

### **1. Vercel Environment Variables**
1. Go to your Vercel dashboard
2. Navigate to your ProofOfFit project
3. Go to Settings → Environment Variables
4. Add all the variables above
5. Redeploy your application

### **2. Supabase Setup**
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Execute the migration files:
   - `supabase/migrations/003_system_health_table.sql`
   - `supabase/migrations/004_subscription_system.sql`

### **3. Stripe Webhook Setup**
1. Go to your Stripe dashboard
2. Navigate to Webhooks
3. Add endpoint: `https://www.proofoffit.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### **4. Google OAuth Setup**
1. Go to Google Cloud Console
2. Navigate to APIs & Services → Credentials
3. Update OAuth 2.0 Client ID:
   - Authorized redirect URIs: `https://www.proofoffit.com/auth/callback/google`
   - Authorized JavaScript origins: `https://www.proofoffit.com`

## 🎯 **Next Steps After Setup**

1. **Test Database Health**: Visit `/api/health` to verify system_health table
2. **Test Stripe Integration**: Try subscribing to a plan
3. **Test Google OAuth**: Try signing in with Google
4. **Monitor Logs**: Check Vercel and Supabase logs for any issues

## 🚨 **Important Notes**

- **Stripe Connect URL**: Your Stripe Connect setup expires in 7 days
- **Database**: Make sure to execute the SQL migrations
- **Webhooks**: Stripe webhooks must be configured for subscription management
- **OAuth**: Google OAuth redirect URI must match exactly

## 📞 **Support**

If you encounter any issues:
1. Check the application logs in Vercel
2. Verify all environment variables are set correctly
3. Ensure database migrations have been executed
4. Test each integration individually
