# 2.5 Per-Request Deduplication with React.cache()

Use `React.cache()` for server-side request deduplication. Authentication and database queries benefit most.

In a single request, the same data might be needed by multiple Server Components. Without caching, each component would run the same query, wasting database connections and time.

`React.cache()` ensures each unique function call runs only once per request, with subsequent calls returning the cached result.

**Impact:** Fewer database queries, faster responses, reduced server load.

## The Pattern

Wrap async functions with `cache()` to deduplicate calls within a single request.

**Basic Usage:**
```typescript
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  return await db.user.findUnique({
    where: { id: session.user.id }
  })
})
```

**Result:** Within a single request, multiple calls to `getCurrentUser()` execute the query only once.
```tsx
// Page Component
async function Page() {
  const user = await getCurrentUser()  // Query runs
  return <Layout><Content /></Layout>
}

// Layout Component
async function Layout({ children }) {
  const user = await getCurrentUser()  // Cache hit! No query
  return <header>{user?.name}</header>
}

// Content Component
async function Content() {
  const user = await getCurrentUser()  // Cache hit! No query
  return <div>{user?.email}</div>
}

// Total: 1 database query instead of 3
```

## Avoid Inline Objects as Arguments

`React.cache()` uses shallow equality (`Object.is`) to determine cache hits. Inline objects create new references each call, preventing cache hits.

**❌ Incorrect: always cache miss**
```tsx
const getUser = cache(async (params: { uid: number }) => {
  return await db.user.findUnique({ where: { id: params.uid } })
})

// Each call creates new object, never hits cache
getUser({ uid: 1 })  // Query runs
getUser({ uid: 1 })  // Query runs again! (new object reference)
```

**✅ Correct: cache hit with primitives**
```tsx
const getUser = cache(async (uid: number) => {
  return await db.user.findUnique({ where: { id: uid } })
})

// Primitive values compared by value
getUser(1)  // Query runs
getUser(1)  // Cache hit! (same value)
```

**✅ Correct: cache hit with same reference**
```tsx
const getUser = cache(async (params: { uid: number }) => {
  return await db.user.findUnique({ where: { id: params.uid } })
})

const params = { uid: 1 }
getUser(params)  // Query runs
getUser(params)  // Cache hit! (same reference)
```

## Common Patterns

### Pattern 1: Authentication Check
```typescript
import { cache } from 'react'
import { auth } from '@/lib/auth'

export const getCurrentUser = cache(async () => {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  return await db.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true }
  })
})
```

**Usage in multiple components:**
```tsx
// Header.tsx
async function Header() {
  const user = await getCurrentUser()  // Query once
  return <div>{user?.name}</div>
}

// Sidebar.tsx
async function Sidebar() {
  const user = await getCurrentUser()  // Cache hit
  return <nav>{user?.profile?.bio}</nav>
}

// Page.tsx
async function Page() {
  const user = await getCurrentUser()  // Cache hit
  if (!user) redirect('/login')
  return <div>Welcome {user.name}</div>
}
```

### Pattern 2: Database Queries with Parameters
```typescript
import { cache } from 'react'

// ✅ Use primitive parameters
export const getPost = cache(async (postId: string) => {
  return await db.post.findUnique({
    where: { id: postId },
    include: { author: true, comments: true }
  })
})

// ✅ Use multiple primitives
export const getPostsByUser = cache(async (userId: string, status: string) => {
  return await db.post.findMany({
    where: { authorId: userId, status }
  })
})
```

### Pattern 3: Expensive Computations
```typescript
import { cache } from 'react'

export const calculateAnalytics = cache(async (userId: string) => {
  const [posts, comments, likes] = await Promise.all([
    db.post.count({ where: { authorId: userId } }),
    db.comment.count({ where: { authorId: userId } }),
    db.like.count({ where: { userId } })
  ])

  // Expensive computation
  const score = calculateEngagementScore(posts, comments, likes)

  return { posts, comments, likes, score }
})
```

### Pattern 4: File System Operations
```typescript
import { cache } from 'react'
import { readFile } from 'fs/promises'

export const getMarkdownContent = cache(async (slug: string) => {
  const content = await readFile(`./content/${slug}.md`, 'utf-8')
  return parseMarkdown(content)
})
```

## Next.js-Specific Note

In Next.js, the `fetch` API is automatically extended with request memoization. Requests with the same URL and options are automatically deduplicated within a single request.

**fetch() is auto-cached:**
```tsx
// No React.cache() needed for fetch
async function Component1() {
  const data = await fetch('/api/data')  // Request sent
}

async function Component2() {
  const data = await fetch('/api/data')  // Cache hit! No request
}
```

**React.cache() is still essential for:**
- Database queries (Prisma, Drizzle, etc.)
- Heavy computations
- Authentication checks
- File system operations
- Any non-fetch async work

## Debugging Cache Hits/Misses

Add logging to see cache behavior:

```typescript
import { cache } from 'react'

export const getUser = cache(async (id: string) => {
  console.log(`[CACHE MISS] Fetching user ${id}`)
  const user = await db.user.findUnique({ where: { id } })
  return user
})

// Call multiple times
await getUser('123')  // Logs: [CACHE MISS] Fetching user 123
await getUser('123')  // No log (cache hit)
await getUser('456')  // Logs: [CACHE MISS] Fetching user 456
```

## Cache Scope

**Important:** React.cache() is **per-request** only:

- ✅ Dedupe within single request/render
- ❌ Does NOT cache across requests
- ❌ Does NOT persist between renders
- ❌ Does NOT work like SWR/React Query

```tsx
// Request 1
await getUser(1)  // Query runs
await getUser(1)  // Cache hit

// Request 2 (new user visits page)
await getUser(1)  // Query runs again (new request)
```

## Related Patterns

- [2.1 Authenticate Server Actions](./server-actions-security.md) - Cache auth checks
- [1.2 Parallelize Independent Operations](./parallelize-independent-operations.md) - Combine with Promise.allSettled()
- [2.4 Parallel Data Fetching](./parallel-data-fetching.md) - Composition patterns

## References

- [React.cache() Documentation](https://react.dev/reference/react/cache)
- [Next.js Request Memoization](https://nextjs.org/docs/app/building-your-application/caching#request-memoization)
