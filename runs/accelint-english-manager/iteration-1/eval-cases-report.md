# accelint-english-manager eval coverage report

## Summary
Created and expanded the eval set for `accelint-english-manager` in:

- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/evals/evals.json`

Also wrote this coverage report to:

- `/Users/brandon.pierce/Projects/agent-skills/runs/accelint-english-manager/eval-cases-report.md`

The eval set now contains 32 realistic cases designed to exercise the skill across its main behavior boundaries, output modes, and rewrite constraints.

## Coverage areas

### Output-mode coverage
- Audit-only cases that should not rewrite automatically
- Rewrite-only cases that should return only final text
- Audit-plus-rewrite cases that should present findings first, then revised text
- A mixed-mode case where the prompt explicitly requests audit first and default-mode rewrite second

### Rewrite-mode coverage
- Default-mode local rewrites that should stay close to source structure
- Strict-mode technical and procedural cases that should support stronger structural control
- A mode-selection case that checks the skill asks a short clarifying question instead of assuming a mode

### Preservation and constraint coverage
- Exact preservation of commands, file paths, product names, API names, channel names, config keys, and quoted text
- Preservation of obligation levels, uncertainty, and causal relationships
- Preservation of a user-specified exact sentence while rewriting surrounding prose
- A near-boundary case where the best behavior may be to recommend no rewrite

### Content-domain coverage
- Technical instructions and procedural warnings
- Error help text and engineering updates
- UI helper text
- Support replies and customer-facing notes
- Release notes
- Internal teammate notes
- Product/docs prose, including LLM-written documentation
- Hybrid persuasive technical prose
- Policy and obligation wording with RFC-2119 normalization pressure

## Notable scenarios
- Audit-only prompts that explicitly forbid rewriting, to catch over-eager cleanup behavior
- Strict-vs-default pairs around procedural text, to distinguish local cleanup from controlled technical rewriting
- Exact-text preservation for `"npm run build"`, `/apps/docs/content.config.ts`, `settings.json`, `sync --apply`, `retryMode=adaptive`, and an unchanged quoted policy sentence
- Uncertainty-sensitive cases that should not overstate root cause or impact
- Note-format cases that should improve scanability without turning into checklists or procedures
- Obligation-drift cases that test whether informal severity labels are normalized without changing meaning
- A mode-clarification case that should produce a short question instead of rewriting immediately

## Schema notes
- Kept the top-level schema as `{ "skill_name", "evals" }`
- Kept each eval object schema-valid with `id`, `prompt`, `expected_output`, `files`, and `expectations`
- Preserved existing high-value cases and expanded around uncovered boundaries rather than replacing the set wholesale

## Result
The eval set should now provide substantially better coverage for meaningful skill behavior, especially around:
- audit vs rewrite separation
- default vs strict mode handling
- tone preservation
- exact-token preservation
- technical/plain-language balance
- near-boundary decisions where the safest action is small or no change
