# Changelog

## [1.1.1] - 2026-07-30

### Fixed
- Clarified in `SKILL.md` that `accelint-ts-audit-all` is command-only and should run only when explicitly invoked with `/skill accelint-ts-audit-all <path>`.
- Tightened resume behavior so multiple `.agents/audit/` process files are resolved by matching target path, timestamp, and in-progress status instead of guessing or merging audits.
- Expanded audit-target selection rules to exclude declaration files and common generated-output directories, and added an early stop when the target path resolves to zero auditable files.
- Added explicit completion criteria so files are not treated as done before verification, persistence, and archival all complete.
- Applied a behavior-preserving prose pass across `SKILL.md` and `assets/audit-process-template.md` to improve scanability, approval-flow clarity, coverage-disabled PBT guidance, and terminology consistency.
- Updated `README.md` and added `evals/evals.json` so supporting docs and evaluation coverage match the current workflow and guardrails.

### Version
- Patch release at `1.1.1`.
