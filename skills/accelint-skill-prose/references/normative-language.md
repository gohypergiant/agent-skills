# Normative-Language and Obligation-Precision Rubric

## Authority and scope

This rubric uses [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174.html), which updates RFC 2119, as the primary reference for BCP 14 terms. In an artifact that adopts BCP 14, `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` have their RFC-defined meanings **only when they appear in all capitals**. RFC 8174 does not make lower-case words non-normative in ordinary English; it only does not assign them BCP 14's special meaning.

Audit behavior-defining prose for obligation precision. Do not use this rubric to infer a requirement level from rhetorical emphasis alone or to normalize language mechanically.

## Audit objective

Confirm that requirements, recommendations, permissions, prohibitions, and timing limits retain their intended force and applicability across the target artifact set.

## Observable criteria

Evaluate and cite the target text for each applicable criterion:

1. **BCP 14 applicability** — Identify whether the artifact explicitly adopts BCP 14. Interpret the defined all-caps terms accordingly only when it does.
2. **Force preservation** — Check that `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, `MAY`, `DO NOT`, and `NEVER` retain their source-supported strength after an edit.
3. **Softening and elevation** — Flag a mandatory rule softened into advice and optional guidance elevated into a requirement.
4. **Context and applicability** — Check that obligation language names the actor, condition, scope, timing, or exception needed to apply it correctly.
5. **Cross-section consistency** — Check for conflicting obligation levels, exceptions, or timing across headings, prose, examples, and linked behavior-bearing files.
6. **Informal labels and verbs** — Treat terms such as `critical`, `mandatory`, `important`, `optional`, `stop`, `wait`, `proceed`, `skip`, `require`, and `allow` as contextual evidence. Flag unresolved force; do not assign them an RFC level without source support.

## Grade each category on the shared 0–5 scale

- **0 — Critical behavioral defect:** explicit wording permits, requires, or obscures behavior likely to alter scope, safety, approval, or execution order.
- **1 — Major defect:** a material conflict or ambiguity makes compliance unreliable.
- **2 — Needs revision:** a concrete obligation weakness could create drift, but the intended behavior is recoverable.
- **3 — Adequate:** obligation meaning is mostly clear; only bounded, lower-risk improvements remain.
- **4 — Strong:** force, applicability, and cross-file use are precise and traceable; no material defect is found.
- **5 — Exemplary:** strong plus explicit, consistent applicability and low ambiguity without redundant controls.

This local scale prioritizes findings. It is not a validated measurement instrument and must not conceal unresolved evidence.

## Required finding record

For this rubric, record:

- grade and finding state: `finding`, `no issue found`, `unresolved`, or `not applicable with evidence`;
- the exact target text and neighboring text that establish the finding;
- the behavior risk: softening, elevation, conflict, unclear applicability, or unsupported normalization;
- a prioritized, actionable recommendation that names the specific obligation wording, applicability condition, or conflicting requirement to change; explains the force, scope, timing, exception, or exact-anchor behavior that must be preserved; and gives a rewrite action; and
- the change classification: wording-only, behavior-preserving structural rewrite, or approval-required change.

## Recommendation and approval rules

- A **wording-only** recommendation may clarify an explicit source-supported obligation without changing its force, actor, scope, timing, exception, or exact anchor.
- A **behavior-preserving structural rewrite** may separate conflicting or buried existing rules only when the audit traces every preserved obligation and does not create a new gate, exception, or requirement.
- An **approval-required** change alters trigger coverage, workflow order, guardrail strength, exact technical meaning, or a repository-defined approval boundary.
- Recommend **no change** when the wording is already explicit, consistent, and source-supported, or when normalization would require inference.

## Remediation guide

| Finding | Concrete remediation |
|---|---|
| Hard requirement became advice | Restore the source-supported prohibition or requirement; cite the original rule and affected condition. |
| Optional guidance became mandatory | Restore discretionary language or ask for approval to change policy. |
| Informal severity is ambiguous | Preserve the label and flag the missing policy context; do not choose `MUST` or `SHOULD` by tone alone. |
| BCP 14 terms are inconsistent | Align the terms only when the source explicitly establishes the intended obligation; otherwise report the conflict. |
| Sections conflict | Name both passages, the conflicting outcome, and the policy decision needed to reconcile them. |
