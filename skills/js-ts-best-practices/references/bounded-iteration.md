# 4.6 Bounded Iteration

Set limits on all loops, queues, and data structures.

**❌ Incorrect: unbounded**
```ts
while (true) {
  if (someCondition) break;
}
```

**✅ Correct: bounded**
```ts
for (const item of items) {
  // process item
}
```
