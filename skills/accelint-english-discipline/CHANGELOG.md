# Changelog

## [1.1.0] - 2026-07-28

### Added
- Added a canonical `evals/evals.json` inside the skill directory and expanded it with general-purpose regression coverage for release notes, error help text, and uncertainty-preserving rewrites.

### Changed
- Removed skill- and agent-instruction-specific guidance from `SKILL.md` so this skill stays focused on general English-discipline rewriting rather than `SKILL.md` or AGENTS-style behavior editing.
- Generalized short-description guidance so it applies to compact prose more broadly instead of `SKILL.md` frontmatter specifically.
- Removed skill-specific checks from `references/checklist.md`, deleted the obsolete `references/skill-audits.md`, and removed the agent-instruction section from `references/use-cases.md`.
- Trimmed skill-specific and provenance-heavy examples from `references/examples.md` while keeping general rewrite and audit patterns.
- Updated `references/ste-rules.md` and related wording to remove leftover agent-instruction phrasing and better align the skill with general writing guidance.
- Re-centered the canonical eval set on general prose behavior and removed agent-skill-focused scenarios from the maintained eval file.
- Archived superseded workspace eval folders under `skills/accelint-english-discipline-workspace/archive/`, moved the remaining active non-canonical eval outlier into the archive, and added a workspace README that distinguishes canonical eval definitions from historical run artifacts.

### Version
- Minor release at `1.1.0`.

## [1.0.6] - 2026-07-28

### Changed
- Strengthened skill-editing preservation rules to keep exact field names, slash-joined references, and repository-specific labels such as `specs_touched/decisions` and `/opsx:apply` when they define behavior.
- Added a tighter rewrite rule that requests to tighten should make a real reduction when safe, rather than hovering near the source text out of caution.
- Clarified that rewrite-only tasks should return only the rewrite in final output unless the user explicitly asks for audit notes or explanation.
- Fixed a formatting issue in the rewrite-pattern section so the technical rewrite pattern remains structurally distinct.

### Version
- Patch release at `1.0.6`.

## [1.0.5] - 2026-07-28

### Changed
- Added a narrow rule that short skill descriptions must not add semantically related trigger phrases unless the source already signals them or the user explicitly asks for trigger expansion.
- Reinforced the short-description rewrite pattern to reject silent scope broadening from “helpful” repo-style trigger additions.

### Version
- Patch release at `1.0.5`.

## [1.0.4] - 2026-07-28

### Added
- Added an explicit special-case rule for short skill descriptions and frontmatter-style blurbs.
- Added a regression eval for short skill-description rewrites that must not expand into trigger inventories.

### Changed
- Clarified that frontmatter suitability does not justify broadening a short description into a canonical skill blurb.
- Strengthened the plain rewrite pattern to preserve original scope before adding trigger phrasing in short descriptions.
- Reinforced the preference for source scope words over broader trigger phrase sets in compact descriptions.

### Version
- Patch release at `1.0.4`.

## [1.0.3] - 2026-07-28

### Added
- Added an explicit local-vs-structural rewrite scope check so small rewrite requests default to minimal edits.
- Added new benchmark evals for unwanted prose expansion in non-skill contexts.

### Changed
- Strengthened the default instruction to make the smallest rewrite that solves the user's stated problem.
- Added stronger preservation guidance for concrete scope details and examples that define behavior.
- Clarified that action-oriented shaping should not expand a small rewrite into a larger artifact.
- Added a non-skill safeguard to avoid importing skill-authoring habits into ordinary rewrite tasks.

### Version
- Patch release at `1.0.3`.

## [1.0.2] - 2026-07-28

### Added
- Added hybrid technical-writing guidance for prose that needs both technical clarity and persuasion, warmth, or brand fit.
- Added explicit skill-audit guidance so the discipline can be used more safely on other skills in the repo without weakening triggers, guardrails, or exact references.
- Added a dedicated `references/skill-audits.md` guide for auditing and rewriting other `SKILL.md` files safely.
- Added new examples for hybrid technical rewriting and skill-specific prose audits.

### Changed
- Strengthened hedge handling to distinguish real uncertainty from fake caution or corporate fog.
- Expanded conflict resolution guidance for hybrid writing and relationship-tone preservation.
- Updated the checklist and use-case references to check trigger drift, behavior drift, and exact-reference preservation during skill edits.

### Version
- Patch release at `1.0.2`.

## [1.0.1] - 2026-07-28

### Added
- Added `references/examples.md` with compact rewrite and audit examples for procedural, descriptive, operational, voice-preserving, error-handling, and audit-report writing.

### Changed
- Expanded trigger coverage in `SKILL.md` to better catch vague editing and rewrite requests such as "make this sound better," "too wordy," "edit this," and "clean this up."
- Replaced several overly absolute behavioral rules with a clearer split between hard stops and default biases.
- Strengthened audit-mode guidance with a default report structure, severity-first issue ordering, and clearer STE-specific review behavior.
- Added multi-turn continuity guidance so revisions stay stable across passes and turns.
- Clarified how to handle requests for strict ASD-STE100 compliance without overstating certification.
- Updated progressive-disclosure guidance to include the new examples reference.
- Expanded the examples reference using reusable structural patterns derived from the upstream source skills without copying product-specific or medically specific content.

## [1.0.0] - 2026-07-28

### Added
- Created `accelint-english-discipline`, a new writing skill that synthesizes STE-style technical clarity, ADHD-friendly output shaping, and Orwell-style plain-English editing.
- Added a primary `SKILL.md` with conflict-resolution rules that prioritize user meaning, audience, tone, and explicit constraints over mechanical simplification.
- Added progressive-disclosure references for STE-style rules, ADHD patterns, use cases, substitutions, and final verification.

### Changed
- Established a unified discipline-level model (`Plain`, `Technical`, `Strict STE-leaning`, `Voice-preserving`) so agents can adapt the same core skill across technical, operational, conversational, and voice-sensitive writing.
- Defined explicit resolution guidance for tensions between terseness and tone, active voice and tact, and simplification and truthfulness.

### Version
- Initial release at `1.0.0`.
