# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-11

### Added
- Initial skill release
- Phase 0 file state detection: Create vs. Refresh mode with import/append/dry-run options for unrecognised content shapes
- Phase 1 codebase scan table covering all 11 architecture.md sections with specific inference targets
- Phase 2 targeted interview (5 turns) covering only gaps the scan couldn't fill — deployment, security, roadmap, identity
- Phase 3 preview-before-write workflow with inference source annotations stripped from final output
- Drift detection table for refresh mode — 8 signal categories with specific file paths
- 6 anti-patterns with concrete WHY explanations (overwrite without reading, fabricate infrastructure, verbatim directory tree, skip drift detection, all-TODO document, implementation details in system diagram)
- `references/template.md` — full 11-section ARCHITECTURE.md skeleton with annotation guidance
- "Date every write" principle — always sets Section 10 date to today on each write

### Rationale
- Modelled after `accelint-onboard-agent` and `accelint-onboard-openspec` patterns (Phase 0/1/2/3 structure, Mode 1/2/3 detection, infer-before-asking principle)
- Living document update path is the primary use case, not just initial creation — most invocations will be refreshes
- Codebase scanning is prioritised over interviewing to minimise user burden; questions are reserved for content that cannot be mechanically derived (roadmap, security decisions, deployment specifics not in IaC)
