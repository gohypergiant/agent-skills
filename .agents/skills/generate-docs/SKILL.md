---
name: generate-docs
description: Generate fumadocs MDX documentation for agent skills. Use when users say "generate docs", "document this skill", "create fumadocs for X", "update skill docs", "validate docs", or when working with docs/content/docs directory. Handles initial generation, smart updates preserving manual edits, and validation. Uses SHA tracking for three-way merge logic.
license: Apache-2.0
metadata:
  author: "accelint"
  version: "1.0"
---

# Generate Docs

Generate fumadocs MDX documentation for agent skills with SHA tracking and smart updates.

## Philosophy & Role

**Engineers maintain the documentation. You assist.**

Your role:
1. **Draft initial content** from source code
2. **Suggest updates** when code changes
3. **Validate quality** (links, structure, freshness)

All generated content is editable markdown. Engineers can freely customize—adapt to their patterns rather than enforcing rigid templates.

## Target Audience

Developers using agent harnesses such as Claude Code or pi.

## Writing Style Rules

Prose should be to the point—help folks get up and running quickly. Follow these patterns:

1. **Lead with what it does** - No preamble, no "This is a...", just direct description
2. **Show code immediately** - Usage section comes before Reference section
3. **Name examples by use case** - "Example: Filtering null values" not "Example 1"
4. **Direct imperative voice** - "Returns the filtered array" not "This function returns..."
5. **Standard markdown only** - Must work in fumadocs
6. **Edge cases in callouts** - Use `> **Good to know:**` for gotchas

Remove AI-sounding phrasing like "leverages", "streamlines", "comprehensive", "robust". Keep it direct and human.

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

**Body sections** (start with H2, NOT H1):
- `## Usage` - Minimal working example
- `## When to Use` - Trigger patterns and contexts
- `## Key Patterns` - Main workflows from SKILL.md
- `## Examples` - Named by use case (extract from SKILL.md examples or references/)
- `## Anti-Patterns` - "NEVER Do X" sections if present
- `## Related` - Links to related skills

