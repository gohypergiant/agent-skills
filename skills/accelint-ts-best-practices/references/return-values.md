# 1.5 Return Zero Values Instead of Null/Undefined

Return **zero values** ([], {}, '', 0) instead of `null`/`undefined`. This eliminates defensive null checks and enables method chaining.

## Zero Values by Type

| Type | Zero Value | Why |
|------|-----------|-----|
| Array | `[]` | Allows `.map()`, `.filter()`, `.length` without checks |
| Object | `{}` | Allows property access, spread operator without checks |
| String | `''` | Allows `.length`, `.split()`, template literals without checks |
| Number | `0` | Allows arithmetic operations without checks |

**The cascade effect**: One function returning `null` creates landmines for all callers.

**Before** (null-based) - 4 null checks required:
```ts
function getUsers() {
  if (!cache.has('users')) return null;
  return cache.get('users');
}

function getActiveUsers() {
  const users = getUsers();
  if (!users) return null;  // Check #1
  return users.filter(u => u.active);
}

function getUserNames() {
  const active = getActiveUsers();
  if (!active) return null;  // Check #2
  return active.map(u => u.name);
}

const names = getUserNames();
if (!names) {  // Check #3
  console.log('No names');
} else {
  console.log(names.join(', '));  // Check #4 (implicit in else)
}
```

**After** (zero value) - 0 null checks required:
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

console.log(getUserNames().join(', '));  // Composable, no checks
```

**Production lesson**: A codebase audit found 237 null checks that could be eliminated by changing 8 functions to return zero values. This is the multiplier effect—one `return null` at the root propagates to dozens of defensive checks downstream.
