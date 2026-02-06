# Query Key Factories

## Hierarchical Key Structure

Query keys enable cache management. Factories provide type safety, consistency, and hierarchical invalidation.

```typescript
// data-access/tracks/keys.ts

export const keys = {
  all: () => ['tracks'] as const,
  lists: () => [...keys.all(), 'list'] as const,
  list: (filters: string) => [...keys.lists(), filters] as const,
  details: () => [...keys.all(), 'detail'] as const,
  detail: (id: string) => [...keys.details(), id] as const,
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
  cacheTag(...keys.detail(id)); // Spread factory into cacheTag

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
revalidateTag(...keys.all()); // Invalidate everything
updateTag(...keys.detail(id)); // Invalidate one item immediately
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

export const keys = {
  // Base key for all user queries
  all: () => ['users'] as const,

  // List queries with optional filters
  lists: () => [...keys.all(), 'list'] as const,
  list: (filters?: { role?: string; status?: string }) =>
    [...keys.lists(), filters ? JSON.stringify(filters) : 'all'] as const,

  // Detail queries for individual users
  details: () => [...keys.all(), 'detail'] as const,
  detail: (userId: string) => [...keys.details(), userId] as const,

  // Nested resources
  preferences: (userId: string) => [...keys.detail(userId), 'preferences'] as const,
  sessions: (userId: string) => [...keys.detail(userId), 'sessions'] as const,
};

// Usage examples:
// keys.all()                                    -> ['users']
// keys.list({ role: 'admin' })                  -> ['users', 'list', '{"role":"admin"}']
// keys.detail('user-123')                       -> ['users', 'detail', 'user-123']
// keys.preferences('user-123')                  -> ['users', 'detail', 'user-123', 'preferences']

// Invalidation examples:
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
