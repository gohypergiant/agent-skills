Risk summary
- The highest drift risk was in `skills/accelint-ts-documentation/SKILL.md`, where strong guidance used mixed emphasis styles and a few longer sentences that made workflow boundaries harder to scan.
- Cross-file drift also existed in `skills/accelint-ts-documentation/README.md`, which referred to outdated reference-file names and loading behavior that no longer matched the package structure.
- The rewrites tightened local structure and terminology without changing trigger coverage, workflow order, or exact technical references.

Rewrite summary
- Tightened `skills/accelint-ts-documentation/SKILL.md` in strict mode for clearer task-type branching, fallback steps, and edge-case loading guidance.
- Tightened supporting prose in `skills/accelint-ts-documentation/AGENTS.md`, `skills/accelint-ts-documentation/README.md`, `skills/accelint-ts-documentation/references/jsdoc.md`, `skills/accelint-ts-documentation/references/comments.md`, and `skills/accelint-ts-documentation/assets/output-report-template.md` to improve local clarity and keep the artifact set aligned.
- Preserved all key behavior anchors, including file paths, reference names, JSDoc tag tokens, and audit-template structure.

## Summary
- Task: Audit and tighten the `skills/accelint-ts-documentation` skill-package prose, then apply aligned rewrites across the inspected artifact set.
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `skills/accelint-ts-documentation/SKILL.md`, `skills/accelint-ts-documentation/AGENTS.md`, `skills/accelint-ts-documentation/README.md`, `skills/accelint-ts-documentation/references/jsdoc.md`, `skills/accelint-ts-documentation/references/comments.md`, `skills/accelint-ts-documentation/assets/output-report-template.md`

## What changed
- `skills/accelint-ts-documentation/SKILL.md`
  - Changed: yes
  - Why: Tightened behavior-defining prose to make task-type branching, fallback handling, and edge-case loading rules easier to scan without changing trigger scope or workflow semantics.
  - Notes: Clarified the frontmatter description slightly, normalized a few instruction sentences, and tightened the reference-loading and fallback sections while preserving exact reference names and decision logic.

## Other artifact-set files
- `skills/accelint-ts-documentation/AGENTS.md`
  - Changed: yes
  - Why: Improved local sentence structure and consistency with the root `SKILL.md` so the quick-reference guide stays aligned with the same documentation rules.
  - Notes: Tightened the abstract, usage guidance, and several rule summaries without changing requirements.
- `skills/accelint-ts-documentation/README.md`
  - Changed: yes
  - Why: Fixed cross-file drift and improved local clarity where the README described outdated reference loading and package structure.
  - Notes: Rewrote the activation/loading section to match the current `references/` layout and tightened several descriptive sections.
- `skills/accelint-ts-documentation/references/jsdoc.md`
  - Changed: yes
  - Why: Improved local clarity in behavior-bearing guidance while preserving JSDoc requirements and exact tag references.
  - Notes: Tightened scope wording, directive-comment handling, internal/exported split, and destructured-parameter guidance.
- `skills/accelint-ts-documentation/references/comments.md`
  - Changed: yes
  - Why: Improved local clarity and scanability for removal, preservation, and placement guidance without weakening any comment-quality rules.
  - Notes: Tightened marker language and several explanatory sentences.
- `skills/accelint-ts-documentation/assets/output-report-template.md`
  - Changed: yes
  - Why: Tightened instructional prose and fixed a grammar error in a user-facing warning block while preserving the report structure and required fields.
  - Notes: Kept the template format intact and only improved wording clarity.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- None noted
