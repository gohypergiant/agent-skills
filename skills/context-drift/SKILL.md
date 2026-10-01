---
name: context-drift
description: Use when the user wants to audit or correct drift across canonical project context files such as `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `CONSTRAINTS.md`, `JARGON.md`, `EPISTEMIC-MAP.md`, `README.md`, and `openspec/config.yaml`, or mentions context drift, memory-file drift, redundant project docs, wrong document, layered documentation, or doc ownership. This skill checks whether each fact lives in the right document, identifies redundancy and layer-boundary violations, and prepares lossless move/delete proposals with diff previews and per-change approval. Prefer it over ad-hoc cleanup because these files are load-bearing and misplaced content can change agent behavior or tool behavior.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.0.0"
---

# Context Drift

Use this skill to audit or repair drift across a repository's load-bearing context files without losing detail or blurring the boundaries between them.

If this skill loads and the rest of the turn contains no human-authored task text — including when the only other content is an automated system or tooling notice, such as a diagnostics or context message — do not conclude that there is nothing to act on. The skill loading at all, by itself, is the request. Begin Stage 1 immediately against the current repository using the defaults in this document. Do not wait, do not just acknowledge that the skill is available, and do not ask what to work on.

## Authority model

This skill is an orchestrator, not the final authority on what belongs in each file.

Before judging drift, invoke or load the relevant owner skills for the in-scope files up front. Use their own separation-of-concerns rules, file-specific guardrails, and document-ownership logic as the authority for what belongs where. This skill coordinates the cross-file comparison, the lossless move plan, and the approval loop. It should not make independent file-ownership calls and only bring the owner skills in at the end.

If two owner skills point in different directions, surface that conflict to the user instead of overruling it here.

## Canonical ownership model

Use this ownership model as a routing map before you call anything redundant, misplaced, or stale. It is a quick index into the owner skills, not a replacement for their judgment.

| File | Core question | What belongs here | Load-bearing status | Companion skill |
| --- | --- | --- | --- | --- |
| `openspec/config.yaml` | **What is this project?** | Project DNA, stack facts, structural defaults, artifact rules | **Critical** | `accelint-onboard-openspec` |
| `ARCHITECTURE.md` | **How is this system built?** | System structure, components, deployments, data flow, technical topology | **Important** | `accelint-architecture-doc` |
| `AGENTS.md` / `CLAUDE.md` | **How should an agent behave here?** | Agent workflow, approval boundaries, communication rules, repo-specific working norms | **Critical** | `accelint-onboard-agents` |
| `CONSTRAINTS.md` | **Why are some choices non-negotiable?** | External constraints: compliance, security, stakeholder, vendor, hosting, scope boundaries | **Important** | `constraints-extractor` |
| `EPISTEMIC-MAP.md` | **How sure are we?** | Validated facts, open questions, assumptions, inferred risks | **Important** | `epistemic-mapper` |
| `JARGON.md` | **What do these terms mean?** | Glossary entries, acronyms, internal terminology, shorthand definitions | **Supporting** | `jargon-extractor` |
| `README.md` | **How does a human get started?** | Human onboarding, install/run/usage basics, external-facing project intro | **Important** | `accelint-readme-writer` |

A short pointer from one file to another is often correct. Full duplicate content usually is not. For example, `AGENTS.md` can tell the agent to read `ARCHITECTURE.md` before deployment work, but the deployment topology itself belongs in `ARCHITECTURE.md`, not `AGENTS.md`.

`JARGON.md` plays a different role than the rest of the set: its only job is to hold short, terse definitions of terms used throughout the project — like a dictionary entry, not an explanation. Because of that, some overlap between `JARGON.md` and everywhere else is expected, not drift. Other canonical files are free to explain the same term in full depth when that depth serves their own job — `ARCHITECTURE.md` giving the complete technical picture of something `JARGON.md` also defines in one line is not duplication, the same way a detailed reference and a glossary gloss are different jobs. The constraint runs toward `JARGON.md`, not away from it: `JARGON.md` itself must stay terse. If a `JARGON.md` entry stops being a short definition and starts carrying the same depth as the canonical file that actually owns that detail, that is the drift to fix — and the fix is shortening the `JARGON.md` entry (optionally pointing to where the full depth lives), not trimming the other file.

## NEVER do these things

- **NEVER delete content before you know its destination.** If a sentence leaves one file, either move it to its canonical home, replace it with a lighter pointer, or keep it.
- **NEVER turn a detailed statement into a vague summary just to make the move easier.** "Lossless" means the same operational meaning survives at roughly the same level of detail.
- **NEVER call something redundant just because two files mention the same concept.** A behavior rule that points to `CONSTRAINTS.md` is not the same thing as restating the constraint itself.
- **NEVER classify two sections as duplication because they cover the same topic at a different level of detail.** A short summary built for quick orientation and a complete reference built for full technical depth are not the same information just because they describe the same subsystem — a curated set of examples is not a duplicate of an exhaustive table, and a conceptual diagram is not a duplicate of a structural one. Before calling something exact or paraphrased duplication, point to the specific passages in both files that are actually informationally equivalent — not just adjacent in topic — and that would go stale together if one changed. `README.md` is the most common place to get this wrong, since compressing and previewing content that lives in full elsewhere is its actual job, not a drift symptom.
- **NEVER treat `JARGON.md`'s overlap with another file as duplication by default, and never assume a detailed explanation elsewhere is the problem.** `JARGON.md`'s only job is to centralize terse term definitions, so other files referencing a term it defines — even explaining that term in full depth, when their own job calls for it — is expected, not drift. The constraint runs the other way: `JARGON.md` itself must stay terse. If a `JARGON.md` entry and another file's explanation have converged, trim the `JARGON.md` entry back to a short definition; don't shorten the file that's actually supposed to carry the depth.
- **NEVER make file-ownership decisions from this skill alone when the relevant owner skills can answer them.** Load the owner skills first and use their standards as the authority.
- **NEVER apply approved changes by direct edit from this skill, even if the change looks mechanical.** Every accepted proposal should be executed through the relevant owner skill or skills.
- **NEVER batch-apply a whole cleanup pass without review when the user asked for proposal-by-proposal approval.** Show each proposed change, then wait for accept / deny / discuss.
- **NEVER invent a new canonical home on the fly.** Route content only into an existing file purpose, or explicitly surface that the right destination file is missing.
- **NEVER silently widen the audit scope.** If the user asked about five files, keep the first pass on those five unless new files are clearly required and you explain why.
- **NEVER let convenience override document ownership.** The right home is decided by the relevant owner skills, not by where the sentence was easiest to leave.
- **NEVER treat the "audit and apply" default as license to write a file without the Stage 6 gate.** That default decides whether you continue past the issue list to build a change plan at all — it never decides whether a change plan gets written without a diff preview and an explicit Accept. If no one is available to respond to Accept/Deny/Discuss, stop at the gate; do not self-approve on their behalf.

## Before auditing, apply defaults

Do not ask the user these questions. Check whether the user already specified an answer for each one; if not, use the default and proceed.

1. **Audit only, or audit and apply?**
   - If the user says something like "for now, just verify," stop after the issue list.
   - Default: audit and apply. "Apply" here means: continue past the issue list into Stage 5's change plan and Stage 6's diff preview. It does not mean writing a file before Stage 6's Accept/Deny/Discuss gate has actually been answered — that gate is not optional and does not depend on whether the user asked for a one-by-one walkthrough.
2. **Exact scope, or default canonical set?**
   - If the user names specific files, scope to those.
   - Default set: `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `CONSTRAINTS.md`, `JARGON.md`, `EPISTEMIC-MAP.md`, `README.md`, `openspec/config.yaml`.
