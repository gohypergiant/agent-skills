# 2.2 Avoid Duplicate Serialization in RSC Props

RSC→client serialization deduplicates by object reference, not value. Same reference = serialized once; new reference = serialized again. Do transformations (`.toSorted()`, `.filter()`, `.map()`) in client, not server.

Pass the original data reference to the client and transform it there, rather than transforming on the server and creating new references.

**❌ Incorrect: duplicates array**
```tsx
// Server Component
async function Page() {
  const usernames = await fetchUsernames()

  // ❌ Creates new array reference
  return <ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
}

// RSC serialization: sends 6 strings (2 arrays × 3 items)
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
```

```
// string[] - duplicates everything
usernames={['a','b']} sorted={usernames.toSorted()} // sends 4 strings

// object[] - duplicates array structure only
users={[{id:1},{id:2}]} sorted={users.toSorted()} // sends 2 arrays + 2 unique objects (not 4)
```

## Impact by Data Type

Deduplication works recursively, but impact varies:

- `string[]`, `number[]`, `boolean[]`: HIGH impact - array + all primitives fully duplicated
- `object[]`: LOW impact - array duplicated, but nested objects deduplicated by reference

Operations breaking deduplication: create new references

- Arrays: `.toSorted()`, `.filter()`, `.map()`, `.slice()`, `[...arr]`
- Objects: `{...obj}`, `Object.assign()`, `structuredClone()`, `JSON.parse(JSON.stringify())`

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

## When to Violate This Rule

**Exception:** Pass derived data when:

1. **Transformation is expensive** (complex computations, large datasets)
2. **Client doesn't need original** (only needs derived data)
3. **Server-side filtering for security** (hide sensitive fields)

**✅ Correct: expensive computation done once on server**
```tsx
async function Page() {
  const data = await fetchLargeDataset()

  // Complex aggregation done on server
  const aggregated = computeExpensiveAggregation(data) // 100ms+

  return <ClientChart data={aggregated} />
  // Client doesn't need original data
}
```

## Related Patterns

- [2.3 Minimize Serialization at RSC Boundaries](./minimize-serialization.md) - Only pass necessary fields
- [1.2 Parallelize Independent Operations](./parallelize-independent-operations.md) - Optimize data fetching
