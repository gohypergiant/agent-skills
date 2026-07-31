# accelint-tanstack-query-best-practices audit report

## Overall grade
A-

## Key findings
- Strong package structure with effective progressive disclosure: `SKILL.md` routes readers into focused reference files instead of forcing the full corpus into context.
- Technical guidance is generally accurate and concrete, especially around request-isolated `QueryClient` setup, observer economics, optimistic updates, and shared key factories.
- The biggest weakness was trigger and scope calibration. The description was too narrow for non-Next.js TanStack Query work, while the body sometimes implied Next.js-specific guidance too early.
- Some workflow instructions were overly rigid or brittle, including an internal line-number reference and a blanket `useCallback` suggestion for `select` functions that was less precise than the reference material itself.

## Applied optimizations
- Expanded the `SKILL.md` description so the skill triggers more reliably for TanStack Query audits, refactors, debugging, cache issues, and React Query migration work, not just a small subset of Next.js cases.
- Added a `Scope` section clarifying that the skill applies broadly to React TanStack Query usage, with Next.js App Router guidance treated as conditional rather than universal.
- Refined scenario routing so `server-integration.md` and `caching-strategy.md` are only loaded when the codebase actually uses server rendering, hydration, or a coordinated server cache layer.
- Tightened performance-debugging instructions by removing the brittle line-number reference and adding a clearer route for query-key instability problems.
- Clarified `select` guidance to prefer stable module-level selectors and reserve `useCallback` for selectors that truly depend on runtime values.

## Remaining risks
- The skill is still fairly dense. Even with better routing, some invocations may over-apply TanStack Query complexity to simple client-side cases.
- `assets/output-report-template.md` remains highly detailed and audit-oriented; that is useful for deep reviews, but it may be heavy for lightweight advisory tasks.
- Next.js-specific cache guidance depends on adjacent framework knowledge. In mixed-stack or non-Next environments, an agent still needs to verify applicability before applying the server-cache patterns.
