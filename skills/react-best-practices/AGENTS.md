# React Best Practices

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining, generating, or refactoring React code at Accelint. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive performance optimization guide for React applications, designed for AI agents and LLMs. Each rule includes detailed explanations, and real-world examples comparing incorrect vs. correct implementations to guide automated refactoring and code generation.

Catch up on React 19 features:

- [React 19](https://react.dev/blog/2024/12/05/react-19)
- [React 19.2](https://react.dev/blog/2025/10/01/react-19-2)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

---

## Table of Contents

1. [Re-render Optimization](#1-re-render-optimizations)
    - 1.1 [Defer State Reads](#11-defer-state-reads)
    - 1.2 [Extract to Memoized Components](#12-extract-to-memoized-components)
    - 1.3 [Narrow Effect Dependencies](#13-narrow-effect-dependencies)
    - 1.4 [Subscribe to Derived State](#14-subscribe-to-derived-state)
    - 1.5 [Use Functional setState Updates](#15-use-functional-setstate-updates)
    - 1.6 [Use Lazy State Initialization](#16-use-lazy-state-initialization)
    - 1.7 [Use Transitions for Non-Urgent Updates](#17-use-transitions-for-non-urgent-updates)
2. [Rendering Performance](#2-rendering-performance)
    - 2.1 [Animate SVG Wrapper Instead of SVG Element](#21-animate-svg-wrapper-instead-of-svg-element)
    - 2.2 [CSS content-visibility for Long Lists](#22-css-content-visibility-for-long-lists)
    - 2.3 [Hoist Static JSX Elements](#23-hoist-static-jsx-elements)
    - 2.4 [Optimize SVG Precision](#24-optimize-svg-precision)
    - 2.5 [Prevent Hydration Mismatch Without Flickering](#25-prevent-hydration-mismatch-without-flickering)
    - 2.6 [Use Activity Component for Show/Hide](#26-use-activity-component-for-showhide)
    - 2.7 [Hoist RegExp Creation](#27-hoist-regexp-creation)
    - 2.8 [Avoid useMemo For Simple Expressions](#28-avoid-usememo-for-simple-expressions)
3. [Advanced Patterns](#3-advanced-patterns)
    - 3.1 [Store Event Handlers in Refs](#31-store-event-handlers-in-refs)
    - 3.2 [useLatest for Stable Callback Refs](#32-uselatest-for-stable-callback-refs)
    - 3.3 [Cache Repeated Function Calls](#33-cache-repeated-function-calls)
4. [Misc](#4-misc)
    - 4.1 [Named Imports](#41-named-imports)
    - 4.2 [No forwardRef](#42-no-forwardref)

---

## 1. Re-render Optimizations

### 1.1 Defer State Reads

Don't subscribe to dynamic state (searchParams, localStorage) if you only read it inside callbacks.

**❌ Incorrect: subscribes to all searchParams changes**
```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams()

  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

**✅ Correct: reads on demand, no subscription**
```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

### 1.2 Extract to Memoized Components

Extract expensive work into memoized components to enable early returns before computation.

**❌ Incorrect: computes avatar even when loading**
```tsx
function Profile({ user, loading }: Props) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user);
    return <Avatar id={id} />;
  }, [user]);

  if (loading) {
    return <Skeleton />;
  }

  return <div>{avatar}</div>;
}
```

**✅ Correct: skips computation when loading**
```tsx
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
  const id = useMemo(() => computeAvatarId(user), [user]);
  return <Avatar id={id} />;
})

function Profile({ user, loading }: Props) {
  if (loading) {
    return <Skeleton />;
  }

  return (
    <div>
      <UserAvatar user={user} />
    </div>
  )
}
```

Note: If your project has [React Compiler](https://react.dev/learn/react-compiler) enabled, manual memoization with `memo()` and `useMemo()` is not necessary. The compiler automatically optimizes re-renders.

### 1.3 Narrow Effect Dependencies

Specify primitive dependencies instead of objects to minimize effect re-runs.

**❌ Incorrect: re-runs on any user field change**
```tsx
useEffect(() => {
  console.log(user.id);
}, [user])
```

**✅ Correct: re-runs only when id changes**
```tsx
useEffect(() => {
  console.log(user.id);
}, [user.id])
```

For derived state, compute outside effect:

**❌ Incorrect: runs on width=767, 766, 765...**
```tsx
useEffect(() => {
  if (width < 768) {
    enableMobileMode();
  }
}, [width])
```

**✅ Correct: runs only on boolean transition**
```tsx
const isMobile = width < 768
useEffect(() => {
  if (isMobile) {
    enableMobileMode();
  }
}, [isMobile])
```

### 1.4 Subscribe to Derived State

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

### 1.5 Use Functional setState Updates

When updating state based on the current state value, use the functional update form of setState instead of directly referencing the state variable. This prevents stale closures, eliminates unnecessary dependencies, and creates stable callback references.

**❌ Incorrect: requires state as dependency**
```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)
  
  // Callback must depend on items, recreated on every items change
  const addItems = useCallback((newItems: Item[]) => {
    setItems([...items, ...newItems])
  }, [items])  // ❌ items dependency causes recreations
  
  // Risk of stale closure if dependency is forgotten
  const removeItem = useCallback((id: string) => {
    setItems(items.filter(item => item.id !== id))
  }, [])  // ❌ Missing items dependency - will use stale items!
  
  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

The first callback is recreated every time items changes, which can cause child components to re-render unnecessarily. The second callback has a stale closure bug—it will always reference the initial items value.

**✅ Correct: stable callbacks, no stale closures**
```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)
  
  // Stable callback, never recreated
  const addItems = useCallback((newItems: Item[]) => {
    setItems(curr => [...curr, ...newItems])
  }, [])  // ✅ No dependencies needed
  
  // Always uses latest state, no stale closure risk
  const removeItem = useCallback((id: string) => {
    setItems(curr => curr.filter(item => item.id !== id))
  }, [])  // ✅ Safe and stable
  
  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

Note: If your project has [React Compiler](https://react.dev/learn/react-compiler) enabled, the compiler can automatically optimize some cases, but functional updates are still recommended for correctness and to prevent stale closure bugs.

### 1.6 Use Lazy State Initialization

Pass a function to `useState` for expensive initial values. Without the function form, the initializer runs on every render even though the value is only used once.

**❌ Incorrect: runs on every render**
```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs on EVERY render, even after initialization
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
  const [query, setQuery] = useState('')
  
  // When query changes, buildSearchIndex runs again unnecessarily
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse runs on every render
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem('settings') || '{}')
  )
  
  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

**✅ Correct: runs only once**
```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs ONLY on initial render
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
  const [query, setQuery] = useState('')
  
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse runs only on initial render
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('settings')
    return stored ? JSON.parse(stored) : {}
  })
  
  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

Use lazy initialization when computing initial values from localStorage/sessionStorage, building data structures (indexes, maps), reading from the DOM, or performing heavy transformations.

For simple primitives (`useState(0)`), direct references (`useState(props.value)`), or cheap literals (`useState({})`), the function form is unnecessary.

### 1.7 Use Transitions for Non-Urgent Updates

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

## 2. Rendering Performance

### 2.1 Animate SVG Wrapper Instead of SVG Element

Many browsers don't have hardware acceleration for CSS3 animations on SVG elements. Wrap SVG in a <div> and animate the wrapper instead.

**❌ Incorrect: animating SVG directly - no hardware acceleration**
```tsx
function LoadingSpinner() {
  return (
    <svg 
      className="animate-spin"
      width="24" 
      height="24" 
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  )
}
```

**✅ Correct: animating wrapper div - hardware accelerated**
```tsx
function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  )
}
```

This applies to all CSS transforms and transitions (transform, opacity, translate, scale, rotate). The wrapper div allows browsers to use GPU acceleration for smoother animations.

### 2.2 CSS content-visibility for Long Lists

Apply content-visibility: auto to defer off-screen rendering.

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

```tsx
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map(msg => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}
```

For 1000 messages, browser skips layout/paint for ~990 off-screen items (10× faster initial render).

### 2.3 Hoist Static JSX Elements

Extract static JSX outside components to avoid re-creation.

**❌ Incorrect: recreates element every render**
```tsx
function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />
}

function Container() {
  return (
    <div>
      {loading && <LoadingSkeleton />}
    </div>
  )
}
```

**✅ Correct: reuses same element**
```tsx
const loadingSkeleton = (
  <div className="animate-pulse h-20 bg-gray-200" />
)

function Container() {
  return (
    <div>
      {loading && loadingSkeleton}
    </div>
  )
}
```

This is especially helpful for large and static SVG nodes, which can be expensive to recreate on every render.

Note: If your project has [React Compiler](https://react.dev/learn/react-compiler) enabled, the compiler automatically hoists static JSX elements and optimizes component re-renders, making manual hoisting unnecessary.

### 2.4 Optimize SVG Precision

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

### 2.5 Prevent Hydration Mismatch Without Flickering

When rendering content that depends on client-side storage (localStorage, cookies), avoid both SSR breakage and post-hydration flickering by injecting a synchronous script that updates the DOM before React hydrates.

**❌ Incorrect: breaks SSR**
```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  // localStorage is not available on server - throws error
  const theme = localStorage.getItem('theme') || 'light'
  
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

**❌ Incorrect: visual flickering**
```ts
function ThemeWrapper({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')
  
  useEffect(() => {
    // Runs after hydration - causes visible flash
    const stored = localStorage.getItem('theme')

    if (stored) {
      setTheme(stored)
    }
  }, [])
  
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

**✅ Correct: no flicker, no hydration mismatch**
```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="theme-wrapper">
        {children}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                var el = document.getElementById('theme-wrapper');
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

The inline script executes synchronously before showing the element, ensuring the DOM already has the correct value. No flickering, no hydration mismatch.

This pattern is especially useful for theme toggles, user preferences, authentication states, and any client-only data that should render immediately without flashing default values.

### 2.6 Use Activity Component for Show/Hide

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

### 2.7 Hoist RegExp Creation

Don't create `RegExp` inside render. Hoist to module scope or memoize with `useMemo()`.

**❌ Incorrect: RegExp created every render**
```ts
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return <>{parts.map((part, i) => ...)}</>;
}
```

**✅ Correct: (description of why)**
```ts
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  );
  const parts = text.split(regex);

  return <>{parts.map((part, i) => ...)}</>;
}
```

**Warning**: global regex (/g) has mutable lastIndex state:
```ts
const regex = /foo/g
regex.test('foo')  // true, lastIndex = 3
regex.test('foo')  // false, lastIndex = 0
```

### 2.8 Avoid `useMemo` For Simple Expressions

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

---

## 3. Advanced Patterns

### 3.1 Store Event Handlers in Refs

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

### 3.2 useLatest for Stable Callback Refs

Access latest values in callbacks without adding them to dependency arrays. Prevents effect re-runs while avoiding stale closures.

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

### 3.3 Cache Repeated Function Calls

Use a module-level Map to cache function results when the same function is called repeatedly with the same inputs during render.

**❌ Incorrect: redundant computation**
```tsx
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // slugify() called 100+ times for same project names
        const slug = slugify(project.name)
        
        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**✅ Correct: cached results**
```tsx
// Module-level cache
const slugifyCache = new Map<string, string>()

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) {
    return slugifyCache.get(text)!
  }

  const result = slugify(text)
  slugifyCache.set(text, result)

  return result
}

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // Computed only once per unique project name
        const slug = cachedSlugify(project.name)
        
        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

Simpler pattern for single-value functions:

```tsx
let isLoggedInCache: boolean | null = null

function isLoggedIn(): boolean {
  if (isLoggedInCache !== null) {
    return isLoggedInCache
  }
  
  isLoggedInCache = document.cookie.includes('auth=')
  return isLoggedInCache
}

// Clear cache when auth changes
function onAuthChange() {
  isLoggedInCache = null
}
```

Use a Map (not a hook) so it works everywhere: utilities, event handlers, not just React components.

Reference: https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast

---

## 4. Misc

### 4.1 Named Imports

Always used named imports from the `react` library.

**❌ Incorrect: default import**
```ts
import React from 'react';
```

**❌ Incorrect: wildcard import**
```ts
import * as React from 'react';
```

**✅ Correct: named imports**
```ts
import { useEffect, useState } from 'react';
```

### 4.2 No forwardRef

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