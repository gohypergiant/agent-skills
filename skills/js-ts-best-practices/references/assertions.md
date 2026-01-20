# 3.2 Assertions

Assertions detect programmer errors. The only appropriate response to corrupted code is to crash.

```ts
function assert(condition: boolean, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
```

Split compound assertions for clarity.

**❌ Incorrect: compound assertion**
```ts
assert(a && b);
```

**✅ Correct: split assertion**
```ts
assert(a);
assert(b);
```

Include variable values in assertion messages.

**❌ Incorrect: variable value not included**
```ts
assert(index < items.length, 'Index error');
```

**✅ Correct: variable value included**
```ts
assert(
  index < items.length,
  `Index out of bounds: index=${index}, items.length=${items.length}`
);
```
