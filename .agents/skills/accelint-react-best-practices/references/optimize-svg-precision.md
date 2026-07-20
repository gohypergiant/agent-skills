# 2.4 Optimize SVG Precision

Reduce SVG coordinate precision to decrease file size. The optimal precision depends on the viewBox size, but in general reducing precision should be considered.

**❌ Incorrect: excessive precision**
```tsx
<path d="M 10.293847 20.847362 L 30.938472 40.192837" />
```

**✅ Correct: 1 decimal place**
```tsx
<path d="M 10.3 20.8 L 30.9 40.2" />
```

This optimization can be automated with [SVGO](https://svgo.dev/)

```bash
npx svgo --precision=1 --multipass icon.svg
```

---

## React Compiler Note

❌ **Manual optimization required** - Even with [React Compiler](https://react.dev/learn/react-compiler) enabled, you must still optimize SVG precision. This is a build-time asset optimization, not a React code optimization.

See [react-compiler-guide.md](react-compiler-guide.md) for more details.
