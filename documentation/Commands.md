# Claude Code Commands

## Overview

Commands are task-specific specifications that enable Claude Code to perform automated operations in your codebase. Each command defines a discrete unit of work with well-defined inputs, execution workflows, and expected outputs. Commands leverage Claude's agentic capabilities to autonomously execute complex development tasks from the terminal.

## Command and Skill Locations

Commands and skills can be stored at two levels:

### Project-Level (Recommended)

```
./.claude/
├── commands/          # Project-specific commands
│   ├── audit-comments.md
│   └── generate-types.md
└── skills/           # Project-specific skills
    ├── my-skill/
    └── another-skill/
```

**Use for**: Commands and skills specific to a project or codebase.

### Global/User-Level

```
~/.claude/
├── commands/          # User-wide commands
│   └── common-task.md
└── skills/           # User-wide skills
    └── shared-skill/
```

**Use for**: Commands and skills you use across multiple projects.

**Resolution order**: Project-level commands and skills take precedence over global ones.

## Command Creation Tools

### accelint-command-creator Skill and /creation:command Command

The `accelint-command-creator` skill provides a structured workflow for creating command specifications. A corresponding `/creation:command` command invokes this skill to automate the process.

**accelint-command-creator skill** guides you through:
- Command purpose definition
- Skill dependency identification
- Relevant skill discovery across `.claude/skills/` and `~/.claude/skills/` directories
- Argument specification and validation
- Workflow structure design
- Command file generation

**Location**: Typically in `~/.claude/skills/acceling-command-creator/SKILL.md` for global use.

**Usage**:
```bash
# Invoke via the /creation:command command (recommended)
claude /creation:command <command-name>

# Or reference the skill directly in your workflow
```

**When to use**: Creating any new command, whether skill-based or standalone.

### Manual Creation

Commands can also be created manually by following the specification format and best practices outlined in this document. Manual creation is suitable for simple commands or when you need fine-grained control over the specification.

## Command Architecture

### Structure

Commands are defined as Markdown files with YAML front matter. Each command specification consists of:

```
┌─────────────────────────────────────────┐
│ YAML Front Matter                       │
│  - description                          │
│  - argument-hint                        │
│  - skills (optional)                    │
├─────────────────────────────────────────┤
│ Markdown Body                           │
│  - Overview                             │
│  - Arguments                            │
│  - Workflow                             │
│  - Statistics Reporting                 │
│  - Examples                             │
└─────────────────────────────────────────┘
```

### Front Matter Fields

**Required fields:**

- `description`: Concise summary of command functionality (1-2 sentences)
- `argument-hint`: Argument pattern for CLI interface (e.g., `[file-path]`, `[arg1 | arg2]`)

**Optional fields:**

- `skills`: Comma-separated list of skill names the command integrates with

### Example Command File

```markdown
---
description: Audit JSDoc comments for completeness and accuracy across TypeScript source files
argument-hint: [directory-path]
skills: js-ts-best-practices
---

# audit-comments

Scans TypeScript files to validate JSDoc comment completeness, parameter documentation, and return type annotations.

## Arguments

- `directory-path` (string, required): Path to directory containing TypeScript files to audit

## Workflow

1. Recursively scan directory for `.ts` and `.tsx` files
2. Parse each file to extract exported entities (functions, classes, types)
3. Validate JSDoc comments against entity signatures
4. Check parameter documentation completeness
5. Verify return type documentation
6. Generate compliance report with statistics

## Statistics Reporting

Output includes:
- Total entities scanned (exported vs internal)
- Documentation completeness percentages
- Per-file compliance rates
- Missing documentation details

## Examples

Basic audit:
```bash
claude audit-comments ./src
```

Expected output:
```
Total entities scanned: 145 (120 exported + 25 internal)
Entities with complete documentation: 98 (67.6%)
Entities with incomplete documentation: 32 (22.1%)
Entities with missing documentation: 15 (10.3%)
```
```

## Command Types

### Skill-Based Commands

Commands that integrate with existing skills to leverage domain-specific knowledge or workflows. Skills provide specialized capabilities for file formats, design patterns, or technical domains.

**Example use cases:**
- Document processing (docx, pdf, xlsx, pptx)
- Frontend component generation (frontend-design)
- Code auditing (js-ts-best-practices)

**Skill integration:**
1. Reference skills in front matter: `skills: skill-name-1, skill-name-2`
2. Claude Code automatically loads skill instructions during execution
3. Skills provide context-specific best practices and constraints

### Standalone Commands

