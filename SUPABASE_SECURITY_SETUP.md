# Supabase Security Setup Instructions

## 🚀 Quick Setup Steps

### 1. Run Security Improvements SQL
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `infra/supabase/security-improvements.sql`
4. Execute the SQL

### 2. Configure Authentication Settings
1. Go to Authentication > Settings
2. Enable the following:
   - ✅ Enable email confirmations
   - ✅ Enable phone confirmations
   - ✅ Enable email change confirmations
   - ✅ Enable phone change confirmations
   - ✅ Enable secure email change
   - ✅ Enable secure phone change

### 3. Configure API Settings
1. Go to Settings > API
2. Configure CORS:
   - Remove wildcard (*) origins
   - Add: `https://www.proofoffit.com`
3. Regenerate API keys if needed

### 4. Enable Audit Logging
1. Go to Settings > Audit Logs
2. Enable audit logging for:
   - Authentication events
   - Database changes
   - API access
   - Admin actions

### 5. Review Security Advisor
1. Go to Advisors > Security
2. Address all warnings
3. Set up alerts for suspicious activity

## 🔧 Environment Variables

Add these to your production environment:

```bash
# Security
CSRF_SECRET=your-64-character-hex-secret
NEXTAUTH_SECRET=your-64-character-hex-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXTAUTH_URL=https://www.proofoffit.com
```

## 📊 Monitoring

Run the security monitoring script regularly:
```bash
./scripts/security-monitor.sh
```

## 🆘 Support

If you encounter issues:
1. Check the Supabase Dashboard logs
2. Review the security audit report
3. Consult the security guide: `SUPABASE_SECURITY_GUIDE.md`
