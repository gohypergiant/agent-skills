# Changelog

All notable changes to the jargon-extractor skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-11-07

### Fixed
- **Reduced over-flagging of common/industry-standard terms in the glossary.** The reduce subagent (Step 4) now runs an explicit CURATE pass before correlating and merging, dropping newly extracted candidates that don't actually earn a glossary entry: filenames/paths/config keys/CLI flags, generic engineering terms with no project-specific meaning, obvious code symbols, and standard industry terms used in their ordinary sense. Extraction (Step 3) still intentionally over-flags for discovery; curation is the step that was missing to narrow that list back down before filing.
- Curation only applies to newly extracted candidates, never retroactively to terms already in the existing glossary, since an earlier run already decided those were worth keeping.
- The reduce subagent's reply and the final user-facing summary (Step 7) now report how many terms were dropped during curation and why, so a dropped-term count is visible instead of silent.

## [1.0.0] - Initial Release

### Added
- Initial release of jargon-extractor skill
- Parallel subagent-based extraction, one subagent per input file
- Single reduce subagent that correlates and merges terms against the existing glossary
- Deterministic `merge_jargon.py` filing step with strict parsing and dry-run support
- Automatic default discovery of conventional documentation locations
- Cross-linking with AGENTS.md/CLAUDE.md
