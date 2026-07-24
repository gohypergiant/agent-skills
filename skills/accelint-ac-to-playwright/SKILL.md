---
name: accelint-ac-to-playwright
description: Convert and validate acceptance criteria for Playwright test automation. Use when user asks to (1) review/evaluate/check if AC are ready for automation, (2) assess if AC can be converted as-is, (3) validate AC quality for Playwright, (4) turn AC into tests, (5) generate tests from acceptance criteria, (6) convert .md bullets or .feature Gherkin files to Playwright specs, (7) create test automation from requirements. Handles both bullet-style markdown and Gherkin syntax with JSON test plan generation and validation.
license: Apache-2.0
metadata:
  author: accelint
  version: "2.0.0"
---

# AC To Playwright

## Your Role

You are a router. Load the appropriate workflow file based on the user's request.

## Route Detection

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

## Routing Rules

**Assessment mode:**
Load `agents/assessment-mode.md` and execute its workflow.

**Conversion mode:**
Load `agents/conversion-mode.md` and execute its workflow.

## Core Anti-Patterns

- **NEVER spawn both mode workflows simultaneously** — executing both duplicates work and wastes tokens.

- **NEVER modify output directories** — use exact paths the user provides. Do not append subdirectories.
