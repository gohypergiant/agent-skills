---
name: accelint-ac-to-playwright
description: Convert acceptance criteria or Gherkin requirements into Playwright-ready plans and specs, or assess whether they are automation-ready first. Use when the user wants to review AC readiness, validate whether requirements can be automated as written, convert markdown bullets or .feature files into Playwright tests, generate automation from acceptance criteria, or check whether scenarios map cleanly to selectors, actions, and assertions. Prefer this skill for requirement-to-Playwright workflows, not for generic Playwright coding, debugging, or framework setup.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.1.11"
---

# AC To Playwright

REQUIRED: Before you process any acceptance criteria, read [`references/acceptance-criteria.md`](references/acceptance-criteria.md) completely from start to finish. NEVER set range limits when reading this file. It is the authoritative source for AC writing rules and mappings.

When to read `references/acceptance-criteria.md`:
- Assessment mode: read it once before you analyze any files.
- Conversion mode: read it once before you generate the first plan in the batch. Do not re-read it for each later file unless the task context changes.

Load `references/test-hooks.md` in both Assessment mode and Conversion mode. It contains the controlled vocabulary for validating area/component/intent target naming patterns. Do NOT load it when translating plans → tests because the translation script handles vocabulary automatically.

## Intent Detection

Choose the mode from the user's phrasing.

Assessment mode triggers on review/evaluate/assess/check/validate/ready phrasing, including similar wording:
- "review these AC"
- "evaluate these AC"
- "check if these AC are ready"
- "can these AC be converted as-is"
- "are these AC automation-ready"
- "assess these acceptance criteria"
- "validate AC quality"
- "audit these requirements"

Full conversion mode triggers on convert/generate/create/write/build phrasing, including similar wording:
- "convert these AC"
- "generate tests from AC"
- "turn AC into Playwright tests"
- "create test automation"
- "write Playwright specs from requirements"
- "build test suite from AC"
- "make tests from these acceptance criteria"

When in doubt:
- If the user gives output file or directory locations for plans, tests, or summaries, choose Full conversion mode.
- If the user only asks whether the AC are ready, or provides AC without output locations, choose Assessment mode first.

Assessment mode analyzes AC text only. It does not generate artifacts. Full conversion mode generates plans and tests.

### Assessment Workflow
0. Detect intent: the user asks to review, evaluate, assess, check, or validate AC readiness.
1. Prepare for the task:
   - Read `references/acceptance-criteria.md` and `references/test-hooks.md`.
   - Process input files serially, one file at a time.
2. Analyze the AC text against all conversion requirements:
   - Structure and format:
     - Bullet format: proper `- ` markers for each AC.
     - Gherkin format: valid Feature/Scenario/Examples/Given/When/Then/tags structure.
     - Step ordering: all Givens → all Whens → all Thens, with no mixing inside a scenario.
   - Targets, as semantic validation:
     - Every action specifies a target.
     - The target meets the area/component/intent pattern with all three parts present.
     - The area matches the controlled vocabulary from `test-hooks.md`: nav, header, footer, form, drawer, card, toast, modal, table, page, area.
     - The component matches the controlled vocabulary: button, link, input, dropdown, checkbox, radio, text, div, component.
     - The intent is present.
   - Actions:
     - Verbs are recognized and map to Playwright actions such as click, fill, select, and drag.
     - No vague verbs, such as interact, use, or hover without x/y coordinates.
     - Fill and select actions use quoted literal values, not phrases like "a valid email" or "any value".
   - Expected outcomes:
     - They are explicit, not implied or inferred.
     - They are measurable, with specific text content, an element, or a state.
     - Visibility changes use trigger words such as appears, shows, hides, visible, or see.
3. Report results:
   - If issues are found, report `❌ AC are not conversion-ready` with the detailed issue list shown below.
   - If no issues are found, report `✓ AC are conversion-ready` with the validated checklist shown below.
   - Do NOT generate any files, including JSON plans and test files.
   - Finish assessment for every input file before you return results so the user sees all issues in one pass.

## Assessment mode output format

When validation fails, report issues in this structure:

```
❌ AC are not conversion-ready. Issues found:

File: [filename]
1. [Line/Scenario reference]: [Specific issue]
   - Problem: [What's wrong]
   - Example: [Quote from AC]
   - Fix: [What needs to change]

File: [filename]
2. [Next issue...]
```

Example output:
```
❌ AC are not conversion-ready. Issues found:

File: form-actions.feature
1. Scenario "User submits form": Unknown action verb
   - Problem: "hovers" is not a recognized Playwright action
   - Example: "the user hovers over the tooltip"
   - Fix: Use a supported action (click, fill, select) or clarify the intent

File: login-flow.feature
2. Scenario "User logs in": Missing target intent
   - Problem: Test hook selector incomplete (button.form instead of button.form.submit)
   - Example: "clicks the button on the form"
   - Fix: Specify intent: "clicks the Submit button on the form"
```

