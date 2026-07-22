# Assessment Mode

## Assessment Workflow

Do not attempt inline validation — validation subagents check against schemas and controlled vocabulary lists that you don't have loaded. You must spawn the validation subagents below as you work through each section.

0. **Detect intent**: User asks to review/evaluate/assess/check AC readiness.
1. **Prepare for the task**:
  - Read `references/acceptance-criteria.md` and `references/test-hooks.md`.
  - Work one input file at a time.
  - Verify filename is valid:
    - Contains at least one letter or number
    - Extension is exactly `.feature` or `.md`
    - Reject if filename is empty, has no extension, or has invalid extension
2. **Analyze AC text** in two phases:
  - **Phase A: Extract data** from AC per the categories below
  - **Phase B: Validate extracted data** by spawning validation subagents (all can run in parallel)
   
  You must complete both phases. Extraction alone is insufficient — validation subagents check against schemas you don't have access to.

  - **Structure & Format**:
    - There is no Phase A work for this section.
    - Phase B: 
      - For .md files: spawn subagent with `agents/validate-bullet-format.md`
      - For .feature files: spawn subagent with `agents/validate-gherkin-structure.md`
    - Subagents return validation results with line numbers for any violations
  - **Targets** (semantic validation):
    - Phase A:
      - Extract all targets from AC text using the pattern documented in `acceptance-criteria.md` (lines 110-129):  `<intent> <component> on the <area>` → `area.component.intent`
        - Example: "Submit button on the form" → `{"line": 5, "target": "form.button.submit"}`
        - Format as array: `[{"line": 5, "target": "form.button.submit"}, {"line": 8, "target": "toast.text.success"}]`
    - Phase B: 
      - Spawn subagent with `agents/validate-targets.md` to validate target format and controlled vocabulary
    - Subagent returns `{valid: [...], invalid: [...]}` - report any invalid targets as blocking issues
  - **Given Steps (Preconditions)**:
    - Phase A:
      - Extract all Given steps with line numbers, verbs, targets, and values
      - Format as array: `[{"line": N, "verb": "...", "target": "...", "value": "..."}]`
    - Phase B:
      - Spawn subagent with `agents/validate-preconditions.md` to validate context setup patterns
    - Subagent returns validation results with line numbers for any violations
  - **When Steps (Actions)**:
    - Phase A: 
      - Extract all When steps with line numbers, actions, targets, values, and coordinates
      - Format as array: `[{"line": N, "verb": "...", "target": "...", "value": "...", "coordinates": {...}}]`
    - Phase B:
      - Spawn subagent with `agents/validate-actions.md` to validate actions, required parameters, and values
    - Subagent returns validation results with line numbers for any violations
  - **Then Steps (Assertions)**:
    - Phase A:
      - Extract all Then steps with line numbers, verbs, targets, and values
      - Format as array: `[{"line": N, "verb": "...", "target": "...", "value": "..."}]`
    - Phase B:
      - Spawn subagent with `agents/validate-assertions.md` to validate explicitness and measurability
    - Subagent returns validation results with line numbers for any violations
3. **Report results**:
  - If issues found: Report "❌ AC are not conversion-ready" with detailed issue list (see output format below)
  - If no issues: Report "✓ AC are conversion-ready" with validated checklist
  - Do NOT generate any files (no JSON plans, no test files)
  - Report results for all input files - do not stop Assessment mode after a single failure to ensure all issues are surfaced to the user at once.

## Issue Classification

All validation failures fall into two categories that determine response strategy:

### Minor Issues (Quick Fixes)

These require simple text edits where the underlying intent is already clear:

**Incomplete targets** — Target has area.component but missing .intent
- Example: "clicks the button on the form" → which button?
- Fix: Add specific intent: "clicks the Submit button on the form"

**Invalid controlled vocabulary** — Area/component not defined in test-hooks.md
- Example: "profile button on the sidebar" when sidebar isn't a recognized area
- Fix: change "sidebar" to a recognized area

