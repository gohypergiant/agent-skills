# accelint-qrspi-archive eval coverage report

## Summary
- Total eval cases: 28
- Scope: trigger coverage, non-trigger boundaries, happy path flow, preflight recovery, prompt handling, conflict stops, spec-writing behavior, index maintenance, and reporting.

## Scenario categories

### Trigger and routing
Covers direct archive requests, bulk-archive requests, and wording that emphasizes cross-linking plus index bookkeeping. Also covers clear non-trigger cases for propose, apply, synthesis, pruning, and status rewrites. This matters because the skill description is precise and the main failure mode here is false activation on nearby OpenSpec tasks.

### Happy path workflow
Covers single-change and bulk archive end-to-end behavior. These cases verify that the skill owns the full workflow, runs the native archive command itself, and continues through bookkeeping instead of stopping after merge completion.

### Preflight and input recovery
Covers missing or malformed design frontmatter, derivable candidate confirmation, hard stop when no candidate exists, missing Purpose headings, brand-new capabilities, and single-capability archives. These matter because the skill has a narrow recovery path for some missing inputs and a hard stop for others.

### Interactive prompt handling
Covers the mandatory yes answer for routine sync prompts and user escalation for non-routine prompts such as overlap confirmation. This matters because the skill distinguishes between prompts it must answer itself and prompts it must surface.

### Archive execution boundaries
Covers mid-run branching behavior, unresolved conflict handling, and the rule against substituting the raw openspec CLI for the archive skill. These are high-signal boundaries because the skill is explicit about why archive runs inline and when the workflow must stop.

### Validation and cross-link computation
Covers extracted-record validation and the rule that co-touch pairs are computed within each change, not across unrelated changes in the same batch. This matters because bad extraction or incorrect pair grouping would silently corrupt related-spec links.

### Spec writing behavior
Covers unconditional subagent use for spec writing and the degraded inline fallback when subagents are unavailable. This matters because the skill treats spec-writing isolation as normal behavior, not an optimization.

### Index maintenance
Covers row-level patching of openspec/specs/INDEX.md, bootstrap full-build behavior when that file is missing, archive index append behavior before trailing content, current-only status writes, and archive-folder date sourcing. These cases matter because the skill's file-writing rules are detailed, brittle, and easy to regress.

### Final reporting
Covers the requirement to call out unresolved Purpose-heading outcomes and to avoid stopping after native archive completes. This matters because the skill promises a continuous workflow and a concise but meaningful completion summary.

## Why this set is high-signal
The eval set focuses on behaviors that are unique to this skill rather than generic OpenSpec usage. It stresses the archive-vs-synthesis boundary, the additive-only relationship model, the inline archive plus delegated spec-writing split, and the targeted index update rules. Those are the parts most likely to drift or be implemented incorrectly.
