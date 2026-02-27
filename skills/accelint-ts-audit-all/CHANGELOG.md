# Changelog

All notable changes to the `accelint-ts-audit-all` skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-02-27

### Added
- **Automation scripts** for orchestrating multi-file audits across sessions
  - `scripts/init-audit.sh` - Automated worktree creation, file discovery, and tracking file initialization (~800-1,000 tokens saved per initialization)
  - `scripts/update-audit-status.sh` - Automated progress tracking and file archival (~300-400 tokens saved per file completion)
  - `scripts/merge-audit.sh` - Automated merge back to original branch and cleanup (~500-600 tokens saved per finalization)
  - `scripts/README.md` - Comprehensive documentation of scripts, coverage model, and workflow
- **Coverage model documentation** explaining what scripts can automate (80%) vs. what requires agent judgment (20%)
- **Structured JSON output** from all scripts for programmatic processing and chaining
- **Context optimization**: ~1,600-2,000 tokens saved per complete multi-file audit workflow

### Changed
- **SKILL.md**: Added "Use Automation Scripts (Recommended)" section with workflow examples
- **Version**: Bumped from 1.1 to 2.0 (major change due to substantial workflow alteration)
- **Workflow**: Scripts-first approach now recommended for audit orchestration
- **Step numbering**: Updated references throughout to clarify 8-step per-file process (previously mentioned "9 steps" inconsistently)

### Technical Details
- Scripts automate mechanical orchestration (worktree setup, file discovery, progress tracking, merge operations)
- Agent judgment still required for interactive change approval, semantic analysis, conflict resolution
- All scripts use defensive bash programming (`set -euo pipefail`)
- Scripts output structured JSON for programmatic chaining
- Worktree isolation prevents conflicts with parallel audits
- Tracking files remain gitignored in `.agents/audit/` directory

## [1.1.0] - Previous version

Version with worktree support and two-phase interactive approval pattern.
