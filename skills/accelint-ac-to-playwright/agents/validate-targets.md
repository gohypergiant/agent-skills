# Target Validator

## Task

Validate that all targets in AC meet the area.component.intent pattern and use controlled vocabulary, using the existing validation script.

**OUTPUT REQUIREMENTS:** 
- Write your validation results as plain text directly in your response message
- Do NOT use Bash, Write, Edit, or any file I/O tools to output results
- Do NOT create temp files or redirect output with `>` or `>>`
- Simply type the validation report as text in your response

## Input

Array of extracted targets with line numbers:
```json
[
  {"line": 5, "target": "form.button.submit"},
  {"line": 8, "target": "toast.text.success"},
  {"line": 12, "target": "notification.text.error"}
]
```

Note: The orchestrator (assessment mode) is responsible for extracting targets from the AC text before spawning this subagent. Targets should be extracted literally from AC text, preserving any structural issues for validation to catch.

## Validation Script

To run the validator script, use:
```
cat << 'SCRIPT' | npx tsx
import { validateTargetArray } from "./skills/accelint-ac-to-playwright/scripts/target-validator";

const targets = [/* paste targets array here */];
const result = validateTargetArray(targets);
console.log(JSON.stringify(result, null, 2));
SCRIPT
```

This script checks:
- Exactly 3 parts separated by dots (area.component.intent)
- **Position 1 (area)** matches areaKeywords from `references/target-vocabulary.ts`
- **Position 2 (component)** matches componentKeywords from `references/target-vocabulary.ts`
- **Position 3 (intent)** is not empty and follows format rules
- Intent format: lowercase letters only, multi-word joined with dashes

**Order matters:** The script enforces that area comes first, component second, intent third. If parts are valid vocabulary but in wrong positions (e.g., `card.tooltip.text` where "tooltip" is not a valid component), validation will fail.

## Output Format

Return structured results:

```json
{
  "valid": [
    {"line": 5, "target": "form.button.submit"},
    {"line": 8, "target": "toast.text.success"}
  ],
  "invalid": [
    {"line": 12, "target": "notification.text.error", "error": "Invalid area keyword. Must be one of: nav, header, footer, form, drawer, card, toast, modal, table, page, area"},
    {"line": 15, "target": "form.textbox.email", "error": "Invalid component keyword. Must be one of: button, link, input, dropdown, checkbox, radio, text, div, component"}
  ]
}
```

## Process

1. Receive array of targets with line numbers from orchestrator
2. For each target, run it through the target-validator script
3. Collect results into valid/invalid arrays
4. Return structured output

## Examples

**Valid targets (will pass validation):**
- `nav.link.settings` → ✓ valid area, component, intent format
- `form.input.email-address` → ✓ valid area, component, intent with dash
- `toast.text.success` → ✓ valid area, component, intent

**Invalid targets (will fail validation):**
- `notification.text.success` → ❌ "notification" not in areaKeywords (should be "toast")
- `form.textbox.email` → ❌ "textbox" not in componentKeywords (use "input")
- `sidebar.button.close` → ❌ "sidebar" not in areaKeywords (should be "drawer" or "nav")
- `form.input.emailAddress` → ❌ intent has uppercase (should be lowercase with dashes)
- `card.tooltip.text` → ❌ "tooltip" not in componentKeywords at position 2 (parts are in wrong order, should be "card.text.tooltip")
- `form.button.` → ❌ empty intent (third part is empty string)
- `form..submit` → ❌ empty component (second part is empty string)
- `.button.submit` → ❌ empty area (first part is empty string)
