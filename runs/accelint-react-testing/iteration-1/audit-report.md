# accelint-react-testing audit report

Grade: A-

## Key findings
- Strong knowledge delta: the skill focuses on Testing Library-specific anti-patterns, query strategy, async behavior, and accessibility-first testing.
- Good progressive disclosure: `SKILL.md` routes to focused reference files and scripts instead of overloading the main file.
- Main weaknesses were in activation precision and internal consistency, not domain coverage.
- The description under-signaled audit/review use cases and omitted common triggers such as `within()`, `waitForElementToBeRemoved`, and `*.spec.tsx`.
- `SKILL.md` had a numbering gap in the coverage list and slightly inconsistent wording around `screen`, `queryBy`, and `fireEvent` guidance.

## Exact improvements applied
- Updated `skills/accelint-react-testing/SKILL.md` description to:
  - include auditing as an explicit use case
  - add `within()`, `waitForElementToBeRemoved`, `*.test.jsx`, and `*.spec.tsx` as triggers
  - expand the query-priority chain to include `getByTestId`
  - add explicit query-variant coverage
- Fixed the coverage list numbering from `9` to `8` for `Audit Scripts`.
- Tightened the final notes in `SKILL.md` to reduce ambiguity and improve consistency around:
  - why to prefer `screen.*`
  - when to use `getBy*` vs `queryBy*`
  - what act warnings usually mean
  - when `fireEvent` is still acceptable
- Updated `skills/accelint-react-testing/CHANGELOG.md` and bumped `metadata.version` in `SKILL.md` from `1.0.0` to `1.1.0`.

## Remaining risks
- `SKILL.md` is still long for a top-level skill file; future maintenance may benefit from moving more repeated rationale into references.
- Some reference files may contain implementation examples that should be periodically spot-checked for library-version drift.
- `README.md` and `AGENTS.md` were not changed; they remain broadly consistent, but future edits should keep wording aligned across all skill artifacts.
