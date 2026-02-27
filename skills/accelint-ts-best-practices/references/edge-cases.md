# Non-Obvious Edge Cases

Expert knowledge: TypeScript traps that catch even experienced developers. These aren't obvious from documentation—they're learned from production bugs.

## The Empty Array Return Type Trap

**The problem**: TypeScript doesn't catch `array[0]` potentially returning `undefined`.

```ts
// Looks type-safe but has a runtime bug
function getFirst<T>(arr: T[]): T {
  return arr[0];  // Returns undefined for empty array, violates return type!
}

const items: string[] = [];
const first = getFirst(items);  // first is typed as string, but actually undefined
first.toUpperCase();  // Runtime error: Cannot read property 'toUpperCase' of undefined
```

**Why TypeScript doesn't catch this**: The type system assumes arrays are non-empty. `T[]` doesn't distinguish between `[]` and `['item']`. This is a known soundness hole in TypeScript's type system.

**✅ Correct: explicit handling of empty array case**
```ts
function getFirst<T>(arr: T[], defaultValue: T): T {
  return arr[0] ?? defaultValue;
}

// OR return union type
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

**Production lesson**: Thousands of production bugs stem from this gap. Always handle `array[0]`, `array.find()`, `array.pop()` potentially returning `undefined`, even if TypeScript doesn't require it.

---

## The Object.keys() Type Widening

**The problem**: `Object.keys()` returns `string[]`, not `(keyof T)[]`, even though you know the keys.

```ts
type User = { name: string; age: number };

function printFields(user: User): void {
  Object.keys(user).forEach((key) => {
    // TypeScript error: Element implicitly has an 'any' type because
    // expression of type 'string' can't be used to index type 'User'
    console.log(user[key]);
  });
}
```

**Why this happens**: TypeScript conservatively types `Object.keys()` as `string[]` because objects can have additional properties at runtime (via prototypes or dynamic assignment). It's protecting you from runtime errors.

**❌ Wrong fix: casting (unsafe)**
```ts
(Object.keys(user) as (keyof User)[]).forEach((key) => {
  console.log(user[key]); // Compiles but unsafe if object has extra properties
});
```

**✅ Correct: explicit key iteration with type guard**
```ts
const knownKeys: (keyof User)[] = ['name', 'age'];

knownKeys.forEach((key) => {
  console.log(user[key]); // Type-safe
});

// OR helper function with runtime validation
function getTypedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
  // Accept the unsoundness only in this one function, with clear documentation
}
```

**When to use each**:
- **Known keys list**: Use when you control the type and know all keys
- **Helper function**: Use when iterating dynamic objects and you're willing to accept the unsoundness

---

## The Async Function Error Swallowing

**The problem**: Unhandled promise rejections in async functions called from non-async contexts are silently swallowed.

```ts
// Looks safe but errors disappear
function setupEventHandler() {
  button.addEventListener('click', async () => {
    await riskyOperation(); // If this throws, error is silently swallowed!
  });
}
```

**Why this happens**: The `async` arrow function returns a `Promise`, but since `addEventListener` doesn't await it, rejected promises have nowhere to go. Node.js and browsers log unhandled rejections to console, but your error handling logic never runs.

**✅ Correct: explicit error handling in async event handlers**
```ts
function setupEventHandler() {
  button.addEventListener('click', () => {
    handleClickAsync().catch((error) => {
      logError(error);
      showUserError('Operation failed');
    });
  });
}

async function handleClickAsync(): Promise<void> {
  await riskyOperation();
}
```

**Production pattern**: Never pass `async` functions directly to callbacks that don't await them. Always wrap in a synchronous function that handles promise rejection.

---

## The Number.MAX_SAFE_INTEGER Boundary

**The problem**: JavaScript loses precision above `Number.MAX_SAFE_INTEGER` (2^53 - 1).

```ts
const id = 9007199254740993; // 2^53 + 1
console.log(id === id + 1); // true (!!)

// Common in API responses with large IDs
type Tweet = {
  id: number;  // Twitter IDs exceed MAX_SAFE_INTEGER
  text: string;
};

const tweet: Tweet = await api.getTweet();
console.log(tweet.id);  // Incorrect value due to precision loss
```

**Why this matters**: Database IDs, timestamps in microseconds, and large integers from external APIs commonly exceed this limit. Precision loss leads to duplicate keys, incorrect comparisons, and data corruption.

**✅ Correct: use string or BigInt for large integers**
```ts
type Tweet = {
  id: string;  // Safe for all integer values
  text: string;
};

// OR use BigInt for arithmetic
type Transaction = {
  id: bigint;
  amount: bigint;  // For precise financial calculations
};

