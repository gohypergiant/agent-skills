# Pull request description template

Use this template after inspecting the repository PR template and conventions. The repository template controls required headings and field order. Delete every optional heading that does not earn its place; a small fix may use only the title, one paragraph, and the test plan.

Write in plain technical English: use concrete nouns and verbs, define only the one term the reader needs, qualify claims to their evidence, and preserve necessary technical detail. Do not make the prose vague or casual in the name of simplicity.

**PR title:** `[surface and behavior change (issue or plan item when the repository convention uses one)]`

```md
[Describe the current behavior or gap in present tense. State who or what is affected and why it matters. Define one unfamiliar term only if the reader needs it to evaluate the change. Do not mention files or list edits yet.]

## Mechanism

[Explain the chosen mechanism as an argument: we do X because Y; it works because Z. Where relevant, name the existing precedent, uncovered state, or case taxonomy before the exact new rule. Attach one concrete artifact to each idea: an invariant, request/response, small example, test fixture, or measured result.]

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
- If `main` is the target branch, base the description on `git log main..HEAD` and `git diff main...HEAD`, not only the most recent commit.
