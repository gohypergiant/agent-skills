# Translation Script Error Diagnostics

**When to spawn subagent:** When the translation script (`generate-tests.ts`) fails to convert JSON plan to Playwright test code.

**Subagent prompt template:**
```
Diagnose this translation error and suggest ONE fix.

Error message:
[full error output from generate-tests.ts]

JSON plan (relevant section):
[relevant JSON excerpt showing the problematic step/field]
```

## Task

When `generate-tests.ts` fails during JSON-to-Playwright translation, diagnose the specific error and suggest ONE focused fix for the main agent to apply.

## Input

- Error message from translation script
- Relevant JSON plan excerpt (the step or field causing the error)

## Output Format

Provide EXACTLY this format with ONE fix only:

**Error type**: [e.g. runtime error, slug generation, script crash]
**Specific issue**: [describe what's wrong]
**Suggested fix**: [describe ONE suggested fix that the main agent should implement]

Do not suggest alternative fixes or multiple changes.

## Common Translation Errors

### 1. Invalid Suite/Test Name (Slug Generation Failure)

**Error pattern**: `"Invalid suiteName: '...'"`

**Cause**: Suite or test name contains no alphanumeric characters, preventing slug generation. This is NOT caught by schema validation because the schema only checks that the field exists and is a string, not the content.

**What to report**: The `suiteName` or `testName` needs to contain at least one letter (a-z) or number (0-9) to generate a valid slug.

### 2. Translation Script Crash

**Error pattern**: Runtime errors, stack traces, unhandled exceptions

**Cause**: The translation script encountered an edge case, unexpected data format, or bug that causes it to crash during execution.

**What to report**: Include the full error message and stack trace. Identify which step or field caused the crash if possible. This may require the main agent to report the issue to the user rather than attempting to fix the JSON.

## Diagnostic Decision Tree

```
Translation script fails
  → Read error message
    → "Invalid suiteName" or slug error → Check name fields
      → Name has no alphanumerics → Report that name needs letters/numbers
    → Runtime error / stack trace → Identify crash location
      → Can identify problematic step/field? → Report which part of JSON triggered crash
      → Cannot identify cause? → Report full error to user for investigation
    → Other errors → Analyze error message for patterns and try to determine root cause
      → File/path related? → Report likely file I/O or permission issue
      → Template/rendering related? → Report likely template processing issue
      → Data format related? → Report which data format is unexpected and why  
```

## Example

**Error message:**
```
Invalid suiteName: "---". Name must contain at least one alphanumeric character (a-z or 0-9).
```

**Diagnosis:**
```
**Error type**: slug generation
**Specific issue**: suiteName "---" contains no letters or numbers, preventing slug generation
**Suggested fix**: Change suiteName to descriptive text like "Form validation tests"
```

## NEVER Do

- **NEVER suggest multiple changes at once** — Report one diagnosis following the required output format
- **NEVER make fixes directly** — Report what needs to change so the main agent can apply it
- **NEVER suggest changes outside the JSON plan** — The fix must be in the plan structure, not in how translation works
- **NEVER diagnose schema validation errors** — Those are handled by the diagnose-schema-errors subagent

## Important Notes

- Translation errors happen AFTER schema validation passes, so the JSON structure is already valid
- Most translation errors are runtime issues (slug generation, edge cases, script bugs) not structural JSON problems
