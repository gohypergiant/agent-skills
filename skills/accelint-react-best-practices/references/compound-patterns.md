# Compound Pattern Examples

Real-world scenarios often require multiple optimization patterns working together. This guide shows complete examples of how patterns combine to solve complex performance problems.

---

## Example 1: Optimized Search Component

**Scenario:** A search component that filters a large list of items with debounced input

**Patterns Applied:**
- [1.5 Functional setState Updates](functional-setstate-updates.md) - Stable callbacks
- [1.7 Transitions](transitions-non-urgent-updates.md) - Non-urgent search results
- [2.8 useTransition Over Manual Loading](use-usetransition-over-manual-loading.md) - Built-in pending state
- [3.2 useLatest / useEffectEvent](uselatest-stable-callbacks.md) - Stable debounce callback (useEffectEvent for React 19.2+)
- [1.1 Defer State Reads](defer-state-reads.md) - Read URL params on demand

**❌ Before: Multiple Performance Issues**

```tsx
function SearchComponent({ items }: { items: Item[] }) {
  const searchParams = useSearchParams() // ❌ Subscribes to all URL changes
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState(items)

  // ❌ Callback recreated on every query/results change
  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery)
    // ❌ Blocks UI during expensive filtering
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(newQuery.toLowerCase())
    )
    setResults(filtered) // ❌ Direct state reference, not functional
  }, [query, results, items])

  // ❌ Effect re-runs on handleSearch changes
  useEffect(() => {
    const timeout = setTimeout(() => handleSearch(query), 300)
    return () => clearTimeout(timeout)
  }, [query, handleSearch])

  return (
    <div>
      <input value={query} onChange={e => handleSearch(e.target.value)} />
      <ResultsList results={results} />
    </div>
  )
}
```

**✅ After: Optimized with Multiple Patterns**

```tsx
import { useEffectEvent, useTransition } from 'react' // React 19.2+

function SearchComponent({ items }: { items: Item[] }) {
  const [query, setQuery] = useState(() => {
    // ✅ 1.1: Read URL params on demand, no subscription
    const params = new URLSearchParams(window.location.search)
    return params.get('q') || ''
  })
  const [results, setResults] = useState(items)
  const [isPending, startTransition] = useTransition() // ✅ 2.8: Built-in pending state

  // ✅ 1.5: Stable callback using functional setState
  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery)

    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(newQuery.toLowerCase())
    )

    // ✅ 1.7: Transition for non-urgent results update
    startTransition(() => {
      setResults(filtered)
    })
  }, [items]) // Only depends on items, not query or results

  // ✅ 3.2: useEffectEvent for stable effect with fresh callback (React 19.2+)
  // For React < 19.2, use useLatest hook instead
  const handleSearchStable = useEffectEvent(handleSearch)

  useEffect(() => {
    // ✅ Effect stable, only re-runs when query changes
    const timeout = setTimeout(() => handleSearchStable(query), 300)
    return () => clearTimeout(timeout)
  }, [query]) // Only query dependency

  return (
    <div>
      <input
        value={query}
        onChange={e => handleSearch(e.target.value)}
      />
      {isPending && <span className="loading">Searching...</span>}
      <ResultsList results={results} />
    </div>
  )
}
```

---

## Example 2: Optimized Infinite Scroll List

**Scenario:** An infinite scroll component with dynamic data loading

**Patterns Applied:**
- [1.4 Subscribe to Derived State](subscribe-derived-state.md) - Boolean instead of scroll position
- [2.2 CSS content-visibility](css-content-visibility.md) - Long list rendering
- [1.7 Transitions](transitions-non-urgent-updates.md) - Non-urgent load more
- [3.1 Store Event Handlers](store-event-handlers-refs.md) - Stable scroll subscription

**❌ Before: Performance Issues**

```tsx
function InfiniteList({ loadMore }: Props) {
  const [items, setItems] = useState<Item[]>([])
  const [scrollY, setScrollY] = useState(0) // ❌ Updates on every pixel

  // ❌ Re-subscribes on every loadMore change
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY) // ❌ Continuous updates

      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight

      // ❌ Blocks UI during data loading
      if (scrollY + clientHeight >= scrollHeight - 100) {
        loadMore().then(newItems => {
          setItems([...items, ...newItems]) // ❌ Direct state reference
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMore, items, scrollY])

  return (
    <div className="overflow-y-auto">
      {items.map(item => (
        <div key={item.id}> {/* ❌ No content-visibility */}
          <ItemCard item={item} />
        </div>
      ))}
    </div>
  )
}
```

**✅ After: Optimized with Multiple Patterns**

