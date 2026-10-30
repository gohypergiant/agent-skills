# Changelog

## [1.1.0] - 2026-10-17

### Added
- Step 6 `[S-ILLUSTRATE]`: before the design review checkpoint, invoke the `show-me` skill on `design.md` if it is installed. If it is missing or fails, the workflow continues, and the checkpoint message recommends `show-me`. Runs in the skill's own context, not a sub-agent.

### Changed
- Steps after the new step 6 were renumbered (no sub-steps): `[CHECKPOINT-1]` 6→7, `[S-FRONTMATTER]` 7→8, `[S-TASKS-GEN]` 8→9, tasks validation 10→11, `[CHECKPOINT-2]` 11→12, report 12→13. Stable tags are unchanged.

## [1.0.0] - 2026-10-16

### Added
- Initial release. Design, Structure, and Plan stages of the QRSPI planning workflow, split out of `accelint-qrspi-propose` (formerly steps 17-46).
- A procedure that `accelint-qrspi-propose` follows in its own context, not as one sub-agent, because it contains the two human checkpoints. It spawns two ticket-blind sub-agents: design generation and tasks generation.
- Reads `questions.md` and `research.md` from the change folder and infers its own starting step from the artifacts (no state file).
- `references/slicing-rules.md` holds the vertical-slicing validation, horizontal-to-vertical conversion, and Parallelization Strategy rules (formerly steps 41-43).

### Changed
- The design sub-agent runs `openspec-continue-change` only. The change folder already exists, so it no longer runs `openspec-new-change` or reports a "Change name:" line.
- Sub-agent prompts paste the full contents of `questions.md` and `research.md` instead of text held in memory.
- The skill reports back to the orchestrator and does not print the completion message.
- Paths come from `changeRoot` (from `openspec status --json`) instead of a hardcoded `openspec/changes/<slug>/`.
- Description is narrow and orchestrator-only, so it does not change the trigger coverage of `accelint-qrspi-propose`.
