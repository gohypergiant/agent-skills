# Assessment Mode

**When to load this file:** Load when the user asks to review/evaluate/assess AC readiness, check if AC are ready for automation, or validate AC quality for Playwright. Do NOT load for full conversion requests (generate/convert/turn AC into tests).

## Assessment Workflow

0. **Detect intent**: User asks to review/evaluate/assess/check AC readiness.
1. **Prepare for the task**:
  - Read `references/acceptance-criteria.md` and `references/test-hooks.md`.
  - Work one input file at a time.
  - Verify filename is valid:
    - Contains at least one letter or number
    - Extension is exactly `.feature` or `.md`
    - Reject if filename is empty, has no extension, or has invalid extension
2. **Analyze AC text** against all conversion requirements (all validation checks can be run in parallel via subagents):
   - **Structure & Format**:
     - For .md files: spawn subagent with `references/validate-bullet-format.md`
     - For .feature files: spawn subagent with `references/validate-gherkin-structure.md`
     - Subagents return validation results with line numbers for any violations
   - **Targets** (semantic validation):
     - Every action specifies a target
     - Extract all targets from AC text using the pattern documented in `acceptance-criteria.md` (lines 110-129): `<intent> <component> on the <area>` → `area.component.intent`
       - Example: "Submit button on the form" → `{"line": 5, "target": "form.button.submit"}`
       - Format as array: `[{"line": 5, "target": "form.button.submit"}, {"line": 8, "target": "toast.text.success"}]`
     - Spawn subagent with `references/validate-targets.md` to validate target format and controlled vocabulary
     - Subagent returns `{valid: [...], invalid: [...]}` - report any invalid targets as blocking issues
   - **Given Steps (Preconditions)**:
     - Extract all Given steps with line numbers, verbs, targets, and values
     - Format as array: `[{"line": N, "verb": "...", "target": "...", "value": "..."}]`
     - Spawn subagent with `references/validate-preconditions.md` to validate context setup patterns
     - Subagent returns validation results with line numbers for any violations
   - **When Steps (Actions)**:
     - Extract all When steps with line numbers, actions, targets, values, and coordinates
     - Format as array: `[{"line": N, "verb": "...", "target": "...", "value": "...", "coordinates": {...}}]`
     - Spawn subagent with `references/validate-actions.md` to validate actions, required parameters, and values
     - Subagent returns validation results with line numbers for any violations
   - **Then Steps (Assertions)**:
     - Extract all Then steps with line numbers, verbs, targets, and values
     - Format as array: `[{"line": N, "verb": "...", "target": "...", "value": "..."}]`
     - Spawn subagent with `references/validate-assertions.md` to validate explicitness and measurability
     - Subagent returns validation results with line numbers for any violations

## Recognition Patterns

Before reporting results, identify these quality signals to guide your response:

**Good AC** (report as conversion-ready if no blocking issues):
| Check | Question | If NO → Flag as Issue |
|-------|----------|----------------------|
| **Targets** | Does every action specify area.component.intent? | Missing or incomplete target specification |
| **Values** | Are all fill/select values quoted literals? | Unquoted or generic values (flag with example) |
| **Outcomes** | Are expectations measurable (specific text/element/state)? | Vague or implied outcome (ask what to verify) |

**Bad patterns that require clarification:**
- "interact with" → too vague, can't map to Playwright action (click/fill/select needed)
- "select the first option" → needs exact option text as quoted literal
- "a valid email" → needs concrete value like `'test@example.com'`
- "the button" → needs specific intent (e.g., "Submit button on login form")

**Why this matters:** These patterns help calibrate response quality. When multiple bad patterns appear, use interactive clarification mode (BAD AC strategy from Response Calibration section) rather than enumerating dozens of similar issues.

3. **Report results**:
   - If issues found: Report "❌ AC are not conversion-ready" with detailed issue list (see output format below)
   - If no issues: Report "✓ AC are conversion-ready" with validated checklist
   - Do NOT generate any files (no JSON plans, no test files)
   - Report results for all input files - do not stop Assessment mode after a single failure to ensure all issues are surfaced to the user at once.

## Response Calibration: Quality-Driven Assessment

