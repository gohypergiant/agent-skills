# 2.4 Parallel Data Fetching with Component Composition

React Server Components execute sequentially within a tree. Restructure with composition to parallelize data fetching.

## Why This Matters

When an async Server Component awaits data, all children wait for it to complete before they can start rendering. This creates a waterfall even though the fetches are independent.

By restructuring with composition, sibling async components can fetch in parallel.

**Impact:** 2-5x faster page loads when components have independent data needs.

## The Pattern

Move data fetching out of parent components and into sibling components that render in parallel.

**❌ Incorrect: Sidebar waits for Page's fetch to complete**
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

## How It Works

React renders Server Components in parallel when they're siblings in the tree:

```tsx
// ❌ Sequential: Parent fetches first
async function Parent() {
  const data = await fetch() // Child waits
  return <Child />
}

// ✅ Parallel: Siblings fetch together
function Parent() {
  return (
    <>
      <ChildA /> {/* Fetches immediately */}
      <ChildB /> {/* Fetches immediately */}
    </>
  )
}

async function ChildA() {
  const data = await fetchA()
  return <div>{data}</div>
}

async function ChildB() {
  const data = await fetchB()
  return <div>{data}</div>
}
```

## Common Patterns

### Pattern 1: Extract Header to Component
```tsx
// ❌ Bad: sequential
export default async function Page() {
  const header = await fetchHeader()

  return (
    <div>
      <header>{header.title}</header>
      <Content />
      <Sidebar />
    </div>
  )
}

// ✅ Good: parallel
async function Header() {
  const header = await fetchHeader()
  return <header>{header.title}</header>
}

export default function Page() {
  return (
    <div>
      <Header />   {/* Fetches in parallel */}
      <Content />  {/* Fetches in parallel */}
      <Sidebar />  {/* Fetches in parallel */}
    </div>
  )
}
```

### Pattern 2: Layout with Children Prop
```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />    {/* Fetches in parallel */}
      {children}    {/* Fetches in parallel */}
    </div>
  )
}

export default function Page() {
  return (
    <Layout>
      <Sidebar />   {/* Fetches in parallel with Header */}
    </Layout>
  )
}
```

### Pattern 3: Dashboard with Multiple Widgets
```tsx
// ❌ Bad: fetches sequentially
export default async function Dashboard() {
  const user = await fetchUser()
  const stats = await fetchStats()

  return (
    <div>
      <UserInfo user={user} />
      <Stats data={stats} />
      <RecentActivity />
    </div>
  )
}

// ✅ Good: all fetch in parallel
async function UserInfo() {
  const user = await fetchUser()
  return <div>{user.name}</div>
}

async function Stats() {
  const stats = await fetchStats()
  return <div>{stats.total}</div>
}

async function RecentActivity() {
  const activity = await fetchActivity()
  return <div>{activity.map(renderItem)}</div>
}

export default function Dashboard() {
  return (
    <div>
      <UserInfo />        {/* All three fetch */}
      <Stats />           {/* in parallel */}
      <RecentActivity />
    </div>
  )
}
```

### Pattern 4: Combine with Suspense
```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Content() {
  const content = await fetchContent()
  return <div>{content}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

export default function Page() {
  return (
    <div>
      {/* Header renders first (fast) */}
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>

      {/* Content and Sidebar fetch in parallel, render independently */}
      <Suspense fallback={<ContentSkeleton />}>
        <Content />
      </Suspense>

      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
    </div>
  )
}
```

## When Dependencies Exist

If components have dependencies, use promise passing:

```tsx
// Content needs userId, which comes from User component
export default function Page() {
  const userPromise = fetchUser()  // Start immediately

  return (
    <div>
      <User userPromise={userPromise} />
      <Content userPromise={userPromise} />  {/* Shares promise */}
    </div>
  )
}

async function User({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise)
  return <div>{user.name}</div>
}

async function Content({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise)
  const content = await fetchContent(user.id)  // Waits for user, then fetches
  return <div>{content}</div>
}
```

## Performance Impact

**Example with 3 components:**
- Each fetch: 100ms
- Sequential: 300ms total
- Parallel: 100ms total
- **Result: 3x faster**

**Example with complex dashboard (5 widgets):**
- Each fetch: 200ms
- Sequential: 1000ms total
- Parallel: 200ms total
- **Result: 5x faster**

## What NOT to Do

**❌ Don't fetch in parent if children are independent**
```tsx
// Bad
async function Page() {
  const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()])
  return (
    <>
      <ComponentA data={a} />
      <ComponentB data={b} />
      <ComponentC data={c} />
    </>
  )
}

// Good: let components fetch themselves
function Page() {
  return (
    <>
      <ComponentA />
      <ComponentB />
      <ComponentC />
    </>
  )
}

async function ComponentA() {
  const data = await fetchA()
  return <div>{data}</div>
}
```

**❌ Don't over-nest async components**
```tsx
// Bad: creates waterfall
async function Layout() {
  const layout = await fetchLayout()
  return (
    <div>
      <Section />
    </div>
  )
}

async function Section() {
  const section = await fetchSection()  // Waits for Layout
  return <div><Widget /></div>
}

async function Widget() {
  const widget = await fetchWidget()  // Waits for Section
  return <div>{widget}</div>
}

// Good: flatten structure
function Layout() {
  return (
    <div>
      <LayoutHeader />
      <Section />
      <Widget />
    </div>
  )
}

async function LayoutHeader() {
  const layout = await fetchLayout()
  return <div>{layout}</div>
}

async function Section() {
  const section = await fetchSection()
  return <div>{section}</div>
}

async function Widget() {
  const widget = await fetchWidget()
  return <div>{widget}</div>
}
```

## Related Patterns

- [1.1 Prevent Waterfall Chains](./prevent-waterfall-chains.md) - API route parallelization
- [1.2 Parallelize Independent Operations](./parallelize-independent-operations.md) - Promise.allSettled()
- [1.3 Strategic Suspense Boundaries](./strategic-suspense-boundaries.md) - Progressive rendering

## References

- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Next.js Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)

---

**Related Sections:**
- AGENTS.md § 2.4
- Quick Checklist: Server Component Checklist
