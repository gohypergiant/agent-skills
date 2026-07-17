# 1.4 Subscribe to Derived State

Subscribe to derived boolean state instead of continuous values to reduce re-render frequency.

**❌ Incorrect: re-renders on every pixel change**
```tsx
function Sidebar() {
  const width = useWindowWidth();  // updates continuously
  const isMobile = width < 768;

  return <nav className={isMobile ? 'mobile' : 'desktop'}>
}
```

**✅ Correct: re-renders only when boolean changes**
```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')

  return <nav className={isMobile ? 'mobile' : 'desktop'}>
}
```

---

## React Compiler Note

❌ **Manual optimization required** - Even with [React Compiler](https://react.dev/learn/react-compiler) enabled, you must still subscribe to derived state instead of continuous values. The compiler cannot infer that you should subscribe to a boolean instead of the raw value.

See [react-compiler-guide.md](react-compiler-guide.md) for more details.
