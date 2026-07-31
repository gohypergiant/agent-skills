---
name: generate-docs
description: Use when creating, refreshing, or validating published Fumadocs MDX pages for skill packages in this repository. Best for work under `docs/content/docs/`, generating docs from `skills/<name>/SKILL.md`, checking whether a published skill page is stale, or updating docs while preserving manual edits through source and doc SHA tracking. Do not use it for editing `SKILL.md` prose, generic README or architecture documentation, or broad markdown housekeeping outside the skill-doc workflow.
license: Apache-2.0
metadata:
  internal: true
  author: "accelint"
  version: "1.0.2"
---

# Generate Docs

Generate fumadocs MDX documentation for agent skills with SHA tracking and smart updates.

## Philosophy & Role

**Engineers maintain the documentation. You assist.**

Your role:
1. **Draft initial content** from source code.
2. **Suggest updates** when code changes.
3. **Validate quality** such as links, structure, and freshness.

All generated content is editable markdown. Engineers can customize it freely. Adapt to their patterns instead of enforcing rigid templates.

## NEVER Do

- Do not mirror the source skill's internal execution plan into the published doc.
- Do not expose maintainer-only scaffolding unless it changes the reader's expectations.
- Do not bloat pages with repeated trigger lists, duplicated summaries, or transcript-style examples.
- Do not infer capabilities that are not grounded in `skills/<name>/SKILL.md` or the existing doc.
- Do not overwrite manually edited docs as if they were generated-only content.

## Before You Start

Before you generate or update docs, confirm the minimum missing context:
- Which skill or skills are in scope?
- Are you generating new docs, refreshing stale docs, or validating existing docs?
- Are there user priorities such as brevity, examples, prerequisites, or preserving custom prose?

Skip these questions only when the request already answers them clearly.

## Target Audience

Humans evaluating or using documented skills in agent harnesses such as Claude Code or pi.

Write for someone trying to understand whether a skill is useful, what it helps them accomplish, and how it behaves. Do not write as if you are instructing another agent how to execute the skill unless that operational detail is directly relevant to the human reader.

## Writing Style Rules

Keep the prose direct. Help the reader understand what the skill is for, when to use it, and what value it provides.

1. **Lead with what it helps a human do** — Start from user outcomes, not internal implementation.
2. **Prefer human-facing explanation over agent-facing instructions** — Describe behavior and value before invocation mechanics.
3. **Name examples by use case** — Use `Example: Auditing a weak skill description`, not `Example 1`.
4. **Translate internals into benefits** — If the source describes internal orchestration, explain why that matters to the user instead of copying the instruction literally.
5. **Summarize patterns, do not restate every rule** — Explain the skill's shape and behavior at a useful level of abstraction instead of enumerating every detail from `SKILL.md`.
6. **Use standard markdown only** — It MUST work in Fumadocs.
7. **Use callouts only for user-relevant gotchas** — Use `> **Good to know:**` only when it helps a human choose, use, or not misuse the skill.
8. **Compress aggressively** — Prefer short, information-dense summaries over walkthroughs, transcripts, or exhaustive inventories.
9. **Avoid duplication across sections** — Each section should add new information instead of restating the same point.
10. **Default to a short page** — Most pages should feel skimmable in one pass, not like internal design docs.

Remove AI-sounding phrasing such as `leverages`, `streamlines`, `comprehensive`, and `robust`. Keep the prose direct and human.

## Compression Heuristics

Use these as strong defaults:

- Aim for roughly **500–900 words** for most pages.
- Prefer **4–6 total sections** on most pages.
- Prefer **3–6 bullets per section**.
- Default `## How It Works` to **3–5 bullets** or **3–4 short subsections**.
- Keep examples short: **one command + one outcome summary** is better than a transcript-style walkthrough.

Use a longer page only when the skill has multiple genuinely distinct user-facing modes or deliverables.

## Audience Filter

