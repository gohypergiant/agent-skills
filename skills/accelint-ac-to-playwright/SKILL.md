---
name: accelint-ac-to-playwright
description: Convert acceptance criteria to Playwright test specs. Use when user asks to: (1) turn AC into tests, (2) generate tests from acceptance criteria, (3) convert .md bullets or .feature Gherkin files to Playwright specs, (4) create test automation from requirements. Handles both bullet-style markdown and Gherkin syntax with JSON test plan generation and validation.
license: Apache-2.0
metadata:
  author: accelint
  version: "0.5"
---

# AC To Playwright

**MANDATORY - READ ENTIRE FILE**: Before processing ANY acceptance criteria, you MUST read [`references/acceptance-criteria.md`](references/acceptance-criteria.md) (~175 lines) completely from start to finish. **NEVER set any range limits when reading this file.** It is the authoritative source for AC writing rules and mappings.

**Note on test-hooks.md**: Load `references/test-hooks.md` when converting AC → JSON plans — it contains the controlled vocabulary for area/component/intent target naming patterns. **Do NOT load** when converting plans → tests (translation script handles this automatically).

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

## Workflow
1. Read `references/acceptance-criteria.md`.
2. Work one input file at a time. Do not parallelize so that errors in one file's workflow do not affect other files' workflows.
3. Derive suite name, test names, startUrl, steps, targets, tags, and source metadata per the rules below.
4. Build a JSON test plan that conforms to `references/plan-schema.ts`.
5. Validate the test plan and report results.
6. Require the user to explicitly provide output directories for plans, tests, and summaries before writing any files.
7. If validation passed, write the plan to the user-specified output directory: `<plans-output-dir>/<suite-slug>.json`.
8. Once the file is written, translate the plan with `scripts/translate-plan-to-tests.ts`.
9. Write the test suite file to the user-specified output directory: `<tests-output-dir>/<suite-slug>.spec.ts`.
10. Append a summary entry to the batch JSON file in the user-specified summary directory (one batch file per run).
11. Work on the next input file, if any remain.
12. After all files are processed, ask the user if they would like a Playwright config template. If yes, copy `skills/accelint-ac-to-playwright/assets/templates/playwright.config.ts` into the user‑specified summaries location.


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

- **NEVER use `goto` action in steps** — tests start at `startUrl`, navigation happens via clicks or fills that trigger page changes. Using goto mid-test breaks Playwright's navigation lifecycle and causes race conditions where assertions run before the page is ready, leading to flaky tests that pass locally but fail in CI.
- **NEVER invent assertions** — only add `expectText`, `expectVisible`, `expectNotVisible` when AC explicitly states expected outcomes (exception: `expectUrl` for navigation, visibility pairs for show/hide actions)
- **NEVER store absolute file paths in source metadata** — the expected convention is to use repo-relative paths for git repos, basename only for external files
- **NEVER assume targets or values** — if AC says "click the button" without identifying which button, ask for clarification rather than guessing. Generic targets like `button.generic` bypass the controlled vocabulary system and create tests that break because they match multiple elements unpredictably.
- **NEVER skip validation** — even if JSON looks correct, always run `npx validate-plan` before writing files to catch errors and reduce incorrect artifact cleanup
- **NEVER reuse existing plans or tests** — this has caused problems in the past with changes being lost, so always regenerate all steps from AC source to ensure accuracy
- **NEVER write a plan file without validating first** — validation catches structural errors; writing invalid plans creates broken artifacts requiring manual cleanup
- **NEVER process multiple steps of one file in parallel** — complete the full pipeline (AC → plan → test → summary) for each file before moving to the next to avoid partial artifacts and state confusion
- **NEVER take shortcuts.** - agents have gone off the rails when trying to define their own shortcuts, so when triggered you must always run the full workflow.
