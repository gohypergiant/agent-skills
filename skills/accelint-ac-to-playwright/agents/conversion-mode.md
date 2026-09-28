# Conversion Mode

## Conversion Workflow

You MUST execute this workflow, even if you're in plan mode. You are not allowed to write a plan file, even if you're in plan mode.

1. **Run Assessment mode**:
  - Load `agents/assessment-mode.md` and execute its workflow.
  - If Assessment mode reported any failures across all files, **STOP**. **Do not** proceed with the rest of Conversion mode.
2. **Prepare for the task**:
  - Require the user to explicitly provide output directories for plans, tests, and summaries before writing any files.
  - Read `references/acceptance-criteria.md`.
  - Read `references/test-hooks.md` (contains controlled vocabulary for area.component.intent target pattern).
  - Work one input file at a time. Do not parallelize so that errors in one file's workflow do not affect other files' workflows.
  - Generate naming: spawn the subagent described in the Naming Transformations section to get suite name, test names, and output slug. The output slug becomes `<suite-slug>` used in filenames throughout steps 3-4.
  - Derive startUrl, steps, targets, tags, and source metadata per the rules below.
3. **Generate and write JSON test plan file**:
  - Find the globally installed skill directory for `accelint-ac-to-playwright`
  - Ensure dependencies are installed and scripts are built: run `npm install && npm run build` in the skill directory
  - Read `scripts/plan-schema.ts` to understand the complete schema structure (field names, types, and required properties)
  - Construct the complete JSON test plan object following the schema structure from `scripts/plan-schema.ts`
  - Use up to 3 validation attempts. Each attempt has these steps:
    1. Run the in-memory schema preflight from the skill directory. Do not create a plan file for this check:

       ```bash
       node - <<'NODE'
       const { testSuiteSchema } = require("./dist/scripts/plan-schema.js");
       const plan = <paste the complete JSON plan object from the preceding bullet>;
       const result = testSuiteSchema.safeParse(plan);

       if (!result.success) {
         console.error(JSON.stringify(result.error.format(), null, 2));
         process.exit(1);
       }
       NODE
       ```

    2. If the preflight fails, spawn the Schema Diagnostic Prompt Template below, apply its one suggested fix, and start the next validation attempt. Do not write `<plans-output-dir>/<suite-slug>.json` unless the preflight passes.
    3. If the preflight passes, use the Write tool to create `<plans-output-dir>/<suite-slug>.json` with the JSON content.
    4. Run persisted-output verification from the skill directory: `npx validate-plan <plans-output-dir>/<suite-slug>.json`.
    5. If persisted-output verification fails, spawn the Schema Diagnostic Prompt Template below, apply its one suggested fix, and start the next validation attempt at the in-memory preflight.
  - If an attempt still fails after 2 fix attempts (3 validation attempts total), stop and report the validation errors to the user.
4. **Execute translation and write test file**:
  - From the skill directory, run: `npx generate-tests <plans-output-dir>/<suite-slug>.json --tests-dir <tests-output-dir> --summary-dir <summaries-output-dir>`
  - If translation fails because a source-derived `suiteName` or test name contains no letter or number:
    - Report the translation error to the user and STOP.
    - Do not change the source-derived name or retry translation.
  - For any other translation failure:
    - Spawn subagent using the Translation Diagnostic Prompt Template below (mandatory regardless of how obvious the error seems)
    - Apply the suggested fix and retry translation
    - If translation still fails, stop and report the error to the user
  - If translation succeeds: verify the file was written successfully by using the Read tool to check `<tests-output-dir>/<suite-slug>.spec.ts`
5. **Next steps**: 
  - Work on the next input file, if any remain.
  - After all files are processed:
    - Copy `skills/accelint-ac-to-playwright/assets/fixtures/` directory to `<tests-output-dir>/fixtures/`. This directory contains shared test utilities (`error-handling.ts` and `console-tracking.ts`) that generated tests import from.
    - Run the Playwright-config decision contract:
      - `decision_id`: `playwright_config_template`
      - Accepted values: `yes` copies `skills/accelint-ac-to-playwright/assets/templates/playwright.config.ts` into the user‑specified summaries location; `no` does not copy the template.
      - Ask: "Would you like a Playwright config template? Reply exactly `yes` or `no`."
      - Until one accepted value is received for `playwright_config_template`, copying the template is blocked. A valid `no` completes this optional branch without a copy.
      - Treat invalid, ambiguous, declined, cancelled, dismissed, timed-out, silent, partial, or transport-failed input as unresolved. Ask again when interaction is available; otherwise report `unresolved_noninteractive` and do not copy the template.
      - On resumption, present the same `decision_id` and accepted values. Do not infer a selection from earlier conversation.

## Stopping Protocol: When Assessment Fails in Conversion Mode

**When to use:** Conversion workflow requires assessment-first. If assessment reports "❌ AC are not conversion-ready", you MUST stop plan and test generation. Assessment mode owns the user-facing failure response and any clarification or reassessment route.

**What NOT to do:**
- Don't silently stop the assessment response
- Don't proceed to generate JSON plans or test files
- Don't append a conversion-specific question or template after the assessment output
- Don't independently fix the AC. If assessment mode receives a valid `agent_updates` selection, follow that assessment-mode route; conversion remains stopped until a reassessment reports that the AC are conversion-ready.

