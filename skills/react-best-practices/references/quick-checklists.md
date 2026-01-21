# Quick Reference Checklists

Use these checklists to quickly audit React code for common patterns and optimizations. Each checklist links to the relevant detailed reference file.

---

## New Component Checklist

Use when creating a new React component from scratch:

- [ ] Using named imports from 'react'? → [4.1 Named Imports](named-imports.md)
- [ ] Using `ref` prop instead of forwardRef? → [4.2 No forwardRef](no-forwardref.md)
- [ ] Static JSX hoisted to module scope? → [2.3 Hoist Static JSX](hoist-static-jsx.md)
- [ ] RegExp created at module scope or memoized? → [2.7 Hoist RegExp](hoist-regexp-creation.md)
- [ ] Expensive initialization using lazy pattern? → [1.6 Lazy State Initialization](lazy-state-initialization.md)
- [ ] State updates using functional form when needed? → [1.5 Functional setState](functional-setstate-updates.md)
- [ ] Avoiding useMemo for simple expressions? → [2.8 Avoid useMemo Simple Expressions](avoid-usememo-simple-expressions.md)

---

## Performance Review Checklist

Use when reviewing React code for performance issues:

- [ ] Components re-rendering unnecessarily? → [1.2 Extract Memoized Components](extract-memoized-components.md)
- [ ] Subscribing to state that's only read in callbacks? → [1.1 Defer State Reads](defer-state-reads.md)
- [ ] Effect dependencies include objects instead of primitives? → [1.3 Narrow Effect Dependencies](narrow-effect-dependencies.md)
- [ ] Subscribing to continuous values (width) instead of derived state (isMobile)? → [1.4 Subscribe Derived State](subscribe-derived-state.md)
- [ ] Effects re-subscribing on every render? → [3.1 Store Event Handlers](store-event-handlers-refs.md)
- [ ] Expensive functions called repeatedly with same inputs? → [3.3 Cache Repeated Calls](cache-repeated-function-calls.md)
- [ ] Long lists causing slow renders? → [2.2 CSS content-visibility](css-content-visibility.md)
- [ ] SVG animations janky? → [2.1 Animate SVG Wrapper](animate-svg-wrapper.md)
- [ ] Typing/scrolling feels sluggish? → [1.7 Transitions](transitions-non-urgent-updates.md)

---

## SSR/SSG Checklist

Use when working with server-side rendering or static site generation:

- [ ] Hydration mismatch errors? → [2.5 Prevent Hydration Mismatch](prevent-hydration-mismatch.md)
- [ ] Client-only state (localStorage, cookies) causing issues? → [2.5 Prevent Hydration Mismatch](prevent-hydration-mismatch.md)
- [ ] Theme/preferences flickering on load? → [2.5 Prevent Hydration Mismatch](prevent-hydration-mismatch.md)

---

## Effect Dependencies Checklist

Use when debugging useEffect issues:

- [ ] Effect running infinitely? → [1.3 Narrow Dependencies](narrow-effect-dependencies.md) or [1.5 Functional setState](functional-setstate-updates.md)
- [ ] Effect running too frequently? → [1.3 Narrow Dependencies](narrow-effect-dependencies.md) or [3.1 Store Event Handlers](store-event-handlers-refs.md)
- [ ] Callback has stale values? → [1.5 Functional setState](functional-setstate-updates.md) or [3.2 useLatest / useEffectEvent](uselatest-stable-callbacks.md)
- [ ] Effect re-subscribing on callback changes? → [3.1 Store Event Handlers](store-event-handlers-refs.md)

---

## React 19 Migration Checklist

Use when migrating to React 19:

- [ ] Remove default React import → [4.1 Named Imports](named-imports.md)
- [ ] Replace forwardRef with ref prop → [4.2 No forwardRef](no-forwardref.md)
- [ ] Use `useEffectEvent` for stable event handlers (19.2+) → [3.1 Store Event Handlers](store-event-handlers-refs.md)
- [ ] Use `<Activity>` for show/hide state preservation → [2.6 Activity Component](activity-component-show-hide.md)
- [ ] Check if React Compiler is enabled → [React Compiler Guide](react-compiler-guide.md)

---

