# 1.9 Avoid `useMemo` For Simple Expressions

When an expression is simple (few logical or arithmetical operators) and has a primitive result type (boolean, number, string), do not wrap it in `useMemo`. Calling `useMemo` and comparing hook dependencies may consume more resources than the expression itself.

**❌ Incorrect: wasted `useMemo` overhead**
```tsx
function Header({ user, notifications }: Props) {
  const isLoading = useMemo(() => {
    return user.isLoading || notifications.isLoading
  }, [user.isLoading, notifications.isLoading]);

  if (isLoading) {
    return <Skeleton />
  }

  return /* ... */;
}
```

**✅ Correct: no `useMemo` overhead for simple expression**
```tsx
function Header({ user, notifications }: Props) {
  const isLoading = user.isLoading || notifications.isLoading

  if (isLoading) {
    return <Skeleton />;
  }

  return /* ... */;
}
```

---

## React Compiler Note

❌ **Manual optimization required** - Even with [React Compiler](https://react.dev/learn/react-compiler) enabled, avoid unnecessary `useMemo` for simple expressions. While the compiler optimizes memoization, removing unnecessary memoization improves code simplicity and readability.

See [react-compiler-guide.md](react-compiler-guide.md) for more details.
