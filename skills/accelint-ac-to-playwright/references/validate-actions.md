# Action Validator

**When to spawn subagent:** When validating action verbs and values during assessment mode.

**Subagent prompt template:**
"Validate all actions in this AC file. Check that action verbs are recognized and mappable to Playwright actions, fill/select actions have quoted literal values, and coordinate-based actions include coordinates. Report all violations with line numbers."

## Task

Validate that all action verbs in AC are recognized and properly specified with required parameters.

## Input

- AC file content (markdown bullets or Gherkin .feature file)
- Extracted actions with line numbers:
```json
[
  {"line": 5, "verb": "clicks", "target": "Submit button on the form", "value": null, "coordinates": null},
  {"line": 8, "verb": "fills", "target": "email input", "value": "'test@example.com'", "coordinates": null},
  {"line": 12, "verb": "clicks at position", "target": null, "value": null, "coordinates": {"x": 150, "y": 200}},
  {"line": 15, "verb": "hovers", "target": "tooltip text on the card", "value": null, "coordinates": null}
]
```

Note: The orchestrator (assessment mode) is responsible for extracting actions from AC text and parsing them into this format before spawning this subagent.

## Output Format

**If all valid:**
```
✓ All actions valid
```

**If issues found:**
```
❌ Action validation errors:
  - Line 5: Vague verb "interact" (must use specific action: click, fill, select, etc.)
  - Line 12: Fill action missing quoted value (found: "a valid email", need: "'test@example.com'")
  - Line 18: Select action missing quoted value (found: "any option", need: "'Premium Plan'")
  - Line 23: Hover without target (need: "hovers over the tooltip text on the card")
  - Line 30: Unrecognized verb "taps" (use: click, fill, select, drag, press, scroll)
```

## Validation Rules

### Recognized Action Verbs

**Element-based actions** (require target):
- `clicks` — standard element click (maps to `click` action)
- `fills` — input field entry (maps to `fill` action, requires quoted value)
- `selects` — dropdown selection (maps to `select` action, requires quoted value)
- `hovers` — hover over element (maps to `hover` action, requires target)

**Keyboard actions**:
- `presses <key>` — single key press (maps to `press` action)
  - Examples: "presses Enter", "presses the g key", "presses Escape"
  - Valid keys: Enter, Escape, Tab, Space, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, a-z, 0-9, etc.
- `presses <Modifier>+<key>` — modifier combination (maps to `keyDown` + `press` + `keyUp` sequence)
  - Examples: "presses Shift+g", "presses Control+Enter", "presses a+k"
  - Valid modifiers: Shift, Control, a (app-specific modifier)
  - IMPORTANT: AC should use natural language like "Shift+g"; conversion will expand to keyDown/press/keyUp

**Coordinate-based mouse actions** (require x,y coordinates):
- `clicks at position X, Y` — coordinate click (maps to `mouseClick` action)
- `double-clicks at position X, Y` — coordinate double-click (maps to `doubleClick` action)
- `moves the mouse to position X, Y` — cursor positioning (maps to `mouseMove` action)
- `presses the mouse button` — press button at current position (maps to `mouseDown` action, must follow mouseMove)
- `releases the mouse button` — release button at current position (maps to `mouseUp` action)
- `drags from position X1, Y1 to position X2, Y2` — drag operation (maps to `drag` action)

**Page actions** (standalone):
- `scrolls <direction> N pixels` — page scrolling (maps to `scroll` action)
  - Requires direction: up, down, left, right
  - Requires pixel amount
  - Example: "scrolls down 200 pixels"
- `reloads` — page reload (maps to `reload` action, only valid in Given steps for context setup)

### Vague/Unrecognized Verbs (reject these)

- `interacts` — too vague, must specify click/fill/select/hover
- `uses` — too vague, must specify action
- `hovers at position X, Y` — invalid (hover requires element target, not coordinates; use "clicks at position" or "hovers over <element>")
- `taps` — use "clicks" instead
- `enters` — use "fills" instead
- `chooses` — use "selects" for dropdowns, "clicks" for buttons
- `submits` — use "clicks the Submit button" instead
- `types` — use "fills" for input fields, "presses" for individual keys

### Value Requirements

**Fill actions** must have quoted literal values:
- ✅ Valid: `fills the email input with 'test@example.com'`
- ❌ Invalid: `fills the email input with a valid email`
- ❌ Invalid: `fills the email input with any value`
- ❌ Invalid: `enters test data`

**Select actions** must have quoted literal values:
- ✅ Valid: `selects 'Premium Plan' from the plan dropdown`
- ❌ Invalid: `selects Premium Plan from the plan dropdown`
- ❌ Invalid: `selects the first option`
- ❌ Invalid: `selects any plan`
- ❌ Invalid: `chooses an option`

### Coordinate Requirements

**Coordinate-based actions** must include x,y positions:
- ✅ Valid: `clicks at position 150, 200`
- ✅ Valid: `drags from position 100, 100 to position 200, 200`
- ✅ Valid: `moves the mouse to position 300, 400`
- ❌ Invalid: `clicks at position` (missing coordinates)
- ❌ Invalid: `hovers at position 150, 200` (hover requires element target, not coordinates)

## Examples

**Valid actions:**
```gherkin
When the user fills the email input with 'test@example.com'
And the user fills the password input with 'secure123'
And the user selects 'Premium Plan' from the plan dropdown on the form
And the user clicks the Submit button on the form
And the user hovers over the tooltip text on the card
And the user presses Enter
And the user presses Shift+g
And the user clicks at position 150, 200
And the user moves the mouse to position 300, 400
And the user presses the mouse button
And the user releases the mouse button
And the user drags from position 100, 100 to position 200, 200
And the user scrolls down 200 pixels
```

**Invalid actions:**

1. **Vague verb:**
```gherkin
When the user interacts with the form  ❌ Must specify: clicks, fills, or selects
```

2. **Fill without quoted value:**
```gherkin
When the user fills the email input with a valid email  ❌ Need: 'test@example.com'
```

3. **Select without quoted value:**
```gherkin
When the user selects the first option from the dropdown  ❌ Need: 'Premium Plan'
```

4. **Hover with coordinates (invalid):**
```gherkin
When the user hovers at position 150, 200  ❌ Hover requires element target, use "clicks at position" instead
```

5. **Hover without target (too vague):**
```gherkin
When the user hovers  ❌ Need target: "hovers over the tooltip text on the card"
```

6. **Unrecognized verb:**
```gherkin
When the user taps the button  ❌ Use "clicks" instead
```

7. **Reload in action step:**
```gherkin
When the user reloads the page  ❌ Reload only allowed in Given steps
```

8. **Generic fill value:**
```gherkin
When the user enters test data  ❌ Must specify exact value with "fills ... with 'value'"
```
