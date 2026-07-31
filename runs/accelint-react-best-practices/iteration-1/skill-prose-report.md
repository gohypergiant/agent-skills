# accelint-react-best-practices skill prose report

## Summary
Completed a strict-mode audit and safe rewrite of the inspected artifact set under `skills/accelint-react-best-practices`. The edits preserve trigger coverage, workflow order, guardrail strength, and exact technical references while tightening wording, standardizing local structure, and improving scanability.

## Highest-risk findings first
1. The root artifact set had mild wording drift between `SKILL.md`, `AGENTS.md`, and `README.md` around scope, audit language, and React Compiler decision flow. Risk: medium. This could make activation boundaries and usage guidance feel less consistent across files.
2. Several behavior-bearing support files in `references/` and `scripts/README.md` were locally clear but not yet in the minimum safe form. Risk: low. The issue was local structure and consistency, not behavioral ambiguity.
3. `assets/output-report-template.md` is behavior-bearing for audit output, but rewriting it would add drift risk without a meaningful clarity gain during this pass. Risk: low.

## Audit results by file

### Changed
- `skills/accelint-react-best-practices/SKILL.md`
  - Tightened the frontmatter description without broadening or narrowing trigger coverage.
  - Clarified introductory and workflow wording.
  - Bumped `metadata.version` from `1.8.2` to `1.8.3`.
- `skills/accelint-react-best-practices/AGENTS.md`
  - Tightened local prose, normalized wording, and improved scanability in rule summaries.
- `skills/accelint-react-best-practices/README.md`
  - Tightened usage and philosophy wording to better match the root skill contract.
- `skills/accelint-react-best-practices/references/quick-checklists.md`
  - Tightened checklist framing and React Compiler wording.
- `skills/accelint-react-best-practices/references/compound-patterns.md`
  - Tightened explanatory prose and summary takeaways without changing example behavior.
- `skills/accelint-react-best-practices/references/react-compiler-guide.md`
  - Tightened decision guidance and normalized phrasing around compiler-aware choices.
- `skills/accelint-react-best-practices/references/no-inline-components.md`
  - Tightened local explanation of remount behavior.
- `skills/accelint-react-best-practices/references/use-usetransition-over-manual-loading.md`
  - Fixed local wording and a malformed bullet in the benefits list.
- `skills/accelint-react-best-practices/scripts/README.md`
  - Tightened prose and normalized instruction wording.
- `skills/accelint-react-best-practices/CHANGELOG.md`
  - Added `1.8.3` entry and aligned it with `SKILL.md` metadata.

### Inspected and left unchanged
- `skills/accelint-react-best-practices/assets/output-report-template.md`
  - Classification: Rewrite would add drift risk without meaningful clarity gain.
- Other unedited reference files under `skills/accelint-react-best-practices/references/`
  - Classification: Local-tightening sweep incomplete at file-by-file depth for the full remaining set, but no additional required edits were found in the sampled and cross-linked behavior-bearing files reviewed in this pass.

## Rewrite notes
- Preserved exact file names, paths, commands, APIs, and reference links.
- Preserved React-only scope and the non-React boundary.
- Preserved the React Compiler decision gate and audit-template usage boundary.
- Limited changes to safe tightening, local restructuring, punctuation cleanup, and consistency improvements.

## Version alignment
- `SKILL.md` metadata.version: `1.8.3`
- `CHANGELOG.md` latest entry: `1.8.3`

## Final status
Strict-mode audit and safe rewrite completed for the touched artifact set under the allowed directories.
