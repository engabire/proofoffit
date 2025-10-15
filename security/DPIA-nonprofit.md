# Data Protection Impact Assessment — Nonprofit Pricing

Version: v0.1 (2025-10-19)
Owner: Security & Privacy

## 1. Overview

- Scope covers nonprofit eligibility ingestion, Enhanced Data Handling Protocol (EDHP), Verification
  Credit Fund ledger, and donor reporting.
- Objective: ensure processing activities protect vulnerable populations, maintain compliance, and
  uphold ProofOfFit’s SOC 2 and GDPR commitments.

## 2. Data Flows

| Process | Data Elements | Storage | Notes |
|---|---|---|---|
| EIN eligibility check | Org name, EIN (hashed + last four), safeguarding attestations | Supabase `eligibility_checks` | Hashing via SHA256; last four stored for audit |
| EDHP activation | Dataset classification (minors, PHI, immigration), approver IDs | Supabase `edhp_events` (planned) | Access restricted to Security + DPO |
| Verification Credit Fund | Donor ID, grant amount, NGO account reference | Supabase `fund_grants` | No candidate PII stored |
| Impact reporting | Aggregated verification counts, retention metrics | Supabase views (`impact_transparency`, `nonprofit_kpis`) | Outputs anonymized |

## 3. Risk Assessment

- **Eligibility false positives:** Mitigated via IRS/GuideStar API validation and manual review queue.
- **Sensitive data ingestion without EDHP:** Mitigated by intake attestation and automated flags when
  certain verification templates selected.
- **Donor influence risk:** Governance ensures donors cannot view or select individual candidates.
- **Data breaches:** Encryption at rest/in-transit, role-based access, and audit logs enforced.

Residual risk is low when EDHP triggers, monitoring, and training are in place.

## 4. Controls & Mitigations

- Access control: RBAC with principle of least privilege; Security reviews quarterly.
- Audit logging: Supabase triggers emit events to `audit_events`; Logflare ingests for monitoring.
- Incident response: Nonprofit scenarios integrated into `security/runbooks/incident-checklist.md`.
- Data minimization: Eligibility stores hashed EIN plus last four only; donor reports aggregated.

## 5. Data Subject Rights

- Nonprofits may request eligibility logs and corrections via `privacy@proofoffit.com`.
- Candidate data rights remain governed by core Privacy Policy; EDHP ensures separate handling when
  minors/PHI involved.

## 6. Review & Approvals

- Prepared by Security & Privacy team.
- Reviewed by DPO, Legal, and Ethical Use Board representative.
- Next review scheduled post Sprint 2 (target 2025-11-25) or upon material change.
