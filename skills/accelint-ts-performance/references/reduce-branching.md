# 4.1 Reduce Branching

## Issues

- Excessive nested conditionals (>3 levels)
- Switch statements that could be lookup tables
- Repeated condition checks in same scope
- Polymorphic branching on hot paths
- Type guards that could be avoided

## Optimizations

- Convert switch/if-chains to object/Map lookups
- Hoist invariant conditions
- Use early returns to reduce nesting
- Replace runtime type checks with compile-time guarantees

## Examples

### Switch to Lookup Table

**❌ Incorrect: conditional checks**
```ts
if (thing === 'ONE') {
  /*...*/
}

if (thing === 'TWO') {
  /*...*/
}

if (thing === 'THREE') {
  /*...*/
}
```

**✅ Correct: lookup table**
```ts
const lookup = {
  ONE: {/*...*/},
  TWO: {/*...*/},
  THREE: {/*...*/},
}

const action = lookup[thing];
```

### Nested Conditionals to Early Returns

**❌ Incorrect: excessive nesting**
```ts
function process(data) {
  if (data) {
    if (data.isValid) {
      if (data.user) {
        if (data.user.hasPermission) {
          return doWork(data);
        }
      }
    }
  }
  return null;
}
```

**✅ Correct: early returns**
```ts
function process(data) {
  if (!data) return null;
  if (!data.isValid) return null;
  if (!data.user) return null;
  if (!data.user.hasPermission) return null;

  return doWork(data);
}
```

### Hoist Invariant Conditions

**❌ Incorrect: repeated checks**
```ts
for (const item of items) {
  if (config.enableFeature && item.active) {
    process(item);
  }
}
```

**✅ Correct: hoist invariant**
```ts
if (config.enableFeature) {
  for (const item of items) {
    if (item.active) {
      process(item);
    }
  }
}
```

### Runtime Type Checks to Compile-Time

**❌ Incorrect: runtime branching**
```ts
function format(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  } else {
    return value.toFixed(2);
  }
}
```

**✅ Correct: separate functions**
```ts
function formatString(value: string): string {
  return value.toUpperCase();
}

function formatNumber(value: number): string {
  return value.toFixed(2);
}
```
