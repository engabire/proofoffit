# Proofoffit Nonprofit & Pricing Blueprint — Ready-to-Implement Kit

**Purpose:** Consolidate nonprofit program, pricing system, EIN eligibility checker, Verification
Credit Fund, legal templates, GTM playbooks, analytics, and launch materials so Product, RevOps,
Legal, CS, and Marketing can execute without reinterpretation.

---

## 0) Quick Start — What to Ship in 30/60/90 Days

### Day 0–30 (MVP)
- Publish nonprofit landing page (eligibility CTA, program overview, FAQ).
- Launch EIN Eligibility Checker (US only) and nonprofit toggle in calculator.
- Attach Nonprofit Terms Addendum in order flows.
- Stand up Verification Credit Fund ledger and donor one-pager.
- Ship CS macros + internal nonprofit FAQ.

### Day 31–60 (Scale)
- Add Fund grant allocation UI + dashboards.
- Activate revalidation workflow (T‑60/T‑15 notices) and CRM tasks.
- Release accessibility statement + SOC 2 security summary page.
- Launch A/B tests on pricing cards and nonprofit CTA placement.

### Day 61–90 (Trust & Moat)
- Publish first Impact Transparency Report (quarterly v0.1).
- Seat Ethical Use Board; hold first 90-minute review.
- Release competitive narrative deck + companion site section.

---

## 1) Architecture Map (At a Glance)

EIN + org name → Eligibility API → Tier (N1–N4) → Discount multipliers → Pricing Calculator → Order &
Billing → CRM + Revalidation → Impact Reporting.

Parallel track: Verification Credit Fund → Grants ledger → Applied as variable-unit credits → Usage &
outcomes dashboards.

---

## 2) Nonprofit Program — Operating Model

### Eligibility (Automated + Auditable)
- Sources: IRS Exempt Organizations DB, GuideStar.
- Criteria: 501(c)(3)/(c)(4) + serves vulnerable/protected groups **or** published safeguarding policy.
- Revalidation: annual with 60-day cure.

### Discount Tiers (Configurable Guardrails)
- N1 <50 FTE → **50%** off.
- N2 51–250 FTE → **35%** off.
- N3 251–1,000 FTE → **25%** off.
- N4 1,000+ FTE → enterprise custom, ≤**30%** unless co-funded.

### Compliance Add-ons (Never Zero-Priced)
- HIPAA BAA, data residency, private networking, security portal; 0–10% discount cap in bundles.

### Bridge Mode (Funding Lapse)
- 90 days; read-only + restricted verifications; prior balances remain due.

### Governance
- Ethical Use Board (3 external members); anonymized quarterly notes.
- Enhanced Data Handling Protocol (EDHP) for minors/PHI/immigration docs.

---

## 3) Pricing System — Nonprofit-Aware Calculator Rules

- **Base plans:** Starter $149, Growth $699, Enterprise ≥$48k/yr.
- **Value metrics:** base fee + recruiter/admin seats + active job slots + talent reach units +
  verification credits.
- **Nonprofit toggle:** apply N-tier multipliers to base + unit rates; add-ons stay at list price with
  tooltips.
- **Threshold nudges:** 70/85/95% of included units → suggest commit or Scale Pack.
- **Enterprise routing:** seats >20 or slots >50 or verifications >1,000/mo.

---

## 4) EIN Eligibility Checker — Build Spec (Condensed)

- **Endpoints:** `POST /eligibility/check` → `{status, tier, discount_pct, elig_id, revalidation_at}`;
  `POST /eligibility/attach`; `GET /eligibility/audit` (admin export).
- **Data:** hash EIN, store last four; immutable decision log; `revalidation_at = created_at + 12
  months`.
- **UI:** Org name, EIN input; result states = Eligible / Review / Not found.
- **Ops:** auto decision SLA <3s; manual review SLA <2 business days.

---

## 5) Verification Credit Fund — Donor & Ops

- **Promise:** Donors underwrite verifications & qualified reach; outcomes anonymized, auditable, and
  published quarterly.
- **Ledger:** `CreditGrant { id, donor_id, pool_id, ngo_account_id|null, type:'verification'|'reach',
  amount, unit_value, issued_at, expires_at }`.
- **Allocation:** prioritize high IEI, monthly caps, 3-month rollover then return to pool.
- **Accounting:** deferred revenue recognized on consumption.

---

## 6) Legal — Templates & Checklists

### 6.1 Nonprofit Terms Addendum (Summary)
- Eligibility + annual revalidation.
- Program pricing is non-transferable.
- Compliance add-ons never free.
- Fair Use + human-in-the-loop requirements.
- EDHP activation for sensitive data.
- ADA/508 alignment; DPA; HIPAA/FERPA/COPPA/CCPA/GDPR references.
- Funding contingency & Bridge Mode.
- Publicity consent + impact reporting.
- Termination for misuse; order-of-precedence clause.

### 6.2 Donor Agreement Template (Summary)
- Purpose: donor funds underwrite credits; no hiring influence.
- Quarterly anonymized dashboards with IEI.
- Ethics Board oversight; no donor access to PII.
- One-year term, auto-renew; 30-day termination; unused credits revert to Fund.
- SOC 2 posture note; capped liability ($25k or 12-month contribution).
- Governing law: Delaware; tax disclaimer.
- **Counsel checklist:** charitable contribution routing, export control, AML/KYC.

---

