# 2.1 Avoid `any` Type

NEVER use `any` - use `unknown` to force validation or `<T>` generics to preserve types.

**The propagation trap** (most developers don't realize this):
```ts
// One any at an API boundary...
const apiResponse: any = await fetch('/user').then(r => r.json());

// ...infects the entire feature module:
const user = apiResponse.data;        // user is any
const name = user.name;               // name is any
const upper = name.toUpperCase();     // upper is any
const initials = upper.split(' ');    // initials is any
// 50+ variables now have no type checking
```

**Why this matters**: One `any` at a system boundary can disable type checking for 100+ downstream variables across multiple files. When the API changes a field from `string` to `number` 18 months later, TypeScript catches **zero errors**.

**Production lesson**: A third-party API integration typed as `any` led to a silent runtime failure when the API changed. TypeScript caught 0 of 127 affected variables. Cost: 2 days of debugging. Fix: 10 minutes to write a schema with `unknown`.

**❌ Incorrect: `any` at boundary spreads infection**
```ts
function parse(input: any): any {
  return JSON.parse(input);
}
```

**✅ Correct: `unknown` forces validation at boundary**
```ts
function parseUser(input: unknown): User {
  if (typeof input !== 'string') throw new Error('Input must be string');
  const parsed = JSON.parse(input);
  return UserSchema.parse(parsed); // Validate against schema
}
```

**✅ Correct: generics preserve types**
```ts
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const num = first([1, 2, 3]);  // num is number | undefined (type preserved)
```

## Quick Reference: Alternatives to `any`

| Scenario | Use | Why |
|----------|-----|-----|
| Unknown JSON input | `unknown` | Forces validation before use |
| Flexible function arg | Generics `<T>` | Preserves type information |
| Third-party lib no types | `unknown` + schema validation | Explicit unsafe boundary |
| "Too hard to type" | `Record<string, unknown>` | At least validates it's an object |
