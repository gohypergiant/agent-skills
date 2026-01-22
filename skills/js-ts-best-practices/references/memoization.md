# 4.3 Memoization and Redundant Calculations

## Issues

- Loop-invariant code inside loops
- Repeated function calls with same arguments
- Constant expressions computed at runtime
- Expensive operations that could be memoized
- Trivial operations being memoized unnecessarily

## Optimizations

- Hoist loop-invariant code
- Precompute constants at module load
- Memoize pure functions with limited input domain
- Cache results of expensive operations
- Avoid memoizing trivial computations

## Examples

### Avoid Trivial Memoization

**❌ Incorrect: trivial computation**
```ts
const ternMemo = memoize((pred) => pred ? 'Right!' : 'Wrong');
```

**✅ Correct: direct computation**
```ts
const result = test ? 'Right!' : 'Wrong';
```

### Hoist Loop-Invariant Calculations

**❌ Incorrect: calculations recomputed each iteration**
```ts
for (let i = 0; i < items.length; i++) {
  const prefix = config.namespace + '.';
  const multiplier = Math.PI * 2;
  process(items[i], prefix, multiplier);
}
```

**✅ Correct: hoist outside loop**
```ts
const prefix = config.namespace + '.';
const multiplier = Math.PI * 2;
const len = items.length;

for (let i = 0; i < len; i++) {
  process(items[i], prefix, multiplier);
}
```

### Precompute Constants

**❌ Incorrect: compute at runtime**
```ts
function calculateArea(radius) {
  const pi = Math.PI;
  return pi * radius * radius;
}
```

**✅ Correct: module-level constant**
```ts
const PI = Math.PI;

function calculateArea(radius) {
  return PI * radius * radius;
}
```

### Memoize Expensive Operations

**❌ Incorrect: repeated expensive calls**
```ts
function render() {
  const data = parseAndTransformData(rawData);
  return display(data);
}

// Called many times with same rawData
render();
render();
render();
```

**✅ Correct: memoize expensive function**
```ts
const memoizedParse = memoize(parseAndTransformData);

function render() {
  const data = memoizedParse(rawData);
  return display(data);
}
```

### Cache Function Results

**❌ Incorrect: repeated calculation**
```ts
function processItems(items) {
  for (const item of items) {
    const config = getConfig(item.type);
    apply(item, config);
  }
}

function getConfig(type) {
  // Expensive lookup/calculation
  return expensiveOperation(type);
}
```

**✅ Correct: cache results**
```ts
function processItems(items) {
  const configCache = new Map();

  for (const item of items) {
    if (!configCache.has(item.type)) {
      configCache.set(item.type, getConfig(item.type));
    }
    const config = configCache.get(item.type);
    apply(item, config);
  }
}
```

### Repeated Function Calls with Same Arguments

**❌ Incorrect: call multiple times**
```ts
function validate(data) {
  if (isValid(data.user) && isComplete(data.user)) {
    return processUser(data.user);
  }
  return null;
}

function isComplete(user) {
  return isValid(user) && user.profile && user.settings;
}
```

**✅ Correct: call once, reuse result**
```ts
function validate(data) {
  const valid = isValid(data.user);
  if (valid && isComplete(data.user, valid)) {
    return processUser(data.user);
  }
  return null;
}

function isComplete(user, alreadyValid = false) {
  return (alreadyValid || isValid(user)) && user.profile && user.settings;
}
```
