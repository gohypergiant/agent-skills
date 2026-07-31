# accelint-design-foundation optimizations

## Applied recommendation 1
- **Recommendation addressed:** Fix package-level documentation drift around the spacing scale.
- **Evidence type supporting it:** Static audit evidence
- **Files changed:** `skills/accelint-design-foundation/README.md`
- **Summary of implementation:** Updated the README so it now describes the semantic spacing model as an eight-step scale and includes `oversized` in the enumerated scale.
- **Reason this change matches the evidence:** The mismatch was directly observed by comparing `README.md` against `SKILL.md`, `AGENTS.md`, and `references/spacing-scale.md`. This was a factual consistency correction.

## Applied recommendation 2
- **Recommendation addressed:** Reduce `SKILL.md` duplication and strengthen progressive disclosure.
- **Evidence type supporting it:** Executed audit evidence + static audit evidence
- **Files changed:** `skills/accelint-design-foundation/SKILL.md`
- **Summary of implementation:** Added an explicit source-hierarchy section near the top, compressed the setup requirements into a concise verification checklist, shortened token and spacing sections into routing guidance, and replaced the long common-issues section with pointers to `references/setup.md` and `references/troubleshooting.md`.
- **Reason this change matches the evidence:** The Stage 1 `/skill:skill-creator` audit identified `SKILL.md` as dense and repetitive, and direct inspection confirmed that the root skill duplicated reference-level material. These edits preserve behavior while reducing context load.

## Applied recommendation 3
- **Recommendation addressed:** Make the preferred variant authoring pattern unmistakable.
- **Evidence type supporting it:** Executed audit evidence + static audit evidence
- **Files changed:** `skills/accelint-design-foundation/SKILL.md`, `skills/accelint-design-foundation/references/variant-system.md`
- **Summary of implementation:** Tightened the root skill to state the default pattern explicitly: use `data-*` attributes in markup and `@variant` blocks in CSS modules. Updated `references/variant-system.md` so its main examples now follow that pattern, including React Aria state styling and custom variants.
- **Reason this change matches the evidence:** The audit found mild internal tension in variant guidance. These edits remove ambiguity without introducing new behavior.

## Applied recommendation 4
- **Recommendation addressed:** Clarify the package source hierarchy.
- **Evidence type supporting it:** Executed audit evidence + static audit evidence
- **Files changed:** `skills/accelint-design-foundation/SKILL.md`
- **Summary of implementation:** Added a dedicated source-hierarchy section describing `SKILL.md` as the behavioral entrypoint, `AGENTS.md` as quick lookup, and `references/*.md` as the detailed scenario-specific sources.
- **Reason this change matches the evidence:** The Stage 1 audit recommended clearer separation of roles across package layers, and direct inspection showed overlapping responsibilities.

## Recommendation not applied
- **Recommendation not applied:** Strengthen eval maturity with executed benchmark evidence and assertions.
- **Why not applied:** This run was constrained to a single headless optimization pass and did not include the full `skill-creator` benchmark-and-human-review loop. Broad eval or behavior changes would have exceeded the available empirical basis.
