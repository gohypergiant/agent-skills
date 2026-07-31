# accelint-skill-prose audit report

## Overall grade
A-

## Key findings
- The root skill is strong and internally consistent. It has clear operating controls, strong hard stops, progressive-disclosure guidance, and a substantial eval set covering behavior-preserving rewrites.
- The main concrete gap was in `assets/output-template.md`. Its usage notes did not yet mirror the root skill's stricter unchanged-file classification rule, so a follower could still produce artifact-set status reports that were less precise than `SKILL.md` now requires.
- The rest of the inspected artifact set was already near minimum safe form. I did not find a second localized issue that warranted a safe edit without also entering version/changelog territory.

## Applied optimizations
- Updated `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/assets/output-template.md` to require exact unchanged-file classifications for behavior-bearing artifact-set files:
  - `Already near minimum safe form`
  - `Rewrite would add drift risk without meaningful clarity gain`
  - `Local-tightening sweep incomplete`
- Added a usage-note reminder that the template's `Why:` field should carry that exact classification when an artifact-set file stays unchanged.

## Remaining risks
- `README.md` is directionally consistent, but it is still a consumer-facing summary rather than a full artifact-set contract. That is acceptable, but maintainers should continue to treat `SKILL.md` as canonical if future edits tighten reporting or folder-level rewrite rules again.
- I intentionally did not update `CHANGELOG.md` or `metadata.version`; versioning remains for the parent agent as requested.
