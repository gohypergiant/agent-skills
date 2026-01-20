# 4.2 Reduce Looping

Use `reduce` instead of chained array methods:

**❌ Incorrect: two iterations**
```ts
const result = arr.filter(predicate).map(mapper);
```

**✅ Correct: single iteration**
```ts
const result = arr.reduce((acc, curr) =>
  predicate(curr) ? [...acc, mapper(curr)] : acc,
  []
);
```

Use `Set.has()` over `Array.includes()` for membership checks:

**❌ Incorrect: O(n)**
```ts
const keys = Object.keys(someObj);
if (keys.includes(id)) { /**/ }
```

**✅ Correct: O(1)**
```ts
const keys = new Set(Object.keys(someObj));
if (keys.has(id)) { /**/ }
```
