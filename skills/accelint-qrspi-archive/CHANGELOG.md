# Changelog

## [1.5.1] - 2026-09-03

### Changed
- **Tightened archive INDEX decision prose** — Decision rows now explicitly require compact archive-style summaries derived from `decisions[].choice`, not verbatim copies of verbose source prose
  - Added guidance to rewrite each choice into terse fragments before semicolon-joining multiple decisions
  - Explicitly forbids copying rationale, alternatives, examples, caveats, or explanatory prose into `openspec/changes/archive/INDEX.md`
  - Rationale: Real archive index rows use compact semicolon-separated fragments; preserving full decision prose makes the changelog noisy and inconsistent with existing entries
- **Tightened specs INDEX purpose prose** — Purpose cells now explicitly require a single concise sentence suitable for a table cell
  - Spec-writing subagents now report an index-ready purpose summary instead of a sentence-or-paragraph excerpt from the heading body
  - README guidance now mirrors the same single-sentence purpose-summary rule
  - Rationale: Real specs index rows use descriptive but bounded single-sentence summaries; allowing paragraph-length carryover makes `openspec/specs/INDEX.md` harder to scan

### Version
- Bumped from 1.5.0 → 1.5.1

## [1.5.0] - 2026-08-31

### Added
- **Strengthened synthesis suggestion mechanism** — Upgraded from passive informational prose to RFC 2119-style actionable directives
  - Replaced weak "ℹ Consider running accelint-archive-synthesis" with directive format: "⚠️ You SHOULD run accelint-archive-synthesis now"
  - Rationale: Agents trained on RFC 2119 keywords (MUST/SHOULD) reliably recognize these as actionable directives, while passive prose like "Consider" is often ignored
- **Dual-trigger synthesis threshold system** — Now fires when either 50 changes accumulate OR 30 working days elapse since last synthesis run, whichever comes first
  - Change threshold: 50 archived changes since last synthesis checkpoint
  - Time threshold: 30 working days (6 weeks × 5 working days/week)
  - Rationale: High-velocity projects need periodic linting before decision drift accumulates too deeply; lower-velocity projects need time-based nudges to ensure review happens even when change volume is low
- **SYNTHESIS-LOG.md checkpoint tracking** — Reads last synthesis run date and row count from `openspec/changes/archive/SYNTHESIS-LOG.md`
  - Parses most recent checkpoint under "## Run History" section
  - First-run handling: treats missing log as (epoch, 0 rows) baseline
  - Working days calculation: total calendar days minus weekend days (Saturdays/Sundays)
- **Subagent-based calculation** — Delegates all threshold calculation to subagent, keeping parent context clean
  - Subagent returns structured JSON with trigger status and metrics
  - Parent uses response for output formatting only
  - Follows same pattern as spec writing (step 22) and other isolated operations

### Changed
- **New step 36** — Added synthesis trigger check as dedicated step after archive reporting (step 34-35)
  - Three distinct output formats: threshold exceeded, threshold not exceeded, first-run case
  - Clear metrics shown: change delta, time delta, checkpoint info, current state
  - Includes rationale for dual-trigger approach in output
- **Hard-coded thresholds** — 50 changes and 30 working days are now explicit constants for clear tuning
  - Not "reasoned defaults" subject to adjustment — these are the defined thresholds
  - Can be changed directly in skill instructions if project cadence requires different values

### Version
- Bumped from 1.4.0 → 1.5.0

## [1.4.0] - 2026-08-25

### Added
- Cross-platform agent compatibility through prose-based skill invocation format
- Simple, reliable prose format that works across all agent harnesses

### Changed
- Migrated from harness-specific slash-command syntax (`/skill-name`) to agent-agnostic prose invocation format
- Ensures compatibility across Claude Code, Codex, Pi, and other agent harnesses

## [1.3.1] - 2026-08-21

### Fixed
- **Made Purpose heading check more flexible in Preflight Task B** — Now accepts `## Overview` as equivalent to `## Purpose`
  - Updated step 3 to check for headings in this order: `## Purpose`, `### Purpose`, `## Overview`, `### Overview` (first match wins)
  - Treats Overview and Purpose as semantically equivalent — both describe what the capability does
  - Updated spec writing subagent prompt (step 22) to extract from either Purpose or Overview headings
  - Updated report collection (step 24) to accept purpose text from any of these heading types
  - Rationale: Some specs use `## Overview` instead of `## Purpose` for the same semantic purpose. Treating them as equivalent eliminates false-negative preflight failures.
