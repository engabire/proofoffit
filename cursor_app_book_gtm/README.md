# Cursor App Book — GTM Launch Hub

This folder turns your repo into a **launch command center** inside Cursor.

## Install (2 minutes)
1. **Extract** this ZIP at the *root* of your repository (so you see `.cursor/`, `.vscode/`, and `gtm/` at the top level).
2. Open the folder in **Cursor**.
3. When prompted, **accept the recommended extensions** (Tailwind CSS IntelliSense and REST Client).
4. In Cursor → **Settings → Rules**, confirm it picked up:
   - `.cursor/rules/gtm.mdc` (Project Rule)
   - `AGENTS.md` (Agent definitions)
5. Reload the window (Command Palette → **Developer: Reload Window**).

## Use
- Open `gtm/README.md` — it’s your home base.
- In Composer/Chat, say: `Use the GTM Launch Agent from AGENTS.md and help me fill the launch checklist.`
- Edit any `gtm/*.md` file — the rules will bias the AI to keep the GTM format consistent.

---

### What’s inside
- `AGENTS.md` — defines a **GTM Launch Agent** with instructions, constraints, and outputs.
- `.cursor/rules/gtm.mdc` — project rule to keep style and structure consistent for files in `/gtm`.
- `.vscode/extensions.json` — safe recommendations for a modern web stack.
- `/gtm` — your GTM playbook in Markdown (checklists, runbook, content BOM, pricing guardrails, RACI, metrics, calendar).

