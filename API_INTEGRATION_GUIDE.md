# Agile Cockpit API Integration Guide

This guide provides comprehensive documentation for integrating with the Agile Cockpit API system, including email notifications, data export, webhooks, and GitHub integration.

## Table of Contents

1. [Authentication](#authentication)
2. [Email Notifications API](#email-notifications-api)
3. [Data Export API](#data-export-api)
4. [Webhook System](#webhook-system)
5. [GitHub Integration](#github-integration)
6. [Charts and Analytics API](#charts-and-analytics-api)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)

## Authentication

All API endpoints require authentication. Include your API key in the request headers:

```http
Authorization: Bearer YOUR_API_KEY
```

## Email Notifications API

### Send Email

**Endpoint:** `POST /api/agile-cockpit/email`

**Request Body:**
```json
{
  "templateId": "1",
  "recipients": ["team@company.com", "manager@company.com"],
  "data": {
    "date": "2024-01-15",
    "completed_items": 8,
    "in_progress_items": 3,
    "remaining_items": 2,
    "velocity": 8.5,
    "priority_items": "Complete user authentication",
    "blockers": "Waiting for API access"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1234567890",
    "templateId": "1",
    "recipients": ["team@company.com", "manager@company.com"],
    "status": "sent",
    "sentAt": "2024-01-15T10:30:00Z",
    "messageId": "msg_1234567890"
  }
}
```

### Get Email Templates

**Endpoint:** `GET /api/agile-cockpit/email`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Daily Sprint Update",
      "subject": "Daily Sprint Update - {date}",
      "content": "Hi Team,\n\nHere's your daily sprint update...",
      "variables": ["date", "completed_items", "velocity"]
    }
  ]
}
```

## Data Export API

### Create Export Job

**Endpoint:** `POST /api/agile-cockpit/export`

**Request Body:**
```json
{
  "templateId": "1",
  "format": "csv",
  "filters": {
    "team": "engineering",
    "project": "proofoffit",
    "status": "active"
  },
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "export_1234567890",
    "templateId": "1",
    "format": "csv",
    "status": "pending",
    "progress": 0,
    "createdAt": "2024-01-15T10:30:00Z",
    "estimatedCompletion": "2024-01-15T10:35:00Z"
  }
}
```

### Check Export Status

**Endpoint:** `GET /api/agile-cockpit/export?jobId=export_1234567890`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "export_1234567890",
    "status": "completed",
    "progress": 100,
    "downloadUrl": "/api/agile-cockpit/export/download/export_1234567890",
    "completedAt": "2024-01-15T10:32:00Z",
    "fileSize": "2.3 MB",
    "recordCount": 1250
  }
}
```

### Get Export Templates

**Endpoint:** `GET /api/agile-cockpit/export`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Sprint Metrics",
      "description": "Velocity, cycle time, and WIP data",
      "supportedFormats": ["csv", "xlsx", "json"],
      "fields": [
        {
          "name": "sprint",
          "type": "string",
          "description": "Sprint identifier"
        }
      ]
    }
  ]
}
```

## Webhook System

### Available Events

The following events can trigger webhooks:

- `sprint.started` - When a new sprint begins
- `sprint.completed` - When a sprint is completed
- `sprint.overdue` - When a sprint exceeds its deadline
- `issue.created` - When a new issue is created
- `issue.resolved` - When an issue is resolved
- `issue.blocked` - When an issue becomes blocked
- `wip.exceeded` - When WIP limit is exceeded
- `velocity.alert` - When velocity drops below threshold

### Webhook Payload Example

```json
{
  "event": "sprint.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "sprint": {
      "id": "sprint_123",
      "name": "Sprint 1",
      "goal": "Complete user authentication",
      "velocity": 8.5,
      "completed": 12,
      "planned": 10
    },
    "team": {
      "id": "team_456",
      "name": "Engineering"
    }
  }
}
```

### Webhook Security

Webhooks include a signature header for verification:

```http
X-Webhook-Signature: sha256=abc123def456...
```

Verify the signature using your webhook secret:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}
```

## GitHub Integration

### Repository Data

