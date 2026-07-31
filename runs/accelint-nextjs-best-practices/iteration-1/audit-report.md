# accelint-nextjs-best-practices audit report

## Grade
A-

## Key findings
- The skill already had strong domain coverage, good progressive disclosure, and a useful artifact set.
- The main gap was activation specificity: the description was solid but could be more assertive about when to use the skill in real Next.js work.
- The artifact hierarchy existed, but `SKILL.md` did not explicitly point agents to `references/quick-checklist.md` or to `scripts/README.md` as selective audit aids.
- Repo versioning convention required a `CHANGELOG.md`, but the skill directory did not have one.
- Requested artifact-set review found one repo-level mismatch: `/Users/brandon.pierce/Projects/agent-skills/scripts/README.md` does not exist; the skill-local `scripts/README.md` does.

## Applied optimizations
- Tightened `SKILL.md` frontmatter description to improve trigger coverage for Next.js-specific implementation, review, and architecture tasks while preserving scope boundaries.
- Added explicit workflow guidance in `SKILL.md` for:
  - reading `AGENTS.md` first,
  - using `references/quick-checklist.md` for triage,
  - loading detailed references only as needed,
  - using `scripts/README.md` selectively for heuristic scans.
- Updated `README.md` so the artifact loading order is clearer and consistent with the skill workflow.
- Added `CHANGELOG.md` in Keep a Changelog style and aligned `metadata.version` in `SKILL.md` to `1.1.1`.

## Remaining risks
- The skill still depends on static prose quality rather than eval-backed trigger benchmarking; description quality improved, but trigger behavior is not empirically validated here.
- Some README wording still references broad Next.js coverage while the detailed guidance is App Router-centric; this is acceptable but should stay monitored if Pages Router guidance is added later.
- The helper scripts are heuristic by design and may create false positives if over-trusted.

## Files changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-nextjs-best-practices/SKILL.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-nextjs-best-practices/README.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-nextjs-best-practices/CHANGELOG.md`
- `/Users/brandon.pierce/Projects/agent-skills/runs/accelint-nextjs-best-practices/audit-report.md`
