# Enhanced Authentication Component Guide

## Overview

The enhanced authentication system provides a modern, enterprise-grade sign-in/sign-up experience with dual audience support and advanced authentication methods.

## Features

### 🎯 Dual Audience Design
- **Hiring Team**: Enterprise SSO, domain routing, admin controls
- **Job Seeker**: Email-first flow, magic links, simplified experience

### 🔐 Authentication Methods
- **Email + Magic Link**: Passwordless authentication
- **SSO Integration**: Google Workspace, Microsoft Entra ID, Custom SSO
- **Passkey Support**: WebAuthn (coming soon)
- **Domain Routing**: Automatic SSO detection based on email domain

### 🎨 Brand Consistency
- **Colors**: Dark navy (#0B1220) with violet→cyan gradient accents
- **Design**: Modern, responsive layout with Framer Motion animations
- **Typography**: Clean, professional styling

## Usage

### Environment Variable Toggle

Enable the enhanced authentication by setting:
```bash
NEXT_PUBLIC_USE_ENHANCED_AUTH=true
```

### Direct Access

Access the enhanced pages directly:
- **Enhanced Sign-in**: `/auth/signin-enhanced`
- **Enhanced Sign-up**: `/auth/signup-enhanced`

### Integration

The enhanced component integrates seamlessly with the existing authentication system:

```tsx
import EnhancedEnterpriseLoginV2 from '@/components/auth/enhanced-enterprise-login-v2'

<EnhancedEnterpriseLoginV2 
  mode="signin"
  redirectTo="/dashboard"
  defaultAudience="hirer"
/>
```

## Configuration

### Domain Routing

Configure automatic SSO detection by updating the `DOMAIN_ROUTING` object:

```typescript
const DOMAIN_ROUTING: Record<string, Provider> = {
  "yourcompany.com": { key: "sso", label: "Sign in with YourCompany SSO", hint: "Okta" },
  "acme.io": { key: "google", label: "Continue with Google Workspace" },
  "contoso.com": { key: "microsoft", label: "Continue with Microsoft Entra ID" },
};
```

### Legal Links

Customize legal links:

```typescript
<EnhancedEnterpriseLoginV2 
  legalLinks={{
    terms: "/legal/terms",
    privacy: "/legal/privacy", 
    eeoc: "/legal/eeoc"
  }}
/>
```

## Technical Details

### Dependencies Added
- `react-hook-form`: Form management and validation
- `@hookform/resolvers`: Form validation resolvers
- `zod`: Schema validation

### Form Validation
- Email validation with Zod schema
- Real-time error display
- Loading states and error handling

### Authentication Flow
1. User enters email
2. System detects domain and suggests SSO (for hirers)
3. User chooses authentication method
4. Redirects to appropriate callback with success/error handling

## Backward Compatibility

The enhanced component is fully backward compatible:
- Existing authentication flows continue to work
- No breaking changes to current functionality
- Gradual rollout via environment variable
- Fallback to original components when disabled

## Testing

### Development Testing
- Domain routing tests run automatically in development
- Console logs show test results for domain detection
- Audience toggle functionality verified

### Production Testing
- Test with different email domains
- Verify SSO routing works correctly
- Confirm magic link delivery
- Test responsive design on mobile devices

## Security Features

- **CSRF Protection**: Built into Supabase authentication
- **Domain Validation**: Automatic SSO routing based on verified domains
- **Error Handling**: Secure error messages without information leakage
- **Session Management**: Proper session handling and redirects

## Performance

- **Lazy Loading**: Components load only when needed
- **Optimized Animations**: Framer Motion with reduced motion support
- **Responsive Images**: Optimized for different screen sizes
- **Bundle Size**: Minimal impact on overall bundle size

## Support

For issues or questions:
1. Check the console for development test results
2. Verify environment variables are set correctly
3. Test with different email domains
4. Check Supabase authentication configuration

## Future Enhancements

- [ ] WebAuthn/Passkey implementation
- [ ] Additional SSO providers
- [ ] Custom branding options
- [ ] Advanced user management
- [ ] Multi-factor authentication
