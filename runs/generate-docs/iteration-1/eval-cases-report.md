# generate-docs eval coverage report

Generated 22 eval cases for `skills/generate-docs/evals/evals.json`.

Coverage summary:
- Core generation flow for a new skill page, including correct docs path derivation and required frontmatter.
- Update flow for stale docs with and without manual edits, including dual-SHA detection, three-way merge behavior, and preserving human-written prose.
- Validation flow covering staleness, missing frontmatter, broken links, orphaned docs, and structural issues such as H1-in-body, duplicate descriptions, missing code-fence language tags, and bare URLs.
- Repo-aware discovery of skill/docs pairs, including the `accelint-` prefix stripping rule.
- Output-quality rules for human-facing compression, default section structure, concise examples, and MDX escaping.
- Decision coverage for when to ask startup questions versus proceeding directly with enough context.
- Near-miss trigger boundaries for README work, SKILL.md prose edits, architecture-doc requests, and generic markdown housekeeping.

Validation:
- Confirmed `skills/generate-docs/evals/evals.json` is valid JSON.