Before you include any detail, use this filter.

### Include
- What the skill helps the human accomplish
- A short, top-level slash command cue that makes the skill easy to invoke
- When the skill should be used
- What it optimizes, evaluates, or changes
- Key behaviors, decision frameworks, and tradeoffs
- Degrees of freedom: where the skill is prescriptive vs flexible
- User-relevant limitations, pitfalls, or boundaries

### Exclude by default
- Internal agent instructions about loading files, reading references, or traversal order
- Template-authoring notes meant for skill maintainers unless they directly affect the user outcome
- Scaffolding details such as "read X before Y" or "delete comments after reading"
- Internal resource filenames such as `references/*.md`, `assets/*`, helper docs, or other skill internals unless they are directly user-consumable artifacts
- Internal architecture or implementation mechanics such as progressive disclosure, reference-loading strategy, file traversal order, hidden orchestration, subagent coordination, or context-management tactics unless they materially affect the user's interaction, deliverable, or expectations
- Low-value operational notes that do not help a human decide whether to use the skill

### Quick relevance test

Include a detail only if it helps the reader:
1. decide whether to use the skill
2. understand what behavior or output to expect
3. make sense of the page without seeing the underlying `SKILL.md`

If not, omit it.

### Translate Instead of Copying

If the source contains agent-operational guidance with user-facing significance, translate it into human language. Do not describe how the skill is implemented when you can describe what the user experiences or receives instead.

Examples:
- Internal: "Load references only when needed"
  - Human-facing: "The skill keeps detailed guidance modular so it can go deep where needed without bloating the core instructions."
- Internal: "Calibrate freedom to task fragility"
  - Human-facing: "The skill becomes more prescriptive for fragile tasks and more flexible for creative ones."
- Internal: "This skill uses progressive disclosure"
  - Human-facing: `Omit by default.` Include only if that structure changes the user's interaction, output depth, or expectations; if it does, describe the user-visible effect rather than naming the internal technique.
- Internal: "Read the template comments before deleting them"
  - Human-facing: omit unless the docs are explicitly for maintainers editing the template itself.

## Document Structure

**Frontmatter** (rendered as page H1 and meta description):
```yaml
---
title: Overview
description: One detailed sentence describing what it does
source: skills/skill-name/SKILL.md
source_sha: <git hash-object>
doc_sha: <content hash>
deprecated: false
updated: YYYY-MM-DD
---
```

**Default body sections** (start with H2, NOT H1):
- `## What It Helps You Do` - User-facing outcomes and scope
- `## When to Use` - Trigger patterns and contexts
- `## How It Works` - Main workflows, behaviors, or evaluation dimensions from SKILL.md

**Optional sections** (include only when clearly user-relevant):
- `### Intelligent Discovery Process` - Only when the skill has a concrete, user-visible multi-stage discovery process that materially changes behavior, output, or required user interaction
- `## Good to Know` - Scope boundaries, important limitations, sibling-skill distinctions, and user-facing gotchas
- `## Prerequisites` - Required tools, configuration, existing files, or environmental assumptions the user must satisfy before the skill is useful
- `## What You Get` - The output artifact, report shape, generated files, or result structure the user can expect. Use only when the skill reliably produces a concrete, reviewable deliverable that is distinct from the user outcome itself.
- `## Examples` - Named by use case when concrete examples materially help adoption
- `## Limits` or `## What It Does Not Do` - Sharp boundaries that are central to understanding the skill's scope
- `## Degrees of Freedom` - How prescriptive vs flexible the skill is, when relevant
- `## Related` - Links to related skills

Do not add sections just because the source contains them. Start with the three core sections. Keep the page tight unless extra structure clearly improves reader understanding.

Prefer **4–6 total sections** on most pages. If `## Good to Know` exists, do not also create extra boundary or gotcha sections such as `## Common Issues`, `## Critical Setup Rules`, `## Review Format`, or `## Key Behaviors` unless they are truly distinct and essential.

