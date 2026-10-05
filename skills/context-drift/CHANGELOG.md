# Changelog

All notable changes to the context-drift skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-30

### Added
- Initial release of the `context-drift` skill
- Canonical ownership model covering `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `CONSTRAINTS.md`, `JARGON.md`, `EPISTEMIC-MAP.md`, `README.md`, and `openspec/config.yaml`
- Staged workflow for audit-only, change-plan, and proposal-by-proposal apply modes
- Guardrails for lossless moves, diff previews, and per-proposal approval
- Routing guidance for handing approved changes off to the correct companion skill when broader document synthesis is required

### Changed
- Moved owner-skill invocation to the front of the workflow so file-ownership judgments come from the relevant companion skills, not from this skill alone
- Removed the direct-edit escape hatch and now require accepted proposals to be executed through the relevant owner skill or skills
- Clarified that this skill is an orchestrator for cross-document comparison and approval, not the final authority on what belongs in each file
- Narrowed subagent usage to the two places that actually save parent-context space: the owner-skill review pass and the owner-skill apply pass
- Kept the findings merge, proposal shaping, and approval loop in the parent context so the same data is not pointlessly bounced through reducer subagents

### Rationale
- Externalizes the cross-document drift-checking workflow that was previously carried in an ad-hoc prompt
- Preserves the load-bearing separation between project DNA, system structure, agent behavior, constraints, knowledge state, terminology, and human onboarding
- Makes context-file cleanup safer by requiring explicit destination ownership and one-by-one review before edits
- Aligns the skill more closely with the original prompt's intent to rely on the companion skills' judgment from the start
- Uses subagents only where they genuinely keep the main context lean instead of adding extra handoff overhead
