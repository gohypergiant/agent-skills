# accelint-qrspi-apply audit report

Grade: A-

## Summary
Focused audit completed for `skills/accelint-qrspi-apply`. The skill was already strong: detailed, operational, and aligned with the repo's QRSPI/OpenSpec workflow. The main risks were safe-trigger coverage, ambiguity around parallel-slice collision handling, and lack of explicit guidance for malformed injected context.

## Key findings
- Strong end-to-end workflow with clear sequencing, guardrails, and examples.
- Good specificity around OpenSpec commands, living-document updates, and verification.
- Frontmatter description was solid but under-covered resume/re-entry cases and did not strongly distinguish when this should win over plain `/opsx:apply`.
- Execution guidance assumed task-defined parallelization was safe, but did not explicitly require a quick overlap check before parallelizing slices that may touch the same files or tightly coupled code.
- Context injection logic explained how to extract `config.yaml` context, but did not explicitly say to skip injection if the extracted block looked malformed.
- README drifted from the current skill behavior in a few places, especially phase ordering and the context-loading step.

## Applied optimizations
- Strengthened `SKILL.md` frontmatter description to better cover QRSPI apply, resumption, and parallel-slice execution triggers.
- Added a context sanity-check step before injecting `openspec/config.yaml` guidance into sub-agent prompts.
- Added conflict-risk checks before serial and parallel slice delegation.
- Added explicit collision review between dependency levels.
- Expanded human-in-the-loop and edge-case handling for ambiguous slice boundaries and parallel merge risk.
- Tightened git status guidance to `git status --short`.
- Updated `README.md` to reflect the current workflow more accurately, including:
  - preflight and load-context phases
  - update-docs before verify
  - overlap checks before parallelization
  - final verify report as the completion report
  - safer sequential fallback wording when sub-agents are unavailable

## Changed files
- `skills/accelint-qrspi-apply/SKILL.md`
- `skills/accelint-qrspi-apply/README.md`

## Notes
- No version or changelog updates were made, per request.
- Changes were kept focused on safer orchestration, clearer triggering, and artifact consistency.
