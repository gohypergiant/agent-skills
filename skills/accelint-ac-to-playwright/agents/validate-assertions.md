# Assertions Validator

## Task

Validate that all Then step assertions in AC are explicit, measurable, and properly specified.

## Input

- AC file content (markdown bullets or Gherkin .feature file)
- Extracted assertions with line numbers:
```json
[
  {"line": 10, "verb": "sees", "target": "toast.text.success", "value": "Submitted"},
  {"line": 15, "verb": "shows up", "target": "page.table.tracks", "value": null},
  {"line": 20, "verb": "is on", "target": null, "value": "dashboard"}
]
```

Note: The orchestrator (assessment mode) is responsible for extracting assertions from AC text before spawning this subagent. `verb` contains the assertion type (sees, appears, shows, is on, etc.), `target` contains the element to verify, `value` contains expected text or page name.

## Output Format

**If all valid:**
```
✓ All expected outcomes valid
```

**If issues found:**
```
❌ Expected outcome validation errors:
  - Line 10: Vague outcome (found: "the form is submitted", need: explicit measurable outcome like "success text that says 'Submitted' appears on a toast")
  - Line 15: Implied visibility change (found: "the table updates", need: trigger word like "appears", "shows", or "visible")
  - Line 20: Missing specific verification (found: "error is shown", need: specific text like "error text that says 'Invalid email' appears")
```

## Validation Rules

### Explicit Outcomes Required

Outcomes must be **explicitly stated**, not implied or inferred:
- ✅ Valid: "the user sees success text that says 'Submitted' on a toast"
- ✅ Valid: "the page heading text in the header says 'Settings'"
- ❌ Invalid: "the form is submitted" (what does the user see?)
- ❌ Invalid: "the data is saved" (how is this verified?)
- ❌ Invalid: "an error occurs" (what error? where?)

### Measurable Outcomes Required

Outcomes must specify **what to verify** (text content, element presence, or state):

**Text verification** (specific text content):
- ✅ Valid: "success text that says 'Submitted' appears on a toast"
- ✅ Valid: "the page heading text in the header says 'Settings'"
- ✅ Valid: "error text that says 'Invalid email' appears on the form"
- ❌ Invalid: "a success message appears" (what does it say?)
- ❌ Invalid: "the user sees an error" (what error text?)

**Element visibility** (specific element with trigger words):
- ✅ Valid: "the tracks table shows up on the page"
- ✅ Valid: "the loading spinner disappears"
- ✅ Valid: "the modal becomes visible"
- ✅ Valid: "the user sees the dashboard page"
- ❌ Invalid: "the table updates" (does it appear? change? what exactly?)
- ❌ Invalid: "the modal is present" (use "appears" or "visible" instead)

**Navigation** (URL or page state):
- ✅ Valid: "the user is on the settings page"
- ❌ Invalid: "the user is redirected" (to where?)

### Visibility Trigger Words

When outcomes involve visibility changes, use trigger words:
- **Appears/Shows**: "the modal appears", "success text shows up", "the user sees the table"
- **Disappears/Hides**: "the spinner disappears", "the error hides", "the modal is no longer visible"
- **Visible/Hidden**: "the tooltip becomes visible", "the banner is hidden"

Without these words, it's unclear whether you're checking visibility or just assuming presence.

### Common Vague Patterns (reject these)

- "the form is submitted" → What does the user see after submission?
- "the data is saved" → How is this verified? Message? Redirect? Element change?
- "an error occurs" → What error text? Where does it appear?
- "the page updates" → What specific change is visible?
- "the user is authenticated" → What indicates authentication? Dashboard? Welcome message?
- "the item is deleted" → Does it disappear? Is there confirmation text?

## Examples

**Valid outcomes:**

```gherkin
Then the user sees success text that says 'Form submitted successfully' on a toast
And the page heading text in the header says 'Dashboard'
And the tracks table shows up on the page
And the loading spinner disappears
And the user is on the settings page
And error text that says 'Email is required' appears on the form
```

**Invalid outcomes:**

1. **Vague (no measurable verification):**
```gherkin
Then the form is submitted  ❌ What does the user see? Need: "success text that says 'X' appears"
```

2. **Implied visibility (missing trigger word):**
```gherkin
Then the table updates  ❌ Need trigger word: "the table shows up" or "new data appears in the table"
```

3. **Action in Then (should be When):**
```gherkin
Then the page reloads  ❌ Reload is an action, belongs in When steps
```

4. **No specific text:**
```gherkin
Then a success message appears  ❌ Need specific text: "success text that says 'Submitted' appears"
```

4. **Vague error:**
```gherkin
Then an error is shown  ❌ Need: "error text that says 'Invalid email' appears on the form"
```

5. **Vague state change:**
```gherkin
Then the user is authenticated  ❌ Need measurable outcome: "the user is on the dashboard page" or "welcome text that says 'Welcome, User' appears"
```

6. **Missing location for navigation:**
```gherkin
Then the user is redirected  ❌ Need: "the user is on the settings page"
```

7. **Implied presence without visibility word:**
```gherkin
Then the modal is present  ❌ Need: "the modal appears" or "the user sees the modal"
```
