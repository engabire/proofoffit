# 📚 ProofOfFit API Documentation

**Version:** 2.0  
**Last Updated:** October 23, 2024  
**Base URL:** `https://www.proofoffit.com/api`

## 🎯 Overview

The ProofOfFit API provides comprehensive endpoints for job matching, user management, analytics, and system monitoring. All endpoints are RESTful and return JSON responses.

## 🔐 Authentication

### Authentication Methods

1. **Supabase Auth** (Primary)
   - JWT tokens via Authorization header
   - Session-based authentication
   - Magic link authentication

2. **API Keys** (For integrations)
   - Header: `X-API-Key: your-api-key`
   - Used for third-party integrations

### Authentication Headers

```http
Authorization: Bearer <jwt-token>
X-API-Key: <api-key>
Content-Type: application/json
```

## 📊 Core Endpoints

### User Management

#### `GET /api/users/profile`
Get current user profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "candidate",
    "profile": {
      "experience": "5 years",
      "location": "San Francisco, CA",
      "skills": ["React", "TypeScript", "Node.js"]
    }
  }
}
```

#### `PUT /api/users/profile`
Update user profile information.

**Request Body:**
```json
{
  "name": "John Doe",
  "experience": "6 years",
  "location": "San Francisco, CA",
  "skills": ["React", "TypeScript", "Node.js", "Python"]
}
```

### Job Management

#### `GET /api/jobs/search`
Search for jobs with advanced filtering.

**Query Parameters:**
- `q` - Search query
- `location` - Job location
- `remote` - Remote work preference (true/false)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job-123",
        "title": "Senior Frontend Developer",
        "company": "TechCorp",
        "location": "San Francisco, CA",
        "remote": true,
        "description": "We're looking for...",
        "requirements": ["React", "TypeScript"],
        "salary": {
          "min": 120000,
          "max": 160000,
          "currency": "USD"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### `GET /api/jobs/advanced-match`
Get advanced job matching with AI-powered recommendations.

**Query Parameters:**
- `userId` - User ID for matching
- `jobId` - Specific job ID (optional)
- `limit` - Number of matches (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "job": {
          "id": "job-123",
          "title": "Senior Frontend Developer",
          "company": "TechCorp"
        },
        "fitScore": 87,
        "explanation": {
          "strengths": ["Strong React experience", "TypeScript proficiency"],
          "gaps": ["Limited testing experience"],
          "recommendations": ["Consider learning Jest"]
        }
      }
    ]
  }
}
```

### Application Management

#### `POST /api/applications`
Submit a job application.

**Request Body:**
```json
{
  "jobId": "job-123",
  "coverLetter": "I am excited to apply...",
  "resume": "base64-encoded-resume",
  "documents": ["doc1.pdf", "doc2.pdf"]
}
```

#### `GET /api/applications`
Get user's job applications.

**Query Parameters:**
- `status` - Filter by status (submitted, under-review, etc.)
- `page` - Page number
- `limit` - Results per page

### Analytics & Monitoring

#### `GET /api/analytics/dashboard`
Get comprehensive analytics dashboard data.

**Response:**
```json
{
  "success": true,
  "data": {
    "userMetrics": {
      "totalUsers": 1500,
      "activeUsers": 1200,
      "newUsers": 150
    },
    "jobMetrics": {
      "totalJobs": 5000,
      "newJobs": 200,
      "applications": 15000
    },
    "performanceMetrics": {
      "averageMatchScore": 78.5,
      "conversionRate": 12.3
    }
  }
}
```

