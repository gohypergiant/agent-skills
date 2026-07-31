# accelint-ac-to-playwright

Convert acceptance criteria into Playwright test automation. This skill reads AC in bullet or Gherkin format, validates them for automation readiness, generates JSON test plans, and translates those plans into Playwright spec files.

## Contents

- **SKILL.md** — skill instructions for agents
- **references/** — AC writing rules and vocabulary
  - [acceptance-criteria.md](references/acceptance-criteria.md) — guidelines for writing automation-ready AC
  - [test-hooks.md](references/test-hooks.md) — controlled vocabulary for test hook naming
  - [plan-schema.ts](scripts/plan-schema.ts) — Zod schema for JSON test plans
- **scripts/** — conversion pipeline: validation, plan generation, test translation
- **assets/** — templates and fixtures
  - [playwright.config.ts](assets/templates/playwright.config.ts) — portable Playwright config template
  - **fixtures/** — shared test utilities that generated tests import from:
    - `error-handling.ts` — failure artifact attachment helper
    - `console-tracking.ts` — console message tracking helper

## Usage

Agents trigger this skill to convert AC files into Playwright tests or assess AC quality before conversion. The skill provides two modes:

1. **Assessment mode**: validates AC structure and automation readiness without generating files
2. **Conversion mode**: generates JSON plans, validates them, translates to Playwright specs

Example prompts:
- "Review these AC for automation readiness"
- "Convert the AC files in ./requirements to Playwright tests"
- "Generate tests from login-flow.feature"

When using the CLI directly:

```bash
npm ci
npm run build
npx generate-tests path/to/plan.json --tests-dir path/to/tests --summary-dir path/to/summaries
```

## Supported actions

Generated tests can use these Playwright actions:

- **click** — click an element
- **doubleClick** — double-click at x,y coordinates
- **drag** — drag from one coordinate to another
- **fill** — enter text in an input or textarea
- **goto** — navigate to a URL (plan-level only, not in test steps)
- **hover** — hover over an element
- **keyDown** / **keyUp** — press and release modifier keys (Shift, Control, a)
- **mouseClick** — click at x,y coordinates
- **mouseDown** / **mouseUp** — press and release mouse button at current position
- **mouseMove** — move cursor to x,y coordinates
- **press** — press and release a keyboard key
- **reload** — refresh the page
- **scroll** — scroll in a direction by pixel amount
- **select** — choose an option from a dropdown

## Supported assertions

- **expectNotVisible** — element should not be visible
- **expectText** — element should contain specific text
- **expectUrl** — page should be at specific URL
- **expectVisible** — element should be visible

## AC format requirements

Acceptance criteria can be written in two formats:

- **Bullet format** (`.md` files): each `- ` bullet is one test
- **Gherkin format** (`.feature` files): each Scenario is one test

Both formats must follow strict conventions for automation readiness. Key requirements:

- **Targets** must use the `area.component.intent` pattern with controlled vocabulary
- **Action verbs** must be clear and mappable to Playwright actions
- **Input values** must be quoted literals, not placeholders like "a valid email"
- **Expected outcomes** must be explicit and measurable

See [acceptance-criteria.md](references/acceptance-criteria.md) for complete guidelines and examples.

## Development

**Build:**

```bash
npm ci
npm run build
```

**Test:**

```bash
npm test
```

**Available CLI commands** (after build):

- `npx validate-plan <path>` — validate a JSON test plan against the schema
- `npx generate-tests <path>` — generate Playwright tests from a plan
- `npx append-json-summary-entry` — add an entry to the batch summary JSON
- `npx create-markdown-summary` — create a markdown summary from batch JSON

## Integration notes

When copying generated tests to your Playwright project:

1. Copy all `.spec.ts` files to your test directory
2. Copy the `fixtures/` directory alongside the spec files
3. Generated tests import from `./fixtures/*` and will fail without them

The skill provides a Playwright config template at `assets/templates/playwright.config.ts`. Update `testDir` and `baseURL` for your project.
