# accelint-skill-prose output template

Use this template for all `accelint-skill-prose` outputs.

Keep the report factual. Do not imply that a file was reviewed, changed, or left unchanged unless you actually inspected it.

## Required behavior

- Report what changed and why.
- Report what did not change and why when that file was in the artifact set.
- Keep paths exact.
- Keep reasons tied to behavior safety, clarity, consistency, local sentence-structure quality, trigger coverage, workflow semantics, guardrail strength, or exact technical meaning.
- If discovery was incomplete, say so explicitly.
- If no other artifact-set files changed, say that directly.

## Template

```md
## Summary
- Task: [brief description of the work]
- Output mode: [audit only | rewrite only | audit plus rewrite]
- Rewrite mode: [mode=default | mode=strict | not applicable]
- Artifact set reviewed: [list the files or say the crawl was incomplete]

## What changed
- `[exact/path/to/file]`
  - Changed: [yes/no]
  - Why: [behavior-preserving reason for the change, or `Not changed` reason if this file belongs in the artifact set]
  - Notes: [brief description of what changed, such as terminology normalization, structure tightening, guardrail clarification, or example preservation]

## Other artifact-set files
- `[exact/path/to/file]`
  - Changed: [yes/no]
  - Why: [why it was changed, or why it stayed unchanged]
  - Notes: [brief detail]
- `[exact/path/to/another-file]`
  - Changed: [yes/no]
  - Why: [why it was changed, or why it stayed unchanged]
  - Notes: [brief detail]

## Behavior check
- Trigger coverage: [preserved / not applicable / incomplete verification]
- Workflow semantics: [preserved / not applicable / incomplete verification]
- Guardrail strength: [preserved / not applicable / incomplete verification]
- Exact technical references: [preserved / not applicable / incomplete verification]

## Risks or limits
- [state any incomplete crawl, unresolved alignment question, or say `None noted`]
```

## Usage notes

- For folder-level work, include the root `SKILL.md`, sibling `AGENTS.md` if present, relevant `references/*.md`, and any other linked instruction files you inspected.
- When a behavior-bearing artifact-set file stays unchanged, use the `Why:` field to record the required unchanged-file classification exactly.
- If a file stayed unchanged because it was already aligned, classify it explicitly as `Already near minimum safe form` or `Rewrite would add drift risk without meaningful clarity gain`, whichever is accurate.
- If a file stayed unchanged because local-tightening follow-through is still pending, classify it explicitly as `Local-tightening sweep incomplete`.
- If a file stayed unchanged because it was out of scope, say that directly.
- If no `AGENTS.md` exists, do not fabricate an entry for it.
- For audit-only outputs, give the audit findings first, then append this template.
- For rewrite-only outputs, return the rewrite first, then append this template.
- For audit-plus-rewrite outputs, give the risk summary first, then the rewrite, then append this template.