# 1.7 Use Transitions for Non-Urgent Updates

Mark frequent, non-urgent state updates as transitions to maintain UI responsiveness.

**❌ Incorrect: blocks UI on every scroll**
```tsx
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

**✅ Correct: non-blocking updates**
```tsx
import { startTransition } from 'react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handler = () => {
      startTransition(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

---

## React Compiler Note

❌ **Manual optimization required** - Even with [React Compiler](https://react.dev/learn/react-compiler) enabled, you must still use `startTransition()` for non-urgent updates. The compiler cannot infer which updates should be transitions.

See [react-compiler-guide.md](react-compiler-guide.md) for more details.
