# Optimizations Applied

## 1. Reframed hard-edged performance numbers as heuristics
- **recommendation addressed:** Reframe exact performance numbers and deterministic claims as heuristics.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-tanstack-query-best-practices/SKILL.md`, `skills/accelint-tanstack-query-best-practices/README.md`
- **summary of implementation:** Rewrote the list-item query warning to avoid claiming a fixed request count in all cases, softened structural-sharing guidance from a hard `>1000 items` rule to a profiling-driven heuristic, and renamed observer thresholds in the README to observer-count heuristics with less rigid wording.
- **reason this change matches the evidence:** Stage 1 directly observed exact numeric thresholds and deterministic language in `SKILL.md` and `README.md` without accompanying caveats. These edits preserve the performance guidance while better matching the uncertainty visible in the repository evidence.

## 2. Reduced instruction rigidity in core guidance
- **recommendation addressed:** Reduce over-prescriptive wording in the main skill body.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-tanstack-query-best-practices/SKILL.md`
- **summary of implementation:** Tightened several high-impact bullets so they distinguish between hard-stop safety issues and context-dependent performance smells. The new wording still warns about costly patterns, but it guides the agent to verify context before prescribing a fix.
- **reason this change matches the evidence:** Stage 1 found the main skill to be dense and highly normative. Adjusting wording in the most rigid sections is a minimal change that directly addresses that evidence without broad restructuring.

## 3. Removed the orphaned output template asset and aligned docs
- **recommendation addressed:** Remove or repurpose the orphaned output template asset.
- **evidence type supporting it:** Static audit evidence / repository observation
- **files changed:** `skills/accelint-tanstack-query-best-practices/assets/output-report-template.md` (deleted), `skills/accelint-tanstack-query-best-practices/README.md`
- **summary of implementation:** Deleted the unreferenced `output-report-template.md` asset and removed its mention from the README’s package structure section.
- **reason this change matches the evidence:** Stage 1 found that `SKILL.md` did not reference this asset and that its content did not clearly serve the skill’s runtime use case. Removing it reduces maintenance surface and makes the package structure more coherent.

## 4. Tightened fallback guidance without broad rewrites
- **recommendation addressed:** Preserve scenario routing while shortening fallback guidance where possible.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-tanstack-query-best-practices/SKILL.md`
- **summary of implementation:** Adjusted the troubleshooting guidance for structural sharing so it points to evaluation and profiling rather than prescribing a single threshold-based action.
- **reason this change matches the evidence:** The observed issue was not missing content but over-specific fallback guidance. This targeted edit narrows only the most brittle case and avoids unrelated refactors.

## Not applied
- **recommendation not applied:** Add repository-visible executed eval artifacts.
- **why not applied:** This workflow did not provide or generate executed eval outputs for the skill package itself, so there was no evidence basis for manufacturing benchmark claims. Confidence limits were preserved instead of papered over.
