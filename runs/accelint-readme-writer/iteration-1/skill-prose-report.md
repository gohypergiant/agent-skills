## Summary
- Task: Audit and tighten the behavior-defining prose for `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer`.
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/AGENTS.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/codebase-analysis.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/readme-structure.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/readme-template.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/writing-principles.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/SKILL.md`
  - Changed: yes
  - Why: Tightened workflow wording, normalized local terminology, and made conditions and boundaries easier to scan without changing trigger coverage, workflow order, or exact prompt requirements.
  - Notes: Clarified README scope language, tightened Step 1.5 through Step 4, kept all exact paths, commands, and required prompt text intact, and aligned section labels and dependency wording.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/AGENTS.md`
  - Changed: yes
  - Why: Local sentence-structure and heading style needed alignment with the root workflow after the root file rewrite.
  - Notes: Tightened guidance sentences, normalized heading capitalization, and clarified normative section-order language with `MUST`.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/codebase-analysis.md`
  - Changed: yes
  - Why: Local tightening improved scanability and terminology consistency without changing analysis scope or API-documentation rules.
  - Notes: Normalized heading style, tightened explanatory lines, and preserved all code examples and exact file references.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/readme-structure.md`
  - Changed: yes
  - Why: The file needed clearer obligation language and better alignment with the root file's related-doc rules.
  - Notes: Normalized section-order wording to `MUST`, tightened headings and explanatory sentences, and updated the optional Architecture & Development Guides note to include both `openspec/config.yml` and `openspec/config.yaml`, plus `CLAUDE.md`.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/readme-template.md`
  - Changed: yes
  - Why: A local-tightening sweep found minor wording drift in one behavior-bearing note.
  - Notes: Tightened the monorepo phrasing without changing the template structure or any exact commands.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/writing-principles.md`
  - Changed: yes
  - Why: The file needed clearer local wording and heading normalization to stay consistent with the rest of the artifact set after the rewrite.
  - Notes: Tightened titles, removed rhetorical banner phrasing, and preserved all example content and the dependency on `accelint-english-manager`.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- None noted
