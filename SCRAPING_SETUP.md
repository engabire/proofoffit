# ProofOfFit Scraping System Setup

## 🚀 **Implementation Complete**

A production-ready scraping system has been implemented with enterprise-grade security, concurrency control, and operational resilience.

## 📋 **Environment Variables Required**

Add these to your `.env.local` and Vercel environment variables:

```bash
# Scraping System
SCRAPER_BEARER_TOKEN=your-secure-random-token-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Optional: Kill switch for incidents
SCRAPER_DISABLED=0  # Set to "1" to disable scraping
```

## 🗄️ **Database Setup**

1. Run the migration:
```bash
cd apps/web
npx supabase db push
```

2. The migration creates:
   - `scraped_items` - Canonicalized content with change tracking
   - `scrape_raw` - Temporary HTML storage (auto-purged)
   - `fetch_meta` - ETag/Last-Modified caching
   - `job_lock` - Concurrency control
   - `domain_audit` - Governance tracking

## 🔧 **Features Implemented**

### 1. **Security & Access Control**
- ✅ Bearer token authentication
- ✅ Vercel cron header validation  
- ✅ Domain allowlisting (no arbitrary targets)
- ✅ Service role isolation
- ✅ Row Level Security (RLS) enabled

### 2. **Concurrency & Idempotency**
- ✅ Job locking prevents overlapping runs
- ✅ 10-minute TTL with auto-expiry
- ✅ Race condition protection
- ✅ Graceful lock stealing for expired jobs

### 3. **Robots.txt & Rate Limiting**
- ✅ Robots.txt compliance checking
- ✅ Per-domain rate limiting (1.5s + jitter)
- ✅ Concurrency limits (max 3 simultaneous)
- ✅ Polite user agent identification

### 4. **Data Correctness**
- ✅ URL canonicalization (removes tracking params)
- ✅ Content change detection via SHA-256 hashing
- ✅ Deduplication by canonical URL
- ✅ ETag/Last-Modified conditional requests

### 5. **Storage Hygiene**
- ✅ 30-day retention for raw HTML
- ✅ 60-day retention for stale items
- ✅ 90-day retention for fetch metadata
- ✅ Automated cleanup via cron

### 6. **Operational Resilience**
- ✅ Exponential backoff retries
- ✅ Timeout protection (30s per request)
- ✅ Partial progress saving
- ✅ Kill switch for incidents
- ✅ Structured logging

## 📊 **API Endpoints**

### `/api/scrape` (GET)
Runs the scraping job with full security and rate limiting.

**Headers:**
```
Authorization: Bearer your-token
x-vercel-cron: 1  # (automatic from Vercel Cron)
```

**Response:**
```json
{
  "ok": true,
  "results": [
    {
      "url": "https://quotes.toscrape.com/",
      "status": 200,
      "items": 10,
      "bytes": 15420
    }
  ],
  "summary": {
    "urls_processed": 1,
    "total_items": 10,
    "total_bytes": 15420,
    "duration_ms": 2341
  }
}
```

### `/api/cleanup` (GET) 
Runs maintenance cleanup of old data.

### `/api/revalidate` (POST)
Invalidates Next.js cache tags after updates.

## 🕐 **Cron Jobs**

Configured in `vercel.json`:

- **Scraping**: Every 6 hours (`0 */6 * * *`)
- **Cleanup**: Daily at 2 AM (`0 2 * * *`)

## 🔍 **Client Usage**

```typescript
import { scrapingClient } from '@/lib/scraping/client';

// Get latest items
const { items, total, hasMore } = await scrapingClient.getLatestItems({
  domain: 'quotes.toscrape.com',
  limit: 20,
  search: 'Einstein'
});

// Get statistics
const stats = await scrapingClient.getStats();

// Real-time updates
const unsubscribe = scrapingClient.subscribeToUpdates((payload) => {
  console.log('New scraped content:', payload);
});
```

## 🛡️ **Security Features**

### Authentication Flow:
1. Check Bearer token matches `SCRAPER_BEARER_TOKEN`
2. Verify `x-vercel-cron` header (production only)
3. Domain allowlist validation
4. Robots.txt compliance check

### Data Protection:
- Raw HTML purged after 30 days (no PII retention)
- RLS policies prevent unauthorized access
- Service role isolation for writes
- Content hashing for integrity

## 📈 **Monitoring & Alerts**

### Structured Logs:
```json
{
  "timestamp": "2024-01-27T10:30:00Z",
  "duration_ms": 2341,
  "urls_processed": 2,
  "total_items": 15,
  "total_bytes": 28950,
  "success_rate": 1.0
}
```

### Key Metrics:
- Success/failure rate
- Items scraped per run
- 304 (Not Modified) hit rate
- Average processing time
- Content change frequency

## 🎯 **Governance & Ethics**

### Domain Audit Trail:
Each domain in the allowlist has:
- Permission basis (robots.txt, API terms, etc.)
- Contact information
- Review schedule
- Approval history

### PII Minimization:
- No emails, phones, or addresses stored
- Raw HTML purged automatically
- Only structured data retained
- Audit trail for all collection

## 🚨 **Incident Response**

### Kill Switch:
Set `SCRAPER_DISABLED=1` to immediately stop all scraping.

### Lock Issues:
Locks auto-expire after 10 minutes. Manual release:
```sql
DELETE FROM job_lock WHERE name = 'scrape';
```

### Rate Limiting Issues:
Increase delays in environment:
```bash
PER_DOMAIN_DELAY_MS=3000  # 3 seconds instead of 1.5
```

## 📚 **Example Data Flow**

1. **Cron Trigger** → `/api/scrape` with Bearer token
2. **Security Check** → Token + domain allowlist validation  
3. **Job Lock** → Acquire 10-minute exclusive lock
4. **Robots Check** → Verify scraping permission
5. **Conditional GET** → ETag/Last-Modified headers
6. **Content Parse** → Extract structured data
7. **Canonicalize** → Normalize URLs, detect changes
8. **Database Upsert** → Store with timestamps
9. **Cache Invalidate** → Refresh Next.js cache
10. **Lock Release** → Clean up on completion

The system is now production-ready with enterprise security, operational resilience, and ethical data collection practices! 🎉