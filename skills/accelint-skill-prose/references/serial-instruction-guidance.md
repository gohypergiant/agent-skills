# Serial-Instruction and Workflow-Integrity Rubric

## Audit objective

Evaluate whether behavior-defining prose makes its established workflow order, prerequisites, gates, branches, and completion conditions observable without inventing new controls from formatting preferences or inferred intent.

Sequence is behavior-bearing when the source explicitly states timing, dependency, approval, validation, branch, or output-use relationships. A heading, numbered item, warning, or rationale alone is not proof of a mandatory dependency.

## Observable criteria

Evaluate and cite the target text for each applicable criterion:

1. **Ordered actions and prerequisites** — Identify explicit sequence markers, output dependencies, `before`/`after` rules, and required earlier results.
2. **Gates and stop conditions** — Identify explicit `wait`, `stop`, `do not proceed`, approval, validation, and retry conditions. Do not turn a warning or rationale into a gate unless the source states the dependency.
3. **Completion and failure routes** — Check whether later work relies on a completion condition or failure route that the prose makes visible.
4. **Branches and rejoin points** — Check that conditional paths name their destinations and do not imply mutually exclusive actions must both occur.
5. **Workflow-unit clarity** — Distinguish actions, gates, readiness checks, stage notes, and branch handlers. Flag mixed clauses or ambiguous referents only when they create plausible competing execution paths.
6. **Structural equivalence** — When a rewrite changes stages, checkpoints, numbering, branch routes, or reference topology, compare those mechanics against the source and classify it as structural.
7. **Bounded structural authority** — Check whether the prose allows an evidence-backed structural improvement when structure causes instruction skipping, ambiguity, or ineffective behavior, while preserving behavior by default.

## Grade each category on the shared 0–5 scale

- **0 — Critical behavioral defect:** explicit wording permits, requires, or obscures behavior likely to alter scope, safety, approval, or execution order.
- **1 — Major defect:** a material conflict or ambiguity makes compliance unreliable.
- **2 — Needs revision:** a concrete workflow weakness could create drift, but the intended behavior is recoverable.
- **3 — Adequate:** workflow mechanics are mostly clear; only bounded, lower-risk improvements remain.
- **4 — Strong:** order, gates, branches, and completion conditions are precise and traceable; no material defect is found.
- **5 — Exemplary:** strong plus explicit, consistent workflow mechanics and low ambiguity without redundant controls.

This local scale prioritizes findings. It is not a validated measurement instrument and must not conceal unresolved evidence.

## Required finding record

For this rubric, record:

- grade and finding state: `finding`, `no issue found`, `unresolved`, or `not applicable with evidence`;
- exact source text for the action, dependency, gate, branch, or structural landmark;
- the concrete execution risk and why it follows from that text;
- a prioritized, actionable recommendation that names the specific action, dependency, gate, branch, or completion condition to change; explains the workflow order, approval, return route, or exact anchor that must be preserved; and gives a rewrite action; and
- the change classification: wording-only, behavior-preserving structural rewrite, or approval-required change.

## Recommendation and approval rules

- A **wording-only** recommendation may clarify an explicit sequence or referent without moving actions, changing a gate, or adding a condition.
- A **behavior-preserving structural rewrite** is warranted only when cited structure—not only wording—causes a real ambiguity, hidden dependency, missed action, or ineffective behavior. Trace preserved actions, gates, approvals, rationales, exact anchors, branches, and return routes.
- An **approval-required** change alters a source-established trigger, workflow order, checkpoint, approval rule, guardrail strength, exact technical meaning, or repository-defined boundary.
- Recommend **no change** when order is already explicit and a restructure would only change presentation or add pseudo-steps.

## Remediation guide

| Finding | Concrete remediation |
|---|---|
| Later work relies on an unstated earlier result | Cite both clauses; make the existing dependency explicit or report it as unresolved if the dependency is only inferred. |
| Explicit gate is buried or softened | Surface the existing gate near the action it controls; preserve its timing and failure route. |
| A branch has no destination or rejoin | Name the source-supported destination and rejoin point; ask before defining a missing branch policy. |
| One clause combines conflicting workflow roles | Separate existing action, condition, and rationale only when their order remains traceable. |
| Structure causes repeated ambiguity | Propose a bounded structural rewrite and trace its equivalence; request approval if it changes protected workflow mechanics. |
