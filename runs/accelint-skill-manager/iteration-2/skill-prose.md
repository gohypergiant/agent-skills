## Summary
- Highest risk: `SKILL.md` had several long or slightly inflated sentences in workflow and guardrail-adjacent guidance that increased scan friction and made operational boundaries easier to miss, even though the underlying behavior was sound.
- Secondary risk: several behavior-bearing support files used mixed phrasing and uneven sentence shape, which raised local readability cost and made progressive-disclosure handoffs less crisp across the artifact set.
- Frontmatter was intentionally excluded from both audit and rewrite per request, so trigger-description safety was not re-audited here.

## Rewrite

### /Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/SKILL.md
- Tightened section leads, workflow prose, and audit output bullets without changing workflow order, obligation strength, or exact linked references.
- Preserved all frontmatter exactly and left trigger-routing language in frontmatter untouched.
- Normalized sentence shape around progressive disclosure, workflow routing, and audit expectations so the file is easier to scan in strict mode.

### /Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/AGENTS.md
- Tightened summary prose and one-line rule wording for more direct reference loading and script guidance.
- Kept all section structure, linked references, and rule coverage intact.

### /Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/agents.md
- Tightened token-efficiency guidance and normalized prohibition phrasing for easier auditability.
- Preserved examples, reference link, and exact requirement intent.

### /Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/assets.md
- Tightened the opening description and examples list for clearer category scanning.
- Preserved scope, inclusion rules, and output-resource intent.

### /Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/changelog.md
- Made one rationale sentence more direct without changing changelog policy or versioning guidance.

### /Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/file-system.md
- Tightened directory and local-reference wording while keeping all naming rules, filenames, and path examples exact.

### /Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/progressive-disclosure.md
- Tightened the opening sentence only.
- Preserved all token and file-structure guidance.

### /Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/references.md
- Tightened explanation flow around example order and duplication boundaries.
- Preserved requirement strength, template reference, and escalation instruction.

### /Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/scripts.md
- Tightened bash guidance wording and preserved exact commands, paths, and follow-on audit requirement.

## Summary
- Task: Audit plus rewrite the accelint-skill-manager behavior-defining prose artifact set in strict mode, excluding all frontmatter from audit and rewrite, and write the report to `runs/accelint-skill-manager/iteration-2/skill-prose.md`
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/AGENTS.md`, `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/agents.md`, `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/assets.md`, `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/changelog.md`, `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/file-system.md`, `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/progressive-disclosure.md`, `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/references.md`, `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/scripts.md`, `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/skill.md`, `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/CHANGELOG.md`, `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/README.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/SKILL.md`
  - Changed: yes
  - Why: Tightened workflow and guardrail-adjacent prose to improve scanability and local clarity while preserving workflow semantics, exact references, and non-frontmatter behavior.
  - Notes: Tightened anti-pattern bullets, workflow section leads, step wording, and audit output guidance. Frontmatter was intentionally left unchanged.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/AGENTS.md`
  - Changed: yes
  - Why: Tightened local sentence structure and summary wording so the progressive-disclosure handoff stays clear and concise.
  - Notes: Updated abstract, usage steps, and script summary wording.
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/agents.md`
  - Changed: yes
  - Why: Tightened local sentence structure and normalized prohibition phrasing without changing token-efficiency guidance or example behavior.
  - Notes: Updated overview wording and redundancy bullets; kept examples intact.
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/assets.md`
  - Changed: yes
  - Why: Tightened list wording for easier category scanning while preserving inclusion criteria and scope.
  - Notes: Reworked the opening bullets into clearer example phrases.
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/changelog.md`
  - Changed: yes
  - Why: Tightened local wording in a rationale sentence without changing versioning policy or audit semantics.
  - Notes: Small wording-only clarification in the purpose section.
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/file-system.md`
  - Changed: yes
  - Why: Tightened local wording to improve readability while preserving naming rules, exact filenames, and path behavior.
  - Notes: Updated overview wording and local-reference lead-in.
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/progressive-disclosure.md`
  - Changed: yes
  - Why: Tightened the opening line for local clarity without changing progressive-disclosure guidance.
  - Notes: One sentence updated.
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/references.md`
  - Changed: yes
  - Why: Tightened explanation flow and preserved exact requirement strength around duplication and template alignment.
  - Notes: Clarified example-order sentence and split one long duplication sentence.
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/scripts.md`
  - Changed: yes
  - Why: Tightened local wording in bash guidance while preserving exact commands, paths, and follow-on audit requirements.
  - Notes: Updated bash recommendations wording only.
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/references/skill.md`
  - Changed: no
  - Why: Out of scope. This file is frontmatter-heavy guidance, and the user explicitly required skipping frontmatter auditing and rewriting during this stage.
  - Notes: Left unchanged to avoid indirect frontmatter-policy edits.
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/CHANGELOG.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: Inspected during the local-tightening sweep. The prose is already compact, behaviorally clear, and adequate for this stage.
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager/README.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: Inspected during the local-tightening sweep. It is mainly human-facing package documentation, and additional tightening here would not improve the skill contract materially.

## Behavior check
- Trigger coverage: incomplete verification
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter was intentionally excluded from this stage, including trigger-description auditing and any frontmatter-related rewrites.
- `references/skill.md` was left unchanged because rewriting that frontmatter-governing reference would have conflicted with the explicit frontmatter freeze for this pass.
- No other artifact-set files changed outside the files listed above.