Commands that operate independently without skill dependencies. These handle general-purpose tasks or project-specific workflows.

**Example use cases:**
- File manipulation and transformations
- Project structure generation
- Development environment setup
- Custom build or deployment workflows

## Argument Specification

### Argument Types

Commands accept typed arguments with validation:

```typescript
type ArgumentType =
  | "string"      // Text input
  | "number"      // Numeric value
  | "boolean"     // True/false flag
  | "path"        // File or directory path
  | "enum"        // Fixed set of values
  | "array"       // Multiple values
```

### Argument Definition Pattern

```markdown
## Arguments

- `arg-name` (type, required/optional, default): Description
  - Validation: Constraints or valid values
  - Example: `example-value`
```

### Required vs Optional Arguments

**Required arguments:**
- Must be provided by user
- Command fails without them
- No default value

**Optional arguments:**
- Have sensible defaults
- Modify command behavior
- Can be omitted

**Example:**

```markdown
## Arguments

- `source-dir` (path, required): Directory to process
- `output-format` (enum, optional, default: "json"): Output format
  - Valid values: json, yaml, csv
- `verbose` (boolean, optional, default: false): Enable detailed logging
```

## Workflow Specification

The workflow section defines the command's execution sequence. Structure workflows as numbered steps with clear inputs, operations, and outputs.

### Workflow Pattern

```markdown
## Workflow

1. **Input validation**: Verify arguments and preconditions
   - Check path existence
   - Validate argument constraints
   - Ensure dependencies available

2. **Data gathering**: Collect required information
   - Scan filesystem
   - Parse configuration files
   - Load external data sources

3. **Processing**: Execute main operations
   - Transform data
   - Generate outputs
   - Apply business logic

4. **Skill integration** (if applicable): Apply skill-specific operations
   - Load skill instructions
   - Execute skill-defined workflows
   - Validate against skill constraints

5. **Output generation**: Produce results
   - Write files
   - Display reports
   - Update configurations

6. **Statistics reporting**: Provide execution metrics
   - Entities processed
   - Success/failure counts
   - Performance data
```

### Conditional Workflows

Use decision points for branching logic:

```
Input validation
  ↓
Is directory? ────→ [Yes] ────→ Recursive scan
  ↓                               ↓
[No]                              Process files
  ↓                               ↓
Single file processing ───────→ Merge results
  ↓
Generate report
```

## Statistics Reporting

Commands must output comprehensive statistics for transparency and debugging.

### Required Metrics

- **Total counts**: Entities, files, or items processed
- **Success/failure rates**: What succeeded vs failed
- **Compliance metrics**: Percentage meeting criteria
- **Breakdown by category**: Per-file, per-type, or per-operation

### Reporting Format

Use hierarchical structure with percentages:

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

### Performance Metrics

Include timing data for long-running commands:

```
Execution time: 2.34s
Files processed: 87
Average time per file: 26.9ms
Memory peak: 124.5 MB
```

## Examples Section

Provide at least 2-3 usage examples demonstrating:

1. **Basic usage**: Minimal required arguments
2. **Advanced usage**: Optional arguments and flags
3. **Edge cases**: Unusual inputs or special scenarios

### Example Format

```markdown
## Examples

**Basic audit of source directory:**
```bash
claude audit-comments ./src
```

**Audit with verbose output:**
```bash
claude audit-comments ./src --verbose
```

**Audit specific file:**
```bash
claude audit-comments ./src/core.ts
```

Expected output:
```
Scanning ./src/core.ts...
Found 21 exported entities
Documentation compliance: 95.2% (20/21)
Missing documentation:
  - processData() at line 145
```
```

## Command Naming Conventions

### Naming Pattern

Use lowercase with hyphens (kebab-case):

```
audit-comments     ✓ Clear, descriptive
create-component   ✓ Action + object
generate-types     ✓ Verb + target
process            ✗ Too generic
handle             ✗ Too vague
do-stuff           ✗ Unclear purpose
```

### Naming Guidelines

1. **Start with verb**: Describe the action (audit, create, generate, validate)
2. **Include object**: What the command operates on (comments, component, types)
3. **Be specific**: Avoid generic verbs (process, handle, manage)
4. **Keep concise**: 2-3 words maximum
5. **Avoid abbreviations**: Use full words for clarity

## Skill Integration

### Discovering Relevant Skills

Skills provide domain-specific knowledge and workflows. The `accelint-command-creator` skill (invoked via `/creation:command`) automates skill discovery, but you can also manually check these directories:

