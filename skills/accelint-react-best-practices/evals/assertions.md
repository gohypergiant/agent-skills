# Test Assertions for accelint-react-best-practices

## Eval 1: Inline Component Focus Loss
**What to check:**
- Component extracted to module scope (not inside parent)
- Props passed down (value, onChange, theme)
- No nested component definition

**Assertions:**
1. SearchInput defined outside SearchBar function
2. SearchInput receives props (value, onChange, theme)
3. Explanation mentions "inline component" or "component inside component" anti-pattern

## Eval 2: Infinite Effect Loop
**What to check:**
- Dependency changed from [user] to [userId]
- Explanation mentions object reference causing re-trigger
- No other unnecessary changes

**Assertions:**
1. useEffect dependency is [userId] not [user]
2. Explanation mentions dependency array issue
3. Explanation mentions primitive vs object reference

## Eval 3: SSR Hydration Mismatch
**What to check:**
- Solution prevents server/client HTML mismatch
- Either: mounted flag + useEffect, OR synchronous script pattern
- localStorage only read on client side

**Assertions:**
1. Initial state is consistent (no typeof window check in useState)
2. Either has mounted flag + useEffect, OR mentions synchronous script
3. Explanation mentions hydration mismatch

## Eval 4: Chart Performance Freeze
**What to check:**
- chartData wrapped in useMemo
- Dependencies specified correctly [data, chartType or similar]
- Optional: useTransition for non-urgent updates

**Assertions:**
1. chartData creation wrapped in useMemo
2. Explanation mentions inline object recreation issue
3. Optional: mentions useTransition for view switching

## Eval 5: TodoList Audit
**What to check:**
- Identifies inline event handler creation
- Mentions CSS content-visibility for long scrollable list
- Suggests extracting memoized TodoItem component

**Assertions:**
1. Mentions inline function creation in render
2. Suggests content-visibility CSS or virtualization
3. Suggests extracting TodoItem or memoization

## Eval 6: Stale Closure Chat
**What to check:**
- Uses functional setState: setUnreadCount(curr => curr + 1)
- Same for setMessages: setMessages(prev => [...prev, msg])
- Explanation mentions stale closure issue

**Assertions:**
1. setUnreadCount uses functional update (curr/prev => curr + 1)
2. setMessages uses functional update (prev => [...prev, msg])
3. Explanation mentions stale closure or callback dependency issue

## Eval 7: React 19 Migration
**What to check:**
- Removes forwardRef wrapper
- Uses ref as regular prop
- Changes to named import from 'react'

**Assertions:**
1. No forwardRef usage
2. ref passed as regular prop ({ ref })
3. Uses named import: import { ... } from 'react'

## Eval 8: WebSocket Reconnect Loop
**What to check:**
- Stabilizes handleMessage callback
- Either: useCallback with proper deps, OR ref, OR useEffectEvent
- Explanation mentions unstable function reference

**Assertions:**
1. handleMessage stabilized (useCallback/ref/useEffectEvent)
2. Effect dependencies correct
3. Explanation mentions function reference stability issue
