# Workflow and guardrail safety

Use this reference when editing skill prose that controls execution order, approvals, safety rules, or exact technical references.

## Treat workflow prose as executable guidance

When the user is editing a skill folder, do not assess a workflow passage in isolation if other files finish the workflow contract. Read the root `SKILL.md` and the relevant behavior-bearing support files first so you preserve cross-file order, gates, and exact references.

Ask:

- If an agent followed only the rewritten text, would it behave the same way?
- Did the rewrite preserve order, gates, conditions, and rationale?

## Preserve exactly when important

Keep these exact unless the user explicitly asks otherwise:

- step numbers
- before/after timing
- approval checkpoints
- file names and paths
- commands and flags
- field names and keys
- slash-joined references such as `specs_touched/decisions`
- examples that anchor the rule
- linked support-file wording that completes the workflow contract
- behavior-bearing verbs such as `stop`, `pause`, `wait`, `proceed`, `skip`, `require`, and `allow`
- rationale sentences that explain why a guardrail exists or what risk it prevents

## Common failure modes

### Order drift

- moving a step earlier because it sounds cleaner
- merging two steps that carry different decisions
- dropping "not before" or similar timing boundaries

### Guardrail weakening

- `must` becomes `should`
- `do not` becomes `avoid`
- `critical` becomes ordinary emphasis

### Specificity loss

- replacing a named token with a broader category
- replacing an example with generic prose
- replacing exact rationale with a vague safety summary
- replacing a behavior-bearing verb with a near-synonym that changes permission, timing, or obligation strength

## Safe moves

- split a long sentence while keeping the same sequence
- move the condition before the command when the timing stays the same
- cut filler that does not change why the rule exists
- preserve exact tokens inline while tightening surrounding prose
- keep rationale sentences, but tighten them locally when the policy stays the same

## Verb-sensitivity quick check

Before you deliver, ask:
- Did `stop`, `wait`, `skip`, `proceed`, or similar verbs change to a softer or different action?
- Did a requirement verb like `must` become advice like `should`?
- Would the rewritten version let the agent act earlier, later, or more optionally than before?

## Delivery rule

If exactness and tightening conflict, preserve exactness.
If the safest result is a minimal rewrite, keep it minimal.
If any rewrite still feels risky, recommend no rewrite or deliver an audit only.
