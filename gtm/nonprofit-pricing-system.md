# Nonprofit Pricing System — ProofOfFit

- [x] Canonical narrative aligned — Owner: Emmanuel Ngabire — Due: 2025-10-19
- [x] Operating model guardrails documented — Owner: Emmanuel Ngabire — Due: 2025-10-19
- [x] Eligibility + pricing specs consolidated — Owner: Emmanuel Ngabire — Due: 2025-10-19

## A) Canonical Narrative

- **Positioning:** We scale verification power for organizations building equitable employment.
  Pricing adjusts to impact, not revenue size. This is category leadership (proof-driven hiring),
  not charity or generic SaaS discounts.
- **Moat:** ProofLayers™ (ID, credentials, skills, references, safety) paired with transparency
  reports and the donor-backed Verification Credit Fund.

## B) Nonprofit Operating Model

- **Eligibility (automated + auditable):** Active 501(c)(3) or 501(c)(4) via IRS/GuideStar match,
  plus proof of serving vulnerable/protected groups or a published safeguarding policy. Annual
  revalidation with a 60-day cure window.
- **Discount tiers (guardrailed):** N1 <50 FTE → 50%; N2 51–250 FTE → 35%; N3 251–1,000 FTE → 25%;
  N4 1,000+ FTE → custom ≤30% (higher only if co-funded). Compliance add-ons are cost pass-through,
  never zero-priced.
- **Sensitive data:** Customer must notify before ingesting minors, PHI, or immigration documents.
  Trigger Enhanced Data Handling Protocol (restricted access, encryption at rest/in transit, audit
  logs). Non-notification may suspend discount eligibility.
- **Payments & risk:** Net 45–60 for N1/N2; Net 30 for N3/N4. Auto-renew with cancellation window.
  Funding Contingency invokes Bridge Mode (90 days, read-only plus limited verifications).
- **Governance:** Ethical Use Board (3 external members) meets quarterly for 90 minutes; publishes
  anonymized decisions. DPO is escalation owner.
- **KPIs:** Impact ROI; Compliance cost; Impact Efficiency Index (IEI) =
  `(Verified placements × Social weighting) ÷ Discount amount` compared to a commercial control.
- **Legal checklist:** ADA Titles I/III; Sections 504/508; HIPAA/HITECH (optional BAA); GDPR parity;
  CCPA/CPRA; FERPA & COPPA when applicable; OMB 2 CFR 200; Section 889 attestations.

## C) Pricing System (Nonprofit-Aware)

- **Base plans:** Starter $149; Growth $699; Enterprise ≥$48k/yr.
- **Value metrics:** Base fee plus recruiter/admin seats, active job slots, talent reach units, and
  verification credits.
- **Nonprofit toggle:** Apply multipliers — N1=0.50, N2=0.65, N3=0.75, N4=0.70–0.90 (deal desk locks
  specific rate). Compliance add-ons stay at list price with ≤10% discount cap on bundles.
- **Nudges:** 70/85/95% utilization prompts commits or Scale Pack; route to Enterprise when seats
  >20, slots >50, or verifications >1,000/mo.

## D) EIN Eligibility Checker (Condensed Spec)

- **Endpoints:** `POST /eligibility/check` → `{status, tier, discount_pct, elig_id, revalidation_at}`;
  `POST /eligibility/attach`; `GET /eligibility/audit` (admin).
- **Data:** Hash EIN, store last four; maintain immutable decision log; enforce annual revalidation.
- **UI:** Org name + EIN input; states = Eligible, Review, Not found; show revalidation date.
- **Ops:** SLA auto decision <3s; manual review <2 business days; manual queue when fiscal sponsor
  or name mismatch occurs.
- **Security:** RBAC, rate limiting, privacy notice, no PII exposure beyond org name and EIN.

## E) Verification Credit Fund

- **Purpose:** Donors underwrite verification credits and qualified reach for eligible nonprofits.
- **Governance:** Ethical Use Board oversight; donors cannot access PII or influence hiring.
- **Reporting:** Quarterly anonymized dashboards (verifications, placements, 90/180-day retention,
  IEI).
- **Ledger object:** `CreditGrant { id, donor_id, pool_id, ngo_account_id|null,
  type:'verification'|'reach', amount, unit_value, issued_at, expires_at }`.
- **Accounting:** Treat as deferred revenue; recognize on consumption.
- **Minimums:** $25k entry; naming rights at $250k.

## F) Legal — Canonical Text (Highlights)

- **Nonprofit Terms Addendum:** Eligibility & annual revalidation; non-transferability; compliance
  add-ons not free; Fair Use plus human-in-the-loop; EDHP triggers and enforcement; ADA/508
  alignment; DPA referencing HIPAA/FERPA/COPPA/CCPA/GDPR; Funding Contingency & Bridge Mode; publicity
  consent; impact reporting if on Impact Commitment; termination for misuse; precedence clause.
