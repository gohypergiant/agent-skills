# Conversion Mode

**When to load this file:** Load when the user asks to convert/generate/turn AC into tests, translate AC to Playwright, or create test automation from acceptance criteria. Do NOT load for assessment-only requests (review/evaluate/check AC readiness).

## Conversion Workflow

0. **Detect intent**: User asks to generate/convert/write tests from AC files.
1. **Run Assessment mode**:
  - Run Assessment mode against all input files and report pass/fail result.
  - If Assessment mode reported any failures across all files, **STOP**. **Do not** proceed with the rest of Conversion mode.
2. **Prepare for the task**:
  - Require the user to explicitly provide output directories for plans, tests, and summaries before writing any files.
  - Read `references/acceptance-criteria.md`.
  -  Work one input file at a time. Do not parallelize so that errors in one file's workflow do not affect other files' workflows.
  -  Derive suite name, test names, startUrl, steps, targets, tags, and source metadata per the rules below.
3. **JSON test plan**:
  - Build a JSON test plan that conforms to `scripts/plan-schema.ts`.
  - Validate the test plan and report results.
  - If validation failed, **stop**. Do not write the plan. Skip the rest of these steps for the current input file and move on to the next input file.
  - If validation passed, write the plan to the user-specified output directory: `<plans-output-dir>/<suite-slug>.json`.
4. **Translate the plan to tests**:
  - Once the plan file is written, translate the plan with `scripts/translate-plan-to-tests.ts`.
  - Write the test suite file to the user-specified output directory: `<tests-output-dir>/<suite-slug>.spec.ts`.
  -  Append a summary entry to the batch JSON file in the user-specified summary directory (one batch file per run).
5. **Next steps**: 
  - Work on the next input file, if any remain.
  - After all files are processed:
    - Copy `skills/accelint-ac-to-playwright/assets/fixtures/` directory to `<tests-output-dir>/fixtures/`. This directory contains shared test utilities (`error-handling.ts` and `console-tracking.ts`) that generated tests import from.
    - Ask the user if they would like a Playwright config template. If yes, copy `skills/accelint-ac-to-playwright/assets/templates/playwright.config.ts` into the user‑specified summaries location.

## Stopping Protocol: When Assessment Fails in Conversion Mode

**When to use:** Conversion workflow requires assessment-first. If assessment reports "❌ AC are not conversion-ready", you must stop and communicate clearly why conversion cannot proceed.

**What NOT to do:**
- Don't silently stop your response
- Don't proceed to generate JSON plans or test files
- Don't attempt to "fix" the AC yourself

**Communication template:**

```
Assessment complete: these AC are not conversion-ready.

[Insert the full assessment report with enumerated issues or clarifying questions]

I cannot proceed with test plan generation until these issues are resolved.

Next steps:
- Review the issues listed above
- Update the AC to address each issue
- Once the AC are updated, I can run the conversion workflow

Would you like help understanding any of the issues, or should I re-assess after you've made updates?
```

**Why this matters:** The workflow says "STOP" when assessment fails, but LLMs interpret this as "end my response" rather than "explain to the user why I'm stopping." This template ensures users understand the blocker and know what to do next.

## Naming Transformations

**Input to output mapping**: One AC file → one suite → one plan file (`<plans-dir>/<suite-slug>.json`) → one test file
- `.md` bullet-style: each `- ` bullet = one test
- `.feature` Gherkin: each Scenario = one test; each Examples row in Scenario Outline = one test

**Output structure**: After conversion completes, the test output directory will contain:
- `<suite-slug>.spec.ts` files (one per AC file)
- `fixtures/` directory with shared utilities:
  - `fixtures/error-handling.ts` - failure artifact attachment helper
  - `fixtures/console-tracking.ts` - console message tracking helper

**Important for users**: When copying generated tests to your Playwright project, copy both the `.spec.ts` files AND the `fixtures/` directory. Tests import from these fixtures and will fail to compile without them.

