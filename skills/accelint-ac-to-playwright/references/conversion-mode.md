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
3. **Generate and write JSON test plan file**:
  - Construct the complete JSON test plan object following `scripts/plan-schema.ts` structure
  - Use the Write tool to create the file at `<plans-output-dir>/<suite-slug>.json` with the JSON content
  - Run validation: `cd /Users/tanya.fortunaGHM7GPQV67/Coding/agent-skills/skills/accelint-ac-to-playwright && npx validate-plan <plans-output-dir>/<suite-slug>.json`
  - If validation fails, read the error, fix the JSON, and use the Write tool to overwrite the file with corrected content
  - Maximum 3 validation attempts - if still failing after 2 attempts, stop and report the validation errors to the user
4. **Execute translation and write test file**:
  - Run: `cd /Users/tanya.fortunaGHM7GPQV67/Coding/agent-skills/skills/accelint-ac-to-playwright && npx translate-plan <plans-output-dir>/<suite-slug>.json`
  - Capture the generated TypeScript test code from the script output
  - Use the Write tool to create the file at `<tests-output-dir>/<suite-slug>.spec.ts` with the test code
  - Verify the file was written successfully by using the Read tool to check its contents
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

**Spawn subagent**: Use `references/generate-names.md` to derive suite name, test names, and output slug from AC file after assessment passes.

**Output structure**: After conversion completes, the test output directory will contain:
- `<suite-slug>.spec.ts` files (one per AC file)
- `fixtures/` directory with shared utilities:
  - `fixtures/error-handling.ts` - failure artifact attachment helper
  - `fixtures/console-tracking.ts` - console message tracking helper

**Important for users**: When copying generated tests to your Playwright project, copy both the `.spec.ts` files AND the `fixtures/` directory. Tests import from these fixtures and will fail to compile without them.

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
  - For visibility changes (e.g., visible/appears/shows/hides and similar wording), EVERY target mentioned with a visibility change MUST have BOTH visibility assertions:
    - For "appears/shows/visible": add `expectNotVisible` for that target immediately before the action that causes the change, then `expectVisible` for that same target immediately after
    - For "disappears/hides": add `expectVisible` for that target immediately before the action that causes the change, then `expectNotVisible` for that same target immediately after
    - When multiple targets change visibility from the same action, add ALL the "before" assertions first, then the action, then ALL the "after" assertions
    - Example: "button appears and text disappears" → `expectNotVisible button`, `expectVisible text`, `[action]`, `expectVisible button`, `expectNotVisible text`
    - The schema enforces that each target with ANY visibility assertion must have EXACTLY 2 visibility assertions (one before, one after) with exactly one action between them
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

**Maximum attempts**: 3 total

1. Generate JSON → validate
  - Pass → write file
  - Fail → spawn subagent:
    - Load `references/diagnose-schema-errors.md` and follow its prompt template
    - Apply the suggested fix → validate again
      - Pass → write file
      - Fail → spawn subagent:
        - Load `references/diagnose-schema-errors.md` and follow its prompt template
        - Apply the suggested fix → validate again
          - Pass → write file
          - Fail → STOP, report error to user

**NEVER**:
- Make multiple changes at once (always fix ONE thing at a time)
- Retry by rephrasing same JSON differently
- Guess at schema requirements if error is unclear

## Translation Error Recovery

When `generate-tests.ts` fails to translate JSON plan to Playwright test code, spawn subagent with `references/diagnose-translation-errors.md` to diagnose the error and suggest a fix.

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
