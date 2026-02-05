# Server-Side TanStack Query Integration

## HydrationBoundary Pattern

Prefetch data in server components, dehydrate the cache, and pass to client components:

```typescript
// features/tracks/server.tsx
import 'server-only';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '~/configs/query-client';
import { prefetchAll } from '~/data-access/tracks/server';
import { TracksClient } from './client';

export async function TracksServer() {
  const queryClient = getQueryClient();

  // No await needed - queries stream to client
  prefetchAll(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TracksClient />
    </HydrationBoundary>
  );
}
```

## Prefetch Functions

Create prefetch helpers in `data-access/*/server.ts`:

```typescript
// data-access/tracks/server.ts
import 'server-only';
import type { QueryClient } from '@tanstack/react-query';
import { keys } from './keys';

export async function getOne(id: string) {
  'use cache';
  cacheTag(...keys.detail(id));

  const rawData = await db.query('SELECT * FROM tracks WHERE id = $1', [id]);
  return trackSchema.parse(rawData);
}

export function prefetchOne(queryClient: QueryClient, id: string) {
  return queryClient.prefetchQuery({
    queryKey: keys.detail(id),
    queryFn: () => getOne(id),
  });
}

export function prefetchAll(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: keys.all(),
    queryFn: () => getAll(),
  });
}
```

## Streaming Without Await

With `shouldDehydrateQuery` configured to include pending queries, you can skip await:

**❌ Incorrect: blocking server render**
```typescript
export async function ServerComponent() {
  const queryClient = getQueryClient();
  await prefetchAll(queryClient); // Blocks server response
  return <HydrationBoundary state={dehydrate(queryClient)}>...</HydrationBoundary>;
}
```

**✅ Correct: streaming with pending promises**
```typescript
export async function ServerComponent() {
  const queryClient = getQueryClient();
  prefetchAll(queryClient); // No await - streams to client
  return <HydrationBoundary state={dehydrate(queryClient)}>...</HydrationBoundary>;
}
```

Queries resolve during streaming. Client components receive either completed data or suspending promises.

## Integration with use cache

Server-side data functions use Next.js `use cache` for server-side caching, then get wrapped in prefetch calls for client hydration:

```typescript
// Server-side cached function
export async function getAll() {
  'use cache';
  cacheTag(...keys.all());

  const rawData = await db.query('SELECT * FROM tracks ORDER BY timestamp DESC');
  return trackListSchema.parse(rawData);
}

// Prefetch wrapper for TanStack Query
export function prefetchAll(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: keys.all(), // Same keys as cacheTag
    queryFn: () => getAll(), // Calls use cache function
  });
}
```

Two-layer caching:
1. `use cache` reduces database load (server-side, cross-request)
2. TanStack Query provides client-side state management (per-tab, with refetching)

## Client Component Usage

Client components use the hydrated data:

```typescript
// features/tracks/client.tsx
'use client';
import { useAllTracks } from '~/data-access/tracks/client';

export function TracksClient() {
  const { data: tracks } = useAllTracks(); // Already hydrated from server

  return (
    <ul>
      {tracks.map(track => <li key={track.id}>{track.name}</li>)}
    </ul>
  );
}
```

If `prefetchAll` was called in the server component, `useAllTracks` returns immediately with cached data. No duplicate request.

## Important Notes

- `HydrationBoundary` must wrap components that use the prefetched queries
- `dehydrate(queryClient)` serializes cache state to pass through React's component boundary
- Each server component should create its own `queryClient` via `getQueryClient()`
- Prefetch functions don't need `await` when `shouldDehydrateQuery` includes pending status
- Client components using hydrated queries should use `useSuspenseQuery` to work with Suspense boundaries
