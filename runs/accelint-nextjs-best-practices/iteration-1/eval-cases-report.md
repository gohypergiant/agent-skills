# Eval Cases Report: accelint-nextjs-best-practices

## Coverage summary
Created a default eval set for `accelint-nextjs-best-practices` with 16 realistic cases in:

- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-nextjs-best-practices/evals/evals.json`

The set covers:

- App Router performance and waterfall elimination
- Suspense placement and streaming-oriented loading strategy
- Server Actions security, authorization, validation, redirects, and revalidation
- Route handlers for auth, memory usage, proxying, and caching
- React Server Component serialization and server/client boundaries
- Request deduplication and shared data loading patterns
- Barrel import and client bundle concerns
- Server-first vs client-fetch tradeoffs in App Router
- Pages Router as a valid Next.js boundary case
- Near-boundary non-trigger cases for plain React, Express, and generic TypeScript work

## Notable scenarios
A few high-value scenarios included in the eval set:

1. Sequential `await` calls in an App Router page that should be parallelized without moving auth to the client.
2. A Server Action that trusts a hidden `userId`, testing whether the skill pushes auth and authorization checks into the action itself.
3. A route handler returning a large export, testing handler-specific guidance around auth and memory-aware response patterns.
4. RSC serialization failures involving Prisma records, `Date`, `Decimal`, and class instances crossing into a Client Component.
5. A top-level `'use client'` page that should be split into server-rendered content plus smaller client islands.
6. A shared helper repeatedly called from layout and page segments, testing nuanced request deduplication guidance.
7. Barrel imports affecting client bundles, testing whether the skill catches bundling and boundary side effects.
8. Negative cases that mention React hooks, Express JWT routes, or a package named `next-utils` but should not be treated as App Router work.
9. A Pages Router request that should still trigger Next.js expertise while avoiding App Router-only assumptions.

## Schema notes
The file uses the documented `evals.json` schema:

- `skill_name`
- `evals[]`
- `id`
- `prompt`
- `expected_output`
- `files`
- `expectations`

## Output paths
- Eval set: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-nextjs-best-practices/evals/evals.json`
- Report: `/Users/brandon.pierce/Projects/agent-skills/runs/accelint-nextjs-best-practices/eval-cases-report.md`
