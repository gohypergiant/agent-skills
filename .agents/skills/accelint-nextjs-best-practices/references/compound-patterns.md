# Compound Patterns

Real-world examples showing multiple Next.js optimization patterns working together.

## Why This Matters

In production applications, you'll often combine multiple patterns to achieve optimal performance and security. These examples show how patterns complement each other.

---

## Example 1: Optimized Dashboard

This dashboard combines authentication, parallel fetching, Suspense boundaries, serialization optimization, and caching.

**Patterns Used:**
- 2.1 Authenticate Server Actions
- 1.2 Parallelize Independent Operations
- 1.3 Strategic Suspense Boundaries
- 2.3 Minimize Serialization
- 2.5 React.cache() Deduplication

```tsx
// lib/auth.ts
import { cache } from 'react'

// 2.5: Cache auth check across components
export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null

  return await db.user.findUnique({
    where: { id: session.user.id }
  })
})

// app/dashboard/page.tsx
export default function DashboardPage() {
  // 1.2: Start all fetches immediately in parallel
  const userPromise = getCurrentUser()
  const statsPromise = fetchStats()
  const activityPromise = fetchActivity()

  return (
    <div>
      {/* 1.3: Suspense boundaries for progressive rendering */}
      <Suspense fallback={<UserSkeleton />}>
        <UserHeader userPromise={userPromise} />
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <Stats statsPromise={statsPromise} />
      </Suspense>

      <Suspense fallback={<ActivitySkeleton />}>
        <Activity activityPromise={activityPromise} />
      </Suspense>
    </div>
  )
}

// Components
async function UserHeader({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise)

  if (!user) redirect('/login')

  // 2.3: Pass only necessary fields
  return <ClientUserHeader name={user.name} avatar={user.avatar} />
}

'use client'
function ClientUserHeader({ name, avatar }: { name: string; avatar: string }) {
  return (
    <header>
      <img src={avatar} alt={name} />
      <h1>{name}</h1>
    </header>
  )
}

async function Stats({ statsPromise }: { statsPromise: Promise<Stats> }) {
  const stats = use(statsPromise)

  // 2.3: Extract only displayed values
  return (
    <ClientStats
      total={stats.total}
      change={stats.percentChange}
      trending={stats.trending}
    />
  )
}

'use client'
function ClientStats({
  total,
  change,
  trending
}: {
  total: number
  change: number
  trending: boolean
}) {
  return (
    <div className={change > 0 ? 'positive' : 'negative'}>
      <p>Total: {total}</p>
      <p>{change > 0 ? '+' : ''}{change}%</p>
      {trending && <span>🔥 Trending</span>}
    </div>
  )
}

// app/dashboard/actions.ts
'use server'

import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'

const updatePrefsSchema = z.object({
  theme: z.enum(['light', 'dark']),
  notifications: z.boolean()
})

// 2.1: Authenticate Server Action
export async function updatePreferences(data: unknown) {
  const validated = updatePrefsSchema.parse(data)

  // 2.5: Cached auth check (no duplicate query)
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  await db.user.update({
    where: { id: user.id },
    data: { preferences: validated }
  })

  return { success: true }
}
```

**Performance Impact:**
- 3 parallel fetches instead of sequential (3x faster)
- Progressive rendering (header shows while stats/activity load)
- Minimal serialization (only 5 fields vs entire objects)
- Single auth query for entire request (cached)

---

## Example 2: API Route with Complete Optimization

This API route demonstrates waterfall prevention, parallelization, authentication, and non-blocking logging.

**Patterns Used:**
- 1.1 Prevent Waterfall Chains
- 1.2 Parallelize Independent Operations
- 2.5 React.cache() Deduplication
- 2.6 Use after() for Non-Blocking Operations

