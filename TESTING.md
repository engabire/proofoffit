# ProofOfFit Testing Guide

This guide covers how to test the ProofOfFit.com application functionality.

## 🧪 Test Overview

The application includes comprehensive testing at multiple levels:

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: Service integration testing
- **End-to-End Tests**: Full user workflow testing
- **Manual Testing**: Interactive testing guide

## 🚀 Quick Start

### Run All Tests
```bash
# Make the test runner executable
chmod +x test-runner.js

# Run all tests
node test-runner.js
```

### Run Individual Test Suites
```bash
# Unit tests only
cd apps/web && npm test

# E2E tests only
cd apps/web && npx playwright test

# Linting only
cd apps/web && npm run lint

# Build test only
cd apps/web && npm run build
```

## 📋 Test Categories

### 1. Authentication Tests
**Location**: `apps/web/src/test/auth.test.tsx`

Tests the complete authentication flow:
- ✅ Sign-in form validation
- ✅ Sign-up form validation
- ✅ Role selection (candidate/employer)
- ✅ Magic link authentication
- ✅ Error handling

**E2E Tests**: `apps/web/src/test/e2e/auth.spec.ts`

### 2. Policy Engine Tests
**Location**: `apps/web/src/test/policy-engine.test.ts`

Tests the compliance and policy system:
- ✅ Job source policy checking
- ✅ CAPTCHA requirement detection
- ✅ Job compliance validation
- ✅ Policy source management
- ✅ Error handling

### 3. Tailor Engine Tests
**Location**: `apps/web/src/test/tailor-engine.test.ts`

Tests the document generation system:
- ✅ Resume tailoring
- ✅ Cover letter generation
- ✅ Email template creation
- ✅ Evidence-based citations
- ✅ Content structure validation

### 4. Stripe Integration Tests
**Location**: `apps/web/src/test/stripe.test.ts`

Tests the payment and subscription system:
- ✅ Checkout session creation
- ✅ Customer portal access
- ✅ Subscription management
- ✅ Feature access control
- ✅ Usage tracking

### 5. Candidate Feature Tests
**E2E Tests**: `apps/web/src/test/e2e/candidate.spec.ts`

Tests the candidate user experience:
- ✅ Profile management
- ✅ Job matching interface
- ✅ Application tracking
- ✅ Navigation and layout
- ✅ Responsive design

### 6. Employer Feature Tests
**E2E Tests**: `apps/web/src/test/e2e/employer.spec.ts`

Tests the employer user experience:
- ✅ Job intake creation
- ✅ Requirements management
- ✅ Candidate slate viewing
- ✅ Navigation and layout
- ✅ Form validation

### 7. Landing Page Tests
**E2E Tests**: `apps/web/src/test/e2e/landing.spec.ts`

Tests the marketing site:
- ✅ Hero section display
- ✅ Navigation functionality
- ✅ Features showcase
- ✅ Pricing display
- ✅ CTA button functionality
- ✅ Responsive design

## 🔧 Manual Testing Guide

### Prerequisites
1. **Environment Setup**:
   ```bash
   # Install dependencies
   npm install
   cd apps/web && npm install
   
   # Set up environment variables
   cp apps/web/env.example apps/web/.env.local
   # Edit .env.local with your Supabase and Stripe keys
   ```

2. **Database Setup**:
   ```bash
   # Run Supabase migrations
   # See infra/supabase/README.md for instructions
   ```

### Test Scenarios

#### 1. Authentication Flow
1. **Sign Up as Candidate**:
   - Go to `/auth/signup`
   - Enter email: `test-candidate@example.com`
   - Select "Job Seeker" role
   - Click "Create Account"
   - Check email for magic link
   - Click magic link to complete signup

2. **Sign Up as Employer**:
   - Go to `/auth/signup`
   - Enter email: `test-employer@example.com`
   - Select "Employer" role
   - Click "Create Account"
   - Check email for magic link
   - Click magic link to complete signup

3. **Sign In**:
   - Go to `/auth/signin`
   - Enter email: `test-candidate@example.com`
   - Click "Send Magic Link"
   - Check email and click magic link