| Input | Suite Name | Test Name | Output Slug |
|-------|------------|-----------|-------------|
| `.feature` | `Feature:` text → lowercase → capitalize first | Scenario text (lowercase, ~64 char limit) + ` (params)` for Scenario Outlines | suite name → lowercase, spaces to dashes |
| `.md` | filename → lowercase → dashes to spaces → capitalize first | Summarize bullet intent (present tense, lowercase, ~64 char) | suite name → lowercase, spaces to dashes |

**Scenario Outline parameters**: Use shortest left-to-right column combo that uniquely identifies each row, joined with `/`.

Example:
```
Examples:
  | username | password | message       |
  | user1    | pass1    | Welcome user1 |
  | user2    | pass2    | Welcome user2 |
```
Appends ` (user1/pass1)` and ` (user2/pass2)` respectively.

## Tags (Gherkin only)

- Feature-level tags -> suite tags.
- Scenario-level tags -> test tags.
- Do not include suite tags in test tags; drop duplicates at the test level.
- If no test tags remain, omit tags field for that test.
- Tag values include the leading '@'.

## Source metadata

- Always include a source object at suite level.
- If AC file is inside a git repo: repo = repo name (folder containing `.git`), path = repo-relative path.
- If AC file is not inside a git repo: repo = `external`, path = file basename only.
- Do not store absolute paths.

## Output Rules

### Suite-level fields

- Top-level field order: suiteName, tags (if any), source, tests.

### Test-level fields

- Start URL: always default to '/' unless the user provides an explicit starting page in a given AC per `references/acceptance-criteria.md`.
- Steps: use only schema actions (but do not use `goto`) and preserve the order in the bullet text or in the Gherkin steps.
  - **Keyboard modifier combinations**: When AC describes pressing a key combination (e.g., "press Shift+g", "press Control+Enter"), translate it into a three-step sequence:
    1. `keyDown` with the modifier key (e.g., `Shift`, `Control`, or app-specific modifier `a`)
    2. `press` with the non-modifier key (e.g., `g`, `Enter`)
    3. `keyUp` with the same modifier key
    - Valid modifiers for `keyDown`/`keyUp`: `Shift`, `Control`, `a` (app-specific)
    - The `press` action only accepts single unmodified keys and should never receive combination syntax like `Shift+g`
- Assertions: 
  - If navigation is triggered, add `expectUrl` using the Start URL mapping.
  - For visibility changes (e.g., visible/appears/shows/hides and similar wording), add `expectNotVisible` immediately before the action and `expectVisible` immediately after (or vice versa as appropriate).
  - Only add `expectText` / `expectVisible` / `expectNotVisible` when the AC explicitly names text or visibility.
  - Do not invent assertions. NEVER infer unstated information.  Required fields that MUST be explicit (not inferred):
    - target: Must include area + component + intent
    - value: Must be quoted literal for fills 
    - expected outcomes: Must include verifiable element/text

## Resources

- `scripts/plan-schema.ts` — schema and validation logic to consult when generating plans.
- `scripts/cli/validate-plan.ts` — validator script for JSON plans (run via `npx validate-plan` after build).
- `scripts/translate-plan-to-tests.ts` — converts a validated plan to a Playwright spec.
- `scripts/cli/generate-tests.ts` — CLI wrapper for reading, validating, and writing spec files.

## Validation and Retry Protocol

Use `npx validate-plan path/to/plan.json` to validate a plan against `scripts/plan-schema.ts` (after build).

**Maximum attempts**: 2 total (initial + 1 correction)

1. **Attempt 1**: Generate JSON → validate
  - Pass → proceed to write file
  - Fail → go to Attempt 2

2. **Attempt 2**: Read validation error → fix ONE specific issue → re-validate
  - Pass → proceed to write file
  - Fail → STOP, report error to user

**NEVER**:
- Make multiple changes at once (fix one thing, validate, repeat)
- Retry by rephrasing same JSON differently
- Guess at schema requirements if error is unclear

## Error Recovery

