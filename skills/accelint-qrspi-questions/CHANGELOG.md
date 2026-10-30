# Changelog

## [1.0.0] - 2026-10-16

### Added
- Initial release. Questions stage of the QRSPI planning workflow, split out of `accelint-qrspi-propose` (formerly steps 8-12).
- Runs as a sub-agent dispatched by `accelint-qrspi-propose`. It receives the ticket in the dispatch prompt, follows `openspec-explore`, and returns research questions as text only.
- The parent writes `questions.md`, so this skill creates no change and writes no files.
- Description is narrow and orchestrator-only, so it does not change the trigger coverage of `accelint-qrspi-propose`.
