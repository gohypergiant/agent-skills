# accelint-design-foundation audit report

Overall grade: **B+**

## Audit basis
- **Executed audit evidence:** `/skill:skill-creator` Stage 1 audit run over `skills/accelint-design-foundation`
- **Static repository evidence:** `SKILL.md`, `AGENTS.md`, `README.md`, `references/*`, `evals/evals.json`, `CHANGELOG.md`
- **Prior-run evidence:** `runs/accelint-design-foundation/iteration-1/*`

## Strengths
- **Strong domain specificity.** The skill stays focused on real `@accelint/design-foundation` and `@accelint/design-toolkit` behaviors: semantic tokens, semantic spacing, outlines, CSS modules, and `@variant` usage.
- **Useful progressive disclosure.** The package separates primary instructions from deeper references, which fits the skill format well.
- **Good troubleshooting coverage.** The package clearly covers missing `@reference`, missing PostCSS plugin, bad import order, and `#globals` resolution.
- **Reasonable eval breadth.** `evals/evals.json` covers styling, migration, setup diagnosis, variants, and spacing confusion.
- **Version alignment is currently correct.** `metadata.version` and `CHANGELOG.md` match.

## Weaknesses
- **`SKILL.md` is dense and repetitive.** It contains both operating instructions and substantial reference material that overlaps with `AGENTS.md` and `references/`.
- **Package docs have drift.** `README.md` says the semantic spacing scale is a "seven-step" scale, while `SKILL.md`, `AGENTS.md`, and `references/spacing-scale.md` describe eight steps including `oversized`.
- **Reference loading guidance is not as lean as intended.** The main skill file still embeds large setup, token, spacing, and troubleshooting sections that partially duplicate the dedicated references.
- **Variant guidance has mild internal tension.** `SKILL.md` strongly prefers `@variant` blocks over attribute selectors, but `references/variant-system.md` includes raw `[data-*]` selector examples in explanatory sections, which can blur the preferred pattern.
- **Eval maturity is limited.** Prior iteration evidence exists, but there is no strong benchmarked evidence set with assertions and graded outputs in the skill package workflow.

## Evidence-grounded improvement opportunities
1. **Trim `SKILL.md` and push more detail to references.** Keep the root skill focused on trigger/selection logic, setup-first workflow, key guardrails, and response pattern.
2. **Fix package-level documentation drift.** Align `README.md` with the authoritative eight-step spacing model.
3. **Standardize variant guidance across files.** Reinforce the preferred pattern consistently: `data-*` attributes in markup, `@variant` blocks in CSS modules.
4. **Strengthen eval maturity.** Add assertions or clearer success criteria around semantic-token preference, CSS-module preference, and setup diagnosis quality.
5. **Clarify source hierarchy.** Make `SKILL.md` the behavioral entrypoint, `AGENTS.md` the quick lookup, and `references/` the detailed examples.

## Bottom line
This is a strong specialized skill with credible domain knowledge. The main issues are **density, duplication, and documentation drift**, not lack of expertise. Targeted tightening should improve reliability without requiring a broad rewrite.
