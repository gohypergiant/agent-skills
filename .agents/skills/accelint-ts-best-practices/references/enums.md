# 2.2 Avoid `enum` - Use `as const` Instead

Never use TypeScript's `enum` keyword. Use `as const` objects instead. This prevents extra JavaScript code generation and provides better type inference.

**❌ Incorrect: enum generates runtime code**
```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
}

// TypeScript compiles this to JavaScript:
var Direction;
(function (Direction) {
    Direction["Up"] = "UP";
    Direction["Down"] = "DOWN";
})(Direction || (Direction = {}));
// Adds ~5 lines of runtime code per enum
```

**✅ Correct: `as const` is zero-cost**
```ts
const Direction = {
  Up: 'UP',
  Down: 'DOWN',
} as const;

type Direction = (typeof Direction)[keyof typeof Direction];  // 'UP' | 'DOWN'

// TypeScript compiles to:
const Direction = {
  Up: 'UP',
  Down: 'DOWN',
};
// No extra runtime code
```

**Why `as const` is better**:

1. **Zero runtime cost**: `as const` objects are plain JavaScript objects. No generated IIFE wrapper or reverse mapping code. `enum` adds 5+ lines of runtime JavaScript per enum.

2. **Better type inference**: `as const` infers the **narrowest literal type**:
```ts
const x = Direction.Up;  // Type: 'UP' (literal)

// vs enum:
enum DirectionEnum { Up = "UP" }
const y = DirectionEnum.Up;  // Type: DirectionEnum.Up (enum member, wider)
```

3. **Works with tree-shaking**: Dead code elimination can remove unused `as const` properties. `enum` generates a closure that bundlers can't tree-shake.

4. **No reverse mapping confusion**: Numeric `enum`s create reverse mappings:
```ts
enum NumericEnum { A = 0, B = 1 }
NumericEnum[0]  // "A" - unexpected reverse lookup
```
`as const` objects don't have this footgun.

5. **Easier to extend**: You can spread `as const` objects:
```ts
const Base = { A: 'a', B: 'b' } as const;
const Extended = { ...Base, C: 'c' } as const;
```

## Extracting the Union Type

```ts
const Status = {
  Pending: 'pending',
  Active: 'active',
  Complete: 'complete',
} as const;

// Extract union type from values
type Status = (typeof Status)[keyof typeof Status];
// Result: 'pending' | 'active' | 'complete'

function setStatus(status: Status) {
  // Only accepts 'pending' | 'active' | 'complete'
}

setStatus(Status.Active);  // ✅
setStatus('active');       // ✅
setStatus('invalid');      // ❌ TypeScript error
```