```tsx
// app/api/report/route.ts
import { after } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  // 1.1: Start independent operations immediately
  const userPromise = getCurrentUser()
  const configPromise = fetchConfig()

  // Await auth when needed
  const user = await userPromise
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1.2: Parallelize independent fetches
  const [config, analytics, trends] = await Promise.allSettled([
    configPromise,
    fetchAnalytics(user.id),
    fetchTrends(user.id)
  ])

  // 2.6: Log after response is sent (non-blocking)
  after(async () => {
    await logApiRequest({
      userId: user.id,
      endpoint: '/api/report',
      timestamp: new Date()
    })
  })

  return Response.json({
    config: config.status === 'fulfilled' ? config.value : null,
    analytics: analytics.status === 'fulfilled' ? analytics.value : null,
    trends: trends.status === 'fulfilled' ? trends.value : []
  })
}
```

**Performance Impact:**
- Auth + config start in parallel (50% faster)
- Analytics + trends run in parallel (2x faster)
- Logging doesn't block response (44% faster)
- Auth cached if multiple API calls in same request

---

## Example 3: Server Component Data Fetching

Optimal data fetching with component composition and Suspense.

**Patterns Used:**
- 2.4 Parallel Data Fetching with Component Composition
- 1.3 Strategic Suspense Boundaries
- 2.2 Avoid Duplicate Serialization
- 2.5 React.cache() Deduplication

```tsx
// app/posts/[id]/page.tsx
import { cache } from 'react'

// 2.5: Cache database queries
const getPost = cache(async (id: string) => {
  return await db.post.findUnique({
    where: { id },
    include: { author: true }
  })
})

const getComments = cache(async (postId: string) => {
  return await db.comment.findMany({
    where: { postId },
    include: { author: true }
  })
})

const getRelatedPosts = cache(async (postId: string) => {
  const post = await getPost(postId) // Cache hit!
  return await db.post.findMany({
    where: {
      tags: { hasSome: post.tags },
      NOT: { id: postId }
    },
    take: 5
  })
})

// 2.4: Sibling components fetch in parallel
export default function PostPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* All three fetch in parallel */}
      <Suspense fallback={<PostSkeleton />}>
        <PostContent postId={params.id} />
      </Suspense>

      <Suspense fallback={<CommentsSkeleton />}>
        <Comments postId={params.id} />
      </Suspense>

      <Suspense fallback={<RelatedSkeleton />}>
        <RelatedPosts postId={params.id} />
      </Suspense>
    </div>
  )
}

async function PostContent({ postId }: { postId: string }) {
  const post = await getPost(postId)

  // 2.2: Don't transform on server (share reference)
  return <ClientPostDisplay post={post} />
}

'use client'
function ClientPostDisplay({ post }: { post: Post }) {
  // 2.2: Transform on client
  const formattedDate = useMemo(
    () => new Date(post.createdAt).toLocaleDateString(),
    [post.createdAt]
  )

  return (
    <article>
      <h1>{post.title}</h1>
      <p>By {post.author.name} on {formattedDate}</p>
      <div>{post.content}</div>
    </article>
  )
}

async function Comments({ postId }: { postId: string }) {
  const comments = await getComments(postId)

  // 2.2: Share reference, don't duplicate
  return <ClientComments comments={comments} />
}

async function RelatedPosts({ postId }: { postId: string }) {
  const related = await getRelatedPosts(postId)

  // 2.3: Only pass fields needed for display
  const summaries = related.map(p => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt
  }))

  return <ClientRelatedPosts posts={summaries} />
}
```

**Performance Impact:**
- 3 components fetch in parallel (3x faster than sequential)
- Post fetched once, reused in RelatedPosts (cache hit)
- No serialization duplication (share references)
- Progressive rendering (each section streams independently)

---

## Example 4: Form with Server Action

Secure form submission with validation, authentication, and optimistic updates.

**Patterns Used:**
- 2.1 Authenticate Server Actions
- 1.1 Prevent Waterfall Chains
- 2.6 Use after() for Non-Blocking Operations

