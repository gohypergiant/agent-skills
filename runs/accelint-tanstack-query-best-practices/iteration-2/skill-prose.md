High-risk issues first

1. `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/SKILL.md`
   - Risk: Moderate workflow-clarity risk
   - Why it matters: The root workflow was behaviorally correct, but several sections mixed instruction and explanation in ways that made progressive-disclosure rules harder to scan. This increased the chance of over-reading references or missing scenario-specific gates.

2. `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/SKILL.md`
   - Risk: Low terminology-consistency risk
   - Why it matters: A few sections alternated between prose and code-token forms for the same concepts without a clear pattern. That did not change behavior, but it made cache, hook, and invalidation guidance harder to audit quickly.

Rewritten content

File: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/SKILL.md`

Note: Frontmatter was intentionally excluded from audit and rewrite, per request.

## Summary
- Task: Audit plus rewrite behavior-bearing prose in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices`, excluding frontmatter entirely
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/query-client-setup.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/server-integration.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/query-keys.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/patterns-and-pitfalls.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/mutations-and-updates.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/caching-strategy.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/fundamentals.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving structure tightening improved scanability, terminology consistency, and workflow readability without changing progressive-disclosure routing, guardrail strength, or exact technical references; frontmatter was intentionally left unchanged per explicit instruction
  - Notes: tightened the root introduction and scope wording, normalized several scenario sections into clearer step form, clarified token usage for `staleTime`, `gcTime`, `useQuery`, `updateTag`, and related code terms, and made list guidance easier to scan without changing requirements

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/query-client-setup.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: workflow, examples, and guardrails were already clear and locally tight
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/server-integration.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: sequence, hydration guidance, and exact references were already clear after the local-tightening sweep
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/query-keys.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: key-factory guidance was already compact and behaviorally exact; additional tightening would mainly restyle normative examples
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/patterns-and-pitfalls.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: anti-pattern and correct-pattern contrasts were already explicit, with stable terminology and strong local scanability
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/mutations-and-updates.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: mutation phase order, rollback rationale, and cache-coordination wording were already clear and behaviorally precise
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/caching-strategy.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: the cross-skill dependency note, invalidation examples, and layer distinctions were already direct and exact
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/fundamentals.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: terminology, threshold tables, and performance explanations were already locally clear after the sweep

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter was intentionally excluded from audit and rewrite, per request.
- No sibling `AGENTS.md` exists in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices`.
- No other artifact-set files changed after the dedicated local-tightening sweep.
