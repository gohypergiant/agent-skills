# React Best Practices

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining, generating, or refactoring React code at Accelint. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive performance optimization guide for React applications, designed for AI agents and LLMs. Each rule includes one-line summaries with links to detailed examples in `references/`. Load reference files only when implementing a specific pattern.

---

## How to Use This Guide

**For agents/LLMs:**
1. Scan rule summaries below to identify relevant optimizations
2. Load reference files only when implementing a specific pattern
3. Each reference is self-contained with ❌/✅ examples

**Quick shortcuts:**
- Re-render issues? → Section 1 (Re-render Optimizations)
- Slow rendering? → Section 2 (Rendering Performance)
- Advanced patterns? → Section 3 (Advanced Patterns)
- React 19 migration? → Section 4 (Misc)
- Not sure what's wrong? → Use Quick Diagnostic Guide below

**React 19+ Resources:**
- [React 19](https://react.dev/blog/2024/12/05/react-19) | [React 19.2](https://react.dev/blog/2025/10/01/react-19-2) | [Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

---

## Quick Diagnostic Guide

Use this guide to quickly identify which optimization applies based on symptoms:

**Symptom → Solution:**
- Component re-renders on every parent render → 1.2 Extract to Memoized Components
- Component re-renders when URL/localStorage changes but doesn't display them → 1.1 Defer State Reads
- Effect runs too frequently → 1.3 Narrow Effect Dependencies, 3.1 Store Event Handlers in Refs
- Callback has stale/old values → 1.5 Functional setState Updates, 3.2 useLatest (or useEffectEvent for React 19.2+)
- Slow initial render → 1.6 Lazy State Initialization, 2.3 Hoist Static JSX, 2.7 Hoist RegExp
- Scrolling/interaction feels janky → 2.2 CSS content-visibility, 2.1 Animate SVG Wrapper, 1.7 Transitions
- Typing/input feels sluggish → 1.7 Transitions for Non-Urgent Updates
- Window resize causes excessive re-renders → 1.4 Subscribe to Derived State
- Hydration mismatch errors (SSR/SSG) → 2.5 Prevent Hydration Mismatch
- Component state lost when hiding/showing → 2.6 Activity Component
- Infinite re-render loop → 1.5 Functional setState, 1.3 Narrow Effect Dependencies
- Large bundle size → 2.4 Optimize SVG Precision, 2.3 Hoist Static JSX

**React 19 Migration Issues:**
- "forwardRef is deprecated" → 4.2 No forwardRef
- "Default import from React is deprecated" → 4.1 Named Imports
- Need stable event handlers in effects → 3.1 Store Event Handlers (useEffectEvent)

---

## 1. Re-render Optimizations
Reducing unnecessary re-renders minimizes wasted computation and improves UI responsiveness.

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

### 1.8 Calculate Derived State During Rendering
Compute values from props/state during render instead of storing in state or syncing via effects.
[View detailed examples](references/calculate-derived-state.md)

### 1.9 Avoid useMemo For Simple Expressions
Skip useMemo for simple primitives (booleans, numbers, strings).
[View detailed examples](references/avoid-usememo-simple-expressions.md)

### 1.10 Extract Default Non-primitive Parameter Value
Move default object/array/function parameters to constants to preserve memo() optimization.
[View detailed examples](references/extract-default-parameter-value.md)

### 1.11 Put Interaction Logic in Event Handlers
Run user-triggered side effects (submit, click) in handlers, not state + effect combos.
[View detailed examples](references/interaction-logic-in-event-handlers.md)

### 1.12 Use useRef for Transient Values
Store frequently-changing non-UI values (mouse position, intervals) in refs to avoid re-renders.
[View detailed examples](references/useref-for-transient-values.md)

---

## 2. Rendering Performance
Optimizing the rendering process reduces the work the browser needs to do.

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

### 2.8 Use useTransition Over Manual Loading States
Use built-in `useTransition` with `isPending` instead of manual loading state management.
[View detailed examples](references/use-usetransition-over-manual-loading.md)

---

## 3. Advanced Patterns

### 3.1 Store Event Handlers in Refs
Use `useEffectEvent` (React 19.2+) to prevent effect re-subscriptions.
[View detailed examples](references/store-event-handlers-refs.md)

### 3.2 useLatest for Stable Callback Refs
Access latest values in callbacks without adding to dependency arrays. Prefer `useEffectEvent` for React 19.2+.
[View detailed examples](references/uselatest-stable-callbacks.md)

### 3.3 Cache Repeated Function Calls
Use module-level Map cache for expensive computations called repeatedly.
[View detailed examples](references/cache-repeated-function-calls.md)

### 3.4 Initialize App Once, Not Per Mount
Use module-level guards for app-wide initialization instead of component useEffect.
[View detailed examples](references/initialize-app-once.md)

---

## 4. Misc

### 4.1 Named Imports
Always use named imports from 'react', not default or wildcard imports.
[View detailed examples](references/named-imports.md)

### 4.2 No forwardRef
Use `ref` as a prop instead of `forwardRef` (deprecated in React 19).
[View detailed examples](references/no-forwardref.md)

### 4.3 React Compiler Guide
Understand what React Compiler optimizes automatically vs manual optimizations still needed.
[View detailed guide](references/react-compiler-guide.md)

### 4.4 Quick Reference Checklists
Checklists for common scenarios: new components, performance reviews, SSR, React 19 migration, etc.
[View checklists](references/quick-checklists.md)

### 4.5 Compound Pattern Examples
Real-world examples showing multiple optimization patterns working together.
[View compound patterns](references/compound-patterns.md)