3. **Lossless moves only, or broader cleanup too?**
   - If the user asks for broader cleanup, honor that.
   - Default: lossless moves only.
4. **Should missing destination docs be reported only, or also created/refreshed?**
   - If the user asks for missing docs to be created or refreshed outright, honor that.
   - Default: report first, create only with approval.

Announce the defaults you are applying for any question the user did not answer, so the assumption is visible before work starts.

## Workflow

Follow these stages in order.

### Stage 1: Establish scope and read the real sources

1. Determine the in-scope files using the defaults above, applying any explicit scope the user already gave. Do not pause to ask the user to confirm this list before proceeding.
2. Read every in-scope file fully before judging overlap.
3. If both `AGENTS.md` and `CLAUDE.md` exist, determine whether one is a pointer stub to the other before treating them as independent sources.
4. If a file is missing, do not treat that as drift by itself. It becomes relevant only if another file is carrying content that clearly belongs there.
5. Announce the file set you are auditing.

### Stage 2: Use subagents for the owner-skill review pass

When subagents are available, this is the first major place to use them.

Spawn one subagent per owner/file pair for the in-scope review set. Each subagent should:

1. load the relevant owner skill
2. read its assigned file fully
3. judge that file using the owner skill's own document-ownership and guardrail logic
4. return only a compact structured finding set, not a long prose transcript

