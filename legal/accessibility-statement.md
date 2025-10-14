# Accessibility Statement — ProofOfFit Impact Access

Effective: 2025-10-19  
Owner: Legal & Design

## Commitment

ProofOfFit is committed to delivering nonprofit experiences that meet or exceed WCAG 2.1 AA
guidelines. Accessibility is a launch blocker for Impact Access: eligibility flows, pricing
calculator, Verification Credit Fund portal, and associated communications.

## Scope

- `apps/web/app/pricing` (including nonprofit toggle and calculator)
- `apps/web/app/nonprofit`
- Eligibility widgets and admin EDHP controls
- Donor and transparency reporting surfaces

## Standards & Testing

- WCAG 2.1 AA baseline; AAA for critical input controls where practical.
- ADA Titles I/III alignment; Section 504/508 compliance for public sector partners.
- Automated Lighthouse/axe scans on every CI run; quarterly manual audits with assistive technology
  (screen readers, keyboard-only navigation).

## Feedback & Escalation

- Accessibility issues are tracked as P1 for nonprofit flows. Users can report barriers via
  `accessibility@proofoffit.com` or in-app support.
- Escalation path: Support → Design Accessibility Lead → Legal → Release manager.

## Continuous Improvement

- Localization in five languages by Sprint 3 (see `packages/ui/i18n/nonprofit.json`).
- Contrast testing, ARIA labeling, and focus states are reviewed each release.
- Accessibility statement reviewed bi-annually or upon major feature addition.
