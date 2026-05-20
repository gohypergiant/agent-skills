# Accelint Core Migrate

A Claude Code skill that automates migrating features from portfolio repositories to Core using QRSPI methodology. Takes existing proposal.md and design.md from portfolio repos and generates OpenSpec artifacts for Core with generalization, dependency tracking, and vertical task slicing.

## What This Does

This skill runs a structured planning workflow for cross-repo feature migration:

**Input**: Portfolio proposal.md and design.md (from any independent repo)

**Process**: QRSPI methodology (Questions, Research, Design, Structure)

**Output**: OpenSpec change for Core with proposal, design, specs, and tasks

**Scope**: Planning only (stops before implementation)

After completion, continue with `/opsx:apply` to implement the planned changes.

## When to Use

Use this skill when you need to:

- Migrate a feature from a portfolio repo to Core
- Make a portfolio-specific feature generic for reuse
- Adapt designs from one repo to work in another
- Generalize hardcoded portfolio logic for Core

**Don't use this for:**
- Greenfield feature planning (use accelint-qrspi-propose instead)
- Direct implementation without planning
- Portfolio to portfolio migrations (different workflow)

## Quick Start

### Prerequisites

1. OpenSpec installed and initialized in the Core repo
2. Expanded workflows enabled:
   ```bash
   openspec config profile
   # Select "expanded"
   openspec update
   ```
3. Portfolio artifacts: proposal.md and design.md from the source repo

### Basic Usage

```
/accelint-core-migrate

I want to migrate this feature to Core:

Portfolio proposal.md: /path/to/portfolio-repo/openspec/changes/feature-x/proposal.md
Portfolio design.md: /path/to/portfolio-repo/openspec/changes/feature-x/design.md
```

Or paste the content directly:

```
/accelint-core-migrate

Portfolio proposal.md:
[paste content]

Portfolio design.md:
[paste content]
```

### What Happens Next

The skill runs six phases with two mandatory review checkpoints:

1. Phase 0: Preflight checks (validates inputs, checks OpenSpec config)
2. Phase 1: Questions (generates generalization-focused questions)
3. Phase 2: Research (analyzes Core's current state)
4. Phase 3: Design (generates Core-adapted proposal.md and design.md)
5. ⚠️ CHECKPOINT 1: Review design before continuing
6. Phase 5: Specs & Tasks (generates delta specs and task breakdown)
7. ⚠️ CHECKPOINT 2: Review tasks before implementation
8. Phase 6: Completion (outputs change name for `/opsx:apply`)

## Key Differences from QRSPI Propose

This skill adapts the standard QRSPI workflow for cross-repo migration:

| Aspect | QRSPI Propose | Core Migrate |
|--------|---------------|--------------|
| Input | Ticket/feature request | Existing proposal.md + design.md |
| Questions Focus | Feature requirements | Generalization needs |
| Research Focus | Current codebase patterns | Core equivalents and gaps |
| Design Goal | Implement new feature | Adapt to be portfolio-agnostic |
| Special Handling | None | Dependency tracking and edge cases |

## How It Works

### Context Isolation

The workflow uses QRSPI's two-context-window pattern to prevent direct copying:

- **Phase 1**: Portfolio docs are IN context, generates generalization questions
- **Phase 2+**: Portfolio docs are OUT of context, prevents copying and forces adaptation

This ensures the Core implementation is generic, not a copy-paste of portfolio code.

### Dependency Tracking

The skill surfaces portfolio-specific components that don't exist in Core:

1. Known patterns are loaded from `references/edge-cases.md` during research
2. Novel dependencies are discovered during research and surfaced at checkpoints
3. At design review, you decide whether to add them to Core or find alternatives

### Edge Cases Reference

The skill includes `references/edge-cases.md` for cataloging common portfolio to Core patterns:

- UI component library mappings
- Routing library version mismatches
- State management differences
- Map/geospatial component adaptations
- Build tool configurations

Add new patterns as you encounter them. The file includes template examples as markdown comments.

### Vertical Slicing

Tasks are automatically structured as vertical slices (end-to-end features), not horizontal layers:

✅ **Correct (vertical)**:
- Slice 1: Basic layer component + API (portfolios can import)
- Slice 2: Advanced layer component + API (adds functionality)

❌ **Wrong (horizontal)**:
- Phase 1: All components
- Phase 2: All APIs
- Phase 3: All tests

The skill auto-converts horizontal slices to vertical if detected.

## Workflow Phases

### Phase 0: Preflight Checks

Validates portfolio docs are provided and OpenSpec workflows are enabled.

### Phase 1: Questions (Portfolio Context to Generalization Questions)

Spawns a sub-agent that sees the portfolio docs and generates research questions focused on:

- Portfolio-specific dependencies
- Core equivalents
- Missing Core infrastructure
- Generalization opportunities
- API compatibility for multiple portfolios

### Phase 2: Research (Questions Only to Core State Analysis)

Spawns a fresh sub-agent (NO portfolio docs in context) that:

- Answers questions with Core's current state
- Identifies existing Core components
- Notes what's missing
- Loads known patterns from `references/edge-cases.md`

### Phase 3: Design Scaffolding (Core-Adapted Design)

Spawns a sub-agent that generates Core-ready proposal.md and design.md using:

- Research questions + answers
- Known edge case patterns
- OpenSpec design rules
- AGENTS.md behavior context

**CRITICAL**: Stops here for checkpoint. Does NOT generate specs/tasks yet.

### Phase 4: Design Review Checkpoint ⚠️

**MANDATORY**: You must review and approve the design before continuing.

Check for:
- Portfolio-specific dependencies that don't exist in Core
- Appropriate abstractions for Core's architecture
- Portfolio-agnostic design (no hardcoded assumptions)
- Wrong pattern references
- Missing affected systems

**Options**: (a) Approve, (b) Request edits, (c) Manual edit

### Phase 5: Specs & Tasks Generation

After design approval, generates:

- Delta specs (`specs/*`)
- Task breakdown (`tasks.md`) with vertical slicing
- Parallelization strategy

Validates vertical slicing and auto-converts if needed.

### Phase 6: Completion

Outputs the change name and next steps:

```bash
/clear                    # Start fresh context
/opsx:apply <change-name> # Begin implementation
```

## Example Session

```
User: Migrate the data visualization feature to Core

/accelint-core-migrate

Portfolio proposal.md: /portfolio-a/openspec/changes/data-viz/proposal.md
Portfolio design.md: /portfolio-a/openspec/changes/data-viz/design.md

---

Agent: Checking OpenSpec configuration...
✓ Expanded workflows enabled

Phase 1: Generating generalization questions...
[Sub-agent generates questions about D3.js dependency, chart components, data formats]

Phase 2: Researching Core's current state...
[Sub-agent finds Core has Recharts, no D3.js, different data shape]

Phase 3: Generating Core-adapted design...
[Creates proposal.md and design.md]

⚠️ CHECKPOINT 1: Design Review

Design artifact generated for Core. Please review for:
- Portfolio uses D3.js v7, Core uses Recharts
- Chart components need abstraction layer for multiple viz libraries
- Data transformation utilities needed in Core

Options:
(a) Approve
(b) Request edits
(c) Manual edit

User: Looks good, approve

Phase 5: Generating specs and tasks...
✓ Task structure follows vertical slicing

⚠️ CHECKPOINT 2: Task Review

Options:
(a) Approve
(b) Request changes
(c) Manual edit

User: Approve

✅ QRSPI planning phase complete (Core migration)

Change name: core-data-viz-abstraction

Next steps:
1. Run /clear
2. Run /opsx:apply core-data-viz-abstraction
```

## Configuration

### OpenSpec Requirements

The skill expects:

- `openspec/` directory initialized
- `openspec/config.yaml` with design, spec, and task rules
- Expanded profile enabled (workflows: explore, new, continue)

Verify with:

```bash
openspec config list
```

### Agent Behavior

Reads `AGENTS.md` or `CLAUDE.md` for agent behavior context during artifact generation.

### Edge Cases

Populate `references/edge-cases.md` with your organization's common migration patterns. See the file for template examples.

## Error Handling

**OpenSpec command fails**: Shows error, asks to retry or abort

**Sub-agent fails**: Shows error, offers retry or manual fallback

**Missing artifacts**: Checks file paths, suggests manual inspection

**Portfolio dependency not in Core**: Surfaced in design review, added to tasks

## Advanced Usage

### Manual Fallback

If sub-agents fail, you can provide questions or research manually:

1. Phase 1 fails: paste your own generalization questions
2. Phase 2 fails: paste your own Core research findings
3. Skill continues from there

### Checkpoint Edits

At each checkpoint, you can request edits (describe changes and the agent applies them), manually edit files and then confirm, or approve to continue to the next phase.

### Updating Edge Cases

After each migration, document new patterns in `references/edge-cases.md`:

```markdown
### Pattern Name
- **Portfolio uses**: [component/library/pattern]
- **Core equivalent**: [what Core has]
- **Migration steps**: [concrete steps]
- **Why this matters**: [reason for difference]
- **Test**: [verification method]
```

## License

Apache-2.0

## Version

1.0.0

## Related Skills

- accelint-qrspi-propose: For greenfield feature planning (not migrations)
- opsx:apply: For implementing the planned changes after this skill
- opsx:verify: For validating implementation against artifacts
