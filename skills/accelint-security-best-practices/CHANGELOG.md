# Changelog

## [1.1.2] - 2026-07-31

### Changed
- Tightened workflow wording in `SKILL.md` to reduce exhaustive-sounding audit claims
  - Replaced absolute coverage language with bounded, evidence-accountable instructions
  - Required agents to state reviewed scope, note unreviewed areas, and avoid implying exhaustive coverage when audits are partial
- Expanded negative trigger coverage in `evals/evals.json`
  - Added near-miss should-not-trigger cases for performance tuning, architecture tradeoff analysis, and maintainability refactoring
- Tightened behavior-preserving prose in supporting artifacts
  - Clarified wording in `AGENTS.md`, `assets/output-report-template.md`, and `references/quick-reference.md`

### Version
- Bumped from 1.1.1 → 1.1.2

## [1.1.1] - 2026-07-30

### Changed
- Tightened security-skill trigger coverage and workflow boundaries in `SKILL.md`
  - Refocused the description on concrete security audits, vulnerability reviews, auth/API hardening, file-upload security, outbound fetch/SSRF review, secrets handling, dependency risk, and pre-deployment hardening
  - Added an explicit scoping step for target path, execution mode, repo size, and highest-risk surfaces
  - Clarified audit-mode versus implementation-mode defaults and prioritized Critical/High findings first for larger scopes
  - Reframed secrets guidance to allow dedicated secret managers and replaced the narrow `Array.includes()` hard stop with broader authorization-correctness guidance
- Expanded evaluation coverage in `evals/evals.json`
  - Added cases for audit-only mode, implementation mode, large-repo scope control, file-upload review, SSRF review, dependency-risk triage, and a near-miss non-security request that should not trigger the skill
- Tightened behavior-defining prose across the full artifact set
  - Updated `README.md`, `AGENTS.md`, `assets/output-report-template.md`, and all `references/*` files for clearer wording and better internal consistency without changing security requirements or example behavior

### Version
- Bumped from 1.1.0 → 1.1.1