```bash
# Project-level skills (most common)
./.claude/skills/

# Global skills
~/.claude/skills/
```

Within these directories, you'll typically find:

```
skills/
├── public/          # Core Claude skills (docx, pdf, xlsx, pptx)
├── private/         # Organization-specific skills
├── examples/        # Reference implementations
└── user/            # User-defined skills (e.g., accelint-command-creator)
```

**Note**: The exact subdirectory structure may vary. Project-level skills often have a flatter structure with skills directly in `.claude/skills/`.

**Recommended approach**: Use `/creation:command` to systematically discover and evaluate relevant skills for your command.

### Skill Selection Criteria

Include a skill if the command needs:

- **File format expertise**: Document processing (docx, pdf, xlsx, pptx)
- **Domain knowledge**: Frontend design, TypeScript patterns
- **Workflow templates**: Code generation, testing, deployment
- **Best practices**: Language-specific conventions

Skills can be located in:
- `./.claude/skills/` (project-specific)
- `~/.claude/skills/` (globally available)

### Multiple Skill Integration

Commands can reference multiple skills:

```yaml
skills: docx, js-ts-best-practices, frontend-design
```

Claude Code loads all referenced skills and applies their combined knowledge during execution.

## Best Practices

### Command Design

1. **Single responsibility**: Each command performs one well-defined task
2. **Idempotent operations**: Running command multiple times produces same result
3. **Fail-safe execution**: Validate inputs before making changes
4. **Clear error messages**: Explain what went wrong and how to fix it

### Argument Design

1. **Minimize required arguments**: Use sensible defaults where possible
2. **Validate early**: Check argument validity before processing
3. **Document constraints**: Specify valid values, ranges, or patterns
4. **Provide examples**: Show typical argument values

### Documentation

1. **Clear descriptions**: Explain command purpose without jargon
2. **Complete workflows**: Document all execution steps
3. **Comprehensive examples**: Cover common and edge cases
4. **Statistics specification**: Define what metrics will be reported

### Performance Considerations

1. **Efficient file scanning**: Use appropriate recursion depth
2. **Batch operations**: Group related operations to reduce overhead
3. **Progress indicators**: Provide feedback for long-running commands
4. **Resource limits**: Document memory or time requirements

## Command Development Workflow

The `accelint-command-creator` skill provides a structured workflow for creating well-formed command specifications. The `/creation:command` command invokes this skill to automate the entire process.

### Using /creation:command (Recommended)

The simplest way to create a new command:

```bash
claude /creation:command <command-name>
```

This command will:
1. Systematically identify command requirements through interactive prompts
2. Discover relevant skills in `.claude/skills/` and `~/.claude/skills/` directories
3. Guide you through argument specification with proper validation
4. Help structure workflow execution sequences
5. Generate a compliant command specification file

The underlying accelint-command-creator skill follows this decision tree:

```
Define command purpose
  ↓
Identify skill dependencies
  ↓
Discover relevant skills in .claude/skills/ and ~/.claude/skills/
  ↓
Verify command specification
  ↓
Define arguments and validation
  ↓
Generate command specification file
```

### Manual Command Development Steps

If creating commands manually without `/creation:command`:

### 1. Define Purpose

Clearly articulate what problem the command solves:

```
Problem: Manual JSDoc auditing is time-consuming and error-prone
Solution: Automated validation of JSDoc completeness across codebase
```

### 2. Identify Dependencies

Determine if existing skills provide relevant capabilities:

- Does the command process specific file formats?
- Does it need domain-specific knowledge?
- Are there established patterns or workflows to follow?

Check for skills in:
- `./.claude/skills/` (project-level)
- `~/.claude/skills/` (global)

**Tip**: The `/creation:command` command automates this discovery process by invoking the accelint-command-creator skill.

### 3. Design Arguments

Define the minimal set of arguments needed:

```markdown
Required:
- source-path: What to process

Optional:
- output-format: How to present results (default: terminal)
- strict-mode: Enforce stricter validation (default: false)
```

### 4. Specify Workflow

Break down execution into discrete steps:

1. Validate inputs
2. Collect data
3. Process/transform
4. Generate outputs
5. Report statistics

### 5. Implement Statistics

Define what metrics provide value to users:

- Total processed
- Success rate
- Failure details
- Performance metrics

### 6. Create Examples

Provide 2-3 examples showing typical usage patterns.

### 7. Test Edge Cases

Verify command handles:

- Missing files/directories
- Invalid arguments
- Empty inputs
- Large datasets
- Concurrent execution

