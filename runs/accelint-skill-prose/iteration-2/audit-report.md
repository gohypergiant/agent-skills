# Stage 1 Audit Report — accelint-skill-prose

## Audit summary
- **Overall grade:** A-
- **Audit method:** `/skill:skill-creator` audit of the live skill package, grounded in direct repository inspection.
- **Evidence limits:** No executed benchmark/grading artifacts were observed in the skill package during this stage, so performance conclusions are limited to static package quality and directly observed eval coverage rather than measured pass/fail outcomes.

## Strengths

1. **Strong trigger definition and boundaries**  
   - **Evidence type:** Static audit evidence  
   - The frontmatter description clearly defines both positive triggers and non-goals, especially the “behavior-defining prompt artifacts” scope and the exclusion of broader content strategy or domain review.  
   - Source: `skills/accelint-skill-prose/SKILL.md`

2. **Clear operating model**  
   - **Evidence type:** Static audit evidence  
   - The skill distinguishes output mode from rewrite mode, defines a priority order, and includes explicit hard stops against trigger drift, workflow reordering, guardrail weakening, and stealth rewrites.  
   - Source: `skills/accelint-skill-prose/SKILL.md`

3. **Well-structured progressive disclosure**  
   - **Evidence type:** Static audit evidence  
   - The root file points to focused references by job: trigger logic, workflow safety, RFC 2119 normalization, STE-compatible phrasing, examples, artifact patterns, and final checklist review.  
   - Sources: `skills/accelint-skill-prose/SKILL.md`, `skills/accelint-skill-prose/references/*.md`

4. **Strong artifact-set and cross-file guidance**  
   - **Evidence type:** Static audit evidence  
   - The package consistently treats folder-level work as one distributed behavior contract and requires explicit justification for unchanged files.  
   - Sources: `skills/accelint-skill-prose/SKILL.md`, `skills/accelint-skill-prose/references/checklist.md`, `skills/accelint-skill-prose/references/workflow-guardrails.md`, `skills/accelint-skill-prose/assets/output-template.md`

5. **Versioning is currently aligned**  
   - **Evidence type:** Direct repository evidence  
   - `metadata.version` in `SKILL.md` matches the latest `CHANGELOG.md` entry at `0.7.9`.  
   - Sources: `skills/accelint-skill-prose/SKILL.md`, `skills/accelint-skill-prose/CHANGELOG.md`

## Weaknesses

1. **Root instruction file remains dense**  
   - **Evidence type:** Static audit evidence  
   - The skill is structured, but the root `SKILL.md` still carries a large amount of repeated guidance that also appears in references, increasing cognitive load and future drift risk.

2. **Frontmatter description could differentiate more sharply from adjacent prose skills**  
   - **Evidence type:** Static audit evidence  
   - The description is good, but edge-case differentiation versus general English/prompt-polishing skills could be clearer, especially in cases where wording controls behavior rather than style.

3. **No observed executed eval results in-package**  
   - **Evidence type:** Direct repository evidence / tooling limitation  
   - `evals/evals.json` exists and appears broad, but no benchmark/grading outputs were observed in the skill package, limiting confidence in real measured behavior.

4. **README undersells evaluation and governance posture**  
   - **Evidence type:** Static audit evidence  
   - The README explains purpose and file layout, but it does not summarize eval philosophy or version/governance expectations as clearly as the root skill package materials do.

## Observed repository evidence

- **Eval coverage exists and is substantial**  
  - **Evidence type:** Direct repository evidence  
  - `skills/accelint-skill-prose/evals/evals.json` contains **35 evals** spanning audit-only compliance, frontmatter boundaries, workflow verb preservation, folder-level artifact discovery, unchanged-file classifications, RFC 2119 normalization, referent ambiguity, and compact-format preservation.

- **Behavior-supporting references are present and specialized**  
  - **Evidence type:** Direct repository evidence  
  - The package includes:  
    - `references/checklist.md`  
    - `references/frontmatter-descriptions.md`  
    - `references/workflow-guardrails.md`  
    - `references/rfc-2119.md`  
    - `references/ste-compatible-rules.md`  
    - `references/examples.md`  
    - `references/artifact-patterns.md`

## Top improvement opportunities

1. Reduce duplication pressure between `SKILL.md` and reference files while preserving the current contract.
2. Sharpen frontmatter differentiation against nearby general prose-editing skills.
3. Improve maintainer-visible evidence by surfacing eval intent or latest benchmark context more clearly.
4. Tighten README coverage for evaluation/governance expectations.

## Confidence note
This audit is **high confidence** on static structure and package consistency, **medium confidence** on optimization priorities, and **lower confidence** on measured behavior because no executed eval outputs or benchmark artifacts were observed during Stage 1.
