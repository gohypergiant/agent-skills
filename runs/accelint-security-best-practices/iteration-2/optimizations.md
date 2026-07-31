# Stage 3 Optimizations — accelint-security-best-practices

## Applied changes

### 1) Replace exhaustive-sounding audit language with bounded-coverage language
- **recommendation addressed**: Replace exhaustive-sounding audit language with bounded-coverage language
- **evidence type supporting it**: Static audit evidence
- **files changed**: `skills/accelint-security-best-practices/SKILL.md`
- **summary of implementation**: Reworded Phase 1, Phase 2, Important Notes, and the decision-tree intro so the skill still expects broad review, but now requires the agent to report only what it actually verified, state review boundaries, note unreviewed areas, and avoid implying exhaustive coverage when the audit is partial.
- **reason this change matches the evidence**: Stage 1 found repeated absolute phrasing that could encourage overclaiming in large or time-bounded reviews. This change directly narrows that risk without changing the skill’s core workflow.

### 2) Add more adjacent should-not-trigger evals
- **recommendation addressed**: Add more adjacent should-not-trigger evals
- **evidence type supporting it**: Static audit evidence
- **files changed**: `skills/accelint-security-best-practices/evals/evals.json`
- **summary of implementation**: Added three negative-boundary evals covering API/auth performance tuning, upload architecture tradeoff analysis, and middleware refactoring with security explicitly deferred.
- **reason this change matches the evidence**: Stage 1 showed only one explicit near-miss negative case. These additions improve evidence for trigger boundaries without changing runtime instructions.

## Not applied

### 3) Tighten duplicated guidance in the core skill file rather than restating doctrine
- **reason not applied**: Evidence was static-only and confidence was medium. Broad de-duplication risks removing useful standalone context from `SKILL.md` without run-time evidence that token cost is materially hurting results.

### 4) Convert generic security doctrine into agent-operational instructions where possible
- **reason not applied**: Only partially addressed through the bounded-coverage wording edits above. A broader prose rewrite was deferred to avoid broad behavioral drift before Stage 4’s dedicated prose pass.