**Zero-defect principle:** Even ONE issue that prevents automatic conversion = "❌ AC are not conversion-ready"

Before reporting, classify the AC quality level to determine the appropriate response strategy:

| Quality Level | Signals | Response Strategy |
|--------------|---------|-------------------|
| **PERFECT** | All targets clear (area.component.intent), all verbs recognized, all values quoted literals, all outcomes explicit and measurable | Report "✓ AC are conversion-ready" with validated checklist |
| **MIXED** | 1-10 fixable issues, structure mostly intact, intent mostly clear, majority of AC follows patterns correctly | Report "❌ AC are not conversion-ready" with enumerated issue list - include line/scenario references, problem descriptions, and specific fixes for each issue |
| **BAD** | >10 issues, pervasive vagueness, missing fundamentals (targets/verbs/values/outcomes throughout), would require wholesale rewrite | Switch to interactive clarification mode - ask targeted questions to help user improve AC quality rather than overwhelming them with a 30+ item list |

**Why this matters:**
- **MIXED AC** benefit from detailed enumeration - user can systematically address each specific issue
- **BAD AC** need collaborative refinement - extensive issue lists overwhelm and don't provide actionable guidance; targeted questions guide improvement more effectively
- Distinguishing between these prevents both false negatives (reporting MIXED as ready) and unhelpful responses (listing 30+ issues for BAD AC)

## Severity Threshold: When to Fail Assessment

**Rule:** If you find ANY issue that prevents automatic conversion, report "❌ AC are not conversion-ready"

**What counts as a blocking issue:**
- ANY vague verb that can't be mapped to Playwright actions (interact, use, hover without coordinates)
- ANY unquoted fill/select value ("a valid email" instead of 'test@example.com')
- ANY target missing area/component/intent pattern or using invalid keywords
- ANY outcome that isn't measurable (implied, assumed, or vague expectations)
- ANY controlled vocabulary mismatch (area/component not in test-hooks.md)
- ANY incorrect keyboard modifier format (Shift+e instead of separate keyDown/press/keyUp sequence)
- ANY unrecognized action verb (drags without coordinates, invalid verbs)
- ANY structural violation (step ordering issues)

**Do NOT ignore "minor" issues:**
- Incorrect keyboard format BLOCKS conversion
- Unrecognized verb BLOCKS conversion  
- Missing @ prefix on tags BLOCKS conversion

**When in doubt, enumerate the issue:** False positives (flagging valid AC) are better than false negatives (missing real issues that cause conversion failures downstream).

## Assessment Output Format

### When validation fails

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

When AC have >10 issues or pervasive vagueness, ask targeted questions instead of enumerating every issue:

```
These AC need refinement before conversion. I have some questions to help clarify:

**Targets:**
1. [Scenario reference]: The AC mentions "the button" - which specific button? (e.g., Submit button on the login form, Cancel button on the modal)
2. [Scenario reference]: "floating card component" - what area is this in? (nav, header, form, modal, page, etc.)

**Actions:**
3. [Scenario reference]: "opens" - how does this happen? (user clicks something, user fills a field that triggers it, page loads and it appears automatically)

**Values:**
4. [Scenario reference]: The AC uses a variable reference "trajectory.start_latitude" - what's the exact literal value to use for this test? (e.g., '37.7749')

**Expected Outcomes:**
5. [Scenario reference]: "position will shift" - what specific measurable change should we verify? (element moves to specific coordinates, element becomes visible, text content changes to specific value)

Once you clarify these, I can assess whether the AC are conversion-ready.
```

## NEVER Do

- **NEVER generate artifacts in assessment mode** — when the user asks to review/evaluate/assess AC, analyze the AC text only and provide the formatted report. Do not generate JSON plans or test files. Do not assume they want full conversion.
- **NEVER report AC as conversion-ready when issues exist** — even one blocking issue means "❌ AC are not conversion-ready". False positives (over-flagging) are better than false negatives (missing issues).
- **NEVER assume targets or values** — if AC says "click the button" without identifying which button, flag it as a missing target issue rather than assuming. Generic targets like `button.generic` bypass the controlled vocabulary system and create tests that break because they match multiple elements unpredictably.
