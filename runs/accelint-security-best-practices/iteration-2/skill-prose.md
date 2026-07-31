# Stage 4 Skill Prose Audit — accelint-security-best-practices

## Scope
- Audited and rewrote prose for the skill package in strict mode.
- **Frontmatter was intentionally not audited or changed**, per stage instructions.

## Files changed
- `skills/accelint-security-best-practices/SKILL.md`
- `skills/accelint-security-best-practices/AGENTS.md`
- `skills/accelint-security-best-practices/assets/output-report-template.md`
- `skills/accelint-security-best-practices/references/quick-reference.md`

## Audit findings
### Static audit evidence
- `SKILL.md` still contained some heavy or absolute phrasing that could be made clearer without changing workflow intent.
- `AGENTS.md` had minor wording opportunities for scanability and consistency.
- `assets/output-report-template.md` contained a few phrasing and punctuation issues that could make completion guidance less direct.
- `references/quick-reference.md` included a few wording choices that could be tightened for clarity and consistency.

### Executed eval evidence
- None. This stage was prose-focused and no evals were executed.

## Rewrites applied
- Tightened wording in `SKILL.md` for clarity, consistency, and better operational phrasing while preserving behavior.
- Improved scanability and consistency in `AGENTS.md` without changing category coverage or guidance.
- Clarified template instructions in `assets/output-report-template.md` so the reporting contract is easier to follow.
- Tightened wording in `references/quick-reference.md` for readability and consistency with the main skill.

## Unchanged by design
- Skill frontmatter in `skills/accelint-security-best-practices/SKILL.md`
- Other reference files under `skills/accelint-security-best-practices/references/` not edited in this stage
- `README.md`, `CHANGELOG.md`, and `evals/evals.json`

## Risk / confidence notes
- Confidence is high that the edits are behavior-preserving because they mainly improve wording, scanability, and consistency.
- Confidence is limited by the lack of executed eval evidence in this stage.
