Critical findings first
- `skills/accelint-skill-manager/SKILL.md` had one trigger-coverage gap in the frontmatter description. It covered creation, audit, refactor, evaluation, and improvement requests, but it did not explicitly include the common user phrasing "build a skill package." I added that phrase to reduce undertriggering without broadening into adjacent prose-only or README/docs work.
- Several artifact-set files used soft or inconsistent severity labels such as `MANDATORY`, `CRITICAL`, or informal emphasis where the text was actually defining a requirement. I normalized the clearest cases to `REQUIRED` or `MUST` where that preserved the same obligation level and improved auditability.
- The package already told a coherent story about creation, refinement, audit, and templates. Most edits were local-tightening rewrites to improve scanability, terminology stability, and obligation clarity without changing workflow order or boundaries.

Rewrites applied
- `skills/accelint-skill-manager/SKILL.md`
- `skills/accelint-skill-manager/AGENTS.md`
- `skills/accelint-skill-manager/README.md`
- `skills/accelint-skill-manager/references/skill.md`
- `skills/accelint-skill-manager/references/agents.md`
- `skills/accelint-skill-manager/references/assets.md`
- `skills/accelint-skill-manager/references/changelog.md`
- `skills/accelint-skill-manager/references/file-system.md`
- `skills/accelint-skill-manager/references/progressive-disclosure.md`
- `skills/accelint-skill-manager/references/references.md`
- `skills/accelint-skill-manager/references/scripts.md`
- `skills/accelint-skill-manager/assets/skill-template/SKILL.md`
- `skills/accelint-skill-manager/assets/skill-template/AGENTS.md`
- `skills/accelint-skill-manager/assets/skill-template/README.md`
- `skills/accelint-skill-manager/assets/skill-template/CHANGELOG.md`
- `skills/accelint-skill-manager/assets/skill-template/references/example.md`

## Summary
- Task: Audit plus rewrite, in strict mode, for the full prose artifact set in `skills/accelint-skill-manager`, including `SKILL.md`, `AGENTS.md`, `README.md`, `references/`, `evals/`, and template assets.
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `skills/accelint-skill-manager/SKILL.md`, `skills/accelint-skill-manager/AGENTS.md`, `skills/accelint-skill-manager/README.md`, `skills/accelint-skill-manager/CHANGELOG.md`, `skills/accelint-skill-manager/evals/evals.json`, `skills/accelint-skill-manager/references/skill.md`, `skills/accelint-skill-manager/references/agents.md`, `skills/accelint-skill-manager/references/assets.md`, `skills/accelint-skill-manager/references/changelog.md`, `skills/accelint-skill-manager/references/file-system.md`, `skills/accelint-skill-manager/references/progressive-disclosure.md`, `skills/accelint-skill-manager/references/references.md`, `skills/accelint-skill-manager/references/scripts.md`, `skills/accelint-skill-manager/assets/skill-template/SKILL.md`, `skills/accelint-skill-manager/assets/skill-template/AGENTS.md`, `skills/accelint-skill-manager/assets/skill-template/README.md`, `skills/accelint-skill-manager/assets/skill-template/CHANGELOG.md`, `skills/accelint-skill-manager/assets/skill-template/references/example.md`

## What changed
- `skills/accelint-skill-manager/SKILL.md`
  - Changed: yes
  - Why: Preserve trigger coverage while reducing undertrigger risk, normalize requirement strength, and tighten workflow wording without changing order or package boundaries.
  - Notes: Added the trigger phrase `"build a skill package"`; tightened anti-patterns and workflow prose; normalized `MANDATORY` to `REQUIRED`; preserved creation vs audit boundaries and the lightest-path routing model.

## Other artifact-set files
- `skills/accelint-skill-manager/AGENTS.md`
  - Changed: yes
  - Why: Improve local clarity and scanability while preserving the same progressive-disclosure guidance and reference map.
  - Notes: Tightened abstract and quick-reference rule summaries.
