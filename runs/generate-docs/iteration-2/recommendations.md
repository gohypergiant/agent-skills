# Recommendations — generate-docs

## 1. Compress overlapping audience-filtering and exclusion guidance
- **issue observed:** `SKILL.md` repeats similar ideas across `Audience Filter`, `Exclude by default`, `Consumer Relevance Test`, `Translate Instead of Copying`, and later style checks.
- **evidence type:** Static audit evidence
- **evidence:** Stage 1 repository audit found multiple overlapping sections in `skills/generate-docs/SKILL.md` covering the same decision rule: prefer user-facing relevance and omit maintainer-only internals. This was directly observed during file inspection.
- **recommended improvement:** Merge overlapping rules into fewer, denser sections while preserving the concrete examples that help the model translate internal instructions into human-facing docs.
- **expected benefit:** Lower context cost, less instruction collision, and better consistency on narrower doc requests.
- **confidence level:** High

## 2. Tighten the published-doc expectation around missing in-repo output
- **issue observed:** The repo does not currently include `docs/content/docs/generate-docs/index.mdx`, so the skill has no in-repo example of its own output path.
- **evidence type:** Executed/tool evidence
- **evidence:** A direct path check during Stage 1 found no matching published docs page for this skill under `docs/content/docs/*generate-docs*`.
- **recommended improvement:** Clarify in `SKILL.md` that published docs may or may not already exist for the target skill and that validation/update behavior should adapt accordingly instead of assuming an existing page.
- **expected benefit:** Reduces the chance of the model implicitly assuming a live docs page exists before generating or validating docs.
- **confidence level:** Medium

## 3. Make validation deliverables more explicit for validation-only requests
- **issue observed:** The skill defines several validation checks, but the expected human-facing output shape for validation-only work is less explicit than the generate/update flows.
- **evidence type:** Static audit evidence
- **evidence:** Stage 1 audit observed concrete validation steps in `skills/generate-docs/SKILL.md`, but no equally concise summary of what the user should receive back when they ask only to validate docs.
- **recommended improvement:** Add a short output expectation for validation mode, such as stale docs, broken links, missing frontmatter, structural issues, and orphaned docs.
- **expected benefit:** Better consistency in validation-only responses and clearer user expectations.
- **confidence level:** Medium-High

## 4. Do not broaden changes beyond instruction clarity
- **issue observed:** Eval coverage is already broad, and no executed benchmark or grading artifacts were available to justify deeper workflow changes.
- **evidence type:** Blocker / missing empirical run evidence
- **evidence:** Stage 1 found `skills/generate-docs/evals/evals.json` with 22 cases, but no observed run outputs, benchmark results, or grading artifacts.
- **recommended improvement:** Keep this iteration focused on high-value prose and workflow clarity improvements rather than structural rewrites, new subflows, or eval redesign.
- **expected benefit:** Maintains alignment with evidence strength and avoids overfitting to unobserved issues.
- **confidence level:** High
