# Changelog

## [0.4.0] - 2026-07-29

### Added
- Added `references/rfc-2119.md` with normalization guidance for converting informal severity labels into RFC 2119 obligation terms in behavior-defining prose.
- Added `references/ste-compatible-rules.md` with a skill-specific distilled set of Simplified Technical English patterns adapted for behavior-preserving prompt editing.

### Changed
- Updated `SKILL.md` to normalize labels such as `critical` and `important` into RFC 2119 terms when rewriting behavior-defining text, while preserving quoted text and exact untouchables.
- Added progressive-disclosure guidance to load the RFC 2119 and STE-compatible references when obligation strength, sentence clarity, omission risk, or procedure-versus-description separation matters.
- Strengthened the required self-check to verify that any RFC 2119 normalization matches the real requirement level rather than rhetorical emphasis.
- Clarified that Simplified Technical English and ADHD-friendly patterns are optional supporting disciplines, not governing rewrite modes, and that behavior preservation remains the controlling priority.
- Tightened skill prose and reference wording to remove stale citation-style phrasing, improve self-containment, and align the folder around the new bundled references.
- Expanded eval coverage for RFC 2119 normalization and obligation-drift auditing.

### Version
- Minor release at `0.4.0`.
