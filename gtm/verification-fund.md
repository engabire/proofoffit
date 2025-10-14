# Verification Credit Fund — ProofOfFit

- [x] Purpose & guardrails aligned — Owner: Emmanuel Ngabire — Due: 2025-10-19
- [x] Ledger schema defined — Owner: Emmanuel Ngabire — Due: 2025-10-19
- [x] Reporting cadence scoped — Owner: Emmanuel Ngabire — Due: 2025-10-19

## Purpose

- Donors underwrite verification credits and qualified reach for eligible nonprofits.
- Funds reduce marginal unit cost while preserving cost transparency and governance.
- Minimum entry $25k; naming rights at $250k.

## Governance

- Oversight by the Ethical Use Board (3 external members); donors have no hiring influence.
- No donor access to PII; reporting is anonymized and aggregated.
- Verification Credit Fund policies follow SOC 2 controls and EDHP requirements.

## Reporting & Transparency

- Quarterly dashboards summarizing verifications funded, placements, 90/180-day retention, and
  Impact Efficiency Index (IEI).
- Donors receive anonymized narratives tied to funded initiatives; all nonprofits appear in the
  annual Impact Transparency_Report.
- Metrics source: Supabase views (`infra/supabase/views/impact_transparency.sql`,
  `infra/supabase/views/nonprofit_kpis.sql`).

## Ledger Specification

```sql
CreditGrant {
  id uuid primary key,
  donor_id uuid references donors(id),
  pool_id uuid references credit_pools(id),
  ngo_account_id uuid null references organizations(id),
  type text check (type in ('verification', 'reach')),
  amount integer not null,
  unit_value numeric(10,2) not null,
  issued_at timestamptz not null default now(),
  expires_at timestamptz null,
  consumed_amount integer not null default 0
}
```

- Ledger lives in `infra/supabase/tables/fund_grants.sql`; consumption tracked via triggers logging
  into audit events.
- Accounting treated as deferred revenue; recognition triggered on consumption.

## Activation Checklist

- [ ] Migrate fund tables and grant ledger in Supabase.
- [ ] Instrument donor intake form with credit grant workflow.
- [ ] Connect calculator + billing pipelines to apply fund-backed credits before discounts.
- [ ] Publish donor FAQ and align with Legal/Finance for tax disclaimers.

## Dependencies

- Ethics Board charter (`security/policies/ethics_board.md`)
- Nonprofit Terms Addendum (`legal/nonprofit-addendum.md`)
- Donor Agreement (`legal/donor-agreement.md`)
- KPI dashboards (`infra/supabase/views/nonprofit_kpis.sql`)
