# 🚀 ProofOfFit Platform - Quick Start Guide

## 📋 **Prerequisites**

- Node.js 18+ 
- npm or yarn
- Git
- Code editor (VS Code recommended)

---

## ⚡ **Quick Setup (5 minutes)**

### **1. Clone and Install**
```bash
git clone https://github.com/your-username/proofoffit.git
cd proofoffit
npm install
```

### **2. Start Development Server**
```bash
cd apps/web
npm run dev
```

### **3. Open in Browser**
Navigate to: `http://localhost:3000`

---

## 🎯 **What You'll See**

### **Available Pages**
- **`/applications`** - Application tracking dashboard
- **`/notifications`** - Real-time notification center  
- **`/jobs`** - Job search and AI recommendations
- **`/profile`** - User profile management
- **`/assessment`** - Skill assessment interface
- **`/admin/audit-logs`** - Admin audit dashboard
- **`/admin/consent-ledger`** - Admin consent dashboard

### **API Endpoints**
- **`/api/applications`** - Application management
- **`/api/notifications`** - Notification system
- **`/api/jobs/*`** - Job search and recommendations
- **`/api/profile`** - Profile management
- **`/api/assessment/*`** - Skill assessments
- **`/api/admin/*`** - Admin functions

---

## 🧪 **Test the APIs**

### **Test Applications API**
```bash
curl "http://localhost:3000/api/applications" | jq
```

### **Test Notifications API**
```bash
curl "http://localhost:3000/api/notifications?includeStats=true" | jq
```

### **Test Job Recommendations**
```bash
curl -X POST "http://localhost:3000/api/jobs/recommendations" \
  -H "Content-Type: application/json" \
  -d '{"criteria": {"skills": ["JavaScript"], "experience": 3}}' | jq
```

---

## 🏗️ **Project Structure**

```
proofoffit/
├── apps/
│   └── web/                    # Next.js application
│       ├── app/               # App router pages
│       │   ├── applications/  # Application tracking
│       │   ├── notifications/ # Notification center
│       │   ├── jobs/          # Job search
│       │   ├── profile/       # User profiles
│       │   ├── assessment/    # Skill assessments
│       │   └── admin/         # Admin dashboards
│       ├── src/
│       │   ├── lib/           # Core business logic
│       │   │   ├── applications/  # Application tracking
│       │   │   ├── notifications/ # Notification system
│       │   │   ├── jobs/          # Job matching
│       │   │   ├── profile/       # Profile management
│       │   │   ├── assessment/    # Skill assessment
│       │   │   └── audit/         # Audit logging
│       │   └── components/    # React components
│       └── api/               # API routes
├── packages/
│   └── ui/                    # Shared UI components
└── docs/                      # Documentation
```

---

## 🔧 **Development Commands**

### **Start Development**
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting
npm run type-check   # TypeScript type checking
```

### **Testing**
```bash
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

---

## 🎨 **Key Features to Explore**

### **1. Application Tracking**
- Create and manage job applications
- Track application status and history
- Add documents and notes
- Schedule interviews
- View analytics and statistics

### **2. Job Matching**
- Search for jobs with advanced filters
- Get AI-powered job recommendations
- View fit scores and match reasons
- Save and apply to jobs

### **3. Notifications**
- Real-time job match notifications
- Application status updates
- Interview reminders
- Skill assessment results
- Priority-based notification system

### **4. User Profiles**
- Complete profile management
- Skill assessment and validation
- Career insights and analytics
- Market position analysis

### **5. Admin Features**
- Audit log management
- Consent ledger tracking
- System analytics
- User management

---

## 🔍 **Code Examples**

### **Create an Application**
```typescript
const response = await fetch('/api/applications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    job: {
      id: 'job-1',
      title: 'Senior Developer',
      company: 'TechCorp'
    },
    source: 'direct'
  })
});
```

### **Get Job Recommendations**
```typescript
const response = await fetch('/api/jobs/recommendations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    criteria: {
      skills: ['JavaScript', 'React'],
      experience: 3,
      preferences: {
        salaryRange: [80000, 150000],
        remote: true
      }
    }
  })
});
```

### **Update Notification Preferences**
```typescript
const response = await fetch('/api/notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'update-preferences',
    preferences: {
      email: true,
      push: true,
      types: {
        jobMatch: true,
        applicationUpdate: true
      }
    }
  })
});
```

---

## 🚀 **Deployment**

### **Quick Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### **Using the Deployment Script**
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

---

## 📚 **Documentation**

- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- **[Deployment Guide](PROOFOFFIT_DEPLOYMENT_READY_SUMMARY.md)** - Production deployment
- **[Architecture Overview](proof_of_fit_system_architecture_v_0.md)** - System design

---

## 🆘 **Troubleshooting**

### **Common Issues**

**Port already in use:**
```bash
# Kill existing processes
pkill -f "next dev"
# Or use different port
npm run dev -- -p 3001
```

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**API not responding:**
```bash
# Check if server is running
curl http://localhost:3000/api/applications
# Check server logs in terminal
```

### **Getting Help**
- Check the [API Documentation](API_DOCUMENTATION.md)
- Review the [Deployment Guide](PROOFOFFIT_DEPLOYMENT_READY_SUMMARY.md)
- Open an issue on GitHub
- Contact: support@proofoffit.com

---

## 🎉 **You're Ready!**

The ProofOfFit platform is now running locally and ready for development. Explore the features, test the APIs, and start building amazing job matching experiences!

**Happy coding!** 🚀

---

*Last Updated: October 19, 2024*
*Status: Ready for Development ✅*
