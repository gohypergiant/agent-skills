# Pull request description template

Use this template after inspecting the repository PR template and conventions. The repository template controls required headings and field order. Delete every optional heading that does not earn its place; a small fix may use only the title, one paragraph, and the test plan.

Write in plain technical English: name the actual object instead of an abstract noun standing in for it, give each sentence one job, qualify claims to their evidence, and preserve necessary technical detail. Do not make the prose vague or casual in the name of simplicity.

**PR title:** `[surface and behavior change (issue or plan item when the repository convention uses one)]`

```md
[Describe the current behavior or gap in present tense. State who or what is affected and why it matters. Define one unfamiliar term only if the reader needs it to evaluate the change. Do not mention files or list edits yet.]

## Change outline

[Optional. Delete this heading unless one compact, source-grounded structural view makes a non-obvious causal, control-flow, data-flow, UI-structure, or file-responsibility relationship easier to check. Introduce that relationship in one short sentence, then show the smallest useful view: a focused `diff`, request/response, pseudocode, shallow file tree, component tree, or call/data flow. This outline supplements rather than replaces the explanation of why this approach is correct, required literal artifacts, reader-oriented prose, validation evidence, or the test plan.]

## Why this approach

[Explain why this approach is correct: we do X because Y; it works because Z. Where relevant, name the existing precedent, uncovered state, or case taxonomy before the exact new rule. If the idea has a literal form in the diff — a signature, call site, or exact wording — show that literal text in a fenced block or inline span rather than describing it; otherwise attach the next most concrete artifact: an invariant, request/response, small example, test fixture, or measured result.]

## Assumptions and limits

[State the invariant or precondition that makes the change correct. Name preserved invalid behavior, non-goals, or fallback behavior when they bound a compatibility or platform-facing change. State the operational status, material risk, uncertainty, and decision rule if this is a scaffold, experiment, or performance bet.]

## What is not here

[Name intentional exclusions and the follow-up, issue, or plan only when it exists. Omit this section when no boundary needs explanation.]

## Documentation / migration

[Name the required documentation, changelog, migration note, or say why none is needed when public behavior, an API, or a documented number changed. Omit if the repository template already captures this.]

## Test plan

- [ ] `[exact command]` — [environment, fixture/workload, and observed result]
- [ ] [comparison, rollout, or manual validation] — [baseline, containment mechanism, and result or output location]
- [ ] Not run — [reason and remaining evidence gap, if applicable]
```

## Compact form for a small fix

**PR title:** `[surface and behavior change]`

```md
[Broken input or current behavior] [fails or is unsafe] because [cause]. [New bound, validation, or rule] is correct because [constraint, issue, or prior decision].

## Test plan

- [ ] `[exact command]` — [what it verifies]
```

## Evidence notes

- Replace every bracketed instruction; do not leave placeholders in the submitted PR.
- A benchmark claim needs the metric, workload or fixture, environment or machine, sample size when relevant, and command/report/CI provenance.
- A visual change needs a screenshot, recording, or explicit manual verification path.
- Identify the PR target branch and resolve `<base>` to `origin/<target>` when that remote-tracking ref exists; otherwise use the local target branch. Base the description on `git log --no-merges <base>..HEAD` for branch-authored history and `git diff <base>...HEAD` for the authoritative PR scope—not only the most recent commit. Do not use merge-commit metadata, including a `git pull origin <target>` merge, in the title or body. Keep conflict-resolution changes when they remain in the three-dot diff.
- Add an optional `## Before / after` heading — a short fenced block or table — when a signature, import path, or call-shape change needs more than one inline excerpt to show clearly.
