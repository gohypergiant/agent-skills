# Stage 3 Optimizations — accelint-nextjs-best-practices

## Applied changes

### 1. Add an explicit Pages Router handling path in `SKILL.md`
- **recommendation addressed:** Add an explicit Pages Router handling path in `SKILL.md`.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-nextjs-best-practices/SKILL.md`
- **summary of implementation:** Added a new “Adapt to Router Context” section that tells agents to preserve the same security and performance principles but answer with `getServerSideProps`, Pages API routes, and Pages-era constraints when the user explicitly says Pages Router. It also warns against forcing App Router-only APIs into a Pages Router answer unless the request is about migration.
- **reason this change matches the evidence:** The description promised Pages Router support and the eval set included a Pages Router case, but the body was mostly App Router-centric.

### 2. Clarify task-shape triage before loading deeper references
- **recommendation addressed:** Clarify task-shape triage before loading deeper references.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-nextjs-best-practices/SKILL.md`
- **summary of implementation:** Added a “Fast Triage by Task Shape” section that distinguishes targeted fixes, broad audits, route-handler/Server Action reviews, and unclear diagnoses, with explicit guidance on whether to start from `AGENTS.md` or `references/quick-checklist.md`.
- **reason this change matches the evidence:** The package already had the right artifacts, but the body did not give enough guidance on which entry path to choose for common task shapes.

### 3. Add a current-docs verification rule for uncertain or version-sensitive behavior
- **recommendation addressed:** Add a current-docs verification rule for uncertain or version-sensitive Next.js behavior.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-nextjs-best-practices/SKILL.md`
- **summary of implementation:** Added a “Verify Version-Sensitive Claims When Needed” section directing agents to check official Next.js docs before making high-confidence claims when the request depends on a specific version or uncertain framework behavior.
- **reason this change matches the evidence:** The skill linked official docs already, but did not say when to use them; this was a direct gap in the instruction workflow.

### 4. Tighten route-handler guidance to cover proxy/header-forwarding/caching and memory-aware exports
- **recommendation addressed:** Tighten route-handler guidance to cover proxy/header-forwarding/caching and memory-aware exports.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-nextjs-best-practices/SKILL.md`
- **summary of implementation:** Added a “Route Handler Review Focus” section telling agents to check auth consistency, least-privilege header forwarding, caching safety for authenticated responses, and whether large exports are built entirely in memory instead of using safer response patterns.
- **reason this change matches the evidence:** The eval set already covered these route-handler scenarios more directly than the body did.

## Not applied

### No frontmatter or broad structural rewrite
- **recommendation not applied:** Any broad rewrite of the skill package.
- **why:** Evidence supported targeted body-level improvements only. The skill already had strong structure, compact size, and complete supporting artifacts.

## Scope control
- Changes were limited to `SKILL.md`.
- No unrelated references, evals, scripts, or assets were refactored.
- Frontmatter was intentionally left unchanged in this stage.
