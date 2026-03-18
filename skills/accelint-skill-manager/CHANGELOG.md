# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
