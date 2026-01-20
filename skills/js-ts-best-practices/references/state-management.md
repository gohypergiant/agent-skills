# 1.4 State Management

- Use `const` instead of `let` whenever possible
- Use `let` only for valid performance reasons
- Declare variables at smallest possible scope
- Never mutate passed references; create copies instead
- Centralize state manipulation in parent functions; keep leaf functions pure

**❌ Incorrect: reassignment**
```ts
let color = src.substring(start + 1, end - 1);
color = color.replace(/\s/g, '');
```

**✅ Correct: single assignment**
```ts
const color = src.substring(start + 1, end - 1).replace(/\s/g, '');
```

**❌ Incorrect: conditional with let**
```ts
let result;
if (validation.success) {
  result = primary.data.options.map(addIndex);
} else {
  result = fallback.data.options.map(addIndex);
}
```

**✅ Correct: ternary with const**
```ts
const config = validation.success ? primary : fallback;
const result = config.data.options.map(addIndex);
```
