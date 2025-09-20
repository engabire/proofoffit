# ProofOfFit: Proofs, Targets & Audit System

This document describes the comprehensive proof-of-fit system implementation with evidence boards, audit links, and analytics.

## 🏗️ Architecture Overview

### Core Components

1. **Evidence Boards (Targets)** - Role-specific collections of proofs
2. **Audit Links** - Secure, time-limited sharing with watermarking
3. **Requirement-Fit Analysis** - JD parsing and evidence matching
4. **Claim Generation** - Evidence-backed claim composition
5. **Verification Badges** - GitHub/DOI/arXiv verification
6. **Analytics Dashboard** - Privacy-preserving usage insights

## 📊 Data Model

### Entities

- **User** - Account with plan-based quotas
- **Proof** - Evidence items (projects, metrics, repos, publications)
- **Target** - Evidence board for specific roles
- **AuditLink** - Secure sharing tokens with expiry/limits
- **AuditView** - Privacy-preserving view tracking
- **ClaimLog** - Audit trail for generated claims

### Relationships

```
User 1:N Proofs
User 1:N Targets
Target N:M Proofs (via TargetProofWeight)
Target 1:N AuditLinks
AuditLink 1:N AuditViews
User 1:N ClaimLogs
```

## 🔐 Security & Privacy

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Service role for server-side operations
- No public access to audit views

### Audit Link Security
- Cryptographically secure tokens (base64url)
- Expiry dates and view limits
- Revocation capability
- Rate limiting by IP
- Watermarking for deterrence

### Privacy Protection
- IP addresses hashed with rotating keys
- User agents hashed
- No personal data in analytics
- Correlation IDs for debugging

## 🎯 Feature Implementation

### 1. Evidence Boards (Targets)

**API Endpoints:**
- `GET /api/targets` - List user's targets
- `POST /api/targets` - Create new target
- `GET /api/targets/[id]` - Get target details
- `PATCH /api/targets/[id]` - Update target
- `DELETE /api/targets/[id]` - Soft delete target

**Features:**
- Role-specific evidence organization
- Multiple layout options (Report, OnePager, Portfolio)
- Proof weighting system
- Job description snapshot storage

### 2. Audit Links

**API Endpoints:**
- `POST /api/audit-links` - Create audit link
- `GET /api/audit-links` - List user's links
- `PATCH /api/audit-links/[id]` - Update link settings
- `DELETE /api/audit-links/[id]` - Revoke link

**Public Route:**
- `GET /a/[token]` - View audit link (public)

**Security Features:**
- Token-based access
- Expiry and view limits
- Watermarking
- Rate limiting
- View tracking

### 3. Requirement-Fit Analysis

**API Endpoint:**
- `POST /api/requirement-fit` - Analyze JD against evidence

**Features:**
- Automatic requirement extraction
- Keyword overlap scoring
- Evidence matching
- Coverage percentage calculation
- JD snapshot storage

### 4. Claim Generation

**API Endpoint:**
- `POST /api/claim-from-proof` - Generate evidence-backed claims

**Features:**
- Strict citation validation
- Context-aware generation
- Audit logging
- Output hashing for integrity

### 5. Verification System

**Supported Sources:**
- GitHub commits (signature verification)
- DOI (CrossRef API)
- arXiv (metadata extraction)

**Features:**
- Automatic URL parsing
- Verification status badges
- Metadata extraction
- Non-blocking verification

### 6. Analytics Dashboard

**Features:**
- Privacy-preserving event tracking
- Usage statistics
- Target performance metrics
- Recent activity feed

## 🎨 UI Components

### Briefing Layouts

1. **ReportLayout** - Comprehensive evidence report
2. **OnePagerLayout** - Condensed single-page view
3. **PortfolioLayout** - Visual portfolio presentation

### Print Support
- Optimized print CSS
- Page breaks
- Color adjustments
- Link handling

## 📈 Quota System

### Plan Limits

| Feature | Free | Pro | Premium |
|---------|------|-----|---------|
| Targets | 1 | 3 | 20 |
| Proofs | 20 | 100 | 500 |
| Active Links | 1 | 50 | 500 |

### Enforcement
- Server-side validation
- Real-time quota checking
- Graceful error handling
- Upgrade prompts

## 🧪 Testing

### Test Coverage
- Token generation
- Quota validation
- Citation validation
- URL verification extraction
- Security functions

### Test Files
- `token.test.ts` - Token generation tests
- `guards.test.ts` - Quota limit tests
- `claim-validator.test.ts` - Citation validation tests
- `verification.test.ts` - URL extraction tests

## 🚀 Deployment

### Environment Variables
```bash
# Feature Flags
POF_FEATURE_TARGETS=1
POF_HASH_KEY=rotate-monthly-and-keep-last

# Database
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Redis (for rate limiting)
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."

# GitHub (for verification)
GITHUB_TOKEN="..."
```

### Database Migration
```bash
npx prisma migrate dev --name "targets_audit_links_analytics"
npx prisma generate
```

### RLS Policies
```bash
# Apply RLS policies to Supabase
psql -f supabase/migrations/001_rls_policies.sql
```

## 📋 Usage Examples

### Creating an Evidence Board
```typescript
const target = await fetch('/api/targets', {
  method: 'POST',
  body: JSON.stringify({
    title: 'Senior Frontend Developer',
    role: 'Frontend Engineer',
    companyHint: 'TechCorp',
    layout: 'REPORT'
  })
});
```

### Creating an Audit Link
```typescript
const link = await fetch('/api/audit-links', {
  method: 'POST',
  body: JSON.stringify({
    targetId: 'target-uuid',
    ttlDays: 14,
    maxViews: 100,
    watermark: true
  })
});
```

### Analyzing Job Description
```typescript
const analysis = await fetch('/api/requirement-fit', {
  method: 'POST',
  body: JSON.stringify({
    targetId: 'target-uuid',
    jdText: 'We are looking for a React developer...'
  })
});
```

## 🔧 Maintenance

### Key Rotation
- Hash keys should be rotated monthly
- Update `POF_HASH_KEY` environment variable
- Existing hashes remain valid

### Monitoring
- Track audit link usage
- Monitor rate limit violations
- Watch for security events
- Analytics event volume

### Performance
- Database indexes on frequently queried columns
- Redis caching for rate limits
- Prisma connection pooling
- CDN for static assets

## 🛡️ Security Considerations

### Token Security
- Use cryptographically secure random generation
- Implement proper entropy
- Regular token rotation
- Secure storage

### Rate Limiting
- IP-based limiting for public endpoints
- User-based limiting for authenticated endpoints
- Graceful degradation
- Monitoring and alerting

### Data Privacy
- Hash all PII in analytics
- Regular data retention policies
- User data export/deletion
- GDPR compliance

## 📚 API Reference

### Authentication
All API endpoints require authentication via Supabase auth.

### Error Handling
Standard HTTP status codes with JSON error responses:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (quota exceeded)
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

### Rate Limits
- Audit views: 10/minute per IP
- AI generation: 5/minute per user
- General API: 100/minute per IP
- Auth attempts: 5/15 minutes per IP

## 🎯 Future Enhancements

### Planned Features
- Advanced AI claim generation
- Team collaboration
- Enterprise SSO
- Advanced analytics
- Mobile app
- API webhooks

### Integration Opportunities
- LinkedIn profile import
- GitHub repository analysis
- Resume parsing
- Job board integration
- ATS compatibility

---

This implementation provides a robust, secure, and scalable foundation for evidence-based hiring intelligence while maintaining strict privacy and security standards.


