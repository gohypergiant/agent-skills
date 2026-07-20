# 2.1 Avoid `any` Type

Never use `any` type. It disables TypeScript's type checking and defeats the entire purpose of using TypeScript. Use `unknown` for truly unknown types or generics for flexible type-safe functions.

**❌ Incorrect: `any` disables type safety**
```ts
function parse(input: any): any {
  return JSON.parse(input);
}

const result = parse('{"name":"Alice"}');
result.nonExistentProperty; // No error! Bug lurking.
```

**✅ Correct: `unknown` forces type validation**
```ts
function parseUser(input: unknown): User {
  if (typeof input !== 'string') {
    throw new Error('Input must be string');
  }
  const parsed = JSON.parse(input);
  // Validate parsed matches User schema here
  return parsed as User;
}

const result = parseUser('{"name":"Alice"}');
result.nonExistentProperty; // TypeScript error!
```

**Why `any` is dangerous**:

1. **Disables all type checking**: `any` opts out of TypeScript. You lose autocomplete, refactoring safety, and error detection.

2. **Propagates through codebase**: `any` is infectious. Once introduced, it spreads to every variable that touches it:
```ts
const x: any = getValue();
const y = x.foo;     // y is any
const z = y.bar();   // z is any
// Entire call chain loses type safety
```

3. **Hides bugs at compile time**: TypeScript won't catch typos, incorrect property access, or wrong function calls on `any` types.

## When You Think You Need `any`

| Scenario | Instead Use | Why |
|----------|-------------|-----|
| Unknown JSON input | `unknown` | Forces validation before use |
| Flexible function arg | Generics `<T>` | Preserves type through function |
| Third-party lib with no types | `unknown` or `@ts-expect-error` | Explicit about unsafe boundary |
| "Too hard to type" | `Record<string, unknown>` | At least validates it's an object |

**✅ Correct: generics preserve type information**
```ts
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const nums = [1, 2, 3];
const num = first(nums);  // num is inferred as number | undefined

const strs = ['a', 'b'];
const str = first(strs);  // str is inferred as string | undefined
```

**Why generics are better**: The return type tracks the input type. TypeScript knows `num` is a number and `str` is a string, enabling type-safe operations downstream.
