# ProofOfFit — System Architecture (v0.1)

## 0) North Star
A compliance‑first, criteria‑driven hiring OS. Candidates run a safe autopilot; employers get ranked, explainable slates. Every decision is traceable, consented, auditable, and as low‑carbon as practical.

### The Da Vincian Constraints (our Vitruvian system)
- **Truth:** Every score explains itself with evidence.
- **Care:** Human dignity, consent, accessibility.
- **Craft:** Lean primitives over ornate machinery; fewer moving parts.
- **Planet:** Measure kWh/kgCO₂e; prefer smaller models when outcomes are equal.

---

## 1) Architecture at 10,000 ft
**Pattern:** Modular monolith → service extraction as load/teams grow.

**Core planes**
- **Data Plane:** Postgres (OLTP), Object Store (docs/artifacts), Vector Index, Event Bus, Immutable ActionLog.
- **Control Plane:** Orchestrators (Apply, Comms), Schedulers (Carbon‑aware), Policies (ToS/Compliance), RBAC/Consent.
- **Intelligence Plane:** Criteria Graph, Ranker, Tailor Engine, Bias Monitor, Evaluator.
- **Edge/IO Plane:** Feed Connectors (USAJOBS, ReliefWeb, ATS boards), Email/Calendar Bridges (Gmail/Outlook), Web/API, Admin UI.

**Runtime (MVP)**
- Backend: **FastAPI (Python)** for ML‑adjacent services; **Node/TypeScript** for IO‑heavy connectors and the Comms Hub.
- Frontend: **Next.js (App Router)** with React Server Components, Tailwind, shadcn/ui.
- Infra: AWS (RDS Postgres + S3 + ECS Fargate/EKS later + CloudFront + SES) or GCP analogs.

---

## 1.1) Tech Stack — Bill of Materials & Adoption Map
| Layer | Tech | Why | When |
|---|---|---|---|
| Web app | Next.js (RSC, Route Handlers), Tailwind, shadcn/ui | SSR for privacy/SEO; minimal client JS; fast DX | **MVP** |
| API | FastAPI + Uvicorn | Pydantic validation, async I/O, Python ML proximity | **MVP** |
| Connectors | Node/TS workers (BullMQ/Temporal) | Great at HTTP/queues; isolates vendor quirks | **MVP** |
| DB | Postgres 16 + SQLAlchemy 2 + Alembic | Strong OLTP + JSONB + pgcrypto | **MVP** |
| Vector | pgvector (→ Qdrant if scale) | Keep joins close; easy ops | **MVP** (→ **v1.2** Qdrant) |
| Cache | Redis (Elasticache) | Criteria expansions, sessions, rate‑limits | **MVP** |
| Events | SNS+SQS (→ Kafka/Redpanda) | Managed reliability; later high‑throughput | **MVP** (→ **v1.2**) |
| Files | S3 (SSE‑KMS, presigned) | Résumés, letters, PDFs, artifacts | **MVP** |
| Auth | Auth.js (NextAuth) + OAuth (Google/Microsoft) + JWT/Rotating refresh | Low friction; enterprise‑ready path | **MVP** (SSO/SAML **v1.1**) |
| Email | Gmail/Outlook APIs; SES fallback; React Email | In‑product comms; templating | **MVP** |
| PDFs | Playwright print‑to‑PDF (→ Prince/WeasyPrint opt) | Accurate, fast | **MVP** |
| LLM | Provider‑agnostic adapter; structured outputs via Pydantic | Guardrails; swap vendors | **MVP** |
| Embeddings | Open model (e.g., bge/MiniLM) hosted + fallback API | Cost control, privacy | **MVP** |
| Reranker | Cross‑encoder (e.g., e5‑rerank‑base) | Better ranking fidelity | **v1.1** |
| Scheduler | Carbon‑aware (WattTime/ElectricityMap adapter) | Batch in greener windows | **v1.1** |
| Policy | Cerbos or Oso (RBAC/ABAC) | Externalize authz & ToS gates | **v1.1** |
| Feature flags | Unleash (self‑host) | Safe rollout | **MVP** |
| Billing | Stripe | Trials, slates, seats | **v1.1** |
| Observability | OpenTelemetry → Tempo/Prom/Grafana + Sentry | Traces, metrics, errors | **MVP** |
| Testing | Pytest/Jest + Playwright + Pact | Unit/E2E/contract | **MVP** |
| CI/CD | GitHub Actions + Terraform + Atlantis | IaC + canaries | **MVP** |
| Security | AWS KMS, Secrets Manager, OPA checks, Trivy, Dependabot | Baseline hardening | **MVP** (SOC2 prep **v1.2**) |
| DWH/BI | BigQuery/Snowflake + dbt | Cohort KPIs, audits | **v1.2** |
| MLOps | Model registry (MLflow) + prompt store + eval harness | Reproducibility | **v1.2** |

