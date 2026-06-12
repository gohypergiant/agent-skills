# Preconditions Validator

**When to spawn subagent:** When validating Given steps during assessment mode.

**Subagent prompt template:**
"Validate all Given step preconditions in this AC file. Check that they follow the allowed pattern for setting starting context. Report all violations with line numbers."

## Task

Validate that all Given step preconditions in AC follow the allowed patterns for test context setup.

## Input

- AC file content (markdown bullets or Gherkin .feature file)
- Extracted Given steps with line numbers:
```json
[
  {"line": 5, "verb": "is on", "target": null, "value": "home page"},
  {"line": 12, "verb": "is on", "target": null, "value": "settings page"}
]
```

Note: The orchestrator (assessment mode) is responsible for extracting Given steps from AC text and parsing them into this format before spawning this subagent. `verb` contains the state/context verb, `target` is currently always null for preconditions (may change in the future as more preconditions are added), `value` contains the page name (may expand in the future as more preconditions are added).

## Output Format

**If all valid:**
```
✓ All preconditions valid
```

**If issues found:**
```
❌ Precondition validation errors:
  - Line 10: Invalid Given step (found: "the user clicks the button", should only set context/starting page)
  - Line 15: Vague starting page (found: "the user is logged in", need: "the user is on the [page name] page")
```

## Validation Rules

### Allowed Given Step Patterns

Given steps should **only set context**, not perform actions:

**Starting page/URL** (most common):
- ✅ Valid: "Given the user is on the home page"
- ✅ Valid: "Given the user is on the settings page"
- ✅ Valid: "Given the user is on the dashboard page"
- ❌ Invalid: "Given the user navigates to the home page" (use "is on" not "navigates to")

### Invalid Given Step Patterns

Given steps should NOT contain actions:
- ❌ Invalid: "Given the user clicks the login button" (this is an action, belongs in When)
- ❌ Invalid: "Given the user fills the email field" (action, not context)
- ❌ Invalid: "Given the user logs in" (describes behavior, not state - use "logged-in user" or move to When)

### Starting Page Pattern

When Given steps specify a starting page, they must use "the user is on the [page] page":
- ✅ Valid: "the user is on the home page"
- ✅ Valid: "the user is on the settings page"
- ❌ Invalid: "the user navigates to settings" (action verb, not context)
- ❌ Invalid: "the user is logged in" (vague - what page are they on?)

## Examples

**Valid Given steps:**

```gherkin
Given the user is on the home page
Given the user is on the settings page
```

**Invalid Given steps:**

1. **Action in Given (should be When):**
```gherkin
Given the user clicks the login button  ❌ Actions belong in When steps
```

2. **Navigation action (should be starting page):**
```gherkin
Given the user navigates to the home page  ❌ Use: "the user is on the home page"
```

3. **Behavioral description (should be state or move to When):**
```gherkin
Given the user logs in  ❌ Use: "there is a logged-in user" OR move login steps to When
```

4. **Fill action (should be in When):**
```gherkin
Given the user fills the email field  ❌ Actions belong in When steps
```

5. **Vague context without page:**
```gherkin
Given the user is authenticated  ❌ Where are they? Add: "the user is on the [page] page"
```

## Background Steps

Background steps also use Given and follow the same rules:
```gherkin
Background:
  Given the user is on the home page  ✅ Valid (starting page)
```

Background steps should NOT contain When or Then steps - only Given steps for shared context.
