# accelint-nextjs-best-practices description optimization

Changed: yes

## Before
Next.js performance optimization and best practices. Use whenever working in a Next.js codebase—especially App Router work involving Server Components, Client Components, Server Actions, route handlers, RSC serialization, data fetching, server-side rendering, Suspense boundaries, authentication inside Server Actions, request deduplication, or Server-vs-Client component decisions. Prefer this skill for Next.js-specific architecture, performance, and security patterns rather than generic React or TypeScript advice.

## After
Next.js performance, architecture, and security best practices. Use whenever the task is specific to a Next.js codebase—especially App Router or Pages Router work involving Server Components, Client Components, Server Actions, route handlers, RSC serialization boundaries, server-vs-client ownership, data fetching, SSR, Suspense/streaming, cache revalidation, request deduplication, auth inside mutations or handlers, or bundle issues tied to barrel imports and shared packages. Also use for Next.js reviews, audits, refactors, or debugging when the user asks what pattern is allowed, where logic should live, why a page is slow, or how to harden a Server Action or API flow. Prefer this skill over generic React, TypeScript, or backend advice whenever the right answer depends on Next.js-specific behavior or constraints.

## Rationale
- Expanded coverage to match evals for Pages Router, cache revalidation, streaming, route-handler security, bundle/barrel-import issues, and architecture/debugging phrasing.
- Kept precision by anchoring triggers to tasks where the answer depends on Next.js behavior, not generic React, TypeScript, or backend patterns.
- Added explicit audit/review/refactor language to help the skill win near-boundary Next.js requests.

## Trigger tradeoffs
- More likely to trigger on legitimate Pages Router and route-handler reviews.
- Slightly broader around generic "auth" or "bundle" wording, but constrained by repeated Next.js-specific framing and the final preference sentence.