- **Donor Agreement:** Purpose scope; use-of-funds limited to credits (no cash-out); quarterly
  anonymized reporting with IEI; Ethical Use Board governance; no donor PII access; publicity with
  consent; one-year auto-renew, 30-day termination; SOC 2 posture note; tax disclaimer; capped
  liability; Delaware law.

## G) Public-Facing Nonprofit Page Copy

- **Title:** Proofoffit Impact Access — Verification priced for impact.
- **Hero:** Nonprofits get mission-aligned pricing and built-in safeguarding so you can place people
  faster, safer, and fairly.
- **Trust strip:** SOC 2 • DPA • SSO/SCIM • ADA/508 • HIPAA/FERPA/COPPA • GDPR/CCPA.
- **Who qualifies:** 501(c)(3)/(c)(4) plus service to vulnerable groups or published safeguarding
  policy. Eligibility verified automatically; revalidated annually.
- **What you get:** Up to 50% off by tier; Enhanced Data Handling for sensitive data; optional HIPAA
  BAA, FERPA/COPPA support, residency packs, security portal.
- **How pricing works:** Transparent base + seats + usage (verifications/reach). Compliance add-ons
  are cost-based, never zero-priced. Annual prepay and multi-year price protection available.
- **Impact Commitment (optional):** Share anonymized outcomes to lock multi-year pricing; results
  appear in the annual Impact Transparency Report.
- **CTA:** Check eligibility (EIN lookup) • Talk to us.

## H) Execution Blueprint (30/60/90)

- **0–30 days (MVP):** Launch nonprofit page and eligibility widget; add nonprofit toggle in
  calculator; attach Nonprofit Addendum in orders; spin up Fund ledger; publish CS macros and
  internal FAQ.
- **31–60 days (Scale):** Build Fund allocation UI and dashboards; automate revalidation workflow;
  publish accessibility statement and SOC 2 summary; A/B test nonprofit pricing/CTA.
- **61–90 days (Moat):** Release first Transparency Report (v0.1); seat Ethics Board; publish
  competitive narrative deck.

## H1) Proofoffit Nonprofit & Pricing Implementation Board

| Epic | Folder(s) | Purpose |
|---|---|---|
| E1. Eligibility & Pricing System | apps/web, infra/supabase | Build EIN checker, nonprofit calculator logic, pricing tiers, CRM hooks. |
| E2. UI & Accessibility | packages/ui, apps/web | Create eligibility widget, calculator cards, accessibility compliance, responsive design. |
| E3. Legal & Security Compliance | legal/, security/ | Finalize Nonprofit Addendum, Donor Agreement, EDHP triggers, SOC 2/DPIA updates. |
| E4. Infra & Automation | infra/supabase, scripts/ | Database migrations, RLS policies, scheduled revalidation jobs, discount automation. |
| E5. GTM & Verification Fund | gtm/ | Donor one-pager, pooled credit ledger, marketing copy, transparency reports. |
| E6. RevOps & Ops Integration | scripts/, apps/web/api, CRM | Billing logic, revalidation workflows, discount guardrails, CS macros. |
| E7. Comms & Public Launch | apps/web, gtm/ | Nonprofit landing page, PR/blog, press assets, site-level CTAs. |

## H2) Sprint Breakdown (30/60/90)

### Sprint 1 — Foundation (Day 0–30)

- **Product/Eng:** Implement `POST /eligibility/check`, `/attach`, `/audit` in
  `apps/web/api/eligibility`.
- **Infra:** Create `eligibility_checks` table and triggers in `infra/supabase/migrations`.
- **UI:** Add “Check Eligibility” card to pricing page at `apps/web/app/(pricing)/page.tsx`.
- **Legal:** Finalize and publish Nonprofit Addendum & Donor Agreement under `legal/`.
- **Marketing:** Draft nonprofit landing page in `apps/web/app/(nonprofit)/page.tsx`.
- **Ops:** Hook eligibility status into billing plan creation flow in `apps/web/api/billing`.
- **QA:** Add Playwright coverage for eligibility flow (latency assertion <3s) in
  `apps/web/tests/eligibility.spec.ts`.
- **Acceptance metrics:** API latency <3s; EIN auto verification success rate >90%; Accessibility
  audit AA pass.

### Sprint 2 — Scale & Governance (Day 31–60)

- **Infra:** Automate annual revalidation via Supabase cron (stored proc in
  `infra/supabase/functions/revalidate.sql`) or scheduled GitHub Action in `.github/workflows/`.
