---
name: ac-to-playwright
description: Convert acceptance criteria files into JSON test plans that conform to references/plan-schema.ts, and then convert those JSON test plans into Playwright spec files. Use when asked to turn AC files into tests. Always follow references/ACCEPTANCE_CRITERIA.md for writing rules and mapping details. Follow references/TEST_HOOKS.md for target naming.
---

# AC To Playwright

## Overview
Convert acceptance criteria into JSON test plans that match the schema and project conventions. Always consult `references/ACCEPTANCE_CRITERIA.md`; it is the authoritative source for AC writing rules and mappings. 

Do not take shortcuts. Do not assume intermediate files exist. Do not reuse existing plans or tests; always regenerate. When triggered, always run the full workflow.

## Workflow
1. Read `references/ACCEPTANCE_CRITERIA.md`.
1. Work one input file at a time.
1. Derive suite name, test names, startUrl, steps, targets, tags, and source metadata per the rules below.
1. Build a JSON test plan that conforms to `references/plan-schema.ts`.
1. Validate the test plan and report results.
1. Require the user to explicitly provide output directories for plans, tests, and summaries before writing any files.
1. If validation passed, write the plan to the user-specified output directory: `<plans-output-dir>/<suite-slug>.json`.
1. Once the file is written, translate the plan with `scripts/translate-plan-to-tests.ts`.
1. Write the test suite file to the user-specified output directory: `<tests-output-dir>/<suite-slug>.spec.ts`.
1. Append a summary entry to the batch JSON file in the user-specified summary directory (one batch file per run).
1. Work on the next input file, if any remain.
1. After all files are processed, ask the user if they would like a Playwright config template. If yes, copy `skills/ac-to-playwright/assets/templates/playwright.config.ts` into the user‑specified summaries location.


## Inputs
- One AC file becomes one suite within one resulting plan file.
- (Bullet-style AC) If the input is a `*.md` file, then each `- ` bullet in the file is one test. 
- (Gherkin-style AC) If the input is a `*.feature` file, then each Scenario is one test, and each non-header row of an Examples section used within the Scenario Outline immediately preceding it is one test.

## Suite naming
- `.feature`: `Feature: ` text, lowercase then capitalize first character.
- `.md`: filename, lowercase, dashes to spaces, capitalize first character.

Examples: 
- `sAmplE-APP.md` -> `Sample app`.
- `Feature: Site navigation` -> `Site navigation`

## Output file 
- Output location: `<plans-output-dir>/<suite-name-slug>.json` (must be explicitly provided by the user)
- Slug: test suite's name, lowercase, spaces to dashes.

Examples (plans-output-dir = `plans/generated`):
- `Sample app` -> `plans/generated/sample-app.json`
- `Site navigation` -> `plans/generated/site-navigation.json`

## Test naming
`.feature` files: 
- Start from `Scenario:`/`Scenario Outline:` text; shorten only if too long (~64 char soft limit); lowercase.
- For `Scenario Outline:` tests, append ` (parameters)` where `parameters` is the shortest left‑to‑right combination of Example columns that uniquely identifies each row, joined with `/`.

  Example:
  ```
  Examples:
    | username | password | message       |
    | user1    | pass1    | Welcome user1 |
    | user2    | pass2    | Welcome user2 |
  ```
  Appends ` (user1/pass1)` and ` (user2/pass2)` respectively.

`.md` files: 
- Summarize intent in present indicative; lowercase; ~64 char soft limit. Do not quote the full bullet unless it is already short and in present indicative.

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
- Start URL: default '/', otherwise infer from explicit starting page per `references/ACCEPTANCE_CRITERIA.md`.
  - Examples:
    - "settings page" -> `/settings`
    - "new order page" -> `/new-order`
    - "home page" -> `/`
- Steps: use only schema actions (but do not use `goto`) and preserve the order implied by bullet text or explicitly used in the Gherkin steps.
- Assertions: 
  - If navigation is stated or implied, add `expectUrl` using the Start URL mapping.
  - For visibility changes (e.g., visible/appears/shows/hides and similar wording), add `expectNotVisible` immediately before the action and `expectVisible` immediately after (or vice versa as appropriate).
  - Only add `expectText` / `expectVisible` / `expectNotVisible` when the AC explicitly names text or visibility.
  - Do not invent assertions. If a result is implied but not specified (and it’s not navigation or visibility‑change), ask a question.

## Resources
- `references/plan-schema.ts` — schema and validation logic to consult when generating plans.
- `scripts/validate-plan.ts` — validator script for JSON plans (run via `npx validate-plan` after build).
- `scripts/translate-plan-to-tests.ts` — converts a validated plan to a Playwright spec.
- `scripts/generate-tests.ts` — CLI wrapper for reading, validating, and writing spec files.

## Validation
- Use `npx validate-plan path/to/plan.json` to validate a plan against `references/plan-schema.ts` (after build).
- If validation fails, make one correction pass and re-validate.
- If it still fails, do not write a file; report the error.

## Ambiguity Policy
If any required field is unclear (target, value, startUrl, expected text, tag handling, source, etc.), ask questions and do not generate JSON until clarified.

## Example
Input (`path/to/sample-plan.md`):
- From the home page, a user can navigate to the Settings page by clicking the Settings link in the header and should see the page heading text in the header say "Settings".

Output (`output/to/sample-plan.json`):
{
  "suiteName": "Sample plan",
  "source": {
    "repo": "your-repo",
    "path": "path/to/sample-plan.md"
  },
  "tests": [
    {
      "name": "navigates to settings from home",
      "startUrl": "/",
      "steps": [
        { "action": "click", "target": "nav.link.settings" },
        { "action": "expectUrl", "value": "/settings" },
        { "action": "expectText", "target": "header.text.page-heading", "value": "Settings" }
      ]
    }
  ]
}