---

## 1.2) Monorepo Layout (Turborepo)
```
proof-of-fit/
  apps/
    web/            # Next.js app (marketing + product)
    api/            # FastAPI service
    workers/        # Node/TS connectors & orchestrations
    admin/          # Vite app for ops tools
  packages/
    ui/             # shared React components
    types/          # zod/pydantic schemas via codegen
    clients/        # typed SDKs (ts/python)
    prompts/        # LLM prompts + guards (versioned)
  infra/
    terraform/      # AWS modules (vpc, rds, s3, ecs, cf, ses)
    k8s/            # (later) manifests/helm
  .github/workflows/
```

---

## 2) Services & Responsibilities
1) **Feed Ingestion Service**
   - Connectors: USAJOBS, ReliefWeb, Greenhouse/Lever job boards, employer career pages with explicit permission.
   - Pull → de‑dup → ToS policy check → Normalize to **Job** schema → store.
   - Rate‑limit & backoff; provenance stored.

2) **ToS & Compliance Policy Engine**
   - Allowlist/denylist per source; CAPTCHA detector flag; terms versioning.
   - Decision: **Auto‑Apply** vs **Prep‑and‑Confirm** vs **No‑Go**.
   - **Tech:** Cerbos/Oso for authz, custom policy compiler for ToS.

3) **Normalizer/Parser**
   - Structured Job schema: title, org, description blocks, requirements, compensation, constraints, ToS flags.
   - Redact PII from inputs; detect pay transparency fields.
   - **Tech:** spaCy + rule DSL; fallback LLM chunk classifier.

4) **Profile Service (Candidates/Employers)**
   - Candidate: résumé bullets (evidence‑tagged), credentials, consents, contact policy.
   - Employer: org, users, roles, intake defaults, DPAs.
   - **Tech:** FastAPI + SQLAlchemy; signed URLs for artifacts.

5) **Criteria Graph Service**
   - Taxonomy of requirements; synonyms; mappings to evidence types (result, method, tool, credential, language, domain).
   - Backed by Postgres tables + vector embeddings for semantic neighbors.
   - **Tech:** pgvector; admin UI to edit graph.

6) **Ranker Service**
   - `FitScore = HARD_FILTER_PASS ? Σ(w_i*s_i) + λ*semantic_similarity : 0`.
   - Produces **Explanation Slices**: top 5 evidence lines mapped to criteria.
   - Thresholding + queue gating (must‑haves ≥ 80%).
   - **Tech:** NumPy/PyTorch for rerankers; ONNX export for speed.

7) **Tailor Engine**
   - Rule‑first assembly from a **Bullet Library** (evidence‑linked) → LLM refine with guardrails.
   - Outputs: tailored résumé PDF/Docx, cover letter, short intro email; citations to source bullets.
   - **Tech:** Pydantic‑first prompting; Instructor/Guardrails; Playwright → PDF; Pandoc for Docx.

8) **Apply Orchestrator**
   - Uses Policy Engine decision; fills forms for allowed endpoints; attaches documents; logs everything to ActionLog.
   - For restricted sites, creates a **Prep‑and‑Confirm** task/URL for the candidate.
   - **Tech:** Node workers with Playwright (view‑only on restricted flows), idempotent job registry.

