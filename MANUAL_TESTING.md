# ProofOfFit Manual Testing Guide

This guide provides step-by-step instructions for manually testing the ProofOfFit.com application functionality.

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp apps/web/env.example apps/web/.env.local
# Edit .env.local with your Supabase and Stripe keys

# Start development server
npm run dev
```

### 2. Database Setup
Follow the instructions in `infra/supabase/README.md` to:
- Create a Supabase project
- Run the SQL migrations
- Set up RLS policies

## 🧪 Manual Test Scenarios

### Test 1: Landing Page
**URL**: `http://localhost:3000`

**Expected Results**:
- ✅ Hero section displays "AI-Powered Hiring"
- ✅ Navigation menu shows Features, How It Works, Pricing
- ✅ "Get Started" button links to signup
- ✅ "Sign In" button links to signin
- ✅ Responsive design works on mobile

**Test Steps**:
1. Open `http://localhost:3000`
2. Verify hero section content
3. Click "Features" - should scroll to features section
4. Click "How It Works" - should show 3-step process
5. Click "Pricing" - should show pricing tiers
6. Test mobile responsiveness (resize browser)

### Test 2: Authentication Flow
**URL**: `http://localhost:3000/auth/signup`

**Expected Results**:
- ✅ Sign-up form displays correctly
- ✅ Role selection works (Job Seeker/Employer)
- ✅ Form validation shows errors for empty fields
- ✅ Email input accepts valid email format

**Test Steps**:
1. Go to `/auth/signup`
2. Try submitting empty form - should show validation errors
3. Enter invalid email - should show error
4. Enter valid email: `test@example.com`
5. Select "Job Seeker" role
6. Click "Create Account" - should show loading state
7. Repeat with "Employer" role

### Test 3: Candidate Dashboard
**URL**: `http://localhost:3000/candidate/profile`

**Expected Results**:
- ✅ Profile overview section displays
- ✅ Evidence bullets section shows
- ✅ Credentials section available
- ✅ Contact preferences section visible
- ✅ Navigation sidebar works

**Test Steps**:
1. Sign up as a candidate (or mock authentication)
2. Go to `/candidate/profile`
3. Verify all sections display
4. Click "Add Bullet" - should open form
5. Click "Add Credential" - should open form
6. Test sidebar navigation:
   - Click "Profile" - should stay on profile
   - Click "Job Matches" - should go to matches
   - Click "Applications" - should go to applications

### Test 4: Job Matching
**URL**: `http://localhost:3000/candidate/matches`

**Expected Results**:
- ✅ Job match cards display with fit scores
- ✅ "Why This Match" explanations show
- ✅ Strengths and gaps are highlighted
- ✅ "Apply Now" buttons are functional

**Test Steps**:
1. Go to `/candidate/matches`
2. Verify job cards show fit scores (e.g., "94%")
3. Check "Why This Match" section has explanations
4. Verify "Strengths" and "Areas to Highlight" sections
5. Click "Apply Now" - should navigate to application flow
6. Click "Save Job" - should show confirmation
7. Click "View Details" - should show job details

### Test 5: Application Tracking
**URL**: `http://localhost:3000/candidate/applications`

**Expected Results**:
- ✅ Application cards show status badges
- ✅ Job information displays correctly
- ✅ Document attachments are listed
- ✅ Status tracking works

**Test Steps**:
1. Go to `/candidate/applications`
2. Verify application cards show:
   - Job title and company
   - Application date
   - Status badge (Submitted, Interview, etc.)
3. Check document attachments:
   - Tailored Resume
   - Cover Letter
4. Click "View Details" - should show full application
5. Click "View Job" - should show job posting

### Test 6: Employer Job Intake
**URL**: `http://localhost:3000/employer/intake`

**Expected Results**:
- ✅ Job details form displays
- ✅ Requirements section works
- ✅ Constraints section available
- ✅ Form validation functions

**Test Steps**:
1. Sign up as an employer (or mock authentication)
2. Go to `/employer/intake`
3. Fill out job details:
   - Job Title: "Senior Frontend Developer"
   - Company: "TechCorp Inc."
   - Location: "San Francisco, CA"
   - Work Type: "Hybrid"
   - Description: "We are looking for a senior frontend developer..."
4. Add must-have requirements:
   - Click "Add" next to must-have input
   - Enter: "5+ years React experience"
5. Add preferred requirements:
   - Click "Add" next to preferred input
   - Enter: "Healthcare domain experience"
6. Set constraints:
   - Work Authorization: "Any"
   - Security Clearance: "None"
7. Click "Create Job Intake" - should show loading state

### Test 7: Candidate Slates
**URL**: `http://localhost:3000/employer/slates`

**Expected Results**:
- ✅ Slate cards display with candidate information
- ✅ Fit scores and explanations show
- ✅ Action buttons are functional
- ✅ Audit trail links work

