# accelint-ac-to-playwright

This skill converts acceptance criteria into JSON test plans and then Playwright spec files.

## Contents

- `SKILL.md` — skill instructions.
- `references/`:
  - [acceptance-criteria.md](references/acceptance-criteria.md) contains guidance for writing and reading AC
  - [test-hooks.md](references/test-hooks.md) contains rules for structuring test hooks
  - This [schema](scripts/plan-schema.ts) is used to validate JSON test plans
- `scripts/` — translators, validators, and CLI entry points.
- `assets/examples/` (for local development/demo only!):
  - Acceptance criteria files are stored in [assets/examples/acceptance/](assets/examples/acceptance/).
  - Test plans are stored in [assets/examples/plans/](assets/examples/plans/).
  - Playwright tests are created in [assets/examples/tests/](assets/examples/tests/).
  - Summary files are created in [assets/examples/summaries/](assets/examples/summaries/).
- `assets/templates/` — template files users can copy as starting points:
  - [playwright.config.ts](assets/templates/playwright.config.ts) — portable Playwright config for running generated specs.

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
- click - clicks an element.
- doubleClick - double-clicks at x,y coordinates (not element-based).
- fill - adds text to an element (generally `<input>` or `<textarea>` elements only). Use this for entering data into form fields.
- goto - generally only used at the start of a test to get to the starting URL.
- hover - hovers over an element.
- keyDown - presses and holds a modifier key (accepts `Shift`, `Control`, or app-specific modifier `a`). Must be paired with `keyUp` to release the key.
- keyUp - releases a held modifier key (accepts `Shift`, `Control`, or app-specific modifier `a`). Must be paired with a preceding `keyDown`.
- mouseClick - clicks at x,y coordinates (not element-based).
- mouseDown - presses a mouse button at the current cursor position.
- mouseMove - moves the mouse cursor to x,y coordinates.
- mouseUp - releases a mouse button at the current cursor position.
- press - presses and immediately releases a single keyboard key (accepts unmodified characters like `a`, `1`, `,` or named keys like `Enter`, `Tab`, `F7`, `Space`, `ArrowLeft`). For simple keyboard actions or for pressing keys while a modifier is held (between `keyDown` and `keyUp`). Intended for page-wide keyboard shortcuts, not for entering text into input fields (use `fill` instead).
- reload - refreshes the page.
- scroll - scrolls the page in a direction by a specified pixel amount.
- select - picks an item from a select dropdown.

And the following assertions:
- expectNotVisible - the element should not be visible on the page (can be present in the DOM or not).
- expectText - the element should contain some specific text.
- expectUrl - the current page should be some specific URL.
- expectVisible - the element should be visible on the page.

## Acceptance criteria notes

Acceptance criteria can be provided either in Gherkin (`.feature` files) or bullets (`.md` files). Gherkin provides more functionality as well as better clarity to the agent and is the recommended option.

In order to produce test plan files deterministically and without excessive questions, some care when drafting AC is essential. Please see the full guidelines (and examples) for both bullet-format and Gherkin-format AC at [acceptance-criteria.md](references/acceptance-criteria.md).

## Playwright config notes

The skill provides a template at `assets/templates/playwright.config.ts` that can be copied to your project.
- `testDir` defaults to `./tests`. Please update this based on where the tests and config land in your repo.
- `baseURL` defaults to `http://localhost:3000` as a placeholder. Please update if necessary.
- The rest of the config can be reviewed and changed as necessary based on your target repo and environment.
