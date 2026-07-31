# TanStack Query Best Practices

Guidance for TanStack Query in React applications, with Next.js App Router integration patterns.

This skill helps you set up QueryClient, design stable query keys, choose between optimistic and pessimistic mutations, prevent observer overhead, and coordinate server-side caching with client-side query state.

## When to use this skill

Use this skill when you need help with:

- **QueryClient setup** - Configuring defaults, retry logic, per-request isolation on the server
- **Query key design** - Building stable, hierarchical key factories for consistent invalidation
- **Mutations** - Choosing between optimistic and pessimistic patterns, implementing rollback
- **Performance** - Reducing observer count, managing large payloads, tuning structural sharing
- **Server integration** - Coordinating Next.js App Router hydration, server actions, and cache invalidation
- **Debugging** - Diagnosing infinite requests, stale data, hydration mismatches, or cache drift

The skill recognizes whether you're working with a client-only React app or Next.js App Router and tailors guidance to your stack. Next.js-specific server cache patterns load only when relevant.

## What this skill covers

### Core patterns
- QueryClient defaults and per-request factory setup
- Query key architecture with hierarchical factories
- staleTime, gcTime, and refetch configuration
- Observer economics and performance thresholds
- Dependent queries and conditional fetching
- Data selection and transformation

### Mutations and updates
- Optimistic vs pessimistic update patterns
- Rollback handling with onMutate, onError, onSettled
- Cache invalidation strategies
- Preventing race conditions with cancelQueries

### Next.js integration
- Server-side QueryClient isolation to prevent data leakage
- HydrationBoundary and dehydrate patterns
- Coordinating `use cache`, TanStack Query, and HTTP caching
- Server action integration and unified invalidation

### Troubleshooting
- Common error patterns and fixes
- Performance diagnosis decision trees
- Hydration mismatch resolution
- Network retry and token refresh patterns

## Skill structure

```
skills/accelint-tanstack-query-best-practices/
├── SKILL.md                    # Main skill entry point with progressive disclosure
├── CHANGELOG.md                # Version history
├── references/                 # Detailed guidance loaded on demand
│   ├── fundamentals.md         # Core concepts, lifecycle, observer mechanics
│   ├── query-client-setup.md   # QueryClient configuration and factory patterns
│   ├── query-keys.md           # Key design, stability rules, hierarchical factories
│   ├── mutations-and-updates.md # Optimistic/pessimistic patterns, rollback handling
│   ├── patterns-and-pitfalls.md # Common mistakes, anti-patterns, solutions
│   ├── server-integration.md   # Next.js App Router hydration and server cache
│   └── caching-strategy.md     # Multi-layer cache coordination
├── assets/
│   └── query-client.ts         # Production-ready QueryClient factory
└── evals/
    └── evals.json              # Test cases for QueryClient setup, keys, mutations, performance
```

## Progressive disclosure

The skill loads reference files based on your scenario to minimize context usage:

| Scenario | Required Reading | Optional Reading |
|----------|------------------|------------------|
| **QueryClient setup** | `query-client-setup.md` | `server-integration.md` (Next.js only) |
| **Building query hooks** | `query-keys.md` | `patterns-and-pitfalls.md` (for dependent queries, cancellation, select) |
| **Implementing mutations** | `mutations-and-updates.md` | `patterns-and-pitfalls.md` (for rollback patterns) |
| **Debugging performance** | Observer count threshold check | `patterns-and-pitfalls.md`, `fundamentals.md` (targeted by diagnosis) |
| **Multi-layer caching** | `caching-strategy.md` | Only when coordinating server and client cache |

## Key decision tables

### Query configuration

| Data Type | staleTime | gcTime | refetchInterval | structuralSharing |
|-----------|-----------|--------|-----------------|-------------------|
| Reference/Lookup | 1hr | Infinity | - | true |
| User Profile | 5min | 10min | - | true |
| Real-time Tracking | 5s | 30s | 5s | false |
| Live Dashboard | 2s | 1min | 2s | Depends on size |
| Detail View | 30s | 2min | - | true |
| Search Results | 1min | 5min | - | true |

### Mutation pattern selection

| Scenario | Pattern | When to Use |
|----------|---------|-------------|
| Form submission | Pessimistic | Multi-step forms, server validation required |
| Toggle/checkbox | Optimistic | Binary state changes, low latency required |
| Drag and drop | Optimistic | Immediate visual feedback essential |
| Batch operations | Pessimistic | Multiple items, partial failures possible |
| Life-critical ops | Pessimistic | Medical, financial, safety-critical systems |
| Audit trail required | Pessimistic | Compliance systems where operator actions must match logged events |

### Observer count heuristics

| Observer Count | Performance Impact | Action Required |
|----------------|-------------------|------------------|
| 1-5 | Usually negligible | None |
| 6-20 | Often minimal | Monitor, no immediate action |
| 21-50 | Can become noticeable on updates | Consider hoisting queries to parent |
| 51-100 | Often significant overhead | Refactor: hoist queries or use select |
| 100+ | Usually a strong sign of architectural pressure | Prioritize refactor: single query with props distribution or narrower subscriptions |

## Hard stops

The skill includes explicit rules for critical mistakes:

- **NEVER use a singleton QueryClient on the server** - Creates data leakage between users
- **NEVER synchronize query data to useState** - Background refetches make state stale immediately
- **NEVER put queries inside list item components by default** - Often creates per-row observers and can multiply requests when keys differ or rows mount independently
- **NEVER use unstable query keys** - Arrays with non-guaranteed order, Date.now(), or temporal values
- **NEVER skip enabled guards for dependent queries** - Creates garbage cache entries with undefined params
- **NEVER ignore AbortController signals** - Leaves in-flight requests running after unmount
- **NEVER use optimistic updates for high-stakes operations** - Life-critical or audit trail systems need pessimistic updates
- **NEVER skip onSettled in optimistic updates** - onSettled is the cleanup guarantee even if onError throws
- **NEVER assume cache invalidation is synchronous** - Use cancelQueries in onMutate to prevent races

## Installation

This skill is part of the [Agent Skills](https://agentskills.io/) repository and follows the Agent Skills format.

Install with the skills CLI:

```bash
# npm
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-tanstack-query-best-practices

# pnpm
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-tanstack-query-best-practices
```

Select `accelint-tanstack-query-best-practices` when prompted. We recommend "Project" for installation scope and "Symlink" for installation method.

## Usage

The skill activates when your prompt includes TanStack Query work:

- Setup requests: "Configure QueryClient for our app"
- Reviews: "Review these query hooks for correctness"
- Debugging: "Why are we getting duplicate requests?"
- Migration: "Convert this from SWR to TanStack Query"
- Next.js integration: "Set up server-side hydration with TanStack Query"

If you mention Next.js App Router, Server Components, or hydration, the skill loads server integration patterns. For client-only React apps, it skips Next.js-specific guidance.

## Example outputs

### QueryClient setup review
The skill identifies singleton patterns on the server, recommends per-request factory setup, explains data leakage risks, and provides production-ready code from `assets/query-client.ts`.

### Query key audit
The skill finds unstable keys (Date.now(), unsorted arrays, type inconsistencies), shows the hierarchical factory pattern, and provides invalidation examples.

### Mutation pattern selection
The skill asks about the operation's criticality, user expectations, and rollback requirements, then recommends optimistic or pessimistic patterns with complete onMutate/onError/onSettled implementations.

### Performance diagnosis
The skill checks observer count in TanStack Query DevTools, identifies whether queries are hoisted correctly, measures data size and update frequency, and provides targeted refactoring steps.

## Version

Current version: **1.4.1**

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

Apache-2.0
