Highest-risk issues first:
- `SKILL.md` used mixed severity labels such as `MANDATORY` and `Do NOT Load` for behavior-bearing workflow steps. That wording was clear enough to follow, but it mixed informal severity with normative rules. I normalized the workflow language to `REQUIRED` and `MUST NOT` where the source already expressed absolute requirements or prohibitions.
- Several reference files had compact but uneven sentence structure around guardrails, explanations, and summary bullets. These did not materially drift behavior, but they made the contract harder to scan and audit than necessary.
- The frontmatter description was already behaviorally strong. I limited the edit there to a local tightening that preserved the same trigger families and boundaries.

## Summary
- Task: Audit plus rewrite the full artifact set for `skills/accelint-tanstack-query-best-practices` in `mode=strict`, apply safe prose improvements in place, and write the report to `runs/accelint-tanstack-query-best-practices/skill-prose-report.md`
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/query-client-setup.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/server-integration.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/query-keys.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/patterns-and-pitfalls.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/fundamentals.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/caching-strategy.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/mutations-and-updates.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/assets/output-report-template.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/assets/query-client.ts`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving workflow and guardrail tightening; normalized severity language where the source already expressed absolute requirements or prohibitions.
  - Notes: Tightened the frontmatter description locally without changing trigger coverage, standardized scenario-loading rules to `REQUIRED` and `MUST NOT`, improved scanability in diagnostic steps, and removed one brittle line-reference mention that was not needed for behavior.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/query-client-setup.md`
  - Changed: yes
  - Why: local-tightening pass to improve sentence structure and rationale clarity while preserving the same request-isolation rule and streaming guidance.
  - Notes: Clarified why per-request isolation matters, tightened browser-singleton wording, and made rationale bullets easier to scan.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/server-integration.md`
  - Changed: yes
  - Why: local-tightening pass to improve workflow readability and explanatory wording without changing hydration behavior.
  - Notes: Tightened `await` guidance, improved two-layer caching explanation, and normalized summary bullets for easier audit.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/query-keys.md`
  - Changed: yes
  - Why: local-tightening pass to improve terminology consistency and scanability while preserving exact key patterns and invalidation guidance.
  - Notes: Tightened explanation text around compile-time safety and best-practice bullets; preserved all code, key examples, and cross-layer behavior.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/patterns-and-pitfalls.md`
  - Changed: yes
  - Why: local-tightening pass to improve consistency around repeated `When to Use` guidance and final summary bullets.
  - Notes: Standardized repeated guidance language, improved clarity around `useMemo`, `staleTime`, `gcTime`, and AbortController wording, and preserved all anti-pattern boundaries.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/fundamentals.md`
  - Changed: yes
  - Why: local-tightening pass to improve explanatory sentences and final summary bullets without changing performance guidance.
  - Notes: Tightened terminology around `staleTime`, `gcTime`, observers, structural sharing, and deduplication.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/caching-strategy.md`
  - Changed: yes
  - Why: local-tightening pass to improve multi-layer cache explanations while preserving the same unified invalidation model.
  - Notes: Tightened purpose bullets, clarified server/client invalidation steps, and improved the final notes section.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/references/mutations-and-updates.md`
  - Changed: yes
  - Why: local-tightening pass to improve lifecycle explanations and obligation clarity around optimistic updates and fetch behavior.
  - Notes: Tightened `useSuspenseQuery`, signal handling, `select`, mutation lifecycle bullets, and final operational notes.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/assets/output-report-template.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: This is a user-facing report template rather than a behavior-bearing instruction artifact for skill execution. I inspected it because it sits in the skill package, but its current wording was already compact and locally clear.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-tanstack-query-best-practices/assets/query-client.ts`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: This asset is code, not prose. The inline comments are already concise and behaviorally aligned with `references/query-client-setup.md`, so changing them in this prose pass would add risk without enough benefit.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- None noted
