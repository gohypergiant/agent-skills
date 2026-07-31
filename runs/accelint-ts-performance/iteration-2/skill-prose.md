# Skill Prose Audit: accelint-ts-performance

## Scope
- Target skill: `skills/accelint-ts-performance`
- Mode: audit plus rewrite, strict mode
- Frontmatter: explicitly skipped and unchanged

## Files audited
- `skills/accelint-ts-performance/SKILL.md`
- `skills/accelint-ts-performance/AGENTS.md`
- `skills/accelint-ts-performance/README.md`
- `skills/accelint-ts-performance/assets/output-report-template.md`
- `skills/accelint-ts-performance/references/batching.md`
- `skills/accelint-ts-performance/references/cache-storage-api.md`

## Rewrites applied

### 1. `SKILL.md`
- Tightened wording for clarity and consistency without changing behavior.
- Replaced several all-caps or heavier phrases with clearer imperative prose.
- Improved measured-vs-static wording so hypothesis-level findings are stated more precisely.
- Clarified several workflow labels, table headings, and explanatory sentences to reduce ambiguity.

### 2. `AGENTS.md`
- Tightened summary prose and improved readability in the usage guidance and category descriptions.
- Preserved rule meaning and category structure.

### 3. `README.md`
- Tightened overview and quick-start language.
- Preserved documented package structure and usage boundaries.

### 4. `assets/output-report-template.md`
- Tightened instructional prose in the template comments.
- Preserved required report structure.
- Kept the Stage 3 warning-block rewrite aligned with the earlier evidence-based hot-path calibration change.

### 5. `references/batching.md`
- Tightened guardrail and decision-check wording.
- Preserved batching guidance and examples.

### 6. `references/cache-storage-api.md`
- Tightened explanatory prose around synchronous storage cost and cache invalidation.
- Preserved code examples and recommendations.

## Files not rewritten in this stage
Not all remaining reference files were re-audited in this stage. No claim is made here about them being fully prose-optimized.

## Behavioral safety notes
- Frontmatter was not edited.
- Trigger boundaries were preserved.
- No structural workflow changes were introduced.
- Changes were prose-only in intent, except for the earlier Stage 3 evidence-based template/reference fixes already documented in `optimizations.md`.

## Confidence
- **High** for the files listed above: edits were direct repository changes and were read back after modification.
- **Limited overall** because this stage did not execute evals; confidence is based on direct file inspection and resulting diffs only.

## Environment/tooling blockers
- The subagent reached its turn limit before producing this report artifact, so this report was completed manually from direct inspection of the changed files.
