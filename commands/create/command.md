---
description: Interactive guided workflow for creating Claude Code commands
argument-hint: [command-name] [--skill skill-name] [--interactive]
skills: command-creator
---

# create-command

Structured, interactive workflow for creating well-defined Claude Code commands. This command leverages the command-creator skill to guide you through the entire command creation process with validation checkpoints.

## Arguments

- `name` (string, required): Name of the command to create
  - Validation: Must match pattern: ^[a-z][a-z0-9-]*$
  - Example: audit-codebase, create-report, optimize-images
- `skill` (string, optional): Pre-selected skill to base command on
  - If provided, skips skill discovery phase
- `interactive` (boolean, optional, default: true): Enable interactive mode with guided questions
  - When false, expects all command details provided upfront

## Workflow

This command follows a structured creation flow with validation at each step:

### Phase 1: Command Purpose Discovery
1. If not in interactive mode, validate that command name is provided
2. Ask user for command purpose and description
3. Gather specific details about:
   - Task or operation the command performs
   - Expected inputs and outputs
   - Special requirements or constraints
4. Validation checkpoint: Confirm understanding of command purpose

### Phase 2: Skill Discovery and Selection
1. If `--skill` argument provided, skip to Phase 3
2. Ask if command relates to existing skills
3. Search available skills in:
   - `.claude/skills/` (local project skills)
   - `~/.claude/skills/` (global user skills)
4. Filter skills by relevance:
   - File types command will process
   - Domain expertise required
   - Workflow patterns needed
5. Present relevant skills (max 5) with descriptions
6. Allow user to select 0 or more skills
7. Validation checkpoint: Confirm skill selections

### Phase 3: Command Specification Design
1. Summarize command purpose and selected skills
2. Ask user to confirm or refine command specification
3. If standalone (no skills), verify workflow details
4. Validation checkpoint: User approves specification

### Phase 4: Argument Definition
1. Guide user through defining command arguments:
   - For each argument, collect:
     - Argument name
     - Type (string, number, boolean, file, directory)
     - Required vs optional
     - Default value (if optional)
     - Validation rules
     - Description
2. Present argument summary for review
3. Allow user to add, modify, or remove arguments
4. Validation checkpoint: User approves argument list

### Phase 5: Workflow Documentation
1. Generate initial workflow steps based on:
   - Command purpose
   - Selected skills
   - Defined arguments
2. Present workflow outline for review
3. Allow user to refine workflow steps
4. Add statistics reporting requirements
5. Validation checkpoint: User approves workflow

### Phase 6: Command Generation
1. Generate complete command specification file:
   - YAML front matter with description, argument-hint, skills
   - Command name header
   - Arguments section with full details
   - Workflow section with numbered steps
   - Statistics Reporting section with metrics
   - Examples section with 2-3 usage examples
2. Save to appropriate location
3. Display success message with file path
4. Offer to create related files (tests, documentation)

## Statistics Reporting

Output includes:
- Command name and location
- Skills integrated (list of skill names)
- Arguments defined (required vs optional)
- Workflow steps documented
- Examples provided
- Validation checkpoints passed
- Total creation time

Example:
```
Created command: audit-codebase
Location: .claude/commands/audit-codebase.md

Command details:
- Skills integrated: none (standalone)
- Arguments: 3 (1 required, 2 optional)
- Workflow steps: 6
- Statistics metrics: 7
- Examples: 3

Validation checkpoints: 5/5 passed
Created in 4m 32s
```

Example with skills:
```
Created command: create-report
Location: .claude/commands/create-report.md

Command details:
- Skills integrated: xlsx, docx
- Arguments: 3 (1 required, 2 optional)
- Workflow steps: 6
- Statistics metrics: 8
- Examples: 3

Validation checkpoints: 5/5 passed
Created in 5m 18s
```

## Examples

```bash
# Interactive mode (default) - guided through all steps
create:command audit-codebase

# With pre-selected skill
create:command rotate-pdf --skill pdf

# Non-interactive mode (expects all details upfront)
create:command generate-uuid --interactive false

# Multiple skill integration
create:command create-report --skill xlsx,docx
```

## Validation Checkpoints

This command implements 5 validation checkpoints:

1. **Purpose Validation**: User confirms command purpose is correctly understood
2. **Skill Selection**: User approves selected skills or confirms standalone
3. **Specification Approval**: User approves overall command specification
4. **Argument Validation**: User approves argument list and definitions
5. **Workflow Approval**: User approves workflow steps and statistics

At each checkpoint, user can:
- Approve and continue
- Request modifications
- Go back to previous step
- Cancel command creation

## Interactive Question Flow

When in interactive mode, the command asks structured questions:

### Purpose Questions
- "What should this command do?"
- "Can you describe a typical use case?"
- "What inputs will the command accept?"
- "What outputs will the command produce?"

### Skill Questions
- "Is this command based on any existing skills?"
- "Does it work with specific file formats? (pdf, docx, xlsx, etc.)"
- "Does it require domain expertise? (frontend-design, testing, etc.)"

### Argument Questions
For each argument:
- "Argument name?"
- "Type? (string, number, boolean, file, directory)"
- "Required or optional?"
- "Default value?" (if optional)
- "Valid values or constraints?"
- "Description?"

### Workflow Questions
- "Does the workflow look correct?"
- "Are there additional steps needed?"
- "What statistics should be reported?"

## Best Practices

This command enforces best practices:

**Command Naming:**
- Validates lowercase-with-hyphens format
- Rejects generic names (process, handle, run)
- Suggests improvements for unclear names

**Argument Design:**
- Recommends minimizing required arguments
- Suggests sensible defaults for optional arguments
- Validates argument names for clarity
- Warns about ambiguous constraints

**Skill Integration:**
- Verifies referenced skills exist in `.claude/skills/` or `~/.claude/skills/`
- Warns if selected skills seem unrelated to purpose
- Suggests additional skills that might be relevant

**Documentation Quality:**
- Requires at least 2 usage examples
- Enforces clear argument descriptions
- Validates workflow step clarity
- Ensures statistics section is comprehensive

## Error Handling

The command handles common errors:

**Invalid Command Name:**
```
Error: Command name "CreateReport" invalid
- Must be lowercase with hyphens
- Example: create-report
```

**Missing Required Information:**
```
Error: Cannot generate command specification
- Missing: command purpose description
- Please provide details about what the command should do
```

**Skill Not Found:**
```
Warning: Skill "pdf-processor" not found in .claude/skills/
- Available similar skills: pdf, docx
- Continue without this skill? (y/n)
```

**Invalid Argument Type:**
```
Error: Invalid argument type "text"
- Valid types: string, number, boolean, file, directory
- Did you mean: string?
```

## Integration with command-creator Skill

This command is built on the command-creator skill and follows its workflow:

1. Uses skill discovery logic from command-creator
2. Applies validation patterns from command-patterns.md
3. Generates specifications matching command-creator format
4. Enforces statistics reporting requirements
5. Validates against command-creator best practices

The key enhancement is the interactive, checkpoint-based flow that ensures:
- No missing information
- User approval at critical decision points
- Consistent command quality
- Reduced back-and-forth iterations

## Notes

- Command specifications are saved as `.md` files with YAML front matter
- Default location: `.claude/commands/[command-name].md`
- Commands can be tested immediately after creation
- Use `--interactive false` for automated/scripted command generation