- `skills/accelint-skill-manager/README.md`
  - Changed: yes
  - Why: Improve human-facing clarity while keeping the same package story, workflow framing, and usage boundaries.
  - Notes: Tightened overview, quick-start guidance, and contribution language; preserved 4-step workflow references.
- `skills/accelint-skill-manager/CHANGELOG.md`
  - Changed: no
  - Why: Already near minimum safe form.
  - Notes: Version `2.1.1` still matches `metadata.version` in `SKILL.md`, and the latest entries already explain what changed and why.
- `skills/accelint-skill-manager/evals/evals.json`
  - Changed: no
  - Why: Already near minimum safe form.
  - Notes: The eval set already reflects the package story across creation, targeted refinement, audit-only behavior, trigger-boundary near misses, version governance, and cross-file consistency.
- `skills/accelint-skill-manager/references/skill.md`
  - Changed: yes
  - Why: Normalize requirement wording and tighten explanation around description-field behavior without changing the trigger-safety rule.
  - Notes: Converted the clearest normative `CRITICAL` label to `REQUIRED`; tightened rationale sentences around workflow-summary drift.
- `skills/accelint-skill-manager/references/agents.md`
  - Changed: yes
  - Why: Improve local sentence quality without changing token-efficiency guidance or example expectations.
  - Notes: Tightened overview wording only.
- `skills/accelint-skill-manager/references/assets.md`
  - Changed: yes
  - Why: Improve scanability and directness while preserving asset-scope guidance.
  - Notes: Tightened folder purpose, use-case, and benefit language.
- `skills/accelint-skill-manager/references/changelog.md`
  - Changed: yes
  - Why: Make requirement strength and rationale guidance clearer without changing version-governance behavior.
  - Notes: Normalized version-consistency wording to `REQUIRED` and `MUST`; tightened explanatory prose.
- `skills/accelint-skill-manager/references/file-system.md`
  - Changed: yes
  - Why: Clarify file-system rules while preserving exact path and naming expectations.
  - Notes: Tightened directory-purpose wording and made exact-folder-name requirements easier to scan.
- `skills/accelint-skill-manager/references/progressive-disclosure.md`
  - Changed: yes
  - Why: Improve directness and formatting consistency while preserving loading-order behavior.
  - Notes: Tightened bullets and preserved the same metadata/instructions/resources model.
- `skills/accelint-skill-manager/references/references.md`
  - Changed: yes
  - Why: Clarify when to use reference files and preserve the alignment-first rule.
  - Notes: Tightened overview wording; normalized one strong requirement to `MUST`; preserved the ask-first rule for aggressive format refactors.
- `skills/accelint-skill-manager/references/scripts.md`
  - Changed: yes
  - Why: Improve local clarity while preserving script-inclusion criteria and bash guidance.
  - Notes: Tightened `When to include` and `Benefits` wording.
- `skills/accelint-skill-manager/assets/skill-template/SKILL.md`
  - Changed: yes
  - Why: Keep template severity language aligned with the live skill and make template instructions easier to audit.
  - Notes: Normalized description-field and thinking-pattern requirement labels; tightened several template comments.
- `skills/accelint-skill-manager/assets/skill-template/AGENTS.md`
  - Changed: yes
  - Why: Improve template clarity while preserving the same progressive-loading pattern.
  - Notes: Tightened abstract and usage bullets.
- `skills/accelint-skill-manager/assets/skill-template/README.md`
  - Changed: yes
  - Why: Improve human-facing template clarity and align obligation wording with the live package.
  - Notes: Tightened contribution checklist and normalized the main activation requirement to `REQUIRED`.
- `skills/accelint-skill-manager/assets/skill-template/CHANGELOG.md`
  - Changed: yes
  - Why: Align template severity wording with the live changelog guidance.
  - Notes: Normalized the version-match requirement to `REQUIRED`.
- `skills/accelint-skill-manager/assets/skill-template/references/example.md`
  - Changed: yes
  - Why: Improve local sentence quality in the template without changing the example structure.
  - Notes: Tightened overview and explanation prompts.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- None noted
