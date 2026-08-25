# Changelog

## [1.2.0] - 2026-08-25

### Added
- Cross-platform agent compatibility through XML-based skill invocation format
- Explicit negative instructions to prevent misinterpretation as shell commands

### Changed
- Migrated from harness-specific slash-command syntax (`/skill-name`) to agent-agnostic XML invocation format
- Ensures compatibility across Claude Code, Codex, Pi, and other agent harnesses

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
