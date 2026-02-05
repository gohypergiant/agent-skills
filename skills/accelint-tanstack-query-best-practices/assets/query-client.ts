// configs/query-client/index.ts
//
// Query client factory pattern for Next.js App Router with Server Components.
// Creates isolated query clients per-request on server, singleton in browser.

import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Queries are fresh for 20 seconds, preventing unnecessary refetches
        staleTime: 1000 * 20,
        // Inactive queries are garbage collected after 2 minutes
        gcTime: 1000 * 60 * 2,
        // Retry failed requests 3 times with exponential backoff
        retry: 3,
        // Disable automatic refetching when user focuses window
        // Enable per-query for real-time data
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // Include pending queries in dehydration for streaming support
        // This allows prefetch calls without await - queries stream to client
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: ALWAYS create a new query client per request
    // CRITICAL: Prevents data leakage between users and race conditions
    return makeQueryClient();
  } else {
    // Browser: Create a singleton to maintain cache across navigations
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
  }
}
