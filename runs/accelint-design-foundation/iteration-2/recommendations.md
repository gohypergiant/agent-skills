# accelint-design-foundation recommendations

## Recommendation 1
- **Issue observed:** `README.md` contradicts the skill's canonical spacing model by describing a seven-step semantic scale, while the skill package elsewhere documents eight steps including `oversized`.
- **Evidence type:** Static audit evidence
- **Evidence:** Direct file inspection shows `skills/accelint-design-foundation/README.md` says "seven-step scale (`xxs`, `xs`, `s`, `m`, `l`, `xl`, `xxl`)" while `SKILL.md`, `AGENTS.md`, and `references/spacing-scale.md` describe `xxs → xs → s → m → l → xl → xxl → oversized`.
- **Recommended improvement:** Update `README.md` so it matches the eight-step spacing model and uses the same wording as the canonical skill materials.
- **Expected benefit:** Reduces documentation drift and lowers the chance that maintainers or users copy the wrong spacing guidance into future skill revisions or examples.
- **Confidence level:** High

## Recommendation 2
- **Issue observed:** `SKILL.md` is dense and repeats setup, token, spacing, and troubleshooting detail that already exists in `AGENTS.md` and `references/`.
- **Evidence type:** Executed audit evidence + static audit evidence
- **Evidence:** The Stage 1 `/skill:skill-creator` audit explicitly identified `SKILL.md` as dense and repetitive. Direct inspection confirms that the root file contains long embedded sections for setup requirements, token categories, spacing scale, common issues, and notes that overlap with `references/setup.md`, `references/token-reference.md`, `references/spacing-scale.md`, and `references/troubleshooting.md`.
- **Recommended improvement:** Trim `SKILL.md` to emphasize behavior: trigger logic, setup-first workflow, key guardrails, progressive-disclosure routing, and response pattern. Keep detailed catalogs and troubleshooting in `references/`.
- **Expected benefit:** Reduces context load during skill use, makes the main operating instructions easier to follow, and strengthens the intended progressive-disclosure design.
- **Confidence level:** High

## Recommendation 3
- **Issue observed:** Variant guidance is not fully normalized across the package, which can weaken the preferred pattern of `data-*` attributes in markup plus `@variant` blocks in CSS modules.
- **Evidence type:** Executed audit evidence + static audit evidence
- **Evidence:** The Stage 1 `/skill:skill-creator` audit noted mild internal tension. Direct inspection shows `SKILL.md` strongly discourages attribute selectors for variants, while the package still contains explanatory material that could leave readers with a weaker distinction between implementation mechanism and preferred authoring pattern.
- **Recommended improvement:** Tighten prose in the root skill so the preferred authoring pattern is unmistakable when variants are discussed, without broad restructuring of the reference files.
- **Expected benefit:** Improves consistency in variant-related answers while keeping changes narrow and evidence-aligned.
- **Confidence level:** Medium

## Recommendation 4
- **Issue observed:** The package's source hierarchy is implied but not as lean as it could be, which makes maintenance harder.
- **Evidence type:** Executed audit evidence + static audit evidence
- **Evidence:** The Stage 1 audit recommended clarifying the package roles: `SKILL.md` as behavioral entrypoint, `AGENTS.md` as quick lookup, and `references/` as detailed canonical examples. File inspection confirms overlapping content between these layers.
- **Recommended improvement:** When tightening `SKILL.md`, explicitly route detailed setup, token, spacing, and troubleshooting lookups to the existing references instead of duplicating those details in the main file.
- **Expected benefit:** Makes future maintenance safer and reduces cross-file drift.
- **Confidence level:** High

## Recommendation 5
- **Issue observed:** Eval coverage exists, but there is no direct executed benchmark evidence in this run proving which deeper behavioral changes improve output quality.
- **Evidence type:** Reproducible workflow blocker
- **Evidence:** The current assignment requires a single headless optimization pass and report generation, not the full human-review benchmark loop from `skill-creator`. That limits confidence in making broad behavioral rewrites based on output performance.
- **Recommended improvement:** Keep implementation changes minimal and documentation-focused in this pass; avoid broad rewrites that would normally require executed eval comparisons and human review.
- **Expected benefit:** Keeps this iteration evidence-grounded and avoids overfitting or speculative changes.
- **Confidence level:** High
