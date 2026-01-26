# 2.3 Minimize Serialization at RSC Boundaries

The React Server/Client boundary serializes all object properties into strings and embeds them in the HTML response and subsequent RSC requests. This serialized data directly impacts page weight and load time, so **size matters a lot**. Only pass fields that the client actually uses.

## Why This Matters

Every object passed from Server Component to Client Component gets serialized into the HTML. This data is included in:
- Initial HTML response
- RSC payload for navigation
- Client-side JavaScript hydration

Passing unused fields wastes bandwidth and slows down page loads.

**Impact:** Smaller HTML, faster page loads, reduced bandwidth costs.

## The Pattern

Only pass the specific fields the client component needs, not entire objects.

**❌ Incorrect: serializes all 50 fields**
```tsx
// Server Component
async function Page() {
  const user = await fetchUser()  // 50 fields: id, name, email, bio, preferences, settings, ...
  return <Profile user={user} />
}

'use client'
function Profile({ user }: { user: User }) {
  return <div>{user.name}</div>  // Only uses 1 field!
}

// HTML includes all 50 fields serialized:
// {"id":1,"name":"Alice","email":"...","bio":"...","preferences":{...},"settings":{...},...}
```

**✅ Correct: serializes only 1 field**
```tsx
// Server Component
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />  // Pass only what's needed
}

'use client'
function Profile({ name }: { name: string }) {
  return <div>{name}</div>
}

// HTML includes only the name:
// "Alice"
```

## Common Patterns

### Pattern 1: Extract Multiple Needed Fields
```tsx
// ❌ Bad: passes entire objects
async function Page() {
  const user = await fetchUser()
  const posts = await fetchPosts()

  return <Dashboard user={user} posts={posts} />
}

// ✅ Good: pass only needed fields
async function Page() {
  const user = await fetchUser()
  const posts = await fetchPosts()

  return (
    <Dashboard
      userName={user.name}
      userAvatar={user.avatar}
      postCount={posts.length}
      latestPost={posts[0]?.title}
    />
  )
}

'use client'
function Dashboard({
  userName,
  userAvatar,
  postCount,
  latestPost
}: {
  userName: string
  userAvatar: string
  postCount: number
  latestPost: string
}) {
  return (
    <div>
      <img src={userAvatar} alt={userName} />
      <h1>{userName}</h1>
      <p>{postCount} posts</p>
      <p>Latest: {latestPost}</p>
    </div>
  )
}
```

### Pattern 2: Nested Data - Extract What's Needed
```tsx
// ❌ Bad: entire user object with nested preferences
async function Page() {
  const user = await fetchUser()
  // user = { id, name, email, preferences: { theme, lang, notifications: {...} } }

  return <ThemeToggle user={user} />
}

'use client'
function ThemeToggle({ user }: { user: User }) {
  return <button>{user.preferences.theme}</button>  // Only uses theme
}

// ✅ Good: extract only theme
async function Page() {
  const user = await fetchUser()

  return <ThemeToggle theme={user.preferences.theme} />
}

'use client'
function ThemeToggle({ theme }: { theme: string }) {
  return <button>{theme}</button>
}
```

### Pattern 3: Arrays - Map to Needed Fields
```tsx
// ❌ Bad: entire post objects (many fields each)
async function Page() {
  const posts = await fetchPosts()
  // Each post: { id, title, content, author, tags, metadata, timestamps, ... }

  return <PostList posts={posts} />
}

'use client'
function PostList({ posts }: { posts: Post[] }) {
  return posts.map(p => <div key={p.id}>{p.title}</div>)  // Only uses id + title
}

// ✅ Good: map to only needed fields
async function Page() {
  const posts = await fetchPosts()

  const postSummaries = posts.map(p => ({
    id: p.id,
    title: p.title
  }))

  return <PostList posts={postSummaries} />
}

'use client'
function PostList({ posts }: { posts: Array<{ id: string; title: string }> }) {
  return posts.map(p => <div key={p.id}>{p.title}</div>)
}
```

