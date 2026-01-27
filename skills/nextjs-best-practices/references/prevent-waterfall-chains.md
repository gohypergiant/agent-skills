# 1.1 Prevent Waterfall Chains

In API routes and Server Actions, start independent operations immediately, even if you don't await them yet.

**❌ Incorrect: config waits for auth, data waits for both**
```ts
export async function GET(request: Request) {
  const session = await auth()           // Wait 50ms
  const config = await fetchConfig()     // Wait another 50ms
  const data = await fetchData(session.user.id) // Wait another 100ms

  // Total: 200ms sequential
  return Response.json({ data, config })
}
```

**✅ Correct: auth and config start immediately**
```ts
export async function GET(request: Request) {
  // Start both immediately (non-blocking)
  const sessionPromise = auth()          // Starts now
  const configPromise = fetchConfig()    // Starts now (parallel)

  // Await only when needed
  const session = await sessionPromise   // Wait 50ms

  // data depends on session, but config is already running
  const [config, data] = await Promise.allSettled([
    configPromise,
    fetchData(session.user.id)
  ])

  // Total: ~100ms (config and data run in parallel)
  return Response.json({ data, config })
}
```

## Common Scenarios

### Scenario 1: All Independent Operations
When all operations are truly independent, use `Promise.allSettled()`:

```ts
export async function GET(request: Request) {
  const [user, posts, comments] = await Promise.allSettled([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ])

  return Response.json({ user, posts, comments })
}
```

### Scenario 2: Partial Dependencies
When some operations depend on others, start independent ones first:

```ts
export async function GET(request: Request) {
  // Start independent operations
  const configPromise = fetchConfig()
  const settingsPromise = fetchSettings()

  // Auth might be needed later
  const sessionPromise = auth()
  const session = await sessionPromise

  // Now parallel fetch data and await config/settings
  const [config, settings, userData] = await Promise.allSettled([
    configPromise,
    settingsPromise,
    fetchUserData(session.user.id)
  ])

  return Response.json({ config, settings, userData })
}
```

### Scenario 3: Server Actions
Same pattern applies to Server Actions:

```ts
'use server'

export async function updateProfile(formData: FormData) {
  // Start independent operations
  const sessionPromise = auth()
  const validationPromise = validateFormData(formData)

  // Await when needed
  const [session, validated] = await Promise.allSettled([
    sessionPromise,
    validationPromise
  ])

  if (!session) throw new Error('Unauthorized')

  // Now do the mutation
  await db.user.update({
    where: { id: session.user.id },
    data: validated
  })

  return { success: true }
}
```

## What NOT to Do

**❌ Incorrect: don't use Promise.all() - use Promise.allSettled()**
```ts
// Bad: if one fails, all fail
const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()])

// Good: handle failures individually
const [a, b, c] = await Promise.allSettled([fetchA(), fetchB(), fetchC()])
if (a.status === 'rejected') {
  // Handle a failure
}
```

**❌ Incorrect: don't await in a loop**
```ts
// Bad: sequential (100ms × 3 = 300ms)
const results = []
for (const id of ids) {
  results.push(await fetchItem(id))
}

// Good: parallel (100ms total)
const results = await Promise.allSettled(
  ids.map(id => fetchItem(id))
)
```

## Related Patterns

- [1.2 Parallelize Independent Operations](./parallelize-independent-operations.md) - Use Promise.allSettled() for fully independent operations
- [2.4 Parallel Data Fetching](./parallel-data-fetching.md) - Apply same pattern in Server Components
- [2.5 React.cache() Deduplication](./react-cache-deduplication.md) - Cache results to avoid refetching

## References

- [Promise.allSettled() MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
