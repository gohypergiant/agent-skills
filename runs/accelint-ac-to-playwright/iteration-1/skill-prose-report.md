Risk summary
- Highest risk before the rewrite: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ac-to-playwright/SKILL.md` mixed normative instructions, rationale, and examples in long sections that made workflow order and hard stops harder to audit.
- The rewrite used `mode=strict` to reorganize and tighten those sections without changing trigger families, workflow sequencing, approval and stop logic, or exact technical references.
- No cross-file drift was found in the inspected artifact set. The linked reference files were already near minimum safe form for this skill contract.

Rewritten artifact
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ac-to-playwright/SKILL.md` was tightened in place. The operative changes were:
  - normalized high-signal headings and banners into plainer normative language while preserving obligation strength
  - separated instructions from explanation in the intent, assessment, conversion, recognition, and hard-stop sections
  - tightened long sentences and lists so the execution path is easier to scan and audit
  - preserved exact file paths, commands, code examples, trigger phrases, and workflow order

## Summary
- Task: Audit and rewrite behavior-defining prose for `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ac-to-playwright`, then write the report to `runs/accelint-ac-to-playwright/skill-prose-report.md`
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ac-to-playwright/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ac-to-playwright/references/acceptance-criteria.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ac-to-playwright/references/test-hooks.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ac-to-playwright/SKILL.md`
  - Changed: yes
  - Why: The file defines trigger logic, workflow order, and hard stops. A strict rewrite improved scanability and separated instructions from rationale without changing behavior.
  - Notes: Tightened the mandatory-read section, normalized mode descriptions, clarified assessment and conversion workflows, improved list readability, and preserved exact references and examples.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ac-to-playwright/references/acceptance-criteria.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file is behavior-bearing and was inspected because `SKILL.md` requires it. The prose is already explicit about sequencing, ambiguity, targets, and examples. A rewrite would add drift risk without meaningful clarity gain.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ac-to-playwright/references/test-hooks.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file is compact, terminology-stable, and behaviorally exact. The controlled vocabulary rules and examples are already easy to audit.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- No `AGENTS.md` exists in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ac-to-playwright`.
- The artifact crawl followed explicit links from `SKILL.md` and found two behavior-bearing Markdown references. No incomplete crawl issues were found.
- No changes were made outside `SKILL.md` because the local-tightening sweep found the inspected reference files already near minimum safe form.
