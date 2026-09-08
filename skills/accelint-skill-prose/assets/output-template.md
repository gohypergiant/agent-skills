# accelint-skill-prose output template

Complete this template for every `accelint-skill-prose` invocation. Show it by default; omit it from the user-facing response only under the report-visibility rule in `../SKILL.md`.

Keep the report factual. Do not imply that a file was inspected, a category was assessed, a finding was verified, or a user approved a change unless that happened.

## Required report content

- State the review coverage; list completed isolated reviewers, unavailable reviewers, and report visibility.
- List the complete artifact set or disclose incomplete discovery.
- Report every mandatory rubric category separately; do not average or vote on local grades.
- If a reviewer is unavailable, retain its category with state `unresolved`, identify the unavailable reviewer and lost coverage, and record the failure in uncertainty rather than fabricating a grade or evidence.
- For every completed category, include grade, state, cited evidence, behavior risk or no-change rationale, an actionable recommendation, change classification, and uncertainty.
- For every finding, make the recommendation name the specific wording, structure, or requirement to change and the behavior-preservation intent when relevant.
- Synthesize applicable recommendations into one prioritized, top-down rewrite proposal before the rewritten version.
- Keep grades local and heuristic. Do not aggregate them into a claim that the audit is complete when evidence is unresolved.
- State all approval requests, decisions, and work blocked while awaiting a decision.

## Template

```md
## Summary
- Task: [brief description]
- Workflow: [mandatory review workflow: fixed behavior ledger, isolated rubric reviews, fresh synthesis, rewrite, and output]
- Review coverage: [all four isolated reviewers complete | incomplete; name unavailable reviewer, error/missing output, and lost category coverage]
- Report visibility: [default | suppressed by `--quiet` | suppressed by explicit no-report request]
- Artifact set reviewed: [exact paths, or disclose incomplete discovery]

## Mandatory rubric audit

### 1. Normative-language and obligation precision
- Grade: [0–5, or `not assigned` when its reviewer is unavailable]
- State: [finding | no issue found | unresolved | not applicable with evidence]
- Evidence: [exact source text and path]
- Risk or no-change rationale: [concrete explanation]
- Recommendation: [specific, actionable change; include behavior-preservation intent when relevant]
- Change classification: [wording-only | behavior-preserving structural rewrite | approval-required]
- Uncertainty: [limitation or none]

### 2. Serial instruction and workflow integrity
- Grade: [0–5, or `not assigned` when its reviewer is unavailable]
- State: [finding | no issue found | unresolved | not applicable with evidence]
- Evidence: [exact source text and path]
- Risk or no-change rationale: [concrete explanation]
- Recommendation: [specific, actionable change; include behavior-preservation intent when relevant]
- Change classification: [wording-only | behavior-preserving structural rewrite | approval-required]
- Uncertainty: [limitation or none]

### 3. STE-compatible clarity and usability
- Grade: [0–5, or `not assigned` when its reviewer is unavailable]
- State: [finding | no issue found | unresolved | not applicable with evidence]
- Evidence: [exact source text and path]
- Risk or no-change rationale: [concrete explanation]
- Recommendation: [specific, actionable change; include behavior-preservation intent when relevant]
- Change classification: [wording-only | behavior-preserving structural rewrite | approval-required]
- Uncertainty: [limitation or none]

### 4. User-question and waiting behavior
- Grade: [0–5, or `not assigned` when its reviewer is unavailable]
- State: [finding | no issue found | unresolved | not applicable with evidence]
- Evidence: [exact source text and path]
- Risk or no-change rationale: [concrete explanation]
- Recommendation: [specific, actionable change; include behavior-preservation intent when relevant]
- Change classification: [wording-only | behavior-preserving structural rewrite | approval-required]
- Uncertainty: [limitation or none]

## Prioritized rewrite proposal

1. [highest-priority proposed change, the recommendations it addresses, and its behavior-preservation intent]
2. [next proposed change, the recommendations it addresses, and its behavior-preservation intent]
3. [continue through every applicable recommendation, or state `No behavior-preserving change was warranted`]

## Rewritten version

[rewritten version, or the unchanged source when no behavior-preserving change was warranted]

## Changes and approvals
- `[exact/path/to/file]`
  - Changed: [yes/no]
  - Why: [behavior-preserving reason or why no change was warranted]
  - Change type: [wording-only | structural | approval-required]
- Approval status: [approved change, pending approval, or none required]
- Blocked work: [none, or exact work held pending an answer]

## Risks or limits
- [state unresolved evidence, incomplete discovery, unavailable reviewer, or `None noted`]
```

## Report-visibility notes

- **Default:** Give the review coverage, category-level audit, prioritized rewrite proposal, rewritten version, then this completed report.
- **`--quiet`:** Complete the same review workflow internally and return only the rewritten version.
- **Explicit no-report request:** Suppress the audit and report only when the user unambiguously asks not to show the audit, findings, or report. A generic request for a concise response does not suppress reporting.
