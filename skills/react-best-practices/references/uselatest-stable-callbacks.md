# 3.2 useLatest for Stable Callback Refs

Access latest values in callbacks without adding them to dependency arrays. Prevents effect re-runs while avoiding stale closures.

## React 19.2+: Use useEffectEvent Instead

If your application uses React >= 19.2, prefer `useEffectEvent` over `useLatest`. It provides a cleaner API for the same pattern.

**✅ Recommended for React 19.2+:**
```tsx
import { useEffectEvent } from 'react'

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const onSearchStable = useEffectEvent(onSearch)

  useEffect(() => {
    const timeout = setTimeout(() => onSearchStable(query), 300)
    return () => clearTimeout(timeout)
  }, [query])
}
```

`useEffectEvent` creates a stable function reference that always calls the latest version of the handler. This is the official React solution for stable event handlers in effects.

See [store-event-handlers-refs.md](store-event-handlers-refs.md) for more details on `useEffectEvent`.

## React < 19.2: Use useLatest

For applications not yet on React 19.2, use the `useLatest` hook pattern:

Implementation:
```tsx
function useLatest<T>(value: T) {
  const ref = useRef(value)

  useLayoutEffect(() => {
    ref.current = value
  }, [value])

  return ref
}
```

**❌ Incorrect: effect re-runs on every callback change**
```tsx
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(timeout)
  }, [query, onSearch])
}
```

**✅ Correct: stable effect, fresh callback**
```tsx
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const onSearchRef = useLatest(onSearch)

  useEffect(() => {
    const timeout = setTimeout(() => onSearchRef.current(query), 300)
    return () => clearTimeout(timeout)
  }, [query])
}
```

---

## React Compiler Note

❌ **Manual optimization required** - Even with [React Compiler](https://react.dev/learn/react-compiler) enabled, you must still use useLatest (or useEffectEvent for React 19.2+) for stable callbacks. The compiler cannot automatically create stable callback references while preserving access to latest values.

See [react-compiler-guide.md](react-compiler-guide.md) for more details.
