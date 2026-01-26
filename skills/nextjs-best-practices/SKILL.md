---
name: nextjs-best-practices
description: Next.js performance optimization and best practices. Use when writing Next.js code (App Router or Pages Router); implementing Server Components, Server Actions, or API routes; optimizing RSC serialization, data fetching, or server-side rendering; reviewing Next.js code for performance issues; fixing authentication in Server Actions; or implementing Suspense boundaries, parallel data fetching, or request deduplication.
metadata:
  author: accelint
  version: "1.0"
---

# Next.js Best Practices

Comprehensive performance optimization and best practices for Next.js applications, designed for AI agents and LLMs working with Next.js code.

## When to Activate This Skill

Use this skill when the task involves:

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
- React-specific optimizations (use react-best-practices skill)
- Build configuration (webpack, turbopack) unless Next.js-specific
- General TypeScript/JavaScript questions
- Deployment/hosting configuration
- Testing setup (use a testing-specific skill if available)

## Example Trigger Phrases

This skill should activate when users say things like:

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

This skill uses a **single-file structure** for Next.js patterns:

### 1. Read the AGENTS.md File
[AGENTS.md](AGENTS.md) contains all Next.js best practices organized into sections:
- **General** - Waterfall prevention, parallelization, Suspense boundaries
- **Server-Side Performance** - Server Actions, RSC serialization, data fetching, caching
- **Misc** - Barrel imports, Server vs Client Component decisions

### 2. Apply the Pattern
Each rule in AGENTS.md includes:
- ❌ Incorrect examples showing the anti-pattern
- ✅ Correct examples showing the optimal implementation
- Clear explanations of why the pattern matters
- References to official Next.js documentation

## Important Notes

### Server Actions Security
Server Actions are **public endpoints** just like API routes. Always authenticate and authorize inside each Server Action - do not rely solely on middleware or page-level checks.

### RSC Serialization
The React Server/Client boundary serializes all data into the HTML response. This directly impacts page weight and load time:
- Only pass fields the client actually uses
- Avoid duplicate serialization by sharing object references
- Transform data on the client when possible

### App Router vs Pages Router
This skill primarily focuses on the **App Router** (Next.js 13+) patterns:
- Server Components (default)
- Server Actions
- React.cache() for deduplication
- Suspense boundaries
- Parallel data fetching patterns

### Performance Philosophy
- Start independent operations immediately (prevent waterfalls)
- Parallelize independent data fetches
- Use Suspense boundaries strategically
- Minimize serialization at RSC boundaries
- Use `after()` for non-blocking operations

## Examples

### Example 1: Optimizing Server Action Security
**Task:** "Add authentication to this Server Action"

**Approach:**
1. Read AGENTS.md section 2.1 (Authenticate Server Actions)
2. Import authentication function
3. Add auth check at start of action
4. Add authorization check if needed
5. Add input validation with Zod

### Example 2: Eliminating Waterfalls
**Task:** "This page loads slowly with multiple fetches"

**Approach:**
1. Read AGENTS.md section 1.1 (Prevent Waterfall Chains)
2. Identify independent operations
3. Start all operations immediately (create promises)
4. Await only when results are needed
5. Use Promise.allSettled() for parallel operations

### Example 3: Reducing Serialization
**Task:** "The HTML response is huge with user data"

**Approach:**
1. Read AGENTS.md section 2.3 (Minimize Serialization)
2. Identify which fields the client actually uses
3. Pass only necessary fields as individual props
4. Move transformations to client side if needed

## Additional Resources

Official Next.js documentation:
- [App Router Documentation](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Authentication Guide](https://nextjs.org/docs/app/guides/authentication)
- [Performance Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