When assessment passes:
```
✓ AC are conversion-ready

Validated ([X] AC in [Y] files):
- Structure: Proper format (bullets or Gherkin) with correct step ordering
- Targets: All meet the area/component/intent pattern with controlled vocabulary
- Actions: All verbs recognized (click/fill/select) with input values where required
- Expected outcomes: All explicitly stated and measurable
- Vocabulary: All areas/components match test-hooks.md keywords

These AC can be converted without modification.

Files analyzed:
[filename 1]
[filename 2]
...
```

### Conversion Workflow
0. Detect intent: the user asks to generate, convert, write, build, or create tests from AC files.
1. Run Assessment mode against all files:
   - Process all input files through Assessment mode first, in serial order.
   - Collect pass/fail results for each file and report them together.
   - If any file fails Assessment mode, STOP THE ENTIRE CONVERSION WORKFLOW. Do not continue to plan generation for any file.
   - Continue only if every input file passes assessment.
2. Prepare for the task:
   - Require the user to explicitly provide output directories for plans, tests, and summaries before you write any files.
   - Read `references/acceptance-criteria.md`.
   - Work one input file at a time in serial order. Do not parallelize file processing.
   - For each file, finish the full pipeline, plan → validate → translate → summarize, before you move to the next file.
   - Derive suite name, test names, startUrl, steps, targets, tags, and source metadata from the rules below.
3. Build the JSON test plan:
   - Build a JSON test plan that conforms to `references/plan-schema.ts`.
   - Validate it with this retry protocol. Maximum 2 attempts total for the current file:
     - Attempt 1: run validation.
       - If it passes, proceed.
       - If it fails, read the error, fix ONE specific issue, and re-validate.
     - Attempt 2: re-run validation after the single targeted fix.
       - If it passes, proceed.
       - If it fails, stop processing the current file, report the validation error, and move to the next file.
   - Never make multiple speculative fixes at once.
   - Never retry by only rephrasing the same invalid JSON.
   - Never guess at schema requirements when the validation error is unclear.
   - If validation passes, write the plan to the user-specified output directory: `<plans-output-dir>/<suite-slug>.json`.
4. Translate the plan to tests:
   - After the plan file is written, translate the plan with `scripts/translate-plan-to-tests.ts`.
   - Write the test suite file to the user-specified output directory: `<tests-output-dir>/<suite-slug>.spec.ts`.
   - Append a summary entry to the batch JSON file in the user-specified summary directory. Use one batch file per run.
5. Finish the batch:
   - Work on the next input file, if any remain.
   - After all files are processed:
     - Copy `skills/accelint-ac-to-playwright/assets/fixtures/` to `<tests-output-dir>/fixtures/`. This directory contains shared test utilities, `error-handling.ts` and `console-tracking.ts`, that generated tests import from.
     - Ask the user if they want a Playwright config template. If yes, copy `skills/accelint-ac-to-playwright/assets/templates/playwright.config.ts` into the user-specified summaries location.

## Recognition Patterns
Before you process AC, identify these quality signals.

Good AC, which you can process directly:
| Check | Question | If NO → Action |
|-------|----------|----------------|
| **Targets** | Does every action specify area.component.intent? | Ask the user to clarify which specific element |
| **Values** | Are all fill/select values quoted literals? | Ask the user for the exact values to use |
| **Outcomes** | Are expectations measurable, with specific text, an element, or a state? | Ask the user what exactly to verify |

Bad patterns, which require clarification:
- "interact with", and similar language, is too vague for the agent to map to a Playwright action.
- Dropdown: "select the first option" fails because it needs exact text.
- Always quote exact literals: `'test@example.com'`, not "a valid email".

Ask for clarification in these cases because guessing creates tests that fail unpredictably.

## Naming Transformations

Input to output mapping: one AC file → one suite → one plan file (`<plans-dir>/<suite-slug>.json`) → one test file.
- `.md` bullet-style: each `- ` bullet is one test.
- `.feature` Gherkin: each Scenario is one test. Each Examples row in a Scenario Outline is one test.

Output structure: after conversion completes, the test output directory will contain:
- `<suite-slug>.spec.ts` files, one per AC file.
- `fixtures/` with shared utilities:
  - `fixtures/error-handling.ts` — failure artifact attachment helper.
  - `fixtures/console-tracking.ts` — console message tracking helper.

Important for users: when you copy generated tests to a Playwright project, copy both the `.spec.ts` files and the `fixtures/` directory. Tests import from these fixtures and will fail to compile without them.

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

### Keyboard modifier combinations
When AC describes pressing a key combination, for example `Shift+g` or `Control+Enter`, translate it into this exact three-step sequence:
1. `keyDown` with the modifier key.
2. `press` with the non-modifier key.
3. `keyUp` with the same modifier key.

Valid modifiers for `keyDown` and `keyUp`: `Shift`, `Control`, `a`.

The `press` action accepts only a single unmodified key. Never pass combination syntax such as `Shift+g` to `press`.

### Suite-level fields
- Top-level field order: suiteName, tags (if any), source, tests.

### Test-level fields
- Start URL: always default to '/' unless the user provides an explicit starting page in a given AC per `references/acceptance-criteria.md`.
- Steps: use only schema actions (but do not use `goto`) and preserve the order in the bullet text or in the Gherkin steps.
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

## Error Recovery