When in doubt, use a short `## Good to Know` section instead of inventing a specialized heading.

Avoid `## Common Pitfalls` as a default catch-all. If the content is not actually about pitfalls or misuse, use a more accurate section name such as `## Good to Know`, `## Limits`, or `## Related`.

Avoid `## Key Patterns` and `## Anti-Patterns` as default generated sections. These often balloon into a restatement of the SKILL.md internals. Only surface that material indirectly through concise behavior summaries in `## How It Works`, or through a short `## Good to Know` / `## Limits` section when it materially changes user expectations.

## Required Structure Checks

- Body starts with `##`, NOT `#` because the frontmatter title becomes the page H1.
- Do NOT duplicate the description paragraph after frontmatter because the page header already renders it.
- Code fences need language tags.

## SHA Tracking System

The dual-SHA system enables smart updates that preserve manual edits.

**`source_sha`** — Hash of the source file at the time the docs were generated.
- Tracks which version of the source was documented.
- Run: `git hash-object <source-file>`.
- Enables staleness detection.

**`doc_sha`** — Hash of the documentation content, excluding frontmatter.
- Tracks whether the docs were manually edited.
- Generate it from markdown content only.
- Enables three-way merge.

### Three-Way Merge Logic

```
IF doc_sha matches current doc content:
  → No manual edits, safe to regenerate affected sections
ELSE:
  → Manual edits detected, preserve prose and merge code changes carefully
```

**When updating:**
1. Compare `source_sha` to current HEAD to see what changed in the source.
2. Compare `doc_sha` to the current doc to see whether the user edited the docs.
3. If the user edited the docs, preserve their prose and update only the code-related changes.
4. If the user did not edit the docs, regenerate the affected sections from the source.

## Step-by-Step Process

### 1. Read and Analyze Source

Read the skill's `SKILL.md` completely from the `skills/` directory only. Ignore `.agent/skills`, `.claude/skills`, and `.pi/skills`. Look for:
- Frontmatter (name, description, metadata)
- Main workflow sections
- Anti-patterns ("NEVER Do X")
- Examples (in body or references/ directory)
- Scripts or assets that demonstrate usage

Exclude test files from documentation output:
- Skip `*.test.ts`, `*.test.tsx` files
- Skip `__tests__/`, `__mocks__/` directories

If existing documentation is present, read it to understand the current state.

### 2. Compute source_sha

Before generating content:
```bash
git hash-object skills/skill-name/SKILL.md
```
Store this value for frontmatter.

### 3. Generate MDX Content

Extract information from source—don't infer or hallucinate. Focus on:

**Opening section**: Start with user-facing outcomes. Include a short invocation block so every skill doc shows the slash command near the top. Keep it brief.
```markdown
## What It Helps You Do

Use this skill to [core outcomes in human terms].

Activate it with:
- `/<name-from-frontmatter>`
- Phrases like "[key phrases from description]"
- Related requests about [context or keywords]

It is especially useful when you need to:
- [Outcome 1]
- [Outcome 2]
- [Outcome 3]
```

Keep the invocation block to 2–3 bullets maximum. The goal is discoverability, not a long trigger list.

For tool-like skills, concrete invocation examples are useful. For process, audit, or judgment skills, spend more space on outcomes and behavior than on command syntax.

Aim for compression:
- Prefer 3–6 bullets per section
- Avoid repeating the frontmatter description in different words
- Leave maintainer-only details out
- If a detail is interesting but not decision-relevant, omit it
- Each section must add new information; do not restate the same point across multiple sections
- If a point already appears in `## What It Helps You Do`, do not repeat it in `## Good to Know` unless you are reframing it as a boundary, limit, or gotcha

**When to Use section**: Extract from the description field.
```markdown
## When to Use

Use this skill when:
- Users say "[exact phrases from description]"
- Working with [file types/contexts]
- [Other trigger patterns]
```

