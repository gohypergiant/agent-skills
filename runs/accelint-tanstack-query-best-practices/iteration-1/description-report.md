# TanStack Query skill description optimization report

## Outcome
Updated `skills/accelint-tanstack-query-best-practices/SKILL.md` frontmatter description.

## What changed
- Reframed the description around user intent and decision-making, not just a keyword list of APIs.
- Made the skill more explicit about architecture, setup, audits, migrations, and debugging when TanStack Query is the main server-state layer.
- Strengthened the Next.js App Router/server-client cache boundary language.
- Added clearer negative boundaries for SWR, plain fetch, Zustand, local UI state, and backend-only caching unless TanStack Query is central.

## Why
The original description already covered many TanStack Query topics, but it read mostly like a feature inventory. The optimized version is more distinctive in trigger terms: it tells the model when this skill should win, especially for app-shape, cache-boundary, and migration/debugging requests.

I ran the `skill-creator` description optimization loop non-interactively with a generated 16-query eval set at:
- `runs/accelint-tanstack-query-best-practices/trigger-evals.json`

Optimization artifacts are in:
- `runs/accelint-tanstack-query-best-practices/optimization-results/2026-07-30_160428/`

Best result selected by the loop:
- Original held-out score: `3/6`
- Best held-out score: `4/6`
- Best train score: `5/10`

## Notes
- The eval set still exposed some hard-to-trigger positive cases, especially optimistic-update and hydration-debugging prompts, so this is an incremental improvement rather than a solved trigger model.
- Per request, I did not update changelog or version metadata.
