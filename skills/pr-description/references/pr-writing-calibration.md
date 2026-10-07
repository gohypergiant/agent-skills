# PR writing calibration facts

Short, plain facts about the source PRs analyzed in `references/react-pr-findings.md`, for use while drafting. Read `react-pr-findings.md` itself for the full analysis — that file is denser and is meant for grading a draft, not for shaping one.

- **#18796 (Lanes):** Needed five headings and about 1,348 words because it changes how work is prioritized across the whole scheduler. It contrasts priority ordering with bitmask membership instead of just asserting lanes are better.
- **#20890 (Lazily propagate context):** A focused optimization explained in about 539 words with no headings. Names the provider-change scan it bypasses and calls the rollout risky because of possible semantic deviations.
- **#19703 (Disable timeoutMs):** Separates an initial load from a refresh before stating the effective timeout rule, instead of stating the rule first.
- **#22644 (useId):** States the `useId` representation and the tree-position invariant with a diagram before the policy.
- **#20970 (Fizz architecture):** Opens by saying the architecture shell does not work yet — a scaffold's status is stated plainly, not implied.
- **#14182 (unique thread ID):** A compact bug argument with one production scenario and a failing regression test. Calls its own performance claim theoretical and its deoptimization coverage unconfirmed.
- **#21021 (hydration mismatches):** Names the existing document-level mismatch precedent, the uncovered `<body>` case, and the exact root-only change, in that order.
- **#25571 (global fetch fallback):** A one-sentence description that was too thin — reviewers had to extract the mutation-scope and fallback constraints from review comments instead of the description.

## Takeaway for drafting

Match the length and heading count to what the specific change needs to be checkable, not to a fixed template. State operational status and risk as plainly as the behavior itself. A diagram or a line-by-line contrast can make a point checkable just as well as a code excerpt — but when the idea's actual referent is a changed signature or call shape, show that literal form rather than describing it.

Use these facts to decide what a strong description covers. Do not borrow the analytical vocabulary from `react-pr-findings.md` ("epistemic discipline," "case taxonomy," "containment mechanism") — that register is for grading, not for writing.
