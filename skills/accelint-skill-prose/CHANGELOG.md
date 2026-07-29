# Changelog

## [0.5.2] - 2026-07-29

### Fixed
- Clarified that skill-folder work should start with the root `SKILL.md` and then recursively inspect other likely behavior-bearing files in the folder, not only explicitly linked files.
- Clarified that `references/` content and other inspected support files are eligible for edit when cross-file consistency requires it.
- Updated reference guidance and checklist language so folder-path invocations like `/accelint-skill-prose <path-to-skill-folder>` more reliably cover full-folder audits and rewrites.

### Version
- Patch release at `0.5.2`.

## [0.5.1] - 2026-07-29

### Added
- Added explicit skill-folder crawling guidance so edits start by reading the root `SKILL.md` and relevant linked support files before tightening behavior-bearing prose.
- Added cross-file consistency checks to ensure `references/` content stays aligned with revised root instructions.

### Changed
- Updated `SKILL.md` and linked reference files to treat cross-file wording consistency as part of safe skill-prose editing.
- Clarified that description tightening and workflow reviews should consider the full behavior-bearing file set, not only the quoted passage.

### Fixed
- Clarified that short practical notes should stay notes, not expand into more procedural or policy-like prose during scanability rewrites.
- Added checklist and example guidance to preserve compact source formats such as notes, checklists, banners, and headings.

### Version
- Minor+patch changes combined in release `0.5.1`.

## [0.4.2] - 2026-07-29

### Fixed
- Clarified that RFC 2119 normalization applies to heading-level and banner-level severity labels such as `MANDATORY CHECKPOINT`, not only sentence-level prose.
- Required an explicit exactness-based justification when preserving informal severity labels like `MANDATORY` or `CRITICAL` in behavior-defining rewrites.
- Expanded the required self-check to inspect headings, banners, and checkpoint labels for unnormalized severity wording.

### Version
- Patch release at `0.4.2`.

## [0.4.1] - 2026-07-29

### Changed
- Tightened audit-only mode in `SKILL.md` to prohibit sentence-level replacement wording unless the user explicitly asks for examples, reducing the risk of accidental rewrites in audit-only responses.
- Updated the audit-only output rules and required self-check to explicitly verify that audit-only deliverables stay findings-only.

### Version
- Patch release at `0.4.1`.

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
