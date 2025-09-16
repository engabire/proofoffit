# 🚀 Vercel Deployment Guide

## ✅ **Issue Resolved: File Limit Exceeded**

The error you encountered:
```
Error: Invalid request: `files` should NOT have more than 15000 items, received 27983.
```

**Root Cause:** Multiple `node_modules` directories (52 total, 706MB) exceeded Vercel's file limit.

**Solution:** Use `--archive=tgz` flag to compress files before upload.

---

## 🎯 **Deployment Options**

### **Option 1: Quick Deploy (Recommended)**
```bash
vercel --prod --archive=tgz
```

### **Option 2: Clean Deploy**
```bash
# Clean up unnecessary files first
rm -rf node_modules
npm ci
vercel --prod
```

### **Option 3: Monorepo Deploy**
```bash
# Deploy only the web app
cd apps/web
vercel --prod
```

---

## 📋 **Step-by-Step Deployment**

### **1. Current Status**
- ✅ **Vercel CLI** is ready and waiting for confirmation
- ✅ **Archive flag** will resolve file limit issue
- ✅ **Configuration files** are in place

### **2. Complete the Deployment**
When prompted:
```
? Set up and deploy "~/Development/proofoffit"? (Y/n)
```
**Answer: `Y`** (Yes)

### **3. Follow the Setup Wizard**
Vercel will guide you through:
- **Project name** (suggest: `proofoffit` or `proof-of-fit`)
- **Framework** (auto-detected: Next.js)
- **Root directory** (set to: `apps/web`)
- **Build settings** (auto-configured)

### **4. Environment Variables**
After deployment, add these in Vercel dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

---

## 🔧 **Files Created for Optimization**

### **`.vercelignore`**
- Excludes `node_modules`, test files, documentation
- Reduces upload size significantly
- Prevents unnecessary files from being deployed

### **`vercel.json`**
- Configures Next.js build settings
- Sets up proper routing for monorepo
- Optimizes function runtime and regions

---

## 🎯 **Recommended Approach**

### **For Production Deployment:**
1. **Use the current command** that's waiting for confirmation
2. **Answer `Y`** to proceed with setup
3. **Set root directory** to `apps/web` when prompted
4. **Add environment variables** after deployment
5. **Test the deployed application**

### **For Future Deployments:**
```bash
# Simple redeploy
vercel --prod

# Or with archive compression
vercel --prod --archive=tgz
```

---

## 🚨 **Important Notes**

### **Root Directory Configuration**
- **Set to:** `apps/web` (not the project root)
- **Reason:** Your Next.js app is in the `apps/web` directory
- **This ensures:** Proper build and deployment

### **Environment Variables**
- **Add after deployment** in Vercel dashboard
- **Required for:** Supabase, Stripe, authentication
- **See:** `apps/web/env.example` for complete list

### **Build Process**
- **Vercel will:** Install dependencies and build automatically
- **Build command:** `npm run build` (configured in vercel.json)
- **Output:** Optimized Next.js application

---

## 🎉 **Expected Results**

After successful deployment:
- ✅ **Live URL** provided by Vercel
- ✅ **Automatic HTTPS** enabled
- ✅ **Global CDN** distribution
- ✅ **Automatic deployments** on git push (if configured)

---

## 🔄 **Next Steps After Deployment**

1. **Test the live application**
2. **Configure environment variables**
3. **Set up Supabase** (if not already done)
4. **Configure Stripe** (if not already done)
5. **Test all features** on the live site
6. **Set up custom domain** (optional)

---

## 📞 **Need Help?**

If you encounter any issues:
1. **Check Vercel dashboard** for build logs
2. **Verify environment variables** are set correctly
3. **Review the deployment logs** for specific errors
4. **See DEPLOYMENT.md** for detailed setup instructions

---

**🚀 Ready to deploy! Answer `Y` to the Vercel prompt to continue.**
