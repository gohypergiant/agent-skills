# 4.10 Object Operations

## Issues

- Object spreading in loops
- Deep cloning when shallow clone suffices
- Unnecessary object creation
- Object.keys/values/entries on hot paths
- Spread operators for single property changes

## Optimizations

- Mutate when safe (function owns object, local scope, not returned/exposed)
- Use Object.assign for shallow updates when immutability required
- Preallocate objects with known shape
- Direct property assignment over spreading when object is owned

## Examples

### Mutate When Safe

**❌ Incorrect: unnecessary spread in loop**
```ts
let result = {};
for (const item of items) {
  result = { ...result, [item.id]: item.value };
}
```

**✅ Correct: mutate owned object**
```ts
const result = {};
for (const item of items) {
  result[item.id] = item.value;
}
```

### Shallow vs Deep Clone

**❌ Incorrect: deep clone for simple update**
```ts
import { cloneDeep } from 'lodash';

function updateUser(user, name) {
  const updated = cloneDeep(user);
  updated.name = name;
  return updated;
}
```

**✅ Correct: shallow clone with Object.assign**
```ts
function updateUser(user, name) {
  return Object.assign({}, user, { name });
}
```

### Single Property Update

**❌ Incorrect: spread for one property**
```ts
function setActive(state, active) {
  return {
    ...state,
    active,
  };
}
```

**✅ Correct: Object.assign for performance**
```ts
function setActive(state, active) {
  return Object.assign({}, state, { active });
}
```

### Preallocate Object Shape

**❌ Incorrect: dynamic property addition**
```ts
function buildConfig(data) {
  const config = {};
  if (data.x) config.x = data.x;
  if (data.y) config.y = data.y;
  if (data.z) config.z = data.z;
  return config;
}
```

**✅ Correct: preallocate shape**
```ts
function buildConfig(data) {
  return {
    x: data.x || 0,
    y: data.y || 0,
    z: data.z || 0,
  };
}
```

### Object.keys on Hot Paths

**❌ Incorrect: repeated Object.keys**
```ts
for (const item of items) {
  const keys = Object.keys(item);
  if (keys.length > 0) {
    process(item);
  }
}
```

**✅ Correct: use for...in or check properties directly**
```ts
for (const item of items) {
  if (item.id !== undefined) {
    process(item);
  }
}
```

### Unnecessary Object Creation

**❌ Incorrect: create object just to destructure**
```ts
function getCoords(x, y) {
  const point = { x, y };
  return processPoint(point);
}

function processPoint({ x, y }) {
  return Math.sqrt(x * x + y * y);
}
```

**✅ Correct: pass values directly**
```ts
function getCoords(x, y) {
  return processPoint(x, y);
}

function processPoint(x, y) {
  return Math.sqrt(x * x + y * y);
}
```
