# ProofOfFit - Compliance-First Hiring OS

A compliance-first, criteria-driven hiring OS. Candidates run a safe autopilot; employers get ranked, explainable slates. Every decision is traceable, consented, auditable, and as low-carbon as practical.

## 🎯 North Star

**The Da Vincian Constraints (our Vitruvian system):**
- **Truth:** Every score explains itself with evidence
- **Care:** Human dignity, consent, accessibility
- **Craft:** Lean primitives over ornate machinery; fewer moving parts
- **Planet:** Measure kWh/kgCO₂e; prefer smaller models when outcomes are equal

## 🏗️ Architecture

**Pattern:** Modular monolith → service extraction as load/teams grow

### Core Planes
- **Data Plane:** Postgres (OLTP), Object Store (docs/artifacts), Vector Index, Event Bus, Immutable ActionLog
- **Control Plane:** Orchestrators (Apply, Comms), Schedulers (Carbon-aware), Policies (ToS/Compliance), RBAC/Consent
- **Intelligence Plane:** Criteria Graph, Ranker, Tailor Engine, Bias Monitor, Evaluator
- **Edge/IO Plane:** Feed Connectors (USAJOBS, ReliefWeb, ATS boards), Email/Calendar Bridges (Gmail/Outlook), Web/API, Admin UI

### Tech Stack (MVP)
- **Frontend:** Next.js (App Router) with React Server Components, Tailwind, shadcn/ui
- **Backend:** FastAPI (Python) for ML-adjacent services; Node/TypeScript for IO-heavy connectors
- **Database:** Supabase Postgres with pgvector, pgcrypto, RLS
- **Infrastructure:** Vercel (serverless), Supabase (managed services)
- **Payments:** Stripe
- **AI/ML:** Provider-agnostic adapter with structured outputs via Pydantic

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/proof-of-fit.git
   cd proof-of-fit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp apps/web/env.example apps/web/.env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Stripe
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   STRIPE_PRO_PRICE_ID=your_stripe_pro_price_id

   # Email (optional)
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Enable the required extensions: `pgcrypto`, `pgvector`, `pg_cron`, `pg_stat_statements`
   - Run the database migrations:
     ```bash
     cd apps/web
     npm run db:push
     ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## 📁 Project Structure

```
proof-of-fit/
├── apps/
│   ├── web/                 # Next.js application
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   ├── components/  # React components
│   │   │   ├── lib/         # Utilities and configurations
│   │   │   └── types/       # TypeScript type definitions
│   │   ├── prisma/          # Database schema and migrations
│   │   └── package.json
│   ├── api/                 # FastAPI service (future)
│   └── workers/             # Node/TS connectors (future)
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── types/               # Shared TypeScript types
│   ├── clients/             # Typed SDKs
│   └── prompts/             # LLM prompts and guards
├── infra/                   # Infrastructure as code
│   ├── terraform/           # AWS modules
│   └── k8s/                 # Kubernetes manifests
└── .github/workflows/       # CI/CD workflows
```

## 🎨 UI Components

The project uses a custom UI component library built on top of Radix UI and Tailwind CSS. Components are located in `packages/ui/src/components/` and include:

- **Layout:** Card, Separator, Sheet, Dialog
- **Forms:** Input, Button, Checkbox, RadioGroup, Select, Textarea
- **Navigation:** NavigationMenu, Tabs, Accordion
- **Feedback:** Toast, Alert, Progress, Skeleton
- **Data Display:** Avatar, Badge, Table
- **Overlays:** Popover, Tooltip, DropdownMenu

## 🗄️ Database Schema

The application uses Prisma with PostgreSQL and includes the following key entities:

- **Tenant:** Multi-tenant organization management
- **User:** User accounts with role-based access
- **CandidateProfile:** Candidate information and preferences
- **Job:** Job postings from various sources
- **Slate:** Ranked candidate lists for employers
- **Application:** Job applications with status tracking
- **ActionLog:** Immutable audit trail with hash chaining
- **CriteriaNode:** Hierarchical criteria graph for matching
- **Embedding:** Vector embeddings for semantic search

## 🔐 Security & Privacy

- **Row-Level Security (RLS):** Tenant isolation at the database level
- **Authentication:** Supabase Auth with magic links and OAuth
- **Authorization:** Role-based access control (RBAC)
- **Data Protection:** Field-level encryption for PII
- **Audit Trail:** Immutable action log with cryptographic integrity
- **Consent Management:** Granular consent tracking and management

## 🌱 Sustainability

- **Carbon-Aware Processing:** Batch operations during low-carbon periods
- **Efficient Models:** Preference for smaller, more efficient AI models
- **Sustainability Metrics:** Track kWh/kgCO₂e per operation
- **Green Hosting:** Vercel's carbon-neutral infrastructure

## 🚦 Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start all services in development mode
npm run build            # Build all packages
npm run lint             # Lint all packages
npm run test             # Run tests

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes to database
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio
```

### Code Quality

- **TypeScript:** Strict type checking across all packages
- **ESLint:** Consistent code style and best practices
- **Prettier:** Code formatting
- **Husky:** Git hooks for pre-commit checks

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 📊 Monitoring & Observability

- **Error Tracking:** Sentry integration
- **Performance:** Vercel Analytics
- **Logs:** Structured logging with correlation IDs
- **Metrics:** Custom dashboards for business KPIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Write tests for new features
- Update documentation as needed
- Ensure all CI checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation:** [docs.proofoffit.com](https://docs.proofoffit.com)
- **Issues:** [GitHub Issues](https://github.com/your-org/proof-of-fit/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-org/proof-of-fit/discussions)
- **Email:** support@proofoffit.com

## 🗺️ Roadmap

### Phase A - Groundwork & Skeleton ✅
- [x] Monorepo setup with Turborepo
- [x] Next.js App Router with Supabase
- [x] Prisma schema and RLS
- [x] Basic UI component library
- [x] Landing page and marketing site

### Phase B - Candidate Autopilot (In Progress)
- [ ] Feed connectors (USAJOBS, ReliefWeb, ATS)
- [ ] Job normalizer and ToS policy engine
- [ ] Criteria graph and ranker
- [ ] Tailor engine for resume generation
- [ ] Prep-and-confirm flow

### Phase C - Employer Slate Engine
- [ ] Intake builder for employers
- [ ] Slate generation with explanations
- [ ] Recruiter actions and feedback loop
- [ ] Audit URLs and compliance reporting

### Phase D - Compliance & Safety
- [ ] Consent manager and privacy controls
- [ ] Bias monitoring and fairness metrics
- [ ] Carbon-aware scheduling
- [ ] Accessibility compliance (WCAG 2.2 AA)

### Phase E - Monetization
- [ ] Stripe integration and subscription management
- [ ] Plan entitlements and feature gates
- [ ] Billing and invoicing

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)

---

**ProofOfFit** - Making hiring more transparent, fair, and sustainable. 🌍
