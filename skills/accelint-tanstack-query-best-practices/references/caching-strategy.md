# Caching Strategy

## Three-Layer Architecture

Server-side architecture combines three distinct caching mechanisms:

| Layer | Purpose | Invalidation | Scope |
|-------|---------|--------------|-------|
| **Next.js use cache** | Reduce database load | `revalidateTag()` / `updateTag()` | Cross-request, server-side |
| **TanStack Query** | Client state management | `queryClient.invalidateQueries()` | Per-browser-tab |
| **Browser HTTP cache** | Eliminate network requests | `Cache-Control` headers | Per-browser |

Each layer serves a distinct purpose:
- `use cache` reduces database load by caching server computations
- TanStack Query provides instant UI feedback with cached data while fetching fresh updates
- Browser cache eliminates network requests for static resources

These layers are complementary, not redundant. `use cache` runs server-side before TanStack Query fires. TanStack Query provides client features (`staleTime`, `refetchInterval`, optimistic updates) that server caching can't replicate.

## Unified Invalidation with Shared Keys

Use the same key factories for both server and client caches:

```typescript
// data-access/tracks/keys.ts
export const keys = {
  all: () => ['tracks'] as const,
  details: () => [...keys.all(), 'detail'] as const,
  detail: (id: string) => [...keys.details(), id] as const,
};
```

**Server-side with use cache:**
```typescript
// data-access/tracks/server.ts
export async function getOne(id: string) {
  'use cache';
  cacheTag(...keys.detail(id)); // Spread factory into cacheTag

  const rawData = await db.query('SELECT * FROM tracks WHERE id = $1', [id]);
  return trackSchema.parse(rawData);
}

export async function update(id: string, payload: Partial<Track>) {
  const validated = trackSchema.partial().parse(payload);
  await db.query('UPDATE tracks SET lon = $1, lat = $2 WHERE id = $3',
    [validated.lon, validated.lat, id]);

  updateTag(...keys.detail(id)); // Immediate invalidation
}
```

**Client-side with TanStack Query:**
```typescript
// data-access/tracks/client.ts
export function useTrack(id: string) {
  return useSuspenseQuery({
    queryKey: keys.detail(id), // Same factory
    queryFn: () => getOne(id),
  });
}

export function useUpdateTrack(id: string) {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const result = await updateTrackAction(id, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.detail(id) }); // Same keys
    },
  });
}
```

## Server Mutation Invalidates Both Caches

When mutations happen via Server Actions:

```typescript
// actions/tracks.ts
'use server';
import { updateTag } from 'next/cache';
import { keys } from '~/data-access/tracks/keys';

export async function updateTrack(id: string, formData: FormData) {
  // ... perform update

  // Invalidate server-side cache (Next.js use cache)
  updateTag(...keys.detail(id));
  updateTag(...keys.all());

  // Client-side invalidation handled by TanStack Query mutation callback
}
```

The client-side mutation wrapper calls the Server Action and then invalidates TanStack Query cache in `onSuccess`.

## revalidateTag vs updateTag

Critical difference in Next.js 16+:

- **revalidateTag**: Stale-while-revalidate. Current request sees stale data, *next* request gets fresh data
- **updateTag**: Immediate invalidation. Current request sees fresh data

Use `updateTag` when users need to see their own mutations reflected immediately. Use `revalidateTag` for background updates where stale-while-revalidate is acceptable.

## Integration Pattern

**Problem: Dueling caches**
1. Server cache (`use cache`) serves stale data to HTML
2. Client cache (TanStack Query) has fresh data
3. User sees stale data flash, then fresh data (layout shift)

**Solution: Unified invalidation**
1. Mutation updates database
2. `updateTag(...keys.detail(id))` busts server cache
3. `queryClient.invalidateQueries({ queryKey: keys.detail(id) })` busts client cache
4. Next render hits database for both server and client
5. Both caches repopulate with same fresh data

The shared key factory (`keys.ts`) makes this work. One mutation, one key hierarchy, both caches invalidated atomically.

## Cache Tag Strategy

Tag cached entries with hierarchical identifiers:

**❌ Incorrect: hardcoded tags**
```typescript
export async function getOne(id: string) {
  'use cache';
  cacheTag('tracks', 'detail', id); // Manual, error-prone
}

// Different format in client
queryKey: ['track', 'details', id] // Typo creates cache inconsistency
```

**✅ Correct: shared factory**
```typescript
export async function getOne(id: string) {
  'use cache';
  cacheTag(...keys.detail(id)); // Same factory everywhere
}

queryKey: keys.detail(id) // Consistent hierarchy
```

## Hydration Pattern

Server prefetches using `use cache` functions, client hydrates TanStack Query cache:

```typescript
// features/tracks/server.tsx
export async function TrackDetailServer({ id }: { id: string }) {
  const queryClient = getQueryClient();

  prefetchOne(queryClient, id); // Calls getOne() which uses 'use cache'

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TracksClient trackId={id} />
    </HydrationBoundary>
  );
}
```

Server calls `getOne(id)` which uses `use cache`. TanStack Query on client receives prefetched data and populates its cache. Both caches have same data, keyed the same way, invalidated the same way.

## Cache Key Stability

Arguments to cached functions become part of the cache key. Unstable arguments create cache thrash.

**❌ Incorrect: unstable cache keys**
```typescript
// New object instance on every call - infinite cache entries
'use cache';
cacheTag('users');
const filters = { status: 'active' }; // New reference each time
return getUsers(filters);
```

**✅ Correct: stable serialization**
```typescript
'use cache';
cacheTag('users', JSON.stringify(filters)); // Deterministic serialization
return getUsers(filters);
```

## Important Notes

- `revalidateTag` uses stale-while-revalidate (current request sees old data)
- `updateTag` invalidates immediately (current request sees fresh data after refetch)
- Shared key factories prevent server/client cache desync
- `use cache` with `cacheTag` provides server-side caching before TanStack Query runs
- Both layers need invalidation on mutations to prevent UI showing stale data flash