9) **Comms Hub**
   - Gmail/Outlook bridges; templated recruiter messages; reply classification; cadence governor; audit stamps.
   - **Tech:** Gmail/Graph APIs; React Email; lightweight classifier (scikit‑learn) before any fine‑tune.

10) **Slate Service**
   - Consumes Employer Intake (weights + order) → produces ranked slate (3–8) + rationale PDF + audit URL.
   - Click‑actions: Interview / Decline / Clarify → feed back to Model Feedback Bus.
   - **Tech:** FastAPI orchestration; PDFkit/Playwright for rationale packs.

11) **Bias Monitor & Evaluator**
   - Distribution checks by criterion; drift detection; counterfactual tests on weights; fairness warnings.
   - **Tech:** pandas/StatsModels; dashboards in Grafana; alerts to Slack.

12) **Carbon‑Aware Scheduler**
   - Batch windows for heavy jobs; model size selection; cache priming; region hints.
   - **Tech:** adapter to ElectricityMap/WattTime; fall back to region grid averages.

13) **Consent & Privacy Service**
   - Tracks opt‑in/out, data sharing scope, retention policy, deletion SLAs; generates consent receipts.
   - **Tech:** JSON-LD consent receipts; signed webhook to tenants.

14) **ActionLog (Immutable)**
   - Append‑only event stream with hash‑chaining; per‑tenant signed digests; minimal payloads + object references.
   - **Tech:** Postgres ledger + periodic digest sealed with KMS key; export to object store.

15) **Analytics Service**
   - KPI computation: QIPM, on‑spec rate, time‑to‑slate, follow‑up lift, kWh/kgCO₂e per unit.
   - **Tech:** dbt → warehouse; Grafana/Metabase for views.

---

## 3) Data Stores
- **Postgres (OLTP)**: jobs, profiles, criteria, applications, slates, consents, policies, comms metadata.
- **Object Storage (S3/GCS)**: uploads, generated résumés/letters, rationale PDFs, artifacts (proof links).
- **Vector Index (pgvector or Qdrant)**: embeddings for jobs, bullets, criteria.
- **Event Bus (Kafka/Redpanda/SNS+SQS)**: ingestion → normalizer → rank → tailor → apply → comms → analytics.
- **Ledger**: ActionLog table with hash(prev_hash||event) + daily root digest in separate KMS‑sealed store.
- **Cache (Redis)**: criteria expansions, embedding hits, session state.

---

## 4) Key Schemas (abridged)
### Job
`{ id, source, org, title, location, work_type, pay, description, requirements:{must_have[], preferred[]}, constraints:{license?, clearance?, language[]}, tos:{allowed:boolean, captcha:boolean, notes}, fetched_at }`

### EmployerIntake
`{ job_ref, must_have[], preferred[], preference_order[], weights:{k:v}, constraints{}, contact{}, terms{}, notices{} }`

### CandidateProfile
`{ id, contact, consents, preferences, credentials[], bullets:[{text, tags:{criterion, evidence_type, metric?, scope?, tool?, link?}}], artifacts[] }`

### Slate
`{ id, employer_id, job_ref, criteria, weights, candidates:[{candidate_id, fit:0..1, explanations:[{criterion, evidence_ref, snippet, link?}], status}], audit_url }`

### Application
`{ id, candidate_id, job_ref, channel, status, policy_decision, documents, timestamps }`

### ActionLogEvent
`{ id, ts, actor_type, actor_id, action, obj_type, obj_id, payload_ref, prev_hash, hash }`

---

## 5) Critical Flows (text sequences)
### A) Candidate Autopilot
1. Preferences set → Feed pulls jobs (policy‑checked) → Normalizer → Job store.
2. Ranker scores matches → queues only those ≥ threshold & must‑have coverage.
3. Tailor Engine assembles résumé/letter → Apply Orchestrator decides Auto vs Prep‑and‑Confirm.
4. Comms Hub schedules polite follow‑ups; ActionLog records each step.
5. Weekly Brief summarizes sourced→applied→interviews with bottleneck flags.

