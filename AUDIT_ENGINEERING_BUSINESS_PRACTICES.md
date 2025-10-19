# Engineering & Business Practices Audit — ProofOfFit

## Engineering
- [x] Automate quality gates before builds (Owner: Emmanuel Ngabire, Due: 2025-10-18)  
  `turbo.json` now requires `lint` ahead of every `build`, and `npm run ci` chains lint → test → build.
- [ ] Expand runtime observability (Owner: TBD, Due: 2025-11-01)  
  Add structured logging + tracing baseline for core flows (recommend OpenTelemetry via Next.js instrumentation).
- [ ] Focus-time guardrails (Owner: TBD, Due: 2025-10-28)  
  Adopt agreed review SLAs + meeting-free blocks; document in `MAKER_TIME_GUIDELINES.md`.
- [x] Document key decisions succinctly (Owner: Emmanuel Ngabire, Due: 2025-10-18)  
  This audit file consolidates current state, gaps, and owners for follow-up.
- [x] Maintain security hygiene (Owner: Emmanuel Ngabire, Due: 2025-10-18)  
  Dependencies patched (cheerio/esbuild/path-to-regexp/undici) and `npm audit` now reports 0 issues.

## Business
- [ ] Metrics → roadmap feedback loop (Owner: TBD, Due: 2025-10-30)  
  Wire `gtm/metrics.md` targets into planning cadence; add owner + dashboard link.
- [ ] ROI-based prioritisation rubric (Owner: TBD, Due: 2025-11-05)  
  Add lightweight scoring model to backlog grooming notes.
- [ ] GTM + release alignment (Owner: TBD, Due: 2025-10-27)  
  Cross-check launch calendar with engineering sprints; ensure shared single source in `gtm/calendar.md`.
- [ ] CAC & retention reporting (Owner: TBD, Due: 2025-11-07)  
  Capture baseline CAC, payback, retention cohorts; flag (TBD) data sources.
- [ ] Compliance & trust signals in comms (Owner: TBD, Due: 2025-10-31)  
  Integrate security/privacy badges into marketing assets; update `gtm/comms` with checklist.
