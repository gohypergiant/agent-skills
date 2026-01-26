# 1.2 Parallelize Independent Operations

When async operations have no interdependencies, execute them concurrently using Promise.allSettled().

## Why This Matters

Independent async operations should run in parallel, not sequentially. Sequential execution wastes time waiting for each operation to complete before starting the next one.

**Impact:** 3-10x faster when you have multiple independent operations.

## The Pattern

Use `Promise.allSettled()` to run all independent operations at once.

**❌ Incorrect: sequential execution, 3 round trips**
```ts
const user = await fetchUser()       // Wait 100ms
const posts = await fetchPosts()     // Wait another 100ms
const comments = await fetchComments() // Wait another 100ms
// Total: 300ms
```

**✅ Correct: parallel execution, 1 round trip**
```ts
const [user, posts, comments] = await Promise.allSettled([
  fetchUser(),      // All three start immediately
  fetchPosts(),
  fetchComments()
])
// Total: 100ms (max of all three)
```

## Promise.allSettled() vs Promise.all()

**Use `Promise.allSettled()`** - Returns all results, even if some fail:
```ts
const [user, posts, comments] = await Promise.allSettled([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])

// Check individual results
if (user.status === 'fulfilled') {
  console.log(user.value)
} else {
  console.error('User fetch failed:', user.reason)
}

if (posts.status === 'fulfilled') {
  console.log(posts.value)
}
```

**Avoid `Promise.all()`** - Fails fast if any promise rejects:
```ts
// Bad: if fetchPosts() fails, you lose user and comments too
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),  // If this fails, everything fails
  fetchComments()
])
```

## Common Patterns

### Pattern 1: API Routes with Multiple Fetches
```ts
export async function GET(request: Request) {
  const [user, posts, analytics] = await Promise.allSettled([
    fetchUser(),
    fetchPosts(),
    fetchAnalytics()
  ])

  return Response.json({
    user: user.status === 'fulfilled' ? user.value : null,
    posts: posts.status === 'fulfilled' ? posts.value : [],
    analytics: analytics.status === 'fulfilled' ? analytics.value : null
  })
}
```

### Pattern 2: Server Actions with Parallel Validation
```ts
'use server'

export async function createPost(formData: FormData) {
  // Validate multiple things in parallel
  const [titleValid, contentValid, imageValid] = await Promise.allSettled([
    validateTitle(formData.get('title')),
    validateContent(formData.get('content')),
    validateImage(formData.get('image'))
  ])

  // Check results
  if (titleValid.status === 'rejected') {
    throw new Error(titleValid.reason)
  }

  // Proceed with creation
  await db.post.create({ data: { /* ... */ } })
}
```

### Pattern 3: Multiple Database Queries
```ts
async function getDashboardData(userId: string) {
  const [profile, orders, notifications, preferences] = await Promise.allSettled([
    db.user.findUnique({ where: { id: userId } }),
    db.order.findMany({ where: { userId } }),
    db.notification.findMany({ where: { userId } }),
    db.preference.findUnique({ where: { userId } })
  ])

  return {
    profile: profile.status === 'fulfilled' ? profile.value : null,
    orders: orders.status === 'fulfilled' ? orders.value : [],
    notifications: notifications.status === 'fulfilled' ? notifications.value : [],
    preferences: preferences.status === 'fulfilled' ? preferences.value : null
  }
}
```

### Pattern 4: Parallel External API Calls
```ts
export async function GET(request: Request) {
  const [weather, news, stocks] = await Promise.allSettled([
    fetch('https://api.weather.com/...').then(r => r.json()),
    fetch('https://api.news.com/...').then(r => r.json()),
    fetch('https://api.stocks.com/...').then(r => r.json())
  ])

  return Response.json({
    weather: weather.status === 'fulfilled' ? weather.value : null,
    news: news.status === 'fulfilled' ? news.value : [],
    stocks: stocks.status === 'fulfilled' ? stocks.value : null
  })
}
```

## Handling Results

### Destructuring with Status Check
```ts
const [userResult, postsResult] = await Promise.allSettled([
  fetchUser(),
  fetchPosts()
])

// Extract values with defaults
const user = userResult.status === 'fulfilled' ? userResult.value : null
const posts = postsResult.status === 'fulfilled' ? postsResult.value : []
```

### Helper Function for Cleaner Code
```ts
function getSettledValue<T>(result: PromiseSettledResult<T>, defaultValue: T): T {
  return result.status === 'fulfilled' ? result.value : defaultValue
}

const [user, posts, comments] = await Promise.allSettled([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])

const userData = getSettledValue(user, null)
const postsData = getSettledValue(posts, [])
const commentsData = getSettledValue(comments, [])
```

## Performance Impact

**Example timing with 3 operations (each 100ms):**
- Sequential: 100ms + 100ms + 100ms = **300ms total**
- Parallel: max(100ms, 100ms, 100ms) = **100ms total**

**Result:** 3x faster

**With 5 operations:**
- Sequential: 5 × 100ms = **500ms total**
- Parallel: 100ms = **100ms total**

**Result:** 5x faster

## What NOT to Do

**❌ Don't await in a loop**
```ts
// Bad: sequential
const results = []
for (const id of userIds) {
  results.push(await fetchUser(id))
}

// Good: parallel
const results = await Promise.allSettled(
  userIds.map(id => fetchUser(id))
)
```

**❌ Don't use Promise.all() unless you want fail-fast behavior**
```ts
// If any fails, you lose all results
const results = await Promise.all([op1(), op2(), op3()])

// Better: get partial results even if some fail
const results = await Promise.allSettled([op1(), op2(), op3()])
```

## Related Patterns

- [1.1 Prevent Waterfall Chains](./prevent-waterfall-chains.md) - Start independent operations immediately
- [2.4 Parallel Data Fetching](./parallel-data-fetching.md) - Component composition for parallel RSC fetches
- [2.5 React.cache() Deduplication](./react-cache-deduplication.md) - Avoid refetching same data

## References

- [Promise.allSettled() MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [Promise.all() MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

---

**Related Sections:**
- AGENTS.md § 1.2
- Quick Checklist: API Route Checklist, Server Component Checklist
