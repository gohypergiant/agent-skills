# Query Key Factories

## Hierarchical Key Structure

Query keys enable cache management. Factories provide type safety, consistency, and hierarchical invalidation.

```typescript
// data-access/tracks/keys.ts

type TaggedKey<T extends readonly string[]> = T & { readonly tag: string }

function key<T extends readonly string[]>(parts: T): TaggedKey<T> {
  const arr = [...parts] as unknown as TaggedKey<T>
  Object.defineProperty(arr, 'tag', { get: () => parts.join(':'), enumerable: false })
  return arr
}

export const keys = {
  all:     ()              => key(['tracks']),
  lists:   ()              => key([...keys.all(), 'list']),
  list:    (filters: string) => key([...keys.lists(), filters]),
  details: ()              => key([...keys.all(), 'detail']),
  detail:  (id: string)    => key([...keys.details(), id]),
};
```

## Type Safety with as const

The `as const` assertion narrows types for precise invalidation:

```typescript
// Without as const
const key = ['tracks', id]; // Type: string[]

// With as const
const key = ['tracks', id] as const; // Type: readonly ['tracks', string]
```

TypeScript catches typos at compile time instead of runtime cache misses.

## Reusability Across Layers

Use the same factories for TanStack Query and Next.js `use cache`:

```typescript
// Server-side with use cache
export async function getOne(id: string) {
  'use cache';
  cacheTag(keys.detail(id).tag); // .tag serializes key to 'tracks:detail:id'

  const rawData = await db.query('SELECT * FROM tracks WHERE id = $1', [id]);
  return trackSchema.parse(rawData);
}

// Client-side with TanStack Query
export function useTrack(id: string) {
  return useSuspenseQuery({
    queryKey: keys.detail(id), // Same factory
    queryFn: () => getOne(id),
  });
}
```

## Cache Invalidation Patterns

Hierarchical keys enable surgical invalidation:

```typescript
// Invalidate all track-related queries
queryClient.invalidateQueries({ queryKey: keys.all() });

// Invalidate all track lists (preserves detail views)
queryClient.invalidateQueries({ queryKey: keys.lists() });

// Invalidate one specific track
queryClient.invalidateQueries({ queryKey: keys.detail('abc-123') });

// Server-side invalidation uses same hierarchy
revalidateTag(keys.all().tag, 'max'); // Invalidate everything
updateTag(keys.detail(id).tag);       // Invalidate one item immediately
```

## Key Stability Rules

**❌ Incorrect: unstable keys create cache thrash**
```typescript
queryKey: ['tracks', ...trackIds] // Array order not guaranteed
queryKey: ['events', sql`timestamp BEFORE ${Date.now()}`] // Infinite unique keys
queryKey: ['tracks', 1] // Type inconsistency - different from ['tracks', '1']
```

**✅ Correct: deterministic, stable keys**
```typescript
queryKey: ['tracks', trackIds.sort().join(',')]
queryKey: ['events', { before: eventId }]
queryKey: ['tracks', String(id)]
```

## Best Practices

1. **Use factories, not inline keys** - Centralized definitions prevent typos and enable refactoring
2. **Spread array hierarchies** - `[...keys.all(), 'detail']` maintains invalidation hierarchy
3. **Match server and client keys** - Same factories for both layers enable unified invalidation
4. **Document key segments** - Comment what each level represents for maintainability
5. **Validate key stability** - Test that keys don't change between renders with same props

## Example: Complete Domain Keys

```typescript
// data-access/users/keys.ts

type TaggedKey<T extends readonly string[]> = T & { readonly tag: string }

function key<T extends readonly string[]>(parts: T): TaggedKey<T> {
  const arr = [...parts] as unknown as TaggedKey<T>
  Object.defineProperty(arr, 'tag', { get: () => parts.join(':'), enumerable: false })
  return arr
}

export const keys = {
  // Base key for all user queries
  all: () => key(['users']),

  // List queries with optional filters
  lists: () => key([...keys.all(), 'list']),
  list: (filters?: { role?: string; status?: string }) =>
    key([...keys.lists(), filters ? JSON.stringify(filters) : 'all']),

  // Detail queries for individual users
  details: () => key([...keys.all(), 'detail']),
  detail: (userId: string) => key([...keys.details(), userId]),

  // Nested resources
  preferences: (userId: string) => key([...keys.detail(userId), 'preferences']),
  sessions:    (userId: string) => key([...keys.detail(userId), 'sessions']),
};

// Array value examples (for TanStack Query):
// keys.all()                                    -> ['users']
// keys.list({ role: 'admin' })                  -> ['users', 'list', '{"role":"admin"}']
// keys.detail('user-123')                       -> ['users', 'detail', 'user-123']
// keys.preferences('user-123')                  -> ['users', 'detail', 'user-123', 'preferences']

// .tag examples (for cacheTag / revalidateTag / updateTag):
// keys.all().tag                                -> 'users'
// keys.detail('user-123').tag                   -> 'users:detail:user-123'
// keys.preferences('user-123').tag              -> 'users:detail:user-123:preferences'

// TanStack Query invalidation:
// queryClient.invalidateQueries({ queryKey: keys.all() })           // Everything
// queryClient.invalidateQueries({ queryKey: keys.lists() })         // All lists
// queryClient.invalidateQueries({ queryKey: keys.detail(id) })      // One user + nested
// queryClient.invalidateQueries({ queryKey: keys.preferences(id) }) // Just preferences
```

## Integration with Mutations

```typescript
export function useUpdateUser(userId: string) {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => updateUser(userId, data),
    onSuccess: () => {
      // Invalidate this user's detail
      queryClient.invalidateQueries({ queryKey: keys.detail(userId) });
      // Invalidate all user lists (user might appear in filtered lists)
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },
  });
}
```
