# Mutations and Client Hooks

## Query Hooks

### useSuspenseQuery Best Practices

Use `useSuspenseQuery` for server-hydrated data and Suspense boundary integration:

```typescript
// data-access/tracks/client.ts
'use client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getQueryClient } from '~/configs/query-client';
import { keys } from './keys';

export function useTrack(id: string) {
  return useSuspenseQuery({
    queryKey: keys.detail(id),
    queryFn: () => $fetch<Track>('/:id', { method: 'GET', params: { id } }),
    refetchInterval: 1000, // Poll every second for real-time updates
  });
}
```

Benefits over `useQuery`:
- Throws promises that Suspense boundaries catch
- No undefined states - data always exists when component renders
- Works seamlessly with server-side prefetching

### Query Cancellation with AbortController

Pass signal to fetch requests for proper cleanup:

```typescript
export function useData() {
  return useQuery({
    queryKey: ['my-data'],
    queryFn: async ({ signal }) => {
      return $fetch('/api/data', { signal }); // Pass signal through
    },
  });
}
```

TanStack Query aborts in-flight requests when:
- Component unmounts
- Query key changes
- Query manually cancelled

Without signal support, unmounted components leave requests running, wasting bandwidth and potentially updating stale cache entries. See [patterns-and-pitfalls.md#query-cancellation](patterns-and-pitfalls.md#query-cancellation) for anti-patterns.

### Data Transformation with select

Transform data close to the query definition:

```typescript
function Component() {
  const { data } = useQuery({
    queryKey: keys.all(),
    queryFn: fetchItems,
    select: (items) => items.sort((a, b) => a.timestamp - b.timestamp),
  });
}
```

`select` only runs when data exists (no undefined checks) and sits next to query definition. See [patterns-and-pitfalls.md#data-transformation](patterns-and-pitfalls.md#data-transformation) for comparison with useMemo.

## Mutation Patterns Overview

Mutations modify server state and update client cache. Two primary patterns:

| Pattern | When to Use | Examples |
|---------|-------------|----------|
| **Pessimistic** | Server validation required, high-stakes operations, batch operations, audit trails | Form submission, payment processing, batch operations |
| **Optimistic** | Low-latency requirement, user-initiated, easily reversible, non-critical data | Toggle switches, likes, drag-and-drop, user preferences |

## Pessimistic Updates

Default pattern for most mutations. Update cache only after server confirms success.

```typescript
export function useCreateTrack() {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTrackPayload) => {
      const validated = trackSchema.omit({ id: true }).parse(payload);
      return $fetch<Track>('/', { method: 'POST', body: validated });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all() });
    },
  });
}
```

**When to use pessimistic updates:**
- **High-stakes operations**: Financial transactions, medical data, safety-critical systems
- **Server validation required**: Multi-step forms, complex business rules, external dependencies
- **External mutations**: Changes triggered by other users, system events, or background processes
- **Audit trail required**: Compliance systems where operator actions must match logged events exactly
- **Partial failures possible**: Batch operations where some items succeed and others fail

**Examples:**
- Payment processing
- Medical prescription changes
- Batch delete operations
- Life-critical command and control operations
- Regulatory compliance workflows

## Optimistic Updates

Update cache immediately before server confirms. If mutation fails, rollback to previous state.

### When to Use Optimistic Updates

Optimistic updates immediately reflect user changes in UI before server confirmation. When mutation completes, UI reconciles with server response. If mutation fails, UI rolls back to previous state.

**Use optimistic updates when:**
- **Low-latency requirement**: User expects instant feedback (toggle switches, likes, status changes)
- **User-initiated mutations**: Actions directly triggered by user interaction
- **Easily reversible**: Failed mutations can be rolled back without ambiguity
- **Non-critical data**: Incorrect temporary state doesn't cause serious issues

**Examples:**
- Toggle bookmark status
- Increment like counter
- Reorder list items via drag-and-drop
- Update user preferences
- Mark notification as read

### Implementation Pattern

The pattern uses TanStack Query's mutation callbacks for three phases: optimistic application, error rollback, and server reconciliation.

```typescript
// data-access/tracks/client.ts
'use client';
import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '~/configs/query-client';
import { keys } from './keys';
import type { Track } from './types';

export function useUpdateTrack(id: string) {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Track>) => {
      const validated = trackSchema.partial().parse(payload);
      return $fetch<Track>(':id', {
        method: 'PATCH',
        params: { id },
        body: validated,
      });
    },
    onMutate: async (newData) => {
      // Cancel outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: keys.detail(id) });

      // Snapshot the previous value for rollback
      const previous = queryClient.getQueryData<Track>(keys.detail(id));

      // Optimistically update the cache
      if (previous) {
        queryClient.setQueryData<Track>(keys.detail(id), {
          ...previous,
          ...newData,
        });
      }

      // Return context object with snapshot
      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback to previous state on failure
      if (context?.previous) {
        queryClient.setQueryData(keys.detail(id), context.previous);
      }
    },
    onSettled: () => {
      // Refetch to ensure cache matches server state
      queryClient.invalidateQueries({ queryKey: keys.detail(id) });
    },
  });
}
```

### Critical Implementation Details

#### onMutate Phase
- Runs synchronously before mutation starts
- Cancel in-flight queries with `cancelQueries` to prevent race conditions where background refetch overwrites optimistic update
- Snapshot previous state via `getQueryData`
- Apply optimistic update via `setQueryData`
- Return context object containing snapshot - TanStack Query passes this to `onError` and `onSettled`

#### onError Phase
- Receives the context from `onMutate`
- Rolls back cache to the snapshot
- Without this, failed mutation leaves UI showing data that doesn't exist on server

#### onSettled Phase
- Runs after both success and failure
- Use `invalidateQueries` to refetch from server
- Reconciles any drift between client and server state
- Critical for ensuring eventual consistency

### Validation Before Mutation

Always validate payload before mutation to catch errors before reaching server:

```typescript
mutationFn: (payload: Partial<Track>) => {
  const validated = trackSchema.partial().parse(payload); // Throws if invalid
  return $fetch<Track>(':id', { method: 'PATCH', params: { id }, body: validated });
}
```

Validation failures trigger `onError` callback, which rolls back optimistic update.

### Multiple Cache Entry Updates

When optimistic update affects multiple cache entries:

```typescript
export function useUpdateTrack(id: string) {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Track>) => updateTrack(id, payload),
    onMutate: async (newData) => {
      // Cancel all related queries
      await queryClient.cancelQueries({ queryKey: keys.detail(id) });
      await queryClient.cancelQueries({ queryKey: keys.all() });

      // Snapshot both cache entries
      const previousDetail = queryClient.getQueryData<Track>(keys.detail(id));
      const previousList = queryClient.getQueryData<Track[]>(keys.all());

      // Update detail view
      if (previousDetail) {
        queryClient.setQueryData<Track>(keys.detail(id), {
          ...previousDetail,
          ...newData,
        });
      }

      // Update item in list view
      if (previousList) {
        queryClient.setQueryData<Track[]>(
          keys.all(),
          previousList.map(t => t.id === id ? { ...t, ...newData } : t)
        );
      }

      return { previousDetail, previousList };
    },
    onError: (err, variables, context) => {
      // Rollback both cache entries
      if (context?.previousDetail) {
        queryClient.setQueryData(keys.detail(id), context.previousDetail);
      }
      if (context?.previousList) {
        queryClient.setQueryData(keys.all(), context.previousList);
      }
    },
    onSettled: () => {
      // Refetch both to ensure consistency
      queryClient.invalidateQueries({ queryKey: keys.detail(id) });
      queryClient.invalidateQueries({ queryKey: keys.all() });
    },
  });
}
```

## Custom Hooks

Always wrap queries in custom hooks for encapsulation. See [patterns-and-pitfalls.md#custom-hooks-and-closures](patterns-and-pitfalls.md#custom-hooks-and-closures) for detailed explanation of closure bugs.

```typescript
// data-access/tracks/client.ts
export function useTrack(id: string, userId: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => fetchTrack(id, userId), // Fresh values on each render
  });
}

// features/tracks/client.tsx
function TrackView({ trackId }) {
  const userId = useUserId();
  const { data: track } = useTrack(trackId, userId);
}
```

Benefits:
- Prevents closure bugs where queryFn captures stale variables
- Centralized query configuration
- Consumers don't need to know query keys
- Easy to update query options in one place
- Better testability

## Configured Fetch Instance

Create domain-specific fetch instances:

```typescript
// data-access/tracks/client.ts
import { createFetch } from '@better-fetch/fetch';

const $fetch = createFetch({
  baseURL: '/api/tracks',
  retry: 0, // TanStack Query handles retries
  timeout: 10000,
  throw: true, // Throw for non-2xx (works with TanStack Query error boundaries)
  headers: {
    'content-type': 'application/json',
  },
});

export function useAllTracks() {
  return useSuspenseQuery({
    queryKey: keys.all(),
    queryFn: () => $fetch<Track[]>('/', { method: 'GET' }),
    refetchInterval: 5000,
  });
}
```

Why `throw: true`? TanStack Query's error boundaries expect thrown errors. Without it, you'd need manual `response.ok` checks.

Why `retry: 0`? Let TanStack Query handle retries with its configurable retry logic.

## Important Notes

- Always validate payloads before mutations with Zod schemas
- Use `useSuspenseQuery` for server-hydrated data
- Configure `@better-fetch/fetch` with `throw: true` for error boundary integration
- Set `retry: 0` in fetch config - let TanStack Query handle retries
- Pass AbortController signal through to fetch for proper cleanup
- `cancelQueries` is critical in optimistic updates - prevents background refetches from overwriting optimistic updates
- Context returned from `onMutate` is passed to `onError` and `onSettled` for rollback state
- `onSettled` runs after both success AND failure - use for final reconciliation
- For high-stakes or audit-trail systems, use pessimistic updates instead
- Multiple cache entries require coordinated snapshot and rollback
