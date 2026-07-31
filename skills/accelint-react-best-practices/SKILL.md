---
name: accelint-react-best-practices
description: Use when the task involves React code and the right answer depends on rendering, state, effects, hydration, or React 19 behavior. Trigger on writing, reviewing, refactoring, debugging, optimizing, or auditing React components, hooks, or JSX; fixing re-renders, stale closures, remounting, hydration mismatches, or effect dependency issues; or advising on transitions, lazy initialization, useDeferredValue, useTransition, useEffectEvent, Activity, ref as prop, React Compiler, or combined-hook patterns. Also use for React-focused performance reviews in Vite, Next.js, or other React apps. Do not use for backend, database, auth, or generic API work unless the problem is specifically about React behavior.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.8.3"
---

# React Best Practices

React-specific performance and correctness guidance for agents working with components, hooks, JSX, hydration, and React 19 patterns.

## NEVER Do React

These anti-patterns regularly cause production bugs, avoidable re-renders, or broken user interactions.

**NEVER define components inside components** — creates new component type on every render, causing full remount with state loss and DOM recreation. Results in input fields losing focus on keystroke, animations restarting unexpectedly, and useEffect cleanup/setup running on every parent render.

**NEVER subscribe to searchParams/localStorage if you only read them in callbacks** — causes component to re-render on every URL change or storage event even when the component doesn't display those values. Read directly in the callback instead: `new URLSearchParams(window.location.search)`.

**NEVER use object/array dependencies in useEffect** — triggers effect on every render since objects are recreated with new references each time. Extract primitive values (id, name) from objects and use those as dependencies instead.

**NEVER sync derived state with useState + useEffect** — leads to extra re-renders, infinite loops, and stale intermediate states. Calculate derived values during render instead: `const fullName = firstName + ' ' + lastName`.

**NEVER use client-only state (localStorage, cookies, device detection) directly in SSR components** — causes hydration mismatches where server HTML doesn't match client render, resulting in React warnings, visual flickering, and broken interactivity. Use synchronous inline `<script>` before React hydrates.

**NEVER use forwardRef in React 19+** — deprecated API. Use `ref` as a regular prop instead: `function MyInput({ ref }) { return <input ref={ref} /> }`.

**NEVER create callbacks/objects/arrays inline as props to memoized components** — breaks memoization since new reference is created each render. Extract to module scope, useMemo, or useCallback: `const config = useMemo(() => ({ theme }), [theme])`.

**NEVER put user interaction logic in useEffect** — if it's triggered by a button click or form submit, put it directly in the event handler. Effects are for synchronization with external systems, not user-triggered actions.

## Before Optimizing Performance, Ask

Before suggesting `memo()`, `useMemo()`, or `useCallback()` optimizations, confirm that they are needed:

1. **Does this project use React Compiler?**
   - Search for `babel-plugin-react-compiler` or `react-compiler-webpack-plugin` in package.json/config files
   - If **yes** → Skip manual memoization (memo, useMemo, useCallback, hoisting static JSX) — the compiler handles these automatically
   - If **no** → Apply all relevant optimizations from this skill
   - See [react-compiler-guide.md](references/react-compiler-guide.md) for what the compiler handles

2. **Is this actually a performance problem?**
   - Has the user measured/profiled and identified a bottleneck?
   - Or are they asking for a general review/optimization?

3. **What's the scale?**
   - For lists: How many items? (affects whether to suggest content-visibility vs virtualization)
   - For re-renders: How often does this component re-render?

## How to Use

This skill uses a **progressive disclosure** structure to minimize context usage:

### 1. Start with the Overview (`AGENTS.md`)
Read [AGENTS.md](AGENTS.md) for a concise rule index with one-line summaries.

### 2. Load Specific Rules as Needed
When you identify a relevant optimization, load the corresponding reference file for detailed implementation guidance:

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
- [no-inline-components.md](references/no-inline-components.md)
- [useref-for-transient-values.md](references/useref-for-transient-values.md)
- [split-combined-hooks.md](references/split-combined-hooks.md)
- [use-deferred-value.md](references/use-deferred-value.md)

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
- [effect-event-deps.md](references/effect-event-deps.md)

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
Each reference file contains:
- ❌ Incorrect examples showing the anti-pattern
- ✅ Correct examples showing the optimal implementation
- Explanations of why the pattern matters

