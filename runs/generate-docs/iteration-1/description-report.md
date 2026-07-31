# generate-docs description report

## Summary
Updated the `generate-docs` skill description in `skills/generate-docs/SKILL.md` to improve trigger accuracy and reduce near-miss activation.

## What changed
- Reframed the opening around published Fumadocs MDX pages for skill packages, not docs work in general.
- Added stronger positive triggers for:
  - skill docs under `docs/content/docs/`
  - generating a page from `skills/<name>/SKILL.md`
  - checking whether a published skill page is stale
  - updating a published page while preserving manual edits with source/doc SHA tracking
- Added explicit boundaries so it does not over-trigger on:
  - `SKILL.md` prose editing
  - generic README work
  - architecture docs
  - broad markdown housekeeping outside the skill-doc workflow

## Rationale
The existing description already covered generation, refresh, and validation, but it still left room for accidental activation on adjacent documentation tasks. The revised wording makes the published-skill-doc scope more explicit, reflects the SHA-based refresh behavior emphasized by the eval set, and sharpens negative boundaries for likely near-miss requests.

## Eval-set alignment
Reviewed the existing generated eval set in `skills/generate-docs/evals/evals.json` and used it as the non-interactive basis for the description update. The revised description better matches eval patterns around:
- generate vs refresh vs validate mode selection
- `docs/content/docs/` and `skills/<name>/SKILL.md` path cues
- stale-doc and manual-edit preservation behavior
- near-miss rejection for README, SKILL prose, architecture docs, and generic markdown tasks