**IMPORTANT**: 
- Body starts with `##`, NOT `#` (frontmatter title becomes page H1)
- Do NOT duplicate description paragraph after frontmatter (it's rendered in page header)
- Code fences need language tags

## SHA Tracking System

The dual-SHA system enables smart updates that preserve manual edits.

**source_sha**: Hash of source file at time docs were generated
- Tracks which version of code was documented
- Run: `git hash-object <source-file>`
- Enables staleness detection

**doc_sha**: Hash of documentation content (excluding frontmatter)
- Tracks whether docs were manually edited
- Generate from markdown content only
- Enables three-way merge

### Three-Way Merge Logic

```
IF doc_sha matches current doc content:
  → No manual edits, safe to regenerate affected sections
ELSE:
  → Manual edits detected, preserve prose and merge code changes carefully
```

**When updating:**
1. Compare `source_sha` to current HEAD → what changed in code
2. Compare `doc_sha` to current doc → whether user edited docs
3. If user edited: preserve their prose, only update code-related changes
4. If user didn't edit: regenerate affected sections from code

## Step-by-Step Process

### 1. Read and Analyze Source

Read the skill's SKILL.md completely from `skills/` directory only (ignore .agent/skills, .claude/skills, .pi/skills). Look for:
- Frontmatter (name, description, metadata)
- Main workflow sections
- Anti-patterns ("NEVER Do X")
- Examples (in body or references/ directory)
- Scripts or assets that demonstrate usage

Exclude test files from documentation output:
- Skip `*.test.ts`, `*.test.tsx` files
- Skip `__tests__/`, `__mocks__/` directories

Read existing documentation if present to understand current state.

### 2. Compute source_sha

Before generating content:
```bash
git hash-object skills/skill-name/SKILL.md
```
Store this value for frontmatter.

### 3. Generate MDX Content

Extract information from source—don't infer or hallucinate. Focus on:

**Usage section**: Explain how to activate the skill and what happens after
```markdown
## Usage

Activate this skill by:
- Using the `/<name-from-frontmatter>` command (slash command matches the skill's `name` field)
- Saying "[key phrases from description]"
- Mentioning "[keywords]" while [context]

[If skill accepts path arguments, show examples:]
```bash
# Single file
/<skill-name> path/to/file.ext

# Directory
/<skill-name> path/to/directory/

# Current context
/<skill-name>
```

Once activated, the skill [what it does - the workflow/guidance it provides].
```

**When to Use section**: Extract from description field
```markdown
## When to Use

Use this skill when:
- Users say "[exact phrases from description]"
- Working with [file types/contexts]
- [Other trigger patterns]
```

**What It Checks** (or similar): Terse, comprehensive overview of capabilities
```markdown
## What It Checks

**Category 1** - Brief list of items (comma-separated, no details)

**Category 2** - Brief list of items

[Keep this section scannable - user can read full details in examples]
```

**Examples**: Extract from SKILL.md body or references/, show explicit slash command usage
```markdown
## Examples

### Example: [Use Case Name]

```bash
# Command (always show explicit slash command when possible)
/<skill-name> path/to/target

# Output: [what the user sees]
[Code or steps]
```
```

**Common Pitfalls** (optional): User-facing gotchas about WHEN/HOW to use the skill, NOT how to code
```markdown
## Common Pitfalls

> **Good to know:** [When this skill applies vs when to use a different skill]

> **Good to know:** [Gotcha about invocation or scope]

> **Good to know:** [Delegation to related skills]

For example:
- "This skill focuses on X, not Y. For Y tasks, use skill-name instead."
- "When you scan a directory, you get format A. For quick questions, you get format B."
- NOT: "Never use any types" (that's teaching the domain, not using the skill)
```

Keep prose concise. Show code/steps first, explain after.

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
- Body starts with H2 (##), NOT H1 (#)
- No duplicate description paragraph after frontmatter
- Code fences have language tags
- Examples have descriptive names (not "Example 1")
- Links use markdown format, not bare URLs

### 6. Compute doc_sha

After generating content:
```bash
# Extract content after frontmatter, hash it
awk '/^---$/{if(++count==2){flag=1;next}}flag' docs/content/docs/skill-name/index.mdx | git hash-object --stdin
```

Update frontmatter: replace `doc_sha: pending` with computed hash.

### 7. Write Output

Write to `docs/content/docs/skill-name/index.mdx`.

If the directory doesn't exist, create it:
```bash
mkdir -p docs/content/docs/skill-name
```

## Updating Existing Docs

When source changes and docs exist:

### 1. Detect Changes

```bash
# Compare source_sha to current
current_sha=$(git hash-object skills/skill-name/SKILL.md)
documented_sha=$(grep 'source_sha:' docs/content/docs/skill-name/index.mdx | awk '{print $2}')

if [ "$current_sha" != "$documented_sha" ]; then
  echo "Source changed, docs may be stale"
fi
```

### 2. Check for Manual Edits

```bash
# Compute current doc content hash
current_doc_sha=$(awk '/^---$/{if(++count==2){flag=1;next}}flag' docs/content/docs/skill-name/index.mdx | git hash-object --stdin)
recorded_doc_sha=$(grep 'doc_sha:' docs/content/docs/skill-name/index.mdx | awk '{print $2}')

if [ "$current_doc_sha" != "$recorded_doc_sha" ]; then
  echo "Manual edits detected, preserve prose"
fi
```

### 3. Apply Merge Logic

**If no manual edits** (doc_sha matches):
- Regenerate affected sections from updated source
- Update source_sha and doc_sha
- Update `updated` date

**If manual edits detected** (doc_sha doesn't match):
- Read both old source and new source to identify changes
- Preserve user's prose structure
- Update only code examples or references that changed
- Ask user to review before overwriting
- Update source_sha, recompute doc_sha
- Update `updated` date

## Validation

Run these checks on command or when user asks to "validate docs":

### 1. SHA Staleness

For each documented skill:
```bash
current_sha=$(git hash-object skills/skill-name/SKILL.md)
documented_sha=$(grep 'source_sha:' docs/content/docs/skill-name/index.mdx | awk '{print $2}')

if [ "$current_sha" != "$documented_sha" ]; then
  # Count commits since documented version
  echo "skill-name: docs are stale"
fi
```

### 2. Broken Cross-References

Parse markdown links: `[text](../path/to/file.mdx)`
Verify linked files exist. Report broken links.

### 3. Missing Frontmatter

Required fields: `title`, `description`, `source`, `source_sha`, `doc_sha`, `updated`

Error if any missing.

### 4. Structural Issues

- Body should start with H2 (##), NOT H1 (#)
- Body should NOT contain duplicate description paragraph
- Code fences should have language tags
- Check for bare URLs (should be markdown links)

### 5. Orphaned Docs

List skills in `skills/` that have no corresponding docs.
List docs that reference non-existent source files.

## Before You Start

Ask the user:
1. **Which skill(s)?** - Specific skill name or "all skills"?
2. **Generate or update?** - Creating new docs or updating existing?
3. **Focus areas?** - If unsure what to include, ask what matters most to them

## Important Notes

- Extract from source, don't infer behavior
- Match the direct, concise voice of the reference examples
- Preserve manual edits when updating (three-way merge)
- Be specific in examples—show realistic use cases
- Ask when uncertain about what to include
