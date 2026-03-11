# 2.2 Avoid `enum` - Use `as const` Instead

NEVER use `enum` keyword - generates 5+ lines of runtime code that breaks tree-shaking.

**Production lesson**: A codebase with 50 enums added **8KB of dead code** that couldn't be tree-shaken. Switching to `as const` reduced bundle size by 8KB (3% reduction) with zero logic changes. Enums also break when imported across certain module boundaries in dual ESM/CommonJS packages.

**The enum surprise** - one 2-line enum becomes 5+ lines of runtime code:
```ts
enum Status { Active = "active", Inactive = "inactive" }

// Compiles to:
var Status;
(function (Status) {
    Status["Active"] = "active";
    Status["Inactive"] = "inactive";
})(Status || (Status = {}));
// Even if you only use Status.Active, you get ALL of this code
```

**❌ Incorrect: enum generates runtime code**
```ts
enum Direction { Up = "UP", Down = "DOWN" }
```

**✅ Correct: `as const` is zero-cost**
```ts
const Direction = { Up: 'UP', Down: 'DOWN' } as const;
type Direction = (typeof Direction)[keyof typeof Direction];  // 'UP' | 'DOWN'

// Compiles to plain object - tree-shakeable, zero overhead
```

**Key advantages**:
1. **Zero runtime cost** - no IIFE wrapper, no reverse mapping
2. **Tree-shakeable** - unused properties can be eliminated
3. **Narrower types** - `'UP'` literal vs `Direction.Up` enum member
4. **No numeric enum footguns** - `enum Num { A = 0 }` creates `Num[0] === "A"` reverse lookup
5. **Composable** - can spread: `{ ...Base, C: 'c' } as const`

## Pattern: Extract Union Type from Values

```ts
const Status = { Pending: 'pending', Active: 'active', Complete: 'complete' } as const;
type Status = (typeof Status)[keyof typeof Status];  // 'pending' | 'active' | 'complete'

function setStatus(status: Status) { /* ... */ }
setStatus(Status.Active);  // ✅  setStatus('active');  // ✅  setStatus('invalid');  // ❌ TypeScript error
```
