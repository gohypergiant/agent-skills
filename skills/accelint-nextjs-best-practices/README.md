# Next.js Best Practices

Comprehensive performance optimization and best practices for Next.js applications, designed for AI agents and LLMs working with Next.js code.

## Overview

This skill provides structured guidance for Next.js performance optimization and security, covering:
- Server-side waterfall prevention
- Server Actions authentication and security
- RSC serialization optimization
- Parallel data fetching patterns
- Request deduplication with React.cache()
- Server vs Client Component decisions

**Note:** This skill focuses on Next.js-specific optimizations for the App Router. For React-specific patterns (hooks, memoization, etc.), use the `accelint-react-best-practices` skill.

---

## Quick Start

### For Agents/LLMs

1. **Read [SKILL.md](SKILL.md)** - Understand when to activate this skill and how to use it
2. **Reference [AGENTS.md](AGENTS.md)** - Browse all patterns with detailed examples
3. **Apply patterns** - Each section contains ❌ incorrect and ✅ correct examples

### For Humans

This skill is optimized for AI agents but humans may find it useful for:
- Learning Next.js App Router performance patterns
- Reviewing code for security issues in Server Actions
- Understanding RSC serialization optimization
- Systematic performance auditing

---

## Pattern Categories

### 1. General Patterns
Core patterns for optimal server-side execution:
- Prevent waterfall chains
- Parallelize independent operations
- Strategic Suspense boundaries

### 2. Server-Side Performance
Patterns for optimizing server-side rendering and data fetching:
- Authenticate Server Actions like API routes
- Avoid duplicate serialization in RSC props
- Minimize serialization at RSC boundaries
- Parallel data fetching with component composition
- Per-request deduplication with React.cache()
- Use after() for non-blocking operations

### 3. Misc
Additional optimization patterns:
- Avoid barrel file imports
- Server vs Client Component decision tree

---

## Key Features

### Security-First Approach
Server Actions are public endpoints and require the same security considerations as API routes:
- Always authenticate inside Server Actions
- Validate all inputs with schemas (Zod recommended)
- Check authorization before mutations
- Never rely solely on middleware or page guards

### RSC Serialization Optimization
Minimize data transfer at Server/Client boundaries:
- Pass only fields the client uses
- Avoid duplicate serialization by sharing references
- Transform data on the client when possible
- Understand deduplication by reference

### Waterfall Prevention
Eliminate sequential dependencies:
- Start independent operations immediately
- Use Promise.allSettled() for parallel execution
- Restructure with component composition
- Use Suspense boundaries strategically

### Request Deduplication
Optimize server-side request caching:
- Use React.cache() for database queries
- Cache authentication checks
- Avoid inline objects as cache keys
- Understand Next.js fetch auto-deduplication

---

## App Router Focus

This skill primarily covers the **Next.js App Router** (Next.js 13+):
- Server Components (default, no directive needed)
- Server Actions (`"use server"`)
- React.cache() for request deduplication
- Suspense boundaries for streaming
- Parallel data fetching patterns
- Next.js-specific APIs (headers, cookies, after)

---

## Usage in Claude Code

This skill is designed to be used with environments such as Claude Code and automatically activates when:
- Writing Server Components or Client Components
- Implementing Server Actions
- Optimizing data fetching
- Reviewing Next.js code for security or performance
- Debugging RSC serialization issues
- Making Server vs Client Component decisions

See [SKILL.md](SKILL.md) for complete activation criteria and trigger phrases.

---

## Performance Philosophy

This skill follows these principles:

1. **Security first** - Always authenticate and validate Server Actions
2. **Eliminate waterfalls** - Start independent operations immediately
3. **Parallelize everything** - Use Promise.allSettled() liberally
4. **Minimize serialization** - Only send what the client needs
5. **Strategic Suspense** - Show wrapper UI while data loads
6. **Cache intelligently** - Use React.cache() for server-side deduplication

---

## Related Skills

- **react-best-practices** - For React-specific optimizations (hooks, memoization, re-renders)
- **typescript-best-practices** - For TypeScript type safety patterns
- **security-best-practices** - For general security patterns beyond Server Actions

---

## References

- https://github.com/wsimmonds/claude-nextjs-skills
- https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
- https://github.com/sickn33/antigravity-awesome-skills/blob/main/skills/nextjs-best-practices/SKILL.md
- https://skills.sh/wshobson/agents/nextjs-app-router-patterns
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Server Components Guide](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Server Actions and Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Authentication Best Practices](https://nextjs.org/docs/app/guides/authentication)
- [Performance Optimization Guide](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Package Import Optimization](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
