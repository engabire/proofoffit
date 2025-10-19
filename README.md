# ProofOfFit - Evidence-Based Hiring Platform

## Overview

ProofOfFit is a compliance-first, criteria-driven hiring OS. It enables candidates to manage their job search with an "autopilot" while providing employers with ranked, explainable candidate slates supported by auditable evidence. The platform emphasizes weighted requirements, human-in-the-loop application processes, consent-first privacy, bias checks, and carbon-aware compute. Its core principles are Truth (evidence-based scoring), Care (human dignity, consent, accessibility), Craft (lean architecture), and Planet (environmental awareness).

The project targets Job Seekers looking for evidence-based job matching and Employers/Hiring Teams seeking transparent, explainable candidate evaluations. This Replit prototype uses Express + Vite for rapid development, while the production version is built with Next.js 15 + FastAPI.

## Production Implementation

**This Replit prototype is for rapid development and testing.**

The production implementation is at: **[github.com/engabire/proofoffit](https://github.com/engabire/proofoffit)**

For detailed architectural differences, see `ARCHITECTURE_COMPARISON.md`.

### Recent Production-Grade Enhancements (October 18, 2025)

Implemented key security and compliance features from the GitHub production version:

**Security Features:**
- **Rate Limiting**: Sliding window rate limiter (30 req/min for API, 5 req/15min for auth, 10 req/min for uploads)
- **Audit Logging**: Immutable hash-chained audit trail with cryptographic integrity verification
- **Admin API**: Endpoints for audit log viewing, statistics, and integrity verification

**Audit Actions Tracked:**
- Authentication (login, logout, signup)
- Profile operations (create, update, delete)
- Proof/evidence management (create, update, delete, link, unlink)
- Applications (create, update, withdraw)
- Subscriptions (create, cancel, update)
- Admin actions and policy violations

**Technical Implementation:**
- In-memory storage for this prototype (production uses PostgreSQL with RLS)
- SHA-256 hash chaining ensures tamper-proof audit trail
- Rate limiting prevents abuse and DoS attacks
- All critical operations are logged with user, timestamp, IP, and user agent

**API Endpoints:**
- `GET /api/admin/audit-logs` - View audit logs with filters
- `GET /api/admin/audit-logs/stats` - Get audit statistics
- `POST /api/admin/audit-logs/verify` - Verify audit log integrity

### Auto-Apply with Consent System (October 18, 2025)

Implemented a comprehensive consent-based automated job application system:

**Core Features:**
- **Application Packages**: Versioned bundles containing resume URLs and cover letter templates
- **Digital Consent**: Canvas-based signature capture with base64 encoding and explicit scope definitions
- **Consent Ledger**: Immutable, hash-chained audit trail of all automated application activities
- **Auto-Apply Rules**: User-configurable job matching criteria with weekly caps and cooldown periods

**Database Schema Extensions:**
- `application_packages` - Reusable application material bundles (version, resumeUrl, coverLetterTemplate, contentHash)
- `consents` - Digital consent records (packageId, scopeJson, signatureBlob, signatureProvider)
- `consent_ledger` - Append-only audit trail (consentRef, action, jobId, timestamp, applyPayloadHash)
- `auto_apply_rules` - Automated application rules (name, consentRef, weeklyCap, cooldownSeconds, enabled)

**API Endpoints:**
- `POST /api/package` - Create application package
- `GET /api/package` - List user's packages
- `POST /api/consent` - Sign digital consent with signature blob
- `GET /api/consent` - List user's consents
- `GET /api/consent/ledger` - View immutable consent activity ledger
- `GET /api/auto-apply/status` - Get auto-apply configuration summary
- `GET /api/auto-apply/rules` - List auto-apply rules
- `PUT /api/auto-apply/rule/:id` - Update rule (enable/disable)
- `DELETE /api/auto-apply/rule/:id` - Delete rule

**Frontend Components:**
- `SignatureCapture` - HTML5 canvas-based digital signature component with clear/confirm actions
- `AutoApplyStatusCard` - Dashboard widget showing auto-apply configuration at-a-glance
- `ConsentLedgerTable` - Display component for immutable audit trail with action badges

**Frontend Pages:**
- `/candidate/application-package` - Create and manage application packages, sign digital consents
- `/candidate/auto-apply` - Configure auto-apply rules, view consent ledger and activity summary

**User Workflow:**
1. Create Application Package with resume URL and cover letter template
2. Sign Digital Consent using canvas-based signature capture
3. Configure Auto-Apply Rules defining job matching criteria and frequency limits
4. System automatically submits applications within consent scope
5. All actions logged to immutable consent_ledger with cryptographic hash chaining

**Compliance Features:**
- Explicit consent required before any automated applications
- Digital signatures captured and stored as base64-encoded PNG images
- Immutable audit trail prevents tampering and provides full transparency
- Weekly application caps and cooldown periods prevent spam
- Consent can be revoked at any time, immediately halting automated applications

### Saved Jobs Feature (October 19, 2025)

Implemented a complete saved jobs system allowing users to bookmark jobs for later review:

**Core Features:**
- **Save/Unsave Jobs**: One-click save/unsave functionality with instant feedback
- **Job Library**: Dedicated page to view all saved jobs with full details
- **Audit Logging**: All save/unsave actions are logged for transparency
- **Notes Support**: Optional notes field for user annotations

**Database Schema:**
- `saved_jobs` - User's saved jobs (id, userId, jobId, notes, createdAt)
- Indexes on userId and jobId for fast lookups

**Storage Interface:**
- `saveJob(userId, jobId, notes?)` - Save a job (idempotent)
- `unsaveJob(userId, jobId)` - Remove saved job
- `getUserSavedJobs(userId)` - Get all saved jobs for user
- `isJobSaved(userId, jobId)` - Check if job is saved

**API Endpoints:**
- `POST /api/jobs/:id/save` - Save a job (protected, rate-limited)
- `DELETE /api/jobs/:id/save` - Unsave a job (protected)
- `GET /api/saved-jobs` - Get user's saved jobs with full job details (protected)
- `GET /api/jobs/:id/is-saved` - Check if job is saved (protected)

**Audit Actions:**
- `JOB_SAVE` - Job saved by user
- `JOB_UNSAVE` - Job removed from saved list

**Implementation Notes:**
- Backend fully implemented and tested
- Frontend UI integration pending
- All endpoints include authentication and rate limiting
- Saved jobs are populated with full job details on retrieval

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend is built with React 18+ and TypeScript, utilizing Wouter for lightweight client-side routing, TanStack React Query for server state management, and React hooks for local state. UI components are developed using Shadcn/ui, built on Radix UI primitives, and styled with Tailwind CSS, following a custom design system based on Material Design and Linear typography. The design prioritizes a dark mode primary aesthetic with a custom HSL-based color palette and the Inter font family. Key pages include landing, login, pricing, job listings, evidence submission, and candidate/employer dashboards.

### Backend

The backend is developed with Express.js and TypeScript, serving RESTful APIs under `/api/*`. It incorporates Vite in middleware mode for development and features robust security measures including:
- CSP (Content Security Policy), HSTS, XSS protection, CORS configuration
- Rate limiting with sliding window algorithm (30 req/min API, 5 req/15min auth)
- Immutable audit logging with cryptographic hash chaining
- Session management with Express sessions and PostgreSQL store

The API supports core functionalities such as job management, application submission, evidence (proofs) management, user profiles, subscription handling via Stripe, and a weighted proof scoring system for applications. Initial development uses in-memory storage with an interface for future PostgreSQL migration.

### Data Layer

The data layer employs Drizzle ORM for PostgreSQL with a schema-first approach and TypeScript types, integrated with Zod for runtime validation. It utilizes Neon Serverless PostgreSQL as the database provider. Core entities include `users`, `profiles`, `organizations`, `jobs`, `proofs`, `applications`, `targetProofWeights`, `auditLinks`, and `signals`. Enums define roles, plan tiers, proof kinds, application statuses, and signal sources.

### Build & Development

The project uses Vite for fast HMR in development and optimized production builds, supporting TypeScript and ESBuild for server bundling. The development workflow includes standard npm scripts for development, building, starting the production server, and pushing schema changes to the database. It uses ES Modules throughout and employs path aliases for better code organization.

### Authentication

The system implements a Supabase-based authentication system with JWTs, email verification, and role-based signup. It integrates an AuthContext and `useAuth` hook for managing authentication state on the frontend and uses a protected route component for access control. All protected API routes require authentication.

### Monetization

The platform features a three-tier pricing model (FREE, PRO, PREMIUM) managed through Stripe subscriptions. It includes API endpoints for fetching pricing plans, managing user subscriptions, and creating/canceling subscriptions.

## External Dependencies

### UI & Interaction
- **Radix UI:** Accessible React primitives.
- **Lucide React:** Icon library.
- **Framer Motion:** Animation library.
- **cmdk:** Command palette component.
- **Embla Carousel:** Carousel/slider functionality.
- **React Hook Form & Zod:** Form state management and validation.
- **date-fns:** Date manipulation and formatting.

### Data & Validation
- **Zod:** Schema validation.
- **TanStack React Query:** Server state management and caching.

### Database & Storage
- **Neon Serverless PostgreSQL:** Cloud PostgreSQL database.
- **Drizzle ORM & Drizzle Kit:** Type-safe database queries and migrations.
- **connect-pg-simple:** PostgreSQL session store for Express.

### Styling & CSS
- **Tailwind CSS:** Utility-first CSS framework.
- **class-variance-authority, clsx, tailwind-merge:** Styling utilities.

### Development Tools
- **TypeScript:** Type safety.
- **Vite, ESBuild, tsx:** Build tools and TypeScript execution.

### Replit Integration
- `@replit/vite-plugin-runtime-error-modal`
- `@replit/vite-plugin-cartographer`
- `@replit/vite-plugin-dev-banner`

### Design Assets
- Custom brand logo and AI-generated marketing images.
- Unsplash images for hero sections.
- Google Fonts: Inter, JetBrains Mono.