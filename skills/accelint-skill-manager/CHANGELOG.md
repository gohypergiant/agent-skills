# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.2] - 2026-07-30

### Changed
- Tightened the skill-manager trigger description and routing boundaries in `SKILL.md`
  - Expanded trigger coverage for skill-package maintenance work such as `SKILL.md` fixes, eval coverage improvements, version/changelog alignment, and cross-file consistency review
  - Added the explicit trigger phrase `build a skill package` to reduce undertriggering for package-creation requests
  - Clarified that prose-only cleanup, prompt polishing, and README/docs work should route to other skills when the real task is not skill-package architecture or governance
- Added a `Default execution paths` section to make direct use lighter and more predictable
  - Clarified when to use quick audit, targeted refinement, or full skill creation / large refactor
  - Reduced the chance of overproducing full rewrites for audit-only or localized requests
- Reconciled versioning guidance and tightened audit output expectations
  - Replaced mixed bump examples with consistent major/minor/patch semver rules
  - Made patch-ready replacement text conditional on user intent instead of required for every audit-only run
- Tightened prose across the artifact set without changing behavior
  - Updated `README.md`, `AGENTS.md`, `references/*`, and `assets/skill-template/*` for clearer wording, consistent requirement labels, and better scanability
- Expanded eval coverage boundaries in `evals/evals.json`
  - Added cases for targeted refinement, audit-only behavior, description optimization, changelog/version checks, cross-file consistency review, and should-not-trigger near misses for prose-only and docs-focused work

### Version
- Bumped from 2.1.1 → 2.1.2

## [2.1.1] - 2026-03-18

### Changed
- **Removed duplicative Step 5**
  - Deleted Step 5 (Update Documentation) which repeated CHANGELOG guidance already in Step 4
  - Updated workflow checklist from 5 steps to 4 steps
  - Rationale: Eliminates ~25 lines of redundant content, improves token efficiency

- **Added workflow routing decision tree**
  - New "Which Workflow Should You Follow?" section after "How to Use"
  - Provides clear navigation: creating new skill, improving existing, auditing
  - Rationale: Users landing on the skill didn't know which workflow to follow for their task

- **Revised generic advice to be skill-specific**
  - Changed "Avoid overwhelming users" to concrete guidance: "Ask 2-3 concrete questions first"
  - Rationale: Generic advice is redundant; specific guidance is actionable

- **Removed packaging from scope**
  - Removed "package this as a skill" and "packaging" from description
  - Rationale: Packaging is a single script call, not a workflow requiring skill guidance

- **Standardized version format to full semver**
  - Changed frontmatter version from "2.1" to "2.1.1" (X.Y.Z format)
  - Rationale: Consistency with CHANGELOG format, clearer patch/minor/major distinction

### Fixed
- Version consistency between frontmatter and CHANGELOG

### Version
- Bumped from 2.1.0 → 2.1.1

## [2.1.0] - 2026-03-18

### Added
- **New Step 5: Update Documentation (CHANGELOG and Version)**
  - Added comprehensive CHANGELOG maintenance workflow to skill creation process
  - Updated workflow checklist to include documentation step
  - Rationale: Skills lacked version history and rationale for changes, making maintenance difficult

- **New reference file: references/changelog.md**
  - Detailed guidance on CHANGELOG format, versioning, and best practices
  - Examples of strong vs weak CHANGELOG entries
  - Templates for creating new entries with proper rationale
  - Rationale: Agents needed comprehensive examples to write meaningful CHANGELOGs

- **CHANGELOG.md template in skill-template/**
  - Added template CHANGELOG.md with instructions and examples
  - Rationale: New skills should start with proper version tracking from v1.0

### Changed
- **Enhanced references/skill.md with frontmatter metadata documentation**
  - Added comprehensive `metadata.version` field guidance
  - Added `metadata.author` field conventions
  - Added `name` field rules with examples
  - Rationale: Version control documentation was incomplete

- **Updated Skill Audit Workflow**
  - Added Step 3: CHANGELOG and Version Audit
  - Enhanced Frontmatter Audit to check version consistency
  - Renumbered subsequent steps (Knowledge Delta Test: 3→4, Produce Output: 4→5)
  - Rationale: Audits should verify CHANGELOG presence and quality

- **Updated assets/skill-template/README.md**
  - Changed from "NEVER create CHANGELOG.md" to proper CHANGELOG guidance
  - Rationale: CHANGELOG provides curated history with rationale, complementing git history

### Version
- Bumped from 2.0 → 2.1

## [2.0.0] - Previous

### Added
- Complete skill manager rewrite with progressive disclosure
- 4-step workflow: Understanding, Planning, Initializing, Editing
- Skill audit workflow with knowledge delta test
- Freedom calibration guidance for task-specific instruction style
- Comprehensive reference files for file-system, skill.md, agents.md patterns

### Rationale
- Previous version lacked structured workflow for skill creation
- No guidance on when to use prescriptive vs principle-based approaches
- Missing audit capabilities for existing skills