#### 2. Candidate Features
1. **Profile Management**:
   - Go to `/candidate/profile`
   - Verify profile overview displays
   - Click "Add Bullet" to add evidence
   - Add credentials and contact preferences

2. **Job Matching**:
   - Go to `/candidate/matches`
   - Verify job match cards display
   - Check fit scores and explanations
   - Click "Apply Now" on a job

3. **Application Tracking**:
   - Go to `/candidate/applications`
   - Verify application status tracking
   - Check document attachments

#### 3. Employer Features
1. **Job Intake**:
   - Go to `/employer/intake`
   - Fill out job details form
   - Add must-have and preferred requirements
   - Set constraints and submit

2. **Candidate Slates**:
   - Go to `/employer/slates`
   - Verify slate generation
   - Check candidate explanations
   - Test slate actions (view, download, audit)

#### 4. Policy Engine
1. **Job Source Validation**:
   - Test with `usajobs.gov` (should auto-apply)
   - Test with `linkedin.com` (should prep-confirm)
   - Test with unknown domain (should deny)

2. **Compliance Checking**:
   - Submit job with missing title (should fail)
   - Submit job with short description (should fail)
   - Submit compliant job (should pass)

#### 5. Document Tailoring
1. **Resume Generation**:
   - Use tailor engine to generate resume
   - Verify evidence-based content
   - Check citations and structure

2. **Cover Letter Generation**:
   - Generate cover letter for specific job
   - Verify job-specific content
   - Check professional tone

#### 6. Stripe Integration
1. **Subscription Management**:
   - Test checkout flow for Pro plan
   - Verify webhook handling
   - Test customer portal access

2. **Feature Access Control**:
   - Test application limits on Free plan
   - Verify upgrade prompts
   - Test usage tracking

## 🐛 Troubleshooting

### Common Issues

1. **Tests Failing**:
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules apps/web/node_modules
   npm install
   cd apps/web && npm install
   ```

2. **E2E Tests Not Running**:
   ```bash
   # Install Playwright browsers
   cd apps/web && npx playwright install
   ```

3. **Database Connection Issues**:
   - Verify Supabase environment variables
   - Check database migrations are applied
   - Ensure RLS policies are set up

4. **Stripe Test Failures**:
   - Verify Stripe test keys are configured
   - Check webhook endpoint is accessible
   - Ensure test data is properly set up

### Debug Mode

Run tests with debug output:
```bash
# Unit tests with verbose output
cd apps/web && npm test -- --verbose

# E2E tests with debug mode
cd apps/web && npx playwright test --debug

# E2E tests with headed browser
cd apps/web && npx playwright test --headed
```

## 📊 Test Coverage

The test suite aims for:
- **Unit Tests**: 70%+ code coverage
- **E2E Tests**: All critical user flows
- **Integration Tests**: All service interactions
- **Manual Tests**: All user scenarios

## 🚀 Continuous Integration

Tests run automatically on:
- Pull requests
- Main branch pushes
- Scheduled nightly runs

Check GitHub Actions for CI status and test results.

## 📝 Adding New Tests

### Unit Tests
1. Create test file in `apps/web/src/test/`
2. Follow naming convention: `*.test.ts` or `*.test.tsx`
3. Use Jest and React Testing Library
4. Mock external dependencies

### E2E Tests
1. Create test file in `apps/web/src/test/e2e/`
2. Follow naming convention: `*.spec.ts`
3. Use Playwright
4. Test real user workflows

### Test Data
- Use consistent test data across tests
- Mock external services (Supabase, Stripe)
- Clean up test data after tests

## 🎯 Test Goals

The testing strategy ensures:
- ✅ **Reliability**: Consistent functionality across environments
- ✅ **Security**: Proper authentication and authorization
- ✅ **Performance**: Fast loading and responsive interactions
- ✅ **Accessibility**: Usable by all users
- ✅ **Compliance**: Meets legal and policy requirements

---

For more information, see the [Architecture Document](proof_of_fit_system_architecture_v_0.md) and [README](README.md).