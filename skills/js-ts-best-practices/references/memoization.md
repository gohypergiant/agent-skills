# 4.3 Memoization

Use only when appropriate. Avoid memoizing trivial computations.

**❌ Incorrect: trivial computation**
```ts
const ternMemo = memoize((pred) => pred ? 'Right!' : 'Wrong');
```

**✅ Correct: direct computation**
```ts
const result = test ? 'Right!' : 'Wrong';
```