**Missing quotes around values** — Fill/select actions need quoted literal values
- Example: `fills the email input with a valid email` → needs concrete value
- Fix: Use quoted literal: `fills the email input with 'test@example.com'`
- Example: `selects Premium Plan` → needs quotes
- Fix: Add quotes: `selects 'Premium Plan'`

**Format issues** — Simple syntax fixes:
- Missing @ prefix on tags
- Fix: add @ prefix to tags
- Missing Feature declaration
- Fix: Add Feature declaration

### Major Issues (Require Discussion)

These indicate unclear requirements needing back-and-forth clarification with the user:

**Vague/unrecognized verbs** — Can't map to Playwright actions. If the verb is not in the schema (clicks, fills, selects, presses, hovers, scrolls, drags, reloads, etc.), it must be rejected as a major issue requiring discussion. We cannot assume it's a simple substitution - the user may be describing an entirely new action type.
- Examples: "interacts with", "uses", "taps", "enters", "submits", "types" (for key presses), "hovers" (without element target)

**Unmeasurable outcomes** — Assertions don't specify what to verify
- Examples: "the page updates", "the system responds", "position will shift"

**Missing targets entirely** — No mention of what element is being acted upon
- Example: "the user clicks" → clicks what?

**Structural violations** — Step ordering issues, wrong step types, compound steps, incomplete test structures. These prevent conversion and require discussion to understand intent.
- Examples: 
  - Action in Given step, precondition in When step
  - Background with When or Then steps (only Given allowed)
  - Compound steps combining action and assertion in one line (e.g., "When the user clicks X, the text says Y")
  - First step in a scenario starts with And/But instead of Given/When/Then (missing context - what is the And continuing from?)
  - Scenario Outline missing Examples table (can't generate parameterized tests)
  - Examples table column names don't match Scenario Outline placeholders (breaks parameterization)
  - Orphaned When step without Then assertion (unclear what outcome to verify)

## Response Calibration: Quality-Driven Assessment

**Zero-defect principle:** Even ONE issue that prevents automatic conversion = "❌ AC are not conversion-ready"

Before reporting, classify the AC quality level to determine the appropriate response strategy:

| Quality Level | Classification Rule | Response Strategy |
|--------------|---------------------|-------------------|
| **PERFECT** | Zero issues of any kind | Report "✓ AC are conversion-ready" with validated checklist |
| **MIXED** | Only minor issues present (no major issues) | Report "❌ AC are not conversion-ready" with enumerated issue list — include line/scenario references, problem descriptions, and specific fixes for each issue |
| **BAD** | One or more major issues present | Switch to interactive clarification mode — ask targeted questions to help user improve AC quality rather than enumerating issues |

**Classification logic:**
1. Scan all validation results from the spawned subagents
2. Categorize each issue as minor or major (see Issue Classification section)
3. If any major issues exist → **BAD**
4. If only minor issues exist → **MIXED**
5. If zero issues → **PERFECT**

**Why this matters:**
- **MIXED AC** benefit from detailed enumeration — user can systematically address each specific issue with clear fixes
- **BAD AC** need collaborative refinement — targeted questions guide improvement more effectively than overwhelming issue lists
- Issue type (not count) determines the classification — even one major issue makes AC "BAD"

## When to Fail Assessment

**Rule:** If you find ANY issue (minor or major), report "❌ AC are not conversion-ready"

Even minor issues like incomplete targets or missing quotes prevent automatic conversion. The difference between minor and major issues affects response strategy (enumerate vs ask questions), not whether the assessment passes.

**When in doubt, flag the issue:** False positives (over-flagging) are better than false negatives (missing issues that cause conversion failures downstream).

## Assessment Output Format

### When validation fails (BAD - major issues present)

When AC contain one or more major issues, provide a summary and offer the choice:

```
❌ AC are not conversion-ready

The file has [N] major issues that need discussion:
1. [Brief description of major issue type and line number]
2. [Next major issue...]

Would you like to:
- **(a)** Get a full list of all questions to review and answer at your own pace, or
- **(b)** Work through them interactively one question at a time?
```

Example output:
```
❌ AC are not conversion-ready

The file has 2 major issues that need discussion:
1. Line 15 - Vague verb "uses" (not in schema)
2. Line 23 - Unmeasurable outcome "the page updates"

Would you like to:
- **(a)** Get a full list of all questions to review and answer at your own pace, or
- **(b)** Work through them interactively one question at a time?
```

### When validation fails (MIXED - minor issues only)

Report issues in this structure:

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

File: login-flow.feature
1. Scenario "User logs in": Missing target intent
   - Problem: Test hook selector incomplete (button.form instead of button.form.submit)
   - Example: "clicks the button on the form"
   - Fix: Specify intent: "clicks the Submit button on the form"
```

### When assessment passes

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

### Interactive clarification mode (BAD AC)

When AC have one or more major issues, ask the user how they want to proceed:

```
These AC have [N] issues that need discussion before conversion:

[Brief summary: e.g., "Found vague verbs in 3 scenarios, unmeasurable outcomes in 2 scenarios, and 1 missing target"]

Would you like to:
(a) Get a full list of all questions to review and answer at your own pace, or
(b) Work through them interactively one question at a time?
```

#### Option (a): Full question list

If user chooses (a), provide all questions grouped by category:

```
Here are all the questions that need clarification:

**Targets:**
1. [Scenario reference]: The AC mentions "the button" - which specific button? (e.g., Submit button on the login form, Cancel button on the modal)
2. [Scenario reference]: "floating card component" - what area is this in? (nav, header, form, modal, page, etc.)

**Actions:**
3. [Scenario reference]: "opens" - how does this happen? (user clicks something, user fills a field that triggers it, page loads and it appears automatically)

**Values:**
4. [Scenario reference]: The AC uses a variable reference "trajectory.start_latitude" - what's the exact literal value to use for this test? (e.g., '37.7749')

**Expected Outcomes:**
5. [Scenario reference]: "position will shift" - what specific measurable change should we verify? (element moves to specific coordinates, element becomes visible, text content changes to specific value)

Once you've answered these questions:
- If you provided a file path: I can update the AC file for you, or you can update it yourself and ask me to reassess
- If you pasted AC text: I can update the AC based on your answers and provide the revised version, or you can update it yourself and paste it back for reassessment
```

#### Option (b): Interactive mode

If user chooses (b), first ask who will handle updates:

```
Let's work through these one by one.

Would you like me to update the AC as we go (after each answer), or would you prefer to make the updates yourself at the end?
```

**If user wants LLM to update:**

For each question:
  - Ask the question
  - Wait for answer and have back-and-forth conversation as necessary
  - Update the AC (file or temp file for pasted text)
  - Confirm: "Updated. Moving to next question."

After all questions answered:
  - Reassess the AC to confirm all issues are resolved
  - If reassessment fails: Apologize and run assessment mode again with new issue list
  - If reassessment passes:
    - File path provided: "All set. The AC are now conversion-ready."
    - Pasted text: Share the updated AC with the user

**If user wants to update themselves:**

For each question:
  - Ask the question
  - Wait for answer and have back-and-forth conversation as necessary
  - Once resolved, move to next question

After all questions answered:
  - Final message: "All clarifications complete. Update the AC with these changes and I can reassess."

## NEVER Do

- **NEVER read `acceptance-criteria.md` and `test-hooks.md` with range limits** — always read them completely from start to finish.
- **NEVER generate artifacts in assessment mode** — when the user asks to review/evaluate/assess AC, analyze the AC text only and provide the formatted report. Do not generate JSON plans or test files. Do not assume they want full conversion.
- **NEVER report AC as conversion-ready when issues exist** — even one blocking issue means "❌ AC are not conversion-ready". False positives (over-flagging) are better than false negatives (missing issues).
- **NEVER assume targets or values** — if AC says "click the button" without identifying which button, flag it as a missing target issue rather than assuming. Generic targets like `button.generic` bypass the controlled vocabulary system and create tests that break because they match multiple elements unpredictably.
