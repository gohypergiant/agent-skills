# Changelog

All notable changes to the `accelint-ts-documentation` skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-02-27

### Added
- **Automation scripts** for detecting documentation issues and generating reports
  - `scripts/detect-jsdoc-issues.sh` - Automated JSDoc violation detection (~1,200 tokens saved per audit)
  - `scripts/detect-comment-issues.sh` - Automated comment quality issue detection (~600 tokens saved per audit)
  - `scripts/generate-doc-audit-report.sh` - Automated audit report generation
  - `scripts/README.md` - Comprehensive documentation of scripts, coverage model, and workflow
- **Coverage model documentation** explaining what scripts can catch (65-70%) vs. what requires agent review (30-35%)
- **Structured JSON output** from detection scripts for programmatic processing
- **Context optimization**: ~1,800 tokens saved per full documentation audit workflow

### Changed
- **SKILL.md**: Added "Use Automation Scripts (Recommended)" as first step in "How to Use" workflow
- **Version**: Bumped from 1.1 to 2.0 (major change due to substantial workflow alteration)
- **Workflow**: Scripts-first approach now recommended for documentation audits

### Technical Details
- Detection scripts use bash pattern matching with clear limitations documented
- Scripts detect mechanical issues (missing JSDoc, vague TODOs, commented code, etc.)
- Agent review still required for semantic quality (clarity, appropriateness, helpfulness)
- TODO/FIXME detection focuses on actionable content, does NOT require username patterns
- All scripts use defensive bash programming (`set -euo pipefail`)

## [1.1.0] - Previous version

Initial structured version with progressive disclosure pattern.