## Bundle Size Optimization Checklist

Use when optimizing bundle size:

- [ ] SVGs optimized with SVGO (precision=1)? → [2.4 Optimize SVG Precision](optimize-svg-precision.md)
- [ ] Static JSX hoisted to module scope? → [2.3 Hoist Static JSX](hoist-static-jsx.md)
- [ ] Named imports used instead of default? → [4.1 Named Imports](named-imports.md)

---

## Re-render Debugging Checklist

Use when a component is re-rendering too frequently:

**Step 1: Identify the cause**
- Check React DevTools Profiler for render frequency
- Add console.log to identify what's triggering renders

**Step 2: Check these common issues**
- [ ] Parent re-renders causing child re-renders? → [1.2 Extract Memoized Components](extract-memoized-components.md)
- [ ] Subscribing to changing state unnecessarily? → [1.1 Defer State Reads](defer-state-reads.md) or [1.4 Subscribe Derived State](subscribe-derived-state.md)
- [ ] Object/array dependencies in effects? → [1.3 Narrow Effect Dependencies](narrow-effect-dependencies.md)
- [ ] Callbacks recreated on every render? → [1.5 Functional setState](functional-setstate-updates.md)
- [ ] Non-urgent updates blocking UI? → [1.7 Transitions](transitions-non-urgent-updates.md)

---

## Advanced Patterns Checklist

Use when implementing advanced optimization patterns:

- [ ] Need stable callbacks without adding dependencies? → [3.2 useLatest](uselatest-stable-callbacks.md) or [useEffectEvent](store-event-handlers-refs.md) (React 19.2+)
- [ ] React 19.2+ event handlers in effects? → [3.1 Store Event Handlers](store-event-handlers-refs.md)
- [ ] Expensive computations called multiple times? → [3.3 Cache Repeated Calls](cache-repeated-function-calls.md)
- [ ] Components toggling visibility losing state? → [2.6 Activity Component](activity-component-show-hide.md)

---

## React Compiler Checklist

Use when working with React Compiler enabled projects:

- [ ] Confirmed React Compiler is enabled? → [React Compiler Guide](react-compiler-guide.md)
- [ ] Removed manual memo() wrapping? (compiler handles it)
- [ ] Removed unnecessary useMemo() for simple values? (compiler handles it)
- [ ] Removed unnecessary useCallback()? (compiler handles it)
- [ ] Still applying state management patterns? → [Section 1](../AGENTS.md#1-re-render-optimizations)
- [ ] Still applying effect patterns? → [Section 1.3](narrow-effect-dependencies.md), [3.1](store-event-handlers-refs.md)
- [ ] Still applying CSS optimizations? → [Section 2](../AGENTS.md#2-rendering-performance)

---

## Code Review Quick Audit

Use when doing a quick code review of React components:

**High Priority (Fix These):**
- [ ] forwardRef usage → [4.2 No forwardRef](no-forwardref.md)
- [ ] Default React import → [4.1 Named Imports](named-imports.md)
- [ ] Hydration mismatches → [2.5 Prevent Hydration Mismatch](prevent-hydration-mismatch.md)
- [ ] Infinite re-render loops → [1.3](narrow-effect-dependencies.md), [1.5](functional-setstate-updates.md)
- [ ] Stale closures in callbacks → [1.5 Functional setState](functional-setstate-updates.md)

**Medium Priority (Optimize If Time Permits):**
- [ ] Unnecessary subscriptions → [1.1 Defer State Reads](defer-state-reads.md)
- [ ] Object dependencies in effects → [1.3 Narrow Dependencies](narrow-effect-dependencies.md)
- [ ] Continuous value subscriptions → [1.4 Subscribe Derived State](subscribe-derived-state.md)
- [ ] Non-lazy expensive initialization → [1.6 Lazy Initialization](lazy-state-initialization.md)

**Low Priority (Nice to Have):**
- [ ] Static JSX not hoisted → [2.3 Hoist Static JSX](hoist-static-jsx.md)
- [ ] RegExp created in render → [2.7 Hoist RegExp](hoist-regexp-creation.md)
- [ ] SVG precision not optimized → [2.4 Optimize SVG](optimize-svg-precision.md)
