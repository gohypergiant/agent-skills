# Changelog

## [1.1.3] - 2026-07-31

### Changed
- Corrected the routed AGENTS.md writer-skill name from `accelint-onboard-agent` to `accelint-onboard-agents` in `SKILL.md` and `README.md`
  - Rationale: Matches the directly observed available skill name in this repo/session and removes handoff ambiguity during confirmed-finding routing
- Normalized `findings:` interface wording and repaired malformed step-reference prose in `SKILL.md`
  - Rationale: Improves execution clarity in a routing-heavy, safety-sensitive skill without changing workflow behavior
- Tightened selected body prose in `SKILL.md` and `README.md` without changing frontmatter, workflow order, approval gates, or write-permission boundaries
  - Rationale: Stage 4 prose audit found dense but behaviorally correct passages where clearer sentence structure improved scanability with no behavior drift

### Version
- Bumped from 1.1.2 → 1.1.3

## [1.1.2] - 2026-07-30

### Changed
- Tightened the trigger description around periodic, corpus-wide, human-approved archive audits and added stronger boundaries against propose/apply/archive and single-change verification workflows
  - Rationale: Improves trigger precision for real archive-synthesis requests while reducing overlap with adjacent OpenSpec skills
- Added an upfront interaction contract, centralized degraded-mode rules, clearer workflow-order guidance, and a compact final summary template
  - Rationale: Makes the human stop points, fallback behavior, and expected run conclusion easier to follow during long archive-audit executions
- Tightened skill prose without changing workflow order, approval gates, or write-permission boundaries
  - Rationale: Reduces instruction sprawl and improves scanability for a long, safety-sensitive skill
- Added `evals/evals.json` with decision-drift, reconciliation, structural-coupling, degraded-mode, and human-review-gating scenarios
  - Rationale: Establishes a reusable default eval set for regression coverage and future skill-creator benchmarking

### Version
- Bumped from 1.1.1 → 1.1.2

## [1.1.1] - 2026-07-24

### Fixed
- **Typo in compatibility note** — corrected "findings:" to "findings -" (em-dash formatting issue)
  - Issue: Compatibility section had incorrect punctuation in "findings: interface" 
  - Fix: Changed to "findings - interface" for proper readability
  - Impact: Documentation clarity improvement only, no functional change

### Version
- Bumped from 1.1.0 → 1.1.1

## [1.1.0] - 2026-07-10

### Changed
- **Remove phase boundaries to prevent premature stopping:** Refactored from phase-based structure to continuous numbered steps
  - Rationale: Phase headers like "### Phase 0: Preflight Checks" create natural stopping points where agents might pause and check with the user mid-workflow, breaking the intended continuous execution flow
  - Changed structure from:
    - "### Phase 0: Preflight Checks" / "### Phase 1: Archive" / etc.
    - To: Continuous numbered steps (1, 2, 3...) under a single "Implementation Steps" section with instruction "Execute these steps in order without stopping between them"
  - Updated workflow diagram: "Phase" column → "Step" column (or "Stage" for higher-level groupings)
  - Updated all cross-references throughout (e.g., "Phase 7" → "Step 8", "Phase 4's hub-doc refresh" → "Step 5's hub-doc refresh")
  - Why: Agents tend to treat phase headers as checkpoint boundaries even when not intended. Continuous numbered steps signal that the workflow should execute atomically unless an error occurs

### Version
- Bumped from 1.0.0 → 1.1.0
