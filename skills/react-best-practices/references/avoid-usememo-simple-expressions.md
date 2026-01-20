# 2.8 Avoid `useMemo` For Simple Expressions

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
