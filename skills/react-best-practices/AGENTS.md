# React Best Practices

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining, generating, or refactoring React code at Accelint. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive performance optimization guide for React applications, designed for AI agents and LLMs. Each rule includes one-line summaries here, with links to detailed examples in the `references/` folder. Load reference files only when you need detailed implementation guidance for a specific rule.

Catch up on React 19 features:

- [React 19](https://react.dev/blog/2024/12/05/react-19)
- [React 19.2](https://react.dev/blog/2025/10/01/react-19-2)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

---

## 1. Re-render Optimizations

### 1.1 Defer State Reads
Read searchParams/localStorage directly in callbacks instead of subscribing.
[View detailed examples](references/defer-state-reads.md)

### 1.2 Extract to Memoized Components
Move expensive work into memoized components for early bailout.
[View detailed examples](references/extract-memoized-components.md)

### 1.3 Narrow Effect Dependencies
Use primitive dependencies (id) instead of objects (user) in useEffect.
[View detailed examples](references/narrow-effect-dependencies.md)

### 1.4 Subscribe to Derived State
Subscribe to boolean state (isMobile) instead of continuous values (width).
[View detailed examples](references/subscribe-derived-state.md)

### 1.5 Use Functional setState Updates
Use `setState(curr => ...)` to avoid stale closures and unstable callbacks.
[View detailed examples](references/functional-setstate-updates.md)

### 1.6 Use Lazy State Initialization
Use `useState(() => expensive())` to avoid re-running initializers.
[View detailed examples](references/lazy-state-initialization.md)

### 1.7 Use Transitions for Non-Urgent Updates
Wrap frequent, non-urgent updates in `startTransition()` to keep UI responsive.
[View detailed examples](references/transitions-non-urgent-updates.md)

---

## 2. Rendering Performance

### 2.1 Animate SVG Wrapper Instead of SVG Element
Wrap SVG in a div and animate the wrapper for GPU acceleration.
[View detailed examples](references/animate-svg-wrapper.md)

### 2.2 CSS content-visibility for Long Lists
Apply `content-visibility: auto` to defer off-screen rendering in long lists.
[View detailed examples](references/css-content-visibility.md)

### 2.3 Hoist Static JSX Elements
Extract static JSX to module scope to avoid recreating on every render.
[View detailed examples](references/hoist-static-jsx.md)

### 2.4 Optimize SVG Precision
Reduce SVG coordinate precision to 1 decimal place with SVGO.
[View detailed examples](references/optimize-svg-precision.md)

### 2.5 Prevent Hydration Mismatch Without Flickering
Use inline `<script>` to sync client-side values before React hydrates.
[View detailed examples](references/prevent-hydration-mismatch.md)

### 2.6 Use Activity Component for Show/Hide
Use `<Activity mode="visible|hidden">` to preserve state when toggling visibility.
[View detailed examples](references/activity-component-show-hide.md)

### 2.7 Hoist RegExp Creation
Create RegExp at module scope or memoize with useMemo to avoid re-creation.
[View detailed examples](references/hoist-regexp-creation.md)

### 2.8 Avoid useMemo For Simple Expressions
Skip useMemo for simple primitives (booleans, numbers, strings).
[View detailed examples](references/avoid-usememo-simple-expressions.md)

---

## 3. Advanced Patterns

### 3.1 Store Event Handlers in Refs
Use `useEffectEvent` (React 19.2+) to prevent effect re-subscriptions.
[View detailed examples](references/store-event-handlers-refs.md)

### 3.2 useLatest for Stable Callback Refs
Access latest values in callbacks without adding to dependency arrays.
[View detailed examples](references/uselatest-stable-callbacks.md)

### 3.3 Cache Repeated Function Calls
Use module-level Map cache for expensive computations called repeatedly.
[View detailed examples](references/cache-repeated-function-calls.md)

---

## 4. Misc

### 4.1 Named Imports
Always use named imports from 'react', not default or wildcard imports.
[View detailed examples](references/named-imports.md)

### 4.2 No forwardRef
Use `ref` as a prop instead of `forwardRef` (deprecated in React 19).
[View detailed examples](references/no-forwardref.md)

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify relevant optimizations
2. **Load references as needed**: Click through to detailed examples only when implementing
3. **Progressive loading**: Each reference file is self-contained with ❌/✅ examples

This structure minimizes context usage while providing complete implementation guidance when needed.
