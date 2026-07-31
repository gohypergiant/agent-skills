## Summary
The artifact set is behaviorally strong, but `SKILL.md` had a few places where sentence flow and sequencing cues could be tightened without changing behavior. The highest-risk area was folder-level workflow guidance, where clearer sequencing helps preserve the read-root-first rule and reduces misread risk during artifact-set discovery.

## Highest-risk issues first
1. Workflow clarity in artifact-set discovery could mislead readers into treating link-following and broader crawling as one blended step instead of an ordered sequence.
2. A few instructional passages in `SKILL.md` were denser than needed, which increased audit friction without adding behavior.
3. Cross-file support guidance was mostly aligned already, but `references/checklist.md` benefited from one sequencing clarification so its validation language matched the root file more directly.

## Finding list
- Category: workflow drift risk
  - Source text: `Then follow explicit links and references from SKILL.md, AGENTS.md, and other instruction files before you broaden to a recursive crawl...`
  - Risk: Moderate
  - Why it matters: The source was already safe, but the sentence carried two stages in one long line. Splitting the sequence more explicitly makes the ordered dependency easier to follow during folder-level work.

- Category: clarity and auditability
  - Source text: `This skill applies to text that does more than sound good.`
  - Risk: Low
  - Why it matters: The sentence was clear in context, but a more operational opening makes the scope easier to scan before the contract details that follow.

- Category: cross-file consistency
  - Source text: `Did you follow explicit links and references from SKILL.md, AGENTS.md, and other inspected instruction files before broadening...`
  - Risk: Low
  - Why it matters: Adding the root-first sequence to the checklist keeps the validation language aligned with the main workflow wording in `SKILL.md`.

## Rewrite

### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/SKILL.md`
Rewritten in place. Frontmatter was intentionally excluded from review and edits.

### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/checklist.md`
Rewritten in place.

## Summary
- Task: Audit plus rewrite the skill folder `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose` in `mode=strict`, excluding frontmatter from audit and rewrite, and write the report to `runs/accelint-skill-prose/iteration-2/skill-prose.md`
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/checklist.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/frontmatter-descriptions.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/workflow-guardrails.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/ste-compatible-rules.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/rfc-2119.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/examples.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/artifact-patterns.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving structure and sentence tightening improved scanability, sequencing clarity, and local auditability without changing workflow semantics or guardrail strength
  - Notes: tightened the core contract opening, clarified ordered discovery language, improved a few section transitions, and split one dense workflow caution into cleaner adjacent lines. Frontmatter was not audited or edited by explicit requirement.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/checklist.md`
  - Changed: yes
  - Why: behavior-preserving cross-file alignment with the root workflow now makes the root-first discovery order explicit in the checklist
  - Notes: added the `Read the root SKILL.md first` sequencing cue to the cross-file consistency checks
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/frontmatter-descriptions.md`
  - Changed: no
  - Why: out of scope for edits in this stage because the user explicitly required skipping frontmatter auditing and rewriting entirely
  - Notes: inspected for artifact-set completeness only; no frontmatter-focused audit or rewrite was performed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/workflow-guardrails.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: already aligned with the root file on workflow sequencing, guardrail preservation, and exactness priorities
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/ste-compatible-rules.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: already used stable terminology and clear sentence-level guidance without low-risk local tightening opportunities
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/rfc-2119.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: the file is already compact and normatively precise; further tightening would likely reduce exactness
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/examples.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: examples remained aligned with the root rules and continue to anchor behavior-bearing distinctions clearly
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/artifact-patterns.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: local prose was already compact, well-separated by artifact type, and consistent with the tightened root guidance

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter was intentionally excluded from audit and rewrite by explicit user instruction, so frontmatter-specific guidance in the artifact set was not substantively audited in this stage.
- No sibling `AGENTS.md` exists in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose`.
