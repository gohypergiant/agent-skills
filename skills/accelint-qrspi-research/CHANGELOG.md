# Changelog

## [1.0.0] - 2026-10-16

### Added
- Initial release. Research stage of the QRSPI planning workflow, split out of `accelint-qrspi-propose` (formerly steps 13-16).
- Runs as a sub-agent dispatched by `accelint-qrspi-propose`. It receives only the absolute path of `questions.md`, never the ticket, follows `openspec-explore`, and returns facts-only research findings as text.
- Keeps the v1.10.0 research prompt, including the specs-of-record scan of `openspec/specs/INDEX.md`, the `sem impact` dependency analysis, and the preamble that the repository is owned by the team.
- The parent checks the `questions.md` header and completion marker before dispatch and writes `research.md`, so this skill writes no files.
- Description is narrow and orchestrator-only, so it does not change the trigger coverage of `accelint-qrspi-propose`.