| Error Type | Diagnostic Question | Common Causes | Fix Strategy |
|------------|---------------------|---------------|--------------|
| **Schema validation fails** | What field does the error message name? | Wrong field order, missing required field, extra field not in schema, incorrect field type | Check the schema for exact field names and order. Compare your JSON structure to the schema requirements. |
| **Target naming invalid** | Does the target match `area.component.intent`? | Wrong pattern structure, invalid keywords from controlled lists, missing dots | Review `test-hooks.md` for the controlled vocabulary, area: nav/header/footer/etc and component: button/link/input/etc. Use the fallback keywords, the last item in each list, if the AC term does not match. |
| **Tag validation fails** | Does the error mention "Tags must start with '@'"? | Tags missing @ prefix in generated JSON | Review the AC source. Gherkin tags should include @, for example `@smoke` not `smoke`. If the AC has @ but the JSON does not, check the JSON generation logic. |
| **Translation script errors** | Which action or assertion caused failure? | Unsupported action type, malformed target selector, missing required field in step | Verify that the action is in the allowed list, click/fill/select. Check that the target has all three parts. Ensure the step has the required fields, for example a fill step needs a value. |
| **Validation passes but tests fail** | Do the test hooks match the actual page elements? | Target selectors do not match the DOM, wrong start URL, timing issues | Ask the user to verify that the page structure matches the expected targets. Check whether startUrl needs adjustment. Consider whether dynamic content needs wait conditions. |
| **Multiple validation failures after fixes** | Did the first fix break something else? | Making multiple speculative changes, misunderstanding schema requirements | Stop after 2 attempts. Report the specific schema violations to the user. Ask whether the AC has ambiguities or whether the schema has changed. |

## NEVER Do

- NEVER use bare string values with selectOption — Playwright's `selectOption()` matches HTML `value` attributes by default, not visible text. AC writers specify visible option text, for example "Premium Plan", so always use `{ label: "text" }` syntax: `.selectOption({ label: "Premium Plan" })`. Using bare strings, `.selectOption("Premium Plan")`, causes silent mismatches where tests pass locally but fail in production because the value attribute differs from the display text.
- NEVER generate artifacts in assessment mode — when the user asks to review, evaluate, or assess AC, analyze the AC text only and provide the formatted report. Do not generate JSON plans or test files. Do not assume they want full conversion.
- NEVER skip controlled vocabulary checks in assessment — verify that area and component keywords in targets match the lists in `test-hooks.md`.
- NEVER use `goto` action in steps — tests start at `startUrl`, and navigation happens through clicks or fills that trigger page changes. Using `goto` mid-test bypasses Playwright's navigation lifecycle because the framework expects URL changes to come from user actions, not programmatic jumps. This creates race conditions where assertions run before the destination page is ready, the DOM has not finished mounting, or listeners have not attached yet. The result is flaky tests that often pass locally but fail in CI. Adding waits does not fix the root problem because the issue is lifecycle correctness, not load duration.
- NEVER use `doubleClick` for element interactions — `doubleClick` is only for coordinate-based double-clicks at x,y positions. For double-clicking elements, use the element-based `click` action twice in sequence. Only use `doubleClick` when the AC explicitly specifies coordinates.
- NEVER use `mouseClick` for element interactions — `mouseClick` is only for coordinate-based clicks at x,y positions. For clicking elements, always use `click` with test IDs. Only use `mouseClick` when the AC explicitly specifies coordinates.
- NEVER use `mouseMove` without a follow-up action — `mouseMove` positions the cursor but does not interact with anything. Use it only before actions such as `mouseDown`, `mouseUp`, `mouseClick`, or when the AC explicitly requires moving to specific coordinates before other mouse operations.
- NEVER use `mouseDown` or `mouseUp` without `mouseMove` first — these actions press or release buttons at the current cursor position. Always use `mouseMove` to position the cursor before `mouseDown` or `mouseUp`, or the position is unpredictable.
- NEVER invent assertions — only add `expectText`, `expectVisible`, or `expectNotVisible` when the AC explicitly states expected outcomes, except `expectUrl` for navigation and visibility pairs for show or hide actions.
- NEVER store absolute file paths in source metadata — use repo-relative paths for git repos and the basename only for external files.
- NEVER assume targets or values — if the AC says "click the button" without identifying which button, ask for clarification instead of guessing. Generic targets such as `button.generic` bypass the controlled vocabulary system and create tests that break because they match multiple elements unpredictably.
- NEVER skip validation — even if the JSON looks correct, always run `npx validate-plan` before you write files to catch errors and reduce incorrect artifact cleanup.
- NEVER reuse existing plans or tests — this has caused problems in the past with changes being lost, so always regenerate all steps from the AC source to ensure accuracy.
- NEVER write a plan file without validating first — validation catches structural errors. Writing invalid plans creates broken artifacts that need manual cleanup.
- NEVER process multiple steps of one file in parallel — complete the full pipeline, AC → plan → test → summary, for each file before you move to the next file to avoid partial artifacts and state confusion.
- NEVER take shortcuts — agents have gone off the rails when they tried to define their own shortcuts, so when this skill is triggered you must always run the full workflow.
