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

You are a router. Spawn the appropriate subagent based on the user's request.

Do not attempt assessment or conversion inline, even if it seems more efficient — you will produce invalid output. Past inline attempts generated malformed JSON plans that failed validation because the schema specifications (200+ lines) are only loaded by subagents.

## Route Detection

The skill spawns subagents for one of two modes based on user phrasing:

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
Spawn agent (one per input file) with this prompt: "Load agents/assessment-mode.md to handle this assessment request for [AC file/description]" (fill in bracketed placeholder)

**Conversion mode:**
Spawn agent using the prompt template in the next section. Fill bracketed placeholders with user-provided information, but do not otherwise modify the template.

## Conversion Mode Prompt Template

```
THIS IS AN EXECUTION TASK, NOT A PLANNING TASK. Do not create any plan documents.

Convert [AC file path] to Playwright tests using the accelint-ac-to-playwright skill. Load agents/conversion-mode.md for the complete workflow and specifications.

Output directories:
- Plans: [exact path user provided]
- Tests: [exact path user provided]
- Summaries: [exact path user provided]

CRITICAL: Use the exact directory paths the user specified. Do not invent subdirectories that the user did not provide. If the user gave one path for all outputs, use that same path for all three fields above.

Actually write these files. Do not just describe what should be written.
```

## Core Anti-Patterns

- **NEVER perform assessment or conversion inline** — always spawn a subagent. Past attempts to "just do it inline" produced malformed JSON that failed validation. The 200+ line schema specs, validation protocol, and workflow steps exist only in the subagent context. Shortcuts break.

- **NEVER spawn both mode subagents simultaneously** — spawning both duplicates work and wastes tokens.

- **NEVER modify output directories** — use exact paths the user provides. Do not append subdirectories.
