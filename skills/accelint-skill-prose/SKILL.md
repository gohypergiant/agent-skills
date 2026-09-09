---
name: accelint-skill-prose
description: >-
  Use when auditing or revising behavior-defining agent guidance—such as `SKILL.md`,
  `AGENTS.md`, `CLAUDE.md`, prompt templates, workflow instructions, guardrails, and
  behavior-bearing references—where wording controls trigger scope, workflow order,
  approval semantics, guardrail strength, or exact technical meaning. Prefer this skill
  over general prose editing when clarity must improve without changing behavior,
  including ambiguity audits and edits that preserve exact paths, commands, fields,
  identifiers, and scope-defining examples. Do not use it for broader content strategy,
  policy design, domain review, ordinary low-risk prose cleanup, or optimizing a skill
  description’s trigger performance.
license: Apache-2.0
metadata:
  author: accelint
  version: "0.10.0"
---

# Skill Prose

Use this skill to audit or revise behavior-defining prose while preserving behavior by default.

## Scope and core contract

Use this skill for `SKILL.md`, `AGENTS.md`, `CLAUDE.md`, behavior-bearing references, prompt templates, workflow guidance, guardrails, and other prose whose wording controls trigger coverage, workflow order, approval semantics, guardrail strength, or exact technical meaning.

Do not use it for broader content strategy, policy design, domain review, ordinary low-risk prose cleanup, or agent-skill description optimization managed by another skill.

Preserve, in this priority order:

1. trigger intent and scope;
2. workflow semantics and approval logic;
3. guardrail and hard-stop strength;
4. exact technical meaning; then
5. clarity and brevity.

Treat behavior-bearing prose as an execution contract, not as ordinary style copy. Keep one term for one concept when the source treats the terms as equivalent. Do not rotate synonyms for style.

## Hard stops

- **Never broaden or narrow trigger coverage silently.**
- **Never weaken a hard requirement into advice or elevate optional guidance into a hard requirement.**
- **Never reorder behavior-bearing workflow steps, branches, gates, or approval timing without explicit approval.**
- **Never paraphrase exact paths, commands, flags, fields, identifiers, inline code, code blocks, quoted text, or scope-defining examples without explicit approval.**
- **Never turn a warning, rationale, note, or descriptive statement into a new gate, prerequisite, branch, or policy without source evidence.**
- **Never use a qualitative term as a substitute for an operational condition when it acts as a hidden gate, fallback, exception, or permission slip.**
- **Never treat numbering, headings, checklists, XML, or another presentation convention as a workflow control unless the source or active harness makes it behavior-bearing.**
- **Never claim that a rubric grade is a validated measurement, that a finding proves runtime behavior, or that a format preference is a validated compliance improvement without local evidence.**
- **Never treat an isolated reviewer’s output as verified evidence or average, vote on, or otherwise aggregate local grades.**
- **Never hide an unavailable required reviewer or present incomplete rubric coverage as complete.**
- **Never begin work that depends on an unresolved user decision or required approval.**
- **Never skip auditing, grading, recommendations, rewrite-proposal synthesis, or rewriting because report visibility is suppressed.**

## Required materials

For every applicable audit, read all mandatory rubric references. Do not use progressive-disclosure thresholds, optional reference loading, or perceived relevance to skip a category.

- `references/normative-language.md` — normative-language and obligation-precision rubric that applies RFC 8174 / RFC 2119 BCP 14 interpretation to every target artifact.
- `references/serial-instruction-guidance.md` — serial-instruction and workflow-integrity rubric.
- `references/ste-compatible-rules.md` — STE-compatible clarity and usability rubric.
- `references/user-question-waiting.md` — user-question and waiting-behavior rubric.

The rubric references use the same local 0–5 scale. Record each grade with cited evidence, a finding state, a concrete recommendation or no-change rationale, a change classification, and uncertainty. Grades prioritize work; they are not validated scores and must not be aggregated to hide incomplete or unresolved evidence.

Every isolated rubric reviewer MUST read the complete target artifact set and every file in **Required materials**. A reviewer focuses on one category but does not treat the other references as optional.

## Mandatory review workflow and report visibility

Every invocation uses this one review workflow. It MUST establish fixed behavior from the source, run four isolated first-pass rubric reviews, synthesize source-grounded findings in a fresh context, and produce one behavior-preserving rewrite. The roles MUST NOT share prior grades, rewrite proposals, author rationale, or draft text before synthesis.

