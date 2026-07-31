# OpenSpec Onboarding Skill

Generate `openspec/config.yaml` through a conversational interview. The skill asks about your tech stack and architecture, runs parallel codebase inference to fill gaps, and produces a complete configuration file for the QRSPI (Question, Research, Spec, Plan, Implement) methodology.

## Installation

Install this skill using the skills CLI:

```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-onboard-openspec
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-onboard-openspec
```

## What it does

OpenSpec requires an `openspec/config.yaml` file that defines project context and per-artifact rules. This skill creates it by:

- Running a structured interview about your tech stack, architecture, and domain concepts
- Spawning four discovery agents in parallel to infer missing details from your codebase
- Detecting whether to create, import, or refresh based on existing file state
- Validating YAML syntax before writing

The configuration is injected into every AI-generated proposal, design document, task list, and specification.

## When to use this skill

Use it when you need to:

- Start a new project with OpenSpec
- Migrate an existing project to the OpenSpec workflow
- Update configuration after tech stack changes
- Onboard team members
- Refresh stale configuration

The skill detects file state and adapts automatically.

## Quick start

Invoke the skill:

```bash
/accelint-onboard-openspec
```

The skill will:

1. Check for existing documentation, especially `ARCHITECTURE.md`
2. Detect config file state and announce the mode (`create`, `import`, or `refresh`)
3. Run an interview with questions grouped by topic
4. Spawn parallel discovery agents to infer what you did not answer
5. Show a labeled preview with inference sources
6. Write `openspec/config.yaml` after confirmation

The process takes 5–10 minutes, depending on project complexity.

## Configuration modes

### Create mode

Runs when `openspec/config.yaml` doesn't exist or is empty.

Runs a complete interview that covers all configuration sections and produces a fresh file with all context sections populated.

### Import mode

Runs when `openspec/config.yaml` exists with an unrecognized structure.

Presents three options:

- **(a) Restructure** — map existing content onto the QRSPI schema, flag behavioral content for `AGENTS.md`, and fill gaps with targeted questions
- **(b) Append** — run the full interview and add new sections alongside existing content
- **(c) Dry run** — generate output without writing to the filesystem

### Refresh mode

Runs when `openspec/config.yaml` exists with recognized QRSPI schema.

Runs an abbreviated interview that covers only:

- External findings passed from upstream workflows
- Drift detection, such as tech stack changes, new dependencies, or updated configs
- Unresolved `# TODO: fill in` markers from previous runs

Only asks about changed areas. Unchanged sections stay untouched.

## Interview structure

The interview covers 10 topics:

1. **Project Identity** - Name, purpose, monorepo structure, package manager
2. **Tech Stack** - Runtime, language, framework, data layer, testing, build tools
3. **Architecture** - Organization style, path aliases, design patterns
4. **Domain Concepts** - Key entities, terminology, specialized concepts
5. **Performance** - Concrete targets (p95 latency, fps, memory), hot paths
6. **Code Patterns** - Export style, naming conventions, error handling, testing structure
7. **Anti-Patterns** - Banned patterns, deprecated approaches, performance traps
8. **Proposal Rules** - Database impact, breaking changes, security checklists
9. **Design Rules** - Docker/K8s changes, performance implications, diagram styles
10. **Task Rules** - Tagging conventions, rollback requirements, test gates

Questions within each topic are bundled into natural conversation turns.

## Parallel codebase inference

After the interview, four discovery agents run simultaneously:

- **Agent A: Stack & Build Tooling** - Runtime, TypeScript config, package manager, monorepo workspaces, build tools
- **Agent B: Testing & Code Quality** - Test framework, linting, formatting, test structure, type checking
- **Agent C: Architecture & Code Patterns** - Directory structure, path aliases, design patterns, export style, naming, error handling
- **Agent D: CI/CD & Versioning** - CI platform, versioning strategy, documented anti-patterns

All agents run concurrently and merge their findings before the preview is shown.

## Configuration output

The generated `openspec/config.yaml` follows this structure:

```yaml
schema: spec-driven

context: |
  # Stack Facts - Project identity, tech stack, architecture, domain concepts, performance targets
  # Patterns to Follow - Code patterns, architecture patterns, testing patterns
  # Patterns to Avoid - Anti-patterns with rationale

rules:
  proposal:    # Scope definition checkpoints
  design:      # Required sections, technical depth, line limits
  tasks:       # Vertical slicing, granularity, test verification
  spec:        # Given/When/Then format, example data, edge cases
```

Every section matters. Missing fields degrade the AI artifacts that use this config.

## Best practices

### Answer honestly about unknowns

If you do not know an answer, say so. The skill attempts codebase inference. Fields that cannot be resolved are marked `# TODO: fill in`.

### Review inferred values

The preview labels all inferred values with their source:

```yaml
- Runtime: Node.js 20 LTS   # inferred from .nvmrc
```

Check these before you confirm. Inference may misread unconventional project structures.

### Complete TODOs after generation

If the final config has `# TODO: fill in` markers, edit the file directly. These usually represent performance targets, team-specific rules, or domain concepts that cannot be inferred from code.

### Use refresh mode for updates

When the tech stack changes, re-run the skill. It detects drift automatically and only asks about changed sections.

## Companion skill

This skill produces the project DNA layer: structural facts about the project. Its companion `accelint-onboard-agents` produces the behavior layer (`AGENTS.md` / `CLAUDE.md`), which covers how the agent acts and makes decisions.

```
openspec/config.yaml   → this skill                 → WHAT the project is
AGENTS.md / CLAUDE.md  → accelint-onboard-agents   → HOW the agent behaves
```

If you mention behavioral content during the OpenSpec interview, such as commit conventions, workflow steps, or tool preferences, the skill redirects you to `accelint-onboard-agents`.

## Troubleshooting

### "Config file has unrecognized structure"

Choose restructure to migrate to QRSPI format, append to keep the existing structure and add new sections, or dry run to preview without modifying anything.

### "YAML syntax error after generation"

Validation catches the parse error and fixes it before writing. The safety checks worked.

### "Subagents aren't available"

If subagents are unavailable, the skill says so explicitly and performs the same four-domain scan inline with direct tools.

### "Refresh mode found drift I don't want to encode yet"

The skill shows the changed sections first, marks unresolved items as `# TODO: fill in`, and calls out findings that may belong in specs or docs instead.

### "Inference marked too many fields as TODO"

Edit the file directly to fill the TODOs, or re-run the skill with more detailed interview answers.

## Version

Current version: 1.6.1

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.

## License

Apache-2.0

## Related skills

- `accelint-onboard-agents` - Generate behavioral configuration (`AGENTS.md` / `CLAUDE.md`)
- `accelint-readme-writer` - Generate README documentation
- `accelint-architecture-doc` - Create ARCHITECTURE.md with parallel discovery