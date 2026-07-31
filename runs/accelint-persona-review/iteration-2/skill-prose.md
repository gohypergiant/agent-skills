# Stage 4 Skill Prose Audit — accelint-persona-review

## Scope
- Ran the required `accelint-skill-prose` audit-plus-rewrite workflow against `skills/accelint-persona-review`.
- Frontmatter was intentionally excluded from audit and rewrite, per instruction.

## Files changed by prose pass
- `skills/accelint-persona-review/SKILL.md`
- `skills/accelint-persona-review/references/evaluation-examples.md`

## What changed
- Tightened body prose in `SKILL.md` for clarity and consistency without changing the frontmatter.
- Improved wording in `references/evaluation-examples.md` to make good-versus-bad examples easier to scan and slightly sharper operationally.
- Corrected one guardrail line after the subagent finished: a temporary `SHOULD` wording under `## Never Do When Reviewing` was restored to a stronger direct prohibition (`must differ meaningfully`) to preserve the original guardrail strength.

## Why these edits were acceptable
- They were limited to prose and instruction clarity.
- They did not alter frontmatter.
- They stayed aligned with the existing behavior, workflow, and evidence-discipline of the skill.

## Evidence / blockers
- **Evidence type:** Direct repository diff inspection.
- **Blocker:** The prose subagent hit its turn limit before writing the requested report and before fixing one weakened guardrail line. That line was manually corrected and this report was written manually based on direct file inspection.

## Confidence
**Moderate-high.** Final confidence is based on direct inspection of the changed files after the subagent run, but the subagent’s turn-limit exit slightly reduced confidence in whether every prose change was fully intentional.