- **RevOps:** Send T-60/T-15 revalidation alerts via email service and in-app banner in
  `apps/web/app/(dashboard)/notifications`.
- **UI:** Add nonprofit toggle + tier multipliers to pricing calculator component in
  `apps/web/app/(pricing)/components/calculator.tsx`.
- **Security:** Implement EDHP toggle and audit logging in admin console at
  `apps/web/app/(admin)/settings/data-protection.tsx`.
- **GTM:** Launch donor portal assets and Verification Credit Fund ledger (tables in
  `infra/supabase/tables/fund_grants.sql`; collateral in `gtm/verification-fund.md`).
- **Legal:** Update SOC 2 + DPIA documentation (`security/`), publish accessibility statement in
  `legal/accessibility-statement.md`.
- **Marketing:** Run CTA placement A/B test on pricing page via `apps/web/app/(pricing)/experiments`.
- **Analytics:** Stand up discount leakage vs margin floors dashboard using Supabase view
  `infra/supabase/views/nonprofit_margin.sql`.
- **Acceptance metrics:** Revalidation workflow active; 100% add-ons priced separately; accessibility
  statement live.

### Sprint 3 — Trust & Moat (Day 61–90)

- **GTM:** Publish Impact Transparency Report v0.1 sourced from Supabase analytics view
  `infra/supabase/views/impact_transparency.sql`.
- **Security:** Upload Ethics Board charter to `security/policies/ethics_board.md`.
- **Design:** Deliver accessibility polish + localization (5 languages) in `packages/ui`.
- **Ops:** Auto-attach Nonprofit Addendum via billing pipeline script in `scripts/apply_addendum.ts`.
- **Marketing:** Ship press release and donor outreach sequence in `gtm/comms/nonprofit-launch.md`.
- **Legal:** Enforce Bridge Mode logic through terms update `legal/nonprofit-addendum.md`.
- **Analytics:** Launch KPI dashboard (IEI, donor coverage %, nonprofit NRR) in Looker referencing
  Supabase view `infra/supabase/views/nonprofit_kpis.sql`.
- **Acceptance metrics:** Transparency report live; KPI dashboard populated; three external Ethics
  Board seats confirmed.

## I) RACI Overview

| Workstream | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| Product (apps/web) | Eligibility APIs, calculator logic, feature flags | Product Lead | Design, RevOps | Execs |
| Infra (supabase, scripts) | Migrations, cron jobs, audit logs | Infra Lead | Security, Product | Execs |
| Design (packages/ui) | Eligibility widget, calculator UX, accessibility | Design Lead | Product | CS |
| Legal (legal/) | Addendum, Donor Agreement, compliance alignment | GC | Security, RevOps | Execs |
| Security (security/) | SOC 2, DPIA, EDHP implementation | Security Lead | Legal, Infra | Execs |
| GTM (gtm/) | Fund narrative, reporting, marketing copy | GTM Lead | Marketing, Product | Execs |
| RevOps (scripts/, billing) | Discount guardrails, CRM integration, renewals | RevOps Lead | Product, CS | Finance |
| CS/Support | Eligibility macros, Bridge Mode protocol | CS Lead | RevOps | Product |
| Marketing (apps/web, gtm/) | Public pages, PR/blog, donor comms | Marketing Lead | GTM, Design | Execs |

## J) Acceptance & Guardrails

- **QA:** Eligibility result <3s; calculator applies tier multipliers; revalidation alerts at T-60/T-15;
  Fund credits offset variable charges exactly.
- **Analytics:** Track Nonprofit MRR/NRR by tier; margin after discounts; IEI trend; donor coverage %.
- **Risk controls:** Provider abstraction for IRS/GuideStar; manual queue for edge cases; donor
  agreement forbids influence; discount floor alerts; accessibility defects are P1 for nonprofit
  flows.

## K) Reporting & Analytics Alignment

| Dashboard | Source | Metrics |
|---|---|---|
| Nonprofit Impact Dashboard | Supabase views (`infra/supabase/views/impact_transparency.sql`) | IEI, verified placements, donor coverage % |
| RevOps Margin Tracker | Billing logs + `scripts/margin_guardrail.ts` | Gross margin post-discount, leakage alerts |
| Security Audit Dashboard | Logflare / Vercel Analytics | EDHP activations, compliance incidents |
| Accessibility QA Board | Storybook + Lighthouse CI | WCAG scores per component |


## Assumptions & Follow-ups

- Finance/RevOps to lock N4 multiplier bands and confirm IEI social weighting by 2025-10-21.
- Security to finalize Enhanced Data Handling Protocol checklist for minors/PHI ingestion.
- Legal to deliver draft Nonprofit Addendum and Donor Agreement redlines by 2025-10-23.
