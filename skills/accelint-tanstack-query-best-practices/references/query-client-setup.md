# Query Client Configuration

## Factory Pattern with Request Isolation

Configure a query client factory that creates a new instance per request on the server, and a singleton in the browser.

```typescript
// configs/query-client/index.ts

import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 20, // 20 seconds
        gcTime: 1000 * 60 * 2, // 2 minutes
        retry: 3,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // Include pending queries in dehydration for streaming
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always create a new query client per request
    return makeQueryClient();
  } else {
    // Browser: create a singleton query client
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
  }
}
```

## Why This Pattern?

### Request Isolation
Each server request gets its own query client, preventing data leakage between users. Server components can execute concurrently for multiple users - a shared query client would:
- Leak cached data between users (security risk)
- Create race conditions in the cache
- Cause memory leaks as the cache grows indefinitely

### Streaming Support
Setting `shouldDehydrateQuery` to include pending queries enables React to stream promises to the client. You can call prefetch functions without `await`, and the queries will resolve during streaming.

### Browser Optimization
Reuses a single client on the browser to maintain cache across navigations. Client-side navigation should preserve cached data for instant back-button responses.

## Critical Anti-Pattern

**❌ Incorrect: singleton leaks data between users**
```typescript
const queryClient = new QueryClient();

export default function ServerComponent() {
  queryClient.prefetchQuery(...); // Shared across all users!
}
```

**✅ Correct: factory creates isolated clients**
```typescript
export default function ServerComponent() {
  const queryClient = getQueryClient(); // New client per request
  queryClient.prefetchQuery(...);
}
```

## Default Options Explained

| Option | Value | Why |
|--------|-------|-----|
| staleTime | 20s | Queries stay fresh for 20 seconds, preventing refetches during normal navigation |
| gcTime | 2min | Inactive queries removed after 2 minutes to free memory |
| retry | 3 | Retry failed queries 3 times with exponential backoff |
| refetchOnWindowFocus | false | Disable automatic refetching when user returns to tab (configure per-query for real-time data) |

## Tuning for Different Data Types

```typescript
// Override defaults for specific queries
useQuery({
  queryKey: keys.countries(),
  queryFn: fetchCountries,
  staleTime: 1000 * 60 * 60, // 1 hour - rarely changes
  gcTime: Infinity, // Keep forever
});

useQuery({
  queryKey: keys.track(id),
  queryFn: () => fetchTrack(id),
  staleTime: 1000 * 5, // 5 seconds - real-time tracking
  gcTime: 1000 * 30, // Aggressive cleanup
  refetchInterval: 1000 * 5, // Poll every 5 seconds
});
```

## Streaming Without Await

The `shouldDehydrateQuery` configuration with `pending` status enables calling prefetch without blocking:

```typescript
export async function ServerComponent() {
  const queryClient = getQueryClient();

  // No need to await - queries will stream to the client
  prefetchAll(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientComponent />
    </HydrationBoundary>
  );
}
```

React will stream the pending promises to the client, and they'll resolve during hydration. The client component will receive either completed data or suspending promises.
