# User-Question and Waiting-Behavior Rubric

## Scope and portability

Audit how behavior-defining prose handles unresolved decisions, safety boundaries, user preferences, independently discoverable information, and branch-dependent work. A semantic decision, a user approval, and a tool permission are distinct inputs. Interaction mechanics vary by harness, so this rubric audits the decision state and explicitly blocked work; it does not claim that every harness will pause, render a dialog, or preserve a particular response shape.

Apply the full decision-contract, hold, validation, outcome, default, and resumption criteria only when a decision selects a branch that materially changes later work. Do not require a stable decision contract for ordinary non-blocking clarification. When a workflow uses an adapter or delegates discovery, apply the conditional criteria for that mechanism or delegation.

## Audit objective

Confirm that target prose asks only when a decision materially changes the output or a safety or approval boundary requires it; resolves independently inspectable facts without asking; and defines a portable, validated decision state before branch-dependent work begins.

## Observable criteria

Evaluate and cite the target text for each applicable criterion:

1. **Decision classification and authority** — Distinguish blocking semantic ambiguity, including an unresolved branch that controls later mandatory work; non-blocking ambiguity; a permission or safety boundary; independently inspectable information; and a material user preference. Distinguish a semantic decision that selects a workflow branch from an approval that authorizes a bounded action and a tool permission that authorizes a tool invocation. Treat repository evidence that only supports a recommendation as non-decisive; treat an artifact as decision authority only when the governing workflow explicitly permits it to decide the question.
2. **Question necessity and inspection** — Check that prose inspects locally discoverable facts before asking and does not ask the user to repeat them. Check that it states the inspected evidence and why a decision remains open before it asks a branch-dependent question. Check that it groups related decisions with one shared outcome and does not ask broad or fragmented questions when one focused decision is enough.
3. **Decision contract and actionable choice design** — For each branch-dependent semantic gate, check that prose defines a stable `decision_id`; a question that states what must be selected and why; finite, stable `accepted_values`; the effect and side-effect boundary for each value; blocked work; and outcomes for invalid input, decline, cancellation or dismissal, timeout, and non-interactive or unavailable input. Check that the workflow does not route on conversational summaries, ordinal references, partial selections, or custom text until an adapter maps the input to exactly one accepted value. For a material preference that does not select a branch, check that prose provides genuine options or a clear answer format and names the effect of each offered option.
4. **Explicit hold and blocked work** — Check that prose distinguishes displaying or asking a question from holding the workflow. Until a valid decision record exists, target prose must prohibit dispatching, authorizing, preparing, or performing branch-dependent work. It may permit only specifically named pre-gate work that cannot commit, prepare, or bias a branch.
5. **Validation and routing** — Check that prose defines `answered_valid(value)` or an equivalent validated state as the only state that can route a semantic branch. A valid record must associate one complete accepted value with the applicable `decision_id` and exclude cancellation, dismissal, timeout, partial selection, and unresolved transport failure. Check that prose restates the validated value and runs only its associated branch. Check that a required approval releases only its bounded action and that a tool permission never selects a semantic branch.
6. **Invalid, declined, interrupted, and unavailable outcomes** — Check that prose handles invalid input by asking again or reporting the decision unresolved; handles decline through an explicit decline branch or as unresolved; and treats cancellation, dismissal, timeout, silence, ambiguous input, partial selection, unresolved transport failure, URL-navigation consent, and unavailable non-interactive input as not selected. When no valid decision can be obtained in a non-interactive mode, target prose must produce `unresolved_noninteractive` and stop before branch-dependent mutation.
7. **Safe defaults, continuation, and resumption** — Check that prose uses a default only when an authoritative governing source explicitly defines it or the action is non-committing and reversible. The prose must label the default and its authority or reversible basis, and must not use it to silently select a policy-bearing branch. Check that non-blocking uncertainty permits only work that does not choose a material branch. For interrupted, remote, or time-limited work, check that the workflow re-presents the same `decision_id` and contract instead of inferring a decision from earlier conversation.
8. **Adapter and interaction-mechanism boundary** — When target prose specifies a native dialog, conversation, SDK callback, extension UI, MCP elicitation, or another adapter, check that it verifies availability in the active mode and configuration; represents the decision contract without changing its values or effects; normalizes host outcomes and preserves distinct `decline`, `cancel`, and `timeout` information when the host supplies it; validates before recording a decision; and enforces the hold. Do not require a particular interaction mechanism or infer a host capability that the target does not establish.
9. **MCP form-mode sensitive inputs** — When target prose uses MCP form-mode elicitation, check that it does not request passwords, API keys, access tokens, payment credentials, or similarly sensitive values in form mode.
10. **Parent and subagent responsibilities** — When the workflow delegates discovery or recommendation work, check that the parent owns the user-facing semantic decision and validates the decision record before routing. A discovery subagent may return evidence, confidence, recommended options, and unresolved questions, but must not select policy or begin branch-dependent work.

