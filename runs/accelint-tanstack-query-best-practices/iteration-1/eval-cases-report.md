# accelint-tanstack-query-best-practices eval cases

Generated `skills/accelint-tanstack-query-best-practices/evals/evals.json` with 16 evals.

Coverage includes:
- QueryClient setup and server-request isolation
- Client-only React setup boundaries versus Next.js-specific guidance
- Query key stability, hierarchy, and type consistency
- Observer-count and per-row query anti-patterns
- Cache-to-local-state sync bugs
- Dependent queries and `enabled` / composition patterns
- AbortController signal propagation and cancellation
- App Router hydration and streaming prefetch behavior
- Large-payload performance, `select`, structural sharing, and polling tradeoffs
- Optimistic update races, rollback flow, and high-stakes pessimistic mutations
- Multi-layer cache coordination across TanStack Query and Next.js `use cache`
- Two negative boundary cases to verify non-trigger behavior for generic React and Express/backend requests