const tx: Transaction = {
  id: 9007199254740993n,
  amount: 100n,
};
```

**When to use each**:
- **string**: When ID is opaque (no arithmetic needed). Preferred for API IDs.
- **bigint**: When you need arithmetic operations (sums, comparisons). Required for financial calculations.

**Runtime check**:
```ts
function assertSafeInteger(n: number, label: string): void {
  if (!Number.isSafeInteger(n)) {
    throw new Error(`${label} ${n} exceeds MAX_SAFE_INTEGER - use string or BigInt`);
  }
}
```

---

## The Partial<T> Footgun

**The problem**: `Partial<T>` makes all properties optional, but doesn't validate that at least one property exists.

```ts
type User = { name: string; age: number };
type UserUpdate = Partial<User>;

function updateUser(id: string, update: UserUpdate): void {
  // TypeScript allows this even though it's meaningless:
  updateUser('123', {});  // No fields to update!
}
```

**Why this matters**: Empty update objects are logic bugs—they succeed but do nothing. This causes silent failures in production where "update" operations appear successful but change nothing.

**✅ Correct: require at least one property**
```ts
// Require at least one property to be present
type AtLeastOne<T> = {
  [K in keyof T]: Pick<T, K> & Partial<Omit<T, K>>;
}[keyof T];

type UserUpdate = AtLeastOne<User>;

// Now this is a compile error:
updateUser('123', {});  // ❌ Type '{}' is not assignable to type 'UserUpdate'

// These work:
updateUser('123', { name: 'Alice' });          // ✅
updateUser('123', { name: 'Bob', age: 30 });   // ✅
```

**Production pattern**: For update/patch operations, use `AtLeastOne<T>` instead of `Partial<T>` to catch meaningless empty updates at compile time.

---

## The setTimeout Return Type in Node.js vs Browser

**The problem**: `setTimeout` returns different types in Node.js vs browsers, causing type errors in universal code.

```ts
// In browser: setTimeout returns number
const timerId: number = setTimeout(() => {}, 1000);  // ✅ in browser

// In Node.js: setTimeout returns NodeJS.Timeout object
const timerId: number = setTimeout(() => {}, 1000);  // ❌ in Node.js
```

**Why this matters**: Code that works in browser breaks in Node.js (or vice versa). This is especially painful for libraries that run in both environments.

**✅ Correct: use ReturnType for universal code**
```ts
let timerId: ReturnType<typeof setTimeout> | null = null;

function scheduleTask(): void {
  timerId = setTimeout(() => {
    console.log('Task executed');
  }, 1000);
}

function cancelTask(): void {
  if (timerId !== null) {
    clearTimeout(timerId);  // Works in both environments
    timerId = null;
  }
}
```

**Production pattern**: Always use `ReturnType<typeof setTimeout>` for timer IDs in universal code. Never hardcode `number` or `NodeJS.Timeout`.

---

## The Array.sort() Mutates In-Place

**The problem**: Developers expect `array.sort()` to return a new array (like `map`/`filter`), but it mutates the original.

```ts
const numbers = [3, 1, 2];
const sorted = numbers.sort();  // sorted is [1, 2, 3]

console.log(numbers);  // [1, 2, 3] - original array was mutated!
```

**Why this matters**: Violates immutability principles and causes bugs when you expect the original array to remain unchanged. Especially problematic in React where mutating state leads to missed re-renders.

**✅ Correct: copy then sort**
```ts
const numbers = [3, 1, 2];
const sorted = [...numbers].sort();  // or numbers.slice().sort()

console.log(numbers);  // [3, 1, 2] - original unchanged
console.log(sorted);   // [1, 2, 3]
```

**TypeScript doesn't help**: Both patterns compile. You must remember that `sort()`, `reverse()`, and `splice()` mutate in place, while `map()`, `filter()`, `concat()`, and `slice()` return new arrays.

---

## Quick Reference: Common TypeScript Soundness Holes

TypeScript's type system intentionally includes soundness holes for pragmatism. Know these to avoid bugs:

| Operation | What TypeScript Claims | Runtime Reality | Fix |
|-----------|------------------------|-----------------|-----|
| `arr[0]` | Returns `T` | May return `undefined` | Use `arr[0] ?? default` or return `T \| undefined` |
| `Object.keys(obj)` | Should be `(keyof T)[]` | Returns `string[]` | Use explicit key array or accept unsoundness |
| `as T` | Value is type `T` | Could be anything | Only use at trust boundaries with runtime validation |
| `obj.prop` | Property exists | May be `undefined` if optional | Use `obj.prop?.` optional chaining |
| `JSON.parse()` | Returns `any` | Type unknown | Cast to `unknown` then validate with schema |

**Production rule**: Treat these operations as unsafe and add explicit validation/handling, even when TypeScript doesn't require it.