## Integration with Claude Code

### Command Discovery

Claude Code automatically discovers commands from:

1. **Project-level**: `./.claude/commands/` (checked first)
2. **Global-level**: `~/.claude/commands/` (fallback)

Commands are available via:

```bash
claude <command-name> [arguments]
```

If a command exists at both project and global levels, the project-level command takes precedence.

### Execution Model

1. User invokes command from terminal
2. Claude Code loads command specification
3. Claude Code loads referenced skills (if any)
4. Claude executes workflow autonomously
5. Claude reports results and statistics

### Error Handling

Commands should handle errors gracefully:

```markdown
## Error Handling

- Invalid path: Display error and suggest valid paths
- Missing dependencies: List required dependencies
- Permission errors: Explain required permissions
- Parsing failures: Show problematic file and line number
```

## Common Patterns

### File Processing

```markdown
## Workflow

1. Validate input path exists
2. Determine if path is file or directory
3. If directory, recursively scan for target files
4. Process each file:
   - Parse content
   - Apply transformations
   - Validate output
5. Aggregate results
6. Generate summary statistics
```

### Code Generation

```markdown
## Workflow

1. Validate template and output paths
2. Load skill instructions (if applicable)
3. Parse user requirements from arguments
4. Generate code using templates or AI
5. Validate generated code:
   - Syntax checking
   - Type checking
   - Linting
6. Write output files
7. Report generation statistics
```

### Validation/Auditing

```markdown
## Workflow

1. Scan target files
2. Extract entities to validate
3. For each entity:
   - Check against rules
   - Record compliance status
   - Collect violations
4. Aggregate compliance metrics
5. Generate detailed report
```

## Advanced Topics

### Argument Validation

Implement runtime validation for complex constraints:

```typescript
type SourceFormat = "typescript" | "javascript";
type OutputFormat = "json" | "yaml" | "markdown";

// Validate enum values
if (!["typescript", "javascript"].includes(sourceFormat)) {
  throw new Error(`Invalid source-format: ${sourceFormat}`);
}

// Validate path existence
if (!fs.existsSync(sourcePath)) {
  throw new Error(`Path not found: ${sourcePath}`);
}

// Validate numeric ranges
if (maxDepth < 1 || maxDepth > 10) {
  throw new Error(`max-depth must be between 1 and 10`);
}
```

### Incremental Processing

For large codebases, implement incremental processing:

1. Cache previous results
2. Detect changed files
3. Process only modified files
4. Merge with cached results

### Parallel Execution

For CPU-intensive operations, consider parallel processing:

```markdown
## Workflow

1. Collect all files to process
2. Split into batches
3. Process batches in parallel (up to CPU count)
4. Merge results from all batches
5. Generate combined statistics
```

## References

For detailed examples and advanced patterns, see:

- Accelint-command-creator skill: `./.claude/skills/accelint-command-creator/SKILL.md` (project) or `~/.claude/skills/accelint-command-creator/SKILL.md` (global)
- `/creation:command` command: Invokes the accelint-command-creator skill for automated command generation
- `command-patterns.md`: Common command structures and implementation patterns
- Example commands in `./.claude/commands/` or `~/.claude/commands/`: Real-world command implementations

### Using /creation:command and acceling-command-creator

To create a new command:

```bash
# Automated approach (recommended)
claude /creation:command <command-name>

# Manual approach - view the skill documentation first
cat ./.claude/skills/accelint-command-creator/SKILL.md  # project-level
cat ~/.claude/skills/accelint-command-creator/SKILL.md  # global
```

The `/creation:command` command and underlying skill provide comprehensive guidance on:
- Systematic requirement gathering
- Skill discovery and selection
- Argument definition patterns
- Workflow specification templates
- Statistics reporting standards

## Contributing

When adding new commands:

1. **Use /creation:command (recommended)**: Automate command generation with `claude /creation:command <command-name>`
2. **Or use the accelint-command-creator skill directly**: Leverage the structured workflow in `./.claude/skills/accelint-command-creator/SKILL.md` or `~/.claude/skills/accelint-command-creator/SKILL.md`
3. Follow the command specification format exactly
4. Reference existing skills when applicable
5. Provide comprehensive examples
6. Include detailed statistics reporting
7. Document all arguments with validation rules
8. Test with edge cases before committing

The `/creation:command` command and accelint-command-creator skill ensure:
- Proper skill discovery and integration
- Complete argument specifications
- Well-structured workflow definitions
- Compliance with command format requirements
