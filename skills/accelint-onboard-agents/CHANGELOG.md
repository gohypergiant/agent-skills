# Changelog

All notable changes to this skill are documented in this file.

## [1.6.0] - 2026-09-04

### Added
- **Canonical template and review rubric** — Added `assets/template.md` as the source of truth for generated agent-instruction structure and `references/rubric.md` for the required post-write quality assessment.
- **Conflict-resolution precedence** — Added an explicit order for reconciling user answers, repository policy, evidence-backed inference, existing guidance, defaults, and unresolved TODOs.
- **Post-write quality assessment** — Added weighted rubric scoring, letter grades, and outcome-specific user guidance after generated `AGENTS.md` or `CLAUDE.md` files are written.
- **Expanded decision and safety scaffolding** — Added maintenance guidance, performance-sensitive-change rules, optional review-specific rules, and more decision-heuristic coverage to the canonical template.

### Changed
- **Skill renamed** — Renamed `accelint-onboard-agent` to `accelint-onboard-agents` and updated the skill’s references and examples.
- **Workflow restructured into explicit stages and steps** — Replaced the phase-based workflow with ordered stages and Steps 0–12, including progress tracking, operating-path confirmation, mode-specific playbooks, preview gating, and post-write review.
- **Create, import, and refresh paths made more explicit** — Clarified start-fresh, restructure, append, dry-run, targeted-refresh, and full-refresh routing, including which discovery and interview work each path requires.
- **Template handling tightened** — Required sections now follow the canonical template; optional sections are retained only when the template allows them and they fit the repository.
- **Discovery and draft synthesis clarified** — Limited parallel discovery to unresolved behavioral gaps and required the final editorial pass to deduplicate guidance, resolve conflicts, and remove adjacent-document material before preview.

## [1.5.1] - 2026-08-26

### Changed
- **Mode-aware existing-file prompt aligned** — Mode 2 recommends starting fresh for imports, Mode 3 recommends working with the existing file for refreshes, and the Step 4 labels and routing language use the same option names.

## [1.5.0] - 2026-08-26

### Added
- **Import path branches clarified** — Added explicit restructure, append, and dry-run paths for existing non-template files.
- **Refresh path branches clarified** — Added targeted-refresh and full-refresh paths for files that follow the expected structure.
- **Companion-document detection coverage clarified** — Added `CONSTRAINTS.md`, `EPISTEMIC-MAP.md`, and `JARGON.md` alongside `openspec/config.yml`, `openspec/config.yaml`, and `ARCHITECTURE.md`.
- **Cross-platform invocation guidance** — Added prose-based skill invocation guidance that works across agent harnesses.

### Changed
- **Workflow terminology aligned** — Updated README workflow terminology to use the skill’s step-based framing instead of the older phase-based summary.
- **Related-document guidance tightened** — Clarified that generated files include only canonical documents that exist and materially help agent behavior.
- **Skill invocation made agent-agnostic** — Replaced harness-specific slash-command syntax (`/skill-name`) with prose-based invocation guidance.

## [1.4.0] - 2026-07-08

### Added
- **External findings support in refresh mode** — The skill accepts a `findings:` list from the invoking prompt, merges factual findings with drift detection and unresolved TODOs, and identifies the findings’ source when available.

### Changed
- **Refresh workflow expanded** — The refresh flow extracts external findings, scans for drift, surfaces TODOs, announces the merged findings before interviewing, and shows a diff-style preview before writing.

## [1.3.0] - 2026-05-11

### Added
- **Parallel discovery** — Added five parallel discovery domains: version control and commits; CI/CD and pre-commit workflows; testing and code quality; security and migrations; and OpenSpec and development workflow.
- **Onboarding safeguards** — Added guidance against serial discovery, skipped discovery, omitted generated-file sections, duplicated root instructions in package files, and writes without a preview.

### Changed
- **Discovery execution** — Replaced serial codebase discovery with parallel subagents and merged their findings before draft generation.
