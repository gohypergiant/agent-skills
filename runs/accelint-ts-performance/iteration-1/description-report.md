# accelint-ts-performance description report

## Summary
Updated the `SKILL.md` frontmatter description to improve trigger precision, activation quality, and boundary clarity without changing the skill's actual behavior.

## What changed
- Reframed the lead from a broad capability statement to a clearer trigger statement centered on runtime speed, hot paths, and throughput.
- Added concrete positive triggers already supported by the skill and eval set:
  - explicit performance audits
  - profiling follow-up
  - repeated linear lookups
  - nested loops
  - avoidable allocations
  - sequential awaits
  - cache/memoization opportunities
  - memory-locality issues
  - V8 hot-path concerns like `try/catch` in loops
- Added audit-mode language so the description better signals that the skill can classify findings and produce a formal audit without patching code yet.
- Tightened boundaries by explicitly excluding:
  - general TypeScript maintainability
  - type-safety reviews
  - JSDoc/comment cleanup
  - non-performance code reviews

## Rationale
The previous description was strong on topic coverage but less explicit about:
- audit-mode activation
- near-miss boundaries
- concrete trigger phrases tied to the generated eval set

The new description should activate more reliably for genuine performance requests while reducing false positives on adjacent TypeScript quality or documentation tasks.

## Files changed
- `skills/accelint-ts-performance/SKILL.md`
- `runs/accelint-ts-performance/description-report.md`
