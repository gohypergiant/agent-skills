# 1.2 Functions

- Keep functions under 50 lines
- Limit parameters; prefer simple return types
- Avoid default parameters; make all values explicit at call site
- Use `function` keyword for pure functions
- Use arrow functions only for simple cases (< 3 instructions)

**❌ Incorrect: implicit defaults**
```ts
const position = getPosition();
```

**✅ Correct: explicit values**
```ts
const position = getPosition(330);
```
