# 1.3 Strategic Suspense Boundaries

Instead of awaiting data in async components before returning JSX, use Suspense boundaries to show the wrapper UI faster while data loads.

When you await data at the top level of a Server Component, the entire component tree waits before rendering. This blocks static content (headers, sidebars, footers) that could render immediately.

Suspense boundaries allow static UI to render while dynamic data loads, improving perceived performance.

**Impact:** Faster Time to First Byte (TTFB) and better user experience with progressive rendering.

**❌ Incorrect: wrapper blocked by data fetching**
```ts
async function Page() {
  const data = await fetchData() // Blocks entire page

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  )
}
```

**Problem:** The entire layout (Sidebar, Header, Footer) waits for `fetchData()` even though only the middle section needs it.

**✅ Correct: wrapper shows immediately, data streams in**
```ts
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <Suspense fallback={<Skeleton />}>
          <DataDisplay />
        </Suspense>
      </div>
      <div>Footer</div>
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData() // Only blocks this component
  return <div>{data.content}</div>
}
```

**Result:** Sidebar, Header, and Footer render immediately. Only DataDisplay shows a skeleton while waiting for data.

## Sharing Promises Across Components

When multiple components need the same data, start the fetch once and pass the promise to both:

**✅ Correct: share promise across components**
```ts
function Page() {
  // Start fetch immediately, but don't await
  const dataPromise = fetchData()

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay dataPromise={dataPromise} />
        <DataSummary dataPromise={dataPromise} />
      </Suspense>
      <div>Footer</div>
    </div>
  )
}

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Unwraps the promise
  return <div>{data.content}</div>
}

function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Reuses the same promise
  return <div>{data.summary}</div>
}
```

**Benefits:**
- Only one fetch occurs (shared promise)
- Layout renders immediately
- Both components wait together in the same Suspense boundary
- Single skeleton for both components

## Common Patterns

### Pattern 1: Multiple Suspense Boundaries
```tsx
function Page() {
  return (
    <div>
      <Header />

      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>

      <Suspense fallback={<CommentsSkeleton />}>
        <Comments />
      </Suspense>

      <Footer />
    </div>
  )
}

async function Posts() {
  const posts = await fetchPosts()
  return <PostsList posts={posts} />
}

async function Comments() {
  const comments = await fetchComments()
  return <CommentsList comments={comments} />
}
```

**Result:** Header and Footer render immediately, Posts and Comments stream in independently.

### Pattern 2: Nested Suspense
```tsx
function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Dashboard />
    </Suspense>
  )
}

async function Dashboard() {
  const user = await fetchUser()

  return (
    <div>
      <UserHeader user={user} />

      <Suspense fallback={<AnalyticsSkeleton />}>
        <Analytics userId={user.id} />
      </Suspense>

      <Suspense fallback={<ActivitySkeleton />}>
        <Activity userId={user.id} />
      </Suspense>
    </div>
  )
}

async function Analytics({ userId }: { userId: string }) {
  const analytics = await fetchAnalytics(userId)
  return <AnalyticsDisplay data={analytics} />
}

async function Activity({ userId }: { userId: string }) {
  const activity = await fetchActivity(userId)
  return <ActivityDisplay data={activity} />
}
```

**Result:**
1. Page skeleton shows immediately
2. After user loads, header shows with analytics/activity skeletons
3. Analytics and activity stream in independently

### Pattern 3: Promise Passing for Parallel Data
```tsx
function Page() {
  // Start all fetches immediately
  const userPromise = fetchUser()
  const postsPromise = fetchPosts()
  const commentsPromise = fetchComments()

  return (
    <div>
      <Suspense fallback={<UserSkeleton />}>
        <UserProfile userPromise={userPromise} />
      </Suspense>

      <Suspense fallback={<PostsSkeleton />}>
        <PostsList postsPromise={postsPromise} />
      </Suspense>

      <Suspense fallback={<CommentsSkeleton />}>
        <CommentsList commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  )
}

async function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise)
  return <div>{user.name}</div>
}

async function PostsList({ postsPromise }: { postsPromise: Promise<Post[]> }) {
  const posts = use(postsPromise)
  return <div>{posts.map(renderPost)}</div>
}

async function CommentsList({ commentsPromise }: { commentsPromise: Promise<Comment[]> }) {
  const comments = use(commentsPromise)
  return <div>{comments.map(renderComment)}</div>
}
```

**Benefits:**
- All three fetches start immediately in parallel
- Each section streams in as its data becomes available
- No waterfall chains

## The `use()` Hook

The `use()` hook unwraps promises in React components (React 19+):

```tsx
import { use } from 'react'

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise)
  return <div>{data.content}</div>
}
```

**Benefits:**
- Suspends the component until the promise resolves
- Can be used conditionally (unlike hooks)
- Integrates with Suspense boundaries

## Related Patterns

- [1.1 Prevent Waterfall Chains](./prevent-waterfall-chains.md) - Start fetches immediately
- [1.2 Parallelize Independent Operations](./parallelize-independent-operations.md) - Use Promise.allSettled()
- [2.4 Parallel Data Fetching](./parallel-data-fetching.md) - Component composition

## References

- [React Suspense Documentation](https://react.dev/reference/react/Suspense)
- [React use() Hook](https://react.dev/reference/react/use)
- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
