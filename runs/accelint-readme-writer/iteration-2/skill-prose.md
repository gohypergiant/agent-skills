High-risk findings first

1. Moderate: `skills/accelint-readme-writer/SKILL.md` repeated the README-scope workflow clearly, but some sentences buried the operational action behind abstract phrasing. This did not change behavior, but it increased audit friction in a file that controls workflow order and required fallback behavior.
2. Moderate: `skills/accelint-readme-writer/AGENTS.md` and several `references/*.md` files had uneven sentence structure and mixed list styles. The rules were still correct, but the local prose made the contract harder to scan than necessary.
3. Low: `skills/accelint-readme-writer/references/readme-structure.md` and `skills/accelint-readme-writer/references/readme-template.md` had small phrasing inconsistencies that could be tightened without affecting examples, order, or exact references.

Rewrite

Updated the artifact set, excluding frontmatter as requested. The rewrite preserves trigger coverage, workflow order, guardrail strength, exact technical references, and the required `accelint-english-manager` dependency behavior.

Key rewrite effects:
- Surfaced operational actions earlier in `SKILL.md`, especially around scope, discovery fallback, findings merge, and confirmation behavior.
- Tightened `AGENTS.md` for local clarity while preserving the same workflow and support-file handoff.
- Standardized nearby list phrasing and sentence endings in `references/codebase-analysis.md`, `references/readme-structure.md`, `references/readme-template.md`, and `references/writing-principles.md`.
- Left frontmatter unchanged, including the optimized `description` and version metadata.

## Summary
- Task: Audit plus rewrite the behavior-defining prose for `skills/accelint-readme-writer`, in strict mode, while skipping frontmatter entirely and writing the report to `runs/accelint-readme-writer/iteration-2/skill-prose.md`
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/SKILL.md` (frontmatter intentionally excluded), `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/AGENTS.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/codebase-analysis.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/readme-structure.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/readme-template.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/writing-principles.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/CHANGELOG.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving structure tightening improved scanability around scope, discovery fallback, findings merge, and confirmation logic without changing workflow semantics or exact references; frontmatter was intentionally left unchanged per request
  - Notes: tightened operational prose in the body only; preserved section order, trigger examples, required prompts, commands, paths, and hard-stop strength

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/AGENTS.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved sentence structure and instruction clarity while keeping the same workflow summary and reference handoffs
  - Notes: clarified the abstract, normalized a few imperative/support lines, and kept the existing guide structure intact
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/codebase-analysis.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved list consistency and sentence clarity in analysis steps
  - Notes: kept examples, code, and API-documentation rules exact; only adjusted nearby prose and list phrasing
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/readme-structure.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved wording in guidance lines without changing the required section order or optional-section conditions
  - Notes: preserved all examples, exact section order, and the optional `Architecture & Development Guides` gating rule
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/readme-template.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved customization bullets so they read as direct instructions and stayed aligned with the rest of the artifact set
  - Notes: preserved the template body, placeholders, and exact code examples; only adjusted explanatory prose outside the template
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/references/writing-principles.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved directness and kept terminology consistent with the required prose-polish workflow
  - Notes: preserved all examples and the required `accelint-english-manager` relationship; tightened explanatory sentences only
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-readme-writer/CHANGELOG.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: inspected during the local-tightening sweep; current entries were already sufficiently clear and are historical release records rather than active behavior instructions

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter was intentionally excluded from both audit and rewrite per the explicit request. The optimized `description` was reviewed only to confirm that it remained untouched.
- No incomplete crawl noted within the requested artifact set.
