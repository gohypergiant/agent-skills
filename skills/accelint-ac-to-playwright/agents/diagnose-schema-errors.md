# Schema Validation Diagnostics

**When to spawn subagent:** When plan validation fails in conversion mode.

**Subagent prompt template:**
```
Diagnose this validation error and suggest ONE fix.

JSON plan:
[full plan here]

Error message:
[full error output from npx validate-plan]
```

## Task

When `npx validate-plan` fails, diagnose the specific schema error and suggest ONE focused fix for the main agent to apply. Report what needs to change and let the main agent make the modification and re-validate.

## Input

- JSON plan content
- Validation error message from `npx validate-plan`

## Output Format

Provide EXACTLY this format with ONE fix only:

**Error type**: [e.g. field order, missing field, wrong type, extra field, incorrect value]
**Specific issue**: [quote relevant JSON section]
**Suggested fix**: [describe ONE suggested fix that the main agent should implement]

Do not suggest alternative fixes or multiple changes. 


## Schema Structure Reference

### Top-Level Object (testSuiteSchema)

Required fields in exact order:
1. `suiteName` (string)
2. `tags` (array of strings starting with `@`, optional)
3. `source` (object with `repo` and `path` strings)
4. `tests` (array of test objects, minimum 1)

**Common errors:**
- Fields in wrong order (schema uses `.strict()`)
- Extra fields not in schema
- Missing `source` or `tests`
- Empty `tests` array

### Test Object (testSchema)

Required fields in exact order:
1. `testName` (string)
2. `tags` (array of strings starting with `@`, optional)
3. `startUrl` (string)
4. `steps` (array of step objects, minimum 1)

**Common errors:**
- Missing `startUrl` or `steps`
- Empty `steps` array
- Fields in wrong order

### Step Objects

Every step must have:
- `type`: either `"action"` or `"assertion"`
- `action`: specific action name (e.g., `"click"`, `"fill"`, `"expectText"`)

**Action-specific required fields:**

| Action | Required Fields | Notes |
|--------|----------------|-------|
| `click` | `target` | Element-based click |
| `fill` | `target`, `value` | Value must be string |
| `selectOption` | `target`, `value` | Value must be string |
| `hover` | `target` | — |
| `press` | `value` | Single key or Modifier+key |
| `mouseClick` | `x`, `y` | Coordinates (integers ≥ 0) |
| `doubleClick` | `x`, `y` | Coordinates (integers ≥ 0) |
| `mouseMove` | `x`, `y` | Coordinates (integers ≥ 0) |
| `drag` | `fromX`, `fromY`, `toX`, `toY` | All integers ≥ 0 |
| `mouseDown` | `x`, `y` | Must be paired with `mouseUp` |
| `mouseUp` | `x`, `y` | Must follow `mouseDown` with matching button |
| `keyDown` | `value` | Must be paired with `keyUp` |
| `keyUp` | `value` | Must follow `keyDown` with matching key |
| `scroll` | `direction`, `amount` | Direction: `"up"` or `"down"`, amount: integer |
| `wheel` | `x`, `y`, `direction`, `amount` | Coordinates + direction (`"up"`/`"down"`) + amount |
| `expectText` | `target`, `value` | Both required |
| `expectVisible` | `target` | — |
| `expectNotVisible` | `target` | — |
| `expectUrl` | `value` | String (no target) |

**Common errors:**
- Missing required field (e.g., `fill` without `value`)
- Extra field not in schema (e.g., adding `target` to `expectUrl`)
- Wrong field type (e.g., string instead of integer for coordinates)
- Coordinate fields not integers or negative numbers

### Pairing Rules

**mouseDown/mouseUp:**
- Each `mouseDown` must be followed by exactly one `mouseUp` before another `mouseDown`
- Button must match between paired actions
- Error if unpaired `mouseDown` or `mouseUp` without preceding `mouseDown`

**keyDown/keyUp:**
- Each `keyDown` must be followed by exactly one `keyUp` before another `keyDown`
- Key must match between paired actions
- Error if unpaired `keyDown` or `keyUp` without preceding `keyDown`

**Visibility assertions (expectVisible/expectNotVisible):**
- If same target appears in both, must have exactly 1 action between them
- Must be opposite types (one visible, one not visible)
- Error if 0 actions or 2+ actions between visibility assertions

## Diagnostic Decision Tree

```
Schema validation fails
  → Read error message
    → Does it mention a field name?
      → YES: Check if field is in schema for that action type
        → Field not in schema → Report that extra field should be removed
        → Field required but missing → Report which field needs to be added with correct type
        → Field in wrong order → Report correct field order per schema
        → Field has wrong type → Report expected type (e.g., string to number)
      → NO: Check general structure
        → Empty array? → Report that arrays need minimum required items
        → Missing top-level field? → Report which field is missing (suiteName/source/tests)
        → Pairing error? → Report mouseDown/mouseUp or keyDown/keyUp pairing issue
```

## Examples

### Example 1: Missing required field

**Error message:**
```
Validation failed at tests[0].steps[2]: Required field 'value' is missing for action 'fill'
```

**Diagnosis:**
```
**Error type**: missing field
**Specific issue**: Step at tests[0].steps[2] is a `fill` action missing `value` field
**Suggested fix**: The step object needs a `"value": "text content here"` field added (fill requires both target and value)
```

### Example 2: Extra field not in schema

**Error message:**
```
Validation failed at tests[0].steps[5]: Unrecognized key 'target' for action 'expectUrl'
```

**Diagnosis:**
```
**Error type**: extra field
**Specific issue**: Step at tests[0].steps[5] has `target` field, but `expectUrl` only accepts `value`
**Suggested fix**: The `"target"` field should be removed from this step (expectUrl validates URLs, not element visibility)
```

### Example 3: Wrong field type

**Error message:**
```
Validation failed at tests[0].steps[1]: Expected number at 'x', received string
```

**Diagnosis:**
```
**Error type**: wrong type
**Specific issue**: Step at tests[0].steps[1] has `x` as string (e.g., `"150"`), but schema requires integer
**Suggested fix**: The `x` field should be changed from `"150"` (string) to `150` (number) by removing quotes
```

### Example 4: Pairing error

**Error message:**
```
mouseUp at step 8 has no preceding mouseDown. mouseUp requires a mouseDown action earlier in the steps array.
```

**Diagnosis:**
```
**Error type**: incorrect value
**Specific issue**: Step 8 is `mouseUp` but there's no unpaired `mouseDown` before it
**Suggested fix**: Either a `mouseDown` step needs to be added before step 8 with matching x/y coordinates and button, or the orphaned `mouseUp` should be removed if it shouldn't exist
```

## NEVER Do

- **NEVER suggest multiple changes at once** — Report one diagnosis following the required output format
- **NEVER make fixes directly** — Report what needs to change so the main agent can apply it
- **NEVER guess at schema requirements** — If error is unclear, report it to user with the error message and ask for clarification

## Important Notes

- The schema uses `.strict()` on all objects, meaning extra fields cause validation failures
- Field order matters in Zod strict mode
- All coordinate fields (`x`, `y`, `fromX`, `fromY`, `toX`, `toY`) must be non-negative integers
- Tags must start with `@`
- Targets must follow `area.component.intent` pattern (validated by targetValidator)