```tsx
function InfiniteList({ loadMore }: Props) {
  const [items, setItems] = useState<Item[]>([])
  const [isNearBottom, setIsNearBottom] = useState(false)

  // ✅ 3.1: useEffectEvent for stable event handler (React 19.2+)
  const onLoadMore = useEffectEvent(() => {
    loadMore().then(newItems => {
      // ✅ 1.7: Transition for non-urgent update
      startTransition(() => {
        // ✅ 1.5: Functional setState for correctness
        setItems(curr => [...curr, ...newItems])
      })
    })
  })

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollY = window.scrollY
      const clientHeight = document.documentElement.clientHeight

      // ✅ 1.4: Subscribe to derived boolean state
      const nearBottom = scrollY + clientHeight >= scrollHeight - 100

      setIsNearBottom(nearBottom)

      if (nearBottom) {
        onLoadMore()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, []) // ✅ Stable effect, onLoadMore not in dependencies

  return (
    <div className="overflow-y-auto h-screen">
      {items.map(item => (
        <div
          key={item.id}
          className="item-card" // ✅ 2.2: CSS content-visibility applied
          style={{
            contentVisibility: 'auto',
            containIntrinsicSize: '0 200px'
          }}
        >
          <ItemCard item={item} />
        </div>
      ))}
    </div>
  )
}
```

---

## Example 3: Optimized Dashboard with Multiple Widgets

**Scenario:** A dashboard with multiple data-heavy widgets that update independently

**Patterns Applied:**
- [1.2 Extract to Memoized Components](extract-memoized-components.md) - Isolate widget updates
- [2.3 Hoist Static JSX](hoist-static-jsx.md) - Loading skeletons
- [1.6 Lazy State Initialization](lazy-state-initialization.md) - Expensive initial data
- [3.3 Cache Repeated Function Calls](cache-repeated-function-calls.md) - Data transformation

**❌ Before: All Widgets Re-render Together**

```tsx
function Dashboard() {
  const [userData, setUserData] = useState(
    parseUserData() // ❌ Runs on every render
  )
  const [analyticsData, setAnalyticsData] = useState(
    parseAnalyticsData() // ❌ Runs on every render
  )
  const [loading, setLoading] = useState(false)

  if (loading) {
    // ❌ Creates new skeleton on every render
    return (
      <div>
        <div className="skeleton h-40 w-full" />
        <div className="skeleton h-40 w-full" />
      </div>
    )
  }

  // ❌ formatCurrency called repeatedly for same values
  const totalRevenue = formatCurrency(analyticsData.revenue)
  const averageOrder = formatCurrency(analyticsData.averageOrder)

  return (
    <div>
      {/* ❌ User widget re-renders when analytics changes */}
      <UserWidget data={userData} />
      <AnalyticsWidget
        revenue={totalRevenue}
        averageOrder={averageOrder}
      />
    </div>
  )
}
```

**✅ After: Optimized Widget Isolation**

```tsx
// ✅ 2.3: Hoist static loading skeleton
const loadingSkeleton = (
  <div>
    <div className="skeleton h-40 w-full" />
    <div className="skeleton h-40 w-full" />
  </div>
)

// ✅ 3.3: Module-level cache for repeated formatting
const formatCache = new Map<number, string>()

function cachedFormatCurrency(amount: number): string {
  if (formatCache.has(amount)) {
    return formatCache.get(amount)!
  }

  const formatted = formatCurrency(amount)
  formatCache.set(amount, formatted)
  return formatted
}

// ✅ 1.2: Memoized components for independent updates
const UserWidget = memo(function UserWidget({ data }: { data: UserData }) {
  return <div>User stats: {data.name}</div>
})

const AnalyticsWidget = memo(function AnalyticsWidget({
  revenue,
  averageOrder
}: {
  revenue: number
  averageOrder: number
}) {
  // ✅ 3.3: Cached formatting
  const formattedRevenue = cachedFormatCurrency(revenue)
  const formattedAverage = cachedFormatCurrency(averageOrder)

  return (
    <div>
      <div>Revenue: {formattedRevenue}</div>
      <div>Average: {formattedAverage}</div>
    </div>
  )
})

function Dashboard() {
  // ✅ 1.6: Lazy initialization - only runs once
  const [userData, setUserData] = useState(() => parseUserData())
  const [analyticsData, setAnalyticsData] = useState(() => parseAnalyticsData())
  const [loading, setLoading] = useState(false)

  if (loading) {
    return loadingSkeleton // ✅ Reuses same element
  }

  return (
    <div>
      {/* ✅ Widgets only re-render when their own data changes */}
      <UserWidget data={userData} />
      <AnalyticsWidget
        revenue={analyticsData.revenue}
        averageOrder={analyticsData.averageOrder}
      />
    </div>
  )
}
```

---

## Example 4: Optimized Form with Real-time Validation

**Scenario:** A complex form with real-time validation and API calls