```tsx
// app/posts/new/page.tsx
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { createPost } from './actions'

export default function NewPostPage() {
  const [state, formAction] = useFormState(createPost, null)

  return (
    <form action={formAction}>
      <input name="title" required />
      <textarea name="content" required />
      <SubmitButton />
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  )
}

// app/posts/new/actions.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

const createPostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(10)
})

export async function createPost(prevState: any, formData: FormData) {
  // 1.1: Start validation and auth in parallel
  const validationPromise = createPostSchema.safeParseAsync({
    title: formData.get('title'),
    content: formData.get('content')
  })
  const userPromise = getCurrentUser()

  // Await validation first (fast)
  const validation = await validationPromise
  if (!validation.success) {
    return { error: 'Invalid input' }
  }

  // 2.1: Authenticate
  const user = await userPromise
  if (!user) {
    return { error: 'Must be logged in' }
  }

  // Create post
  const post = await db.post.create({
    data: {
      ...validation.data,
      authorId: user.id
    }
  })

  // 2.6: Send notifications after response
  after(async () => {
    await sendNotificationToFollowers(user.id, post.id)
    await indexPostForSearch(post.id)
  })

  revalidatePath('/posts')
  redirect(`/posts/${post.id}`)
}
```

**Performance Impact:**
- Validation + auth start in parallel
- Notifications don't block redirect (faster UX)
- Proper authentication (security)
- Optimistic UI updates with useFormStatus

---

## Example 5: Image Upload with Multiple Optimizations

Complex Server Action combining many patterns.

**Patterns Used:**
- 2.1 Authenticate Server Actions
- 1.2 Parallelize Independent Operations
- 2.6 Use after() for Non-Blocking Operations

```tsx
'use server'

import { z } from 'zod'
import { put } from '@vercel/blob'
import { after } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

const uploadSchema = z.object({
  filename: z.string(),
  contentType: z.string()
})

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')

  // 1.2: Validate and auth in parallel
  const [validation, user] = await Promise.allSettled([
    uploadSchema.parseAsync({
      filename: file.name,
      contentType: file.type
    }),
    getCurrentUser()
  ])

  if (validation.status === 'rejected') {
    throw new Error('Invalid file')
  }

  // 2.1: Authenticate
  if (user.status === 'rejected' || !user.value) {
    throw new Error('Unauthorized')
  }

  // Upload to blob storage
  const blob = await put(file.name, file, {
    access: 'public',
    contentType: file.type
  })

  // Save to database
  const image = await db.image.create({
    data: {
      url: blob.url,
      filename: file.name,
      userId: user.value.id
    }
  })

  // 2.6: Process image after response
  after(async () => {
    // Generate thumbnails
    await generateThumbnails(image.id, blob.url)

    // Update user storage quota
    await updateStorageQuota(user.value.id, file.size)

    // Log upload
    await logImageUpload(user.value.id, image.id)
  })

  return { success: true, imageUrl: blob.url }
}
```

**Performance Impact:**
- Validation + auth in parallel (faster)
- Image processing doesn't block response
- Quota updates don't block response
- User gets immediate feedback

---

## Key Takeaways

1. **Combine patterns strategically** - Multiple patterns working together amplify benefits
2. **Start with security** - Always authenticate Server Actions first
3. **Parallelize everything** - Independent operations should never be sequential
4. **Use Suspense liberally** - Progressive rendering improves perceived performance
5. **Minimize serialization** - Only send what the client needs
6. **Cache intelligently** - Use React.cache() for deduplication
7. **Defer non-critical work** - Use after() for logging, notifications, etc.

---

## Related Patterns

- [1.1 Prevent Waterfall Chains](./prevent-waterfall-chains.md)
- [1.2 Parallelize Independent Operations](./parallelize-independent-operations.md)
- [1.3 Strategic Suspense Boundaries](./strategic-suspense-boundaries.md)
- [2.1 Authenticate Server Actions](./server-actions-security.md)
- [2.2 Avoid Duplicate Serialization](./avoid-duplicate-serialization.md)
- [2.3 Minimize Serialization](./minimize-serialization.md)
- [2.4 Parallel Data Fetching](./parallel-data-fetching.md)
- [2.5 React.cache() Deduplication](./react-cache-deduplication.md)
- [2.6 Use after() for Non-Blocking Operations](./use-after-non-blocking.md)
