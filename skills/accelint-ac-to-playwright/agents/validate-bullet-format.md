# Bullet Format Validator

## Task

Validate that markdown .md files with bullet-style AC follow proper formatting rules.

## Input

- Markdown .md file content

## Output Format

**If all valid:**
```
✓ Bullet format valid (N AC found)
```

**If issues found:**
```
❌ Bullet format violations:
  - Line 5: Malformed bullet marker (uses '* ' instead of '- ')
  - Line 12: Malformed bullet marker (uses '•' instead of '- ')
  - Line 18: Empty bullet (no content after '- ')
```

**If no AC found:**
```
⚠️ No valid AC found (no lines starting with '- ')
```

## Validation Rules

### Bullet Markers
- Each AC line **must** start with `- ` (dash followed by space)
- Do not accept variations:
  - `*` (asterisk) — invalid
  - `•` (bullet character) — invalid
  - `-` without space — invalid
  - Multiple spaces after dash — invalid

### Content
- Each bullet must have content after the `- ` marker
- Empty bullets (just `- ` with no text) are invalid

### Non-bullet Lines
- Lines that don't start with `- ` are **ignored** during validation
- These can be headers, notes, comments, or any other markdown content
- This is intentional — non-bullet lines are for human readers and don't map to tests

### Counting
- Report the total number of valid AC bullets found
- Each valid bullet maps to one test

## Examples

**Valid bullet format:**
```markdown
# Login Tests

These are tests for the login flow.

- From the login page, a user can log in by filling the email input with 'test@example.com', filling the password input with 'password123', clicking the Submit button on the form, and seeing the dashboard page.
- From the home page, a user can navigate to the Settings page by clicking the settings link in the header and should see the page heading text in the header say "Settings".

Notes: Remember to test with multiple users.
```
Result: `✓ Bullet format valid (2 AC found)`

**Invalid bullet formats:**

1. **Wrong bullet marker (asterisk):**
```markdown
* User logs in  ❌ Must use '- ' not '* '
```

2. **Wrong bullet marker (unicode):**
```markdown
• User logs in  ❌ Must use '- ' not '•'
```

3. **Missing space after dash:**
```markdown
-User logs in  ❌ Must have space after dash: '- User'
```

4. **Empty bullet:**
```markdown
- 
  ❌ No content after bullet marker
```

5. **Extra spaces after dash:**
```markdown
-  User logs in  ❌ Multiple spaces after dash
```

**Valid non-bullet content (ignored during validation):**
```markdown
# Header - not a bullet
This is a note - also not a bullet
## Section

- This IS a bullet and will be validated

> Quote - not a bullet
1. Numbered list - not a bullet
```
