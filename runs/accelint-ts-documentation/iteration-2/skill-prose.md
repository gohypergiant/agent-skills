# Stage 4 Skill Prose Audit — accelint-ts-documentation

## Scope
- Audited and rewrote behavior-defining prose for the selected skill package in strict mode.
- Skipped skill frontmatter entirely as required.
- Did not treat frontmatter wording or metadata as part of this stage.

## Files changed
- `.agents/skills/accelint-ts-documentation/SKILL.md`
- `.agents/skills/accelint-ts-documentation/AGENTS.md`
- `.agents/skills/accelint-ts-documentation/references/comments.md`
- `.agents/skills/accelint-ts-documentation/references/jsdoc.md`

## Files inspected but not changed
- `.agents/skills/accelint-ts-documentation/README.md`
- `.agents/skills/accelint-ts-documentation/CHANGELOG.md`
- `.agents/skills/accelint-ts-documentation/assets/output-report-template.md`
- `.agents/skills/accelint-ts-documentation/evals/evals.json`

## Audit findings
1. `SKILL.md` already had strong operational structure, but several sections used heavier wording and longer phrasing than necessary for behavior-preserving guidance.
2. `AGENTS.md` and the references contained places where prose could be tightened without changing policy.
3. `references/jsdoc.md` needed to stay aligned with the skill’s two-tier exported-versus-internal documentation policy.
4. No frontmatter changes were made.

## Rewrite summary
- Tightened instructional prose in `SKILL.md` so loading rules, judgment rules, and audit-mode boundaries are easier to scan.
- Tightened `AGENTS.md` wording without changing role, workflow, or constraints.
- Tightened `references/comments.md` wording while preserving comment-marker policy and examples.
- Tightened `references/jsdoc.md` wording while preserving syntax guidance and keeping the internal-versus-exported policy aligned with `SKILL.md`.

## Behavior-preservation notes
- No workflow stages were added or removed.
- No trigger/frontmatter changes were made.
- No new policy areas were introduced.
- The main substantive alignment in this stage was keeping `references/jsdoc.md` consistent with the existing two-tier policy already defined in `SKILL.md`.

## Confidence / blockers
- Confidence is moderate to high because the edits were prose-focused and grounded in direct file inspection.
- Blocker: the delegated strict-mode pass hit its turn limit before writing this report, so the final report was completed manually after verifying the changed files directly.
