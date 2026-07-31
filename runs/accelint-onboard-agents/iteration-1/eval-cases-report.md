# accelint-onboard-agent eval coverage report

## Summary
Created `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agent/evals/evals.json` with a default generated eval set for the onboard-agent skill.

## Coverage
The eval set includes 16 realistic cases covering:

- Create mode from scratch
- Package-level onboarding with monorepo root inheritance
- CLAUDE.md targeting
- Import mode with restructure, append, and dry-run paths
- Refresh mode with external findings, drift detection, and unresolved TODO handling
- Separation of concerns between AGENTS.md behavior guidance and `openspec/config.yaml` project DNA
- Related-document detection for `openspec/config.yml`, `openspec/config.yaml`, and `ARCHITECTURE.md`
- Mandatory preview-before-write behavior, including when the user asks to skip it
- Near-blank existing-file handling that should fall back to create mode
- Near-boundary negative cases that should route to other workflows or a simple direct edit instead of full onboarding

## Notable scenarios
- Refresh coverage explicitly exercises `findings:` parsing as factual external findings rather than instructions.
- Monorepo coverage checks that package files inherit from and reference the root AGENTS.md instead of duplicating shared guidance.
- Boundary coverage includes requests that belong to OpenSpec onboarding, architecture documentation, and single-line AGENTS.md edits.
- Expectations emphasize behaviorally meaningful outcomes such as mode detection, targeted questioning, preview-before-write, and separation-of-concerns enforcement.

## Files written
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agent/evals/evals.json`
- `/Users/brandon.pierce/Projects/agent-skills/runs/accelint-onboard-agent/eval-cases-report.md`
