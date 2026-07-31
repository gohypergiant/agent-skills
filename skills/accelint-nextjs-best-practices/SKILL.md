---
name: accelint-nextjs-best-practices
description: Next.js performance, architecture, and security best practices. Use whenever the task is specific to a Next.js codebase, especially App Router or Pages Router work involving Server Components, Client Components, Server Actions, route handlers, RSC serialization boundaries, server versus client ownership, data fetching, SSR, Suspense and streaming, cache revalidation, request deduplication, auth inside mutations or handlers, or bundle issues tied to barrel imports and shared packages. Also use for Next.js reviews, audits, refactors, and debugging when the user asks what pattern is allowed, where logic should live, why a page is slow, or how to harden a Server Action or API flow. Prefer this skill over generic React, TypeScript, or backend advice whenever the right answer depends on Next.js-specific behavior or constraints.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.1.2"
---

# Next.js Best Practices

Performance, architecture, and security guidance for Next.js applications. This skill is written for agents and LLMs working with Next.js code.

## When to Activate This Skill

Use this skill when the task is specific to a Next.js codebase. Typical cases include:

### Writing Next.js Code
- Creating Server Components or Client Components
- Implementing Server Actions with `"use server"`
- Writing API route handlers
- Setting up data fetching in RSC (React Server Components)
- Implementing Suspense boundaries
- Using Next.js-specific APIs (`headers()`, `cookies()`, `after()`)

### Refactoring Next.js Code
- Optimizing server-side data fetching
- Reducing RSC serialization overhead
- Converting sequential to parallel operations
- Restructuring component composition for better performance
- Migrating between Server and Client Components

### Performance Optimization
- Eliminating server-side waterfalls
- Reducing response times in API routes and Server Actions
- Minimizing data transfer at RSC boundaries
- Implementing request deduplication with `React.cache()`
- Using `after()` for non-blocking operations

### Next.js-Specific Issues
- Authentication/authorization in Server Actions
- RSC serialization duplication problems
- Import optimization (barrel file issues)
- Server vs Client Component decision-making
- Parallel data fetching patterns

### Code Review
- Reviewing Next.js code for performance anti-patterns
- Identifying security issues in Server Actions
- Checking proper Server/Client Component boundaries
- Ensuring proper authentication patterns
- Validating Suspense boundary placement

## When NOT to Use This Skill

Do not activate for:
- React-specific optimizations (use `accelint-react-best-practices` skill)
- Build configuration (webpack, turbopack) unless Next.js-specific
- General TypeScript/JavaScript questions (use `accelint-ts-best-practices` skill)
- Deployment/hosting configuration
- Testing setup (use `accelint-ts-testing` skill)

## Example Trigger Phrases

This skill should activate for requests like:

**Performance Issues:**
- "This Next.js API route is slow"
- "My Server Component is blocking the entire page"
- "Optimize this Server Action"
- "The page takes forever to load data"
- "There's a waterfall in my data fetching"

**Security Issues:**
- "Add authentication to this Server Action"
- "This Server Action needs authorization"
- "Secure this API route"
- "Validate input in this Server Action"

**Debugging Issues:**
- "Why is my RSC props so large?"
- "This data is being duplicated in the HTML"
- "My imports are slow in development"
- "Should this be a Server or Client Component?"

**Code Review:**
- "Review this Next.js code for performance issues"
- "Is this Server Action secure?"
- "Can you optimize this data fetching?"
- "Check if this component should be server or client"

**Refactoring:**
- "Parallelize these data fetches"
- "Reduce the serialization size"
- "Convert this to use Suspense"
- "Optimize this barrel import"

## How to Use

This skill uses a **progressive disclosure** structure to minimize context usage:

### Fast Triage by Task Shape
- **Targeted fix or design question:** Read [AGENTS.md](AGENTS.md) first. Identify the likely pattern, then load only the matching detailed reference.
- **Broad audit or multi-file review:** Read [AGENTS.md](AGENTS.md), then use [references/quick-checklist.md](references/quick-checklist.md) to structure the review before loading deeper references.
- **Route handler or Server Action review:** Start with [AGENTS.md](AGENTS.md), then check the relevant security and performance references before suggesting changes.
- **Unclear diagnosis:** Use [references/quick-checklist.md](references/quick-checklist.md) to map symptoms to likely causes, then load the narrowest matching reference file.

### 1. Start with the Overview (AGENTS.md)
Read [AGENTS.md](AGENTS.md) first for the condensed rule map and quick diagnostic guide.

### 2. Triage Before Going Deep
Use [references/quick-checklist.md](references/quick-checklist.md) when you need a fast review checklist, a scenario-specific starter list, or a quick way to map symptoms to likely fixes.

