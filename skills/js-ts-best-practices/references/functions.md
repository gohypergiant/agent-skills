# 1.2 Functions

- Keep functions under 50 lines
- Limit parameters; prefer simple return types
- Avoid default parameters; make all values explicit at call site
- Always explicitly type function return values in the function signature
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

**❌ Incorrect: missing return type annotation**
```ts
function getUser(id: string) {
  return users.find(u => u.id === id);
}

const processData = (input: unknown) => {
  return JSON.parse(input);
};
```

**✅ Correct: explicit return type annotation**
```ts
function getUser(id: string): User | undefined {
  return users.find(u => u.id === id);
}

const processData = (input: unknown): Record<string, unknown> => {
  return JSON.parse(input);
};
```
