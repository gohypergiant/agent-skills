---
name: pr-description
description: Use when the user wants to write, draft, rewrite, review, improve, or grade a pull request description or PR title; asks for a PR summary, rationale, reviewer context, test plan, or ready-to-paste GitHub/GitLab PR body; or needs to explain a code change to reviewers, future maintainers, or non-expert integrators. Trigger on requests such as "write the PR," "draft a pull request," "improve this PR description," "PR summary," "PR title," "test plan for the PR," or "review my PR write-up." Do not use for commit-message-only requests, release notes, implementation planning, or code review without a request to describe the change.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.1.1"
---

# PR Description

Write a PR as durable engineering context, not a narrated diff. The reader should understand the problem, the argument for the chosen mechanism, the contract it relies on, and the evidence without knowing this part of the codebase.

Use plain technical English: prefer concrete nouns and verbs, define only the term the reader needs, keep claims qualified to their evidence, and use the shortest form that preserves the technical meaning. Plain does not mean vague, casual, or stripped of necessary detail.

Use `assets/pr-description-template.md` as the output skeleton. Load `references/pr-description-rubric.md` to grade a draft before delivery or when the user asks for a review. For source-grounded examples of the writing model and its limits, load `references/react-pr-findings.md`.

## Never do this

- **Never start with a file list or a past-tense edit summary.** It makes the reviewer reconstruct the motivation from the diff and leaves no durable explanation in git history.
- **Never invent a test result, benchmark, issue, design decision, or baseline.** If evidence is unavailable, say what remains unrun or unknown; a plausible number is worse than no number.
- **Never state a performance claim without provenance.** Name the metric, workload or fixture, hardware or environment, sample size when relevant, and the command, report, or CI run that produced it.
- **Never make a conditional bet sound settled.** State the decision rule and what observation would falsify the bet before reporting its result.
- **Never present a scaffold, experiment, or theoretical performance claim as production-complete.** State its status, remaining evidence gap, and the containment mechanism that exists today.
- **Never make safety, compatibility, or fallback behavior discoverable only in review comments.** If the change touches global state, platform behavior, hydration, serialization, or interoperability, state what changes, what remains invalid or untouched, and what happens in restricted or failure environments.
- **Never use a heading with only a restated diff bullet beneath it.** The diff already records filenames and edits.
- **Never turn a small fix into an essay.** A sentence or short paragraph is sufficient when the behavior, reason, bound, and evidence fit there.
- **Never omit an important scope boundary.** Say which similar-looking behavior is deliberately unchanged and where a necessary follow-up belongs.
- **Never override the repository's PR template, contribution rules, or title convention.** Their required fields and placement win; use this skill's prose inside that structure.

## Gather the evidence before drafting

Read the branch as a whole, then collect the facts that make a claim checkable.

1. Read `AGENTS.md`, `CONTRIBUTING.md`, and any nested instruction files that govern changed paths. Find the repository PR template at `.github/pull_request_template.md` or `.github/PULL_REQUEST_TEMPLATE/`.
2. Identify the PR target branch. When it is `main`, run:
   ```bash
   git log main..HEAD
   git diff main...HEAD
   ```
   When the target differs, substitute only the target branch. Read both the commit sequence and the full three-dot diff; the final commit may omit the change's motivation or an earlier compatibility decision.

   When `which sem` succeeds and an entity-level view would clarify the change, Sem may add supplementary semantic evidence after those Git commands:
   ```bash
   sem diff --from <base> --to HEAD --format json --no-cosmetics
   ```
   Use its entity names and change types to focus source inspection. If a changed entity needs related-test discovery, you may run:
   ```bash
   sem impact --entity-id <entityId> --tests --format json
   ```
   Sem never replaces `git log <base>..HEAD` or `git diff <base>...HEAD`, and neither command is test or validation evidence. Sem diffs exclude untracked files; inspect any relevant paths from `git status --short` directly before claiming branch coverage. If Sem is unavailable, unsupported, or fails, continue with the Git and source-inspection workflow without asking the user.
3. Inspect recent merged PRs and recent `git log` subjects to learn the title convention: prefixes, scopes, capitalization, issue references, and sentence style.
4. Find the issue, design document, plan item, acceptance criterion, or discussion that motivated the change. Read the relevant code and tests until you can state the old behavior and its purpose, the new behavior, the relevant precedent or gap, and the reason for the boundary.
5. Collect validation evidence. Record exact commands, fixtures or workloads, before/after comparison, environment, output location, screenshots, CI run, and failures or unrun checks. If the change affects a public API, documented number, migration path, or user-visible behavior, identify the documentation or changelog follow-up.