## Grade each category on the shared 0–5 scale

- **0 — Critical behavioral defect:** explicit wording permits, requires, or obscures behavior likely to bypass user authority, safety, approval, or a material workflow choice.
- **1 — Major defect:** a material ambiguity makes decision validation, escalation, holding, or branch selection unreliable.
- **2 — Needs revision:** a concrete decision-contract, continuation, or question-design weakness could select the wrong path, but the intended behavior is recoverable.
- **3 — Adequate:** decision handling is mostly clear; only bounded, lower-risk improvements remain.
- **4 — Strong:** decisions, contracts, options, validation, blocked work, and safe continuation are precise and traceable; no material defect is found.
- **5 — Exemplary:** strong plus explicit, proportionate, low-friction decision handling without redundant questions or unsupported harness claims.

This local scale prioritizes findings. It is not a validated measurement instrument and must not conceal unresolved evidence. A high grade does not prove that a model, tool, adapter, or harness enforces the written decision contract at runtime.

## Required finding record

For this rubric, record:

- grade and finding state: `finding`, `no issue found`, `unresolved`, or `not applicable with evidence`;
- the exact target text and evidence that identifies the decision, preference, boundary, inspectable fact, decision state, or delegated responsibility;
- the risk: unnecessary interruption, unauthorized branch selection, ambiguous approval, invalid routing, unsafe continuation, redundant question, or unsupported harness claim;
- a prioritized, actionable recommendation that names the specific decision contract, question, option, approval, validation rule, blocked-work statement, outcome, default, adapter responsibility, or delegation boundary to change; explains the user authority, decision branch, waiting behavior, or portability boundary that must be preserved; and gives a rewrite action; and
- the change classification: wording-only, behavior-preserving structural rewrite, or approval-required change.

## Decision criteria and examples

| Situation | Expected behavior |
|---|---|
| Blocking semantic ambiguity | Inspect first when an authoritative source can resolve the question. Otherwise state the inspected evidence and why the decision remains open; define the decision contract; ask a focused question; explain why it matters; name each value's effect; hold branch-dependent work; validate one accepted value; restate the validated value; and route only that branch. |
| Non-blocking ambiguity | Proceed only with work that does not choose a material branch. Disclose material uncertainty without inventing a policy. An unresolved branch is non-blocking only when it does not control later mandatory work, a safety boundary, an approval, or another material outcome. |
| Permission or safety boundary | Request the required approval before the bounded action. Do not treat the approval or a tool permission as a semantic branch value. |
| Independently inspectable information | Inspect first. Do not ask the user to repeat a discoverable path, policy, or repository fact. |
| Material user preference | Ask a focused question when audience, scope, mode, output shape, or policy choice materially changes the result. Use a clear answer format, or genuine options with the effect of each option. |
| Incomplete semantic decision contract | Do not route. Define the missing `decision_id`, question and why the decision remains open, accepted values, effects, blocked work, validation rule, or outcome before asking or continuing branch-dependent work. |
| Displayed question without a hold | Do not assume the question pauses work. State the actions that remain blocked until a valid decision record exists. |
| Invalid or ambiguous input | Ask again or report unresolved. Do not route or infer a value from conversational plausibility, an ordinal reference, or partial input. |
| Declined input | Follow an explicitly defined decline branch; otherwise treat the decision as unresolved. |
| Cancel, dismissal, timeout, silence, partial selection, or unresolved transport failure | Treat the decision as unresolved. Continue only explicitly permitted pre-gate work that cannot commit, prepare, or bias a branch; otherwise stop at the gate. |
| Non-interactive or unavailable input | Produce `unresolved_noninteractive` and stop before branch-dependent mutation unless a valid decision record already exists. |
| Explicit safe default | Label the default and its authority or reversible basis. Use it only when an authoritative source explicitly defines it or the action is non-committing and reversible, and never to silently select a policy-bearing branch. |
| Interrupted, remote, or time-limited session | Re-present the same `decision_id` and decision contract. Do not infer a branch from earlier conversation. |
| Adapter or native interaction mechanism | Use it only when it is available in the active mode and configuration and can faithfully represent and normalize the decision contract. Preserve distinct `decline`, `cancel`, and `timeout` information when the host supplies it; otherwise use the conversation or report unresolved. |
| MCP form-mode elicitation | Do not request passwords, API keys, access tokens, payment credentials, or similarly sensitive values in form mode. |
| Discovery subagent | Return evidence, confidence, recommended options, and unresolved questions. Do not select policy or start branch-dependent work. |

