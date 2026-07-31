## Summary

The artifact set is behaviorally sound, but parts of `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/SKILL.md` and `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/AGENTS.md` used inconsistent emphasis, uneven sentence structure, and small wording patterns that made the guidance harder to scan than necessary. The rewrite preserves trigger coverage, workflow order, guardrail strength, and exact technical references while tightening local prose.

Highest-risk issues before the rewrite:
1. In `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/SKILL.md`, all-caps `NEVER` headings were mixed with non-all-caps prohibitions in the same section. That did not change the formal rule strength, but it made prohibition strength look less normalized across adjacent bullets.
2. In `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/SKILL.md`, several long bullets buried the operational point behind explanatory text, especially around `fireEvent`, `waitFor`, and provider-aware custom render guidance. This increased scan cost during tool use.
3. In `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/AGENTS.md`, some compact summaries omitted small function words or exact code formatting that would make the one-line rules easier to parse consistently.

## Rewrite

### Updated files

#### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/SKILL.md`
- Tightened the opening summary and normalized the section title from `## NEVER Do When Writing React Tests` to `## Never Do When Writing React Tests` without changing prohibition strength.
- Rewrote the anti-pattern bullets to lead with the rule more cleanly, keep terminology stable, and improve scanability around `fireEvent`, `waitFor`, `screen`, and custom render requirements.
- Tightened the progressive-disclosure section so the load conditions remain the same but the sentence structure is easier to follow.
- Tightened the report-template section so category names, severity labels, and usage rules remain exact but read more consistently.

#### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/AGENTS.md`
- Tightened the abstract and several one-line summaries for readability.
- Added backticks where they improved exact technical parsing for `@testing-library/user-event`, `fireEvent`, `findBy`, `waitFor`, and `act`.
- Preserved the same progressive-disclosure handoff into `references/`.

## Summary
- Task: Audit plus rewrite behavior-defining prose in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing` in `mode=strict`, while skipping frontmatter entirely.
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/AGENTS.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/references/query-priority.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/references/query-variants.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/references/user-events.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/references/async-testing.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/references/custom-render.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/references/accessibility-queries.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/references/anti-patterns.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving structure tightening and terminology normalization improved scanability and local clarity without changing trigger coverage or workflow semantics.
  - Notes: Tightened anti-pattern bullets, normalized prohibition presentation, and clarified progressive-disclosure and report-template guidance. Frontmatter was intentionally left untouched.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/AGENTS.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved one-line rule summaries and exact technical readability.
  - Notes: Tightened abstract wording, added exact code formatting where it improved parsing, and preserved the same reference map.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/references/query-priority.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The rule ordering, examples, and rationale were already compact and behaviorally clear.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/references/query-variants.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The variant matrix, examples, and decision guidance were already easy to scan without drift risk.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/references/user-events.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: The file uses dense example-driven guidance where additional tightening would risk changing emphasis around async interaction sequencing.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/references/async-testing.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file already leads with operational rules and keeps `findBy`, `waitFor`, and `waitForElementToBeRemoved` boundaries clear.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/references/custom-render.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: The file is example-heavy and already keeps provider setup patterns and wrapper semantics explicit.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/references/accessibility-queries.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The accessibility rules, examples, and ARIA patterns were already behaviorally clear and locally tight.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/references/anti-patterns.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The prohibitions and examples already preserved strong guardrail force with clear scanability.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-testing/SKILL.md` was intentionally excluded from audit and rewrite per instruction.
- No other artifact-set files changed after the local-tightening sweep.
