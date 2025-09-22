# Logging and Audit Framework

**Document ID:** SEC-LOGGING  
**Version:** 1.0  
**Effective Date:** 2024-09-21  
**Owner:** Security Team  

## 📊 Logging Strategy

This document outlines the logging and audit framework for ProofOfFit to ensure comprehensive monitoring and compliance.

## 🗄️ Audit Events Table

### Database Schema
```sql
-- Audit events table for tracking all security-relevant events
CREATE TABLE audit_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  severity VARCHAR(20) DEFAULT 'info',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_audit_events_type ON audit_events(event_type);
CREATE INDEX idx_audit_events_user_id ON audit_events(user_id);
CREATE INDEX idx_audit_events_created_at ON audit_events(created_at);
CREATE INDEX idx_audit_events_severity ON audit_events(severity);

-- RLS policy for audit events
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit events" ON audit_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Users can view own audit events" ON audit_events
  FOR SELECT USING (auth.uid() = user_id);
```

### Event Types to Track
- [ ] **Authentication Events**
  - [ ] `user_login` - User login attempts
  - [ ] `user_logout` - User logout
  - [ ] `password_change` - Password changes
  - [ ] `mfa_enabled` - MFA enabled/disabled
  - [ ] `account_locked` - Account lockouts

- [ ] **Authorization Events**
  - [ ] `role_change` - User role changes
  - [ ] `permission_granted` - Permission grants
  - [ ] `permission_revoked` - Permission revocations
  - [ ] `access_denied` - Access denied events

- [ ] **Data Access Events**
  - [ ] `data_export` - Data export requests
  - [ ] `data_delete` - Data deletion requests
  - [ ] `data_rectify` - Data rectification requests
  - [ ] `profile_view` - Profile views
  - [ ] `profile_update` - Profile updates

- [ ] **Application Events**
  - [ ] `job_application` - Job applications submitted
  - [ ] `job_search` - Job searches performed
  - [ ] `ai_score_view` - AI scoring views
  - [ ] `subscription_change` - Subscription changes

- [ ] **System Events**
  - [ ] `system_error` - System errors
  - [ ] `security_alert` - Security alerts
  - [ ] `backup_created` - Backup creation
  - [ ] `deployment` - System deployments

## 🔄 Log Retention and Storage

### Vercel Logs
- [ ] **Function Logs:** 30 days retention
- [ ] **Build Logs:** 30 days retention
- [ ] **Edge Logs:** 30 days retention
- [ ] **Analytics Logs:** 90 days retention

### Supabase Logs
- [ ] **Database Logs:** 30 days retention
- [ ] **Auth Logs:** 30 days retention
- [ ] **API Logs:** 30 days retention
- [ ] **Storage Logs:** 30 days retention

### Centralized Log Storage
- [ ] **Supabase Storage:** `/logs/` bucket
- [ ] **Weekly Exports:** CSV format
- [ ] **Monthly Archives:** Compressed archives
- [ ] **Annual Retention:** 7 years for compliance

## 📅 Automated Log Export

### Weekly Cron Job
```typescript
// Vercel Cron job for weekly log export
export default async function handler(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    // Export audit events from last week
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const { data: auditEvents } = await supabase
      .from('audit_events')
      .select('*')
      .gte('created_at', oneWeekAgo.toISOString())
      .order('created_at', { ascending: true })

    // Convert to CSV
    const csv = convertToCSV(auditEvents)
    
    // Upload to Supabase Storage
    const fileName = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    await supabase.storage
      .from('logs')
      .upload(fileName, csv, {
        contentType: 'text/csv',
        upsert: false
      })

    return new Response('Logs exported successfully', { status: 200 })
  } catch (error) {
    console.error('Log export error:', error)
    return new Response('Export failed', { status: 500 })
  }
}
```

### Log Export Schedule
- [ ] **Daily:** Real-time log streaming
- [ ] **Weekly:** CSV export to storage
- [ ] **Monthly:** Archive old logs
- [ ] **Quarterly:** Compliance review

## 🔍 Log Analysis and Monitoring

