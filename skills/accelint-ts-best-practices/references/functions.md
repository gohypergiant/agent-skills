# 1.2 Functions

- Keep functions under 50 lines
- Limit parameters; prefer simple return types
- Avoid default parameters; make all values explicit at call site
- Always explicitly type function return values in the function signature
- Use `function` keyword for pure functions
- Use arrow functions only for simple cases (< 3 instructions)

**❌ Incorrect: implicit defaults**
```ts
const position = getPosition();
```

**✅ Correct: explicit values**
```ts
const position = getPosition(330);
```

**Why this matters**:

1. **Call-site clarity**: Reading `getPosition()` gives no hint about what the default is. Reading `getPosition(330)` shows the exact value being used at this specific call site.

2. **Prevents hidden bugs**: Default parameters hide changes. If you change the default from 0 to 330, all existing calls silently change behavior. Explicit values make the change visible in diffs.

3. **Easier refactoring**: Finding all usages of a default value is hard ("where is 0 used?"). Finding all explicit `330` values is trivial with search.

4. **Forces intentional choices**: Requiring explicit values makes developers think about what value is appropriate for each call site rather than accepting a generic default.

**❌ Incorrect: missing return type annotation**
```ts
function getUser(id: string) {
  return users.find(u => u.id === id);
}

const processData = (input: unknown) => {
  return JSON.parse(input);
};
```

**✅ Correct: explicit return type annotation**
```ts
function getUser(id: string): User | undefined {
  return users.find(u => u.id === id);
}

const processData = (input: unknown): Record<string, unknown> => {
  return JSON.parse(input);
};
```

**Why this matters**:

1. **Catches refactoring errors**: If you change function implementation and accidentally change the return type, TypeScript catches it immediately. Without explicit return types, the type silently changes and breaks callers downstream.

2. **Documents intent**: Explicit return type `User | undefined` signals "this function might not find a user." Inferred types might be correct now, but could become `any` after a careless refactor.

3. **Prevents type widening**: TypeScript's inference can widen types unexpectedly. `return {}` infers `{}` (accepts any object) instead of your intended specific type. Explicit types prevent this footgun.

4. **Better IDE support**: Explicit return types enable better autocomplete and error detection at call sites. IDEs don't have to infer through the entire function body to understand what the function returns.

5. **Faster compilation**: TypeScript doesn't need to analyze function bodies to determine return types, speeding up type checking in large codebases
