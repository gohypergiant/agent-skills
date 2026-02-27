# 1.2 Functions

- Keep functions under 50 lines
- Avoid default parameters; make all values explicit at call site
- Always explicitly type function return values
- Use `function` keyword for pure functions; arrow functions only for simple cases (< 3 instructions)

## Avoid Default Parameters

**❌ Incorrect: hidden default**
```ts
function getPosition(offset = 0) { /* ... */ }
const pos = getPosition();  // What's the offset? Must read function definition
```

**✅ Correct: explicit value at call site**
```ts
function getPosition(offset: number) { /* ... */ }
const pos = getPosition(0);  // Offset is 0 - visible in code
```

**The hidden change bug**: If you change the default from `0` to `330`, all existing calls silently change behavior with no diff at call sites. Explicit values make changes visible:

```ts
// Before: getPosition(0) in 47 places
// After: getPosition(330) in 47 places - every change is visible in git diff
```

**Production lesson**: A default timeout changed from 5000ms to 30000ms for "better UX." 200+ call sites silently inherited the new timeout, causing test timeouts and slower user experience. With explicit values, the change would have been visible and reviewed case-by-case.

## Explicit Return Type Annotations

**❌ Incorrect: inferred return type**
```ts
function getUser(id: string) {
  return users.find(u => u.id === id);
}
```

**✅ Correct: explicit return type**
```ts
function getUser(id: string): User | undefined {
  return users.find(u => u.id === id);
}
```

**The type widening trap**: `return {}` infers `{}` (accepts any object with any properties) instead of your intended specific type. Explicit types prevent this footgun.

**The silent breaking change**: Without explicit return types, changing implementation can silently change return type:
```ts
// Before: returns User | undefined
function getUser(id: string) {
  return users.find(u => u.id === id);
}

// After refactor: returns User | undefined | null (breaking change!)
function getUser(id: string) {
  const user = users.find(u => u.id === id);
  return user ?? null;  // Accidentally introduced null
}
// TypeScript doesn't complain - callers break at runtime
```

With explicit return type `User | undefined`, TypeScript catches the `null` as a type error.