- **Added agent-generated Purpose option** — When no Purpose/Overview heading exists, now offers three choices instead of two
  - Option (a): Add placeholder `## Purpose` with `_Purpose not yet documented_` (quick unblock)
  - Option (b): Pause so user can add heading themselves (best for specs needing domain expertise)
  - Option (c): Read spec content and generate `## Purpose` heading based on what the spec describes (NEW — usually best when spec has meaningful content)
  - Rationale: Agent-generated purpose is more practical than placeholder text and saves user time when spec already has documentation to synthesize from
- **Clarified brand-new capability handling** — Made explicit that Purpose check only applies to capabilities with existing MAIN specs
  - Added note to step 3: "This check applies only to capabilities that already have MAIN specs at openspec/specs/<capability>/spec.md"
  - Brand-new capabilities (per step 4) skip Purpose check entirely since they don't have MAIN specs yet
  - Rationale: Eliminates confusion about when Purpose check should run vs. when it's not applicable

### Version
- Bumped from 1.3.0 → 1.3.1

## [1.3.0] - 2026-07-24

### Changed
- **Expanded Purpose heading support** — skill now accepts both `## Purpose` and `### Purpose` heading levels
  - Rationale: Some specs use h3 level for Purpose headings within capability sections. Supporting both heading levels makes the skill more flexible without changing validation behavior
  - Updated all references throughout:
    - Compatibility note: "must already have a ## Purpose heading" → "must already have a ## Purpose or ### Purpose heading"
    - Preflight Task B: validation now checks for either heading level
    - Spec writing prompts: instructions updated to reference "## Purpose or ### Purpose heading"
    - Index update logic: reads from either heading level when extracting purpose text
    - Error messages: updated to mention both heading formats
  - Why: Rigid heading level requirements create unnecessary friction when specs organize content differently. The actual requirement is semantic (a Purpose section exists), not syntactic (specific heading level)

### Version
- Bumped from 1.2.0 → 1.3.0

## [1.2.0] - 2026-07-21

### Changed
- **Improved Related Specs formatting instructions:** Enhanced Task F (spec frontmatter sync) to generate rich markdown links with purpose descriptions
  - Rationale: Plain partner name lists don't communicate what each related spec does. Links provide immediate navigation, purpose text provides context at a glance
  - Format changed from:
    - `- <partner>`
    - To: `- [<partner>](../<partner>/spec.md) - <Purpose heading text>`
  - Instructions now specify: read each partner's spec.md to extract ## Purpose heading, format as markdown link with partner name as link text, relative path to spec.md, space-dash-space separator (not em-dash), then first sentence/paragraph from Purpose
  - Example format added showing real entries with links and descriptions
  - Clarified insertion point: end of file if no ## Related Specs heading exists
  - Why: Related specs cross-references are for human readers navigating capability relationships. Rich links with purpose text make the spec graph browsable without clicking through every file

### Version
- Bumped from 1.1.0 → 1.2.0

## [1.1.0] - 2026-07-10

### Changed
- **Remove phase boundaries to prevent premature stopping:** Refactored from phase-based structure to continuous numbered steps
  - Rationale: Phase headers like "### Phase 0: Preflight Checks", "### Phase 1: Archive and Extract", "### Phase 2: Validate" create natural stopping points where agents might pause and check with the user mid-workflow, breaking the intended continuous execution flow
  - Changed structure from:
    - "### Phase 0: Preflight Checks" / "### Phase 1: Archive and Extract" / etc.
    - To: Single section with instruction "Execute these steps in order without stopping between them unless an error occurs" followed by continuous numbered steps
  - Updated workflow diagram: "Phase" column → "Stage" column (higher-level groupings like "Preflight", "Archive", "Validate")
  - Updated all cross-references throughout (e.g., "Phase 4 always delegates" → "Spec writing always delegates", "Phase 1 is the mirror image" → "Archive and extraction is the mirror image")
  - Removed all `**Steps:**` sub-headers that created additional stopping points within phases
  - Updated compatibility note to use plain language instead of phase references (e.g., "Phase 4 (per-capability spec writes)" → "Per-capability spec writes", "Phase 0 Task A" → "preflight Task A")
  - Why: Agents tend to treat phase headers and "Steps:" sub-headers as checkpoint boundaries even when not intended. Continuous numbered steps signal that the workflow should execute atomically unless an error occurs

### Version
- Bumped from 1.0.0 → 1.1.0