### Pattern 4: Server Component Wrapper for Large Objects
```tsx
// ✅ Keep large data in Server Component, pass only summary to Client
async function Page() {
  const analytics = await fetchAnalytics()  // 100+ fields

  return (
    <div>
      {/* Server Component - can access full analytics */}
      <AnalyticsTable data={analytics} />

      {/* Client Component - only gets summary */}
      <AnalyticsSummary total={analytics.total} change={analytics.percentChange} />
    </div>
  )
}

async function AnalyticsTable({ data }: { data: Analytics }) {
  // Server Component - can use all fields without serialization cost
  return (
    <table>
      {data.metrics.map(metric => (
        <tr key={metric.id}>
          <td>{metric.name}</td>
          <td>{metric.value}</td>
        </tr>
      ))}
    </table>
  )
}

'use client'
function AnalyticsSummary({ total, change }: { total: number; change: number }) {
  // Client Component - only receives 2 numbers
  return (
    <div className={change > 0 ? 'positive' : 'negative'}>
      Total: {total} ({change > 0 ? '+' : ''}{change}%)
    </div>
  )
}
```

## Measuring Serialization Size

### DevTools Network Tab
1. Open DevTools → Network
2. Reload page
3. Find the document request
4. Check Response size

### Search for Serialized Data
View page source and search for serialized props:
```html
<script>self.__next_f.push([1,"1:\"$L2\",...])</script>
```

The `$L` blocks contain serialized RSC data.

### Compare Before/After
```bash
# Before optimization
curl https://yoursite.com | grep -o '\$L' | wc -l
# 50 fields serialized

# After optimization
curl https://yoursite.com | grep -o '\$L' | wc -l
# 5 fields serialized
```

## When to Pass Full Objects

**✅ Acceptable to pass full objects when:**

1. **Client needs most/all fields** (>80% of fields used)
2. **Object is small** (<1KB serialized)
3. **Shared across many client components** (avoid duplication)

```tsx
// ✅ OK: client needs most fields
async function Page() {
  const config = await fetchConfig()  // 5 small fields

  return <ConfigPanel config={config} />  // Uses 4/5 fields
}

// ✅ OK: shared across components
async function Page() {
  const theme = await fetchTheme()  // Small object

  return (
    <div>
      <ThemeHeader theme={theme} />
      <ThemeBody theme={theme} />
      <ThemeFooter theme={theme} />
    </div>
  )
}
```

## Performance Impact

**Example:**
- User object: 50 fields, ~5KB serialized
- Page uses only name and avatar

**Before:**
```tsx
<Profile user={user} />
// Serialized: 5KB
```

**After:**
```tsx
<Profile name={user.name} avatar={user.avatar} />
// Serialized: 50 bytes
```

**Result:** 99% reduction in serialization size

**With 1000 users in a list:**
- Before: 5KB × 1000 = 5MB
- After: 50 bytes × 1000 = 50KB

**Result:** 100x smaller payload

## Common Mistakes

**❌ Don't pass unused fields "just in case"**
```tsx
// Bad: "might need it later"
<Client user={user} allPreferences={user.preferences} />
```

**❌ Don't pass debug/internal fields to production**
```tsx
// Bad: includes __typename, _cache, _internal
<Client data={rawGraphQLResponse} />

// Good: map to clean object
<Client data={{ id: response.id, name: response.name }} />
```

**❌ Don't pass functions (they'll be removed anyway)**
```tsx
// Bad: functions are not serializable
<Client user={{ ...user, format: () => '...' }} />

// Good: pass data only, format on client
<Client name={user.name} />
```

## Related Patterns

- [2.2 Avoid Duplicate Serialization](./avoid-duplicate-serialization.md) - Share references, not copies
- [1.1 Prevent Waterfall Chains](./prevent-waterfall-chains.md) - Fetch data efficiently
- [3.2 Server vs Client Component](./server-vs-client-component.md) - Keep data in Server Components when possible

## References

- [React Server Components](https://github.com/reactwg/server-components/discussions/2)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

**Related Sections:**
- AGENTS.md § 2.3
- Quick Checklist: Performance Review Checklist
