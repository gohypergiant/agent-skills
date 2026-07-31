# Next.js Best Practices

Performance, architecture, and security guidance for Next.js applications, written for agents and LLMs working with Next.js code.

## Overview

This skill provides structured Next.js performance and security guidance covering:
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

1. **Read [SKILL.md](SKILL.md)** to understand activation criteria and workflow.
2. **Start with [AGENTS.md](AGENTS.md)** for the condensed rule map and diagnostic guide.
3. **Use [references/quick-checklist.md](references/quick-checklist.md)** to triage common scenarios quickly.
4. **Load only the needed reference file(s)** because each detailed reference covers one pattern.
5. **Consult [scripts/README.md](scripts/README.md)** when a quick heuristic scan would help confirm likely issues.

### For Humans

This skill is optimized for AI agents, but humans may also use it for:
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

### 3. Miscellaneous
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

## Skill Structure

This skill uses **progressive disclosure** to minimize context usage:

### Primary Files
- **[SKILL.md](SKILL.md)** - Canonical activation criteria, workflow, and trigger phrases
- **[AGENTS.md](AGENTS.md)** - Condensed rule map and quick diagnostic guide (read this first after activation)
- **[references/quick-checklist.md](references/quick-checklist.md)** - Fast triage for common scenarios

### Detailed References
Load only when you need implementation details:

**General Patterns (1.x):**
- [prevent-waterfall-chains.md](references/prevent-waterfall-chains.md)
- [parallelize-independent-operations.md](references/parallelize-independent-operations.md)
- [strategic-suspense-boundaries.md](references/strategic-suspense-boundaries.md)

**Server-Side Performance (2.x):**
- [server-actions-security.md](references/server-actions-security.md)
- [avoid-duplicate-serialization.md](references/avoid-duplicate-serialization.md)
- [minimize-serialization.md](references/minimize-serialization.md)
- [parallel-data-fetching.md](references/parallel-data-fetching.md)
- [react-cache-deduplication.md](references/react-cache-deduplication.md)
- [use-after-non-blocking.md](references/use-after-non-blocking.md)

**Miscellaneous (3.x):**
- [avoid-barrel-imports.md](references/avoid-barrel-imports.md)
- [server-vs-client-component.md](references/server-vs-client-component.md)

**Additional Resources:**
- [compound-patterns.md](references/compound-patterns.md) - Real-world combined patterns

### Automation Scripts
Helper scripts for detecting anti-patterns during audits:
- [scripts/check-server-actions-auth.sh](scripts/check-server-actions-auth.sh)
- [scripts/detect-barrel-imports.sh](scripts/detect-barrel-imports.sh)
- [scripts/find-waterfall-chains.sh](scripts/find-waterfall-chains.sh)

See [scripts/README.md](scripts/README.md) for usage and limitations.

### Assets
- [assets/output-report-template.md](assets/output-report-template.md) - Standardized audit report format

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

This skill is designed for agentic coding environments and should activate when:
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

1. **Security first** - Always authenticate and validate Server Actions.
2. **Eliminate waterfalls** - Start independent operations immediately.
3. **Parallelize independent operations** - Use Promise.allSettled() when tasks do not depend on each other.
4. **Minimize serialization** - Send only what the client needs.
5. **Strategic Suspense** - Show wrapper UI while data loads.
6. **Cache intelligently** - Use React.cache() for server-side deduplication.

---

## Related Skills

- **accelint-react-best-practices** - For React-specific optimizations such as hooks, memoization, and re-renders.
- **accelint-ts-best-practices** - For TypeScript type-safety and correctness patterns.
- **accelint-security-best-practices** - For security guidance beyond Server Actions.

---

## Architecture & Development Guides

For deeper context on this repository:
- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Repository architecture and system design
- [AGENTS.md](../../AGENTS.md) - Agent behavior and workflow conventions

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
