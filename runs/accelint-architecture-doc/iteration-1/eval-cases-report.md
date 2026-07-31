# Eval cases report

Recommended coverage for `accelint-architecture-doc`:

1. Create mode for a simple repo — verifies codebase-first discovery and full-template generation.
2. Refresh mode with real drift — verifies read-before-write, drift detection, and changed-section preview behavior.
3. Restructure mode for a messy existing doc — verifies explicit restructure/append/dry-run choice and preservation of human-authored content.
4. Monorepo root generation — verifies repo-wide scope and package-aware structure coverage.
5. Package-level doc with existing root doc — verifies root-doc reference behavior and no shared-infra duplication.
6. Package-level doc without root doc — verifies local-scope defaulting inside a monorepo.
7. OpenSpec-aware generation — verifies use of `openspec/config.yml|yaml` as a source of truth for stack facts.
8. Unknown infrastructure fallback — verifies TODO markers and no fabricated deployment details.
9. Large multi-domain repo — verifies broad discovery coverage and parallel-preferred behavior.
10. Refresh with external `findings:` input — verifies prompt-finding parsing and merge with drift detection.
11. Agent-doc follow-up — verifies AGENTS.md/CLAUDE.md reference updates happen only after the architecture doc workflow.

## Risks and gaps
- Preview-before-write and explicit confirmation are important but may need transcript-aware evals to verify properly.
- Monorepo scope mistakes are a major risk; eval fixtures should vary both working directory and user intent.
- Restructure behavior is sensitive because it must preserve unmapped content rather than silently normalize it away.
