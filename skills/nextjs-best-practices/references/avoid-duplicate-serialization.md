# 2.2 Avoid Duplicate Serialization in RSC Props

RSC→client serialization deduplicates by object reference, not value. Same reference = serialized once; new reference = serialized again. Do transformations (`.toSorted()`, `.filter()`, `.map()`) in client, not server.

## Why This Matters

When passing data from Server Components to Client Components, React serializes the data into the HTML response. Objects are deduplicated by **reference**, not by value.

Creating new references (via transformations) causes the same data to be serialized multiple times, bloating the HTML.

**Impact:** Reduced HTML size, faster page loads, less bandwidth usage.

## The Pattern

Pass the original data reference to the client and transform it there, rather than transforming on the server and creating new references.

**❌ Incorrect: duplicates array**
```tsx
// Server Component
async function Page() {
  const usernames = await fetchUsernames() // ['alice', 'bob', 'charlie']

  // ❌ Creates new array reference
  return <ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
}

// RSC serialization: sends 6 strings (2 arrays × 3 items)
// HTML: ["alice","bob","charlie"] AND ["alice","bob","charlie"]
```

**✅ Correct: sends 3 strings**
```tsx
// Server Component
async function Page() {
  const usernames = await fetchUsernames()

  // ✅ Pass original reference only
  return <ClientList usernames={usernames} />
}

// Client Component
'use client'
import { useMemo } from 'react'

function ClientList({ usernames }: { usernames: string[] }) {
  // Transform on the client
  const sorted = useMemo(() => [...usernames].sort(), [usernames])

  return <div>{sorted.map(renderUser)}</div>
}

// RSC serialization: sends 3 strings (1 array × 3 items)
// HTML: ["alice","bob","charlie"]
```

## How Deduplication Works

React serializes by **reference**, not value:

```tsx
const users = [{ id: 1 }, { id: 2 }]

// ✅ Same reference - serialized once
<Client data={users} alsoData={users} />
// Serialization: [{"id":1},{"id":2}] (referenced twice)

// ❌ New reference - serialized twice
<Client data={users} alsoData={[...users]} />
// Serialization: [{"id":1},{"id":2}] + [{"id":1},{"id":2}]
```

## Impact by Data Type

Deduplication works recursively, but impact varies:

**HIGH impact - primitives in arrays:**
```tsx
// ❌ Bad: 2000 numbers serialized
const nums = Array.from({ length: 1000 }, (_, i) => i)
<Client original={nums} doubled={nums.map(n => n * 2)} />

// ✅ Good: 1000 numbers serialized
<Client original={nums} />
// Client: const doubled = nums.map(n => n * 2)
```

**LOW impact - objects in arrays:**
```tsx
// Objects are deduplicated by reference even in new arrays
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]

// ❌ Still duplicates array wrapper, but objects deduplicated
<Client all={users} active={users.filter(u => u.active)} />
// Serialization: array wrapper duplicated, but user objects reused
```

**MEDIUM impact - nested data:**
```tsx
// Spreading breaks reference chain
const user = { id: 1, prefs: { theme: 'dark' } }

// ❌ New references at all levels
<Client user={{ ...user, prefs: { ...user.prefs } }} />

// ✅ Original reference preserved
<Client user={user} />
```

## Operations That Break Deduplication

### Arrays - Create New References
- `.toSorted()` / `.sort()` (returning new array)
- `.filter()`
- `.map()`
- `.slice()`
- `.concat()`
- Spread: `[...arr]`
- `Array.from()`

### Objects - Create New References
- Spread: `{...obj}`
- `Object.assign({}, obj)`
- `structuredClone(obj)`
- `JSON.parse(JSON.stringify(obj))`

### Primitives - Always Copied
Primitives (strings, numbers, booleans) don't have reference identity, so they're always duplicated:

```tsx
const count = 42

// No deduplication for primitives (but they're tiny)
<Client count={count} doubleCount={count * 2} />
```

## Common Patterns

### Pattern 1: Sort on Client
```tsx
// ❌ Server
<ClientTable data={data} sortedData={data.toSorted()} />

// ✅ Client
'use client'
function ClientTable({ data }: { data: Item[] }) {
  const sorted = useMemo(() => [...data].sort(), [data])
  return <Table data={sorted} />
}
```

### Pattern 2: Filter on Client
```tsx
// ❌ Server
<ClientList all={items} active={items.filter(i => i.active)} />

// ✅ Client
'use client'
function ClientList({ all }: { all: Item[] }) {
  const active = useMemo(() => all.filter(i => i.active), [all])
  return <List items={active} />
}
```

### Pattern 3: Map/Transform on Client
```tsx
// ❌ Server
const userIds = users.map(u => u.id)
<Client users={users} userIds={userIds} />

// ✅ Client
'use client'
function Client({ users }: { users: User[] }) {
  const userIds = useMemo(() => users.map(u => u.id), [users])
  return <div>{userIds.join(', ')}</div>
}
```

### Pattern 4: Multiple Views of Same Data
```tsx
// ❌ Server - creates multiple references
async function Page() {
  const posts = await fetchPosts()

  return (
    <>
      <RecentPosts posts={posts.slice(0, 5)} />
      <AllPosts posts={posts} />
      <PopularPosts posts={posts.toSorted((a, b) => b.views - a.views)} />
    </>
  )
}

// ✅ Client - one reference, multiple views
async function Page() {
  const posts = await fetchPosts()
  return <PostsView posts={posts} />
}

'use client'
function PostsView({ posts }: { posts: Post[] }) {
  const recent = useMemo(() => posts.slice(0, 5), [posts])
  const popular = useMemo(() => [...posts].sort((a, b) => b.views - a.views), [posts])

  return (
    <>
      <RecentPosts posts={recent} />
      <AllPosts posts={posts} />
      <PopularPosts posts={popular} />
    </>
  )
}
```

## When to Violate This Rule

**Exception:** Pass derived data when:

1. **Transformation is expensive** (complex computations, large datasets)
2. **Client doesn't need original** (only needs derived data)
3. **Server-side filtering for security** (hide sensitive fields)

```tsx
// ✅ Acceptable: expensive computation done once on server
async function Page() {
  const data = await fetchLargeDataset()

  // Complex aggregation done on server
  const aggregated = computeExpensiveAggregation(data) // 100ms+

  return <ClientChart data={aggregated} />
  // Client doesn't need original data
}
```

## Measuring Impact

Check HTML response size in DevTools:

```bash
# Before optimization
curl https://yoursite.com | wc -c
# 150KB

# After optimization (move transforms to client)
curl https://yoursite.com | wc -c
# 80KB (47% reduction)
```

## Performance Impact

**Example:**
- 1000 user objects
- Pass original + sorted + filtered versions

**Before (server transformations):**
```tsx
<Client
  all={users}
  sorted={users.toSorted()}
  active={users.filter(u => u.active)}
/>
// 3 array wrappers + deduplicated objects = ~50KB extra
```

**After (client transformations):**
```tsx
<Client all={users} />
// 1 array wrapper = original size
```

**Result:** 33% smaller HTML payload

## Related Patterns

- [2.3 Minimize Serialization at RSC Boundaries](./minimize-serialization.md) - Only pass necessary fields
- [1.2 Parallelize Independent Operations](./parallelize-independent-operations.md) - Optimize data fetching

## References

- [React Server Components Serialization](https://github.com/reactwg/server-components/discussions/2)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

**Related Sections:**
- AGENTS.md § 2.2
- Quick Checklist: Server Component Checklist
