# 1.5 Assertions

Use strict assertions:

**❌ Incorrect: loose or fuzzy assertion**
```ts
expect(content).toContain('valid-content');
```

**✅ Correct: strict assertion**
```ts
expect(content).toEqual({ key: 'valid-content' });
```

**✅ Correct: ultra strict assertion**
```ts
expect(content).toStrictEqual({ key: 'valid-content' });
```
