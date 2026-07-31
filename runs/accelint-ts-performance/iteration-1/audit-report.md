# accelint-ts-performance audit report

Grade: B+

## Key findings
- Strong package shape: `SKILL.md`, `AGENTS.md`, `README.md`, references, and report template are present and internally aligned.
- Good knowledge delta: the package focuses on concrete optimization patterns and category-based reference loading rather than generic TypeScript advice.
- Clear workflow coverage: audit, analysis, optimization, and verification steps are present.
- Main quality issue: the skill overstated certainty by instructing agents to treat all static findings as audit-worthy bottlenecks even when profiling data is absent.
- Secondary issue: some guidance encouraged broad reference loading and inline optimization comments more often than necessary.
- Gap noted: no `CHANGELOG.md` or `evals/` directory was present in this skill package.

## Applied optimizations
- Updated `skills/accelint-ts-performance/SKILL.md` to:
  - prefer profiler-backed hotspots when available
  - distinguish measured bottlenecks from static opportunities
  - tighten progressive-disclosure guidance so only relevant references are loaded
  - soften inline-comment guidance to avoid noisy code comments when reports or PR notes are better
- Updated `skills/accelint-ts-performance/AGENTS.md` to:
  - reinforce evidence-first categorization
  - label static-review findings as likely opportunities instead of proven hotspots
  - tighten profiling wording for consistency with `SKILL.md`

## Recommended next improvements
1. Add `CHANGELOG.md` and keep it aligned with `metadata.version`.
2. Add targeted eval cases for:
   - profiler-backed audit requests
   - static-review-only audit requests
   - hot-path vs cold-path micro-optimization decisions
   - cases where the correct outcome is to decline low-value optimization
3. Reduce duplicated wording between `SKILL.md` and `AGENTS.md` where possible.
4. Consider adding one short reference on measurement hygiene for benchmarks and regression checks.

## Semver guidance
- Likely bump if released: patch.
- Rationale: behavior is clarified and made safer without changing the skill's core purpose or reference set.
