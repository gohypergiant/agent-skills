# 4.2 No forwardRef

`forwardRef` [was deprecated](https://react.dev/reference/react/forwardRef) in React 19.

**❌ Incorrect: `forwardRef` used**
```ts
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />);
```

**✅ Correct: ref as a prop**
```ts
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

---

## React Compiler Note

❌ **Manual optimization required** - Even with [React Compiler](https://react.dev/learn/react-compiler) enabled, you must migrate from `forwardRef` to ref props. This is a React 19 API migration requirement, not a compiler optimization.

See [react-compiler-guide.md](react-compiler-guide.md) for more details.
