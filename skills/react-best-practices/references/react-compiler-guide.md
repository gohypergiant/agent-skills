# React Compiler Guide

## What is React Compiler?

React Compiler is an automatic optimization tool that transforms React code at build time to improve performance. It automatically memoizes components and values, reducing the need for manual optimization with `memo()`, `useMemo()`, and `useCallback()`.

Learn more: [React Compiler Documentation](https://react.dev/learn/react-compiler)

---

## How to Check if Your Project Uses React Compiler

1. Check `package.json` for `babel-plugin-react-compiler` or similar
2. Check build config (babel.config.js, vite.config.js, next.config.js) for compiler plugin
3. Look for compiler output in build logs
4. If unsure, ask the user: "Does this project use React Compiler?"

---

## What React Compiler Handles Automatically

### ✅ Automatic Optimizations (No Manual Work Needed)

When React Compiler is enabled, these patterns are **automatically optimized** - you don't need to manually apply them:

**Memoization:**
- **1.2 Extract to Memoized Components** - Compiler auto-memoizes components
- Components wrapped with `memo()` - Compiler does this automatically
- Values wrapped with `useMemo()` - Compiler memoizes automatically
- Callbacks wrapped with `useCallback()` - Compiler stabilizes automatically

**Static Extraction:**
- **2.3 Hoist Static JSX Elements** - Compiler hoists automatically
- **2.7 Hoist RegExp Creation** - Compiler hoists automatically

**Effect Dependencies:**
- Stable callback references in dependency arrays - Compiler handles this

---

## What React Compiler Does NOT Handle

### ❌ Manual Optimizations Still Required

Even with React Compiler enabled, you still need to manually apply these patterns:

**State Management Patterns:**
- **1.1 Defer State Reads** - Compiler can't know you don't need subscription
- **1.4 Subscribe to Derived State** - Requires semantic understanding of intent
- **1.5 Functional setState Updates** - Compiler can't infer functional updates
- **1.6 Lazy State Initialization** - Requires function wrapper syntax

**Effect Optimizations:**
- **1.3 Narrow Effect Dependencies** - Requires code restructuring
- **3.1 Store Event Handlers in Refs** - Requires useEffectEvent pattern

**Rendering Performance:**
- **1.7 Transitions for Non-Urgent Updates** - Requires explicit `startTransition()`
- **2.1 Animate SVG Wrapper** - Requires DOM structure change
- **2.2 CSS content-visibility** - CSS optimization, not React code
- **2.4 Optimize SVG Precision** - Build-time SVG optimization
- **2.5 Prevent Hydration Mismatch** - Requires explicit SSR handling
- **2.6 Activity Component** - Requires React 19 `<Activity>` component
- **2.8 Avoid useMemo For Simple Expressions** - Code simplification preference

**Advanced Patterns:**
- **3.2 useLatest for Stable Callbacks** - Custom hook pattern
- **3.3 Cache Repeated Function Calls** - Module-level caching

**React 19 Migration:**
- **4.1 Named Imports** - Import syntax requirement
- **4.2 No forwardRef** - API migration requirement

---

## Decision Guide: Should I Optimize Manually?

### Step 1: Check for React Compiler

```bash
# Check package.json
grep -i "react-compiler" package.json

# Check babel config
cat babel.config.js | grep -i compiler

# Check Next.js config
cat next.config.js | grep -i compiler
```

### Step 2: Apply the Right Strategy

**If React Compiler is ENABLED:**
- Skip manual `memo()`, `useMemo()`, `useCallback()` - compiler handles it
- Skip hoisting static JSX/RegExp - compiler handles it
- Still apply all other optimizations from this guide

**If React Compiler is NOT enabled:**
- Apply all optimizations from this guide as needed
- Manual memoization is necessary and beneficial

### Step 3: When in Doubt

If you're unsure whether a project uses React Compiler:
1. Ask the user
2. Check the build configuration files
3. Assume it's NOT enabled and apply manual optimizations (safer default)

---

## Migration Path

### If Adding React Compiler to Existing Project

1. **Before enabling compiler:**
   - Ensure code follows React rules (no conditional hooks, etc.)
   - Remove ESLint disables for react-hooks rules

2. **After enabling compiler:**
   - Remove manual `memo()` wrapping (compiler does this)
   - Remove unnecessary `useMemo()` for simple values
   - Remove unnecessary `useCallback()` for event handlers
   - Keep all other optimizations (state management, effects, CSS, etc.)

3. **Keep these patterns:**
   - Functional setState updates
   - Lazy state initialization
   - Narrow effect dependencies
   - Transitions for non-urgent updates
   - All CSS/rendering optimizations
   - All React 19 migration patterns

---

## Quick Reference

| Pattern | Auto with Compiler? | Manual Still Needed? |
|---------|---------------------|----------------------|
| memo() components | ✅ Yes | ❌ No |
| useMemo() values | ✅ Yes | ❌ No |
| useCallback() handlers | ✅ Yes | ❌ No |
| Hoist static JSX | ✅ Yes | ❌ No |
| Hoist RegExp | ✅ Yes | ❌ No |
| Defer state reads | ❌ No | ✅ Yes |
| Functional setState | ❌ No | ✅ Yes |
| Lazy initialization | ❌ No | ✅ Yes |
| Narrow dependencies | ❌ No | ✅ Yes |
| Transitions | ❌ No | ✅ Yes |
| CSS optimizations | ❌ No | ✅ Yes |
| SSR/Hydration | ❌ No | ✅ Yes |
| Advanced patterns | ❌ No | ✅ Yes |

---

## Common Mistakes

### ❌ Over-optimizing with Compiler Enabled

```tsx
// DON'T: Manual memo when compiler is enabled
const MemoizedComponent = memo(function MyComponent() {
  // ... compiler already memoizes this
})

// DON'T: Manual useMemo for simple values
const doubled = useMemo(() => count * 2, [count])
// Compiler handles this automatically
```

### ✅ Right Approach with Compiler

```tsx
// DO: Write clean code, let compiler optimize
function MyComponent({ count }) {
  const doubled = count * 2
  return <div>{doubled}</div>
}

// DO: Still use functional updates
setCount(curr => curr + 1)

// DO: Still use transitions
startTransition(() => {
  setSearchResults(newResults)
})
```

---

## When to Reference This Guide

Load this reference when:
- Determining which optimizations to apply
- Project has React Compiler and you're unsure what's still needed
- Migrating to/from React Compiler
- User asks "Do I need to memoize this with React Compiler?"
