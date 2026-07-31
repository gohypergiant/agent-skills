# Test Assertions for accelint-react-best-practices

This file mirrors the current eval surface in `evals/evals.json` so maintainers can quickly see what each prompt is supposed to prove.

## Eval 1: Inline Component Focus Loss
**What to check:**
- Component extracted to module scope instead of being defined inside the parent
- Props passed down (`value`, `onChange`, `theme`)
- Explanation mentions remounting, focus loss, or recreated component identity

**Assertions:**
1. `SearchInput` is defined outside `SearchBar`
2. `SearchInput` receives props instead of closing over parent state
3. Explanation identifies the nested-component anti-pattern and its remount/focus consequences

## Eval 2: Infinite Effect Loop
**What to check:**
- Dependency changed from `[user]` to a stable primitive such as `[userId]`
- Explanation identifies the dependency array as the root cause
- Explanation distinguishes the fetch trigger from the updated state object

**Assertions:**
1. The fix removes `user` as the effect dependency
2. The response explains why the dependency choice causes the refetch loop
3. The response recommends a primitive trigger such as `userId`

## Eval 3: SSR Hydration Mismatch
**What to check:**
- Solution avoids reading `localStorage` in the initial server-rendered state path
- Explanation identifies server/client HTML mismatch
- Recommendation is hydration-safe and tradeoff-aware

**Assertions:**
1. The response removes direct client-only reads from the SSR render path
2. The response explains hydration mismatch or server/client divergence
3. The response recommends the no-flicker synchronous script pattern or clearly frames a mounted-flag alternative as a tradeoff

## Eval 4: Chart Performance Freeze Without React Compiler
**What to check:**
- Response honors the explicit “React Compiler is not enabled” condition
- Expensive derived chart data is stabilized with manual optimization
- Response mentions a non-urgent update strategy for large chart switches

**Assertions:**
1. The response explicitly acknowledges that React Compiler is off
2. The response recommends stabilizing expensive derived chart data with `useMemo` or an equivalent manual optimization
3. The response suggests `useTransition` or another non-urgent update pattern for view switching

## Eval 5: Chart Performance Freeze With React Compiler
**What to check:**
- Response branches correctly because React Compiler is enabled
- Manual memoization is not treated as the main fix by default
- Response focuses on remaining bottlenecks the compiler does not solve

**Assertions:**
1. The response explicitly says React Compiler changes the optimization advice
2. The response avoids centering the answer on manual memoization
3. The response focuses on remaining bottlenecks such as transitions, chart-library cost, or data-volume/rendering concerns

## Eval 6: TodoList Audit Review
**What to check:**
- Response respects the request for an audit instead of only producing a patch
- Response identifies inline handlers in the list render path
- Response suggests long-list strategies

**Assertions:**
1. The response uses audit/review framing rather than only rewriting the component
2. The response identifies inline function creation inside the list render path
3. The response suggests content-visibility, virtualization, extracted memoized items, or similar long-list strategies

## Eval 7: Stale Closure Chat Callback
**What to check:**
- Response identifies stale closure as the real bug
- Functional updates are used for both message append and unread counter
- Explanation links the fix to dependency stability and captured state

**Assertions:**
1. `setMessages` uses a functional update
2. `setUnreadCount` uses a functional update
3. The explanation identifies stale closure or captured old state as the root cause

## Eval 8: WebSocket Reconnect Loop in React 19.2
**What to check:**
- Response identifies unstable handler identity as the reason the effect resubscribes
- React 19.2 guidance prefers `useEffectEvent` or a clearly justified fallback
- Effect dependencies remain tied to real reactive inputs

**Assertions:**
1. The response identifies recreated function references as the cause of reconnection churn
2. The response prefers `useEffectEvent` for React 19.2 or clearly frames a stable fallback
3. The response keeps effect dependencies based on reactive inputs instead of unstable handler identity

## Eval 9: React 19 Migration From forwardRef
**What to check:**
- `forwardRef` is removed
- `ref` is treated as a normal prop
- Default React import is replaced by named imports

**Assertions:**
1. The response removes `forwardRef`
2. The response uses `ref` in the component signature as a normal prop
3. The response uses named imports instead of a default React import

## Eval 10: Derived fullName State
**What to check:**
- Response identifies derived-state syncing as an anti-pattern
- Value is computed during render
- Explanation mentions extra renders or stale intermediates

**Assertions:**
1. The response identifies `useState` + `useEffect` syncing as unnecessary derived state
2. The response recommends computing `fullName` during render
3. The response explains the extra render or stale-state downside

## Eval 11: Submit Logic in useEffect
**What to check:**
- Response says user-triggered interaction logic belongs in the handler by default
- Response distinguishes interaction logic from external synchronization effects
- Response does not endorse state-plus-effect indirection as the normal structure

**Assertions:**
1. The response says click/submit logic should usually live in the event handler
2. The response distinguishes user interaction logic from synchronization effects
3. The response avoids endorsing a state-flag-plus-effect pattern as the default

## Eval 12: Laggy Search Input With Heavy Rendering
**What to check:**
- Response distinguishes urgent input updates from non-urgent expensive rendering
- Response recommends `useDeferredValue`, `useTransition`, or both appropriately
- Explanation focuses on preserving typing responsiveness

**Assertions:**
1. The response identifies urgent vs non-urgent update classes
2. The response recommends `useDeferredValue`, `useTransition`, or both in a fitting way
3. The response explains that the goal is to keep typing responsive while deferring heavier work

## Eval 13: Hidden Widget Loses State
**What to check:**
- Response frames the problem as hide/show state preservation rather than generic rerendering
- Response mentions React 19 `Activity`
- Explanation connects unmounting with state loss and repeated setup work

**Assertions:**
1. The response identifies state preservation across hide/show as the problem
2. The response mentions the `Activity` component as a relevant React 19 pattern
3. The response explains why unmounting causes state loss or repeated setup/refetching

## Eval 14: Prioritized React Audit Request
**What to check:**
- Response recognizes this as an audit or multi-issue review request
- Response presents prioritized findings with severity or impact framing
- Response does not reduce the answer to a narrow patch-only response

**Assertions:**
1. The response uses audit/review framing
2. The response provides prioritized findings with impact or severity framing
3. The response avoids answering only with an unstructured patch

## Eval 15: Vite React Optimization Request
**What to check:**
- Response still treats the task as React-specific work outside Next.js
- Response focuses on rendering, state, effect, callback, or stale-closure guidance
- Response avoids inventing Next.js-only advice

**Assertions:**
1. The response clearly treats the problem as React-specific even in Vite
2. The response focuses on React rendering/state/effect/callback concerns
3. The response avoids adding Next.js-only server, routing, or RSC advice

## Eval 16: Backend JWT Route Non-Trigger Boundary
**What to check:**
- Response does not force React framing onto a backend/security task
- Response avoids component/hook/hydration advice
- Response stays on backend or security concerns

**Assertions:**
1. The response does not frame the task as React component or hook work
2. The response avoids hydration, JSX, state, or effect guidance
3. The response stays focused on backend or security implementation concerns
