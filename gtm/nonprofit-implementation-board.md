# Nonprofit & Pricing Implementation Board — ProofOfFit

## Epic Topology (mapped to repo)

| Epic | Folder(s) | Lead | Notes |
|---|---|---|---|
| E1. Eligibility & Pricing System | apps/web/app/api, infra/supabase | Product | EIN checker, calculator engines, CRM hooks |
| E2. UI & Accessibility | apps/web/app, packages/ui | Design | Widgets, responsive layouts, WCAG compliance |
| E3. Legal & Security Compliance | legal/, security/ | Legal | Addenda, EDHP, SOC 2 & DPIA updates |
| E4. Infra & Automation | infra/supabase, scripts/ | Infra | Migrations, cron, RLS, automation |
| E5. GTM & Verification Fund | gtm/ | GTM | Donor collateral, transparency reporting |
| E6. RevOps & Ops Integration | scripts/, apps/web/src, CRM | RevOps | Billing logic, revalidation workflows |
| E7. Comms & Public Launch | apps/web/app, gtm/ | Marketing | Landing page, PR, outreach assets |

## Sprint 1 — Foundation (Day 0–30)

- [ ] `apps/web/app/api/eligibility/check/route.ts` — Implement EIN eligibility check handler  
  Owner: Product/Eng — Due: 2025-10-30
- [ ] `apps/web/app/api/eligibility/attach/route.ts` — Attach eligibility to accounts  
  Owner: Product/Eng — Due: 2025-10-30
- [ ] `apps/web/app/api/eligibility/audit/route.ts` — Admin audit log endpoint  
  Owner: Product/Eng — Due: 2025-10-30
- [x] `infra/supabase/migrations/2025101901_create_eligibility_checks.sql` — Table + triggers  
  Owner: Infra — Due: 2025-10-24
- [x] `apps/web/app/pricing/page.tsx` — Insert “Check Eligibility” CTA card + modal  
  Owner: Design — Due: 2025-10-26
- [x] `legal/nonprofit-addendum.md` & `legal/donor-agreement.md` — Finalize publish-ready drafts  
  Owner: Legal — Due: 2025-10-27
- [x] `apps/web/app/nonprofit/page.tsx` — Draft landing page with copy + CTA  
  Owner: Marketing — Due: 2025-10-28
- [x] `apps/web/src/components/billing/plan-hooks.ts` — Apply eligibility status to plan creation  
  Owner: RevOps — Due: 2025-10-29
- [x] `apps/web/src/test/e2e/eligibility.spec.ts` — Playwright flow with <3s SLA assertion  
  Owner: QA — Due: 2025-10-30

Acceptance: API p95 latency <3s; EIN auto verification >90%; WCAG AA smoke pass.

## Sprint 2 — Scale & Governance (Day 31–60)

- [x] `infra/supabase/functions/revalidate.sql` — Stored proc + Supabase cron schedule  
  Owner: Infra — Due: 2025-11-20
- [ ] `.github/workflows/nonprofit-revalidation.yml` — Backstop scheduled job  
  Owner: Infra — Due: 2025-11-20
- [x] `apps/web/src/components/notifications/revalidation-banner.tsx` — T-60/T-15 alerts  
  Owner: RevOps — Due: 2025-11-18
- [x] `apps/web/app/pricing/components/nonprofit-toggle.tsx` — Tier multipliers in calculator  
  Owner: Product/Eng — Due: 2025-11-15
- [ ] `apps/web/app/admin/data-protection/page.tsx` — EDHP toggle, audit log UI  
  Owner: Security — Due: 2025-11-22
- [x] `infra/supabase/tables/fund_grants.sql` & `gtm/verification-fund.md` — Fund ledger + collateral  
  Owner: GTM — Due: 2025-11-25
- [x] `legal/accessibility-statement.md` & `security/DPIA-nonprofit.md` — Compliance updates  
  Owner: Legal/Security — Due: 2025-11-27
- [ ] `apps/web/app/pricing/experiments/nonprofit-cta.ts` — CTA A/B test harness  
  Owner: Marketing — Due: 2025-11-18
- [x] `infra/supabase/views/nonprofit_margin.sql` — Discount leakage dashboard view  
  Owner: Analytics — Due: 2025-11-28

Acceptance: Revalidation auto-run live; compliance add-ons priced separately 100%; accessibility
statement published.

## Sprint 3 — Trust & Moat (Day 61–90)

- [x] `infra/supabase/views/impact_transparency.sql` — Feed for transparency report  
  Owner: Analytics — Due: 2025-12-20
- [x] `gtm/reports/impact-transparency-v0-1.md` — Publish v0.1 report  
  Owner: GTM — Due: 2025-12-22
- [x] `security/policies/ethics_board.md` — Charter + roster (3 external seats)  
  Owner: Security — Due: 2025-12-15
- [ ] `packages/ui/i18n/nonprofit.json` — Localization pack (5 languages)  
  Owner: Design — Due: 2025-12-18
- [x] `scripts/apply_addendum.ts` — Auto-attach Nonprofit Addendum in billing pipeline  
  Owner: RevOps — Due: 2025-12-19
- [x] `gtm/comms/nonprofit-launch.md` — Press + donor outreach plan  
  Owner: Marketing — Due: 2025-12-10
- [ ] `legal/nonprofit-addendum.md` — Bridge Mode clauses enforced (rev B)  
  Owner: Legal — Due: 2025-12-05
- [x] `infra/supabase/views/nonprofit_kpis.sql` — IEI, donor coverage, NRR metrics  
  Owner: Analytics — Due: 2025-12-23
- [x] `scripts/margin_guardrail.ts` — Alerting on discount floor breaches  
  Owner: RevOps — Due: 2025-12-23

Acceptance: Transparency report live; KPI dashboard populated; Ethics Board seats confirmed.
