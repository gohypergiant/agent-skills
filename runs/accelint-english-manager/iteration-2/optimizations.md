# Stage 3 Optimizations — accelint-english-manager

## 1. Reduce doctrinal repetition between core and support docs
- **Recommendation addressed:** Reduce repeated doctrine across the package.
- **Evidence type supporting it:** Static audit evidence
- **Files changed:**
  - `skills/accelint-english-manager/references/examples.md`
  - `skills/accelint-english-manager/references/checklist.md`
- **Summary of implementation:**
  - Reframed `references/examples.md` as an example bank and pointed context adaptation work to `references/use-cases.md`.
  - Trimmed the trailing “when to use this file” section in `references/examples.md` to reduce restatement of core doctrine.
  - Reframed `references/checklist.md` as a deeper verification pass and clarified that it supplements the shorter self-check already in `SKILL.md`.
- **Reason this change matches the evidence:** The audit found repeated guidance about scanability, terminology stability, and mode judgment across multiple files. These edits sharpen file roles without changing behavior.

## 2. Tighten README consistency with actual skill workflow
- **Recommendation addressed:** Align README wording with `SKILL.md` mode-selection behavior.
- **Evidence type supporting it:** Static audit evidence
- **Files changed:**
  - `skills/accelint-english-manager/README.md`
- **Summary of implementation:**
  - Changed Quick Start wording from “for best results” to an operationally accurate statement that users should specify the mode up front when possible and that the skill should ask if it is missing.
  - Tightened the “When to use this skill” section and pointed readers to `SKILL.md` for canonical trigger and boundary language.
  - Reduced README example duplication and pointed readers to `references/examples.md` for more worked patterns.
- **Reason this change matches the evidence:** The audit found that the README slightly softened a workflow rule and repeated several details already documented elsewhere. These edits improve consistency and reduce duplication while preserving package intent.

## 3. Preserve the current behavioral model
- **Recommendation addressed:** Avoid broad rewrites without stronger evidence.
- **Evidence type supporting it:** Static audit evidence
- **Files changed:**
  - No behavioral changes to `SKILL.md` frontmatter or operating model
- **Summary of implementation:**
  - Kept the skill’s trigger model, mode model, output model, and constraint hierarchy unchanged.
- **Reason this change matches the evidence:** The audit showed strong quality, aligned versioning, and broad eval coverage, with no direct runtime evidence of behavior failure. Minimal structural cleanup was the highest-confidence path.

## Not applied
- **Recommendation not applied:** Edit `SKILL.md` itself to compress repeated doctrine.
- **Why not applied:** The strongest static evidence of duplication was in README and support references. Without executed eval regressions or transcript evidence, changing the core operating text was lower priority and carried more behavioral risk than the selected documentation-only changes.