# Skill Prose Report — accelint-qrspi-archive

## Summary

Audited the local artifact set under `skills/accelint-qrspi-archive` in strict mode and applied safe prose improvements directly. The highest-risk issue was artifact drift: `README.md` no longer matched the behavior defined in `SKILL.md`, especially around inline archive execution, targeted `openspec/specs/INDEX.md` patching, and the removal of phase-based workflow framing.

## Highest-risk issues first

1. `README.md` described obsolete behavior that conflicted with `SKILL.md`.
2. `README.md` still used phase-based structure and references that the skill had already removed to prevent premature stopping.
3. `README.md` claimed archive and extraction always ran in a subagent and that `openspec/specs/INDEX.md` was rebuilt wholesale every run.
4. Versioned artifact alignment needed maintenance after changing published skill files.

## Findings

### 1. Artifact drift between `SKILL.md` and `README.md`
- Category: Behavioral drift risk
- Source: `skills/accelint-qrspi-archive/README.md`
- Risk: High
- Why it matters: The README instructed readers using outdated workflow semantics, including subagent archive execution and full index rebuilds that directly contradicted the current skill contract.
- Action: Rewrote the README to match the current archive-plus-bookkeeping workflow and boundaries.

### 2. Obsolete phase framing in `README.md`
- Category: Workflow drift risk
- Source: `skills/accelint-qrspi-archive/README.md`
- Risk: High
- Why it matters: The README reintroduced phase boundaries and phase references that prior skill work had intentionally removed from the canonical skill instructions because they encourage premature stopping.
- Action: Replaced phase-oriented prose with stage and step-oriented wording that matches the current skill behavior.

### 3. Incorrect subagent guidance in `README.md`
- Category: Guardrail / execution-model drift
- Source: `skills/accelint-qrspi-archive/README.md`
- Risk: High
- Why it matters: The README said archive and extraction always ran in a subagent, but `SKILL.md` now requires archive to run inline and reserves subagents for per-capability spec writing.
- Action: Corrected archive execution guidance and preserved the degraded inline fallback only for spec writing.

### 4. Incorrect specs index maintenance guidance in `README.md`
- Category: Exact technical meaning drift
- Source: `skills/accelint-qrspi-archive/README.md`
- Risk: High
- Why it matters: The README described wholesale `openspec/specs/INDEX.md` rebuilds on every run, but the skill now patches touched rows and uses a full build only for bootstrap.
- Action: Rewrote the index-maintenance section and related examples.

### 5. Versioned artifact alignment
- Category: Consistency / release hygiene
- Source: `skills/accelint-qrspi-archive/SKILL.md`, `skills/accelint-qrspi-archive/CHANGELOG.md`
- Risk: Medium
- Why it matters: Once versioned skill artifacts changed, `metadata.version` and `CHANGELOG.md` needed to stay aligned.
- Action: Added a `1.3.3` changelog entry and updated `SKILL.md` metadata to `1.3.3`.

## Rewrite summary

Applied direct safe improvements to:
- `skills/accelint-qrspi-archive/README.md`
- `skills/accelint-qrspi-archive/CHANGELOG.md`
- `skills/accelint-qrspi-archive/SKILL.md`

## Inspected artifact set

- `skills/accelint-qrspi-archive/SKILL.md` — changed only for `metadata.version` alignment after changelog update
- `skills/accelint-qrspi-archive/CHANGELOG.md` — changed
- `skills/accelint-qrspi-archive/README.md` — changed
- `skills/accelint-qrspi-archive/evals/evals.json` — unchanged: Already near minimum safe form

## Output-template completion

### Mode
- Output mode: Audit plus rewrite
- Rewrite mode: `mode=strict`

### Scope
- Audited only `skills/accelint-qrspi-archive` and wrote the report only to `runs/accelint-qrspi-archive/skill-prose-report.md`
- No files outside those directories were modified

### Preservation checks
- Trigger boundaries preserved in `SKILL.md`
- Archive execution remains inline in the invoking agent context
- Spec writing remains subagent-first with degraded inline fallback only when subagents are unavailable
- Additive-only `related:` behavior preserved
- `openspec/specs/INDEX.md` patch-vs-bootstrap behavior preserved
- Append-only `openspec/changes/archive/INDEX.md` behavior preserved
- Exact command, path, field, and identifier references preserved where behavior depends on them

### Self-check result
- Artifact-set crawl complete for the allowed scope
- Local-tightening sweep completed across inspected behavior-bearing files
- Versioned files kept aligned after edits
- No broad policy or workflow redesign introduced
