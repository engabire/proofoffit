#!/bin/bash

# Security Monitoring Script
# Run this script regularly to monitor security metrics

echo "🔍 Security Monitoring Report"
echo "=============================="
echo ""

# Check for failed login attempts (if you have access to Supabase logs)
echo "📊 Recent Security Events:"
echo "- Check Supabase Dashboard > Logs for failed login attempts"
echo "- Review audit logs for suspicious activity"
echo "- Monitor rate limit violations"
echo ""

# Check environment variables
echo "🔐 Environment Security:"
if [ -f "apps/web/.env" ]; then
    echo "❌ .env file exists (should not be committed)"
else
    echo "✅ No .env file found"
fi

if [ -f "apps/web/.env.local" ]; then
    echo "⚠️  .env.local file exists (ensure it's in .gitignore)"
else
    echo "✅ No .env.local file found"
fi

# Check for security headers in response
echo ""
echo "🛡️  Security Headers:"
echo "- Run: curl -I https://www.proofoffit.com"
echo "- Verify security headers are present"
echo ""

# Check for CSP violations
echo "🚫 Content Security Policy:"
echo "- Check browser console for CSP violations"
echo "- Verify nonces are working correctly"
echo ""

echo "📋 Next Steps:"
echo "1. Review Supabase Dashboard > Advisors > Security"
echo "2. Check for any new warnings or errors"
echo "3. Update dependencies if needed"
echo "4. Review RLS policies"
echo "5. Test authentication flows"