If a material fact cannot be established from the branch or supplied context, ask a focused question before making that claim. Do not ask for facts that the repository can answer.

## Choose the shape by novelty

Use the shortest form that leaves a non-expert reader able to evaluate the behavior change.

- **Small, bounded fix:** one or two sentences. State the broken input or behavior, the new bound or rule, and why that boundary is correct.
- **Behavior change or non-obvious implementation:** lead with a present-tense problem paragraph, then explain the causal mechanism, relevant prior behavior, and correctness contract.
- **Experiment, scaffold, performance work, or public API:** state the operational status explicitly, then add concise sections only where they help navigation: `Motivation`, `Mechanism`, `Assumptions and limits`, `What is not here`, and `Test plan`. Include a decision rule when the work is a bet.

Do not preserve empty headings from the template. If the repository template requires a heading, satisfy it with reader-oriented prose rather than a diff list.

## Write the argument

### 1. State the world before the change

Open in present tense with what a caller, user, or maintainer experiences today. Name the affected surface and consequence before mentioning files or implementation. Define the one term the reader needs to judge the change the first time it appears, in a short clause.

A useful test: if the reader stops after the first paragraph, can they explain what is wrong without opening the diff?

### 2. Explain the mechanism causally

Explain one idea at a time: we do **X** because **Y**; that works because **Z**. Tie each idea to one inspectable artifact: a request and response, an invariant, a line whose meaning changed, a small table, a test fixture, or a measured number.

When a policy replaces a configurable continuum, identify the meaningful states before stating the policy: for example, initial load versus refresh. When an existing special case or precedent defines the safe boundary, name the precedent, the uncovered case, and the exact change. Name alternatives only when rejecting them helps a reviewer evaluate the choice. Avoid a chronological account of discovery or a file-by-file tour.

### 3. Name the correctness contract

State the assumption, invariant, or precondition that makes the behavior correct. Examples: cache keys include the full input; rows are independent; a presentation-order change does not alter question meaning; a parser normalizes input before validating it. State preserved invalid behavior, non-goals, or fallback behavior when those boundaries prevent a reader from inferring a broader compatibility promise. If the contract can break, state the consequence or guard that detects it.

### 4. Expose uncertainty and boundaries

State the uncertainty when it changes how the PR should be reviewed. For an experiment or performance bet, define the metric, workload, threshold, and next decision before the result: for example, "make this opt-in only if p95 latency stays below X under workload Y". Keep a theoretical claim and its validation status adjacent.

When a staged rollout exists, name the actual feature flag, audience, rollback path, or containment boundary; do not say only that the work is "behind a flag." State what this PR intentionally leaves unchanged, especially when an adjacent surface looks similar. Point to the issue, plan item, or follow-up only when one exists; do not invent one to make the scope sound complete.

### 5. Make validation re-runnable

End with the repository-required test-plan section, or `Test plan` when it does not prescribe one. Each checklist item should give evidence a reviewer can repeat:

- exact command and relevant environment;
- fixture, workload, input, or comparison baseline;
- observed result or output location; and
- screenshots or recordings for visible UI changes.

Use `Not run — <reason>` for unrun checks. "Tests pass" is not evidence. For benchmarks, include the provenance required by the hard stop; for parity, state exactly what was compared and whether the output was byte-identical or semantically equivalent.

## Title and delivery

Write the title as the likely squash-commit subject. Name the surface and behavior change, preserve the exact casing of public identifiers, include the issue or plan item when the repository convention calls for it, and match the observed prefix/scope convention. Prefer a concrete sentence such as `benchmark --rotations: test-time cyclic option averaging for Choice (#412)` over `Add rotations flag`.

By default, return a ready-to-paste title and PR body. If the user asks to audit or grade an existing description, include the criterion-by-criterion review from `references/pr-description-rubric.md`, then give a revised ready-to-paste version. Do not claim a grade is a validated measurement; it is a local writing review grounded in the inspected branch and available evidence.

Before delivering, check that:

- the opening describes the prior behavior in present tense;
- each mechanism paragraph carries a reason and an inspectable artifact;
- the material correctness contract, including relevant precedent, non-goal, or fallback, is stated or explicitly not applicable;
- the status of an experiment or scaffold is accurate, and any stated rollout names a real containment mechanism;
- uncertainty, decision rules, and deliberate exclusions are present when relevant;
- every factual claim is supported by branch, issue, test, benchmark, or supplied evidence;
- documentation, migration, or changelog follow-up is named when the change moves a public contract; and
- the title, template fields, and test-plan placement follow repository conventions.
