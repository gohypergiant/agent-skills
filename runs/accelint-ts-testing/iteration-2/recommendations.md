# Evidence-Based Recommendations: accelint-ts-testing

## 1. Tighten the quick-start assertion guidance
- **issue observed:** The quick-start example labels `toBe` as a “loose assertion,” which does not match the skill’s stricter definition of loose assertions elsewhere.
- **evidence type:** Static audit evidence
- **evidence:** `skills/accelint-ts-testing/references/quick-start.md` says “Uses loose assertion (`toBe` instead of `toEqual`)`, while `skills/accelint-ts-testing/SKILL.md` and `skills/accelint-ts-testing/AGENTS.md` focus the prohibition on genuinely loose assertions such as `toBeTruthy()` and `toBeDefined()`, and explicitly note that `toBeTypeOf()` is not loose.
- **recommended improvement:** Rewrite the quick-start issue list and transformation notes so they justify `toEqual` on precision or matcher intent, not by calling `toBe` categorically loose.
- **expected benefit:** Removes an internal contradiction in a high-visibility example and improves trust in the skill’s assertion guidance.
- **confidence level:** High

## 2. Align package identity language around Vitest-specific scope
- **issue observed:** The package identity is slightly split between `accelint-ts-testing` and the body/README title “Vitest Best Practices.”
- **evidence type:** Static audit evidence
- **evidence:** `skills/accelint-ts-testing/SKILL.md` frontmatter name is `accelint-ts-testing`, but the H1 is `# Vitest Best Practices`; `skills/accelint-ts-testing/README.md` uses the same “Vitest Best Practices” title. The description itself is Vitest-specific, so the mismatch is mostly naming, not scope drift.
- **recommended improvement:** Add a small clarifying phrase near the top of `SKILL.md` and `README.md` that explicitly frames the skill as the repository’s TypeScript-testing skill for Vitest and Vitest-style workflows, without renaming the package.
- **expected benefit:** Reduces ambiguity for maintainers and future edits while preserving the established package name and trigger scope.
- **confidence level:** Medium

## 3. Make the quick-start nesting example match the skill’s own nesting rule more closely
- **issue observed:** The quick-start “correct” example uses two nested `describe()` levels plus an `it()`, while the skill strongly emphasizes avoiding excessive nesting and preferring clearer test names.
- **evidence type:** Static audit evidence
- **evidence:** `skills/accelint-ts-testing/SKILL.md` says “NEVER nest describe blocks more than 2 levels deep” and prefers putting context into test names. `skills/accelint-ts-testing/references/quick-start.md` shows a fixed version with `describe('ProductService')` and `describe('Add new product')` for a single simple test.
- **recommended improvement:** Simplify the quick-start improved example to keep the organizational lesson while using the flattest structure that still demonstrates the pattern.
- **expected benefit:** Makes the canonical example better reflect the skill’s maintainability guidance and lowers the chance that readers over-learn nesting from the first example.
- **confidence level:** Medium

## 4. Leave broad structure and eval coverage unchanged
- **issue observed:** No direct evidence supports broad rewrites to workflow structure, reference layout, or eval scope.
- **evidence type:** Static audit evidence
- **evidence:** Stage 1 audit found strong package structure, strong trigger description quality, good progressive disclosure, and an eval suite in `skills/accelint-ts-testing/evals/evals.json` that already covers positive, negative, and boundary cases across the skill’s scope.
- **recommended improvement:** Limit this iteration to precision and consistency fixes in the visible guidance files instead of broad refactors.
- **expected benefit:** Preserves proven strengths and reduces risk of regressions from unsupported changes.
- **confidence level:** High

## Blockers / confidence constraints
- **issue observed:** No executed eval outputs, transcripts, or benchmark artifacts were present for this iteration, so recommendation strength is based on static repository evidence rather than live behavior under test.
- **evidence type:** Reproducible environment/repository evidence
- **evidence:** `runs/accelint-ts-testing/iteration-2/` initially contained only `status.json`; no eval transcripts, benchmark files, or viewer feedback artifacts were available to inspect.
- **recommended improvement:** Treat this iteration as a minimal, evidence-bounded consistency pass and avoid behavioral claims that would require executed eval evidence.
- **expected benefit:** Keeps conclusions traceable to observed facts and prevents over-claiming confidence.
- **confidence level:** High