### B) Employer Slate
1. Employer posts Intake (weights + order) → Ranker filters & scores candidate pool.
2. Slate Service assembles top 3–8 with explanations → sends rationale PDF + audit URL.
3. Recruiter actions (Interview/Decline/Clarify) flow back to Feedback Bus; Ranker/Evaluator updates weights/rules.

### C) Compliance Gate
1. New source → ToS parse/version → Policy Engine sets `allowed|prep_only|deny` → Orchestrator enforces.
2. CAPTCHA detection flips to Prep‑and‑Confirm automatically.

### D) Carbon‑Aware Batch
1. Scheduler polls carbon intensity → delays embedding rebuilds & large parsing batches to greener windows if latency SLOs permit.

---

## 6) Algorithms (v1) — with Guarded Outputs
**Hard Filters:** work auth, location radius, required license/clearance, min years → boolean.

**Criterion Score (s_i):**
- Evidence strength: metric magnitude (normalized), recency decay, scope weighting.
- Credential verification flag boosts.
- Domain proximity from embeddings (0..1).

**Semantic Similarity:** cosine(job_text, candidate_corpus) scaled by λ.

**Explainability:** top‑k evidence lines per criterion with score contributions and links.

**Safety wrappers:** Pydantic schemas for every LLM call; content policy checks; citation presence checks; zero‑fabrication rule.

**Bias Controls:** monitor score distributions; flag criteria with proxy risk; require reviewer ack to proceed; counterfactual swap on sensitive fields (if available via consented, aggregate data) to check robustness.

---

## 7) Guardrails & Safety
- **ToS respect**: strict policy enforcement; never bypass CAPTCHA; maintain per‑source Policy Cards.
- **Consent & PII minimization**: default‑off sharing; redact unnecessary data; retention tiers.
- **Dignity features**: Prep‑and‑Confirm on restricted sites; candidate‑set cadence; human‑visible proofs.
- **Security**: OAuth for Google/Microsoft; SSO/SAML for employers; KMS‑backed encryption; RBAC; secrets vault.
- **Observability**: OpenTelemetry traces; structured logs; SLOs with burn‑rate alerts.

---

## 8) SLOs & Reliability (with Performance Budgets)
- **API latency budgets:** p95 250ms read, p95 600ms write; error budget 1% monthly.
- **Ranker:** <250ms cached pair, <800ms uncached; tail cut by pre‑computing top‑N per user nightly.
- **Tailor:** 2–6s per packet (LLM); SLA measured per batch; fall back to cached modules during incidents.
- **Comms:** inbox poll webhooks <60s lag; nudge cadence governor.
- **Uptime:** 99.9% core; graceful degradation toggles (freeze Tailor, pause heavy batches, read‑only mode) controlled by feature flags.
- **Carbon budgets:** kWh/kgCO₂e ceilings per 100 tailored apps & per slate; enforce via Scheduler.

**DR/Backups:** RPO 5m, RTO 60m; PITR on Postgres; daily object‑versioning; chaos drills quarterly.

---

## 9) Deployment & Environments
- **Envs**: dev, staging, prod; separate tenants, keys, and data planes.
- **IaC**: Terraform + Atlantis; GitHub Actions CI/CD; canary deploys; feature flags (LaunchDarkly‑style).
- **Secrets**: Vault/Parameter Store; short‑lived tokens.

---

## 10) Evaluation Harness (Da Vinci’s notebooks)
- **Scoring**: labeled set across domains; report PR/ROC and calibration; spot‑check explanations for fidelity.
- **Tailor quality**: human rubric; auto‑lint to reject bullets lacking evidence tags.
- **Comms**: deliverability (seed inboxes), reply classification accuracy.
- **Fairness**: distribution parity by criterion; drift deltas; mitigation notes (aggregate, consented data only).
- **Sustainability**: kWh/kgCO₂e per 100 tailored apps & per slate; cache hit rate; model mix.
- **Cost**: tokens, runtime, storage per unit; per‑tenant cost guardrails.
- **Release gate**: a build ships only if it beats last week on ≥2 core KPIs without regressing fairness/footprint.

