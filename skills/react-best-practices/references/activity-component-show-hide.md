# 2.6 Use Activity Component for Show/Hide

Use React's `<Activity>` component to preserve state/DOM for expensive components that frequently toggle visibility.

```tsx
import { Activity } from 'react'

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

Avoids expensive re-renders and state loss.

---

## React Compiler Note

❌ **Manual optimization required** - Even with [React Compiler](https://react.dev/learn/react-compiler) enabled, you must still use the `<Activity>` component explicitly. The compiler cannot transform conditional rendering into Activity component usage.

See [react-compiler-guide.md](react-compiler-guide.md) for more details.
