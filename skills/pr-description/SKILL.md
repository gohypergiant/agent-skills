---
name: pr-description
description: Use when the user wants to write, draft, rewrite, review, improve, or grade a pull request description or PR title; asks for a PR summary, rationale, reviewer context, test plan, or ready-to-paste GitHub/GitLab PR body; or needs to explain a code change to reviewers, future maintainers, or non-expert integrators. Trigger on requests such as "write the PR," "draft a pull request," "improve this PR description," "PR summary," "PR title," "test plan for the PR," or "review my PR write-up." Do not use for commit-message-only requests, release notes, implementation planning, or code review without a request to describe the change.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.4.0"
---

# PR Description

Write a PR as durable engineering context, not a narrated diff. The reader should understand the problem, the argument for the chosen mechanism, the contract it relies on, and the evidence without knowing this part of the codebase.

Use plain technical English. Name the actual object — a function, type, flag, file, or parameter — instead of an abstract noun that stands in for it; a noun ending in *-ion, -ity, -ment, -ance,* or *-ence* that could be replaced by the real identifier it refers to is a tell. Give each sentence one job: a sentence that states a cause, a qualification, and a scope boundary at once should become two sentences. Plain does not mean vague, casual, or stripped of necessary detail — qualify claims to their evidence and keep the one term the reader needs; just say it plainly.

**Avoid:** "This makes provider selection, the lifecycle instance type, and the dependency implicit."
**Write:** "Callers must now choose the provider and lifecycle instance explicitly; nothing infers them."

Use `assets/pr-description-template.md` as the output skeleton. For source-grounded calibration facts while drafting, load `references/pr-writing-calibration.md`; use it to decide what to say, not how to phrase it, and do not reuse its vocabulary unless the repository's own conventions already use it. Load the deeper analysis in `references/react-pr-findings.md` and the criterion-by-criterion `references/pr-description-rubric.md` only to grade a draft before delivery or when the user asks for a review — their denser register is calibration for review, not a drafting voice to imitate.

## Never do this

- **Never start with a file list or a past-tense edit summary.** It makes the reviewer reconstruct the motivation from the diff and leaves no durable explanation in git history.
- **Never invent a test result, benchmark, issue, design decision, or baseline.** If evidence is unavailable, say what remains unrun or unknown; a plausible number is worse than no number.
- **Never state a performance claim without provenance.** Name the metric, workload or fixture, hardware or environment, sample size when relevant, and the command, report, or CI run that produced it.
- **Never make a conditional bet sound settled.** State the decision rule and what observation would falsify the bet before reporting its result.
- **Never present a scaffold, experiment, or theoretical performance claim as production-complete.** State its status, remaining evidence gap, and the containment mechanism that exists today.
- **Never make safety, compatibility, or fallback behavior discoverable only in review comments.** If the change touches global state, platform behavior, hydration, serialization, or interoperability, state what changes, what remains invalid or untouched, and what happens in restricted or failure environments.
- **Never use a heading with only a restated diff bullet beneath it.** The diff already records filenames and edits.
- **Never paraphrase a signature, call pattern, or exact wording in prose when the literal form is available and the reader needs to see it.** A quoted span is evidence; a sentence describing it is not a substitute.
- **Never turn a small fix into an essay.** A sentence or short paragraph is sufficient when the behavior, reason, bound, and evidence fit there.
- **Never omit an important scope boundary.** Say which similar-looking behavior is deliberately unchanged and where a necessary follow-up belongs.
- **Never override the repository's PR template, contribution rules, or title convention.** Their required fields and placement win; use this skill's prose inside that structure.
- **Never use merge-commit subjects, messages, or inherited target-branch history as PR narrative evidence.** A `git pull origin <target>` merge may appear in branch history, but the PR title and body must describe only branch-authored non-merge history and the net changes in the three-dot diff.

## Gather the evidence before drafting

Read the branch as a whole, then collect the facts that make a claim checkable.

1. Read `AGENTS.md` and `CONTRIBUTING.md`. Find the repository PR template at `.github/pull_request_template.md` or `.github/PULL_REQUEST_TEMPLATE/`.
2. Identify the PR target branch. Resolve `<base>` to `origin/<target>` when that remote-tracking ref exists; otherwise use the local target branch. Run:
   ```bash
   git log --no-merges <base>..HEAD
   git diff <base>...HEAD
   ```
   Read the non-merge commit sequence for branch-authored motivation or earlier compatibility decisions; the final branch commit may omit either. Treat the full three-dot diff as the authoritative PR scope. Do not use a merge commit—especially one produced by `git pull origin <target>`—as evidence for the PR title or body. Keep branch-side conflict-resolution changes when they appear in the three-dot diff. After the full three-dot diff identifies changed paths, read any nested instruction files that govern those paths before using Sem, inspecting source, collecting validation evidence, or drafting.

   When `which sem` succeeds and an entity-level view would clarify the change, Sem may add supplementary semantic evidence after those Git commands:
   ```bash
   sem diff --from <base> --to HEAD --format json --no-cosmetics
   ```
   Use its entity names and change types to focus source inspection. If a changed entity needs related-test discovery, you may run:
   ```bash
   sem impact --entity-id <entityId> --tests --format json
   ```
   Sem never replaces `git log --no-merges <base>..HEAD` or `git diff <base>...HEAD`, and neither command is test or validation evidence. Sem diffs exclude untracked files; inspect any relevant paths from `git status --short` directly before claiming branch coverage. If Sem is unavailable, unsupported, or fails, continue with the Git and source-inspection workflow without asking the user.
