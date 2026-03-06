# 1.3 Control Flow

## Block Style for Control Flow - ALWAYS Use `{ }`

Always use block syntax `{ }`, even for single-line statements. **Why**: Prevents the silent modification bug.

**The silent modification bug** (caught by block style):
```ts
// Inline style - bug is silent
if (!isValid) return;
logError(error);  // BUG: Always executes! Looks like it's in the if-block but isn't

// Block style - bug causes compile error
if (!isValid) {
  return;
  logError(error);  // ✅ Unreachable code warning - bug is caught
}
```

**Production lesson**: A production bug was introduced when a developer added logging to an inline `if` statement without adding braces. The log statement executed unconditionally, logging sensitive data to the console even when validation passed. Block style would have prevented this—either the developer would have added braces, or the unreachable code warning would have caught the mistake.

**❌ Incorrect: inline style**
```ts
if (!condition1) return;
if (!condition2) return;
```

**✅ Correct: block style**
```ts
if (!condition1) {
  return;
}

if (!condition2) {
  return;
}
```

## Early Returns for Guard Clauses

Use early returns to keep code flat. Nested conditionals bury the success path 3+ levels deep.

**❌ Incorrect: nested (success path buried)**
```ts
if (condition1) {
  if (condition2) {
    if (condition3) {
      return success;  // Success path is 3 levels deep
    }
  }
}
```

**✅ Correct: early returns (success path prominent)**
```ts
if (!condition1) return;
if (!condition2) return;
if (!condition3) return;
return success;  // Success path is always the final return
```
