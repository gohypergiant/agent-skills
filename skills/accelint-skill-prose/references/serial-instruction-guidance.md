# Serial-Instruction and Workflow-Integrity Rubric

## Audit objective

Evaluate whether behavior-defining prose makes its established workflow order, prerequisites, gates, branches, and completion conditions observable without inventing new controls from formatting preferences or inferred intent.

Sequence is behavior-bearing when the source explicitly states a timing, data, approval, validation, state, branch, or output-use relationship. A heading, numbered item, warning, or rationale alone is not proof of a mandatory dependency.

## Evidence boundary

Treat source-established dependencies, gates, approvals, validations, completion conditions, failure routes, branch rules, and behavior-bearing reference relationships as workflow mechanics. Treat numbering, heading levels, bullets, checklists, phase labels, XML, and similar presentation choices as format conventions unless the source or active harness makes them behavior-bearing.

The serial-instruction research supports explicit dependencies and observable checks, but does not establish that a particular format or instruction-placement convention improves serial execution. Do not describe a format or placement preference as a compliance improvement without local, reproducible evidence for the intended model and harness. A user-requested or source-established format or placement convention may be a presentation choice, but must not be presented as a validated reliability control.

Treat an active progress tracker as operational state only when the source or active harness makes creating, exposing, updating, or consuming that state part of the workflow contract. Do not recommend a tracker by default or present it as a reliability control. A claim that a tracker improves serial completion is a local hypothesis that requires representative local evaluation; a passive checklist remains a presentation convention unless the source or harness makes it behavior-bearing.

When the target processes untrusted user or tool content, do not treat headings, format, document position, or in-document priority labels as evidence that trusted instructions will prevail. Distinguish a written authority rule from model, message-role, tool-permission, or harness enforcement. Report an authority-control limitation as a scoped model or harness concern; do not claim that a serial-format rewrite resolves it.

## Observable criteria

Evaluate and cite the target text for each applicable criterion:

1. **Explicit semantic dependencies** — Identify source-stated data, approval, validation, state, and output-use dependencies; `before`/`after` rules; and required earlier results. When a later action depends on an earlier result, check that the required prior result or release condition is named.
2. **Gates and stop conditions** — Identify explicit `wait`, `stop`, `do not proceed`, approval, validation, and retry conditions. Do not turn a warning or rationale into a gate unless the source states the dependency.
3. **Completion and failure routes** — When the source makes later work contingent on completion, validation, or approval, check that the prose exposes the success condition and the source-defined failure, retry, wait, or stop route. Do not invent a route when the source is silent.
4. **Branches, rejoin points, and constrained order** — Check that conditional paths name their destinations and do not imply that mutually exclusive actions must both occur. Require a particular action order only when the source defines a dependency, authorization, safety property, or irreversible transition that makes the order material; otherwise permit independent actions, recovery paths, and other source-valid routes to the outcome.
5. **Workflow-unit clarity and conflicting requirements** — Distinguish actions, gates, readiness checks, stage notes, and branch handlers. Flag mixed clauses or ambiguous referents when they create incompatible readings of the intended action, prerequisite, branch destination, timing, or completion condition. Also flag a repeated requirement when it adds no distinct source-established actor, condition, timing, route, exception, release condition, or obligation and creates avoidable instruction density. Do not remove repetition whose distinct control function is source-supported or unresolved. Do not use a fixed step, sentence, or document-length threshold.
6. **Structural equivalence** — When a rewrite reorganizes or re-expresses the presentation of a source-established dependency, gate, approval, validation point, completion condition, failure route, branch route, rejoin point, or behavior-bearing reference relationship, compare those mechanics against the source. Classify it as behavior-preserving structural only when every mechanic remains equivalent and traceable. A rewrite that alters any of those mechanics is approval-required. Treat numbering, heading levels, list style, and similar format conventions as structural only when the source or active harness makes them behavior-bearing.
7. **Evidence-bounded structural authority** — Check whether a proposed structural rewrite cites source evidence that the current organization obscures a source-established prerequisite, gate, branch route, return route, or conflicting control-flow reading. Research may support an evidence-informed hypothesis, but does not prove that a format or placement change improves compliance. Preserve behavior by default.

## Grade each category on the shared 0–5 scale

- **0 — Critical behavioral defect:** explicit wording permits, requires, or obscures behavior likely to alter scope, safety, approval, or execution order.
- **1 — Major defect:** a material conflict or ambiguity makes compliance unreliable.
- **2 — Needs revision:** a concrete workflow weakness could create drift, but the intended behavior is recoverable.
- **3 — Adequate:** workflow mechanics are mostly clear; only bounded, lower-risk improvements remain.
- **4 — Strong:** order, gates, branches, and completion conditions are precise and traceable; no material defect is found.
- **5 — Exemplary:** strong plus explicit, consistent workflow mechanics and low ambiguity without redundant controls.

This local scale prioritizes findings. It is not a validated measurement instrument and must not conceal unresolved evidence. A high prose grade does not establish tool execution, final state, trace compliance, or repeated-run reliability.

## Runtime and local-evaluation boundary

This rubric evaluates a written workflow contract. It does not validate a running agent, tool, model, or harness. When the user also asks to evaluate a state-changing or high-consequence workflow, use a companion local evaluation rather than inferring runtime reliability from the prose grade or one successful run.

For that companion evaluation:

- Check target state and repeated-run reliability.
- Add an action-order or forbidden-transition assertion only when a source-defined dependency, authorization, safety property, or irreversible transition makes that path semantically material. Do not require one exact full trace when independent actions or recovery routes remain source-valid.
- When an executable validator, script, tool schema, or harness guard is claimed to protect a transition, check the encoded condition and whether the workflow or harness requires its invocation at the needed time. Mere availability is not enforcement.
- For a genuinely dependent reasoning task, a decomposition with explicit verified-result handoff may be locally tested. Do not recommend decomposition by default for independent work or work already externally validated.
- Record the fixture, model and version, harness version, tools, prompt, dates, sample size, raw results, outcome assertions, trace assertions when applicable, retries, token use, and wall-clock time before presenting a convention as a reliability improvement.

These are evaluation-design controls, not a requirement to add a tracker, decomposition stage, validator, exact trace, or external guard to prose that does not already require one.

## Required finding record

For this rubric, record:

- grade and finding state: `finding`, `no issue found`, `unresolved`, or `not applicable with evidence`;
- exact source text for the action, dependency, gate, branch, or structural landmark;
- the concrete execution risk and why it follows from that text;
- whether the recommendation rests on a source-established workflow defect, local evaluation evidence, or an evidence-informed or local hypothesis, including the relevant limitation in `uncertainty`; and
- a prioritized, actionable recommendation that names the specific action, dependency, gate, branch, completion condition, or scoped runtime-evaluation control to change; explains the workflow order, approval, return route, exact anchor, or evaluation boundary that must be preserved; and gives a rewrite action; and
- the change classification: wording-only, behavior-preserving structural rewrite, or approval-required change.

## Recommendation and approval rules

- A **wording-only** recommendation may clarify an explicit sequence or referent without moving actions, changing a gate, or adding a condition.
- A **behavior-preserving structural rewrite** is warranted only when cited source evidence—not a format or placement preference alone—shows that the current organization obscures a source-established prerequisite, gate, branch route, return route, or conflicting control-flow reading. Trace preserved actions, gates, approvals, rationales, exact anchors, branches, and return routes. A rewrite that alters one of those mechanics is approval-required, not structural.
- A format- or placement-standardization recommendation requires local, reproducible evaluation with the intended model and harness before it is presented as a compliance or reliability improvement. Adopting or changing a house format or placement standard is approval-required. A one-off user-requested or source-established presentation change may proceed with appropriate approval or disclosure, but must not claim an unmeasured reliability benefit.
- An **approval-required** change alters a source-established trigger, workflow order, checkpoint, approval rule, guardrail strength, exact technical meaning, repository-defined boundary, format- or placement-standardization policy, or a workflow's required operational control.
- Recommend **no change** when order is already explicit and a restructure would only change presentation or add pseudo-steps.

## Remediation guide

| Finding | Concrete remediation |
|---|---|
| Later work relies on an unstated earlier result | Cite both clauses; make the existing dependency, release condition, and source-defined failure route explicit, or report the dependency as unresolved if it is only inferred. |
| Explicit gate is buried or softened | Surface the existing gate near the action it controls; preserve its timing and failure route. |
| A branch has no destination or rejoin | Inspect neighboring prose, linked instructions, and repository evidence first. Name a destination or rejoin point only when source-supported. If the policy remains unresolved, ask and wait when it controls a required approval, safety boundary, irreversible action, or materially different mandatory work; otherwise disclose the uncertainty and continue only safe work that does not choose the branch. |
| One clause combines conflicting workflow roles or repeats a conflicting requirement | Separate existing action, condition, and rationale only when their order remains traceable. Where a repeated requirement has no distinct source-supported control function, remove or consolidate it without adding a fixed-length rule or a pseudo-step. |
| Current organization obscures a source-established workflow mechanic | Propose a bounded structural rewrite only when cited source evidence shows that readers cannot determine the intended prerequisite, gate, branch route, or return route. Trace its equivalence. If the rewrite alters a protected workflow mechanic, request approval rather than classifying it as structural. |
| A format or placement change is proposed as a reliability improvement | Require local, reproducible evidence for the intended model and harness before standardizing the format or placement. If the change is user-requested or source-established presentation work, disclose that it is a format or placement choice rather than a validated compliance control. |
| A progress tracker is proposed as a serial-reliability control | Verify that the active harness reliably exposes and updates the tracker state, then require representative local evaluation before claiming a completion benefit. Otherwise treat it as a presentation convention or a local hypothesis, not as a control. |
| Decomposition is proposed as a default serial-workflow remedy | Do not add it by default. Limit a recommendation to a locally tested, genuinely dependent reasoning task with explicit verified-result handoff; preserve independent and externally validated paths. |
| Untrusted content is said to be lower priority because of document structure | Do not accept headings, ordering, or labels as enforcement. Identify the relevant model, message-role, tool-permission, or harness boundary, and report any limitation as a scoped authority-control concern. |
| A high-consequence transition relies only on prose | For a source-defined safety, approval, data-integrity, or irreversible-state transition, identify whether an executable validator, script, tool schema, or harness guard enforces the encoded condition and requires invocation at the needed time. Treat a missing control as a scoped risk or improvement opportunity—not a prose defect—unless the source already requires it. |
| A state-changing workflow is presented as reliable | Do not infer reliability from the prose audit or one successful run. Use the companion local evaluation to check target state and repeated-run reliability; add path assertions only for source-defined material dependencies or forbidden transitions. |
