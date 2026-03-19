---
name: accelint-ac-to-playwright
description: Convert and validate acceptance criteria for Playwright test automation. Use when user asks to (1) review/evaluate/check if AC are ready for automation, (2) assess if AC can be converted as-is, (3) validate AC quality for Playwright, (4) turn AC into tests, (5) generate tests from acceptance criteria, (6) convert .md bullets or .feature Gherkin files to Playwright specs, (7) create test automation from requirements. Handles both bullet-style markdown and Gherkin syntax with JSON test plan generation and validation.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.0.0"
---

# AC To Playwright

**MANDATORY - READ ENTIRE FILE**: Before processing ANY acceptance criteria, you MUST read [`references/acceptance-criteria.md`](references/acceptance-criteria.md) (~175 lines) completely from start to finish. **NEVER set any range limits when reading this file.** It is the authoritative source for AC writing rules and mappings.

**Note on test-hooks.md**: Load `references/test-hooks.md` when converting AC → JSON plans or when running Assessment mode — it contains the controlled vocabulary for area/component/intent target naming patterns. **Do NOT load** when converting plans → tests (translation script handles this automatically).

## Intent Detection

The skill supports two modes based on user phrasing:

**Assessment mode** (triggers on):
- "review these AC"
- "evaluate these AC"
- "check if these AC are ready"
- "can these AC be converted as-is"
- "are these AC automation-ready"
- "assess these acceptance criteria"

**Full conversion mode** (triggers on):
- "convert these AC"
- "generate tests from AC"
- "turn AC into Playwright tests"
- "create test automation"

Assessment mode analyzes AC text only (no artifact generation). Full conversion mode generates plans and tests.

### Assessment Workflow
0. **Detect intent**: User asks to review/evaluate/assess/check AC readiness.
1. **Prepare for the task**:
  - Read `references/acceptance-criteria.md` and `references/test-hooks.md`.
  - Work one input file at a time.
2. **Analyze AC text** against all conversion requirements:
   - **Structure & Format**:
     - Bullet format: proper `- ` markers for each AC
     - Gherkin format: valid Feature/Scenario/Examples/Given/When/Then/tags structure
     - Step ordering: all Givens → all Whens → all Thens (no mixing within a scenario)
   - **Targets** (semantic validation):
     - Every action specifies a target
     - Target meets the area/component/intent pattern (all three parts present)
     - Area matches controlled vocabulary from `test-hooks.md` (nav, header, footer, form, drawer, card, toast, modal, table, page, area)
     - Component matches controlled vocabulary (button, link, input, dropdown, checkbox, radio, text, div, component)
     - Intent is present
   - **Actions**:
     - Verbs are recognized and mappable to Playwright actions (click, fill, select, drag)
     - No vague verbs (interact, use, hover without x/y coordinates)
     - Fill/select actions have quoted literal values (not "a valid email" or "any value")
   - **Expected Outcomes**:
     - Explicitly stated (not implied or inferred)
     - Measurable (specific text content, element, or state)
     - Visibility changes use trigger words (appears, shows, hides, visible, see)
3. **Report results**:
   - If issues found: Report "❌ AC are not conversion-ready" with detailed issue list (see output format below)
   - If no issues: Report "✓ AC are conversion-ready" with validated checklist
   - Do NOT generate any files (no JSON plans, no test files)
   - Report results for all input files - do not stop Assessment mode after a single failure to ensure all issues are surfaced to the user at once.

### Conversion Workflow
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
  - Build a JSON test plan that conforms to `references/plan-schema.ts`.
  - Validate the test plan and report results.
  - If validation failed, **stop**. Do not write the plan. Skip the rest of these steps for the current input file and move on to the next input file.
  - If validation passed, write the plan to the user-specified output directory: `<plans-output-dir>/<suite-slug>.json`.
4. **Translate the plan to tests**:
  - Once the plan file is written, translate the plan with `scripts/translate-plan-to-tests.ts`.
  - Write the test suite file to the user-specified output directory: `<tests-output-dir>/<suite-slug>.spec.ts`.
  -  Append a summary entry to the batch JSON file in the user-specified summary directory (one batch file per run).
5. **Next steps**: 
  - Work on the next input file, if any remain.
  - After all files are processed, ask the user if they would like a Playwright config template. If yes, copy `skills/accelint-ac-to-playwright/assets/templates/playwright.config.ts` into the user‑specified summaries location.

## Recognition Patterns
Before processing AC, identify these quality signals:

**Good AC** (can process directly):
| Check | Question | If NO → Action |
|-------|----------|----------------|
| **Targets** | Does every action specify area.component.intent? | Ask user to clarify which specific element |
| **Values** | Are all fill/select values quoted literals? | Ask user for exact values to use |
| **Outcomes** | Are expectations measurable (specific text/element/state)? | Ask user what exactly to verify |

**Bad patterns** (ask the user questions):
- "interact with" (and other similar language) → too vague, agent can't map to Playwright action
- Dropdown: "select the first option" → fails, needs exact text
- Always quote exact literals: `'test@example.com'` not "a valid email"

The above table directs you to ask for clarifications because guessing creates tests that fail unpredictably.

## Naming Transformations

**Input to output mapping**: One AC file → one suite → one plan file (`<plans-dir>/<suite-slug>.json`) → one test file
- `.md` bullet-style: each `- ` bullet = one test
- `.feature` Gherkin: each Scenario = one test; each Examples row in Scenario Outline = one test

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
Use `npx validate-plan path/to/plan.json` to validate a plan against `references/plan-schema.ts` (after build).

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
| **Target naming invalid** | Does target match `area.component.intent`? | Wrong pattern structure, invalid keywords from controlled lists, missing dots | Review `test-hooks.md` for controlled vocabulary (area: nav/header/footer/etc, component: button/link/input/etc); use fallback keywords (last in each list) if AC term doesn't match |
| **Translation script errors** | Which action/assertion caused failure? | Unsupported action type, malformed target selector, missing required field in step | Verify action is in allowed list (click/fill/select); check target has all three parts; ensure step has target and any required fields (e.g., fill needs value) |
| **Validation passes but tests fail** | Do test hooks match actual page elements? | Target selectors don't match DOM, wrong start URL, timing issues | Ask user to verify page structure matches expected targets; check if startUrl needs adjustment; consider if dynamic content needs wait conditions |
| **Multiple validation failures after fixes** | Did first fix break something else? | Making multiple speculative changes, misunderstanding schema requirements | Stop after 2 attempts; report specific schema violations to user; ask if AC has ambiguities or if schema has changed |

## NEVER Do

- **NEVER generate artifacts in assessment mode** — when the user asks to review/evaluate/assess AC, analyze the AC text only and provide the formatted report. Do not generate JSON plans or test files. Do not assume they want full conversion.
- **NEVER skip controlled vocabulary checks in assessment** — verify that area and component keywords in targets match the lists in `test-hooks.md`. 
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
- **NEVER take shortcuts.** - agents have gone off the rails when trying to define their own shortcuts, so when triggered you must always run the full workflow.

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