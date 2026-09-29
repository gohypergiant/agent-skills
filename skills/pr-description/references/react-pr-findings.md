# Findings from the React PR study

This reference distills the specified React PRs into reusable writing guidance. It is calibration material, not a universal template: the PRs come from two senior maintainers in a performance- and compatibility-sensitive codebase with internal rollout infrastructure. Reuse their epistemic discipline and causal explanations, not their assumed audience, length, or deployment mechanisms.

## Sources

- [#18796, Initial Lanes implementation](https://github.com/facebook/react/pull/18796)
- [#20890, \[Experiment\] Lazily propagate context changes](https://github.com/facebook/react/pull/20890)
- [#19703, Disable timeoutMs argument](https://github.com/facebook/react/pull/19703)
- [#22644, useId](https://github.com/facebook/react/pull/22644)
- [#20970, Basic Fizz Architecture](https://github.com/facebook/react/pull/20970)
- [#14182, Use unique thread ID for each partial render to access Context](https://github.com/facebook/react/pull/14182)
- [#21021, Don't delete trailing mismatches during hydration at the root](https://github.com/facebook/react/pull/21021)
- [#25571, Try assigning fetch to globalThis if global assignment fails](https://github.com/facebook/react/pull/25571)

## What the examples support

### Describe current behavior and why it exists

The strongest descriptions begin with the system's present behavior, its purpose, and the state that exposes its cost or failure. In #20890, the provider-change scan exists to prevent an invalid bailout through a memoized wrapper before the description explains when that scan is wasted. In #21021, retained streaming segments and hydration timing form a concrete cause chain before the new exception rule appears.

Do not begin with "this PR adds" or a file list. A reader should understand the existing world and consequence before learning the mechanism.

### Explain policy with its model

The descriptions make the state model visible before stating a policy. #19703 separates an initial load from a refresh, then derives the effective timeout behavior. #22644 states the `useId` representation and walks through the tree-position invariant with a diagram. #18796 contrasts priority ordering with bitmask membership rather than merely asserting that lanes are better.

When a PR replaces a continuum with a simple rule, define the meaningful states first. When correctness depends on an unfamiliar representation, show a small example or diagram.

### State the contract, exact boundary, and preserved behavior

#14182 identifies the shared-state cross-talk, then explains that each partial renderer receives a unique thread identifier. #21021 names existing document-level mismatch precedent, the uncovered `<body>` case, the exact root-only change, and the behavior that remains erroneous. These are all parts of the correctness argument.

For compatibility-sensitive changes, state what is not changed or still invalid. For platform-facing or global mutations, put mutation scope and restricted-environment fallback in the initial description; #25571's discussion shows the cost of leaving that explanation to review comments.

### Be precise about risk and operational status

The sources distinguish a complete behavior change from a scaffold, experiment, or theoretical performance claim. #20970 opens by saying its architecture shell does not work yet. #14182 labels its performance claim as theoretical and its deoptimization coverage as unconfirmed. #20890 calls the rollout risky because of possible semantic deviations. #18796 describes the feature flag, affected builds, gradual rollout, and rollback rather than relying on the phrase "behind a flag."

Keep each prediction adjacent to its evidence status. If a rollout exists, name its real containment mechanism. Do not invent one when it does not.

### Match form to novelty and reviewer need

#18796 needs a five-heading, roughly 1,348-word migration explanation. #20970 needs a mini-design document because it establishes an architectural model. #20890 conveys a focused optimization in about 539 words without headings. #14182 makes a compact bug argument with a production scenario and a failing regression test. #25571's one-sentence description was too thin: reviewers had to extract mutation and fallback constraints from the discussion.

A short description is not inherently better. Use the smallest form that lets a non-expert reviewer evaluate the behavior, mechanism, contract, risk, and evidence.

### Evidence means an observable scenario

The PRs commonly name the scenario their tests or rollout validate: selective hydration preserving identifiers in #22644, parallel streams isolating context in #14182, or root versus nested hydration behavior in #21021. Their initial descriptions often lack a conventional command-by-command test section, but later review conversation supplies evidence and gaps.

A reusable skill should retain a re-runnable `Test plan` by default when local conventions allow it. It should not infer from these examples that unstructured validation is sufficient. State unrun performance, production, compatibility, or migration coverage plainly.

## Limits of the evidence

- The sample is small and author-specific: six PRs are by Andrew Clark and two by Sebastian Markbåge.
- React's internal feature flags, dogfooding, and rollback paths are not available in every repository.
- The examples optimize for advanced framework contributors; terminology must be defined or simplified for a broader reader.
- Merged status does not prove a description was complete. #25571 needed key safety and fallback context in comments, and #14182 later revealed a regression.
- These descriptions vary sharply by change class. Do not impose a migration memo on a small validation fix, or a one-paragraph fix form on a new public API or subsystem.
