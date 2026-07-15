---
name: accelint-ac-to-playwright
description: Convert and validate acceptance criteria for Playwright test automation. Use when user asks to (1) review/evaluate/check if AC are ready for automation, (2) assess if AC can be converted as-is, (3) validate AC quality for Playwright, (4) turn AC into tests, (5) generate tests from acceptance criteria, (6) convert .md bullets or .feature Gherkin files to Playwright specs, (7) create test automation from requirements. Handles both bullet-style markdown and Gherkin syntax with JSON test plan generation and validation.
license: Apache-2.0
metadata:
  author: accelint
  version: "2.0.0"
---

# AC To Playwright

**MANDATORY - READ ENTIRE FILE**: Before processing ANY acceptance criteria, you MUST read [`references/acceptance-criteria.md`](references/acceptance-criteria.md) completely from start to finish. It is the authoritative source for AC writing rules and mappings.

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

## Assessment Mode

**Purpose:** Validate whether AC are conversion-ready by checking structure, targets, actions, and expected outcomes against Playwright requirements.

**When triggered:** User asks to review/evaluate/assess/check AC readiness.

**Key behaviors:**
- Analyzes AC text only - no file generation
- Reports "✓ conversion-ready" or "❌ not conversion-ready" with specific issues
- Zero-defect principle: even one blocking issue = not ready
- Response calibration: enumerate issues for fixable AC (1-10 issues), ask clarifying questions for severely broken AC (>10 issues)

**For complete workflow and response templates:** Load `references/assessment-mode.md`

## Conversion Mode

**Purpose:** Transform AC into JSON test plans and Playwright spec files through a structured pipeline.

**When triggered:** User asks to convert/generate/turn AC into tests.

**Key behaviors:**
- Always runs assessment first - stops if any AC fail assessment
- Use the stopping protocol template (in the linked reference below) to provide clear communication to the user
- Requires explicit output directories before writing files
- Works one file at a time (no parallelization)
- Validates JSON plans before writing
- Translates plans to Playwright tests

**When spawning a subagent for conversion mode, use this exact prompt format:**
```
THIS IS AN EXECUTION TASK, NOT A PLANNING TASK. Do not create any plan documents.

Convert [AC file path] to Playwright tests using the accelint-ac-to-playwright skill.

Output directories:
- Plans: [path]
- Tests: [path]
- Summaries: [path]

You must:
1. Run assessment
2. Build the JSON test plan object
3. Use the Write tool to create the .json file
4. Run validation
5. Run translation script
6. Use the Write tool to create the .spec.ts file

Actually write these files. Do not just describe what should be written.
```

**For complete workflow, naming rules, and output specifications:** Load `references/conversion-mode.md`

## Context Management

**Load selectively to avoid context bloat:**

- **Assessment-only task** → load `assessment-mode.md`, skip `conversion-mode.md`
- **Conversion task** → load `conversion-mode.md`, skip `assessment-mode.md` (it references assessment workflow internally)
- **Both modes** → always load `acceptance-criteria.md` and `test-hooks.md`
- **Never load both mode files simultaneously** — they have overlapping content

**Note on test-hooks.md:** Load when converting AC → JSON plans or running assessment mode (contains controlled vocabulary for area/component/intent target patterns). Do NOT load when converting plans → tests (translation script handles this automatically).

## Resources

**Reference map only - load contextually as directed by mode files:**

- `references/acceptance-criteria.md` — AC writing rules and mappings (load for both modes)
- `references/test-hooks.md` — controlled vocabulary for target patterns (load for both modes)
- `references/assessment-mode.md` — detailed assessment workflow and response calibration
- `references/conversion-mode.md` — complete conversion pipeline and specifications
- `scripts/plan-schema.ts` — schema and validation logic (loaded by conversion mode when needed)
- `scripts/cli/validate-plan.ts` — validator script (loaded by conversion mode when needed)
- `scripts/translate-plan-to-tests.ts` — plan-to-test translator (loaded by conversion mode when needed)
- `scripts/cli/generate-tests.ts` — CLI wrapper (loaded by conversion mode when needed)

## Core Anti-Patterns

These critical rules apply across both modes. Complete anti-pattern lists are in the mode-specific reference files.

- **NEVER read `acceptance-criteria.md` with range limits** — if you need to read this file, always read it completely from start to finish.

- **NEVER take shortcuts** — agents have gone off the rails when trying to define their own shortcuts. When triggered, always run the full workflow as specified in the mode files.