It may use a bounded, behavior-preserving structural rewrite only when cited source evidence shows that the current organization obscures a source-established prerequisite, gate, branch route, return route, or conflicting control-flow reading. A format preference alone does not justify a structural rewrite or a claim of improved compliance.

### Required-reviewer failure handling

Attempt every required isolated reviewer. A reviewer fails when it cannot start, cannot complete, returns a response that is not valid JSON matching the required Step 2 payload, or returns a required record without source-cited evidence. Do not silently substitute the parent’s own judgment for that reviewer.

For a failed isolated reviewer, continue only with the completed reviews and report incomplete rubric coverage. Identify the unavailable reviewer, its error or missing output, the category coverage lost, and the resulting uncertainty in the delivery report. The work MAY produce a rewrite, but MUST NOT imply that the missing review was completed. Offer the user a retry when it is actionable.

### Report visibility

Show the audit and delivery report by default. Use the delivery structure in `assets/output-template.md`.

Suppress the user-facing audit and report only when either condition applies:

- The user supplies the literal `--quiet` flag.
- The user unambiguously asks not to show the audit, findings, or report, for example: `no report`, `do not include the audit`, `do not show the findings`, or `only return the rewritten text`.

A request to be concise, brief, or short does not suppress the audit and report. Do not infer suppression from a generic style preference.

Quiet reporting changes visibility only. It never skips the audit, grading, recommendations, prioritized rewrite proposal, or rewrite. Complete those steps internally, then return the rewritten version without the audit or report.

## Required workflow

### Step 0: Track work

Create and maintain the following short task tracker before research or editing. Mark an item complete only after completing the corresponding step:

- [ ] Step 1: Establish the artifact set and fixed behavior ledger
- [ ] Step 2: Run four isolated mandatory rubric reviews
- [ ] Step 3: Synthesize source-grounded findings and the prioritized rewrite proposal
- [ ] Step 4: Decide whether to ask, wait, inspect, default, or proceed
- [ ] Step 5: Choose the smallest safe change
- [ ] Step 6: Edit, align, and output the rewrite

### Step 1: Establish the artifact set and fixed behavior

Read the complete target artifact before recommending edits. For folder-level work, inspect the root `SKILL.md`, sibling `AGENTS.md` when present, and every behavior-bearing Markdown file under `references/`. Follow explicit links from those files and inspect other behavior-bearing templates or instructions that complete the contract.

Create a fixed behavior ledger that records:

- explicit trigger phrases, scope boundaries, and user constraints;
- actions, gates, approvals, branches, dependencies, and rationale;
- exact technical anchors and scope-defining examples;
- repeated behavior-bearing terms; and
- incomplete discovery or conflicting source evidence.

Create an immutable source snapshot that records every artifact path with an identifier or checksum. Do not rely on repository `HEAD`: the snapshot must represent the artifact set actually inspected for this invocation.

Give every reviewer the same immutable artifact snapshot and fixed behavior ledger. Do not add a proposed rewrite, another reviewer’s grade, or a synthesis rationale to an isolated reviewer’s context.

Do not treat a visible excerpt as the complete contract. If discovery remains inconclusive after a direct retry, disclose the gap before recommending cross-file changes.

### Step 2: Run four isolated mandatory rubric reviews

Launch one fresh-context reviewer for each category. Each reviewer receives only the immutable artifact snapshot, behavior ledger, complete **Required materials**, and its assigned category. It MUST NOT receive another reviewer’s output, a rewrite proposal, a draft rewrite, or the parent’s preferred conclusion.

1. normative-language and obligation precision;
2. serial instruction and workflow integrity;
3. STE-compatible clarity and usability; and
4. user-question and waiting behavior.

Each reviewer MUST return exactly one valid JSON object and no prose outside that object. The object MUST match this payload shape:

```json
{
  "category": "<assigned category>",
  "grade": 0,
  "state": "finding | no issue found | unresolved | not applicable with evidence",
  "evidence": [
    {
      "path": "<exact artifact path>",
      "location": "<heading or line range>",
      "quote": "<verbatim source text>",
      "relevance": "<what this evidence supports>"
    }
  ],
  "riskOrNoChangeRationale": "<concrete behavior risk or reason no change is warranted>",
  "recommendation": {
    "priority": "highest | high | medium | low | none",
    "action": "<specific, actionable change or 'No change warranted.'>",
    "behaviorPreservationIntent": "<behavior to preserve, or why no change is warranted>"
  },
  "changeClassification": "wording-only | behavior-preserving structural rewrite | approval-required change",
  "uncertainty": "<limitation, or 'none'>"
}
```

