# accelint-react-testing eval cases report

## Coverage summary

Created 24 eval cases for `skills/accelint-react-testing/evals/evals.json`.

## Scenario categories

- Query priority
  - Covers role-first querying, label-first form queries, lower-signal text queries for interactive controls, and last-resort test ID cases.
  - Matters because the skill should push tests toward accessibility-verifying selectors instead of implementation-facing selectors.

- Query variants
  - Covers `getBy*` for synchronous presence, `findBy*` for async appearance, `queryBy*` for absence, and `waitForElementToBeRemoved` for disappearance.
  - Matters because variant misuse causes flaky tests, weak errors, and unnecessary waits.

- Async behavior
  - Covers async loading, disappearance, missing `await` on `userEvent`, and side effects inside `waitFor`.
  - Matters because async mistakes are a major source of flake, retries, and `act` warnings.

- `userEvent` vs `fireEvent`
  - Covers click, typing, and keyboard interactions, plus the boundary that `fireEvent` is mainly for unsupported or non-user events.
  - Matters because the skill explicitly prefers realistic interaction sequences over single-event dispatch.

- Provider setup and custom render
  - Covers repeated wrapper setup, custom render helpers, and documenting when shared render utilities are required.
  - Matters because connected components fail or produce noisy tests when provider requirements are scattered.

- Audit vs fix behavior
  - Covers direct-fix requests, audit requests, and review-oriented output expectations.
  - Matters because the skill includes both implementation guidance and a formal review path with a report template.

- Anti-patterns
  - Covers container queries, destructured render queries, rerender-driven state tests, broad snapshots, ARIA added only for tests, and selector-guessing during debugging.
  - Matters because these are recurring sources of brittle or misleading component tests.

- Scoped querying
  - Covers `within()` for subtree scoping inside modal-style UI.
  - Matters because scoped semantic queries are a common practical need in component tests.

- Non-trigger boundaries
  - Covers plain Node unit tests and Playwright E2E selector requests.
  - Matters because the skill should not over-trigger on non-RTL tasks.

## Why this set is high signal

- Focuses on the skill's stated trigger surface and reference topics.
- Includes both positive trigger cases and negative boundary cases.
- Exercises decision points, not just vocabulary matches.
- Targets patterns that materially affect accessibility confidence, test reliability, and audit quality.
