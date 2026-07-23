# Naming Transformation Generator

## Input

- Raw AC file content (markdown bullets or Gherkin .feature file)
- Filename (if provided and not pasted AC)

## Output Format

```
**Suite name**: [formatted suite name]
**Test names**:
  - [test 1 name]
  - [test 2 name]
  - [test 3 name with params if Scenario Outline]
**Output slug**: [suite-slug]
```

## Naming Transformation Rules

**Input to output mapping**: One AC file → one suite → one plan file (`<plans-dir>/<suite-slug>.json`) → one test file
- `.md` bullet-style: each `- ` bullet = one test
- `.feature` Gherkin: each Scenario = one test; each Examples row in Scenario Outline = one test

| Input | Suite Name | Test Name | Output Slug |
|-------|------------|-----------|-------------|
| Gherkin | `Feature:` text (exact, trim whitespace) → lowercase → capitalize first (~100 char limit). Use the result verbatim even if it's `---`, empty, or contains only symbols. | Scenario text (lowercase, ~100 char limit) + ` (params)` for Scenario Outlines | suite name → lowercase, spaces to dashes |
| Markdown with filename | filename (exact, without extension) → lowercase → dashes to spaces → capitalize first (~100 char limit) | Summarize bullet intent (present tense, lowercase, ~100 char) | suite name → lowercase, spaces to dashes |
| Markdown without filename (pasted) | Analyze all bullets to identify cohesive theme (e.g., "registration", "login", "checkout") → lowercase → capitalize first (~100 char limit). Use common domain action verbs from the scenarios, not generic names like "user flow" or "test suite". | Summarize bullet intent (present tense, lowercase, ~100 char) | suite name → lowercase, spaces to dashes |

**Scenario Outline parameters**: Use shortest left-to-right column combo that uniquely identifies each row, joined with `/`.

Example:
```
Examples:
  | username | password | message       |
  | user1    | pass1    | Welcome user1 |
  | user2    | pass2    | Welcome user2 |
```
Appends ` (user1/pass1)` and ` (user2/pass2)` respectively.

## Examples

### Example 1: Gherkin .feature file

**Input:**
```gherkin
Feature: User Authentication

Scenario: Successful login
  Given the user is on the login page
  When the user fills the email input with 'test@example.com'
  Then the user is on the dashboard page

Scenario Outline: Login validation
  Given the user is on the login page
  When the user fills the email input with '<email>'
  Then error text that says '<message>' appears on the form

  Examples:
    | email          | message              |
    | invalid@       | Invalid email format |
    | missing@domain | Invalid email format |
```

**Output:**
```
**Suite name**: User authentication
**Test names**:
  - successful login
  - login validation (invalid@)
  - login validation (missing@domain)
**Output slug**: user-authentication
```

### Example 2: Markdown .md file (filename: form-submission.md)

**Input:**
```markdown
- Given the user is on the contact page, when the user fills the name input with 'John', and the user fills the email input with 'john@example.com', and the user clicks the Submit button on the form, then success text that says 'Message sent' appears on a toast.
- Given the user is on the contact page, when the user clicks the Submit button on the form, then error text that says 'Name is required' appears on the form.
```

**Output:**
```
**Suite name**: Form submission
**Test names**:
  - submit contact form with valid data
  - submit form without required name field
**Output slug**: form-submission
```

### Example 3: Complex Scenario Outline with multiple parameters

**Input:**
```gherkin
Feature: Dropdown Selection

Scenario Outline: Select different plans
  Given the user is on the pricing page
  When the user selects '<plan>' from the plan dropdown on the form
  Then the price text in the summary says '<price>'

  Examples:
    | plan      | price   |
    | Basic     | $9.99   |
    | Premium   | $19.99  |
    | Enterprise| $49.99  |
```

**Output:**
```
**Suite name**: Dropdown selection
**Test names**:
  - select different plans (Basic)
  - select different plans (Premium)
  - select different plans (Enterprise)
**Output slug**: dropdown-selection
```

## Graceful Handling

The subagent must handle edge cases intelligently:

### Suite Name Length (100 char limit)
- If suite name exceeds 100 chars, summarize more aggressively
- Preserve key identifying words rather than cutting mid-word

### Test Name Length (100 char limit)
- If test name exceeds 100 chars, summarize more aggressively
- Do NOT use ellipsis - always produce complete, readable summaries
- Extract the core intent and express concisely

### Invalid Characters in Slugs
- Sanitize special characters, emojis, punctuation
- Convert to lowercase, replace spaces/underscores with dashes
- Remove characters that aren't letters, numbers, or dashes

### Scenario Outline Naming
- Apply parameter rules as documented above (shortest left-to-right column combo)
- If the full scenario name + parameters exceeds 100 chars, summarize the scenario name portion more aggressively while keeping parameters intact
  - Example: "user can successfully complete checkout flow with multiple items in cart and apply discount (premium/visa)" → "complete checkout with multiple items and discount (premium/visa)"

### Markdown Bullet Intent
- Extract intent from bullet content by summarizing the user flow
- Describe what the test validates in present tense
- Example: "Given user on login page, fills email, fills password, clicks submit, sees dashboard" → "login with valid credentials"
- Always extract meaningful intent - never use generic names like "test scenario 1"

## Notes

- Suite and test names should be concise (~100 char limit) and describe the scenario intent in present tense
- For markdown bullets, summarize the scenario flow rather than listing every step
- All transformations should produce human-readable, meaningful names

## Core Anti-Patterns

- **NEVER invent suite names** — use the Feature text or filename exactly as written, applying only the transformations in the Naming Transformation Rules section (e.g. lowercase → capitalize first) and the Graceful Handling section (e.g. shortening too-long names). Even if the source text is `---`, a placeholder, or seems incomplete, use it verbatim if possible. If the translation script later rejects it for validation reasons, report that error to the user - do not work around it by inventing a descriptive name.