## Recommendation and approval rules

- A **wording-only** recommendation may clarify an existing question, option, blocked-work statement, release condition, or source-defined default without changing authority, validation, branch behavior, or portability claims.
- A **behavior-preserving structural rewrite** may group related questions, move an existing decision before its dependent work, separate a semantic decision from an approval boundary, or separate permitted pre-gate work from blocked work when every preserved decision state, branch, outcome, and release condition remains traceable.
- An **approval-required** change adds or removes a required decision-contract element; changes accepted values, branch effects, validation, approval boundaries, default authority, blocked work, unresolved outcomes, trigger coverage, workflow order, guardrail strength, exact technical meaning, or a repository-defined boundary.
- Recommend **no change** when inspection resolves the uncertainty, a question is already focused and validated, or a default would silently choose policy.

## Remediation guide

| Finding | Concrete remediation |
|---|---|
| Question asks for discoverable facts | Name the inspection step and remove the redundant question. |
| Question does not explain why a decision remains open | State the inspection performed, the evidence found, and why it does not resolve the branch before asking for a decision. |
| Related decisions are fragmented | Combine them into one focused choice with stable values and the effect of each value. |
| Semantic decision lacks a complete contract | Add the stable `decision_id`, question and why the decision remains open, finite accepted values, effects, blocked work, validation rule, and explicit invalid, decline, cancel or dismiss, timeout, and non-interactive outcomes. |
| Approval or wait point is unclear | Separate the semantic decision from the approval. State the bounded action the approval releases and the branch-dependent actions the valid decision releases. |
| Displayed question is treated as a hold | State that branch-dependent work must not dispatch, authorize, prepare, or perform until a valid decision record exists; list only explicitly permitted pre-gate work. |
| Tool permission is treated as a decision | Separate permission to run the tool from the user-selected workflow branch. |
| Routing accepts an invalid or ambiguous result | Require exactly one complete accepted value associated with the `decision_id`; reject partial, cancelled, timed-out, dismissed, ambiguous, or transport-failed input. After validation, restate the accepted value and run only its associated branch. |
| Decline, cancel, timeout, or non-interactive handling is missing | Define the decline branch or unresolved result; treat cancel, dismissal, timeout, and unavailable input as unresolved; use `unresolved_noninteractive` before branch-dependent mutation. |
| Safe default is unproven or unlabeled | Cite an authoritative source-defined default, or show that the action is non-committing and reversible; label that authority or basis. Otherwise stop at the unresolved decision. |
| Resume infers an earlier decision | Re-present the same `decision_id` and contract, then validate a new response before routing. |
| Adapter assumes a host capability or changes decision meaning | Check availability in the active mode and configuration; preserve values, effects, and distinct `decline`, `cancel`, and `timeout` information when the host supplies it; normalize outcomes; validate input; and enforce the hold. |
| MCP form-mode elicitation requests sensitive values | Remove the sensitive form field. Do not treat form-mode elicitation as an approved secret-collection mechanism. |
| Discovery subagent selects policy | Return the choice to the parent; preserve the subagent's role as evidence and recommendation only. |
