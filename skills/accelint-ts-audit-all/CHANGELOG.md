# Changelog

## [1.1.2] - 2026-07-31

### Fixed
- Normalized the workflow language across `SKILL.md`, `README.md`, and `assets/audit-process-template.md` to consistently describe **8 execution steps plus archive/completion bookkeeping**.
- Hardened the merge-back example in `SKILL.md` by replacing a brittle markdown-parsing `grep` snippet with a safer `awk` example for extracting the original branch name.
- Clarified in `assets/audit-process-template.md` that benchmark verification is optional and only applies when the target package already has a documented bench command.
- Added eval coverage in `evals/evals.json` for ambiguous numbered approvals and for resuming while an approval decision is still pending.
- Applied a strict, behavior-preserving prose pass to non-frontmatter workflow text in `SKILL.md` and `assets/audit-process-template.md` to improve scanability and cross-file consistency.

### Version
- Patch release at `1.1.2`.

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
