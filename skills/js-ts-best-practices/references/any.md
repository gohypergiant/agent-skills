# 2.1 Any

## Overview

Avoid `any` type and always provide correct return types. Use `unknown` for truly unknown types or generics for flexible type-safe functions.

## Examples

**❌ Incorrect: `any` type for input and return type**
```ts
function parse(input: any): any {
  return /*...*/;
}
```

**✅ Correct: `unknown` for truly unknown types**
```ts
function parseUser(input: unknown): User {
  return /*...*/;
}
```

**✅ Correct: generics for flexible types**
```ts
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```
