---
name: accelint-react-best-practices
description: Use when the task involves React code and the right answer depends on rendering, state, effects, hydration, or React 19 behavior. Trigger on writing, reviewing, refactoring, debugging, optimizing, or auditing React components, hooks, or JSX; fixing re-renders, stale closures, remounting, hydration mismatches, or effect dependency issues; or advising on transitions, lazy initialization, useDeferredValue, useTransition, useEffectEvent, Activity, ref as prop, React Compiler, or combined-hook patterns. Also use for React-focused performance reviews in Vite, Next.js, or other React apps. Do not use for backend, database, auth, or generic API work unless the problem is specifically about React behavior.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.8.4"
---

# React Best Practices

Use this skill for React-specific performance and correctness guidance when the work involves components, hooks, JSX, hydration, or React 19 patterns.

## NEVER Do React

These anti-patterns regularly cause production bugs, avoidable re-renders, or broken user interactions.

Read [AGENTS.md](AGENTS.md) first for the one-line rule index. Then load the matching reference file before you apply a fix.

- **NEVER define components inside components** — remounts the child on every parent render and causes focus loss, animation restarts, and effect churn. See [no-inline-components.md](references/no-inline-components.md).
- **NEVER subscribe to searchParams/localStorage if you only read them in callbacks** — creates unnecessary re-renders for values the component does not display. See [defer-state-reads.md](references/defer-state-reads.md).
- **NEVER use object/array dependencies in useEffect** — recreated references retrigger effects even when the intended primitive trigger did not change. See [narrow-effect-dependencies.md](references/narrow-effect-dependencies.md).
- **NEVER sync derived state with useState + useEffect** — adds extra renders and stale intermediate states for values that can be computed during render. See [calculate-derived-state.md](references/calculate-derived-state.md).
- **NEVER use client-only state directly in SSR render paths** — causes hydration mismatch and theme or device flicker. See [prevent-hydration-mismatch.md](references/prevent-hydration-mismatch.md).
- **NEVER use forwardRef in React 19+** — use `ref` as a prop instead. See [no-forwardref.md](references/no-forwardref.md).
- **NEVER create inline props that defeat memoization without checking whether the project uses React Compiler first** — if the compiler is disabled, stabilize expensive identities deliberately; if it is enabled, avoid redundant manual memoization. See [react-compiler-guide.md](references/react-compiler-guide.md).
- **NEVER put user interaction logic in useEffect by default** — click and submit flows belong in handlers unless the effect is truly synchronizing with an external system. See [interaction-logic-in-event-handlers.md](references/interaction-logic-in-event-handlers.md).

## Before Optimizing Performance, Ask

Before suggesting `memo()`, `useMemo()`, or `useCallback()` optimizations, confirm that they are needed.

1. **Does this project use React Compiler?**
   - Search for `babel-plugin-react-compiler` or `react-compiler-webpack-plugin` in package.json or config files.
   - If **yes**: Skip manual memoization (`memo`, `useMemo`, `useCallback`, hoisting static JSX). The compiler handles these automatically.
   - If **no**: Apply the relevant optimizations from this skill.
   - See [react-compiler-guide.md](references/react-compiler-guide.md) for the exact boundary.

2. **Is this actually a performance problem?**
   - Has the user measured or profiled and identified a bottleneck?
   - Or are they asking for a general review or optimization?

3. **What is the scale?**
   - For lists: How many items? This affects whether to suggest content-visibility or virtualization.
   - For re-renders: How often does this component re-render?

## How to Use

This skill uses progressive disclosure to minimize context usage.

### 1. Start with the overview (`AGENTS.md`)
Read [AGENTS.md](AGENTS.md) for the concise rule index and one-line summaries.

### 2. Load specific rules as needed
When you identify a relevant optimization, load the corresponding reference file for detailed implementation guidance.

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

### 3. Apply the pattern
Each reference file contains:
- Incorrect examples showing the anti-pattern
- Correct examples showing the optimal implementation
- Explanations of why the pattern matters

### 4. Use the report template for audits
Use the standardized report format only for audits or multi-issue reviews.

**Template:** [`assets/output-report-template.md`](assets/output-report-template.md)

The report format provides:
- Executive Summary with impact assessment
- Severity levels (Critical, High, Medium, Low) for prioritization
- Impact analysis (potential bugs, maintainability, runtime failures, or user-visible issues)
- Pattern references linking to detailed guidance in references/
- Summary table for tracking all findings

**Use the audit template when:**
- The skill is invoked directly via `/accelint-react-best-practices <path>` for a review.
- The user asks to audit, review, or assess React code across one or more files.

**Do not use the audit template when:**
- The user asks to fix a specific bug or type error.
- The user asks what is wrong with a single snippet.
- The user requests direct implementation changes.

Answer directly in those cases. Load only the reference files needed for the issue at hand.

## Using Skill Patterns Appropriately

Each reference file demonstrates one proven pattern, but React problems can still have multiple valid fixes.

When applying a pattern:
1. Present the matching reference pattern.
2. Mention credible alternatives when they materially change tradeoffs.
3. Consider the user's React version, project complexity, and whether React Compiler is enabled.
4. Prefer the simpler fix when it solves the real problem cleanly.

For example, [prevent-hydration-mismatch.md](references/prevent-hydration-mismatch.md) shows the synchronous script approach because it avoids flicker, but a mounted-flag pattern can still be acceptable when the UX tradeoff is acceptable.

## Important Notes

### React Compiler awareness
Treat React Compiler as an early decision gate, not an afterthought.

- If enabled, skip manual memoization patterns that the compiler already covers.
- If not enabled, apply manual memoization and identity-stability guidance where the measured problem justifies it.

Use [react-compiler-guide.md](references/react-compiler-guide.md) for the exact boundary.

### React 19+ features
This skill covers React 19 features including:
- `useEffectEvent` (19.2+) for stable event handlers
- `<Activity>` for preserving hidden component state
- `ref` as a prop (replaces deprecated `forwardRef`)
- Named imports only (no default import of React)

### Performance philosophy
- Start with correct code, then optimize.
- Measure before optimizing.
- Optimize the real bottleneck first. Network or data-volume issues often matter more than render micro-optimizations.
- Avoid premature optimization of trivial operations.
- Prefer simple, readable code unless measured evidence justifies more complexity.

## Additional Resources

Use these resources to catch up on React 19 features:
- [React 19](https://react.dev/blog/2024/12/05/react-19)
- [React 19.2](https://react.dev/blog/2025/10/01/react-19-2)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
