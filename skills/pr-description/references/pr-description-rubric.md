# PR description rubric

Use this rubric after reading the full branch, repository template, and available validation evidence. It grades the description as durable explanatory writing, not the quality of the implementation. Keep scores local; do not average them into a claim of completeness.

For every criterion, record a **0–5 score**, source-cited evidence from the PR description or inspected branch, a finding state (`finding`, `no issue found`, or `not applicable with rationale`), a concrete revision recommendation or no-change rationale, and uncertainty. A criterion is `not applicable` only when the change genuinely lacks that concern; explain why.

## Scale

| Score | Meaning |
| --- | --- |
| 5 | A non-expert reader can verify the relevant claim from the description and cited evidence without reconstructing intent from the diff. |
| 4 | Clear and checkable; only a minor omission or compression opportunity remains. |
| 3 | The key point is present, but a reader must infer a material link, boundary, or evidence detail. |
| 2 | Mostly a diff summary, assertion, or convention with little explanatory support. |
| 1 | Misleading, unsupported, or materially incomplete. |
| 0 | Missing, contradicted, or fabricated. |

## 1. Problem and reader context

Does the opening explain the pre-change world and its purpose in present tense, name the affected surface, and make the consequence legible to a non-expert reader?

- A file list, "this PR adds," or a retrospective account scores at most 2 unless the change is genuinely trivial.
- Define the one domain term that the reader needs to evaluate the change; avoid a glossary dump.
- For a small fix, one precise sentence can score 5.

## 2. Mechanism and causal argument

Does the description explain why the chosen mechanism solves the stated problem, rather than merely naming changed files or functions?

- Look for `X because Y; this works because Z` reasoning.
- When a policy selects among discrete cases, ask what the cases are and whether the description names them before stating the policy. When precedent matters, ask what the old rule covered, what case fell outside it, and what the exact new rule is.
- Require one inspectable artifact per distinct idea: request/response, invariant, concise example, changed semantic rule, test fixture, or measurement. When the idea asserts a specific literal shape — a signature, request/response, exact wording, or call site — the artifact must be that literal text, not a description of it; cap the score at 3 if it is missing. Mark `not applicable with rationale` when the idea genuinely has no literal diff referent.
- Do not require a design history or alternatives that do not affect review.

## 3. Correctness contract

Does the description state the material assumption, invariant, or precondition the change relies on, and its failure consequence or guard when relevant?

- Examples include full-input cache keys, independent rows, normalized input, presentation-only ordering, and a restricted-environment fallback.
- For compatibility, platform, global-state, hydration, serialization, or interoperability work, ask what remains invalid, what is explicitly out of scope, and what the fallback does, when relevant.
- Mark `not applicable with rationale` only for a change with no meaningful correctness contract beyond an obvious local syntax correction.
- Do not convert a hoped-for property into an asserted invariant without source evidence.

## 4. Uncertainty, decision rule, and scope

Does the description name material uncertainty, falsifying evidence, and intentional exclusions?

- Performance or experimental work needs a predeclared metric, workload, threshold, decision consequence, and honest operational status.
- A staged rollout names the actual feature flag, audience, rollback, or other containment mechanism; "behind a flag" alone is insufficient.
- State what is deliberately not changed when adjacent behavior could be mistaken as in scope.
- Do not demand uncertainty theater for a settled, well-bounded bug fix; mark it not applicable with rationale instead.

## 5. Evidence and test plan

Can a reviewer repeat or inspect the validation?

- Test-plan items name exact commands, input/fixture/workload, baseline or comparison, result, and output or CI location when available.
- Benchmark claims name metric, workload, environment or machine, sample size when relevant, and script/report/CI provenance.
- UI changes point to screenshots, recordings, or a manual validation path.
- `Tests pass`, `verified`, or an unchecked generic checkbox scores at most 1.
- Unrun validation is stated honestly with its reason.

## 6. Repository integration and durable record

Does the title match the repository's observed convention and act as a useful squash-commit subject? Does the body honor the repository PR template and name necessary documentation, changelog, migration, or API follow-up?

- Do not penalize the absence of an issue reference when the repository does not use one.
- Public API, user-visible behavior, or documented-number changes should identify the required follow-up or explain why none is needed.
- A title such as `Add flag` lacks the behavior and surface needed for durable history.

## 7. Proportion and plain technical English

Does the description use the smallest form that lets the intended reader evaluate the change?

- New subsystem or public API: headings can improve navigation.
- Small fix: a short paragraph can be complete.
- Penalize scaffolding headings, duplicated diff narration, empty adjectives (`robust`, `clean`, `significant`), and claims the reader cannot inspect.
- Use `we` for project decisions and `I` for author judgment calls; do not require either where an impersonal statement is clearer.

## Review record template

```md
## PR description review

- Scope inspected: [base branch, `git log`/`git diff` range, PR template and instructions]
- Evidence limits: [missing issue, unrun benchmark, unavailable CI, or `None noted`]

### 1. Problem and reader context
- Score: [0–5 | not applicable]
- State: [finding | no issue found | not applicable with rationale]
- Evidence: [quote from description and/or branch source]
- Recommendation or no-change rationale: [specific change]
- Uncertainty: [limitation or none]

### 2. Mechanism and causal argument
[repeat the five fields]

### 3. Correctness contract
[repeat the five fields]

### 4. Uncertainty, decision rule, and scope
[repeat the five fields]

### 5. Evidence and test plan
[repeat the five fields]

### 6. Repository integration and durable record
[repeat the five fields]

### 7. Proportion and plain technical English
[repeat the five fields]

## Revision priorities
1. [highest-impact reader or evidence gap]
2. [next gap]
3. [continue only for applicable findings]
```

A low score directs revision. It is not evidence that the implementation is wrong, and a high score does not validate the implementation or replace code review.