**Behavior / evaluation section**: Summarize what the skill optimizes, checks, or calibrates.
```markdown
## How It Works

- [Behavior pattern 1 in user-facing language]
- [Behavior pattern 2 in user-facing language]
- [Behavior pattern 3 in user-facing language]

### Intelligent Discovery Process

- [Only include when the staged discovery process is concrete, visible to the user, and important to expectations or output]
```

Use labels such as `## How It Works` or `## What It Checks` based on the skill type. Default to `## How It Works`.

This section should answer questions like:
- Does the skill audit, recommend, transform, or scaffold?
- Does it adapt by scenario?
- Does it get more prescriptive for fragile tasks and more flexible for creative ones?
- Does it use staged discovery that affects depth or output?

Default this section to **3–5 bullets** or **3–4 short subsections**. Do not narrate the full internal execution plan unless those mechanics materially change the user's expectations.

Only add `### Intelligent Discovery Process` when the section contains concrete, user-visible behavior such as phased scanning, targeted interviews, preview/approval checkpoints, or other workflow stages that change the user's experience. Do not include it for generic statements like "the skill adapts its guidance" or "the skill goes deeper where needed."

If the explanation reads like instructions for the agent instead of expectations for the human reader, compress it.

This section should NOT list internal file reads, traversal order, hidden resource names, long lists of anti-patterns / rules copied from SKILL.md, or internal implementation mechanics that do not change the user's experience.

**Examples**: Extract from SKILL.md body or references/, show explicit slash command usage
```markdown
## Examples

### Example: [Use Case Name]

```bash
# Command (always show explicit slash command when possible)
/<skill-name> path/to/target
```

[One short sentence about what the user gets back]
```

Examples should demonstrate use cases, not simulate the full internal workflow. Prefer one command plus one outcome summary over transcript-style step-by-step narration. If two examples teach the same thing, keep the clearer one.

**Good to Know** (optional): User-facing scope boundaries, prerequisites, limitations, expected outputs, or sibling-skill distinctions. This section is not for maintainer notes or internal implementation details.
```markdown
## Good to Know

> **Good to know:** [When this skill applies vs when to use a different skill]

> **Good to know:** [Non-obvious limitation, scope boundary, prerequisite, or expected output]

> **Good to know:** [Gotcha that prevents misuse or wrong expectations]
```

**Prerequisites** (optional): Use when the skill depends on real user-facing setup or environment assumptions
```markdown
## Prerequisites

- [Required CLI, package, or tool]
- [Required configuration or enabled workflow]
- [Expected project file or environment capability]
```

**What You Get** (optional): Use only when the skill consistently produces a concrete, recognizable output shape that is distinct from `## What It Helps You Do`
```markdown
## What You Get

- [Generated file, report, or artifact 1]
- [Generated file, report, or artifact 2]
- [What the user can review, edit, or approve]
```

Do NOT use this section for advisory or best-practice skills when the content would only restate the guidance already described in `## What It Helps You Do`. If the "output" is merely recommendations, guidance, or help, fold that into `## What It Helps You Do` and omit `## What You Get`.

Do not turn this section into an exhaustive inventory of every subsection or internal artifact unless that detail materially helps the user decide whether to use the skill.

**Limits / What It Does Not Do** (optional): Use when a sharp boundary is central to correct expectations
```markdown
## Limits

- [Important non-goal or out-of-scope area]
- [Adjacent task this skill intentionally does not handle]
```

Use `## Common Pitfalls` only for actual pitfalls or misuse patterns. Do not put generic scope notes under a pitfalls heading.