---

## 11) Security & Privacy (Blueprint)
- **Identity/Access**: Auth.js + OAuth; SSO/SAML (v1.1); RBAC via Cerbos/Oso; admin actions require step‑up auth.
- **Data protection**: SSE‑KMS on S3; pgcrypto for field‑level encryption (PII); TLS‑only; strict CSP.
- **Secrets**: AWS Secrets Manager & Parameter Store; short‑lived tokens; zero secrets in repos.
- **Supply chain**: Dependabot, Trivy, SBOM (Syft), signature verification (Cosign) for containers.
- **Privacy ops**: Data map, DPIA templates, deletion SLAs, cryptographic erasure (key destruct) for blobs.
- **Compliance path**: SOC 2 Type I (v1.2) → Type II; ISO 27001 optional; Colorado AI Act readiness: notices, risk logs, explainability exports.
- **SIEM hooks**: CloudTrail + VPC flow logs → OpenSearch/Splunk; alerting via PagerDuty.

---

## 12) Build‑Order (MVP → v1.3)
**MVP (Weeks 1–8)**
- Scaffolds (Turborepo), web (Next.js), API (FastAPI), workers (Node)
- Feed Ingestion (USAJOBS/ReliefWeb/Greenhouse/Lever)
- Policy Engine v0 (allow/prep/deny)
- Ranker v1 + Criteria Graph
- Tailor Engine (rules + LLM refine)
- Apply Orchestrator + Prep‑and‑Confirm
- Comms Hub (Gmail) + Weekly Briefs
- Slate Service + Audit URLs
- ActionLog + basic Analytics + Observability

**v1.1 (Weeks 9–14)**
- Outlook bridge; reranker (cross‑encoder); carbon‑aware scheduler; credentials verification hooks; feature flags & billing; bias monitor v1

**v1.2 (Weeks 15–22)**
- Warehouse + dbt; SOC2 Type I groundwork; Qdrant (if needed); Policy Engine externalized (Cerbos/Oso); DPA workflows; employer SSO

**v1.3 (Weeks 23–30)**
- Partner APIs (workforce boards), webhooks, marketplace pilot (per‑slate billing), SIEM integration, multi‑region failover (read‑replicas)

---

## 13) API Surface (sketch)
`POST /api/candidate/profiles` – upsert profile + consents  
`GET /api/candidate/matches` – ranked jobs + explanations  
`POST /api/candidate/applications` – create (auto or prep)  
`POST /api/employer/intake` – create intake (weights/order)  
`GET /api/employer/slates/:id` – fetch slate + audit link  
`POST /api/recruiter/actions` – interview/decline/clarify  
`POST /api/webhooks/email` – message events  
`GET /api/audit/:obj_type/:id` – signed, read‑only stream

---

## 14) Open Questions (tracked)
- Credential verification partners and SLAs.
- Carbon‑intensity data sources and regional availability.
- Multi‑lingual coverage priority order.
- Storage of redacted vs raw résumés for reproducibility.

---

## 15) Definition of Done (Architecture)
- End‑to‑end demo of Candidate Autopilot and Employer Slate with audit URLs.
- Policy Engine prevents any restricted automation.
- Bias & sustainability dashboards wired with first metrics.
- Incident + privacy runbooks approved.
- Two pilots live; first paid employer slate delivered.

---

# Supabase/Vercel Implementation (v0.1)
A refined blueprint that maps the Vitruvian architecture onto **Next.js + Supabase + Vercel + Stripe**—minimizing moving parts while preserving compliance, explainability, and sustainability.