#### `GET /api/monitoring/health`
Get system health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "database": "healthy",
      "storage": "healthy",
      "external": "degraded"
    },
    "metrics": {
      "responseTime": 150,
      "uptime": 99.9
    }
  }
}
```

### Integrations

#### `POST /api/integrations/email/send`
Send email via integrated email service.

**Request Body:**
```json
{
  "to": "user@example.com",
  "subject": "Job Match Notification",
  "template": "job-match",
  "data": {
    "jobTitle": "Senior Developer",
    "company": "TechCorp"
  }
}
```

#### `POST /api/integrations/calendar/sync`
Sync calendar events.

**Request Body:**
```json
{
  "events": [
    {
      "title": "Interview with TechCorp",
      "start": "2024-10-25T10:00:00Z",
      "end": "2024-10-25T11:00:00Z",
      "description": "Technical interview"
    }
  ]
}
```

## 🔧 Advanced Features

### AI-Powered Matching

#### `POST /api/ai/analyze`
Analyze job description and candidate profile for matching.

**Request Body:**
```json
{
  "jobDescription": "We're looking for a senior developer...",
  "candidateProfile": {
    "experience": "5 years",
    "skills": ["React", "TypeScript"],
    "education": "Computer Science"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "matchScore": 85,
    "analysis": {
      "skillMatch": 90,
      "experienceMatch": 80,
      "educationMatch": 85
    },
    "recommendations": [
      "Strong technical skills match",
      "Consider highlighting leadership experience"
    ]
  }
}
```

### Performance Monitoring

#### `GET /api/performance/metrics`
Get detailed performance metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "coreWebVitals": {
      "lcp": 1.2,
      "fid": 50,
      "cls": 0.05
    },
    "bundleSize": {
      "total": 245000,
      "gzipped": 65000
    },
    "apiMetrics": {
      "averageResponseTime": 120,
      "errorRate": 0.5
    }
  }
}
```

## 📈 Webhooks

### Job Feed Webhooks

#### `POST /webhooks/job-feed`
Receive job updates from external sources.

**Headers:**
```http
X-Webhook-Signature: <signature>
X-Webhook-Source: <source>
```

**Request Body:**
```json
{
  "event": "job.created",
  "data": {
    "job": {
      "id": "external-job-123",
      "title": "Software Engineer",
      "company": "StartupXYZ",
      "source": "linkedin"
    }
  }
}
```

### Stripe Webhooks

#### `POST /webhooks/stripe`
Handle Stripe payment events.

**Headers:**
```http
Stripe-Signature: <signature>
```

## 🚨 Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

## 🔒 Rate Limiting

### Rate Limits

- **Authenticated Users:** 1000 requests/hour
- **API Keys:** 5000 requests/hour
- **Webhooks:** 100 requests/hour

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 📝 SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @proofoffit/api-client
```

```typescript
import { ProofOfFitAPI } from '@proofoffit/api-client';

const api = new ProofOfFitAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://www.proofoffit.com/api'
});

// Search for jobs
const jobs = await api.jobs.search({
  q: 'frontend developer',
  location: 'San Francisco'
});
```

### Python

```bash
pip install proofoffit-api
```

```python
from proofoffit import ProofOfFitAPI

api = ProofOfFitAPI(api_key='your-api-key')

# Get job matches
matches = api.jobs.advanced_match(user_id='user-123')
```

## 🧪 Testing

### Test Environment

- **Base URL:** `https://staging.proofoffit.com/api`
- **Test API Key:** Available in dashboard

### Postman Collection

Download our Postman collection for easy API testing:
[ProofOfFit API Collection](https://www.proofoffit.com/api/postman-collection.json)

## 📞 Support

### API Support

- **Documentation:** [https://docs.proofoffit.com](https://docs.proofoffit.com)
- **Support Email:** api-support@proofoffit.com
- **Status Page:** [https://status.proofoffit.com](https://status.proofoffit.com)

### Community

- **GitHub:** [https://github.com/proofoffit/api](https://github.com/proofoffit/api)
- **Discord:** [https://discord.gg/proofoffit](https://discord.gg/proofoffit)

## 🔄 Changelog

### Version 2.0 (October 23, 2024)
- Added advanced AI matching endpoints
- Enhanced analytics and monitoring
- Improved error handling and validation
- Added webhook support for integrations

### Version 1.5 (September 15, 2024)
- Added performance monitoring endpoints
- Enhanced job search capabilities
- Improved authentication system

### Version 1.0 (August 1, 2024)
- Initial API release
- Basic job search and user management
- Authentication and authorization