For example:
- `## Good to Know`: "This skill focuses on X, not Y. For Y tasks, use skill-name instead."
- `## Good to Know`: "When you scan a directory, you get format A. For quick questions, you get format B."
- `## Good to Know`: "You get a structured audit report for full reviews, but direct implementation help for narrow fix requests."
- `## Limits`: "This skill plans the change but does not implement it."
- `## What You Get`: "A generated ARCHITECTURE.md draft plus a preview for review before write."
- NOT `## What You Get`: "Guidance on choosing query keys and mutation patterns" when those points are already covered in `## What It Helps You Do`
- `## Common Pitfalls`: "Using this skill for Y usually leads to shallow results because it is optimized for X."
- NOT: "Read the template comments before deleting them"
- NOT: "Load reference file X before Y" unless the page is specifically for maintainers of the skill itself
- NOT: "The skill uses a progressive disclosure structure" unless that internal design changes the user's experience in a concrete, user-visible way

### Bad vs good transformations

- Bad: `Load: query-client-setup.md and server-integration.md`
  - Good: `The skill covers both client-side QueryClient setup and server-rendered integration patterns.`
- Bad: `Skip: mutation and caching references`
  - Good: omit unless the boundary matters to the user
- Bad: `Read references only when needed`
  - Good: `The skill keeps detailed guidance modular so it can go deep without bloating the core instructions.`
- Bad: `The skill uses a progressive disclosure structure — you don't need to load all reference files at once.`
  - Good: `Detailed guidance is available for specific scenarios, while the main workflow stays concise.`
  - Better: omit entirely if that distinction does not change what the user should expect.
- Bad: `Spawns one subagent per touched capability`
  - Good: `Updates each affected capability independently so larger archive operations stay manageable.`
- Bad: `Loads project context into subagent prompts`
  - Good: `Uses project conventions so implementation stays aligned with the repo.`

Keep the prose concise. Lead with user outcomes and behavior. Show commands or internal steps only when they help the human apply the skill.

## Final Style Check

Before you write or save, verify:
- Is the page primarily about user outcomes?
- Are any sections duplicating points already made elsewhere?
- Does `## How It Works` read like a workflow summary rather than an implementation manual?
- Are examples concise and non-redundant?
- Could a specialized heading fold into `## Good to Know`?
- Is any phrase useful only to a skill maintainer rather than a user?
- Would a normal user care about this detail if they never read the underlying `SKILL.md`?

### 4. Add Frontmatter

```yaml
---
title: Overview
description: One detailed sentence describing what it does
source: skills/skill-name/SKILL.md
source_sha: <value from step 2>
doc_sha: pending
deprecated: false
updated: YYYY-MM-DD
---
```

### 5. Validate Markdown Quality

Check:
- Body starts with H2 (`##`), NOT H1 (`#`).
- No duplicate description paragraph appears after frontmatter.
- Code fences have language tags.
- Examples have descriptive names, not `Example 1`.
- Links use markdown format, not bare URLs.
- **MDX special characters are escaped:**
  - `<` followed by numbers → use `&lt;` (e.g., "&lt;500 lines" not "<500 lines")
  - `>` followed by numbers → use `&gt;` (e.g., "&gt;50%" not ">50%")
  - `&` in prose → use `&amp;` (e.g., "Testing &amp; QA" not "Testing & QA")
  - Curly braces in prose → use `{{` and `}}` (e.g., `{{ label: "text" }}`)

### 6. Compute doc_sha

After generating content:
```bash
# Strip accelint- prefix for doc path
doc_dir="docs/content/docs/${skill_name#accelint-}"

# Extract content after frontmatter, hash it
awk '/^---$/{if(++count==2){flag=1;next}}flag' "$doc_dir/index.mdx" | git hash-object --stdin
```

Update frontmatter: replace `doc_sha: pending` with computed hash.

### 7. Write Output

**Path construction rules:**
- Strip the `accelint-` prefix from the skill name for the docs path.
- Example: `skills/accelint-ac-to-playwright/` → `docs/content/docs/ac-to-playwright/index.mdx`.
- Example: `skills/skill-creator/` → `docs/content/docs/skill-creator/index.mdx` and there is no prefix to strip.

