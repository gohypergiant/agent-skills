# 4.5 Predictable Execution and Cache Locality

## Issues

- Poor data structure layout for access pattern
- Random access patterns that could be sequential
- Struct-of-arrays vs array-of-structs mismatches
- Scattered memory access in tight loops
- Unpredictable control flow

## Optimizations

- Sequential memory access patterns
- Group related data together
- Use flat arrays instead of nested structures
- Consider columnar layout for analytics workloads
- Write code with clear, predictable execution paths

## Examples

### Sequential vs Random Access

**❌ Incorrect: random access pattern**
```ts
const users = new Map();
users.set('id1', { name: 'Alice', age: 30 });
users.set('id2', { name: 'Bob', age: 25 });

// Random access through Map
for (const id of shuffledIds) {
  process(users.get(id));
}
```

**✅ Correct: sequential access**
```ts
const users = [
  { id: 'id1', name: 'Alice', age: 30 },
  { id: 'id2', name: 'Bob', age: 25 },
];

// Sequential memory access
for (let i = 0; i < users.length; i++) {
  process(users[i]);
}
```

### Struct-of-Arrays vs Array-of-Structs

**❌ Incorrect: array-of-structs for columnar access**
```ts
const particles = [
  { x: 1, y: 2, vx: 0.1, vy: 0.2 },
  { x: 3, y: 4, vx: 0.3, vy: 0.4 },
  // ... thousands more
];

// Need only x coordinates - poor cache usage
for (let i = 0; i < particles.length; i++) {
  updateX(particles[i].x);
}
```

**✅ Correct: struct-of-arrays for columnar workload**
```ts
const particles = {
  x: [1, 3, ...],
  y: [2, 4, ...],
  vx: [0.1, 0.3, ...],
  vy: [0.2, 0.4, ...],
};

// Sequential access to contiguous memory
for (let i = 0; i < particles.x.length; i++) {
  updateX(particles.x[i]);
}
```

### Flat Arrays vs Nested Structures

**❌ Incorrect: nested object access**
```ts
const grid = {
  rows: [
    { cells: [{ value: 1 }, { value: 2 }] },
    { cells: [{ value: 3 }, { value: 4 }] },
  ]
};

for (const row of grid.rows) {
  for (const cell of row.cells) {
    process(cell.value);
  }
}
```

**✅ Correct: flat array**
```ts
const values = [1, 2, 3, 4];
const width = 2;

for (let i = 0; i < values.length; i++) {
  process(values[i]);
}
```

### Group Related Data

**❌ Incorrect: scattered data access**
```ts
const ids = [1, 2, 3];
const names = ['Alice', 'Bob', 'Charlie'];
const ages = [30, 25, 35];

for (let i = 0; i < ids.length; i++) {
  processUser(ids[i], names[i], ages[i]);
}
```

**✅ Correct: grouped data**
```ts
const users = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Charlie', age: 35 },
];

for (let i = 0; i < users.length; i++) {
  const user = users[i];
  processUser(user.id, user.name, user.age);
}
```

### Predictable Control Flow

**❌ Incorrect: unpredictable branches**
```ts
function process(items) {
  for (const item of items) {
    if (Math.random() > 0.5) {
      handleA(item);
    } else {
      handleB(item);
    }
  }
}
```

**✅ Correct: predictable branches**
```ts
function process(items) {
  for (const item of items) {
    if (item.type === 'A') {
      handleA(item);
    } else {
      handleB(item);
    }
  }
}
```
