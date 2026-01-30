# Agent Skills Repository

This repository contains skills and commands that transform AI agents into specialized problem solvers following the [Agent Skills](https://agentskills.io/) format.

## Architecture Overview

### Three-Layer Structure

```
skills/           # Domain expertise packages (js-ts-best-practices, react-best-practices)
├── SKILL.md      # Entry point with YAML frontmatter + workflow
├── AGENTS.md     # Token-efficient rule summaries with reference links
└── references/   # Detailed ❌/✅ examples, loaded on-demand

commands/         # Task specifications for Claude Code CLI
├── create/       # Generation commands (skill, readme, command)
├── audit/        # Code analysis commands (js-ts-docs, js-ts-perf)
└── feature-planning/  # Development workflow commands

documentation/    # Architecture guides for skills and commands
```

**Critical principle:** Progressive disclosure. AGENTS.md has compressed summaries (1 line per rule), references/ have detailed examples. Agents load references only when implementing specific rules to minimize context usage.

## File Structure Conventions

### Skills (User-Facing Knowledge Packages)

- **SKILL.md**: Required entry point with YAML frontmatter
  - `description` field determines activation (MUST include "Use when..." with triggers, keywords)
  - Body contains workflow/procedures, kept under 500 lines
  - Use imperative form ("Execute script", not "The script is executed")
- **AGENTS.md**: Optional, for complex skills with many rules
  - Rule summaries with links to references/ (e.g., "Use kebab-case, append qualifiers. [View examples](references/naming.md)")
  - NEVER repeat workflow from SKILL.md
  - Include "Critical Anti-Patterns" section at top
- **references/**: Detailed examples in ❌/✅ format
  - Each file is self-contained
  - Loaded on-demand when agent implements specific rule
- **scripts/**: Reusable automation for deterministic operations
- **assets/**: Templates, boilerplate, sample data

### Commands (Claude Code CLI Specifications)

- YAML frontmatter: `description`, `argument-hint`, `skills` (optional)
- Sections: Arguments, Workflow, Statistics Reporting, Examples
- Workflow organized by phases with validation checkpoints
- Commands integrate with skills via `skills:` field

## Key Patterns

### 1. Skill Description Field is Critical for Activation

**Purpose:** Determines if skill loads. Must answer "when to use", NOT "what it does".

```yaml
# ❌ Wrong: describes workflow (agent may follow description instead of reading skill)
description: Code review between tasks, dispatches subagent per task

# ✅ Correct: triggering conditions only
description: Use when executing implementation plans with independent tasks in current session
```

Include: triggers ("Use when..."), keywords (file types, action verbs), specific scenarios.

### 2. Progressive Disclosure Throughout

Skills minimize context by:
1. SKILL.md description → triggers activation
2. SKILL.md body → core workflow only
3. AGENTS.md → compressed rule summaries
4. references/ → detailed examples loaded on-demand

Commands reference skills instead of duplicating knowledge:
```yaml
skills: js-ts-best-practices, vitest-best-practices
```

### 3. Token-Efficient AGENTS.md Format

```markdown
### 1.1 Rule Name
One-line summary with actionable guidance.
[View detailed examples](references/rule-name.md)

## Critical Anti-Patterns (at top)
- **NEVER use `any` type** - Use `unknown` or generics instead
- **NEVER chain .filter().map()** - Use single `reduce` pass
```

Cross-reference other skills rather than repeating: "REQUIRED: Use [skill-name] for workflow."

### 4. Writing for Agents, Not Humans

- **Assume expertise**: Don't explain standard concepts (opening files, common libraries)
- **Be specific**: "NEVER use `any`" not "be careful with types"
- **Show consequences**: "degrades V8 optimization" not "bad for performance"
- **Use imperative**: "Execute script" not "The script can be executed"
- **Skip obvious steps**: Don't list "Step 1: Open file, Step 2: Edit, Step 3: Save"

### 5. Example Format Standards

```markdown
**❌ Incorrect: [reason]**
```ts
// bad code with comment explaining why
```

**✅ Correct: [benefit]**
```ts
// good code with comment explaining why
```
```

Include context in examples (3+ lines before/after target change) so agents see real usage.

## Development Workflows

### Creating a New Skill

1. Use `claude /create:skill [name]` command or skill-manager skill directly
2. Follow 4-step workflow: Understanding → Planning → Initializing → Editing
3. Validate description answers "WHAT, WHEN, KEYWORDS"
4. Choose location: `.claude/skills/` (project) or `~/.claude/skills/` (global)

### Creating a New Command

1. Use `claude /create:command [name]` or command-creator skill
2. Identify skill dependencies
3. Structure workflow with phases and validation checkpoints
4. Save to `.claude/commands/` (project) or `~/.claude/commands/` (global)

### Editing Skills/Commands

- Skills: Focus on token efficiency and progressive disclosure
- References: Self-contained with complete ❌/✅ examples
- Commands: Clear phase structure with statistics reporting

## Critical Anti-Patterns

- **NEVER write tutorials** - Assume agent knows standard concepts, focus on expert-only knowledge
- **NEVER put workflow in description** - Description is for triggering only, not summarizing process
- **NEVER dump everything in SKILL.md** - Use progressive disclosure with references/ loaded on-demand
- **NEVER use generic warnings** - "Be careful" is useless; provide specific anti-patterns with reasons
- **NEVER explain standard operations** - Assume agent can read files, write code; focus on non-obvious decisions
- **NEVER make skills tech-agnostic when tech-specific** - If skill is for React, say "React" in description

## Testing and Validation

Skills and commands are tested by usage. Key validation points:

1. **Description triggers correctly** - Skills activate in relevant contexts
2. **References load on-demand** - Agents cite specific files when implementing rules
3. **Commands execute phases** - Validation checkpoints catch errors early
4. **Scripts are reusable** - Deterministic operations don't need modification

## File Naming

- Skills: `kebab-case` directories, `UPPERCASE.md` for main files, `lowercase.md` for references
- Commands: `kebab-case.md` in categorized directories (create/, audit/, feature-planning/)
- Scripts: `kebab-case.sh` or `kebab-case.py`
- Assets: Descriptive names, match output format