## A) Stack Mapping & Phases
| Capability | Choice | Why | Phase |
|---|---|---|---|
| Web app | **Next.js (App Router)**, RSC, Route Handlers | SSR privacy/SEO, low client JS | MVP |
| UI | Tailwind + **shadcn/ui** + lucide-react | Fast, accessible, consistent | MVP |
| DB | **Supabase Postgres** (pgvector, pgcrypto, RLS) | Managed, extensions, RLS | MVP |
| ORM | **Prisma** (typed schema/migrations) | Type safety, DX | MVP |
| Auth | **Supabase Auth** (passwordless/magic link) | Frictionless + JWT with RLS | MVP |
| Files | **Supabase Storage** (signed URLs) | Résumés/letters/artifacts | MVP |
| Edge/runtime | **Vercel** (serverless, edge runtime) | Speed, CI/CD, Cron | MVP |
| Background jobs | **Vercel Cron** + Supabase **pg_cron** + Edge Functions | Nightly rank, briefs, embeds | MVP |
| Events | **Supabase Realtime** + DB triggers | Simple, low‑ops bus | MVP |
| Vector search | **pgvector** in Supabase | Keep joins local; ops‑light | MVP |
| Payments | **Stripe** (Checkout/Portal/Webhooks) | SaaS/subscriptions | MVP |
| i18n | **next‑intl** (en, fr, rw, sw, ln) | Your locales | MVP |
| Observability | Vercel + Sentry + Logflare/Edge logs | Errors, perf | MVP |
| BI (later) | BigQuery/Snowflake + dbt (via connectors) | KPI/insights | v1.2 |
| Policy/RBAC | DB RLS + lightweight **Cerbos** (option) | Fine‑grained auth | v1.1 |

## B) Supabase Schema (key tables)
- `tenants(id, name, plan, created_at)`
- `users(id uuid pk, tenant_id, email, role, locale, created_at)`
- `candidate_profiles(id, tenant_id, user_id, preferences jsonb, contact_policy jsonb, created_at)`
- `credentials(id, candidate_id, type, issuer, issued_on date, verified boolean, doc_url)`
- `bullets(id, candidate_id, text, tags jsonb)`  — **evidence‑tagged**
- `artifacts(id, candidate_id, title, url, type)`
- `jobs(id, source, org, title, location, work_type, pay, description, requirements jsonb, constraints jsonb, tos jsonb, fetched_at)`
- `employer_intakes(id, tenant_id, job_ref, must_have jsonb, preferred jsonb, preference_order jsonb, weights jsonb, constraints jsonb, terms jsonb)`
- `slates(id, tenant_id, employer_id, job_ref, weights jsonb, candidates jsonb, audit_url)`
- `applications(id, tenant_id, candidate_id, job_ref, channel, status, policy_decision, documents jsonb, timestamps jsonb)`
- `criteria_nodes(id, key, label, parent_id, synonyms text[], meta jsonb)`  — **Criteria Graph**
- `embeddings(id, obj_type, obj_id, vector vector(768))`
- `consents(id, tenant_id, user_id, scope, granted_at, expires_at)`
- `policy_sources(id, domain, allowed boolean, captcha boolean, notes, version)`
- `action_log(id bigserial pk, tenant_id, actor_type, actor_id, action, obj_type, obj_id, payload_hash bytea, prev_hash bytea, hash bytea, ts timestamptz default now())`

### Extensions
Enable: `pgcrypto`, `pgvector`, `pg_cron`, `pg_stat_statements`.

## C) RLS (Row‑Level Security) Sketch
```sql
-- Enable RLS on all tenant‑scoped tables
alter table candidate_profiles enable row level security;

create policy tenant_isolation on candidate_profiles
  for select using (tenant_id = current_setting('request.jwt.claims', true)::jsonb->>'tenant_id');

-- Employers can read slates for their tenant; candidates only their own
create policy slate_read on slates
  for select using (
    tenant_id = current_setting('request.jwt.claims', true)::jsonb->>'tenant_id'
  );
```
(Use Supabase Auth JWT claim injection for `tenant_id` and `role`.)