At minimum, run one owner-skill review for every file under review. If a file is also a likely destination for moved content, include that destination-owning skill in the review pass too.

Treat those owner-skill subagents as the authority for:

- what belongs in each document
- what counts as correct pointer behavior versus improper duplication
- what level of detail must survive a lossless move
- where moved content should land inside the destination document

Use the routing map above only to decide which owner skill to spawn. Do not use this skill's summary table as a substitute for the owner skills' actual judgment.

Keep the parent context lean. Each review subagent should return only what the parent actually needs for later stages:

- issue ID or local finding ID
- current file and location
- suspected drift type
- proposed canonical home
- short evidence excerpt
- short note naming the owner-skill rule or boundary behind the finding
- any uncertainty or conflict with another likely owner skill

Do not spawn a second-wave reducer subagent just to repackage the same findings. Merge the compact finding sets in the parent context.

If subagents are unavailable, invoke or load the owner skills inline, but keep the same discipline: consult them before judging drift and carry forward only compact findings.

### Stage 3: Detect the drift type

Using the owner skills' judgment, classify each issue before proposing any edits.

| Drift type | What it means | Typical fix |
| --- | --- | --- |
| Exact duplication | Same information appears in two places with no different job | Keep the canonical copy, replace the other with a pointer or remove it after the move |
| Paraphrased duplication | Same idea is repeated with slight wording differences | Consolidate into one canonical statement, leave only the behavior-changing pointer elsewhere |
| Wrong-home content | A statement lives in the wrong document layer | Move it to the right file, possibly leaving a brief pointer behind |
| Conflict | Two files state incompatible versions of the same fact | Surface both, do not silently pick one; ask or verify before editing |
| Missing-home candidate | One file contains content whose correct destination file does not exist yet | Report it and ask whether to create/refresh the missing canonical file |
| Missing pointer | A file should point to another canonical doc instead of restating it | Add the pointer rather than duplicate the source material |

Before marking anything as exact or paraphrased duplication, quote the overlapping passage from each file side by side. If one is a condensed orientation summary (fewer examples, a simpler diagram, aggregate counts) and the other is the complete reference it's summarizing, that is not duplication — covering the same subsystem is not the same as carrying the same information. Only classify it as duplication if the two passages would actually need to change in lockstep.

### Stage 4: Produce the verify-only findings first

If the user asked to verify only, stop here.

Report issues in a compact, itemized list with these fields:

- **Issue ID**
- **Current location**
- **Proposed canonical home** (according to the relevant owner skill or skills)
- **Drift type**
- **Why this is drift**
- **Exact excerpt or a tightly scoped summary**

Keep this pass descriptive, not prescriptive. The goal is to show what is wrong before deciding how to fix it. Make it clear which owner skill boundary or rule makes the current placement drift.

### Stage 5: Turn findings into a lossless change plan

For each issue, convert the owner-skill-backed finding into a specific move.

Use this structure:

| Proposal | Action | From | To | Lossless check |
| --- | --- | --- | --- | --- |
| `P1` | move / consolidate / pointer / no-change | source file + section | destination file + section | explain where the same detail will live afterward |

For every deletion or trim, explicitly state where the surviving content will remain. If you cannot point to that destination, the change is not lossless yet.

### Stage 6: Review proposals one by one with diff previews

This stage is mandatory for every proposal, in every mode, regardless of the audit-vs-apply default and regardless of whether the user explicitly asked for a one-by-one walkthrough. There is no proposal that skips straight from a finding to a file edit. If the user did ask to walk proposals one by one, this is also exactly the pacing to use — one proposal, one decision, before moving to the next.

If no one is available to respond to the prompt below in this turn (for example, the skill was invoked with no further task text at all), present the proposal and its diff preview, end on the Accept/Deny/Discuss prompt, and stop there. Do not treat silence or absence of a human response as acceptance.

For each proposal:

