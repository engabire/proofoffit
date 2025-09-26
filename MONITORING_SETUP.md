# 🔍 Monitoring & Dependency Management

This document outlines the comprehensive monitoring setup for Proof of Fit, including health checks, dependency monitoring, and incident response.

## 📊 Health Monitoring

### Core Health Endpoints

- **`/api/health`** - Main health check endpoint
  - Returns overall system status (healthy/degraded/unhealthy)
  - Checks database connectivity via `system_health` table
  - Checks storage service availability
  - Returns HTTP 200 for healthy/degraded, 503 for unhealthy

- **`/api/monitoring/health`** - Comprehensive monitoring endpoint
  - Detailed service-specific health checks
  - Performance metrics and response times
  - Memory usage and uptime information

### Health Status Levels

- **🟢 Healthy**: All services operational
- **🟡 Degraded**: Some services experiencing issues but core functionality available
- **🔴 Unhealthy**: Critical services down, core functionality impacted

## 🔗 Dependency Monitoring

### External Dependencies

We monitor the status of critical external services:

1. **Supabase** - Database and authentication
2. **Vercel** - Hosting and deployment platform  
3. **Stripe** - Payment processing

### Monitoring Script

The `scripts/check-dependencies.sh` script:

- Checks each service's status page
- Handles both JSON API responses and HTML status pages
- Determines overall system health
- Logs results to our monitoring endpoint
- Provides detailed status reporting

### Automated Monitoring

- **GitHub Actions Workflow**: Runs every 6 hours
- **Automatic Issue Creation**: Creates GitHub issues for critical failures
- **Status Logging**: Records all checks in `audit_events` table
- **Alert Management**: Auto-closes issues when services recover

## 🚨 Incident Response

### Degraded Service Banner

The `DegradedBanner` component:

- Automatically detects service degradation
- Shows contextual messages based on specific service issues
- Updates every 30 seconds
- Provides user-friendly status information

### Monitoring Dashboard

Access monitoring data via:

- **`/api/monitoring/dependencies`** - Recent dependency status checks
- **`/api/admin/setup-health`** - Health monitoring setup instructions
- **GitHub Actions** - Automated monitoring logs and alerts

## 🛠️ Setup Instructions

### 1. Database Setup

Create the `system_health` table in Supabase:

```sql
-- Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS system_health (
  id SERIAL PRIMARY KEY,
  service_name VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  last_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial health record
INSERT INTO system_health (service_name, status, metadata) 
VALUES ('system', 'healthy', '{"version": "1.0.0", "initialized": true}');

-- Enable RLS
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can manage system_health" ON system_health
  FOR ALL USING (auth.role() = 'service_role');
```

### 2. Environment Variables

Ensure these are set in your deployment:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. GitHub Actions Setup

The dependency monitoring workflow will:

- Run automatically every 6 hours
- Create GitHub issues for critical failures
- Auto-close issues when services recover
- Log all status checks for audit purposes

### 4. Manual Testing

Test the monitoring system:

```bash
# Run dependency check manually
./scripts/check-dependencies.sh

# Check health endpoint
curl https://your-domain.com/api/health

# View recent dependency logs
curl https://your-domain.com/api/monitoring/dependencies
```

## 📈 Monitoring Best Practices

### 1. Regular Health Checks

- Monitor core endpoints every 30 seconds
- Check external dependencies every 6 hours
- Review monitoring logs weekly

### 2. Alert Thresholds

- **Immediate**: Critical service failures
- **15 minutes**: Degraded performance
- **1 hour**: Repeated failures

### 3. Incident Response

1. **Detect**: Automated monitoring alerts
2. **Assess**: Check service status pages
3. **Communicate**: Update users via degraded banner
4. **Resolve**: Address root cause
5. **Document**: Update monitoring thresholds

### 4. Continuous Improvement

- Review monitoring effectiveness monthly
- Update dependency list as services change
- Refine alert thresholds based on historical data
- Test incident response procedures quarterly

## 🔧 Troubleshooting

### Common Issues

1. **503 Health Check Errors**
   - Check if `system_health` table exists
   - Verify Supabase connection
   - Review environment variables

2. **Dependency Check Failures**
   - Verify external service status pages
   - Check network connectivity
   - Review parsing logic for API changes

3. **Monitoring Endpoint Errors**
   - Ensure `audit_events` table exists
   - Verify service role permissions
   - Check Supabase configuration

### Debug Commands

```bash
# Check health endpoint
curl -v https://your-domain.com/api/health

# Test dependency script
./scripts/check-dependencies.sh

# View recent audit events
curl https://your-domain.com/api/monitoring/dependencies

# Check GitHub Actions logs
gh run list --workflow=dependency-monitor.yml
```

## 📚 Additional Resources

- [Supabase Status Page](https://status.supabase.com/)
- [Vercel Status Page](https://vercel-status.com/)
- [Stripe Status Page](https://status.stripe.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

*This monitoring setup ensures high availability and provides early warning for potential issues, helping maintain a reliable service for our users.*
