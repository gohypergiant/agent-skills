# Changelog

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
