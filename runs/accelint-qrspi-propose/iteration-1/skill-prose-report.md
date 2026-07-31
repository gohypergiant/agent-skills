Risk summary: Low. The artifact crawl was complete for `skills/accelint-qrspi-propose`, and the safe edits focused on local clarity, checkpoint wording, error-handling scanability, and README alignment. Trigger coverage, workflow order, guardrail force, and exact technical references were preserved.

## Rewrite summary
- Tightened `skills/accelint-qrspi-propose/SKILL.md` in strict mode without changing trigger families, step order, or approval logic.
- Tightened `skills/accelint-qrspi-propose/README.md` so its planning-only boundary, required checkpoints, and manual-fallback limits match the root skill more closely.
- Updated `skills/accelint-qrspi-propose/CHANGELOG.md` and aligned `skills/accelint-qrspi-propose/SKILL.md` `metadata.version` to `1.6.4`.

## Summary
- Task: Audit and safely rewrite the `skills/accelint-qrspi-propose` artifact set, then write the report to `runs/accelint-qrspi-propose/skill-prose-report.md`
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `skills/accelint-qrspi-propose/SKILL.md`, `skills/accelint-qrspi-propose/README.md`, `skills/accelint-qrspi-propose/CHANGELOG.md`, `skills/accelint-qrspi-propose/evals/evals.json`

## What changed
- `skills/accelint-qrspi-propose/SKILL.md`
  - Changed: yes
  - Why: Tightened behavior-defining prose for clearer requirement language, more even sentence structure, and better local scanability while preserving trigger coverage, workflow semantics, and exact technical references.
  - Notes: Replaced rhetorical checkpoint emphasis outside exact prompts with clearer required-language, tightened error-handling bullets, and made a few local structure edits without changing step order or prompt content.

## Other artifact-set files
- `skills/accelint-qrspi-propose/README.md`
  - Changed: yes
  - Why: The README is part of the local artifact set and needed light tightening so its checkpoint wording, planning-only boundary, and fallback guidance stayed aligned with `SKILL.md`.
  - Notes: Tightened workflow headings, manual-fallback wording, implementation handoff phrasing, and a few sentence-level clarity issues.
- `skills/accelint-qrspi-propose/CHANGELOG.md`
  - Changed: yes
  - Why: Versioned skill files changed, so the changelog needed a matching entry and version bump alignment.
  - Notes: Added a `1.6.4` entry describing the prose-tightening pass.
- `skills/accelint-qrspi-propose/evals/evals.json`
  - Changed: no
  - Why: Already near minimum safe form.
  - Notes: The file is data, not behavior-defining prose, and this pass did not require content changes there.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- No `AGENTS.md`, `references/`, or other local behavior-bearing Markdown files were present under `skills/accelint-qrspi-propose` during the crawl.
- `skills/accelint-qrspi-propose/evals/evals.json` was inspected as part of the folder sweep but not rewritten because it is not prose-bearing and did not need alignment changes.
