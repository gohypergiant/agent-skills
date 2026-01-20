# 4.1 Reduce Branching

Use table lookups instead of conditionals for static values.

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