### 3. Load Specific Rules as Needed
When you identify the relevant pattern, load only the matching reference file. Use it for detailed implementation guidance:

**General Patterns:**
- [prevent-waterfall-chains.md](references/prevent-waterfall-chains.md) (1.1)
- [parallelize-independent-operations.md](references/parallelize-independent-operations.md) (1.2)
- [strategic-suspense-boundaries.md](references/strategic-suspense-boundaries.md) (1.3)

**Server-Side Performance:**
- [server-actions-security.md](references/server-actions-security.md) (2.1)
- [avoid-duplicate-serialization.md](references/avoid-duplicate-serialization.md) (2.2)
- [minimize-serialization.md](references/minimize-serialization.md) (2.3)
- [parallel-data-fetching.md](references/parallel-data-fetching.md) (2.4)
- [react-cache-deduplication.md](references/react-cache-deduplication.md) (2.5)
- [use-after-non-blocking.md](references/use-after-non-blocking.md) (2.6)

**Misc:**
- [avoid-barrel-imports.md](references/avoid-barrel-imports.md) (3.1)
- [server-vs-client-component.md](references/server-vs-client-component.md) (3.2)

**Quick References:**
- [quick-checklist.md](references/quick-checklist.md)
- [compound-patterns.md](references/compound-patterns.md)

**Automation Scripts:**
- [scripts/](scripts/) - Helper scripts to detect anti-patterns

### 4. Adapt to Router Context
If the user explicitly says **Pages Router**, keep the same performance and security principles but answer using Pages Router primitives such as `getServerSideProps`, Pages API routes, and the older data-loading model. Do not force App Router-only APIs like Server Components, Server Actions, or `app/api` route handlers into a Pages Router answer unless the user is asking about migration tradeoffs.

### 5. Verify Version-Sensitive Claims When Needed
If the request depends on a specific Next.js version, an unusual API combination, or behavior you are not fully certain about, verify the claim against current official Next.js documentation before you give a high-confidence recommendation.

### 6. Apply the Pattern
Each reference file contains:
- ❌ Incorrect examples that show the anti-pattern
- ✅ Correct examples that show the recommended implementation
- Explanations of why the pattern matters
- Impact notes
- Related patterns and references

### 7. Use the Report Template
When this skill is invoked for a multi-file Next.js review or audit, use the standardized report format:

**Template:** [`assets/output-report-template.md`](assets/output-report-template.md)

The report format provides:
- Executive Summary with impact assessment
- Severity levels (Critical, High, Medium, Low) for prioritization
- Impact analysis (performance, security, data transfer, maintainability)
- Categories (Server Actions, RSC Serialization, Data Fetching, Component Architecture)
- Pattern references linking to detailed guidance in `references/`
- Summary table for tracking all issues

**When to use the report template:**
- Skill invoked directly via `/accelint-nextjs-best-practices <path>`
- User asks to "review Next.js code" or "audit Next.js app" across file(s), invoking skill implicitly

**When NOT to use the report template:**
- User asks to "fix this Server Action" (implement directly)
- User asks "what's wrong with this code?" (answer directly)
- User requests a narrow targeted change rather than an audit

### 8. Route Handler Review Focus
When reviewing Next.js route handlers, explicitly check:
- authentication and authorization consistency in the handler itself
- whether sensitive headers, cookies, or authorization values are forwarded upstream more broadly than needed
- whether caching is safe for authenticated or user-specific responses
- whether large exports or responses are built fully in memory when streaming, chunking, or pagination would be safer

### 9. Use Automation Scripts Selectively
When you need quick detection help during a real codebase audit, consult [scripts/README.md](scripts/README.md). Run only the script that matches the suspected issue. Treat script output as a heuristic signal that still requires manual review.

## Examples

### Example 1: Optimizing Server Action Security
**Task:** "Add authentication to this Server Action"

**Approach:**
1. Read AGENTS.md overview
2. Identify issue: Server Action needs authentication
3. Load [server-actions-security.md](references/server-actions-security.md)
4. Apply authentication pattern with validation

### Example 2: Eliminating Waterfalls
**Task:** "This page loads slowly with multiple fetches"

**Approach:**
1. Read AGENTS.md overview
2. Identify issue: Sequential data fetching
3. Load [prevent-waterfall-chains.md](references/prevent-waterfall-chains.md) and [parallelize-independent-operations.md](references/parallelize-independent-operations.md)
4. Start operations immediately and use Promise.allSettled()

### Example 3: Reducing Serialization
**Task:** "The HTML response is huge with user data"

**Approach:**
1. Read AGENTS.md overview
2. Identify issue: Over-serialization at RSC boundary
3. Load [minimize-serialization.md](references/minimize-serialization.md)
4. Pass only necessary fields, transform on client

## Additional Resources
 
### ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.