### Real-time Monitoring
- [ ] **Security Events:** Immediate alerts for security events
- [ ] **Error Rates:** Monitor application error rates
- [ ] **Performance:** Track response times and throughput
- [ ] **Access Patterns:** Monitor unusual access patterns

### Automated Alerts
- [ ] **Failed Logins:** Multiple failed login attempts
- [ ] **Privilege Escalation:** Unusual permission changes
- [ ] **Data Exports:** Large data export requests
- [ ] **System Errors:** Critical system errors

### Log Analysis Tools
- [ ] **Supabase Analytics:** Built-in log analysis
- [ ] **Custom Dashboards:** Grafana or similar
- [ ] **Alert Rules:** Automated alerting rules
- [ ] **Report Generation:** Automated compliance reports

## 📋 Compliance and Audit

### Audit Trail Requirements
- [ ] **Immutable Logs:** Logs cannot be modified
- [ ] **Timestamp Accuracy:** Accurate timestamps
- [ ] **User Attribution:** Clear user attribution
- [ ] **Event Details:** Sufficient detail for investigation

### Compliance Reporting
- [ ] **SOC 2:** Audit trail documentation
- [ ] **GDPR:** Data processing logs
- [ ] **CCPA:** Consumer request logs
- [ ] **ISO 27001:** Security event logs

### Regular Reviews
- [ ] **Weekly:** Log analysis and review
- [ ] **Monthly:** Compliance report generation
- [ ] **Quarterly:** Audit trail validation
- [ ] **Annually:** Log retention policy review

## 🛠️ Implementation Guide

### Step 1: Create Audit Events Table
```sql
-- Run this in your Supabase SQL editor
CREATE TABLE audit_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  severity VARCHAR(20) DEFAULT 'info',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Step 2: Create Logging Helper Functions
```typescript
// lib/audit.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function logAuditEvent(
  eventType: string,
  userId?: string,
  details?: any,
  severity: 'info' | 'warning' | 'error' | 'critical' = 'info'
) {
  try {
    await supabase.from('audit_events').insert({
      event_type: eventType,
      user_id: userId,
      details: details,
      severity: severity,
      created_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to log audit event:', error)
  }
}
```

### Step 3: Integrate Logging in Application
```typescript
// Example usage in API routes
import { logAuditEvent } from '@/lib/audit'

export async function POST(req: NextRequest) {
  const userId = getUserId(req)
  
  // Log the event
  await logAuditEvent('data_export', userId, {
    request_type: 'export',
    timestamp: new Date().toISOString()
  })
  
  // ... rest of your logic
}
```

## 📊 Log Storage Structure

### Supabase Storage Bucket: `logs`
```
/logs/
├── daily/
│   ├── 2024-09-21/
│   │   ├── audit-events.csv
│   │   ├── auth-events.csv
│   │   └── system-events.csv
│   └── 2024-09-22/
├── weekly/
│   ├── audit-logs-2024-09-21.csv
│   └── audit-logs-2024-09-28.csv
├── monthly/
│   ├── 2024-09-archive.zip
│   └── 2024-10-archive.zip
└── compliance/
    ├── soc2-reports/
    ├── gdpr-reports/
    └── audit-trails/
```

## 🔐 Security Considerations

### Log Protection
- [ ] **Access Controls:** Restrict log access to authorized personnel
- [ ] **Encryption:** Encrypt logs at rest and in transit
- [ ] **Integrity:** Ensure log integrity and authenticity
- [ ] **Retention:** Secure deletion of expired logs

### Privacy Protection
- [ ] **PII Redaction:** Remove or mask PII in logs
- [ ] **Data Minimization:** Log only necessary information
- [ ] **Access Logging:** Log access to audit logs
- [ ] **Regular Review:** Regular review of logged data

## 📞 Contact Information

### Log Management Team
- **Security Team:** security@proofoffit.com
- **DevOps Team:** devops@proofoffit.com
- **Compliance Team:** compliance@proofoffit.com

### Emergency Contacts
- **24/7 Security:** [Emergency Contact]
- **Log Analysis:** [Log Analysis Contact]
- **Compliance:** [Compliance Contact]

---

**Last Updated:** 2024-09-21  
**Next Review:** 2024-12-21  
**Owner:** Security Team

