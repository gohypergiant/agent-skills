---
name: react-best-practices
description: React performance optimization and best practices. Use when writing React components, hooks, or JSX; refactoring React code; optimizing re-renders, memoization, or state management; reviewing React code for performance issues; fixing hydration mismatches; or implementing transitions, lazy initialization, or effect dependencies. Covers React 19+ features including useEffectEvent, Activity component, and ref props.
metadata:
  author: gohypergiant
  version: "1.0"
---

# React Best Practices

Performance optimization and best practices for React applications.

## When to Use This Skill

Activate this skill for tasks involving:

### Writing React Code
- Creating new React components or hooks
- Writing JSX elements or fragments
- Implementing state management with `useState`, `useReducer`, etc.
- Setting up effects with `useEffect`, `useLayoutEffect`
- Creating memoized values or components with `useMemo`, `useCallback`, `memo()`

### Refactoring React Code
- Optimizing component re-renders
- Reducing unnecessary state updates
- Simplifying complex effect dependencies
- Extracting components for better composition
- Converting class components to functional components

### Performance Optimization
- Investigating slow renders or UI jank
- Reducing bundle size (hoisting static JSX, optimizing SVG)
- Implementing lazy loading or code splitting
- Optimizing list rendering (virtualization, content-visibility)
- Fixing memory leaks in effects or subscriptions

### React-Specific Issues
- Resolving hydration mismatches in SSR/SSG applications
- Fixing stale closure bugs in callbacks
- Debugging infinite re-render loops
- Preventing unnecessary effect re-runs
- Managing derived state correctly

### Code Review
- Reviewing React code for performance anti-patterns
- Identifying improper use of hooks
- Checking for React 19 deprecated patterns (`forwardRef`, default imports)
- Ensuring proper memoization strategies

## When to Skip This Skill

Skip for:
- General JavaScript/TypeScript questions
- Build configuration (webpack, vite) unless React-specific
- CSS styling unless performance-related (animations, content-visibility)
- Backend API development
- Testing setup

## Trigger Phrases

Users typically request this skill with phrases like:

**Performance Issues:**
- "This component is re-rendering too much"
- "My React app is slow when scrolling"
- "Optimize this React component for performance"
- "The input feels laggy when typing"
- "This page takes forever to load initially"

**Debugging:**
- "Why does my useEffect run infinitely?"
- "Hydration errors in Next.js"
- "This callback has stale values"
- "My effect re-subscribes to events"

**Code Review:**
- "Review this React code for performance"
- "Does this component follow best practices?"
- "Optimize this React hook"
- "Check this component for performance problems"

**React 19 Migration:**
- "Update this code to React 19"
- "Replace forwardRef with the new pattern"
- "Fix these React 19 deprecation warnings"
- "Migrate to React 19 best practices"

**Refactoring:**
- "Refactor this component to be more performant"
- "Clean up these useEffect dependencies"
- "Improve the performance of this list rendering"

## How to Use

This skill uses progressive disclosure to minimize context usage:

### 1. Start with AGENTS.md
Read [AGENTS.md](AGENTS.md) for a one-page overview of all rules.

### 2. Load Specific Rules
Load the corresponding reference file for detailed guidance:

**Re-render Optimizations:**
- [defer-state-reads.md](references/defer-state-reads.md)
- [extract-memoized-components.md](references/extract-memoized-components.md)
- [narrow-effect-dependencies.md](references/narrow-effect-dependencies.md)
- [subscribe-derived-state.md](references/subscribe-derived-state.md)
- [functional-setstate-updates.md](references/functional-setstate-updates.md)
- [lazy-state-initialization.md](references/lazy-state-initialization.md)
- [transitions-non-urgent-updates.md](references/transitions-non-urgent-updates.md)
- [calculate-derived-state.md](references/calculate-derived-state.md)
- [avoid-usememo-simple-expressions.md](references/avoid-usememo-simple-expressions.md)
- [extract-default-parameter-value.md](references/extract-default-parameter-value.md)
- [interaction-logic-in-event-handlers.md](references/interaction-logic-in-event-handlers.md)
- [useref-for-transient-values.md](references/useref-for-transient-values.md)

