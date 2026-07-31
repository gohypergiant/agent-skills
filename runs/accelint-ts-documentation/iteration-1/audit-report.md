# accelint-ts-documentation audit report

Grade: B+

## Key findings

1. Frontmatter was functional but the description did not start with `Use when`, which weakens activation consistency against repo expectations.
2. `SKILL.md` had strong domain content and references, but its section structure did not align well with the repo's preferred skill pattern. It lacked explicit `NEVER Do` and `Before ... Ask` sections.
3. The workflow guidance was useful, but one heading number was duplicated (`### 4.` appeared twice), which reduced scanability.
4. Progressive disclosure was mostly good, but the fallback section needed a clearer warning not to skip required reference loading.
5. Package support files are present and relevant: `AGENTS.md`, `README.md`, `references/jsdoc.md`, `references/comments.md`, and `assets/output-report-template.md` all reinforce the skill.

## Applied optimizations

- Updated the frontmatter description to start with `Use when` and include stronger trigger phrasing.
- Added a concise `NEVER Do During Documentation Work` section to surface high-value anti-patterns early.
- Added a concise `Before Auditing or Editing, Ask` section to improve judgment and scope selection.
- Renamed the intro summary to be more direct and agent-facing.
- Fixed duplicated section numbering by renumbering the report-template section from `4` to `5`.
- Clarified the fallback section so it does not compete with the mandatory reference-loading rules.

## Semver guidance

Likely bump if these edits are released: patch.
Reason: the changes improve activation wording, structure, and clarity without materially expanding or changing the skill's behavior.