**Endpoint:** `GET /api/agile-cockpit/github/repos`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "proofoffit",
      "fullName": "engabire/proofoffit",
      "description": "Agile project management platform",
      "language": "TypeScript",
      "stars": 12,
      "forks": 3,
      "openIssues": 5,
      "lastUpdated": "2024-01-15T10:30:00Z",
      "url": "https://github.com/engabire/proofoffit"
    }
  ]
}
```

### Issues Data

**Endpoint:** `GET /api/agile-cockpit/github/issues`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "number": 123,
      "title": "Implement advanced charts",
      "state": "open",
      "labels": ["enhancement", "frontend"],
      "assignees": ["engabire"],
      "milestone": "Sprint 1",
      "createdAt": "2024-01-15T10:30:00Z",
      "url": "https://github.com/engabire/proofoffit/issues/123"
    }
  ]
}
```

## Charts and Analytics API

### Get Chart Data

**Endpoint:** `GET /api/agile-cockpit/charts?type=velocity&period=month`

**Response:**
```json
{
  "success": true,
  "data": {
    "labels": ["Sprint 1", "Sprint 2", "Sprint 3"],
    "datasets": [
      {
        "label": "Completed",
        "data": [8, 12, 9],
        "backgroundColor": "rgba(59, 130, 246, 0.8)"
      }
    ]
  },
  "metadata": {
    "chartType": "velocity",
    "period": "month",
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

### Get Metrics

**Endpoint:** `GET /api/agile-cockpit/metrics`

**Response:**
```json
{
  "success": true,
  "data": {
    "velocity": 8.5,
    "cycleTime": 2.3,
    "wip": 8,
    "qualityScore": 94,
    "teamSatisfaction": 8.2
  }
}
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### Common Error Codes

- `INVALID_REQUEST` - Request validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `RATE_LIMITED` - Too many requests
- `INTERNAL_ERROR` - Server error

## Rate Limiting

API requests are rate limited to prevent abuse:

- **Standard endpoints:** 100 requests per minute
- **Export endpoints:** 10 requests per minute
- **Webhook endpoints:** 1000 requests per minute

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

## SDK Examples

### JavaScript/Node.js

```javascript
class AgileCockpitAPI {
  constructor(apiKey, baseUrl = 'https://api.proofoffit.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async sendEmail(templateId, recipients, data) {
    return this.request('/api/agile-cockpit/email', {
      method: 'POST',
      body: JSON.stringify({ templateId, recipients, data })
    });
  }

  async createExport(templateId, format, filters, dateRange) {
    return this.request('/api/agile-cockpit/export', {
      method: 'POST',
      body: JSON.stringify({ templateId, format, filters, dateRange })
    });
  }
}

// Usage
const api = new AgileCockpitAPI('your-api-key');
const result = await api.sendEmail('1', ['team@company.com'], {
  date: '2024-01-15',
  velocity: 8.5
});
```

### Python

```python
import requests
import json

class AgileCockpitAPI:
    def __init__(self, api_key, base_url='https://api.proofoffit.com'):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

    def request(self, endpoint, method='GET', data=None):
        url = f"{self.base_url}{endpoint}"
        response = requests.request(
            method=method,
            url=url,
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()

    def send_email(self, template_id, recipients, data):
        payload = {
            'templateId': template_id,
            'recipients': recipients,
            'data': data
        }
        return self.request('/api/agile-cockpit/email', 'POST', payload)

    def create_export(self, template_id, format, filters, date_range):
        payload = {
            'templateId': template_id,
            'format': format,
            'filters': filters,
            'dateRange': date_range
        }
        return self.request('/api/agile-cockpit/export', 'POST', payload)

# Usage
api = AgileCockpitAPI('your-api-key')
result = api.send_email('1', ['team@company.com'], {
    'date': '2024-01-15',
    'velocity': 8.5
})
```

## Support

For API support and questions:

- **Documentation:** [https://docs.proofoffit.com](https://docs.proofoffit.com)
- **Email:** api-support@proofoffit.com
- **GitHub Issues:** [https://github.com/engabire/proofoffit/issues](https://github.com/engabire/proofoffit/issues)

## Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- Email notifications
- Data export functionality
- Webhook system
- GitHub integration
- Charts and analytics API
