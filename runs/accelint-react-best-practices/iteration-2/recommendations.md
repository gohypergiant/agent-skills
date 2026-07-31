# Recommendations: accelint-react-best-practices

## 1. Sync eval support docs with the actual 16-case eval set
- **Issue observed:** `evals/assertions.md` documents only 8 evals, while `evals/evals.json` contains 16 active eval cases.
- **Evidence type:** Direct repository inspection
- **Evidence:** `skills/accelint-react-best-practices/evals/evals.json` includes evals 1-16, including React Compiler branching, Activity, audit/report behavior, and non-trigger boundary cases. `skills/accelint-react-best-practices/evals/assertions.md` stops at 8 cases and omits the newer coverage.
- **Recommended improvement:** Update `evals/assertions.md` so it reflects all 16 evals and their current assertion intent.
- **Expected benefit:** Reduces package drift, makes eval coverage legible to maintainers, and keeps future optimization work grounded in the real test surface.
- **Confidence level:** High

## 2. Reduce top-level instruction load in `SKILL.md` by trimming repeated summary material
- **Issue observed:** The root `SKILL.md` carries both routing guidance and a large amount of direct explanatory material, including anti-pattern summaries, examples, philosophy, and repeated React Compiler reminders.
- **Evidence type:** Static audit evidence
- **Evidence:** `skills/accelint-react-best-practices/SKILL.md` includes long top-level sections such as `NEVER Do React`, `Examples`, `Using Skill Patterns Appropriately`, `Important Notes`, `Performance Philosophy`, and `Code Quality Principles`, even though the package already has `AGENTS.md` and focused `references/` files for progressive disclosure.
- **Recommended improvement:** Make targeted cuts in `SKILL.md` that preserve behavior but move or collapse repeated explanatory material in favor of routing to existing support artifacts.
- **Expected benefit:** Better progressive disclosure, lower root-context load when the skill triggers, and less duplication to maintain.
- **Confidence level:** Medium-High

## 3. Tighten repeated React Compiler messaging so it appears once as a decision gate, not in multiple overlapping summaries
- **Issue observed:** React Compiler guidance is repeated across root artifacts in a way that appears more duplicative than additive.
- **Evidence type:** Static audit evidence
- **Evidence:** React Compiler checks appear in `skills/accelint-react-best-practices/SKILL.md` under `Before Optimizing Performance, Ask` and again under `Important Notes`; similar messaging also appears in `skills/accelint-react-best-practices/AGENTS.md` and `skills/accelint-react-best-practices/README.md`.
- **Recommended improvement:** Keep the prominent compiler decision gate, but remove or compress nearby repeated summaries in `SKILL.md` so the skill points to `references/react-compiler-guide.md` for detail instead of restating it multiple times.
- **Expected benefit:** Cleaner routing, less repetition, and lower risk that future edits update one summary but not the others.
- **Confidence level:** Medium

## 4. Preserve the strong React-only boundary, but sharpen root wording around audit usage instead of broadening triggers further
- **Issue observed:** The description is already strong, and the audit found no version mismatch or missing package components. The bigger risk is over-broadening rather than under-specifying.
- **Evidence type:** Static audit evidence
- **Evidence:** `skills/accelint-react-best-practices/SKILL.md` already covers writing, reviewing, refactoring, debugging, optimizing, and auditing React code, while also excluding backend-only work. The package includes audit support via `assets/output-report-template.md` and matching audit sections in the root skill.
- **Recommended improvement:** Do not broaden the frontmatter in this run. Instead, keep any wording changes focused on clearer audit-path routing inside the body and support docs.
- **Expected benefit:** Preserves current trigger coverage while reducing the chance of accidental scope creep.
- **Confidence level:** Medium

## 5. Avoid broad structural rewrites in this pass
- **Issue observed:** The available evidence shows drift and redundancy, but not a broken package or failed eval run.
- **Evidence type:** Stage 1 audit evidence only
- **Evidence:** Stage 1 graded the skill **B+**, citing package completeness, strong trigger boundaries, and good support artifacts, with the main issues being top-level tightness and stale eval documentation rather than missing capabilities.
- **Recommended improvement:** Apply minimal, high-value fixes only: sync eval docs and tighten root prose where duplication is directly observable.
- **Expected benefit:** Improves maintainability without risking regressions from an unjustified rewrite.
- **Confidence level:** High
