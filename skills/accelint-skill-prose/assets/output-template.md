# accelint-skill-prose output template

Complete this template for every `accelint-skill-prose` invocation. Show it by default; omit it from the user-facing response only under the report-visibility rule in `../SKILL.md`.

Keep the report factual. Do not imply that a file was inspected, a category was assessed, a finding was verified, a citation was packet-verified, or a user approved a change unless that happened.

## Required report content

- State whether complete high-assurance coverage, recovered validator coverage, or degraded assurance was achieved; list completed isolated reviewers, independent-validator status, and report visibility.
- List the complete artifact set or disclose incomplete discovery.
- Report every mandatory rubric category separately; do not average or vote on local grades.
- If a reviewer is unavailable, retain its category with state `unresolved`, identify the unavailable reviewer and lost coverage, and record the failure in uncertainty rather than fabricating a grade or evidence.
- For every completed category, include grade, state, cited evidence, behavior risk or no-change rationale, an actionable recommendation, change classification, and uncertainty.
- For every finding, make the recommendation name the specific wording, structure, or requirement to change and the behavior-preservation intent when relevant.
- Synthesize applicable recommendations into one prioritized, top-down rewrite proposal before the rewritten version.
- Keep grades local and heuristic. Do not aggregate them into a claim that the audit is validated or complete when evidence is unresolved.
- Identify every unavailable reviewer or validator, invalid validator record, error or missing output, coverage lost, retry availability, and resulting degraded-assurance limit.
- State all approval requests, decisions, and work blocked while awaiting a decision.
- For every independent-validator claim, record the validation packet, artifact version, path, heading or Step, verbatim quote, claim supported, and packet-verification result.

## Template

```md
## Summary
- Task: [brief description]
- Workflow: [mandatory high-assurance workflow: fixed behavior ledger, isolated rubric reviews, fresh synthesis, rewrite, validation packet, and independent validation]
- Assurance state: [complete high-assurance coverage | complete high-assurance coverage with recovered validator coverage | degraded assurance]
- Role coverage: [normative reviewer: complete/unavailable; workflow reviewer: complete/unavailable; STE reviewer: complete/unavailable; user-question reviewer: complete/unavailable; independent validator: complete/unavailable/recovered]
- Degraded-assurance limit: [none, or unavailable role, error/missing output, lost coverage, retry availability, and what must not be claimed]
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

## Independent validation and behavior check
- Validation packet: [packet ID; original and rewritten snapshot identifiers]
- Changed-section map: [path and heading or Step for every changed section]
- Validator attempts:
  1. [complete | invalid | unavailable; reason]
  2. [complete | invalid | unavailable | not run; reason]
- Recovery status: [not needed | recovered validator coverage | degraded assurance]
- Claim evidence:
  - Artifact version: [original | rewritten]
  - Path: [exact path]
  - Location: [heading or Step]
  - Quote: [verbatim]
  - Claim supported: [specific assertion]
  - Packet verification: [passed | failed]
- Independent-validator result: [passed with packet-verified evidence | unavailable; degraded assurance]
- Trigger coverage: [preserved | explicitly approved change | incomplete verification]
- Workflow semantics: [preserved | explicitly approved change | incomplete verification]
- Guardrail strength: [preserved | explicitly approved change | incomplete verification]
- Exact technical references: [preserved | explicitly approved change | incomplete verification]

## Risks or limits
- [state unresolved evidence, incomplete discovery, invalid validator record, or `None noted`]
```

## Report-visibility notes

- **Default:** Give the assurance state and role coverage, category-level audit, prioritized rewrite proposal, rewritten version, then this completed report and independent validation.
- **`--quiet`:** Complete the same high-assurance workflow internally and return only the rewritten version.
- **Explicit no-report request:** Suppress the audit and report only when the user unambiguously asks not to show the audit, findings, or report. A generic request for a concise response does not suppress reporting.