## D) Immutable ActionLog (hash‑chain)
```sql
create extension if not exists pgcrypto;

create or replace function actionlog_hash() returns trigger as $$
declare prev bytea; cur bytea; payload bytea;
begin
  select hash from action_log where id = (select max(id) from action_log where tenant_id = new.tenant_id) into prev;
  payload := decode(new.payload_hash, 'hex');
  cur := digest(coalesce(prev,'') || payload || new.ts::text::bytea, 'sha256');
  new.prev_hash := prev; new.hash := cur; return new;
end; $$ language plpgsql;

create trigger actionlog_hash_trg before insert on action_log
for each row execute function actionlog_hash();

-- Prevent updates/deletes
create rule no_update as on update to action_log do instead nothing;
create rule no_delete as on delete to action_log do instead nothing;
```

## E) Next.js App Structure (App Router)
```
/app
  /(public)
    page.tsx             # marketing
  /dashboard
    layout.tsx           # auth + tenant context
    page.tsx             # metrics
  /candidate
    matches/page.tsx     # ranked jobs + WHY
    apply/route.ts       # server action -> orchestrator
  /employer
    intake/page.tsx      # weights + order builder
    slate/[id]/page.tsx  # ranked slate + audit link
  /api
    stripe/webhook/route.ts
    comms/webhook/route.ts  # Gmail/Outlook events
    audit/[type]/[id]/route.ts
/middleware.ts            # role/tenant checks
```

## F) Background & Scheduling
- **Vercel Cron**: nightly re‑rank, weekly digests, cache warmers.
- **pg_cron**: small DB‑local jobs (cleanup, embedding backlog)
- **Edge Functions (Supabase)**: policy checks at ingestion; HR slate builder for bulk runs.
- **Carbon‑aware mode**: toggle on Cron jobs; scheduler queries intensity API and defers non‑urgent batches.

## G) Stripe Integration
- **Checkout** for Candidate Pro/Pro+ and Employer Team; **Customer Portal** for self‑serve changes.
- **Webhook (Route Handler)** listens for `checkout.session.completed`, `customer.subscription.updated/deleted` → updates `tenants.plan` & entitlements.
- **Entitlements Guard**: middleware checks plan → feature flags (slate size, API access, rate limits).

## H) AI Adapter (server‑side only)
- Server Actions/Route Handlers call the **LLM Adapter** with Pydantic/TypeBox schemas (validate every response).
- Tasks: tailoring refinement, explanation drafting, moderation, sentiment/scam detection (progressive rollout).
- **Embeddings**: local model (bge/MiniLM) in a serverless‑friendly worker; store in `embeddings`.

## I) Internationalization
- **next‑intl** locales: `en`, `fr`, `rw`, `sw`, `ln`.
- Audit copy & emails localized; units/currency by tenant.

## J) Mapbox (gradual)
- Candidate search by commute radius; employer site location privacy rules.

## K) DevEx & CI/CD
- **GitHub Actions**: lint/test, `prisma migrate deploy`, seed scripts, typegen, Vercel preview deployments.
- **Supabase CLI**: migration diffs, seed, local dev.
- **Checks**: block merge unless migrations apply cleanly and RLS tests pass.

## L) Risks & Mitigations (Supabase/Vercel)
1. **Cold starts / serverless limits** → stream responses (RSC), cache, precompute nightly.
2. **Long‑running jobs** → split into batches; use Edge Functions or queue via pg\_cron; avoid browser timeouts.
3. **RLS complexity** → central test suite for policies; minimal per‑table rules.
4. **LLM cost drift** → prompt cache + smaller models, “Sustainability Mode,” spend guards per tenant.
5. **Stripe race conditions** → idempotency keys; replay protection; store event receipts.
6. **ActionLog bloat** → compress payloads before hashing; store artifacts in Storage, only hashes in ledger.

## M) Definition of Done (Supabase Variant)
- RLS enforced on all tenant data; audit export works.
- Stripe webhooks drive plan/entitlements reliably.
- Nightly rank + weekly briefs via Cron; carbon toggle live.
- Candidate **Prep‑and‑Confirm** and Employer **Slate** both live with audit URLs.
- i18n in UI + emails for at least `en`/`fr`.


# Roadmap (No Dates — Crush at Your Pace)
Guiding aim: deliver explainable, compliant hiring flows that respect humans and the planet. Each phase has **exit criteria** so you know when to advance.

