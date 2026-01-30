# ac-to-playwright

This skill converts acceptance criteria into JSON test plans and then Playwright spec files.

## Contents

- `SKILL.md` — skill instructions.
- `references/`:
  - [ACCEPTANCE_CRITERIA.md](references/ACCEPTANCE_CRITERIA.md) contains guidance for writing and reading AC
  - [TEST_HOOKS.md](references/TEST_HOOKS.md) contains rules for structuring test hooks
  - This [schema](references/plan-schema.ts) is used to validate JSON test plans
- `scripts/` — translators, validators, and CLI entry points.
- `artifacts/` (for local development/demo only!):
  - Acceptance criteria files are stored in [artifacts/acceptance/](artifacts/acceptance/).
  - Test plans are stored in [artifacts/plans/](artifacts/plans/).
  - Playwright tests are created in [artifacts/tests/](artifacts/tests/).
  - Summary files are created in [artifacts/summaries/](artifacts/summaries/).
- `playwright.config.ts` — portable Playwright config for running generated specs.

## Quick usage

To generate Playwright tests from plan files, using your agent of choice, trigger this skill's usage with a prompt like:

- `Create Playwright tests from the AC files located at <insert path here>`
- `Change the AC file at <insert path here> into a Playwright test file`

When running the CLI, you must provide the tests and summary directories explicitly:

```
npx generate-tests path/to/plan.json --tests-dir path/to/tests --summary-dir path/to/summaries
```

## Current functionality

AC files are first converted to JSON plan files, which are validated against a schema. Validated JSON plan files are then converted to Playwright tests.

Tests can currently use the following actions:
- click - clicks something.
- fill - adds text to an element (generally `<input>` or `<textarea>` elements only).
- goto - generally only used at the start of a test to get to the starting URL.
- select - picks an item from a select dropdown.

And the following assertions:
- expectNotVisible - the element should not be visible on the page (can be present in the DOM or not).
- expectText - the element should contain some specific text.
- expectUrl - the current page should be some specific URL.
- expectVisible - the element should be visible on the page.

## Acceptance criteria notes

Acceptance criteria can be provided either in Gherkin (`.feature` files) or bullets (`.md` files). Gherkin provides more functionality as well as better clarity to the agent and is the recommended option.

In order to produce test plan files deterministically and without excessive questions, some care when drafting AC is essential. Please see the full guidelines (and examples) for both bullet-format and Gherkin-format AC at [ACCEPTANCE_CRITERIA.md](references/ACCEPTANCE_CRITERIA.md).

## Playwright config notes

The skill-local `playwright.config.ts` is a portable template that can be copied over along with the generated tests.
- `testDir` points at `./artifacts/generated`. Please update this based on where the tests and config land in your repo.
- `baseURL` defaults to `http://localhost:3000` as a placeholder. Please update if necessary.
- The rest of the config can be reviewed and changed as necessary based on your target repo and environment.
