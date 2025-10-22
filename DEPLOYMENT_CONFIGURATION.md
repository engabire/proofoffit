# 🚀 ProofOfFit Deployment Configuration Guide

This guide outlines the environment-specific configurations needed for production deployment of ProofOfFit.

## 📋 Pre-Deployment Checklist

### 1. Job Feed Configuration

Set these environment variables per environment before deploying:

```bash
# Production Environment
ENABLE_EXTERNAL_JOB_FEEDS=true
ENABLE_SUPABASE_JOB_SEARCH=true
JOB_FEED_TIMEOUT_MS=30000
JOB_FEED_FAILURE_THRESHOLD=3
JOB_FEED_COOLDOWN_MS=300000

# Staging Environment
ENABLE_EXTERNAL_JOB_FEEDS=true
ENABLE_SUPABASE_JOB_SEARCH=true
JOB_FEED_TIMEOUT_MS=15000
JOB_FEED_FAILURE_THRESHOLD=2
JOB_FEED_COOLDOWN_MS=180000

# Development Environment
ENABLE_EXTERNAL_JOB_FEEDS=false
ENABLE_SUPABASE_JOB_SEARCH=false
JOB_FEED_TIMEOUT_MS=5000
JOB_FEED_FAILURE_THRESHOLD=1
JOB_FEED_COOLDOWN_MS=60000
```

### 2. External Service APIs

Configure API keys for external job services:

```bash
# USAJOBS API
USAJOBS_ENABLED=true
USAJOBS_API_KEY=your_production_usajobs_api_key
USAJOBS_BASE_URL=https://data.usajobs.gov/api/search
USAJOBS_TIMEOUT_MS=10000

# Indeed API (if using)
INDEED_ENABLED=true
INDEED_API_KEY=your_production_indeed_api_key
INDEED_BASE_URL=https://api.indeed.com/ads/apisearch
INDEED_TIMEOUT_MS=10000

# LinkedIn API (if using)
LINKEDIN_ENABLED=true
LINKEDIN_API_KEY=your_production_linkedin_api_key
LINKEDIN_BASE_URL=https://api.linkedin.com/v2/jobSearch
LINKEDIN_TIMEOUT_MS=10000
```

### 3. Telemetry Integration

Configure telemetry endpoints for GTM tracking:

```bash
# Telemetry Configuration
ENABLE_TELEMETRY=true
TELEMETRY_GTM_ENDPOINT=https://your-gtm-endpoint.com/events
TELEMETRY_ANALYTICS_ENDPOINT=https://your-analytics-endpoint.com/events
TELEMETRY_MONITORING_ENDPOINT=https://your-monitoring-endpoint.com/events
TELEMETRY_API_KEY=your_telemetry_api_key
TELEMETRY_BATCH_SIZE=10
TELEMETRY_FLUSH_INTERVAL_MS=30000
```

### 4. Monitoring & Alerting

Set up monitoring webhooks:

```bash
# Monitoring Webhooks
MONITORING_WEBHOOK_URL=https://your-monitoring-service.com/webhook
SECURITY_WEBHOOK_URL=https://your-security-service.com/webhook
```

### 5. Cache Configuration

Configure Redis for production caching:

```bash
# Redis Configuration
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

## 🔧 Environment-Specific Settings

### Production Environment

```bash
NODE_ENV=production
ENABLE_EXTERNAL_JOB_FEEDS=true
ENABLE_SUPABASE_JOB_SEARCH=true
ENABLE_REAL_TIME_FEEDS=true
ENABLE_MOCK_DATA=false
ENABLE_ANALYTICS=true
ENABLE_TELEMETRY=true

# Stricter timeouts and thresholds
JOB_FEED_TIMEOUT_MS=30000
JOB_FEED_FAILURE_THRESHOLD=3
JOB_FEED_COOLDOWN_MS=300000
JOB_FEED_MAX_REQUESTS_PER_MINUTE=60
JOB_FEED_MAX_REQUESTS_PER_HOUR=1000
```

### Staging Environment

```bash
NODE_ENV=staging
ENABLE_EXTERNAL_JOB_FEEDS=true
ENABLE_SUPABASE_JOB_SEARCH=true
ENABLE_REAL_TIME_FEEDS=true
ENABLE_MOCK_DATA=false
ENABLE_ANALYTICS=true
ENABLE_TELEMETRY=true

# Moderate timeouts and thresholds
JOB_FEED_TIMEOUT_MS=15000
JOB_FEED_FAILURE_THRESHOLD=2
JOB_FEED_COOLDOWN_MS=180000
JOB_FEED_MAX_REQUESTS_PER_MINUTE=30
JOB_FEED_MAX_REQUESTS_PER_HOUR=500
```

### Development Environment

```bash
NODE_ENV=development
ENABLE_EXTERNAL_JOB_FEEDS=false
ENABLE_SUPABASE_JOB_SEARCH=false
ENABLE_REAL_TIME_FEEDS=false
ENABLE_MOCK_DATA=true
ENABLE_ANALYTICS=false
ENABLE_TELEMETRY=false

