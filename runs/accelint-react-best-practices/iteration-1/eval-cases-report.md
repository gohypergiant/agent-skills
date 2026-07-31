# Eval cases report: accelint-react-best-practices

## Scope
Generated evaluation coverage for `skills/accelint-react-best-practices/evals/evals.json` based on the skill guidance, existing eval structure, and the skill-manager emphasis on high-signal, expert-only coverage.

## Case count
- Total eval cases: 16

## Scenario categories

### Trigger coverage
- General React rendering and hook problems outside framework-specific contexts
- Re-render bugs, stale closures, effect dependency mistakes, hydration issues, and performance reviews
- React 19 migration requests covering `forwardRef`, named imports, `ref` as prop, `useEffectEvent`, and `Activity`

Why it matters:
- Confirms the skill activates on React-specific work even when the app is not Next.js.
- Verifies the trigger surface described in `SKILL.md` is exercised by realistic requests.

### Non-trigger boundaries
- Backend-only Express security route request with no React involvement

Why it matters:
- Checks that responses do not invent React advice when the task is outside the skill boundary.
- Helps detect over-activation and false-positive behavior.

### React Compiler branching
- Large-chart performance case with React Compiler disabled
- Matching large-chart performance case with React Compiler enabled

Why it matters:
- Verifies the skill follows its explicit compiler-first decision rule.
- Ensures advice changes when manual memoization is redundant or lower priority.

### Anti-pattern detection
- Nested component definitions causing remounts and focus loss
- Self-triggering effects and unstable dependencies
- Derived state mirrored via `useState` plus `useEffect`
- Interaction logic routed through effects instead of event handlers
- Inline list handlers and long-list render pressure
- Stale closure state updates in callbacks
- Constant effect resubscription from unstable function identities

Why it matters:
- Covers the highest-value expert warnings in the skill's NEVER and diagnostic sections.
- Tests whether the skill finds root causes instead of only treating symptoms.

### Audit vs fix behavior
- TodoList audit request
- General prioritized React audit request
- Direct bug-fix requests for narrower snippets

Why it matters:
- Verifies the skill uses structured audit behavior for review-style asks.
- Verifies the skill answers directly for single-problem implementation requests.

### React 19 patterns
- `forwardRef` migration to `ref` as prop
- Named imports instead of default React imports
- `useEffectEvent` for stable effect-side handlers
- `Activity` for preserving hidden subtree state

Why it matters:
- Confirms modern React 19 guidance is present and not replaced with legacy patterns.
- Exercises the skill's React 19-specific differentiators.

## Coverage summary
The eval set emphasizes practical user requests over synthetic edge cases. It covers activation breadth, non-trigger restraint, compiler-aware branching, major anti-pattern families, audit-vs-fix response mode, and React 19 guidance. This should provide strong signal for both trigger quality and answer quality.