**Test Steps**:
1. Go to `/employer/slates`
2. Verify slate cards show:
   - Job title and company
   - Number of candidates
   - Creation date
3. Check candidate information:
   - Names and emails
   - Fit scores (e.g., "94%")
   - Explanations for matches
4. Test action buttons:
   - "View Full Slate" - should show detailed view
   - "Download Report" - should download PDF
   - "Audit Trail" - should open audit URL
   - "Schedule Interviews" - should open scheduling

### Test 8: Policy Engine
**Test the policy engine functionality**

**Expected Results**:
- ✅ Job source validation works
- ✅ Policy decisions are correct
- ✅ Compliance checking functions

**Test Steps**:
1. Test with different job sources:
   - `usajobs.gov` - should allow auto-apply
   - `linkedin.com` - should require prep-confirm
   - `unknown-domain.com` - should deny
2. Test job compliance:
   - Submit job with missing title - should fail
   - Submit job with short description - should fail
   - Submit compliant job - should pass
3. Check policy badges display correctly

### Test 9: Document Tailoring
**Test the tailor engine functionality**

**Expected Results**:
- ✅ Resume generation works
- ✅ Cover letter creation functions
- ✅ Email templates generate
- ✅ Citations are included

**Test Steps**:
1. Generate tailored resume:
   - Use candidate profile with evidence bullets
   - Match against specific job requirements
   - Verify content is job-specific
2. Generate cover letter:
   - Check professional tone
   - Verify job-specific content
   - Confirm structure is correct
3. Generate email template:
   - Check subject line includes job title
   - Verify highlights section
   - Confirm contact information placeholders

### Test 10: Stripe Integration
**Test the billing system**

**Expected Results**:
- ✅ Subscription plans display correctly
- ✅ Checkout flow works
- ✅ Usage tracking functions
- ✅ Feature access control works

**Test Steps**:
1. Test subscription plans:
   - Free plan shows 10 application limit
   - Pro plan shows unlimited applications
   - Team plan shows 5 team members
2. Test checkout flow:
   - Click "Upgrade Plan" on Free plan
   - Should redirect to Stripe checkout
   - Complete test payment
3. Test usage tracking:
   - Check application count updates
   - Verify limit enforcement
   - Test upgrade prompts

## 🔍 Error Testing

### Test Error Handling
1. **Network Errors**:
   - Disconnect internet and try to submit forms
   - Should show appropriate error messages

2. **Validation Errors**:
   - Submit forms with invalid data
   - Should show field-specific error messages

3. **Authentication Errors**:
   - Try to access protected routes without auth
   - Should redirect to sign-in page

4. **Database Errors**:
   - Try to create duplicate records
   - Should show appropriate error handling

## 📱 Responsive Testing

### Test Mobile Responsiveness
1. **iPhone (375px width)**:
   - Navigation should collapse to hamburger menu
   - Forms should be single-column
   - Cards should stack vertically

2. **iPad (768px width)**:
   - Navigation should show full menu
   - Forms should use two-column layout
   - Cards should display in grid

3. **Desktop (1200px+ width)**:
   - Full navigation should be visible
   - Forms should use optimal layout
   - Cards should display in grid with proper spacing

## 🎯 Performance Testing

### Test Loading Performance
1. **Initial Page Load**:
   - Landing page should load in < 2 seconds
   - Dashboard pages should load in < 3 seconds

2. **Navigation**:
   - Page transitions should be smooth
   - No loading delays between pages

3. **Form Submissions**:
   - Form submissions should show loading states
   - Success/error feedback should be immediate

## 🐛 Bug Reporting

When testing, document any issues found:

1. **Bug Description**: What happened vs. what was expected
2. **Steps to Reproduce**: Exact steps that caused the issue
3. **Browser/Device**: What browser and device were used
4. **Screenshots**: Visual evidence of the issue
5. **Console Errors**: Any JavaScript errors in browser console

## ✅ Test Checklist

- [ ] Landing page loads and displays correctly
- [ ] Authentication flow works for both roles
- [ ] Candidate dashboard displays all sections
- [ ] Job matching shows relevant results
- [ ] Application tracking works
- [ ] Employer intake form functions
- [ ] Candidate slates display properly
- [ ] Policy engine makes correct decisions
- [ ] Document tailoring generates content
- [ ] Stripe integration handles payments
- [ ] Mobile responsiveness works
- [ ] Error handling is appropriate
- [ ] Performance is acceptable

## 🚀 Next Steps After Testing

1. **Fix any bugs found** during testing
2. **Optimize performance** if needed
3. **Update documentation** based on findings
4. **Deploy to staging** environment
5. **Run automated tests** to verify fixes
6. **Deploy to production** when ready

---

For automated testing, see [TESTING.md](TESTING.md) for unit and E2E test instructions.