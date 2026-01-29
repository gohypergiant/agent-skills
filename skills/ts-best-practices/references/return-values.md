# 1.5 Return Zero Values Instead of Null/Undefined

Always return a **zero value** (identity element) instead of `null` or `undefined`. This eliminates defensive null checks throughout the codebase and allows method chaining without interruption.

## Zero Values by Type

| Type | Zero Value | Why |
|------|-----------|-----|
| Array | `[]` | Allows `.map()`, `.filter()`, `.length` without checks |
| Object | `{}` | Allows property access, spread operator without checks |
| String | `''` | Allows `.length`, `.split()`, template literals without checks |
| Number | `0` | Allows arithmetic operations without checks |
| Boolean | `false` | Already non-nullable |

**❌ Incorrect: returns null/undefined, requires downstream checks**
```ts
function makeList(someVar) {
  if (!someVar) return;  // Returns undefined
  return toList(someVar);
}

function anotherFn() {
  const baseList = makeList(/*...*/);
  if (!Array.isArray(baseList)) return;  // Defensive check required
  return baseList.map((x) => {/*...*/});
}
```

**✅ Correct: returns zero value, no checks needed**
```ts
function makeList(someVar) {
  if (!someVar) return [];  // Returns empty array
  return toList(someVar);
}

function anotherFn() {
  return makeList(/*...*/).map((x) => {/*...*/});  // No check required
}
```

**Why this matters**:

1. **Eliminates defensive programming**: Every `null`/`undefined` return creates a landmine that forces all callers to add checks. One function returning `null` can cascade into dozens of null checks.

2. **Enables method chaining**: Zero values support the same operations as non-empty values:
```ts
// Works with empty array just like full array
[].map(fn).filter(pred).reduce(reducer, init)
```

3. **Reduces bug surface**: Forgetting a null check causes runtime errors. Zero values are safe by default.

4. **Aligns with monadic patterns**: Zero values act as identity elements in functional composition. Empty arrays behave correctly in `flatMap`, `reduce`, etc.

## Real-World Impact

**Before** (null-based):
```ts
function getUsers() {
  if (!cache.has('users')) return null;
  return cache.get('users');
}

function getActiveUsers() {
  const users = getUsers();
  if (!users) return null;
  return users.filter(u => u.active);
}

function getUserNames() {
  const active = getActiveUsers();
  if (!active) return null;
  return active.map(u => u.name);
}

// Caller
const names = getUserNames();
if (!names) {
  console.log('No names');
} else {
  console.log(names.join(', '));
}
```

**After** (zero value):
```ts
function getUsers() {
  if (!cache.has('users')) return [];
  return cache.get('users');
}

function getActiveUsers() {
  return getUsers().filter(u => u.active);
}

function getUserNames() {
  return getActiveUsers().map(u => u.name);
}

// Caller
console.log(getUserNames().join(', '));  // No checks needed
```

The zero-value version eliminates 4 null checks and makes the code linear and composable.
