# accelint-english-manager skill prose audit report

## Summary
The artifact set is behaviorally consistent and already fairly tight, but several files still had local sentence patterns that made the contract slower to scan than necessary. I applied a strict-mode prose pass across the full local artifact set while preserving trigger coverage, mode behavior, obligation strength, and exact technical references.

Highest-risk findings were concentrated in `SKILL.md`, where the frontmatter description and mode-control sections carried trigger and workflow logic in longer-than-needed sentences. Secondary findings were local scanability issues across reference files and README wording that could be tightened without changing behavior.

## Artifact set reviewed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/SKILL.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/README.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/CHANGELOG.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/checklist.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/ste-rules.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/substitutions.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/adhd-patterns.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/use-cases.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/rfc-2119.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/examples.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/evals/evals.json`

## Highest-risk issues first
1. `SKILL.md` description carried trigger examples and artifact-scope coverage in one long sentence. The risk was scan friction, not trigger drift, so I split the transition while preserving the same trigger family.
2. `SKILL.md` mode and workflow guidance had a few places where sentence flow obscured the smallest-change rule or made strict-mode boundaries slightly less obvious on first read.
3. Several reference files had local wording that was accurate but more padded than necessary, which made the folder contract less consistent than it should be after a strict-mode pass.

## Findings and applied rewrites

### 1. Frontmatter trigger logic in `SKILL.md`
- Category: trigger-description tightening
- Source issue: the description bundled trigger phrases and artifact examples into one dense sentence.
- Risk: low drift risk, medium scanability risk.
- Applied rewrite: split the sentence so the trigger-phrase inventory ends cleanly before artifact examples begin.
- Why it matters: frontmatter descriptions do trigger work, so they must stay exact while remaining easy to audit.

### 2. Mode and workflow wording in `SKILL.md`
- Category: workflow/guardrail tightening
- Source issue: several lines were accurate but longer than needed, especially around rewrite-only output and strict-mode restructuring.
- Risk: low behavior risk, medium auditability risk.
- Applied rewrite: tightened local phrasing, clarified that only the relevant part of `references/ste-rules.md` is needed, and made the smallest-change rule more explicit where restructuring is allowed.
- Why it matters: this file is the canonical contract, so local friction here propagates into the whole skill.

### 3. README alignment
- Category: supporting artifact consistency
- Source issue: small wording choices in `README.md` lagged behind the tighter local structure of the canonical instructions.
- Risk: low behavior risk, low-to-medium consistency risk.
- Applied rewrite: tightened explanatory sentences and preserved the same installation, scope, and example guidance.
- Why it matters: README language should reinforce the same operating model without introducing parallel phrasing.

### 4. Reference-file local scanability
- Category: local sentence-structure tightening
- Source issue: several reference files were already behaviorally sound but contained extra wording, weaker transitions, or slightly less direct phrasing.
- Risk: low behavior risk, medium consistency risk across the folder.
- Applied rewrite: tightened sentence shape in `checklist.md`, `ste-rules.md`, `substitutions.md`, `adhd-patterns.md`, `use-cases.md`, `rfc-2119.md`, and `examples.md`.
- Why it matters: the skill contract is distributed. Reference files should be as easy to scan as the root instructions.

## Files changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/SKILL.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/README.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/checklist.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/ste-rules.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/substitutions.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/adhd-patterns.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/use-cases.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/rfc-2119.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/examples.md`

## Files inspected but left unchanged
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/CHANGELOG.md` — Already near minimum safe form
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/evals/evals.json` — Rewrite would add drift risk without meaningful clarity gain

## Cross-file consistency check
- Terminology remained stable around `mode=default`, `mode=strict`, `audit only`, `rewrite only`, and `audit plus rewrite`.
- No commands, file paths, identifiers, or reference filenames were changed.
- Obligation strength and scope boundaries were preserved.
- No examples that define behavior or scope were removed.

## Completed report
- Output mode used: audit plus rewrite
- Rewrite mode used: strict
- Artifact-set crawl status: complete for the local skill folder
- Cross-file alignment: complete
- Local-tightening sweep: complete
- Behavior change detected: no
- Breaking change detected: no
