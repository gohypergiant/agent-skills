# Optimizations — generate-docs

## 1. Compress overlapping audience-filtering and exclusion guidance
- **recommendation addressed:** Compress overlapping audience-filtering and exclusion guidance.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/generate-docs/SKILL.md`
- **summary of implementation:** Consolidated the audience-filtering area by tightening repeated include/exclude logic and replacing the longer `Consumer Relevance Test` wording with a shorter `Quick relevance test` that keeps the same decision criteria.
- **reason this change matches the evidence:** Stage 1 directly observed repeated instruction patterns in this part of the file. The edit reduces duplication without changing the skill’s behavior or scope.

## 2. Tighten expectation around missing existing published docs
- **recommendation addressed:** Clarify that a published docs page may not already exist.
- **evidence type supporting it:** Executed/tool evidence
- **files changed:** `skills/generate-docs/SKILL.md`
- **summary of implementation:** Updated the merge-logic section so non-interactive runs preserve prose conservatively rather than assuming broad regeneration is safe when docs already exist. This aligns better with cases where docs may be missing or partially present.
- **reason this change matches the evidence:** Stage 1 confirmed there is no `docs/content/docs/generate-docs/index.mdx` in-repo, so the skill should not implicitly lean on an assumption that a published page is already there or safely reviewable interactively.

## 3. Make validation deliverables explicit
- **recommendation addressed:** Clarify the expected output for validation-only requests.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/generate-docs/SKILL.md`
- **summary of implementation:** Added a concise validation-output summary listing the findings categories the user should receive back: stale docs, broken links, missing frontmatter, structural issues, and orphaned docs.
- **reason this change matches the evidence:** The skill already defined these checks, but Stage 1 found the human-facing output shape for validation-only work was less explicit than the generate/update flows.

## Not applied
- **recommendation not applied:** Any deeper workflow, eval, or structural refactor.
- **why:** No executed benchmark, grading, or transcript evidence was available to justify broader changes. This iteration stayed within high-confidence clarity improvements only.
