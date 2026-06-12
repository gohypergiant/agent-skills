# Gherkin Structure Validator

**When to spawn subagent:** When assessing Gherkin .feature file structure during assessment mode.

**Subagent prompt template:**
"Validate this Gherkin file's structure against all Gherkin requirements. Check Feature declaration, Background placement, Scenario/Scenario Outline structure, Examples tables, step ordering, and tag format. Report all violations with line numbers."

## Task

Validate that Gherkin .feature files follow proper structure and formatting rules.

## Input

- Gherkin .feature file content

## Output Format

**If all valid:**
```
✓ Gherkin structure valid
```

**If issues found:**
```
❌ Gherkin structure violations:
  - Line 1: Missing Feature declaration (must have exactly one Feature: line)
  - Line 15: Background appears after first Scenario (must appear before all scenarios)
  - Line 22: Background contains When step (only Given steps allowed)
  - Line 45: Scenario Outline has no Examples table
  - Line 67: Loose Examples table (must follow Scenario Outline)
  - Line 78: When step before Given (wrong order: must be Given → When → Then)
  - Line 92: Tag missing @ prefix (tags must start with @)
```

## Validation Rules

### Feature Declaration
- **Exactly one** `Feature:` line per file
- Must appear at or near the top (before any Background/Scenario/Scenario Outline)

### Background
- **Maximum one** Background per file
- Must appear **before** the first Scenario or Scenario Outline
- Can only contain `Given` steps (no `When` or `Then` allowed)

### Scenarios
- `Scenario:` and `Scenario Outline:` can appear multiple times
- Each Scenario Outline **must** have at least one `Examples:` block immediately following it
- No loose `Examples:` tables outside of Scenario Outlines

### Step Ordering
- Within any Scenario, Scenario Outline, or Background:
  - All `Given` steps come first
  - Then all `When` steps
  - Then all `Then` steps
- `And` and `But` inherit the type of the previous step and don't change ordering

### Tags
- All tags **must** start with `@`
- Tags can appear above: Feature, Scenario, or Scenario Outline
- Tags above Feature apply to all scenarios in the file

### Comments
- Lines starting with `#` are comments and should be ignored during validation

## Examples

**Valid Gherkin:**
```gherkin
@suite-tag
Feature: User authentication

  Background:
    Given the user is logged out

  @smoke
  Scenario: Successful login
    Given the user is on the login page
    When the user fills the email input with 'test@example.com'
    And the user fills the password input with 'password123'
    And the user clicks the Submit button on the form
    Then the user sees the dashboard page

  Scenario Outline: Login with multiple users
    Given the user is on the login page
    When the user fills the email input with '<email>'
    Then the user sees a '<result>' message

    Examples:
      | email           | result  |
      | valid@test.com  | success |
      | invalid@test.com| error   |
```

**Invalid Gherkin patterns:**

1. **Multiple Feature declarations:**
```gherkin
Feature: First feature
Feature: Second feature  ❌ Only one Feature allowed
```

2. **Background after Scenario:**
```gherkin
Feature: Test
  Scenario: First test
    Given something
  
  Background: ❌ Must appear before all scenarios
    Given initial state
```

3. **Background with When/Then:**
```gherkin
Background:
  Given initial state
  When user does something  ❌ Background only allows Given steps
```

4. **Scenario Outline without Examples:**
```gherkin
Scenario Outline: Test with <param>
  Then something happens with <param>
  ❌ Missing Examples table
```

5. **Loose Examples table:**
```gherkin
Scenario: Regular scenario
  Then something happens

Examples:  ❌ Examples must follow Scenario Outline, not regular Scenario
  | value |
  | test  |
```

6. **Wrong step order:**
```gherkin
Scenario: Bad ordering
  When the user clicks something  ❌ When before Given
  Given the user is on a page
  Then something happens
```

7. **Tags without @:**
```gherkin
smoke  ❌ Missing @ prefix
Feature: Test feature
```
