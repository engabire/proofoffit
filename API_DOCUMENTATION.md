# 📚 ProofOfFit Platform - API Documentation

## 🚀 **Overview**

The ProofOfFit platform provides a comprehensive REST API for job matching, application tracking, user management, and real-time notifications. All endpoints are secured with authentication and rate limiting.

**Base URL**: `https://your-domain.com/api`

---

## 🔐 **Authentication**

All API endpoints require authentication via Supabase JWT tokens:

```bash
Authorization: Bearer <your-jwt-token>
```

---

## 📊 **Application Tracking API**

### **Get Applications**
```http
GET /api/applications
```

**Query Parameters:**
- `userId` (string): User ID to filter applications
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of applications per page (default: 20)
- `status` (string): Filter by application status (comma-separated)
- `source` (string): Filter by application source (comma-separated)
- `company` (string): Filter by company name (comma-separated)
- `jobTitle` (string): Filter by job title (comma-separated)
- `hasInterview` (boolean): Filter applications with/without interviews
- `hasOffer` (boolean): Filter applications with/without offers

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "app-1",
        "userId": "user-123",
        "job": {
          "id": "job-1",
          "title": "Senior Software Engineer",
          "company": "TechCorp",
          "location": "San Francisco, CA",
          "remote": true,
          "salaryMin": 120000,
          "salaryMax": 180000
        },
        "status": {
          "status": "under-review",
          "timestamp": "2024-10-19T10:00:00Z",
          "updatedBy": "employer",
          "notes": "Application is being reviewed"
        },
        "appliedAt": "2024-10-16T10:00:00Z",
        "source": "direct",
        "lastActivityAt": "2024-10-19T10:00:00Z",
        "interviewCount": 0,
        "responseTime": 24
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 2,
      "totalPages": 1
    },
    "stats": {
      "totalApplications": 2,
      "interviewRate": 50,
      "offerRate": 0,
      "averageResponseTime": 36
    }
  }
}
```

### **Create Application**
```http
POST /api/applications
```

**Request Body:**
```json
{
  "job": {
    "id": "job-1",
    "title": "Senior Software Engineer",
    "company": "TechCorp",
    "location": "San Francisco, CA"
  },
  "source": "direct",
  "customData": {
    "expectedSalary": 150000,
    "customMessage": "I'm excited about this opportunity"
  }
}
```

### **Get Application by ID**
```http
GET /api/applications/{id}
```

### **Update Application**
```http
PUT /api/applications/{id}
```

**Request Body:**
```json
{
  "action": "update-status",
  "status": "interview-scheduled",
  "notes": "Phone interview scheduled for next week",
  "updatedBy": "employer"
}
```

**Available Actions:**
- `update-status`: Update application status
- `add-document`: Add a document to the application
- `add-note`: Add a note to the application
- `schedule-interview`: Schedule an interview

### **Delete Application**
```http
DELETE /api/applications/{id}
```

---

## 🔔 **Notification API**

### **Get Notifications**
```http
GET /api/notifications
```

**Query Parameters:**
- `userId` (string): User ID to filter notifications
- `limit` (number): Number of notifications to return (default: 50)
- `unreadOnly` (boolean): Return only unread notifications
- `includeStats` (boolean): Include notification statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif-1",
        "userId": "user-123",
        "type": {
          "type": "job-match",
          "priority": "high",
          "category": "job"
        },
        "data": {
          "title": "Perfect Job Match Found!",
          "message": "Senior Software Engineer at TechCorp - 95% fit score",
          "actionUrl": "/jobs/job-1",
          "actionText": "View Job"
        },
        "read": false,
        "createdAt": "2024-10-19T10:00:00Z"
      }
    ],
    "stats": {
      "total": 5,
      "unread": 3,
      "byType": {
        "job-match": 2,
        "application-update": 1,
        "interview-reminder": 1
      },
      "recentActivity": 4
    }
  }
}
```

### **Notification Actions**
```http
POST /api/notifications
```

**Request Body:**
```json
{
  "action": "mark-read",
  "notificationId": "notif-1"
}
```

**Available Actions:**
- `mark-read`: Mark a notification as read
- `mark-all-read`: Mark all notifications as read
- `delete`: Delete a notification
- `click`: Record notification click
- `update-preferences`: Update notification preferences

---

## 💼 **Job Search & Recommendations API**

### **Search Jobs**
```http
GET /api/jobs/search
```

**Query Parameters:**
- `query` (string): Search query
- `location` (string): Job location
- `remote` (boolean): Remote work filter
- `salaryMin` (number): Minimum salary
- `salaryMax` (number): Maximum salary
- `experience` (string): Experience level
- `industry` (string): Industry filter
- `jobType` (string): Job type filter

### **Get Job Recommendations**
```http
POST /api/jobs/recommendations
```

**Request Body:**
```json
{
  "criteria": {
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": 3,
    "location": "San Francisco, CA",
    "preferences": {
      "salaryRange": [80000, 150000],
      "jobTypes": ["Full-time"],
      "industries": ["Technology"],
      "remote": true
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "job": {
          "id": "job-1",
          "title": "Senior Software Engineer",
          "company": "TechCorp"
        },
        "fitScore": 0.95,
        "confidence": 0.9,
        "type": "perfect_match",
        "reasons": [
          "Strong skill alignment",
          "Experience level matches",
          "Salary expectations align"
        ],
        "improvements": [
          "Consider adding TypeScript to your skills"
        ]
      }
    ],
    "insights": {
      "marketTrends": "High demand for React developers",
      "topSkills": ["JavaScript", "React", "Node.js"],
      "averageSalary": 125000
    }
  }
}
```

