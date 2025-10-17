#!/bin/bash

# Supabase Security Fixes Implementation Script
# This script helps implement the security fixes identified in the audit

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_header "Supabase Security Fixes Implementation"

# 1. Backup current security configuration
print_header "Backing up current configuration"
if [ -f "apps/web/src/lib/security.ts" ]; then
    cp apps/web/src/lib/security.ts apps/web/src/lib/security.ts.backup
    print_status "Backed up current security.ts"
fi

# 2. Update security configuration
print_header "Updating security configuration"
if [ -f "apps/web/src/lib/security-improved.ts" ]; then
    cp apps/web/src/lib/security-improved.ts apps/web/src/lib/security.ts
    print_status "Updated security.ts with improved configuration"
else
    print_error "security-improved.ts not found"
    exit 1
fi

# 3. Update .gitignore
print_header "Updating .gitignore"
if [ -f ".gitignore" ]; then
    # Check if environment files are already in .gitignore
    if ! grep -q "\.env" .gitignore; then
        echo "" >> .gitignore
        echo "# Environment files" >> .gitignore
        echo ".env" >> .gitignore
        echo ".env.local" >> .gitignore
        echo ".env.production" >> .gitignore
        echo ".env.staging" >> .gitignore
        print_status "Added environment files to .gitignore"
    else
        print_info "Environment files already in .gitignore"
    fi
else
    print_error ".gitignore file not found"
fi

# 4. Update env.example with production URLs
print_header "Updating environment configuration"
if [ -f "apps/web/env.example" ]; then
    # Replace localhost:3000 with production URL
    sed -i.bak 's/localhost:3000/https:\/\/www.proofoffit.com/g' apps/web/env.example
    print_status "Updated env.example with production URLs"
    
    # Remove backup file
    rm apps/web/env.example.bak
else
    print_error "env.example file not found"
fi

# 5. Generate secure secrets
print_header "Generating secure secrets"
if command -v openssl &> /dev/null; then
    CSRF_SECRET=$(openssl rand -hex 32)
    NEXTAUTH_SECRET=$(openssl rand -hex 32)
    
    echo "Generated secure secrets:"
    echo "CSRF_SECRET=$CSRF_SECRET"
    echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
    echo ""
    print_warning "Add these to your production environment variables"
    print_info "You can also add them to your .env.local file for development"
else
    print_warning "OpenSSL not found. Please generate secure secrets manually:"
    print_info "CSRF_SECRET: 64-character hex string"
    print_info "NEXTAUTH_SECRET: 64-character hex string"
fi

# 6. Check for existing .env files
print_header "Checking for environment files"
if [ -f "apps/web/.env" ]; then
    print_warning ".env file exists - ensure it's not committed to git"
fi

if [ -f "apps/web/.env.local" ]; then
    print_warning ".env.local file exists - ensure it's not committed to git"
fi

# 7. Create security monitoring script
print_header "Creating security monitoring script"
cat > scripts/security-monitor.sh << 'EOF'
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
EOF

chmod +x scripts/security-monitor.sh
print_status "Created security monitoring script"

# 8. Create Supabase security setup instructions
print_header "Creating Supabase setup instructions"
cat > SUPABASE_SECURITY_SETUP.md << 'EOF'
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
EOF

print_status "Created Supabase setup instructions"

# 9. Final checks
print_header "Final Security Checks"
print_info "Running security audit..."
if [ -f "scripts/supabase-security-audit.js" ]; then
    node scripts/supabase-security-audit.js
else
    print_warning "Security audit script not found"
fi

# 10. Summary
print_header "Implementation Summary"
print_status "Security configuration updated"
print_status "Environment files secured"
print_status "Monitoring scripts created"
print_status "Setup instructions generated"

echo ""
print_info "Next steps:"
echo "1. Review and implement the Supabase security improvements"
echo "2. Update your production environment variables"
echo "3. Test the security measures"
echo "4. Run regular security monitoring"
echo ""
print_warning "Important: Test all authentication flows after implementing these changes"
echo ""
print_info "For detailed instructions, see:"
echo "- SUPABASE_SECURITY_GUIDE.md"
echo "- SUPABASE_SECURITY_SETUP.md"
echo ""
print_status "Security fixes implementation complete!"