### 4. Use the Report Template for Audits
Use the standardized report format only for audits or multi-issue reviews.

**Template:** [`assets/output-report-template.md`](assets/output-report-template.md)

The report format provides:
- Executive Summary with impact assessment
- Severity levels (Critical, High, Medium, Low) for prioritization
- Impact analysis (potential bugs, maintainability, runtime failures, or user-visible issues)
- Pattern references linking to detailed guidance in references/
- Summary table for tracking all findings

**Use the audit template when:**
- Skill invoked directly via `/accelint-react-best-practices <path>` for a review
- User asks to audit, review, or assess React code across one or more files

**Do not use the audit template when:**
- User asks to fix a specific bug or type error
- User asks what is wrong with a single snippet
- User requests direct implementation changes

Answer directly in those cases, and only load the reference files needed for the issue at hand.

## Examples

### Example 1: Optimizing Re-renders
**Task:** "This component re-renders too frequently when the user scrolls"

**Approach:**
1. Read AGENTS.md overview
2. Identify likely cause: subscribing to continuous values (scroll position)
3. Load [subscribe-derived-state.md](references/subscribe-derived-state.md) or [transitions-non-urgent-updates.md](references/transitions-non-urgent-updates.md)
4. Apply the pattern from the reference file

### Example 2: Fixing Stale Closures
**Task:** "This callback always uses the old state value"

**Approach:**
1. Read AGENTS.md overview
2. Identify issue: stale closure in useCallback
3. Load [functional-setstate-updates.md](references/functional-setstate-updates.md)
4. Replace direct state reference with functional update

### Example 3: SSR Hydration Mismatch
**Task:** "Getting hydration errors with localStorage theme"

**Approach:**
1. Read AGENTS.md overview
2. Identify issue: client-only state causing mismatch
3. Load [prevent-hydration-mismatch.md](references/prevent-hydration-mismatch.md)
4. Implement synchronous script pattern

## Using Skill Patterns Appropriately

Each reference file demonstrates ONE proven pattern, but React problems often have multiple valid solutions.

**When applying patterns:**
1. ✅ Present the pattern from the reference file
2. ✅ Mention alternative approaches when they exist
3. ✅ Consider user's React version, project complexity, and team preferences
4. ✅ For simple cases, suggest simpler solutions even if not in references

**Example:** For SSR hydration issues, `prevent-hydration-mismatch.md` shows the synchronous script approach, but a simple "mounted flag" pattern may be more appropriate for basic use cases.

## Important Notes

### React Compiler Awareness
Many manual optimization patterns (memo, useMemo, useCallback, hoisting static JSX) are **automatically handled by React Compiler**.

**Before optimizing, check if the project uses React Compiler:**
- If enabled: Skip manual memoization, but still apply state/effect/CSS optimizations
- If not enabled: Apply all relevant optimizations from this guide

See [react-compiler-guide.md](references/react-compiler-guide.md) for a complete breakdown of what the compiler handles vs what still needs manual optimization.

### React 19+ Features
This skill covers React 19 features including:
- `useEffectEvent` (19.2+) for stable event handlers
- `<Activity>` component for preserving hidden component state
- `ref` as a prop (replaces deprecated `forwardRef`)
- Named imports only (no default import of React)

### Performance Philosophy
- Start with correct code, then optimize.
- Check for React Compiler before suggesting manual memoization or hoisting.
- Measure before optimizing.
- Optimize the real bottleneck first. Network or data-volume issues often matter more than render micro-optimizations.
- Avoid premature optimization of trivial operations.

### Code Quality Principles
- Prefer simple, readable code over clever optimizations
- Only add complexity when measurements justify it
- Document non-obvious performance optimizations

## Additional Resources

Catch up on React 19 features:
- [React 19](https://react.dev/blog/2024/12/05/react-19)
- [React 19.2](https://react.dev/blog/2025/10/01/react-19-2)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
