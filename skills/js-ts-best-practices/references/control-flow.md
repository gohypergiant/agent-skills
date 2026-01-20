# 1.3 Control Flow

Use simple, flat control flow. Prefer early returns over nested conditionals.

**❌ Incorrect: nested structure**
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

**✅ Correct: early returns**
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

Use block style for early control flow returns instead of inline.

**❌ Incorrect: inline**
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
