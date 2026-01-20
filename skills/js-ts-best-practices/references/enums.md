# 2.2 Enums

Avoid `enum` and utilize `as const` structs instead. This prevents extra JavaScript code and forces TypeScript to infer the narrowest possible literal types for the object's properties.

**❌ Incorrect: enum utilized**
```ts
enum Direction {
  up = "UP",
  down = "DOWN",
}
```

**✅ Correct: struct with `as const`**
```ts
const Direction = {
  up: 'UP',
  down: 'DOWN',
} as const;

type DirectionLookup = (typeof Direction)[keyof typeof Direction];
```