| Error Type | Diagnostic Question | Common Causes | Fix Strategy |
|------------|---------------------|---------------|--------------|
| **Schema validation fails** | What field does error message name? | Wrong field order, missing required field, extra field not in schema, incorrect field type | Check schema for exact field names and order; compare your JSON structure to schema requirements |
| **Translation script errors** | Which action/assertion caused failure? | Unsupported action type, malformed target selector, missing required field in step | Verify action is in allowed list (click/fill/select); check target has all three parts; ensure step has target and any required fields (e.g., fill needs value) |
| **Validation passes but tests fail** | Do test hooks match actual page elements? | Target selectors don't match DOM, wrong start URL, timing issues | Ask user to verify page structure matches expected targets; check if startUrl needs adjustment; consider if dynamic content needs wait conditions |
| **Multiple validation failures after fixes** | Did first fix break something else? | Making multiple speculative changes, misunderstanding schema requirements | Stop after 2 attempts; report specific schema violations to user; ask if AC has ambiguities or if schema has changed |

## NEVER Do

- **NEVER use bare string values with selectOption** — Playwright's `selectOption()` matches HTML `value` attributes by default, not visible text. AC writers specify visible option text (e.g., "Premium Plan"), so always use `{ label: "text" }` syntax: `.selectOption({ label: "Premium Plan" })`. Using bare strings (`.selectOption("Premium Plan")`) causes silent mismatches where tests pass locally but fail in production because the value attribute differs from display text.
- **NEVER use `goto` action in steps** — tests start at `startUrl`, navigation happens via clicks or fills that trigger page changes. Using goto mid-test breaks Playwright's navigation lifecycle and causes race conditions where assertions run before the page is ready, leading to flaky tests that pass locally but fail in CI.
- **NEVER use `doubleClick` for element interactions** — `doubleClick` is only for coordinate-based double-clicks (x,y positions). For double-clicking elements, use the element-based `click` action twice in sequence. Only use `doubleClick` when AC explicitly specifies coordinates.
- **NEVER use `mouseClick` for element interactions** — `mouseClick` is only for coordinate-based clicks (x,y positions). For clicking elements, always use `click` with test IDs. Only use `mouseClick` when AC explicitly specifies coordinates.
- **NEVER use `mouseMove` without a follow-up action** — `mouseMove` positions the cursor but doesn't interact with anything. It should only be used before actions like `mouseDown`, `mouseUp`, `mouseClick`, or when AC explicitly requires moving to specific coordinates before other mouse operations.
- **NEVER use `mouseDown` or `mouseUp` without `mouseMove` first** — these actions press/release buttons at the current cursor position. Always use `mouseMove` to position the cursor before `mouseDown`/`mouseUp`, otherwise the position is unpredictable.
- **NEVER invent assertions** — only add `expectText`, `expectVisible`, `expectNotVisible` when AC explicitly states expected outcomes (exception: `expectUrl` for navigation, visibility pairs for show/hide actions)
- **NEVER store absolute file paths in source metadata** — the expected convention is to use repo-relative paths for git repos, basename only for external files
- **NEVER assume targets or values** — if AC says "click the button" without identifying which button, ask for clarification rather than guessing. Generic targets like `button.generic` bypass the controlled vocabulary system and create tests that break because they match multiple elements unpredictably.
- **NEVER skip validation** — even if JSON looks correct, always run `npx validate-plan` before writing files to catch errors and reduce incorrect artifact cleanup
- **NEVER reuse existing plans or tests** — this has caused problems in the past with changes being lost, so always regenerate all steps from AC source to ensure accuracy
- **NEVER write a plan file without validating first** — validation catches structural errors; writing invalid plans creates broken artifacts requiring manual cleanup
- **NEVER process multiple steps of one file in parallel** — complete the full pipeline (AC → plan → test → summary) for each file before moving to the next to avoid partial artifacts and state confusion
- **NEVER take shortcuts** — agents have gone off the rails when trying to define their own shortcuts, so when triggered you must always run the full workflow.