`category` MUST exactly identify the reviewer’s assigned category. `grade` MUST be an integer from 0 through 5. `state`, `recommendation.priority`, and `changeClassification` MUST use one of the listed values. `evidence` MUST contain every source-cited record needed to support the returned state. Use `recommendation.priority: "none"` only with a no-change recommendation.

Every finding recommendation must name the specific wording, structure, or requirement to change; explain the behavior-preservation intent when relevant; and give an action that can guide the rewrite. Do not use vague advice such as “make this clearer” without identifying the needed change.

A category is not complete merely because the review found no issue. Cite the inspected evidence that supports `no issue found` or `not applicable with evidence`. Mark a reviewer that returns invalid JSON, lacks a required payload field, or lacks source-cited evidence as unavailable under **Required-reviewer failure handling**.

### Step 3: Synthesize source-grounded findings and the prioritized rewrite proposal

Complete Step 2 before beginning Step 3. Use a fresh synthesis context. It MUST receive the immutable artifact snapshot, fixed behavior ledger, complete **Required materials**, and completed reviewer records. It MUST reread the cited source evidence before accepting a finding; reviewer output is candidate evidence, not authority.

Resolve overlap and disagreement by source evidence and the preservation priorities. Do not average grades, use a majority vote, or turn repeated unsupported recommendations into policy. If the source does not resolve a material conflict, record it as unresolved and follow Step 4 before drafting.

After every available rubric review is complete, synthesize applicable recommendations into one prioritized, top-down rewrite proposal before drafting the rewritten version.

For each proposed change, state:

- the recommendation or recommendations it addresses;
- the target wording, structure, or requirement to change;
- the behavior-preservation intent, including protected triggers, workflow mechanics, guardrails, approvals, or exact anchors; and
- its change classification and any approval still required.

Order the proposal by behavior risk: trigger coverage and scope, workflow and approval semantics, guardrail strength, exact technical anchors, then clarity and brevity. Use the proposal to guide the final rewrite. Do not use it to add policy, requirements, gates, exceptions, or technical meaning not supported by the source.

### Step 4: Decide whether to ask, wait, inspect, default, or proceed

Ask and wait only when an unresolved decision materially changes the output or a safety or approval boundary requires it. For operational details and examples, see the `Decision criteria and examples` section in `references/user-question-waiting.md`.

- **Classify the input first.** Distinguish a semantic decision that selects a workflow branch from an approval that authorizes a bounded action and a tool permission that authorizes a tool invocation. A permission or approval never selects a semantic branch.
- **Inspect first** when repository or artifact evidence can resolve the uncertainty. Treat repository evidence that only supports a recommendation as non-decisive unless the governing workflow explicitly gives that artifact decision authority.
- **Define the semantic decision contract** before asking for a branch-dependent decision: a stable `decision_id`; a question and why it matters; finite, stable `accepted_values`; each value's effect and side-effect boundary; blocked work; and outcomes for invalid input, decline, cancellation or dismissal, timeout, and unavailable non-interactive input.
- **Ask and hold** for blocking ambiguity or a material user preference. Provide genuine options and name each option's effect, or provide a clear answer format when the answer does not route a semantic branch. A displayed question is not a hold: until a valid decision record exists, do not dispatch, authorize, prepare, or perform branch-dependent work. Permit only explicitly named pre-gate work that cannot commit, prepare, or bias a branch.
- **Validate and route** a semantic branch only after exactly one complete accepted value is associated with the applicable `decision_id` and the input has no cancellation, dismissal, timeout, partial selection, or unresolved transport failure. A required approval releases only its bounded action.
- **Handle unresolved outcomes explicitly.** Ask again or report unresolved after invalid input; follow an explicitly defined decline branch or report unresolved after decline; and treat silence, cancellation, dismissal, timeout, ambiguous input, partial selection, unresolved transport failure, tool permission, repository convention, and URL-navigation consent as not selected. When no valid decision can be obtained in a non-interactive mode, produce `unresolved_noninteractive` and stop before branch-dependent mutation.
- **Proceed with a disclosed uncertainty** only when it is non-blocking and does not select a policy or behavior-bearing branch.
- **Use a safe default** only when the user or an authoritative source explicitly defines it, or when the action is non-committing and reversible. Label the default and its authority or reversible basis; never use it to silently select a policy-bearing branch.
- **Resume safely.** For interrupted, remote, or time-limited work, re-present the same `decision_id` and decision contract. Do not infer a branch from earlier conversation.
- **Keep ownership with the parent.** A discovery subagent may return evidence, confidence, recommended options, and unresolved questions, but must not select policy or begin branch-dependent work. When a workflow uses a native dialog, conversation, SDK callback, extension UI, MCP elicitation, or another adapter, use it only when the active mode can faithfully represent and normalize the decision contract.

