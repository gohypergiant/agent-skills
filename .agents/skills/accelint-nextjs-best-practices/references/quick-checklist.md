# Quick Reference Checklists

Quick checklists for common Next.js scenarios. Use these for systematic reviews and new code creation.

---

## New Server Action Checklist

When creating a new Server Action:

- [ ] Add `'use server'` directive at top of file or function
- [ ] Validate all inputs with Zod schema
- [ ] Add authentication check (`await requireAuth()`)
- [ ] Add authorization check (ownership, role, etc.)
- [ ] Handle errors with proper error messages
- [ ] Consider rate limiting for sensitive actions
- [ ] Use `after()` for audit logging if needed
- [ ] Return type-safe response object

**Example:**
```tsx
'use server'

import { z } from 'zod'
import { requireAuth } from '@/lib/auth'

const schema = z.object({
  postId: z.string().uuid(),
  title: z.string().min(1).max(100)
})

export async function updatePost(data: unknown) {
  const validated = schema.parse(data)
  const session = await requireAuth()

  const post = await db.post.findUnique({ where: { id: validated.postId } })
  if (post.authorId !== session.user.id) {
    throw new Error('Not authorized')
  }

  await db.post.update({
    where: { id: validated.postId },
    data: { title: validated.title }
  })

  return { success: true }
}
```

---

## New API Route Checklist

When creating a new API route:

- [ ] Validate all inputs
- [ ] Add authentication check
- [ ] Start independent operations immediately (no waterfalls)
- [ ] Use `Promise.allSettled()` for parallel operations
- [ ] Use `after()` for logging/analytics
- [ ] Return proper status codes
- [ ] Set appropriate headers
- [ ] Handle errors with proper responses

**Example:**
```tsx
import { auth } from '@/lib/auth'
import { after } from 'next/server'

export async function GET(request: Request) {
  // Start independent operations immediately
  const sessionPromise = auth()
  const configPromise = fetchConfig()

  const session = await sessionPromise
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [config, data] = await Promise.allSettled([
    configPromise,
    fetchData(session.user.id)
  ])

  // Log after response
  after(() => logRequest(request))

  return Response.json({ data, config })
}
```

---

## New Server Component Checklist

When creating a new Server Component:

- [ ] NO `'use client'` directive (Server Components are default)
- [ ] Use `async` function if fetching data
- [ ] Start independent fetches immediately
- [ ] Consider Suspense boundaries to prevent blocking
- [ ] Pass only necessary fields to client components
- [ ] Avoid transforming data (share references)
- [ ] Use `React.cache()` for repeated queries

**Example:**
```tsx
// Server Component (no directive needed)
async function Page() {
  // Start fetch immediately but don't await yet
  const dataPromise = fetchData()

  return (
    <div>
      <Header />
      <Suspense fallback={<Skeleton />}>
        <Content dataPromise={dataPromise} />
      </Suspense>
      <Footer />
    </div>
  )
}

async function Content({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise)
  return <div>{data.content}</div>
}
```

---

## New Client Component Checklist

When creating a new Client Component:

- [ ] Add `'use client'` directive at top of file
- [ ] Only add when you need: hooks, events, or browser APIs
- [ ] Keep client components small and focused
- [ ] Accept Server Components as children when possible
- [ ] Use functional setState to avoid stale closures
- [ ] Consider transitions for non-urgent updates

**Example:**
```tsx
'use client'

import { useState, useTransition } from 'react'

export function SearchForm({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      // Non-urgent update
      router.push(`/search?q=${query}`)
    })
  }

  return (
    <form onSubmit={handleSearch}>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button disabled={isPending}>Search</button>
      {children} {/* Server Component can be passed here */}
    </form>
  )
}
```

---

## Performance Review Checklist

When reviewing existing Next.js code:

**Security:**
- [ ] All Server Actions have authentication
- [ ] All Server Actions validate inputs
- [ ] Authorization checks before mutations

**Waterfalls:**
- [ ] Independent operations start immediately
- [ ] Use `Promise.allSettled()` for parallel ops
- [ ] No sequential awaits for independent data

**Serialization:**
- [ ] Only necessary fields passed to client
- [ ] No duplicate serialization (share references)
- [ ] Transformations happen on client when possible

**Suspense:**
- [ ] Suspense boundaries prevent blocking wrapper UI
- [ ] Promises shared across components
- [ ] Skeleton/fallback states provided

**Caching:**
- [ ] `React.cache()` used for repeated queries
- [ ] No inline objects as cache keys
- [ ] Auth checks are cached

**Imports:**
- [ ] No barrel file imports from large libraries
- [ ] Direct imports from source files

**Component Boundaries:**
- [ ] Server Components by default
- [ ] `'use client'` only when necessary
- [ ] Server/Client boundaries preserved with composition

---

## Migration from Pages Router Checklist

When migrating from Pages Router to App Router:

- [ ] Convert `getServerSideProps` to async Server Components
- [ ] Convert `getStaticProps` to async Server Components with caching
- [ ] Convert API routes to Server Actions where appropriate
- [ ] Add authentication to all Server Actions
- [ ] Use `'use client'` for interactive components
- [ ] Move data fetching closer to components
- [ ] Use Suspense for loading states
- [ ] Replace `useRouter` from `next/navigation` not `next/router`
- [ ] Update middleware if needed for App Router

---

## Common Anti-Patterns to Avoid

**❌ Don't:**
- Create Server Actions without authentication
- Await sequentially when operations are independent
- Pass entire objects when only 1-2 fields are used
- Await data before rendering wrapper UI (blocks everything)
- Use inline objects as `React.cache()` keys
- Block responses with logging/analytics
- Import from barrel files (`lucide-react`, `@mui/material`)
- Add `'use client'` to static components
- Import Server Components into Client Components

**✅ Do:**
- Authenticate inside every Server Action
- Start all independent operations immediately
- Pass only necessary fields as individual props
- Use Suspense boundaries to show wrapper UI fast
- Extract cache keys to constants
- Use `after()` for non-blocking work
- Import directly from source files
- Default to Server Components
- Pass Server Components as children to Client Components

---

## Quick Wins

High-impact, low-effort optimizations:

1. **Add auth to Server Actions** (5 min) - Critical security fix
2. **Fix waterfall chains** (10 min) - 2-10x faster responses
3. **Fix barrel imports** (5 min per file) - Faster dev server
4. **Add Suspense boundaries** (10 min) - Faster perceived load
5. **Use `after()` for logging** (5 min) - Faster responses
6. **Minimize RSC serialization** (10 min) - Smaller HTML