**Patterns Applied:**
- [1.5 Functional setState Updates](functional-setstate-updates.md) - Stable form handlers
- [1.11 Interaction Logic in Handlers](interaction-logic-in-event-handlers.md) - Submit logic in handler
- [1.3 Narrow Effect Dependencies](narrow-effect-dependencies.md) - Validation effects
- [3.2 useLatest / useEffectEvent](uselatest-stable-callbacks.md) - Async validation (useEffectEvent for React 19.2+)
- [1.7 Transitions](transitions-non-urgent-updates.md) - Non-blocking validation results

**❌ Before: Unstable Dependencies**

```tsx
function RegistrationForm() {
  const [formData, setFormData] = useState({ email: '', username: '', password: '' })
  const [errors, setErrors] = useState({})

  // ❌ Validates on every formData change (including password changes)
  useEffect(() => {
    validateEmail(formData.email).then(isValid => {
      setErrors({ ...errors, email: isValid ? null : 'Invalid email' })
    })
  }, [formData, errors]) // ❌ Object dependencies

  // ❌ Callback recreated on every formData change
  const handleSubmit = useCallback(async () => {
    const result = await submitForm(formData)
    if (result.errors) {
      setErrors(result.errors)
    }
  }, [formData, errors])

  return (
    <form>
      <input
        value={formData.email}
        onChange={e => setFormData({
          ...formData, // ❌ Direct state reference
          email: e.target.value
        })}
      />
      {/* ... */}
    </form>
  )
}
```

**✅ After: Optimized with Stable Dependencies**

```tsx
import { useEffectEvent } from 'react' // React 19.2+

function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  // ✅ 1.5: Stable callback using functional setState
  const updateField = useCallback((field: string, value: string) => {
    setFormData(curr => ({ ...curr, [field]: value }))
  }, [])

  // ✅ 3.2: useEffectEvent for async validation (React 19.2+)
  // For React < 19.2, use useLatest hook instead
  const updateFieldStable = useEffectEvent(updateField)

  // ✅ 1.3: Narrow dependency - only email, not whole formData
  useEffect(() => {
    const validateAsync = async () => {
      const isValid = await validateEmail(formData.email)

      // ✅ 1.7: Transition for non-urgent validation result
      startTransition(() => {
        setErrors(curr => ({
          ...curr,
          email: isValid ? null : 'Invalid email'
        }))
      })
    }

    if (formData.email) {
      validateAsync()
    }
  }, [formData.email]) // ✅ Primitive dependency

  // ✅ 1.11: Interaction logic in event handler, not effect
  // ✅ 1.5: Stable submit handler with functional setState
  const handleSubmit = useCallback(async () => {
    // Read latest formData inside callback
    setFormData(curr => {
      submitForm(curr).then(result => {
        if (result.errors) {
          startTransition(() => {
            setErrors(result.errors)
          })
        }
      })
      return curr
    })
  }, [])

  return (
    <form>
      <input
        value={formData.email}
        onChange={e => updateField('email', e.target.value)}
      />
      {errors.email && <span className="error">{errors.email}</span>}
      {/* ... */}
      <button type="button" onClick={handleSubmit}>Submit</button>
    </form>
  )
}
```

---

## Example 5: Optimized SSR Dashboard with Theme

**Scenario:** A dashboard that needs to render on server and handle client-side theme without flickering

**Patterns Applied:**
- [2.5 Prevent Hydration Mismatch](prevent-hydration-mismatch.md) - Theme handling
- [1.2 Extract to Memoized Components](extract-memoized-components.md) - Widget isolation
- [2.6 Activity Component](activity-component-show-hide.md) - Sidebar state preservation

**❌ Before: Hydration Mismatch and Flickering**

```tsx
function Dashboard() {
  // ❌ localStorage breaks SSR
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className={theme}>
      {/* ❌ Sidebar state lost when toggled */}
      {sidebarOpen && <Sidebar />}

      {/* ❌ All widgets re-render when theme changes */}
      <UserStatsWidget />
      <AnalyticsWidget />
    </div>
  )
}
```

**✅ After: SSR-Safe with Optimized Rendering**

```tsx
// ✅ 1.2: Memoized widgets don't re-render on theme change
const UserStatsWidget = memo(function UserStatsWidget() {
  return <div>User statistics...</div>
})

const AnalyticsWidget = memo(function AnalyticsWidget() {
  return <div>Analytics...</div>
})

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <>
      {/* ✅ 2.5: Prevent hydration mismatch with inline script */}
      <div id="dashboard-wrapper">
        {/* ✅ 2.6: Activity preserves sidebar state when hidden */}
        <Activity mode={sidebarOpen ? 'visible' : 'hidden'}>
          <Sidebar />
        </Activity>

        <main>
          <UserStatsWidget />
          <AnalyticsWidget />
        </main>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                var el = document.getElementById('dashboard-wrapper');
                if (el) el.className = theme;
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  )
}
```