**Rendering Performance:**
- [animate-svg-wrapper.md](references/animate-svg-wrapper.md)
- [css-content-visibility.md](references/css-content-visibility.md)
- [hoist-static-jsx.md](references/hoist-static-jsx.md)
- [optimize-svg-precision.md](references/optimize-svg-precision.md)
- [prevent-hydration-mismatch.md](references/prevent-hydration-mismatch.md)
- [activity-component-show-hide.md](references/activity-component-show-hide.md)
- [hoist-regexp-creation.md](references/hoist-regexp-creation.md)
- [use-usetransition-over-manual-loading.md](references/use-usetransition-over-manual-loading.md)

**Advanced Patterns:**
- [store-event-handlers-refs.md](references/store-event-handlers-refs.md)
- [uselatest-stable-callbacks.md](references/uselatest-stable-callbacks.md)
- [cache-repeated-function-calls.md](references/cache-repeated-function-calls.md)
- [initialize-app-once.md](references/initialize-app-once.md)

**Misc:**
- [named-imports.md](references/named-imports.md)
- [no-forwardref.md](references/no-forwardref.md)

**Quick References:**
- [quick-checklists.md](references/quick-checklists.md)
- [compound-patterns.md](references/compound-patterns.md)
- [react-compiler-guide.md](references/react-compiler-guide.md)

**Automation Scripts:**
- [scripts/](scripts/) - Helper scripts to detect anti-patterns

### 3. Apply the Pattern
Each reference file shows:
- ❌ Incorrect examples (the anti-pattern)
- ✅ Correct examples (the optimal implementation)
- Why the pattern matters

## Examples

### Example 1: Optimizing Re-renders
**Task:** "This component re-renders when the user scrolls"

**Steps:**
1. Read AGENTS.md
2. Identify cause: subscribing to continuous values (scroll position)
3. Load [subscribe-derived-state.md](references/subscribe-derived-state.md) or [transitions-non-urgent-updates.md](references/transitions-non-urgent-updates.md)
4. Apply the pattern

### Example 2: Fixing Stale Closures
**Task:** "This callback uses the old state value"

**Steps:**
1. Read AGENTS.md
2. Identify issue: stale closure in useCallback
3. Load [functional-setstate-updates.md](references/functional-setstate-updates.md)
4. Replace direct state reference with functional update

### Example 3: SSR Hydration Mismatch
**Task:** "Hydration errors with localStorage theme"

**Steps:**
1. Read AGENTS.md
2. Identify issue: client-only state causes mismatch
3. Load [prevent-hydration-mismatch.md](references/prevent-hydration-mismatch.md)
4. Implement synchronous script pattern

## React Compiler

React Compiler handles many manual optimizations automatically (memo, useMemo, useCallback, hoisting static JSX).

**Check whether the project uses React Compiler:**
- If enabled: Skip manual memoization; apply state/effect/CSS optimizations
- If disabled: Apply all relevant optimizations

See [react-compiler-guide.md](references/react-compiler-guide.md) for what the compiler handles and what still requires manual work.

## React 19 Features
- `useEffectEvent` (19.2+) for stable event handlers
- `<Activity>` component preserves hidden component state
- `ref` as a prop (replaces deprecated `forwardRef`)
- Named imports only

## Performance Philosophy
- Write correct code first, optimize later
- Measure before optimizing
- Optimize the slowest operations first (network > rendering > computation)
- Avoid premature optimization

## Code Quality
- Prefer simple, readable code to clever optimizations
- Add complexity only when measurements justify it
- Document non-obvious optimizations

## Resources

React 19 documentation:
- [React 19](https://react.dev/blog/2024/12/05/react-19)
- [React 19.2](https://react.dev/blog/2025/10/01/react-19-2)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
