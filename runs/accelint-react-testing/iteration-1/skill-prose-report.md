# accelint-react-testing skill prose report

## Summary

Completed an audit-plus-rewrite pass in strict mode for `skills/accelint-react-testing`.

Applied safe, behavior-preserving edits directly across the artifact set:
- tightened local structure in `SKILL.md`
- tightened wording in `AGENTS.md`
- ran a local-tightening sweep across all inspected `references/*.md` files
- aligned `CHANGELOG.md` with the `SKILL.md` version bump

No trigger-scope expansion or narrowing was introduced. The edits focused on clearer headings, more stable terminology, cleaner progressive-disclosure instructions, and removal of small wording inconsistencies.

## Highest-risk issues found

1. `SKILL.md` had locally inconsistent guidance strength and formatting in the loading workflow, which made the progressive-disclosure contract harder to scan.
2. `references/user-events.md` had a duplicated closing takeaway and a wording defect (`trackingises`) that reduced confidence in the file's polish.
3. Several reference files used inconsistent heading casing and inline-code treatment for behavior-bearing API names, which made the artifact set less uniform than it should be.

## Files changed

- `skills/accelint-react-testing/SKILL.md`
- `skills/accelint-react-testing/CHANGELOG.md`
- `skills/accelint-react-testing/AGENTS.md`
- `skills/accelint-react-testing/references/query-priority.md`
- `skills/accelint-react-testing/references/query-variants.md`
- `skills/accelint-react-testing/references/user-events.md`
- `skills/accelint-react-testing/references/async-testing.md`
- `skills/accelint-react-testing/references/custom-render.md`
- `skills/accelint-react-testing/references/accessibility-queries.md`
- `skills/accelint-react-testing/references/anti-patterns.md`

## Files inspected and left unchanged

- `skills/accelint-react-testing/README.md` — Rewrite would add drift risk without meaningful clarity gain
- `skills/accelint-react-testing/assets/output-report-template.md` — Already near minimum safe form for its template purpose
- `skills/accelint-react-testing/assets/custom-render-template.tsx` — Not a prose-governing artifact for this pass
- `skills/accelint-react-testing/evals/evals.json` — Not a prose-governing artifact for this pass

## Change details

### 1. Frontmatter and version alignment
- Bumped `metadata.version` in `SKILL.md` from `1.2.0` to `1.2.1`
- Added a matching `1.2.1` entry to `CHANGELOG.md`
- Normalized `Vitest` and `Jest` capitalization in the compatibility field

### 2. `SKILL.md` rewrite focus
- Reworked the "How to Use" section for cleaner scan order and more consistent instruction phrasing
- Preserved the same loading triggers and file references
- Tightened the "Important Notes" section without changing behavior

### 3. `AGENTS.md` rewrite focus
- Tightened the introductory note and usage steps
- Clarified the anti-pattern summary without changing scope

### 4. Reference-file local-tightening sweep
Applied low-risk, behavior-preserving edits across the inspected reference set:
- standardized behavior-bearing API names in headings with inline code where helpful
- normalized title casing and imperative phrasing
- cleaned up small wording rough edges
- removed an obvious duplicated takeaway in `references/user-events.md`

## Behavioral safety checks

- Trigger coverage preserved: yes
- Workflow order preserved: yes
- Guardrail strength preserved: yes
- Exact file paths and script names preserved: yes
- Boundary guidance preserved: yes

## Output classification for unchanged inspected behavior-bearing files

- `README.md` — Rewrite would add drift risk without meaningful clarity gain

## Conclusion

The artifact set is now more internally consistent and easier to scan, while preserving the same trigger logic, workflow semantics, and boundaries.
