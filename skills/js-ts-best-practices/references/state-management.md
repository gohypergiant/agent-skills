# 1.4 State Management

## Prefer const Over let

Use `const` for all declarations unless the variable genuinely needs reassignment. Use `let` only when mutation provides measurable performance benefits in hot paths.

**❌ Incorrect: unnecessary let with reassignment**
```ts
let color = src.substring(start + 1, end - 1);
color = color.replace(/\s/g, '');
```

**✅ Correct: single assignment with const**
```ts
const color = src.substring(start + 1, end - 1).replace(/\s/g, '');
```

**Why this matters**: `const` signals immutability at the binding level. Readers know the identifier won't be reassigned, reducing cognitive load. It doesn't prevent object mutation (use `Object.freeze()` for that), but eliminates entire classes of bugs from variable shadowing and temporal dead zones.

**❌ Incorrect: conditional with let and delayed assignment**
```ts
let result;
if (validation.success) {
  result = primary.data.options.map(addIndex);
} else {
  result = fallback.data.options.map(addIndex);
}
```

**✅ Correct: ternary with const and immediate assignment**
```ts
const config = validation.success ? primary : fallback;
const result = config.data.options.map(addIndex);
```

**Why this matters**: Delayed assignment with `let` creates a temporal dead zone where `result` is `undefined`. This pattern also duplicates `.map(addIndex)`. By extracting the conditional to `config`, we eliminate duplication and ensure `result` is always defined.

## Never Mutate Function Parameters

Function parameters should be treated as read-only. Mutation creates hidden side effects that violate the principle of least surprise.

**❌ Incorrect: mutates parameter**
```ts
function addDefaults(options) {
  options.timeout = options.timeout ?? 5000;
  options.retries = options.retries ?? 3;
  return options;
}

const config = { timeout: 1000 };
const result = addDefaults(config);
// config is now mutated! { timeout: 1000, retries: 3 }
```

**✅ Correct: returns new object**
```ts
function addDefaults(options) {
  return {
    timeout: 5000,
    retries: 3,
    ...options,
  };
}

const config = { timeout: 1000 };
const result = addDefaults(config);
// config is unchanged: { timeout: 1000 }
// result has defaults: { timeout: 1000, retries: 3 }
```

**Why this matters**: Mutation creates action-at-a-distance. The caller doesn't expect their object to change. This breaks pure function principles and makes code difficult to reason about, especially in async contexts where mutation can cause race conditions.

## Keep Leaf Functions Pure

Centralize state manipulation in parent/orchestrator functions. Leaf functions (bottom of the call stack) should be pure: same inputs always produce same outputs, no side effects.

**❌ Incorrect: leaf function mutates external state**
```ts
let totalPrice = 0;

function calculatePrice(items) {
  for (const item of items) {
    totalPrice += item.price;  // Side effect!
  }
}
```

**✅ Correct: pure leaf function returns value**
```ts
function calculatePrice(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

let totalPrice = calculatePrice(items);  // Parent manages state
```

**Why this matters**: Pure functions are:
- **Testable**: No mocking required, inputs → outputs
- **Cacheable**: Same inputs always give same output (memoization)
- **Parallelizable**: No shared state means no race conditions
- **Debuggable**: No hidden dependencies on external state
