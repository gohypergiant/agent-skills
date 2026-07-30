# Skill prose examples

Use these examples when you need a concrete model for what safe editing looks like.

## 1. Audit-only vs audit-plus-rewrite

### Audit-only

**Request:** Audit this workflow note for ambiguity. Do not rewrite it.

**Source:**
> If the design looks mostly okay, you can skip the detailed review unless there are obvious red flags.

**Good response shape:**
- Summary of risk
- Findings with source text, risk, and why it matters
- No full rewritten passage

**Why this is correct:**
The user asked for audit-only output. Giving a rewritten passage would violate mode selection even if the rewrite were safer.

### Audit plus rewrite

**Request:** Audit this workflow note, then give me a safer rewrite.

**Safe response pattern:**
1. Summary of risk
2. Findings
3. Rewritten passage

**Why this is correct:**
The user explicitly asked for both outputs, so the rewrite is part of the requested deliverable rather than a stealth mode shift.

## 2. No-rewrite decision

**Request:** Tighten this instruction if possible: `Load references/workflow-steps.md before Step 5.`

**Good answer:**
> No rewrite recommended. The instruction is already compact, exact, and behaviorally clear. Any shorter rewrite would either change timing or lose the exact path.

**Why this is correct:**
The safest move is to preserve a sentence that is already minimal, exact, and unambiguous.

## 3. Preserve hard-stop strength

**Before:**
> NEVER change the user's meaning to make a sentence shorter. Precision outranks brevity.

**Safe rewrite:**
> Never change the user's meaning for brevity. Precision outranks brevity.

**Unsafe rewrite:**
> Avoid changing the user's meaning just to make the sentence shorter.

**Why the unsafe version drifts:**
`Avoid` is weaker than `Never`. The rewrite changes a prohibition into advice.

## 4. Preserve behavior-bearing verbs

**Before:**
> NEVER stop between living document updates and verification waiting for user confirmation.

**Safer rewrite:**
> Never stop between living document updates and verification to wait for user confirmation.

**Unsafe rewrite:**
> Never pause between living document updates and verification for user confirmation.

**Why the unsafe version drifts:**
`Pause` is close to `stop`, but it is not always equivalent in workflow prose. The original verb may define when execution is forbidden to halt.

## 5. Preserve trigger-family coverage in descriptions

**Before:**
> Use when users say 'create a skill', 'audit this skill', 'improve this skill', or when creating, refactoring, or auditing domain expertise into agent skills.

**Safe rewrite:**
> Use when users want to create, audit, or improve a skill, or when turning domain expertise into agent skills.

**Unsafe rewrite:**
> Use when users need skill help.

**Why the unsafe version drifts:**
It collapses distinct trigger families into a vague bucket and weakens the description's trigger logic.

## 6. Cross-file consistency when editing a skill

**Request:** Tighten this skill's prose safely. The user pasted only one section, but the skill also has `AGENTS.md` and `references/` files.

**Good response pattern:**
1. Define the artifact set: root `SKILL.md`, sibling `AGENTS.md` if present, and the behavior-bearing `references/` files that complete the contract
2. Read the root `SKILL.md`
3. Load the behavior-bearing support files that carry workflow rules, examples, trigger guidance, or exact wording constraints, including relevant `references/` files
4. Edit the minimum set of artifact-set files needed to keep wording consistent across the skill folder
5. Be ready to explain why any behavior-bearing file stayed unchanged

**Why this is correct:**
A local rewrite can create drift if linked files still use older terms, weaker severity language, contradictory examples, or stale progressive-disclosure handoffs.

## 7. Preserve short-note format

**Request:** Make this onboarding note easier to scan. Return only the revised note.

**Source:**
> VPN access happens after device setup.

**Safe rewrite:**
> VPN access happens after device setup.

**Also safe if a small emphasis cue helps scanability:**
> **VPN access happens after device setup.**

**Unsafe rewrite:**
> Complete device setup first. VPN access is provisioned after your device is configured, and you will not receive credentials until IT confirms setup is complete.

**Why the unsafe version drifts:**
It escalates a simple note into a more procedural, policy-like instruction and adds process detail the source did not require.

## 8. Preserve rationale when it carries policy

**Before:**
> Frontmatter capture happens at step 30 after Checkpoint 1 approval, not before, because earlier capture can write frontmatter against content the user is about to change.

**Safe rewrite:**
> Capture frontmatter at step 30 after Checkpoint 1 approval, not before. Earlier capture can bind frontmatter to content the user is about to change.

**Unsafe rewrite:**
> Capture frontmatter at step 30 after Checkpoint 1 approval.

**Why the unsafe version drifts:**
It drops the rationale that explains what risk the timing rule prevents. That reason is part of the operational meaning.

## 9. Positive rewrite method for guardrails

**Before:**
> Never weaken approval gates during cleanup.

**Safer rewrite:**
> Do not weaken approval gates during cleanup. Approval gates control when work may proceed.

**Why this is useful:**
The rewrite keeps the prohibition, then makes the protected behavior explicit. It teaches the reader what the rule preserves, not only what to avoid.

## 10. Positive rewrite method for workflow prose

**Before:**
> If the support files appear relevant, review them before revising the root file.

**Safer rewrite:**
> Before you revise the root file, review the support files that complete the workflow contract.

**Why this is useful:**
The rewrite leads with timing and action, keeps the dependency explicit, and makes the operational sequence easier to scan without changing behavior.

## 11. Local rewrite versus structural rewrite

**Local rewrite (`mode=default`):**
> Preserve the checklist format. Tighten each item without changing order.

**Structural rewrite (`mode=strict`):**
> Preserve the checklist logic, but group the items into trigger safety, workflow safety, and exact-reference safety if the current order hides the control points.

**Why this distinction matters:**
Default mode keeps the structure local. Strict mode allows reorganization only when structure itself is the clarity problem.
