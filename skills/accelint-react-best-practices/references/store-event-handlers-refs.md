# 3.1 Store Event Handlers in Refs

Store callbacks in refs when used in effects that shouldn't re-subscribe on callback changes.

**❌ Incorrect: re-subscribes on every render**
```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}
```

**✅ Correct: stable subscription**
```tsx
import { useEffectEvent } from 'react'

function useWindowEvent(event: string, handler: (e) => void) {
  const onEvent = useEffectEvent(handler)

  useEffect(() => {
    window.addEventListener(event, onEvent)
    return () => window.removeEventListener(event, onEvent)
  }, [event])
}
```

If you are on React >= 19.2 use `useEffectEvent` as it provides a cleaner API for the same pattern: it creates a stable function reference that always calls the latest version of the handler.

---

## React Compiler Note

❌ **Manual optimization required** - Even with [React Compiler](https://react.dev/learn/react-compiler) enabled, you must still use `useEffectEvent` (React 19.2+) or the ref pattern to prevent effect re-subscriptions. The compiler cannot infer when to stabilize event handlers in effects.

See [react-compiler-guide.md](react-compiler-guide.md) for more details.
