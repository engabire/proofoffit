# Supabase Security Configuration Guide

This guide provides step-by-step instructions to secure your Supabase project based on the security audit findings.

## 🔍 Security Audit Results

### ✅ **Good Security Practices Found:**
- RLS policies properly implemented with tenant isolation
- Security headers configured
- CSRF protection implemented
- Rate limiting implemented
- Input sanitization implemented
- Proper Supabase client configuration

### ⚠️ **Issues to Fix:**

1. **CSP contains unsafe-inline and unsafe-eval**
2. **Environment files need better protection**
3. **Production URLs need to be configured**

## 🛠️ **Step-by-Step Security Fixes**

### 1. **Fix Content Security Policy (CSP)**

**Issue:** CSP contains `'unsafe-inline'` and `'unsafe-eval'` which reduce security.

**Solution:** Use nonces for inline scripts and styles.

**Steps:**
1. Replace `apps/web/src/lib/security.ts` with `apps/web/src/lib/security-improved.ts`
2. Update your middleware to use the improved security configuration
3. Add nonces to your inline scripts and styles

**Example implementation:**
```typescript
// In your component
const nonce = useNonce(); // Get nonce from context

// In your JSX
<script nonce={nonce}>
  // Your inline script here
</script>

<style nonce={nonce}>
  /* Your inline styles here */
</style>
```

### 2. **Secure Environment Variables**

**Issue:** Environment files may be exposed or contain insecure defaults.

**Steps:**
1. **Update `.gitignore`:**
   ```gitignore
   # Environment files
   .env
   .env.local
   .env.production
   .env.staging
   ```

2. **Update `env.example` with production URLs:**
   ```bash
   # Replace localhost:3000 with your production domain
   NEXTAUTH_URL=https://www.proofoffit.com
   GOOGLE_REDIRECT_URI=https://www.proofoffit.com/auth/callback
   ```

3. **Set secure environment variables in production:**
   ```bash
   # Generate secure secrets
   CSRF_SECRET=$(openssl rand -hex 32)
   NEXTAUTH_SECRET=$(openssl rand -hex 32)
   ```

### 3. **Implement Supabase Security Improvements**

**Run the security improvements SQL:**

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Run the contents of `infra/supabase/security-improvements.sql`**

This will:
- Enable audit logging
- Add enhanced security policies
- Create security monitoring functions
- Add data encryption capabilities
- Set up security alerts

### 4. **Configure Supabase Dashboard Settings**

#### **Authentication Settings:**
1. **Go to Authentication > Settings**
2. **Enable the following:**
   - ✅ Enable email confirmations
   - ✅ Enable phone confirmations
   - ✅ Enable email change confirmations
   - ✅ Enable phone change confirmations
   - ✅ Enable secure email change
   - ✅ Enable secure phone change

3. **Set password requirements:**
   - Minimum length: 8 characters
   - Require uppercase, lowercase, numbers, and special characters

#### **API Settings:**
1. **Go to Settings > API**
2. **Configure CORS:**
   - Remove wildcard (*) origins
   - Add your production domain: `https://www.proofoffit.com`
   - Add your staging domain if applicable

3. **Regenerate API keys if compromised:**
   - Generate new anon key
   - Generate new service role key
   - Update your environment variables

#### **Database Settings:**
1. **Go to Settings > Database**
2. **Enable the following:**
   - ✅ Row Level Security
   - ✅ SSL enforcement
   - ✅ Connection pooling

### 5. **Enable Security Monitoring**

#### **Audit Logs:**
1. **Go to Settings > Audit Logs**
2. **Enable audit logging for:**
   - Authentication events
   - Database changes
   - API access
   - Admin actions

#### **Security Advisor:**
1. **Go to Advisors > Security**
2. **Review and address all warnings**
3. **Set up alerts for:**
   - Failed login attempts
   - Suspicious activity
   - Rate limit violations
   - Unusual access patterns

### 6. **Implement Additional Security Measures**

#### **Rate Limiting:**
```typescript
// Add to your API routes
import { rateLimit } from '@/lib/security-improved';

export const config = {
  api: {
    bodyParser: false,
  },
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per window
});

export default function handler(req, res) {
  const rateLimitError = limiter(req);
  if (rateLimitError) {
    return rateLimitError;
  }
  
  // Your API logic here
}
```

#### **Input Validation:**
```typescript
import { sanitizeInput, validateEmail } from '@/lib/security-improved';

// Validate user input
const sanitizedInput = sanitizeInput(userInput);
const isValidEmail = validateEmail(email);
```

#### **Security Headers:**
```typescript
// Add to your API responses
import { addSecurityHeadersToAPI } from '@/lib/security-improved';

export default function handler(req, res) {
  const response = NextResponse.json(data);
  return addSecurityHeadersToAPI(response);
}
```

### 7. **Monitor and Maintain Security**

#### **Regular Security Tasks:**
- [ ] Review audit logs weekly
- [ ] Update dependencies monthly
- [ ] Rotate API keys quarterly
- [ ] Review RLS policies monthly
- [ ] Test security measures quarterly

#### **Security Monitoring:**
```typescript
// Add security event logging
import { logSecurityEvent } from '@/lib/security-improved';

// Log security events
logSecurityEvent('failed_login', {
  email: userEmail,
  ip: request.ip,
  userAgent: request.headers['user-agent']
}, request);
```

## 🚨 **Critical Security Checklist**

### **Immediate Actions Required:**
- [ ] Fix CSP unsafe directives
- [ ] Secure environment variables
- [ ] Enable email verification
- [ ] Configure CORS properly
- [ ] Enable audit logging

### **High Priority:**
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Enable MFA for admin users
- [ ] Set up security alerts
- [ ] Review RLS policies

### **Medium Priority:**
- [ ] Implement data encryption
- [ ] Add security monitoring
- [ ] Create incident response plan
- [ ] Regular security audits
- [ ] Update security documentation

## 📊 **Security Metrics to Monitor**

1. **Authentication Metrics:**
   - Failed login attempts
   - Successful logins
   - Password reset requests
   - Account lockouts

2. **API Metrics:**
   - Rate limit violations
   - Unusual request patterns
   - Error rates
   - Response times

3. **Database Metrics:**
   - RLS policy violations
   - Unusual query patterns
   - Data access patterns
   - Performance metrics

## 🔗 **Useful Resources**

- [Supabase Security Documentation](https://supabase.com/docs/guides/platform/security)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Authentication Security Best Practices](https://auth0.com/blog/authentication-security-best-practices/)

## 📞 **Support**

If you need help implementing these security measures, refer to:
- Supabase Documentation
- Security audit script: `scripts/supabase-security-audit.js`
- Security improvements: `infra/supabase/security-improvements.sql`
- Enhanced security library: `apps/web/src/lib/security-improved.ts`

---

**Remember:** Security is an ongoing process. Regularly review and update your security measures to stay protected against evolving threats.