Write to `docs/content/docs/{skill-name-without-accelint-prefix}/index.mdx`.

If the directory doesn't exist, create it:
```bash
# Strip accelint- prefix if present
doc_dir="docs/content/docs/${skill_name#accelint-}"
mkdir -p "$doc_dir"
```

## Updating Existing Docs

When source changes and docs exist:

### 1. Detect Changes

```bash
# Strip accelint- prefix for doc path
doc_dir="docs/content/docs/${skill_name#accelint-}"

# Compare source_sha to current
current_sha=$(git hash-object skills/skill-name/SKILL.md)
documented_sha=$(grep 'source_sha:' "$doc_dir/index.mdx" | awk '{print $2}')

if [ "$current_sha" != "$documented_sha" ]; then
  echo "Source changed, docs may be stale"
fi
```

### 2. Check for Manual Edits

```bash
# Strip accelint- prefix for doc path
doc_dir="docs/content/docs/${skill_name#accelint-}"

# Compute current doc content hash
current_doc_sha=$(awk '/^---$/{if(++count==2){flag=1;next}}flag' "$doc_dir/index.mdx" | git hash-object --stdin)
recorded_doc_sha=$(grep 'doc_sha:' "$doc_dir/index.mdx" | awk '{print $2}')

if [ "$current_doc_sha" != "$recorded_doc_sha" ]; then
  echo "Manual edits detected, preserve prose"
fi
```

### 3. Apply Merge Logic

**If no manual edits** (`doc_sha` matches):
- Regenerate the affected sections from the updated source.
- Update `source_sha` and `doc_sha`.
- Update the `updated` date.

**If manual edits are detected** (`doc_sha` does not match):
- Read both the old source and the new source to identify changes.
- Preserve the user's prose structure.
- Update only the code examples or references that changed.
- In non-interactive or automation-heavy runs, preserve prose conservatively instead of assuming broad regeneration is safe.
- Ask the user to review before overwriting when the environment allows it.
- Update `source_sha`, recompute `doc_sha`, and update the `updated` date.

## Validation

Run these checks on command or when the user asks to `validate docs`.

For validation-only requests, return a concise findings report that calls out:
- stale docs based on `source_sha`
- broken cross-references
- missing frontmatter fields
- structural markdown issues
- orphaned docs or docs pointing at missing source files

### 1. SHA Staleness

For each documented skill:
```bash
# Strip accelint- prefix for doc path
doc_dir="docs/content/docs/${skill_name#accelint-}"

current_sha=$(git hash-object skills/skill-name/SKILL.md)
documented_sha=$(grep 'source_sha:' "$doc_dir/index.mdx" | awk '{print $2}')

if [ "$current_sha" != "$documented_sha" ]; then
  # Count commits since documented version
  echo "skill-name: docs are stale"
fi
```

### 2. Broken Cross-References

Parse markdown links such as `[text](../path/to/file.mdx)`.
Verify that the linked files exist. Report broken links.

### 3. Missing Frontmatter

Required fields: `title`, `description`, `source`, `source_sha`, `doc_sha`, `updated`.

Report an error if any required field is missing.

### 4. Structural Issues

- Body should start with H2 (##), NOT H1 (#)
- Body should NOT contain duplicate description paragraph
- Code fences should have language tags
- Check for bare URLs (should be markdown links)

### 5. Orphaned Docs

List skills in `skills/` that have no corresponding docs.
List docs that reference non-existent source files.

## Important Notes

- Extract from the source. Do not infer behavior.
- Match the direct, concise voice of the reference examples.
- Preserve manual edits when you update through the three-way merge flow.
- Be specific in examples. Show realistic use cases.
- Ask when you are uncertain what to include.
- Default to human-facing relevance over internal execution details.
- Do not surface agent-operational scaffolding unless it materially changes user expectations or outcomes.
