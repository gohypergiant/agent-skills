# accelint-english-manager audit report

## Grade
A-

## Key findings
- Strong overall skill: trigger coverage is broad, guardrails are clear, and the reference set is well-scoped.
- The main `SKILL.md` already preserves behavior carefully, but a few instructions were more rigidly phrased than necessary for a prose-editing skill.
- Mode routing was mostly clear, but generic cleanup requests could still be misread as implicit strict-mode requests.
- The skill needed one stronger boundary against accidental meaning expansion: rewriting prose should not invent new requirements or commitments.

## Applied optimizations
- Softened internal mode-selection wording in `SKILL.md` so the skill still asks for a mode first, but does not overuse RFC 2119 phrasing in its own operator instructions.
- Clarified that generic requests like "plain English," "simple English," and "clean this up" stay on the default plain-language path unless the user explicitly asks for strict mode.
- Expanded the `mode=strict` trigger description to cover stricter audits of technical prose.
- Added an explicit limit that the skill is for writing improvement, not fact-setting or policy-setting, and must not invent new requirements, commitments, or product behavior.
- Updated `CHANGELOG.md` and aligned `metadata.version` to `1.3.3`.

## Remaining risks
- The skill still depends on the model correctly pausing to ask for mode selection on rewrite requests; that behavior is clear, but it remains a compliance risk in fast-moving chats.
- The trigger description is intentionally broad. That helps coverage, but it may occasionally compete with adjacent writing or prompt-polishing skills.
- `references/ste-rules.md` is long and nuanced; although the skill tells the model to load only relevant parts, strict-mode audits may still vary in consistency.

## Files changed
- `skills/accelint-english-manager/SKILL.md`
- `skills/accelint-english-manager/CHANGELOG.md`
- `runs/accelint-english-manager/audit-report.md`