## 7) Internal Nonprofit Playbook — Sales, CS, RevOps

- **Qualification:** 501(c)(3)/(c)(4) + vulnerable groups **or** safeguarding policy.
- **Discovery prompts:** recruiters/roles, minors/PHI/immigration docs, ATS/SSO/residency needs,
  budget cadence.
- **Mapping guidance:** predictable + multi-team + SSO → Growth Annual; regulated/security review →
  Enterprise + add-ons; uncertain usage → Starter with 70% usage upsell.
- **Give-to-Get:** 12–24 month term (+5–12%), annual prepay (+5–8%), case study (+5%), multi-workspace
  (+5–10%). Add-ons never free; bundle discounts ≤10%.
- **CS macros:** eligibility verified, revalidation T‑60, funding lapse/Bridge Mode.
- **Escalation RACI:** DPO/legal (EDHP), Security (incidents), RevOps (discount guardrails), PM
  (accessibility blockers).

---

## 8) Competitive Narrative Deck — Outline

1. Outcomes over impressions: category shift.
2. ProofLayers™ stack: ID, credentials, skills, references, safety.
3. Unit economics: pay for proofs; CPQA drops as usage scales.
4. Compliance posture: residency, SOC 2, ADA/508, BAA/FERPA/COPPA.
5. Nonprofit program: mission-aligned pricing, EIN automation, donor-funded credits.
6. Moat: transparency reports, funder ecosystem, Ethics Board.
7. Case studies (anonymized): placement lift, bias reduction.
8. Roadmap: AI-assisted screening with human-in-the-loop guardrails.

---

## 9) Launch Communications Kit

- **Press template:** “ProofOfFit Launches Impact Access…”; highlight EIN eligibility, donor-backed
  credits, compliance.
- **Blog outline:** cost of proof; math behind nonprofit discount; safeguarding & accessibility by
  default; transparency cadence.
- **Email flows:** nonprofit invite (eligibility check + starter discount); donor outreach (one-pager +
  co-funding call); existing customers (refer a nonprofit → grant credits).

---

## 10) Financial Model — Spreadsheet Spec

- Tabs: Inputs, Pricing (Starter/Growth), Nonprofit Tiers, Unit Costs, Add-ons, Fund Grants,
  Forecast, Sensitivity.
- Inputs: nonprofit mix %, seats/slots/units by tier, discount %, unit cost, CS hours, grant inflow.
- Outputs: ARPA by tier, gross margin post-discount, IEI, donor coverage %, runway impact.

---

## 11) DPIA & SOC 2 Mapping — Checklist

- **DPIA:** purpose/necessity, data categories & lawful bases, risks (re-identification, bias,
  access), mitigations (EDHP, encryption, audit logs, retention), residual risk & sign-off.
- **SOC 2 controls:** CC6.1 RBAC for eligibility data; CC7.2 grant anomaly monitoring; A1.2 change
  management for pricing logic; A1.4 key management for EIN hashes.

---

## 12) Design & Accessibility — Implementation Notes

- Eligibility response <3s; accessible error states; keyboard navigable.
- Calculator: live totals, nonprofit toggle, tooltips, auto-route to Enterprise at thresholds.
- WCAG 2.2 AA contrast; ARIA labels; visible focus states.
- Design tokens: spacing 4/8/12/16/24; border radius 16px; typography Inter (14/16/20/24/32);
  success/amber/error neutrals with AA contrast.

---

## 13) Analytics & Dashboards

- **Executive:** nonprofit MRR, NRR by tier, margin after discounts, IEI trend, donor coverage %.
- **Product:** eligibility auto-pass %, decision time, A/B outcomes, nonprofit CTA conversion lift.
- **CS:** revalidation completion rate, Bridge Mode counts, incident SLAs.
- **RevOps:** discount leakage vs floors, add-on attach rate.

---

## 14) Risk Register & Mitigations

- **Data source drift (IRS/GuideStar):** provider abstraction + monitoring.
- **Abuse (fake NGOs/fiscal sponsors):** manual review flag + document upload workflow.
- **Donor influence concerns:** strict donor agreement + Ethics Board notes.
- **Margin erosion:** floor pricing alerts + add-on non-discount policy.
- **Accessibility regressions:** pre-release audits; nonprofit-flow bugs default to P1.

---

## 15) RACI — Who Does What

- **Product/Eng:** eligibility APIs, calculator logic, Fund ledger, dashboards.
- **Design:** UI mocks, tokens, accessibility pass.
- **Legal:** addendum, Donor Agreement, DPAs/BAA/FERPA/COPPA riders.
- **RevOps:** CRM fields, billing rules, revalidation tasks, discount floors.
- **CS:** macros, onboarding guides, Bridge Mode.
- **Security/Privacy:** EDHP, SOC 2 mapping, DPIA.
- **Marketing/Comms:** site pages, PR/blog, email campaigns, transparency reports.

---

### Final Checklist (copy/paste into Asana/Jira)

- [ ] Ship nonprofit landing page + eligibility widget.
- [ ] Enable nonprofit toggle in calculator.
- [ ] Wire discount tiers + guardrails in billing.
- [ ] Attach Nonprofit Addendum in orders.
- [ ] Stand up Fund ledger + donor one-pager.
- [ ] Create dashboards + KPI monitoring.
- [ ] Publish accessibility + security summary.
- [ ] Launch communications kit.
- [ ] Schedule Ethics Board + first transparency report.
