# Stage 2 Recommendations — accelint-ts-best-practices

All recommendations below are grounded in empirical evidence from direct repository inspection performed in Stage 1. No executed eval evidence was collected in this run, so recommendations based only on static audit evidence are labeled explicitly.

## 1. Remove or replace the missing audit example reference
- **Issue observed:** The audit template points to a non-existent example file.
- **Evidence type:** Static audit evidence
- **Evidence:** `skills/accelint-ts-best-practices/assets/output-report-template.md` references `assets/audit-report-example.md`, but that file is not present in the package.
- **Recommended improvement:** Remove the broken reference or replace it with guidance that relies only on existing package files.
- **Expected benefit:** Prevents dead-end reads, reduces wasted tool calls, and improves package trustworthiness.
- **Confidence level:** High

## 2. Make the operational workflow harder to miss from `SKILL.md`
- **Issue observed:** Key workflow requirements live in `AGENTS.md`, but `SKILL.md` does not clearly surface the most important ones.
- **Evidence type:** Static audit evidence
- **Evidence:** `SKILL.md` tells the agent to start with `AGENTS.md`; `AGENTS.md` contains materially stronger instructions such as loading `references/quick-start.md` for implementation work and `input-validation.md` for external data.
- **Recommended improvement:** Add a short “minimum workflow” note in `SKILL.md` that explicitly calls out the highest-value next reads after `AGENTS.md`, especially `references/quick-start.md` and task-specific references for external data or audits.
- **Expected benefit:** Increases consistency of live skill use and reduces the chance of shallow invocation that stops at the overview.
- **Confidence level:** Medium-high

## 3. Soften absolute rule wording where context may matter
- **Issue observed:** Some guidance appears as universal prohibitions rather than default recommendations.
- **Evidence type:** Static audit evidence
- **Evidence:** `AGENTS.md` includes hard phrasing around patterns like `enum`, `interface`, and null/undefined returns.
- **Recommended improvement:** Reframe the most absolute statements as strong defaults with brief exception criteria where codebase or framework constraints legitimately differ.
- **Expected benefit:** Preserves the skill’s opinionated stance while reducing over-application risk in mixed or constrained codebases.
- **Confidence level:** Medium

## 4. Add a lightweight response shape for non-audit uses
- **Issue observed:** The skill defines the formal audit template well, but gives little structure for targeted review/fix requests where the formal template is not appropriate.
- **Evidence type:** Static audit evidence
- **Evidence:** `SKILL.md` explains when not to use `assets/output-report-template.md` but does not define a compact alternative response pattern.
- **Recommended improvement:** Add a brief non-audit output guideline, for example: identify the issue, explain why it matters, reference the applicable rule, then apply or suggest the fix directly.
- **Expected benefit:** Improves consistency for direct implementation and quick-review requests without expanding the skill significantly.
- **Confidence level:** Medium-high

## 5. Preserve current scope boundaries and avoid broad rewrites
- **Issue observed:** The current package already shows strong routing boundaries and modular structure.
- **Evidence type:** Static audit evidence
- **Evidence:** `SKILL.md`, `AGENTS.md`, and `evals/evals.json` consistently distinguish this skill from performance and documentation adjacent skills.
- **Recommended improvement:** Limit optimization to targeted workflow and prose improvements rather than restructuring the package.
- **Expected benefit:** Retains known-good package behavior while addressing the highest-value issues observed.
- **Confidence level:** High

## Confidence note
Because this run did not include executed evals, all recommendations are based on static audit evidence only. That limits certainty about behavioral impact, so recommendations favor minimal, low-risk changes over larger rewrites.