**Communication rule:**

Use the assessment-mode output as the complete user-facing response. Do not add preambles, summaries, explanations, or a separate conversion next-step question before or after it.

**Why this matters:** The workflow says "STOP" when assessment fails, but LLMs can interpret this as ending the response without explaining the blocker. Assessment mode supplies the required explanation, decision contract, and any permitted remediation route without bypassing its validated choices.

## Naming Transformations

**Input to output mapping**: One AC file → one suite → one plan file (`<plans-dir>/<suite-slug>.json`) → one test file
- `.md` bullet-style: each `- ` bullet = one test
- `.feature` Gherkin: each Scenario = one test; each Examples row in Scenario Outline = one test

**Spawn subagent** with this prompt: "Load agents/generate-names.md. Generate suite name, test names, and output slug from [AC file path] following naming transformation rules."

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
  - For visibility changes (words: visible, appears, shows, see, seen, hides, disappears, hidden), EVERY target mentioned with a visibility change MUST have BOTH visibility assertions:
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

## Diagnostic Prompt Templates

### Schema Diagnostic Prompt Template

When plan validation fails, spawn subagent with:
```
Load agents/diagnose-schema-errors.md.

Diagnose this validation error and suggest ONE fix.

JSON plan:
[full plan content]

Validation error message:
[full error output from the failed in-memory preflight or `npx validate-plan`]
```

### Translation Diagnostic Prompt Template

When translation fails, spawn subagent with:
```
Load agents/diagnose-translation-errors.md.

Diagnose this translation error and suggest ONE fix.

Error message:
[full error output from generate-tests]

JSON plan (relevant section):
[relevant JSON excerpt showing the problematic step/field]
```

## NEVER Do

- **NEVER read `acceptance-criteria.md` and `test-hooks.md` with range limits** — always read them completely from start to finish.
- **NEVER generate targets without loading test-hooks.md first**
  - **Why:** test-hooks.md defines the controlled vocabulary for the area.component.intent pattern and valid area/component keywords. Skipping it causes reversed target patterns (intent.component.area instead of area.component.intent) and invalid keyword usage that fails validation.
- **NEVER use bare string values with selectOption**
  - **Why:** Playwright's `selectOption()` matches HTML `value` attributes by default, not visible text. AC writers specify visible option text (e.g., "Premium Plan"), so always use `{ label: "text" }` syntax: `.selectOption({ label: "Premium Plan" })`. Using bare strings (`.selectOption("Premium Plan")`) causes silent mismatches where tests pass locally but fail in production because the value attribute differs from display text.
- **NEVER use `goto` action in steps**
  - **Why:** Tests start at `startUrl`, navigation happens via clicks or fills that trigger page changes. Using goto mid-test breaks Playwright's navigation lifecycle and causes race conditions where assertions run before the page is ready, leading to flaky tests that pass locally but fail in CI.
- **NEVER use `doubleClick` for element interactions**
  - **Why:** `doubleClick` is only for coordinate-based double-clicks (x,y positions). For double-clicking elements, use the element-based `click` action twice in sequence. Only use `doubleClick` when AC explicitly specifies coordinates.
- **NEVER use `mouseClick` for element interactions**
  - **Why:** `mouseClick` is only for coordinate-based clicks (x,y positions). For clicking elements, always use `click` with test IDs. Only use `mouseClick` when AC explicitly specifies coordinates.
- **NEVER use `mouseMove` without a follow-up action**
  - **Why:** `mouseMove` positions the cursor but doesn't interact with anything. It should only be used before actions like `mouseDown`, `mouseUp`, `mouseClick`, or when AC explicitly requires moving to specific coordinates before other mouse operations.
- **NEVER use `mouseDown` or `mouseUp` without `mouseMove` first**
  - **Why:** These actions press/release buttons at the current cursor position. Always use `mouseMove` to position the cursor before `mouseDown`/`mouseUp`, otherwise the position is unpredictable.
- **NEVER invent assertions**
  - **Why:** Only add `expectText`, `expectVisible`, `expectNotVisible` when AC explicitly states expected outcomes (exception: `expectUrl` for navigation, visibility pairs for show/hide actions).
- **NEVER store absolute file paths in source metadata** — the expected convention is to use repo-relative paths for git repos, basename only for external files
- **NEVER assume targets or values**
  - **Why:** If AC says "click the button" without identifying which button, ask for clarification rather than guessing. Generic targets like `button.generic` bypass the controlled vocabulary system and create tests that break because they match multiple elements unpredictably.
- **NEVER skip either validation step**
  - **Why:** The in-memory preflight prevents writing an invalid final plan, and `npx validate-plan` verifies the persisted output.
- **NEVER reuse existing plans or tests**
  - **Why:** This has caused problems in the past with changes being lost, so always regenerate all steps from AC source to ensure accuracy.
- **NEVER write a final plan file before it passes the in-memory schema preflight**
  - **Why:** Preflight validation catches structural errors before the final output plan is created. Do not create a temporary plan file for the preflight.
- **NEVER process multiple steps of one file in parallel**
  - **Why:** Complete the full pipeline (AC → plan → test → summary) for each file before moving to the next to avoid partial artifacts and state confusion.
- **NEVER take shortcuts**
  - **Why:** Agents have gone off the rails when trying to define their own shortcuts, so when triggered you MUST always run the full workflow.
