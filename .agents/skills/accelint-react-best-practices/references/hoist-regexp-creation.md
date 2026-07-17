# 2.7 Hoist RegExp Creation

Don't create `RegExp` inside render. Hoist to module scope or memoize with `useMemo()`.

**❌ Incorrect: RegExp created every render**
```ts
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return <>{parts.map((part, i) => ...)}</>;
}
```

**✅ Correct: memoized or hoisted**
```ts
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  );
  const parts = text.split(regex);

  return <>{parts.map((part, i) => ...)}</>;
}
```

**Warning**: global regex (/g) has mutable lastIndex state:
```ts
const regex = /foo/g
regex.test('foo')  // true, lastIndex = 3
regex.test('foo')  // false, lastIndex = 0
```

---

## React Compiler Note

✅ **Handled automatically** - If your project has [React Compiler](https://react.dev/learn/react-compiler) enabled, the compiler automatically hoists RegExp creation and memoizes values. Manual hoisting/memoization is unnecessary.

See [react-compiler-guide.md](react-compiler-guide.md) for more details.
