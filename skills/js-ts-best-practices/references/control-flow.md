# 1.3 Control Flow

## Block Style for Control Flow

Always use block syntax `{ }` for control flow statements, even single-line returns. This prevents subtle bugs when adding code later and maintains visual consistency.

**❌ Incorrect: inline style**
```ts
if (!condition1) return /* something1 */;
if (!condition2) return /* something2 */;
if (!condition3) return /* something3 */;
```

**✅ Correct: block style**
```ts
if (!condition1) {
  return /* something1 */;
}

if (!condition2) {
  return /* something2 */;
}

if (!condition3) {
  return /* something3 */;
}

return /* something4 */;
```

**Why this matters**:

1. **Prevents bugs during modification**: Adding a second statement to an inline conditional without adding braces silently breaks control flow:
```ts
// Dangerous inline style
if (!isValid) return;
logError(error);  // Always executes! (This is the bug)

// Safe block style - bug would be obvious
if (!isValid) {
  return;
  logError(error);  // Unreachable code warning
}
```

2. **Visual scanability**: Blocks create clear vertical alignment, making the guard clause pattern immediately recognizable. Inline returns blend into the code and are easy to miss.

## Early Returns for Guard Clauses

Invert conditions and return early rather than nesting. This reduces rightward drift and makes the "happy path" obvious.

**❌ Incorrect: nested structure (3+ levels)**
```ts
if (condition1) {
  if (condition2) {
    if (condition3) {
      result = /* something4 */;
    } else {
      result = /* something3 */;
    }
  } else {
    result = /* something2 */;
  }
} else {
  result = /* something1 */;
}
```

**✅ Correct: early returns (flat structure)**
```ts
if (!condition1) {
  return /* something1 */;
}

if (!condition2) {
  return /* something2 */;
}

if (!condition3) {
  return /* something3 */;
}

return /* something4 */;
```

**Why this matters**: Nested conditionals hide the success path at the deepest level. Early returns make error handling peripheral and the main logic prominent. The final return statement is always the "happy path."
