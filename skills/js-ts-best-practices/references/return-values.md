# 1.5 Return Values

Always return a zero value (identity element) instead of `null` or `undefined`. This eliminates downstream branching.

**❌ Incorrect: requires downstream check**
```ts
function makeList(someVar) {
  if (!someVar) return;
  return toList(someVar);
}

function anotherFn() {
  const baseList = makeList(/*...*/);
  if (!Array.isArray(baseList)) return;
  return baseList.map((x) => {/*...*/});
}
```

**✅ Correct: no checks needed**
```ts
function makeList(someVar) {
  if (!someVar) return [];
  return toList(someVar);
}

function anotherFn() {
  return getSomeList(/*...*/).map((x) => {/*...*/});
}
```
