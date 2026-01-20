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
