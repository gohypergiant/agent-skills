# 2.4 Parallel Data Fetching with Component Composition

React Server Components execute sequentially within a tree. Restructure with composition to parallelize data fetching.

When an async Server Component awaits data, all children wait for it to complete before they can start rendering. This creates a waterfall even though the fetches are independent.

By restructuring with composition, sibling async components can fetch in parallel.

**Impact:** 2-5x faster page loads when components have independent data needs.

**❌ Incorrect: <Sidebar /> waits for <Page />'s fetch to complete**
```tsx
export default async function Page() {
  const header = await fetchHeader()  // Sidebar can't start until this completes
  return (
    <div>
      <div>{header}</div>
      <Sidebar />  {/* Waits for fetchHeader() */}
    </div>
  )
}

async function Sidebar() {
  const items = await fetchSidebarItems()  // Starts AFTER fetchHeader()
  return <nav>{items.map(renderItem)}</nav>
}

// Timeline:
// 0ms: fetchHeader() starts
// 100ms: fetchHeader() completes, Sidebar starts rendering
// 100ms: fetchSidebarItems() starts
// 200ms: fetchSidebarItems() completes
// Total: 200ms
```

**✅ Correct: both fetch simultaneously**
```tsx
async function Header() {
  const data = await fetchHeader()  // Starts immediately
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()  // Starts immediately (parallel)
  return <nav>{items.map(renderItem)}</nav>
}

export default function Page() {
  return (
    <div>
      <Header />   {/* Starts fetchHeader() */}
      <Sidebar />  {/* Starts fetchSidebarItems() in parallel */}
    </div>
  )
}

// Timeline:
// 0ms: Both fetches start in parallel
// 100ms: Both complete
// Total: 100ms (2x faster)
```

## Related Patterns

- [1.1 Prevent Waterfall Chains](./prevent-waterfall-chains.md) - API route parallelization
- [1.2 Parallelize Independent Operations](./parallelize-independent-operations.md) - Promise.allSettled()
- [1.3 Strategic Suspense Boundaries](./strategic-suspense-boundaries.md) - Progressive rendering