---

## 👤 **User Profile API**

### **Get User Profile**
```http
GET /api/profile
```

### **Update User Profile**
```http
PUT /api/profile
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "experience": 5,
  "skills": ["JavaScript", "React", "Node.js"],
  "education": ["Bachelor's Degree"],
  "location": "San Francisco, CA",
  "preferences": {
    "salaryRange": [100000, 180000],
    "jobTypes": ["Full-time"],
    "industries": ["Technology"],
    "remote": true
  }
}
```

---

## 🧠 **Skill Assessment API**

### **Start Assessment**
```http
POST /api/assessment/skills
```

**Request Body:**
```json
{
  "action": "start",
  "skill": "JavaScript",
  "type": "quiz"
}
```

### **Submit Assessment Answer**
```http
POST /api/assessment/skills
```

**Request Body:**
```json
{
  "action": "submit-answer",
  "assessmentId": "assess-1",
  "questionId": "q1",
  "answer": "const",
  "timeSpent": 30
}
```

### **Get Assessment Result**
```http
POST /api/assessment/skills
```

**Request Body:**
```json
{
  "action": "get-result",
  "assessmentId": "assess-1"
}
```

---

## 🔍 **Admin API**

### **Get Audit Logs**
```http
GET /api/admin/audit-logs
```

**Query Parameters:**
- `userId` (string): Filter by user ID
- `action` (string): Filter by action type
- `resource` (string): Filter by resource
- `startDate` (string): Start date filter
- `endDate` (string): End date filter
- `limit` (number): Number of logs to return

### **Get Audit Log Statistics**
```http
GET /api/admin/audit-logs/stats
```

### **Verify Hash Chain**
```http
POST /api/admin/audit-logs/verify
```

### **Get Consent Ledger**
```http
GET /api/admin/consent-ledger
```

**Query Parameters:**
- `userId` (string): Filter by user ID
- `packageId` (string): Filter by package ID
- `action` (string): Filter by action type
- `startDate` (string): Start date filter
- `endDate` (string): End date filter
- `limit` (number): Number of entries to return

### **Get Consent Ledger Statistics**
```http
GET /api/admin/consent-ledger/stats
```

---

## 📊 **Response Format**

All API responses follow a consistent format:

### **Success Response**
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}
```

### **Error Response**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    // Additional error details
  }
}
```

---

## 🚦 **Rate Limiting**

API endpoints are protected with rate limiting:

- **API Routes**: 100 requests per minute
- **Auth Routes**: 10 requests per minute
- **Upload Routes**: 5 requests per minute
- **Admin Routes**: 20 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## 🔒 **Security**

### **Authentication**
- JWT tokens required for all endpoints
- Token expiration: 24 hours
- Refresh token support

### **Rate Limiting**
- Sliding window algorithm
- IP-based and user-based limits
- Automatic blocking for abuse

### **Audit Logging**
- All API requests logged
- Immutable hash-chained logs
- Integrity verification

### **CORS**
- Configured for production domains
- Preflight request support
- Credential handling

---

## 📝 **Error Codes**

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

---

## 🧪 **Testing**

### **Test Endpoints**
```bash
# Test applications API
curl -X GET "http://localhost:3000/api/applications" \
  -H "Authorization: Bearer <token>"

# Test notifications API
curl -X GET "http://localhost:3000/api/notifications?includeStats=true" \
  -H "Authorization: Bearer <token>"

# Test job recommendations
curl -X POST "http://localhost:3000/api/jobs/recommendations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"criteria": {"skills": ["JavaScript"], "experience": 3}}'
```

---

## 📚 **SDK Examples**

### **JavaScript/TypeScript**
```typescript
import { ProofOfFitAPI } from '@proofoffit/sdk';

const api = new ProofOfFitAPI({
  baseURL: 'https://api.proofoffit.com',
  token: 'your-jwt-token'
});

// Get applications
const applications = await api.applications.getAll({
  page: 1,
  limit: 20
});

// Get job recommendations
const recommendations = await api.jobs.getRecommendations({
  criteria: {
    skills: ['JavaScript', 'React'],
    experience: 3
  }
});
```

### **Python**
```python
import requests

class ProofOfFitAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def get_applications(self, page=1, limit=20):
        response = requests.get(
            f'{self.base_url}/api/applications',
            headers=self.headers,
            params={'page': page, 'limit': limit}
        )
        return response.json()

# Usage
api = ProofOfFitAPI('https://api.proofoffit.com', 'your-jwt-token')
applications = api.get_applications()
```

---

## 🔄 **Webhooks**

### **Application Status Updates**
```json
{
  "event": "application.status.updated",
  "data": {
    "applicationId": "app-1",
    "userId": "user-123",
    "oldStatus": "submitted",
    "newStatus": "interview-scheduled",
    "timestamp": "2024-10-19T10:00:00Z"
  }
}
```

### **Job Match Notifications**
```json
{
  "event": "job.match.created",
  "data": {
    "userId": "user-123",
    "jobId": "job-1",
    "fitScore": 0.95,
    "matchType": "perfect",
    "timestamp": "2024-10-19T10:00:00Z"
  }
}
```

---

## 📞 **Support**

For API support and questions:
- **Documentation**: This file and inline code comments
- **Issues**: GitHub Issues for bug reports
- **Email**: api-support@proofoffit.com
- **Status Page**: https://status.proofoffit.com

---

*Last Updated: October 19, 2024*
*API Version: v1.0*
*Status: Production Ready ✅*
