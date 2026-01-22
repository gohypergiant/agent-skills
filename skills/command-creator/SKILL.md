---
name: command-creator
description: Guide for creating Claude Code commands with skill integration. Use when users want to create a new Claude Code command specification, whether skill-based or standalone. Assists with command definition, skill discovery, argument specification, and command generation.
---

# Command Creator

## Overview

This skill guides the creation of Claude Code commands through a structured workflow that ensures proper skill integration, argument definition, and command specification. Commands can leverage existing skills or operate standalone.

**Target Audience:** This skill is designed for agents creating Claude Code command specifications. It provides procedural knowledge for gathering requirements, discovering relevant skills, and generating well-structured command definitions that other agents will execute.

## Command Creation Workflow

Follow these steps sequentially to create a well-defined Claude Code command:

### Step 1: Understand Command Purpose

Ask the user what the command should do. Gather specific details about:
- The task or operation the command will perform
- Expected inputs and outputs
- Any special requirements or constraints

**Example questions:**
- "What should this command do?"
- "Can you describe a typical use case for this command?"
- "What would trigger the use of this command?"

### Step 2: Identify Skill Dependencies

Ask if the command relates to existing skills:
- "Is this command based on any existing skills?"
- "Does this command use specific file formats, workflows, or domain knowledge?"

If the user mentions skills, note them. If not, proceed to Step 3.

### Step 3: Discover Relevant Skills

Check available skills to identify potentially relevant ones the user may have missed:

```bash
view .claude/skills    # Current project skills (if available)
view ~/.claude/skills  # Global skills (if available)
```

Look for skills related to:
- File types the command will process (docx, pdf, xlsx, pptx)
- Domain expertise (frontend-design, product-self-knowledge)
- Workflows or patterns (skill-creator, mcp-builder)

Present relevant skills to the user:
- "I found these skills that might be relevant: [list]. Should any of these be included?"
- Be concise; only mention skills with clear relevance

### Step 4: Verify Command Specification

If the command is not skill-based or after skill selection is complete, verify the command specification:
- Summarize what the command will do
- Confirm the workflow or operation sequence
- Verify any constraints or requirements

Ask for confirmation:
- "To confirm, the command will [summary]. Is this correct?"
- "Are there any other requirements I should know about?"

### Step 5: Define Command Arguments

Determine the command arguments through discussion:
- "What arguments should this command accept?"
- "Are any arguments required vs optional?"
- "What are the valid values or types for each argument?"

For each argument, specify:
- Name and type
- Required vs optional status
- Default value (if optional)
- Description of purpose
- Valid values or validation rules

### Step 6: Generate Command Specification

Create the command specification as a **single Markdown file with YAML front matter**.

**Required format:**

```markdown
---
description: Brief description of what the command does
argument-hint: [arg1 | arg2] or [file-path] or [directory-path]
skills: skill-name-1, skill-name-2
---

# Command Name

Brief overview of the command's purpose.

## Arguments

List and describe each argument:
- `arg-name` (type, required/optional, default): Description and validation rules

## Workflow

Step-by-step execution sequence:
1. Input validation and processing
2. Main operations
3. Skill integration (if applicable)
4. Output generation
5. Statistics reporting

## Statistics Reporting

Commands should output comprehensive statistics including:
- Total entities/items processed
- Success/failure counts
- Compliance metrics (if applicable)
- Per-file or per-category breakdowns
- Performance metrics (time, memory if relevant)

**Example reporting structure:**
```
Total entities scanned: 145 (120 exported + 25 internal)
Entities with complete documentation: 98 (67.6%)
Entities with incomplete documentation: 32 (22.1%)
Entities with missing documentation: 15 (10.3%)

Breakdown by visibility:
- Exported: 85/120 complete (70.8%)
- Internal: 13/25 complete (52.0%)

Per-file compliance:
- src/core.ts: 95.2% (20/21)
- src/utils.ts: 88.9% (16/18)
- src/types.ts: 100.0% (8/8)
```

## Examples

Provide 2-3 usage examples with expected output.

For detailed command patterns and advanced examples, see:
- `references/command-patterns.md` - Pattern guide and syntax reference
- `references/optimize-images-example.md` - Complete realistic command example
- `../../commands/audit/js-ts-docs.md` - Real production command for reference

## Workflow Decision Tree

```
Start
  ↓
Ask: What should command do?
  ↓
Ask: Related to existing skills?
  ↓
Check /mnt/skills/* for relevant skills
  ↓
Present found skills to user
  ↓
User confirms skill selection
  ↓
Verify command specification with user
  ↓
Ask: What arguments needed?
  ↓
Define argument specifications
  ↓
Generate command specification
  ↓
Present to user for review
```

## Best Practices

**Command Naming:**
- Use lowercase with hyphens: `audit-performance`, `create-component`
- Be descriptive but concise
- Avoid generic names like `process` or `handle`

**Argument Design:**
- Minimize required arguments
- Provide sensible defaults for optional arguments
- Use clear, unambiguous argument names
- Validate argument values when possible

**Skill Integration:**
- Reference skills by name in the `skills` array
- Include skill names in command description when relevant
- Ensure referenced skills actually exist in `/mnt/skills/`

**Documentation:**
- Provide at least 2 usage examples
- Document argument constraints clearly
- Include implementation notes for complex commands
