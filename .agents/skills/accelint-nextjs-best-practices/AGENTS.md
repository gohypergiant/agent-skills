# Next.js Best Practices

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining, generating, or refactoring Next.js code. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive performance optimization guide for Next.js applications, designed for AI agents and LLMs. Each rule includes one-line summaries with links to detailed examples in `references/`. Load reference files only when implementing a specific pattern.

**Focus:** Next.js App Router patterns including Server Components, Server Actions, RSC serialization, and server-side optimization.

- **For React specific patterns**, use the `accelint-react-best-practices` skill.
- **For JavaScript/TypeScript specific patterns**, use the `accelint-ts-best-practices` skill.
- **For Testing patterns**, use the `accelint-ts-testing` skill.

---

## How to Use This Guide

**For agents/LLMs:**
1. Scan rule summaries below to identify relevant optimizations
2. Load reference files only when implementing a specific pattern
3. Each reference is self-contained with ❌/✅ examples

**Quick shortcuts:**
- Security issues? → 2.1 (Server Actions authentication)
- Waterfall issues? → 1.1-1.2 (Parallelization)
- Large HTML payload? → 2.2-2.3 (Serialization optimization)
- Slow page loads? → 1.3 (Suspense), 2.4 (Parallel data fetching)
- Real-world examples? → [Compound Patterns](references/compound-patterns.md)
- Not sure what's wrong? → Use Quick Diagnostic Guide below

**Next.js Resources:**
- [App Router](https://nextjs.org/docs/app) | [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) | [Authentication](https://nextjs.org/docs/app/guides/authentication) | [Performance](https://nextjs.org/docs/app/building-your-application/optimizing)

---

## Quick Diagnostic Guide

Use this guide to quickly identify which optimization applies based on symptoms:

**Symptom → Solution:**
- API route or Server Action is slow → 1.1 Prevent Waterfall Chains, 1.2 Parallelize Operations
- Entire page waits for data → 1.3 Strategic Suspense Boundaries
- Server Action can be called without login → 2.1 Authenticate Server Actions
- HTML response is huge → 2.3 Minimize Serialization, 2.2 Avoid Duplicate Serialization
- Data fetches happen sequentially → 2.4 Parallel Data Fetching with Composition
- Same query runs multiple times per request → 2.5 Per-Request Deduplication
- Logging/analytics blocks response → 2.6 Use after() for Non-Blocking Operations
- Development server is slow to start → 3.1 Avoid Barrel File Imports
- Not sure if component should be client or server → 3.2 Server vs Client Component
- Data is duplicated in RSC props → 2.2 Avoid Duplicate Serialization
- Cache not working with React.cache() → 2.5 Per-Request Deduplication (avoid inline objects)

**Security Issues:**
- Server Action has no auth check → 2.1 Authenticate Server Actions
- Server Action doesn't validate input → 2.1 Authenticate Server Actions (with Zod validation)
- Server Action allows unauthorized mutations → 2.1 Authenticate Server Actions (authorization check)

---

## 1. General

Core patterns for optimal server-side execution in Next.js App Router.

### 1.1 Prevent Waterfall Chains
Start independent operations immediately in API routes/Server Actions, even if you don't await them yet.
[View detailed examples](references/prevent-waterfall-chains.md)

### 1.2 Parallelize Independent Operations
Use Promise.allSettled() to run fully independent async operations concurrently.
[View detailed examples](references/parallelize-independent-operations.md)

### 1.3 Strategic Suspense Boundaries
Use Suspense to show wrapper UI immediately while data loads, instead of blocking entire page.
[View detailed examples](references/strategic-suspense-boundaries.md)

---

## 2. Server-Side Performance

Optimizing server-side rendering and data fetching eliminates server-side waterfalls and reduces response times. These patterns are specific to Next.js App Router and RSC (React Server Components).

### 2.1 Authenticate Server Actions Like API Routes
Always verify authentication and authorization inside each Server Action—treat them as public endpoints.
[View detailed examples](references/server-actions-security.md)

### 2.2 Avoid Duplicate Serialization in RSC Props
RSC deduplicates by reference, not value. Do transformations (.toSorted(), .filter(), .map()) in client, not server.
[View detailed examples](references/avoid-duplicate-serialization.md)

### 2.3 Minimize Serialization at RSC Boundaries
Only pass fields the client actually uses—every prop is serialized into HTML.
[View detailed examples](references/minimize-serialization.md)

### 2.4 Parallel Data Fetching with Component Composition
Restructure Server Component tree so siblings fetch data in parallel, not sequentially.
[View detailed examples](references/parallel-data-fetching.md)

### 2.5 Per-Request Deduplication with React.cache()
Wrap database queries and auth checks with React.cache() to deduplicate within a request. Use primitives as arguments, not inline objects.
[View detailed examples](references/react-cache-deduplication.md)

### 2.6 Use after() for Non-Blocking Operations
Schedule logging, analytics, and side effects to run after response is sent using Next.js's after().
[View detailed examples](references/use-after-non-blocking.md)

---

## 3. Misc

Additional optimization patterns for Next.js applications.

### 3.1 Avoid Barrel File Imports
Import directly from source files instead of barrel files (index.js re-exports) to avoid loading thousands of unused modules.
[View detailed examples](references/avoid-barrel-imports.md)

### 3.2 Server vs. Client Component
Decision tree: Server Components are DEFAULT. Only use 'use client' when you need hooks, events, or browser APIs.
[View detailed examples](references/server-vs-client-component.md)

---

## Summary

### Priority Checklist

When writing or reviewing Next.js code, prioritize in this order:

**1. Security First (Critical)**
- ✅ Authenticate all Server Actions (2.1)
- ✅ Validate all Server Action inputs with schemas
- ✅ Check authorization before mutations

**2. Eliminate Waterfalls (High Impact)**
- ✅ Start independent operations immediately (1.1)
- ✅ Use Promise.allSettled() for parallel operations (1.2)
- ✅ Restructure with component composition (2.4)

**3. Optimize Serialization (High Impact)**
- ✅ Pass only necessary fields to client (2.3)
- ✅ Avoid duplicate serialization (2.2)
- ✅ Share object references when possible

**4. Strategic Suspense (Medium Impact)**
- ✅ Use Suspense boundaries to prevent blocking (1.3)
- ✅ Pass promises to components with `use()` hook
- ✅ Show wrapper UI while data loads

**5. Caching & Non-Blocking (Medium Impact)**
- ✅ Use React.cache() for deduplication (2.5)
- ✅ Use after() for non-blocking operations (2.6)
- ✅ Avoid inline objects in cache keys

**6. Import Optimization (Low Impact, High Frequency)**
- ✅ Avoid barrel file imports (3.1)
- ✅ Import directly from source files

**7. Component Decisions (As Needed)**
- ✅ Use Server Components by default (3.2)
- ✅ Only add 'use client' when necessary
- ✅ Preserve Server/Client boundaries with composition

### Key Principles

1. **Security** - Server Actions are public endpoints, always authenticate
2. **Parallelization** - Start independent operations immediately
3. **Minimization** - Only serialize what the client uses
4. **Streaming** - Use Suspense boundaries strategically
5. **Caching** - Deduplicate with React.cache()
6. **Default to Server** - Only use Client Components when needed

### Related Skills

- **accelint-react-best-practices** - React specific patterns and optimizations
- **accelint-ts-best-practices** - JavaScript/TypeScript patterns and optimizations
- **accelint-ts-testing** - Vitest patterns and optimizations
