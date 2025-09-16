# 🚨 Emergency Procedures & Rollback Guide

## Quick Rollback Commands

### 1. Immediate Rollback to Previous Deployment
```bash
# Get the previous deployment URL
vercel ls | head -3

# Rollback to specific deployment
vercel rollback <deployment-url>

# Or rollback to previous stable version
vercel rollback --prev
```

### 2. Emergency Domain Redirect
If the main site is down, redirect to a backup:
```bash
# Update DNS to point to backup server
# Contact your DNS provider immediately
```

### 3. Disable Auto-Deployments
```bash
# Temporarily disable GitHub Actions
# Go to GitHub Settings > Actions > Disable for this repository
```

## Health Check Commands

### Check Site Status
```bash
# Quick health check
curl -I https://www.proofoffit.com

# Detailed verification
node scripts/verify-deployment.js

# Check specific endpoints
curl -I https://www.proofoffit.com/api/health
```

### Monitor Logs
```bash
# Vercel logs
vercel logs

# Real-time monitoring
vercel logs --follow
```

## Emergency Contacts

### Technical Issues
- **Primary**: Development Team
- **Secondary**: DevOps Team
- **Emergency**: System Administrator

### Domain/DNS Issues
- **Provider**: Vercel (automatic)
- **Backup**: Contact domain registrar

### Database Issues
- **Supabase**: Check Supabase dashboard
- **Backup**: Restore from latest backup

## Common Issues & Solutions

### 1. Build Failures
**Symptoms**: Deployment shows "Error" status
**Solution**:
```bash
# Check build logs
vercel logs <deployment-url>

# Fix common issues:
# - Missing environment variables
# - TypeScript errors
# - Dependency conflicts
```

### 2. 500 Errors
**Symptoms**: Site returns 500 status
**Solution**:
```bash
# Check runtime logs
vercel logs --follow

# Common fixes:
# - Check environment variables
# - Verify database connections
# - Check API endpoints
```

### 3. Authentication Issues
**Symptoms**: Users can't sign in
**Solution**:
```bash
# Check Supabase status
# Verify auth configuration
# Test auth endpoints manually
```

### 4. Performance Issues
**Symptoms**: Slow loading times
**Solution**:
```bash
# Check Vercel analytics
# Monitor response times
# Optimize images and assets
```

## Monitoring & Alerts

### Automated Monitoring
- **Uptime**: Vercel automatically monitors uptime
- **Performance**: Built-in performance monitoring
- **Errors**: Automatic error tracking

### Manual Monitoring
```bash
# Run verification script every 5 minutes
watch -n 300 'node scripts/verify-deployment.js'

# Monitor specific metrics
curl -s https://www.proofoffit.com/api/health | jq '.uptime'
```

## Recovery Procedures

### 1. Complete Site Down
1. Check Vercel status page
2. Verify domain DNS settings
3. Check for recent deployments
4. Rollback to last known good version
5. Notify users via status page

### 2. Partial Functionality Issues
1. Check specific endpoint health
2. Review recent code changes
3. Check environment variables
4. Test in staging environment
5. Deploy hotfix if needed

### 3. Data Issues
1. Check Supabase dashboard
2. Verify database connections
3. Check for data corruption
4. Restore from backup if needed
5. Notify affected users

## Prevention Checklist

### Before Each Deployment
- [ ] Run `npm run test` locally
- [ ] Run `npm run build` locally
- [ ] Check for TypeScript errors
- [ ] Verify environment variables
- [ ] Test critical user flows

### After Each Deployment
- [ ] Run `node scripts/verify-deployment.js`
- [ ] Check health endpoint
- [ ] Test main user journeys
- [ ] Monitor error rates
- [ ] Check performance metrics

## Status Page Communication

### Template Messages

**Site Down**:
```
🚨 ProofOfFit.com is currently experiencing issues.
We're working to resolve this as quickly as possible.
Expected resolution: [timeframe]
```

**Partial Issues**:
```
⚠️ Some features of ProofOfFit.com are temporarily unavailable.
Core functionality remains operational.
We're investigating and will provide updates soon.
```

**Resolved**:
```
✅ All issues with ProofOfFit.com have been resolved.
The site is now fully operational.
Thank you for your patience.
```

## Backup Procedures

### Code Backup
- **Primary**: GitHub repository
- **Backup**: Local development machines
- **Frequency**: Every commit

### Database Backup
- **Primary**: Supabase automatic backups
- **Manual**: Export data before major changes
- **Frequency**: Daily automatic, manual before deployments

### Configuration Backup
- **Environment Variables**: Documented in secure location
- **Domain Settings**: Screenshots of DNS configuration
- **Vercel Settings**: Export project configuration

## Post-Incident Review

### Questions to Ask
1. What was the root cause?
2. How was it detected?
3. How long did it take to resolve?
4. What could have prevented it?
5. What improvements can we make?

### Documentation Updates
- Update this emergency procedures document
- Add new monitoring checks
- Improve alerting systems
- Update runbooks

---

**Last Updated**: $(date)
**Version**: 1.0
**Next Review**: Monthly
