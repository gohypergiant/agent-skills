# Evidence-Based Recommendations

## 1. Reframe hard-edged performance numbers as heuristics
- **issue observed:** `SKILL.md` presents several exact thresholds and examples as fixed rules, including observer-count bands, `>1000` item structural-sharing guidance, and a statement that 200 list items calling `useQuery` creates 200 network requests and 200 observers.
- **evidence type:** Static audit evidence
- **evidence:** Direct inspection of `skills/accelint-tanstack-query-best-practices/SKILL.md` shows exact numeric thresholds and deterministic wording without caveats.
- **recommended improvement:** Rewrite these statements as heuristics or common warning signs, and qualify where behavior depends on key identity, deduplication, payload shape, or update frequency.
- **expected benefit:** Reduces the chance that the skill gives brittle or overstated guidance while preserving the useful performance intuition.
- **confidence level:** High

## 2. Reduce instruction rigidity in the main SKILL body
- **issue observed:** The main file has a large “NEVER” section plus multiple matrices, tables, and fallback snippets. This makes the skill comprehensive, but also increases the risk of overlong or over-prescriptive responses.
- **evidence type:** Static audit evidence
- **evidence:** Direct inspection of `skills/accelint-tanstack-query-best-practices/SKILL.md` shows dense, highly normative instructions layered across many sections.
- **recommended improvement:** Tighten wording in the highest-risk sections so the skill distinguishes between critical safety guidance, strong defaults, and context-dependent heuristics.
- **expected benefit:** Keeps the skill usable for targeted advisory tasks and should improve response calibration without removing important guardrails.
- **confidence level:** High

## 3. Remove or repurpose the orphaned output template asset
- **issue observed:** `assets/output-report-template.md` appears unused and mismatched to the runtime use case.
- **evidence type:** Static audit evidence
- **evidence:** The asset exists in `skills/accelint-tanstack-query-best-practices/assets/output-report-template.md`, but `SKILL.md` does not reference it, and its content reads like a generic audit template rather than a TanStack Query-specific execution aid.
- **recommended improvement:** Remove the orphaned asset or replace it with a clearly referenced TanStack Query-specific output aid if one is actually needed.
- **expected benefit:** Improves package coherence and reduces maintenance surface for unused material.
- **confidence level:** High

## 4. Preserve the strong scenario-routing structure, but tighten fallback examples
- **issue observed:** The scenario-routing structure is a strength, but some fallback snippets in error tables and troubleshooting sections may encourage unnecessarily elaborate answers.
- **evidence type:** Static audit evidence
- **evidence:** `SKILL.md` includes detailed fallback code and verbose troubleshooting guidance in the “Common Error Patterns and Fixes” and “Troubleshooting Decision Tree” sections.
- **recommended improvement:** Keep the scenario routing intact, but shorten or simplify fallback examples so they act as escalation paths rather than default output shape.
- **expected benefit:** Maintains breadth while making the skill more likely to answer proportionally to the user’s actual problem.
- **confidence level:** Medium-High

## 5. Document confidence limits caused by missing executed eval artifacts
- **issue observed:** The package contains prompt-level eval definitions, but no executed benchmark, grading, or workspace artifacts were directly observed during this audit.
- **evidence type:** Static audit evidence / repository observation
- **evidence:** `skills/accelint-tanstack-query-best-practices/evals/evals.json` exists, but no repository-visible executed run outputs were inspected as part of Stage 1.
- **recommended improvement:** Keep optimization scope narrow and evidence-led in this run; avoid broad behavioral rewrites that would require executed eval confirmation to justify.
- **expected benefit:** Prevents overfitting changes to static review alone and keeps confidence proportional to the evidence available.
- **confidence level:** High

## 6. Keep versioning alignment strict when making even small skill changes
- **issue observed:** The package already has aligned skill metadata and changelog versions, so any optimization pass must preserve that alignment.
- **evidence type:** Repository observation
- **evidence:** `SKILL.md` metadata version is `1.4.1` and `CHANGELOG.md` contains a matching `1.4.1` entry.
- **recommended improvement:** If Stage 3 or 4 changes the package, apply a patch bump and update both the changelog entry and metadata version together.
- **expected benefit:** Maintains package governance consistency and avoids version drift.
- **confidence level:** High

## Confidence note
These recommendations are grounded in direct repository inspection rather than executed eval transcripts or benchmark outputs. Because no run artifacts were observed in Stage 1, recommendations favor minimal, high-value corrections over broad rewrites.