3. Inspect recent merged PRs and recent `git log` subjects to learn the title convention: prefixes, scopes, capitalization, issue references, and sentence style.
4. Find the issue, design document, plan item, acceptance criterion, or discussion that motivated the change. Read the relevant code and tests until you can state the old behavior and its purpose, the new behavior, the relevant precedent or gap, and the reason for the boundary. When a fact has a literal form in the diff — a signature, call site, config key, flag value, or exact prior/new wording — copy that literal text now, while the diff is open; do not plan to reconstruct it from memory while drafting.
5. Collect validation evidence. Record exact commands, fixtures or workloads, before/after comparison, environment, output location, screenshots, CI run, and failures or unrun checks. If the change affects a public API, documented number, migration path, or user-visible behavior, identify the documentation or changelog follow-up.

If a material fact cannot be established from the branch or supplied context, ask a focused question before making that claim. Do not ask for facts that the repository can answer.

## Choose the shape by novelty

Use the shortest form that leaves a non-expert reader able to evaluate the behavior change.

- **Small, bounded fix:** one or two sentences. State the broken input or behavior, the new bound or rule, and why that boundary is correct.
- **Behavior change or non-obvious implementation:** lead with a present-tense problem paragraph, then explain the causal mechanism, relevant prior behavior, and correctness contract.
- **Experiment, scaffold, performance work, or public API:** state the operational status explicitly, then add concise sections only where they help navigation: `Motivation`, `Change outline`, `Why this approach`, `Assumptions and limits`, `What is not here`, and `Test plan`. Include a decision rule when the work is a bet.

When a compact visual aid would make a non-obvious causal, control-flow, data-flow, UI-structure, or file-responsibility relationship more checkable, read `references/visual-explanations.md`. Select the form from the inspected evidence without asking the user unless the user makes the visual output shape a material preference. When the active repository template permits it, use the optional `Change outline` after the opening problem paragraph and before `Why this approach`; otherwise use the template's allowed prose, fenced block, table, or existing section. The aid is optional, must be adjacent to the prose it supports, and never replaces required literal artifacts, repository-template fields, reader-oriented prose, validation evidence, or the test plan.

When a compact visual aid would make a non-obvious causal, control-flow, data-flow, UI-structure, or file-responsibility relationship more checkable, read `references/visual-explanations.md`. Select the form from the inspected evidence without asking the user unless the user makes the visual output shape a material preference. The aid is optional, must be adjacent to the prose it supports, and never replaces required literal artifacts, repository-template fields, reader-oriented prose, validation evidence, or the test plan.

Do not preserve empty headings from the template. If the repository template requires a heading, satisfy it with reader-oriented prose rather than a diff list.

## Write the argument

### 1. State the world before the change

Open in present tense with what a caller, user, or maintainer experiences today. Name the affected surface and consequence before mentioning files or implementation. Define the one term the reader needs to judge the change the first time it appears, in a short clause.

A useful test: if the reader stops after the first paragraph, can they explain what is wrong without opening the diff?

### 2. Explain why this approach works

Explain one idea at a time: we do **X** because **Y**; that works because **Z**. Tie each idea to one inspectable artifact. If the idea's referent has a literal form in the diff — a signature, call site, config key, flag value, or exact prior/new wording — quote that literal form directly in the body; a prose description of it does not satisfy this. If no literal form exists, use the next most concrete thing available: an invariant, a request and response, a small table, a test fixture, or a measured number.

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

## Verify before delivery

Write the complete draft first, covering every applicable item below:

- the opening describes the prior behavior in present tense;
- each causal-argument paragraph carries a reason and an inspectable artifact;
- the material correctness contract, including relevant precedent, non-goal, or fallback, is stated or explicitly not applicable;
- the status of an experiment or scaffold is accurate, and any stated rollout names a real containment mechanism;
- uncertainty, decision rules, and deliberate exclusions are present when relevant;
- every factual claim is supported by branch, issue, test, benchmark, or supplied evidence;
- documentation, migration, or changelog follow-up is named when the change moves a public contract;
- each visual aid, when used, is compact, source-grounded, adjacent to its supporting prose, and supplementary to literal artifacts and evidence; and
- the title, template fields, and test-plan placement follow repository conventions.

Then, in a separate pass, re-read the finished draft as a fixed text to inspect, not a draft to continue. For each check below, quote the exact sentence or span before ruling pass or fail, and revise before moving on:

1. **Literal-form check.** For every sentence asserting a specific literal shape — a signature, request/response, exact wording, or call site — does the literal text appear nearby, not just a description of it? If not, pull it from the evidence gathered while reading the diff, or state why no literal form exists.
2. **Concrete-subject check.** Find every sentence whose grammatical subject is an abstract noun phrase (ending in *-ion, -ity, -ment, -ance,* or *-ence*) performing an action that a real caller, system, or line of code actually performs. Rewrite with the real actor as the subject.
3. **Compression check.** Find every sentence over roughly 25–30 words or carrying more than one subordinate clause. Split it, or cut the clause that is not carrying new information.

A check that passes because "it already basically says this" is not a pass; the span must satisfy the check on its own.