## Phase A — Groundwork & Skeleton
**Build**: Monorepo (Turborepo), Next.js App Router, Supabase project, Prisma schema (core tables), RLS baseline, Supabase Auth (magic link), Vercel envs, CI/CD, next-intl scaffolding (en, fr, rw, sw, ln).
**Exit**:
- Sign‑in/out works; tenant isolation proven with RLS tests.
- Seed data loads; health checks green; basic error logging.

## Phase B — Candidate Autopilot Core
**Build**: Feed connectors (USAJOBS, ReliefWeb, ATS job boards); Job normalizer; ToS Policy table + gate UI (allowed / prep‑only / deny); Criteria Graph; Ranker v1; Tailor Engine (rules‑first + LLM refine); Prep‑and‑Confirm flow; Application log; Weekly brief email.
**Exit**:
- Candidate signs in → sees ranked jobs with **Why** evidence.
- One allowed source auto‑applies end‑to‑end; one restricted source shows prep link.
- ActionLog records each step (hash‑chained).

## Phase C — Employer Slate Engine
**Build**: Intake builder (must‑have vs preferred, **preference order**, weights); Slate generation (3–8); Rationale PDF (evidence slices); Recruiter actions (Interview/Decline/Clarify) with audit stamps; Employer weekly status.
**Exit**:
- Employer generates a slate and receives a shareable audit URL.
- Recruiter actions loop back to improve future rankings.

## Phase D — Compliance, Safety & Dignity
**Build**: Consent manager; Privacy notices; Deletion flow (cryptographic erasure); Accessibility pass (WCAG 2.2 AA targets); Bias Monitor v1 (distribution checks + warnings); Sustainability Mode (smaller models + caching); Carbon‑aware Cron; Observability dashboards; SIEM hooks optional.
**Exit**:
- DPIA and data map completed; deletion SLA verified.
- Bias dashboard live; Sustainability Mode visibly reduces token/runtime per unit.

## Phase E — Monetization & Plans
**Build**: Stripe Checkout + Portal; plan entitlements (Free/Pro/Pro+/Team/Per‑slate); webhooks to update tenant plan; feature gates (slate size, API access, rate limits); dunning emails.
**Exit**:
- Payment flow completes; entitlements gate features correctly.
- Invoice/receipt emails pass tests; webhook retries idempotent.

## Phase F — Comms & Integrations
**Build**: Gmail bridge (Outlook later); templated follow‑ups; reply classification (lightweight); calendar holds; employer domain verification.
**Exit**:
- Nudge cadence adjustable; replies labeled; meetings created from slate.

## Phase G — Product Polish & Growth
**Build**: Marketing hero + “How it works”; i18n copy for UI and emails; Admin console for policy sources & criteria graph; Analytics dashboards (QIPM, on‑spec rate, kWh/kgCO₂e per slate/app); Mapbox basics (location/commute radius).
**Exit**:
- Public site converts; dashboards show real metrics; map features work in at least one flow.

## Phase H — Scale & Reliability
**Build**: Precompute top‑N caches; pg_cron batchers; embedding service hardening; rate limits; backups/DR with PITR; read replicas; SSO/SAML for employers; Cerbos/Oso for nuanced RBAC; warehouse + dbt for cohort/quality reporting; SOC2 Type I prep.
**Exit**:
- Performance budgets met under pilot load; restore drill passes; SSO live for first employer.

## Phase I — Pilot & Evidence
**Build**: Two employer pilots, five candidate pilots; success rubrics; case studies; pricing feedback; iterate Ranker weights and Tailor modules.
**Exit**:
- Qualified interviews per candidate per month (QIPM) improves vs baseline.
- Employer on‑spec interview rate crosses target; at least one paid slate delivered.

## Phase J — Optional Power‑Ups
- Cross‑encoder reranker; credentials verification partners; Spec Negotiator (suggest weight relax/tighten); lightweight assessments mapped to criteria; partner APIs (workforce boards); marketplace bounties.

**Rule of advancement**: move forward only when the current phase’s exit criteria are met **without** regressing fairness, privacy, or carbon budgets.
