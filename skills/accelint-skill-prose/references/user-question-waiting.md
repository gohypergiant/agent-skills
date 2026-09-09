# User-Question and Waiting-Behavior Rubric

## Scope and portability

Audit how behavior-defining prose handles unresolved decisions, safety boundaries, user preferences, and independently discoverable information. A question, a tool permission, and a user approval are distinct events. Interaction mechanics vary by harness, so this rubric requires prose to name what is blocked rather than claiming that every harness will pause automatically.

## Audit objective

Confirm that the target prose asks and waits only when a decision materially changes the output or a safety/approval boundary requires it, while allowing independently inspectable and non-branch-dependent work to continue.

## Observable criteria

Evaluate and cite the target text for each applicable criterion:

1. **Decision classification** — Distinguish blocking ambiguity, including an unresolved branch or approval policy that controls later mandatory work; non-blocking ambiguity; permission or safety boundary; independently inspectable information; and material user preference.
2. **Question necessity** — Check that prose does not ask the user to supply information that local inspection can establish and does not ask broad or fragmented questions when one focused decision is enough.
3. **Actionable choice design** — For a required decision, check that the prose explains why the answer matters, provides genuine options or a clear answer format, and names each option's effect.
4. **Waiting and blocked work** — Check that the prose says what branch-dependent work must not begin until an answer or approval is obtained, while allowing only safe preliminary inspection to continue.
5. **Decision versus permission** — Check that tool permission, silence, timeout, dismissal, cancellation, repository evidence, and ambiguous answers are not treated as a user decision unless the workflow explicitly defines that outcome.
6. **Safe defaults and continuation** — Check that a default is explicitly user- or source-defined, non-committing, and reversible; otherwise treat the branch as unresolved. Check that continuation does not silently select a policy-bearing path.

## Grade each category on the shared 0–5 scale

- **0 — Critical behavioral defect:** explicit wording permits, requires, or obscures behavior likely to bypass user authority, safety, approval, or a material workflow choice.
- **1 — Major defect:** a material ambiguity makes escalation, waiting, or branch selection unreliable.
- **2 — Needs revision:** a concrete question or continuation weakness could select the wrong path, but the intended behavior is recoverable.
- **3 — Adequate:** escalation and waiting behavior are mostly clear; only bounded, lower-risk improvements remain.
- **4 — Strong:** decisions, options, blocked work, and safe continuation are precise and traceable; no material defect is found.
- **5 — Exemplary:** strong plus explicit, proportionate, low-friction decision handling without redundant questions.

This local scale prioritizes findings. It is not a validated measurement instrument and must not conceal unresolved evidence.

## Required finding record

For this rubric, record:

- grade and finding state: `finding`, `no issue found`, `unresolved`, or `not applicable with evidence`;
- the exact target text and evidence that identifies the decision, preference, boundary, or inspectable fact;
- the risk: unnecessary interruption, unauthorized branch selection, ambiguous approval, unsafe continuation, or redundant question;
- a prioritized, actionable recommendation that names the specific question, option, approval, blocked-work statement, or default to change; explains the user authority, decision branch, or waiting behavior that must be preserved; and gives a rewrite action; and
- the change classification: wording-only, behavior-preserving structural rewrite, or approval-required change.

## Decision criteria and examples

| Situation | Expected behavior |
|---|---|
| Blocking ambiguity | Ask a focused question, explain why it matters and the effects of the options, wait, and do not begin branch-dependent work. |
| Non-blocking ambiguity | Proceed with safe work; disclose material uncertainty without inventing a policy. An unresolved branch destination or policy is non-blocking only when it does not select later mandatory work, a safety boundary, an approval, or another material outcome. |
| Permission or safety boundary | Request the required approval before the bounded action. Tool permission alone does not choose a workflow branch. |
| Independently inspectable information | Inspect first. Do not ask the user to repeat a discoverable path, policy, or repository fact. |
| Material user preference | Ask a focused question when audience, scope, mode, output shape, or policy choice changes the result. |
| Explicit safe default | Label the source of the default and proceed only when it does not commit to a behavior-bearing branch. |
| No answer, decline, cancel, timeout, or ambiguity | Treat the decision as unresolved. Continue only safe non-branch-dependent inspection; otherwise stop at the gate. |

## Recommendation and approval rules

- A **wording-only** recommendation may clarify an existing question, option, blocked-work statement, or source-defined default without changing authority or branch behavior.
- A **behavior-preserving structural rewrite** may group related questions, move the decision before its dependent work, or separate safe preliminary work from blocked work when that preserves the existing decision semantics.
- An **approval-required** change alters a user decision, approval boundary, safe default, trigger coverage, workflow order, guardrail strength, exact technical meaning, or repository-defined boundary.
- Recommend **no change** when a question is already focused and actionable, when inspection resolves the uncertainty, or when a default would silently choose policy.

## Remediation guide

| Finding | Concrete remediation |
|---|---|
| Question asks for discoverable facts | Name the inspection step and remove the redundant question. |
| Related decisions are fragmented | Combine them into one focused choice with the effects of each option. |
| Approval or wait point is unclear | State the exact action that is blocked and the event that releases it. |
| Tool permission is treated as a decision | Separate permission to run the tool from the user-selected workflow branch. |
| Safe default is unproven | Cite an explicit source-defined default or stop at the unresolved decision. |
