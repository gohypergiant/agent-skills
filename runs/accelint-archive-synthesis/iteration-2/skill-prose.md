Summary
- Highest-risk issue: The root skill used a few long, safety-critical sentences where workflow and guardrail meaning stayed correct but scanability was weaker than necessary.
- Frontmatter was intentionally excluded from this audit and rewrite, per the request, so trigger-description and compatibility text in frontmatter were not reviewed or changed.
- No trigger drift, workflow-order drift, or guardrail weakening was introduced in the rewritten files.

Rewrite

File: `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/SKILL.md`
- Tightened high-impact prose in the body only, while preserving step order, human-review gates, write-permission boundaries, and exact technical references.
- Split dense introductory and guardrail-heavy passages into shorter direct sentences.
- Preserved severity labels, step numbers, commands, paths, identifiers, and workflow semantics exactly where they carry behavior.
- Did not audit or rewrite the YAML frontmatter.

File: `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/README.md`
- Tightened supporting documentation for terminology stability and clearer sentence structure.
- Preserved scope, examples, thresholds, and routing behavior.
- Kept the README aligned with the root skill after the body-level prose cleanup.

## Summary
- Task: Audit plus rewrite the behavior-defining prose in `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis`, in `mode=strict`, while explicitly skipping frontmatter audit and edits.
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/SKILL.md` (body only; frontmatter intentionally excluded), `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/README.md`, `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/CHANGELOG.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving structure tightening improved scanability in safety-critical workflow and guardrail prose without changing workflow order, approval logic, or exact references.
  - Notes: Tightened the body prose only. Split dense paragraphs, clarified a few hard-stop statements, and kept step numbering, examples, severity states, write boundaries, and `findings:` behavior intact. Frontmatter was deliberately left untouched.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/README.md`
  - Changed: yes
  - Why: local-tightening sweep found low-risk sentence-structure and terminology improvements needed to keep the supporting doc aligned with the root skill rewrite.
  - Notes: Clarified write-permission wording, stable terminology, and review behavior without changing examples, thresholds, or scope.
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/CHANGELOG.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: The changelog is already near minimum safe form for its purpose, and changing historical release notes would not improve the behavior contract.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter was excluded from the artifact rewrite by explicit user requirement, so frontmatter trigger and compatibility prose was not re-audited during this pass.
- No sibling `AGENTS.md` or behavior-bearing `references/` directory exists under `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis`, so the reviewed artifact set was limited to the root skill body, README, and changelog.
