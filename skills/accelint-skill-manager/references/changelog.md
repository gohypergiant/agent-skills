# CHANGELOG.md Maintenance

## Purpose

CHANGELOG.md tracks version history and the rationale behind skill changes. Unlike git history (which shows individual commits), a CHANGELOG provides a curated, human-readable summary of what changed and **why** — critical for future maintainers understanding design decisions.

## When to Update

Update CHANGELOG.md after:
- Creating a new skill (v1.0 entry)
- Making iterative improvements based on evaluation results
- Fixing bugs or errors
- Adding new sections, patterns, or references
- Restructuring or refactoring
- Any change that bumps the version in frontmatter

## Format

Use "Keep a Changelog" format with semantic versioning:

```markdown
# Changelog

## [X.Y.Z] - YYYY-MM-DD

### Added
- New features, capabilities, sections, or patterns

### Changed
- Modifications to existing content
- **Rationale:** [WHY the change was made]

### Fixed
- Bug fixes, corrections, broken links

### Version
- Explicit version bump note
```

## Versioning Guidelines

### Major Version (1.0 → 2.0)
**When:** Substantial rewrites, breaking changes, complete restructuring

**Example:**
```markdown
## [2.0.0] - 2026-03-18

### Changed
- **COMPLETE RESTRUCTURE:** Migrated from prescriptive workflow to principle-based guidance
  - Rationale: Testing showed agents performed better with decision frameworks than rigid steps
  - Evaluation results: Pass rate improved from 65% → 89% with freedom-calibrated approach
- Reorganized into progressive disclosure pattern (SKILL.md → references/)

### Version
- Bumped from 1.4 → 2.0
```

### Minor Version (1.0 → 1.1)
**When:** New sections, significant additions, refinements

**Example:**
```markdown
## [1.3.0] - 2026-03-18

### Added
- New "NEVER Do React" section with 8 critical anti-patterns
  - Rationale: Evaluation revealed common mistakes not covered by existing guidance
- Created comprehensive test suite (evals/evals.json) with 8 realistic prompts

### Changed
- Enhanced description to be more "pushy" about triggering
  - Increased from 344 chars to 640 chars for better keyword coverage
  - Added explicit triggers: useEffect, useState, useMemo, useCallback, memo, SSR

### Version
- Bumped from 1.2 → 1.3
```

### Patch Version (1.0.0 → 1.0.1)
**When:** Bug fixes, typo corrections, minor clarifications

**Example:**
```markdown
## [1.2.1] - 2026-03-18

### Fixed
- Corrected skill name reference in SKILL.md line 168
  - Was: /accelint-ts-best-practices
  - Now: /accelint-react-best-practices
- Fixed broken link to references/optimization.md

### Version
- Bumped from 1.2.0 → 1.2.1
```

## What to Document

### ✅ Always Include

**Rationale for changes:**
```markdown
### Changed
- Removed 80 lines of activation knowledge from SKILL.md body
  - **Rationale:** Activation knowledge belongs ONLY in frontmatter description per spec
  - **Impact:** Reduced token usage by 30%, improved activation accuracy
```

**Links to evaluation results:**
```markdown
### Changed
- Simplified error handling workflow to 3 steps instead of 7
  - **Evaluation result:** Agents skipped complex workflows, achieving 40% pass rate
  - **After simplification:** Pass rate improved to 85%
  - **Rationale:** Agents need decision frameworks, not checklists
```

**Trade-offs and alternatives considered:**
```markdown
### Changed
- Chose mounted flag pattern over synchronous script for SSR hydration
  - **Alternatives considered:** useEffect + setTimeout, React 18 useId
  - **Trade-off:** Slightly more code but works across React versions 16-19
  - **Rationale:** Evaluation showed mixed React versions in user projects
```

### ❌ Don't Include

**Individual commit messages:**
```markdown
❌ ### Changed
- Updated line 45
- Fixed typo
- Renamed variable
```

**Vague summaries without rationale:**
```markdown
❌ ### Changed
- Improved the workflow
- Made it better
- Enhanced performance
```

**Future plans (use issues/roadmap instead):**
```markdown
❌ ### Planned
- Will add X feature next
- TODO: Improve Y section
```

## Linking Evaluation Results

When changes stem from testing or user feedback, reference the source:

**Format 1: Direct reference to eval iteration**
```markdown
### Changed
- Restructured workflow from 5 phases to 3 decision points
  - **Source:** iteration-3 eval results (see workspace/iteration-3/benchmark.md)
  - **Key finding:** Agents bypassed phase 2 & 4, completing only 1, 3, 5
  - **Rationale:** Consolidated essential decision points, removed redundant phases
```

**Format 2: Reference user feedback**
```markdown
### Fixed
- Removed confusing "Freedom Calibration" section
  - **User feedback:** "Agent kept asking which mode to use mid-task"
  - **Root cause:** Section implied multiple modes exist when only one workflow applies
  - **Rationale:** Single-type skills don't need freedom calibration
```

**Format 3: Reference external issues**
```markdown
### Added
- New anti-pattern: NEVER use nested promises without error boundaries
  - **Motivation:** Issue #47 - agents generated unhandled rejection patterns
  - **Expert knowledge:** Nested promises silently swallow errors in Node.js
  - **Reference:** Added references/error-handling.md with examples
```

## Version Consistency

**Critical:** CHANGELOG version must match `metadata.version` in SKILL.md frontmatter.

**Verification checklist:**
- [ ] Latest CHANGELOG entry version matches frontmatter
- [ ] Date is in YYYY-MM-DD format
- [ ] At least one of Added/Changed/Fixed has content
- [ ] Rationale provided for all changes
- [ ] Version bump explicitly noted

**Example frontmatter sync:**
```yaml
---
name: example-skill
metadata:
  version: "1.3.0"  # Must match CHANGELOG
---
```

```markdown
## [1.3.0] - 2026-03-18  # Must match frontmatter
```

## Anti-Patterns

### ❌ Weak Entry (No Rationale)
```markdown
## [1.2.0] - 2026-03-18

### Changed
- Updated the workflow section
- Made improvements

### Version
- Bumped from 1.1 → 1.2
```

**Why weak:** No rationale, no specifics, future maintainer can't understand WHY changes happened.

### ✅ Strong Entry (Clear Rationale)
```markdown
## [1.2.0] - 2026-03-18

### Changed
- Converted workflow from checklist to decision tree format
  - **Rationale:** Evaluation showed 60% of agents skipped checklist items
  - **Testing:** Decision tree format improved task completion from 60% → 92%
  - **Trade-off:** Slightly longer skill body but dramatically better outcomes

### Added
- New section "Before Starting, Ask" with 5 key questions
  - **Rationale:** Agents dove into implementation without understanding requirements
  - **User feedback:** "Agent built wrong thing because it didn't ask about existing code"

### Version
- Bumped from 1.1 → 1.2
```

**Why strong:** Clear rationale, links to testing/feedback, explains trade-offs, future maintainer understands context.

## Template

Copy this template when creating a new CHANGELOG entry:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- [New feature/section/pattern]
  - **Rationale:** [Why was this needed?]
  - **Source:** [Evaluation/feedback/issue that motivated this]

### Changed
- [Modification to existing content]
  - **Rationale:** [Why make this change?]
  - **Trade-off:** [What was gained/lost?]
  - **Alternatives considered:** [What else was tried?]

### Fixed
- [Bug fix/correction]
  - **Root cause:** [Why did this error exist?]
  - **Impact:** [What broke before this fix?]

### Version
- Bumped from X.Y → X.Z
```

## Example: Real CHANGELOG Entry

From `skills/accelint-react-best-practices/CHANGELOG.md`:

```markdown
## [1.4.0] - 2026-03-18

### Added
- **New "Using Skill Patterns Appropriately" section** to improve flexibility
  - Encourages presenting reference patterns while mentioning alternative approaches
  - Guides agents to consider user's React version, project complexity, and team preferences
  - Suggests simpler solutions for basic cases even when not in reference files
  - Example: SSR hydration can use mounted flag pattern for simple cases vs synchronous script
  - **Rationale:** Evaluation showed skill could be overly prescriptive by only suggesting one solution from reference files

### Version
- Bumped from 1.3 → 1.4
```

**What makes this strong:**
- Specific: Lists exactly what was added
- Context: Provides concrete example (SSR hydration)
- Rationale: Explains WHY (evaluation revealed over-prescription)
- Actionable: Future maintainer knows to balance prescription vs flexibility
