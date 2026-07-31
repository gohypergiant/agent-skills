# Eval cases report

Recommended coverage for `accelint-archive-synthesis`:

1. Human-approved run after archive suggestion — verifies explicit acceptance before execution.
2. Reject automatic execution / auto-fix behavior — verifies hard human-invocation guardrails.
3. Decision drift across related capabilities — verifies clustering, targeted verification, and non-assumptive reporting.
4. Ambiguous contradiction resolution — verifies no guessed `Status` updates.
5. Persisted dismissal of an exact decision-drift pair — verifies `SYNTHESIS-LOG.md` suppression behavior.
6. Reconciliation with missing spec file — verifies CRITICAL finding and single-row removal behavior.
7. Reconciliation with Purpose/related mismatch — verifies bounded reads and patch-only updates that preserve `last_touched_by`.
8. Structural coupling outlier detection — verifies threshold math and architecture-debt routing.
9. Small-corpus run — verifies ask-before-proceeding low-signal behavior.
10. Missing writer-skill `findings:` support — verifies manual-handoff degraded mode.
11. No subagent support — verifies bounded parent-context fallback instead of refusal.
12. Partial human review — verifies unreviewed findings are treated as deferred and do not trigger writes.

## Risks and gaps
- Decision-drift coarse scanning should be tested with multiple wording patterns so the eval set does not overfit to the example oppositions in the skill.
- High-volume candidate throttling and malformed-row handling likely need fixture-based evals, not just prompt-level checks.
- Reconciliation race conditions and writer-skill routing failures are documented well but are best validated with environment-driven test fixtures.