1. Show a one-paragraph rationale.
2. Show a git-diff-style preview for **every affected file**.
3. End with a direct prompt: **Accept / Deny / Discuss**.
4. Wait before moving to the next proposal.

Use a preview like this:

```diff
--- AGENTS.md
- Deployment topology: API runs in ECS behind ALB, worker runs on Fargate...
+ Read `ARCHITECTURE.md` before changing deployment-related code.

--- ARCHITECTURE.md
+ Deployment topology: API runs in ECS behind ALB, worker runs on Fargate...
```

If a proposal only adds a pointer, show just that file. If a proposal changes three files, preview all three together so the user can verify the move is truly lossless.

### Stage 7: Use subagents for the apply pass

When subagents are available, this is the second major place to use them.

Stage 7 only ever begins after a proposal has actually been accepted in Stage 6 — never as a direct continuation of "audit and apply" on its own. Do not apply accepted proposals with direct edits from this skill, even when the change appears mechanical.

For every affected file, spawn the relevant owner-skill subagent and pass it the approved proposal, the exact content to preserve, and any required pointer or removal behavior in the other files. Let the owner-skill subagent decide how to land the change inside its own canonical document while preserving the approved scope.

If one proposal affects multiple files, spawn every relevant owner-skill subagent needed for that proposal. Keep the accepted move synchronized across them and do not let any one subagent silently widen the approved scope.

Do not insert an extra proposal-shaping or apply-reducer subagent between the approval loop and the file-owner apply subagents. Once the user approves a proposal, go straight from the parent approval state to the relevant owner-skill apply subagents.

If subagents are unavailable, invoke the owner skills inline and still keep this rule: the owner skill applies the change, not this orchestrator acting on its own.

**Examples:**

```text
Invoke the accelint-onboard-agents skill.

Apply the approved change below to AGENTS.md only.
Remove the architecture detail from AGENTS.md, keep a short behavior-level pointer, and preserve the original meaning without widening scope.
```

```text
Invoke the accelint-architecture-doc skill.

Add the approved deployment-detail block into ARCHITECTURE.md at the correct architectural section. Preserve the existing structure and keep the imported detail at the same level of specificity.
```

Use this routing table:

- `AGENTS.md` / `CLAUDE.md` → `accelint-onboard-agents`
- `openspec/config.yaml` → `accelint-onboard-openspec`
- `ARCHITECTURE.md` → `accelint-architecture-doc`
- `CONSTRAINTS.md` → `constraints-extractor`
- `EPISTEMIC-MAP.md` → `epistemic-mapper`
- `JARGON.md` → `jargon-extractor`
- `README.md` → `accelint-readme-writer`

### Stage 8: Summarize what changed and what still needs attention

After applying approved changes, report:

- which proposals were accepted, denied, or left open
- which files changed
- which drift issues remain unresolved
- whether any missing canonical file still needs to be created

## Output modes

Choose the lightest mode that matches the request.

### 1. Audit mode
Use when the user says "check," "verify," "audit," or "list issues."

Output:
- scoped file list
- issue list only
- no edits

### 2. Change-plan mode
Use when the user wants itemized "move X from Y to Z" guidance.

Output:
- issue list
- proposal table
- no edits yet

### 3. Interactive apply mode
Use when the user wants to approve changes one by one.

Output:
- proposal-by-proposal diff previews
- accept / deny / discuss loop
- apply only approved proposals

## Important notes

- Load the relevant owner skills near the start of the task, not only after findings are already formed.
- Use subagents in two places only when they are available: the owner-skill review pass and the owner-skill apply pass.
- Keep Stage 3 through Stage 6 in the parent context so the skill does not bounce the same finding data through unnecessary reducer or proposal subagents.
- This skill coordinates cross-document comparison and approval; it does not replace file-specific judgment from the owner skills.
- Prefer a pointer over duplication when a file only needs to change reader behavior.
- Prefer the smallest valid move. Do not use a cross-document drift check as an excuse for broad rewriting.
- If two files disagree on a fact, treat that as a conflict to resolve, not a cleanup opportunity.
- If a user gives a subset like `AGENTS.md`, `ARCHITECTURE.md`, and `openspec/config.yaml`, keep the reasoning model the same but limit the audit to that subset.
- If the user says the changes must be lossless, preserve the same operational detail even when the exact wording changes.
