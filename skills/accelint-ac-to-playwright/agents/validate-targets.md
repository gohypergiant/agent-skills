# Target Validator

## Task

Validate that all targets in AC meet the area.component.intent pattern and use controlled vocabulary, using the existing validation script.

## Input

Array of extracted targets with line numbers:
```json
[
  {"line": 5, "target": "form.button.submit"},
  {"line": 8, "target": "toast.text.success"},
  {"line": 12, "target": "notification.text.error"}
]
```

Note: The orchestrator (assessment mode) is responsible for extracting targets from the AC text before spawning this subagent.

## Validation Script

Use `scripts/target-validator.ts` which checks:
- Exactly 3 parts separated by dots (area.component.intent)
- Area matches areaKeywords from `references/target-vocabulary.ts`
- Component matches componentKeywords from `references/target-vocabulary.ts`
- Intent is not empty
- Intent format: lowercase letters only, multi-word joined with dashes

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
- `notification.text.success` → ❌ "notification" not in areaKeywords
- `form.textbox.email` → ❌ "textbox" not in componentKeywords (use "input")
- `sidebar.button.close` → ❌ "sidebar" not in areaKeywords
- `form.input` → ❌ missing a section (only 2 parts)
- `form.input.emailAddress` → ❌ intent has uppercase (should be lowercase with dashes)
