# accelint-english-manager description report

## Result
Updated the `description` frontmatter in `skills/accelint-english-manager/SKILL.md`.

## Before
Focused strongly on generic cleanup verbs and output types, but underrepresented:
- audit-only requests
- explicit rewrite-flow phrases like "audit then rewrite"
- tone-preservation requests such as "keep the tone" and "friendlier"
- procedural / incident / status prose seen in the eval set
- exact-text-preservation constraints

## After
The new description adds stronger trigger coverage for:
- audit-only and audit-plus-rewrite requests
- plain-English, grammar-check, tone-preserving, and friendliness-oriented asks
- strict-mode / STE-style requests
- docs, prompts, support replies, release notes, status updates, incident notes, and procedural text
- constraints where exact wording, commands, file paths, or quoted text must stay exact

It also adds a clearer boundary: use this skill when the main job is improving prose, not when the real task is fact-checking, policy setting, or substantive content design.

## Rationale
This better matches the generated eval set, which includes audit-only behavior, strict-mode requests, tone-sensitive rewrites, operational writing, and preservation constraints. The updated wording is more "pushy" about real trigger contexts while staying precise about what the skill should not own.

## Trigger tradeoffs
- Broader trigger coverage may slightly increase overlap with generic editing or docs-writing tasks.
- The added boundary should reduce false positives where the user actually needs factual, policy, or product-content work instead of prose cleanup.
