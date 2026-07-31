# Changelog

## [1.4.2] - 2026-07-31

### Fixed
- Reframed several `SKILL.md` and `README.md` performance thresholds and per-item query warnings as heuristics instead of hard rules, based on direct audit evidence that some guidance was more rigid than the repository evidence justified.
- Tightened root skill prose for scanability and workflow clarity while preserving frontmatter, trigger coverage, progressive-disclosure routing, and technical references.
- Removed the unreferenced `assets/output-report-template.md` asset and aligned the README package structure to the files actually used by the skill.

### Version
- Patch release at `1.4.2`.

## [1.4.1] - 2026-07-30

### Fixed
- Broadened and clarified `SKILL.md` trigger coverage so the skill applies to TanStack Query work across React and Next.js, with clearer negative boundaries for adjacent tools and state layers.
- Added explicit scope guidance and tightened scenario routing so Next.js-specific server/cache references load only when the stack actually uses App Router, hydration, or coordinated server cache behavior.
- Improved query performance guidance in `SKILL.md` by removing a brittle line-number reference and clarifying when `select` should use a stable module-level selector versus `useCallback`.
- Applied a behavior-preserving prose pass across the inspected `references/*.md` files to improve scanability, sentence structure, terminology consistency, and normative wording without changing technical guidance.
- Added `evals/evals.json` with coverage for QueryClient setup, key design, hydration, mutations, performance, multi-layer caching, and negative boundary cases.

### Version
- Patch release at `1.4.1`.
