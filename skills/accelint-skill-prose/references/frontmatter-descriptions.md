# Frontmatter description safety

Use this reference when tightening a skill description or other short trigger-defining blurb.

## Core idea

A frontmatter description is compact trigger logic. Treat it like behavior-defining scope, not like marketing copy.

If the description belongs to a skill folder, check the root `SKILL.md` and the relevant behavior-bearing support files before tightening it. The description must still match the body guidance and boundaries the skill enforces across the folder.

## Preserve exactly when important

Default to preserving these unless the user asked to change them:

- concrete task nouns and verbs
- quoted trigger phrases
- trigger families whose coverage depends on grouped examples
- boundary language such as planning-only or audit-only limits
- named artifact types like `SKILL.md`, `AGENTS.md`, `CLAUDE.md`, prompts, checklists, and templates
- exact tool or command references when they define scope

## Common failure modes

### Silent broadening

Bad examples:

- replacing a bounded task with a larger category
- adding adjacent use cases because they sound plausible
- converting a short description into a long trigger inventory

### Silent narrowing

Bad examples:

- dropping edge-case phrases that made the trigger robust
- removing the artifact type that distinguishes the skill
- tightening wording so much that only the most obvious requests still match

### Boundary drift

Bad examples:

- changing planning-only into planning plus implementation
- changing audit-only into edit-and-implement help
- dropping a limitation that prevented over-triggering

## Safe moves

- remove filler around an existing scope phrase
- shorten repeated framing while keeping the same trigger nouns and verbs
- preserve representative trigger families even when you compress their phrasing
- split one dense sentence into two shorter sentences if both preserve the same boundary
- keep quoted phrases and exact scope anchors intact while tightening the surrounding text

## No-rewrite cases

Recommend no rewrite when the description is already compact, exact, and behaviorally clear.

Common signs:

- further shortening would drop a trigger family or boundary
- a long trigger list is doing real coverage work
- a rephrase would trade exact scope for prettier wording

## Delivery rule

If the user asked for rewrite only, return only the revised description.