---

## Example 6: Optimized Analytics Tracker with Mouse Position

**Scenario:** A component that tracks mouse position for analytics without causing re-renders, with proper app initialization

**Patterns Applied:**
- [1.12 useRef for Transient Values](useref-for-transient-values.md) - Mouse position tracking
- [1.8 Calculate Derived State](calculate-derived-state.md) - Derive status from props
- [1.10 Extract Default Parameter](extract-default-parameter-value.md) - Stable default callbacks
- [3.4 Initialize App Once](initialize-app-once.md) - Analytics SDK initialization

**❌ Before: Re-renders on Mouse Move**

```tsx
function AnalyticsTracker({ onTrack, enabled = true }: Props) {
  const [mouseX, setMouseX] = useState(0) // ❌ Renders on every pixel
  const [mouseY, setMouseY] = useState(0)
  const [isTracking, setIsTracking] = useState(false) // ❌ Derived state

  // ❌ Runs on every mount, even in dev strict mode
  useEffect(() => {
    initAnalyticsSDK() // ❌ Initializes multiple times
  }, [])

  // ❌ Derives isTracking from enabled in effect
  useEffect(() => {
    setIsTracking(enabled && mouseX > 0)
  }, [enabled, mouseX])

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouseX(e.clientX) // ❌ Triggers re-render
      setMouseY(e.clientY)
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div>
      {isTracking && (
        <TrackingIndicator
          x={mouseX}
          y={mouseY}
          onClick={() => {}} // ❌ New function on every render
        />
      )}
    </div>
  )
}
```

**✅ After: Optimized with Transient Values**

```tsx
// ✅ 3.4: Initialize SDK once per app load, not per component mount
let didInit = false

function initOnce() {
  if (didInit) return
  didInit = true
  initAnalyticsSDK()
}

// ✅ 1.10: Extract default callback to constant for stable memo()
const NOOP = () => {}

const TrackingIndicator = memo(function TrackingIndicator({
  x,
  y,
  onClick = NOOP // ✅ Stable default value
}: {
  x: number
  y: number
  onClick?: () => void
}) {
  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        pointerEvents: 'none'
      }}
    >
      Tracking
    </div>
  )
})

function AnalyticsTracker({ onTrack, enabled = true }: Props) {
  // ✅ 1.12: useRef for frequently-changing transient values
  const mouseXRef = useRef(0)
  const mouseYRef = useRef(0)
  const indicatorRef = useRef<HTMLDivElement>(null)

  // ✅ 1.8: Calculate derived state during render
  const isTracking = enabled && mouseXRef.current > 0

  useEffect(() => {
    initOnce() // ✅ 3.4: Guarded initialization

    const handleMove = (e: MouseEvent) => {
      // ✅ 1.12: Update refs without triggering re-renders
      mouseXRef.current = e.clientX
      mouseYRef.current = e.clientY

      // Directly update DOM for performance
      const indicator = indicatorRef.current
      if (indicator && enabled) {
        indicator.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }

      // Send analytics without re-rendering
      if (enabled && onTrack) {
        onTrack({ x: e.clientX, y: e.clientY })
      }
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [enabled, onTrack])

  return (
    <div>
      {isTracking && (
        <div
          ref={indicatorRef}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            pointerEvents: 'none',
            transform: 'translate(0px, 0px)'
          }}
        >
          Tracking
        </div>
      )}
    </div>
  )
}
```

---

## Key Takeaways

1. **Patterns often work together** - Real-world optimizations typically combine 3-5 patterns
2. **Start with correctness** - Functional setState (1.5), narrow dependencies (1.3), and interaction logic in handlers (1.11) prevent bugs
3. **Derive, don't sync** - Calculate derived state during render (1.8), don't use effects to synchronize it
4. **Choose the right state storage** - Use useState for UI, useRef for transient values (1.12)
5. **Then optimize rendering** - Memoization (1.2), transitions (1.7/2.8), and derived state (1.4)
6. **Stable references matter** - Extract default parameters (1.10) to preserve memo() optimization
7. **Initialize wisely** - App-level initialization once (3.4), component initialization lazily (1.6)
8. **Finally, advanced patterns** - useEffectEvent/useLatest (3.2), caching (3.3), and Activity (2.6)
9. **SSR requires special care** - Hydration mismatch prevention (2.5) is critical
10. **React Compiler helps** - But state/effect patterns still need manual application
11. **React 19.2+ advantages** - Use useEffectEvent instead of useLatest for cleaner stable event handlers

Refer to the [Quick Checklists](quick-checklists.md) for systematic pattern application and [React Compiler Guide](react-compiler-guide.md) for compiler-specific guidance.