# Relaxed timeouts for development
JOB_FEED_TIMEOUT_MS=5000
JOB_FEED_FAILURE_THRESHOLD=1
JOB_FEED_COOLDOWN_MS=60000
JOB_FEED_MAX_REQUESTS_PER_MINUTE=10
JOB_FEED_MAX_REQUESTS_PER_HOUR=100
```

## 📊 Analytics Integration

### GTM Event Tracking

The `job_search_performed` event is automatically sent to your telemetry sink with the following data:

```typescript
{
  eventType: 'job_search_performed',
  userId: string,
  sessionId: string,
  searchQuery: string,
  filters: {
    location: string,
    remote: boolean,
    salaryMin: number,
    salaryMax: number,
    experience: number,
    industry: string,
    jobType: string,
    workType: string,
  },
  resultsCount: number,
  responseTime: number,
  isRealData: boolean,
  source: 'external' | 'supabase' | 'mock',
}
```

### Key Metrics to Track

1. **Real vs Mock Data Volume**
   - `isRealData: true` indicates live job feeds
   - `isRealData: false` indicates mock/sample data

2. **Search Performance**
   - `responseTime` for API performance monitoring
   - `resultsCount` for search effectiveness

3. **User Engagement**
   - Search query patterns
   - Filter usage
   - Source preferences

## 🚨 Alert Banner Configuration

### Production Deployment

Once live feeds are ready, the alert banner will automatically:

1. **Show Success State**: "Live Job Feeds Active" with green styling
2. **Hide Demo Warnings**: No more "Demo Mode" messages
3. **Display Real-time Status**: Shows actual data source information

### Banner States

```typescript
// When real data is enabled
{
  title: "Live Job Feeds Active",
  description: "You're now seeing real job postings from our partner networks. Data is updated in real-time.",
  variant: "success",
  showLearnMore: true
}

// When in demo mode
{
  title: "Demo Mode - Sample Data", 
  description: "You're currently viewing sample job postings. Enable live feeds in production to see real job opportunities.",
  variant: "info",
  showLearnMore: true
}
```

## 🔍 Validation Steps

### 1. Configuration Validation

Run the configuration validator:

```bash
npm run validate-config
```

This will check:
- Required environment variables
- API key validity
- Timeout configurations
- Feature flag consistency

### 2. Telemetry Testing

Test telemetry integration:

```bash
npm run test-telemetry
```

This will:
- Send test events to all configured endpoints
- Verify GTM integration
- Check analytics pipeline

### 3. Job Feed Testing

Test job feed functionality:

```bash
npm run test-job-feeds
```

This will:
- Test external API connections
- Validate data transformation
- Check fallback mechanisms

## 📈 Monitoring & Observability

### Key Metrics to Monitor

1. **Job Feed Health**
   - API response times
   - Error rates
   - Data freshness

2. **User Experience**
   - Search success rates
   - Result relevance
   - Page load times

3. **Business Metrics**
   - Real vs mock data usage
   - User engagement
   - Conversion rates

### Alerting Thresholds

```bash
# Performance Alerts
JOB_FEED_TIMEOUT_MS > 30000  # Alert if timeout exceeded
ERROR_RATE > 5%              # Alert if error rate too high
RESPONSE_TIME > 2000ms       # Alert if response too slow

# Business Alerts  
MOCK_DATA_USAGE > 50%        # Alert if too much mock data
SEARCH_SUCCESS_RATE < 80%    # Alert if search success low
USER_ENGAGEMENT < 60%        # Alert if engagement drops
```

## 🚀 Deployment Commands

### Vercel Deployment

```bash
# Set environment variables
vercel env add ENABLE_EXTERNAL_JOB_FEEDS production
vercel env add ENABLE_SUPABASE_JOB_SEARCH production
vercel env add JOB_FEED_TIMEOUT_MS production
vercel env add JOB_FEED_FAILURE_THRESHOLD production
vercel env add JOB_FEED_COOLDOWN_MS production

# Deploy
vercel --prod
```

### Docker Deployment

```bash
# Build with environment variables
docker build --build-arg ENABLE_EXTERNAL_JOB_FEEDS=true \
             --build-arg ENABLE_SUPABASE_JOB_SEARCH=true \
             --build-arg JOB_FEED_TIMEOUT_MS=30000 \
             -t proofoffit:latest .

# Run with environment file
docker run --env-file .env.production proofoffit:latest
```

## 📞 Support & Troubleshooting

### Common Issues

1. **Job Feeds Not Working**
   - Check API keys are valid
   - Verify network connectivity
   - Review timeout settings

2. **Telemetry Not Sending**
   - Check endpoint URLs
   - Verify API keys
   - Review batch settings

3. **Alert Banner Not Updating**
   - Check feature flags
   - Verify environment variables
   - Review component state

### Contact Information

- **Technical Issues**: dev@proofoffit.com
- **Business Questions**: business@proofoffit.com
- **Emergency Support**: +1-XXX-XXX-XXXX

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Status**: Production Ready ✅