Do not ask fragmented questions or ask the user to repeat independently inspectable information. Group related decisions when they share one outcome.

### Step 5: Choose the smallest safe change

Classify the recommendation before editing:

- **Wording-only edit** — clarifies an explicit source-supported rule without changing its trigger scope, actor, condition, timing, obligation, rationale, technical anchor, or branch behavior.
- **Behavior-preserving structural rewrite** — reorganizes existing instructions, rationale, warnings, or examples because cited source evidence shows that the current organization obscures a source-established prerequisite, gate, branch route, return route, or conflicting control-flow reading. Trace every preserved trigger, obligation, gate, approval, rationale, exact anchor, branch, and return route. Disclose that the change is structural.
- **Approval-required change** — changes trigger coverage, workflow order, guardrail strength, exact technical meaning, a user decision, a safe default, a repository-defined approval boundary, or a house format standard.

Require local, reproducible evaluation with the intended model and harness before presenting a format-standardization change as a compliance or reliability improvement. A one-off user-requested or source-established presentation change may proceed with appropriate approval or disclosure, but must not claim an unmeasured reliability benefit.

When source evidence does not justify a safe change, preserve the original wording as the rewritten version and state that no behavior-preserving change was warranted. Do not use elegance, brevity, or formatting preference as sufficient justification for a structural rewrite. Do not require one exact action order unless the source makes the order material through a dependency, authorization, safety property, or irreversible transition.

### Step 6: Edit, align, and output the rewrite

The synthesis role drafts the one rewrite. Isolated reviewers do not author the final wording.

Edit only the canonical source artifacts. For folder-level work, update the minimum behavior-bearing files needed to prevent a concrete mismatch in terminology, obligation, workflow, exact references, or rubric requirements.

Complete `assets/output-template.md` for every invocation. By default, present the review coverage, category-level audit, prioritized rewrite proposal, and rewritten version. If report visibility is suppressed, complete the same workflow and template internally, but return only the rewritten version.

Before output, confirm the following:

- [ ] Every mandatory rubric category has either a complete grade, evidence, state, recommendation or no-change rationale, classification, and uncertainty record, or an unavailable-reviewer disclosure with `unresolved` state, lost coverage, and uncertainty.
- [ ] Every finding recommendation identifies a specific change, its behavior-preservation intent when relevant, and an actionable rewrite direction.
- [ ] The prioritized rewrite proposal addresses all applicable recommendations before the final rewrite.
- [ ] Trigger coverage and boundary language are preserved, except for an explicitly approved change.
- [ ] Workflow order, gates, approvals, branches, and failure routes are preserved, except for an explicitly approved change.
- [ ] Mandatory language has not softened; optional guidance has not been elevated without approval.
- [ ] Exact technical anchors and scope-defining examples are preserved.
- [ ] A structural rewrite has source evidence, equivalence traceability, disclosure, and any required approval; a format preference is not presented as a validated compliance improvement without local evidence.
- [ ] A user question was asked only when inspection could not resolve a material decision; the semantic decision, approval, and tool permission remain distinct; and blocked work did not begin while awaiting a valid decision record.
- [ ] Every branch-dependent decision defines a `decision_id`, accepted values, effects, blocked work, validation, and source-supported unresolved outcomes; only a validated value routes its branch.
- [ ] Any default is source-authorized or non-committing and reversible, labeled with its authority or basis, and does not silently select a policy-bearing branch.
- [ ] Non-interactive and resumed work preserves the required unresolved or re-prompt behavior before branch-dependent mutation.
- [ ] The rewrite preserves source-required ordering without imposing one exact action order on otherwise independent or source-valid paths.
- [ ] Every required path in this skill exists.
- [ ] The default delivery shows the audit and report; any suppression meets the narrow report-visibility rule and omits only user-facing audit/report content.
- [ ] The delivery follows `assets/output-template.md`.

Identify whether the rewrite was wording-only or structural and state any approval obtained or still required. If a reviewer was unavailable, identify the reviewer and coverage limit without implying that it completed the missing review. If no change is warranted, say why in the default report with cited category evidence; do not manufacture a rewrite for cosmetic reasons.
