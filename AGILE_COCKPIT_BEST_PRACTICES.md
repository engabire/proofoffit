# 🚀 Agile Cockpit Best Practices Implementation

## 📋 **1. Keep WIP Tiny**

### Why: Flow beats thrash.

### How: 
- **Cap at 3-8 items** per workstream in "This Sprint" + "In Progress"
- **If you add one, finish or drop one**
- Use automation script: `./scripts/agile-cockpit-automation.sh check-wip`

### Implementation:
```bash
# Check current WIP status
./scripts/agile-cockpit-automation.sh check-wip

# Generate WIP report
./scripts/agile-cockpit-automation.sh report
```

---

## 🔧 **2. Make Work Atomic**

### Why: Small things finish; big things stall.

### How:
- **Issues fit in ≤2 days**
- **If not, split them**
- **Title = verb + outcome**
- **Add clear acceptance criteria**

### Implementation:
- Use issue templates with acceptance criteria
- Set effort labels: `small` (≤2 days), `medium` (3-5 days), `large` (>5 days)
- Split large items into smaller, actionable tasks

---

## 🎯 **3. One Sprint, One Goal**

### Why: Focus compounds.

### How:
- **Put a one-line Sprint Goal** at the top of your retro note
- **Every sprint item should serve it**

### Implementation:
Create `SPRINT_GOALS.md` with current sprint goal and track alignment.

---

## ✅ **4. Definition of Done (DoD)**

### Why: "Done" isn't a vibe; it's a checklist.

### How: For code:
- [ ] **Merged** to main branch
- [ ] **Deployed** to production
- [ ] **Docs updated**
- [ ] **Telemetry on**
- [ ] **User-visible check passed**

### Implementation:
- DoD checklist in all issue templates
- Automated checks in CI/CD pipeline
- Manual verification checklist

---

## 🚨 **5. Ruthless "Blocked" Policy**

### Why: Blockers are interest-bearing debt.

### How:
- **Stage = Blocked gets a 24-hour SLA**
- **If not unblocked, de-scope or change the plan**

### Implementation:
```bash
# Check for blocked items
./scripts/agile-cockpit-automation.sh check-blocked
```

---

## 📅 **6. Weekly Cadence, Daily Pulse**

### Why: Short feedback loops > heroic pushes.

### How:
- **Weekly Sprint**
- **Daily 3-liner** (yesterday / today / blockers) in `RETRO.md`

### Implementation:
- Weekly sprint planning sessions
- Daily standup format in `RETRO.md`
- Automated sprint reports

---

## 🎯 **7. Single Source of Truth**

### Why: If everything is everywhere, nothing is anywhere.

### How:
- **All work = GitHub Issues**
- **The Cockpit is the only planning surface**
- **No side todo apps**

### Implementation:
- All work tracked in Agile Cockpit
- Automation scripts to sync with GitHub Issues
- No external project management tools

---

## 📊 **8. Prioritize by Value, Not Noise**

### Why: Busy ≠ valuable.

### How:
- **Use ICE score** (Impact × Confidence × Ease) in issue body
- **Pick the top few**

### Implementation:
- ICE scoring in all issue templates
- Automated prioritization based on scores
- Regular backlog prioritization reviews

---

## 🌿 **9. Trunk-Based with Small PRs**

### Why: Fast integration, fewer merge wars.

### How:
- **Short branches**
- **Feature flags for unfinished work**
- **PRs under ~300 lines**
- **Auto-link to issues**

### Implementation:
- Branch protection rules
- PR size limits
- Feature flag system
- Auto-linking PRs to issues

---

## 🤖 **10. Automation Over Willpower**

### Why: Habit breaks; robots don't.

### How:
- **Auto-add new issues to the Cockpit**
- **Pre-commit hooks** (lint/test)
- **CI that blocks failing PRs**
- **Deploy previews on PR**

### Implementation:
```bash
# Auto-add issues to project
./scripts/agile-cockpit-automation.sh add-issue <issue_url>

# Create new issues with templates
./scripts/agile-cockpit-automation.sh create-issue <title> <body> <repo>
```

---

## 📈 **11. Evidence-Based Retro**

### Why: Data or it didn't happen.

### How:
- **Track throughput** (items done)
- **Cycle time** (start→done)
- **Quick top blocker note** each week

### Implementation:
- Automated metrics collection
- Weekly retrospective reports
- Blocker tracking and resolution

---

## 🧹 **12. Backlog Hygiene**

### Why: Compost piles need turning.

### How: Each week:
- **Archive stale items**
- **Merge duplicates**
- **Rename vague titles**
- **Keep the top 10 sharp**

### Implementation:
```bash
# Perform backlog hygiene
./scripts/agile-cockpit-automation.sh hygiene
```

---

## 🔄 **13. Explicit Rollover Rules**

### Why: Prevent zombie tasks.

### How:
- **At sprint end, only roll over items that still serve the Sprint Goal**
- **Otherwise re-prioritize or kill**

### Implementation:
- Sprint end checklist
- Goal alignment verification
- Automatic rollover rules

---

## 📝 **14. Default Templates**

### Why: Consistency = speed.

### How:
- **`.github/ISSUE_TEMPLATE.md`** (acceptance criteria, ICE score)
- **`PULL_REQUEST_TEMPLATE.md`** (tests, screenshots, rollout plan)

### Implementation:
- ✅ Issue templates created
- ✅ PR template created
- ✅ DoD checklists included

---

## 🕐 **15. Protect Your Maker Time**

### Why: Context switches tax your brain.

### How:
- **Calendar-block 2-3 × 90-minute focus windows** per day
- **Cockpit reviews at fixed times only**

### Implementation:
- Time blocking guidelines
- Fixed review schedules
- Focus time protection

---

## 🎬 **16. Demo Something Every Week**

### Why: Reality is the best product manager.

### How:
- **End each sprint with a tiny demo** (gif/screen/video)
- **Attached to the main issue or release notes**

### Implementation:
- Weekly demo schedule
- Demo recording guidelines
- Demo documentation in issues

---

## 🚀 **Quick Start Commands**

```bash
# Check current status
./scripts/agile-cockpit-automation.sh status

# Generate sprint report
./scripts/agile-cockpit-automation.sh report

# Add issue to project
./scripts/agile-cockpit-automation.sh add-issue <issue_url>

# Create new issue
./scripts/agile-cockpit-automation.sh create-issue "Title" "Body" "repo"

# Perform backlog hygiene
./scripts/agile-cockpit-automation.sh hygiene
```

---

## 📊 **Success Metrics**

- **WIP ≤ 8 items** in active status
- **Cycle time < 3 days** for small items
- **Blocked items < 24 hours** SLA
- **Weekly demos** completed
- **Backlog hygiene** performed weekly
- **ICE scores** on all items
- **DoD compliance** 100%

---

*Your Agile Cockpit is now optimized for high-performance project management! 🚀*
