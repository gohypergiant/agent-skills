# OpenSpec Onboarding Skill

Generates `openspec/config.yaml` files through a conversational interview. The skill asks questions about your tech stack, architecture, and domain concepts, then runs parallel codebase inference to fill gaps. The output is a complete configuration file for the QRSPI (Question, Research, Spec, Plan, Implement) methodology.

## Overview

OpenSpec needs an `openspec/config.yaml` file that defines project context and per-artifact rules. This skill creates it by:

- Asking targeted questions about tech stack, architecture, domain concepts, and team conventions
- Spawning four discovery agents simultaneously to infer missing details from your codebase
- Detecting whether to create, import, or refresh based on existing file state
- Enforcing YAML quoting rules and validating syntax

The configuration gets injected into every AI-generated proposal, design document, task list, and specification.

## When to use

Use this skill when starting a new project with OpenSpec, migrating an existing project to the OpenSpec workflow, updating configuration after tech stack changes, onboarding team members, or refreshing stale configuration.

The skill detects the current state and adapts.

## Quick start

### Prerequisites

You need Claude Code with agent spawning for parallel inference. A git repository is recommended but not required.

### Basic usage

1. Invoke the skill:
   ```
   /accelint-onboard-openspec
   ```

2. Answer interview questions grouped by topic (project identity, tech stack, architecture, domain concepts, code patterns)

3. Review the generated preview with inferred values and TODO markers

4. Confirm to write `openspec/config.yaml` to disk

The entire process takes 5-10 minutes depending on project complexity and interview depth.

## Configuration modes

The skill has three modes based on file state:

### Mode 1: Create

**Triggers when:** `openspec/config.yaml` doesn't exist or is empty

Runs a complete interview covering all configuration sections. Questions are grouped into natural conversation turns rather than dumped as a questionnaire.

Outputs a fresh configuration file with all context sections populated.

### Mode 2: Import

**Triggers when:** `openspec/config.yaml` exists with unrecognized structure

Presents three options:

- **(a) Restructure** - Map existing content onto QRSPI schema, flag behavioral content for `AGENTS.md`, run targeted interview to fill gaps
- **(b) Append** - Run full interview and add new sections alongside existing content
- **(c) Dry run** - Generate output without writing to filesystem

This protects existing custom configuration while letting you adopt the QRSPI structure.

### Mode 3: Refresh

**Triggers when:** `openspec/config.yaml` exists with recognized QRSPI schema

Runs an abbreviated interview:

- Drift detection: scans for tech stack changes (new dependencies, updated TypeScript config, new CI workflows)
- Unresolved TODOs: finds `# TODO: fill in` markers left from previous runs

Only asks about changed areas. Unchanged sections stay untouched.

## Interview structure

The interview covers 10 topics:

| Turn | Focus Area | Example Questions |
|------|------------|------------------|
| 1 | Project Identity | Name, purpose, monorepo structure, package manager |
| 2 | Tech Stack | Runtime, language, framework, data layer, testing, build tools |
| 3 | Architecture | Organization style, path aliases, design patterns |
| 4 | Domain Concepts | Key entities, terminology, specialized concepts |
| 5 | Performance | Concrete targets (p95 latency, fps, memory), hot paths |
| 6 | Code Patterns | Export style, naming conventions, error handling, testing structure |
| 7 | Anti-Patterns | Banned patterns, deprecated approaches, performance traps |
| 8 | Proposal Rules | Database impact, breaking changes, security checklists |
| 9 | Design Rules | Docker/K8s changes, performance implications, diagram styles |
| 10 | Task Rules | Tagging conventions, rollback requirements, test gates |

Questions within each topic are bundled. The skill infers related tooling from stack answers (mention Vitest and it assumes testing-library for React components).

## Parallel codebase inference

After the interview, four discovery agents run simultaneously:

### Agent A: Stack & Build Tooling

Analyzes:
- Runtime version (`.nvmrc`, `.node-version`, `package.json#engines`)
- TypeScript configuration (`tsconfig.json` — compiler options, path aliases)
- Package manager (lockfile detection)
- Monorepo workspaces (`pnpm-workspace.yaml`, `turbo.json`)
- Build tools (`vite.config.*`, `webpack.config.*`)

### Agent B: Testing & Code Quality

Analyzes:
- Test framework (`vitest.config.*`, `jest.config.*`, `pytest.ini`)
- Linting and formatting (`.eslintrc*`, `biome.json`, `.prettierrc*`)
- Test structure patterns (describe/it nesting, file location)
- Type checking configuration for test files
- Mock cleanup settings (Vitest)

### Agent C: Architecture & Code Patterns

Analyzes:
- Architecture organization (directory tree structure)
- Path aliases (`tsconfig.json#paths`, `vite.config#resolve.alias`)
- Design patterns (factory, repository, observer — inferred from source)
- Export style (named vs default — tallied from samples)
- Naming conventions (file names, identifiers)
- Error handling approach (throw, Result, Either, boundaries)

### Agent D: CI/CD & Versioning

Analyzes:
- CI/CD platform (`.github/workflows/`, `.circleci/`)
- Versioning strategy (`.changeset/`, `commitlint.config.*`)
- Anti-patterns (ESLint rule overrides, `@deprecated` annotations)

All agents run concurrently. The skill merges their findings before showing you the preview.

## Configuration schema

The generated `openspec/config.yaml` has this structure:

```yaml
schema: spec-driven

context: |
  # Project DNA — injected into every AI artifact
  
  ## Stack Facts
  - Project identity, tech stack, architecture patterns
  - Domain concepts with one-line definitions
  - Performance targets and constraints
  
  ## Patterns to Follow
  - Code patterns (exports, naming, error handling)
  - Architecture patterns
  - Testing patterns with AAA structure
  
  ## Patterns to Avoid
  - Code anti-patterns with rationale
  - Performance anti-patterns
  - Testing anti-patterns

rules:
  proposal:
    - Scope definition checkpoints
    - Out-of-scope boundaries
  
  design:
    - Required sections (Current State, Desired End State, etc.)
    - Technical depth requirements
    - Line limits
  
  tasks:
    - Vertical slicing preference
    - Granularity limits (max 2 hours per task)
    - Test verification requirements
  
  spec:
    - Given/When/Then format
    - Concrete example data
    - Edge case documentation
```

Every section matters. Missing fields degrade the AI artifacts that use this config. Unresolved fields get marked `# TODO: fill in` rather than omitted.

## YAML safety features

The skill enforces YAML generation rules:

### Automatic quoting

Values starting with special characters get quoted:

```yaml
tag: "[PKG:auth]"           # Square brackets protected
description: "(internal)"    # Parentheses protected
pattern: "some|other"        # Pipe character protected
note: "Time: 5pm"            # Colon in value protected
```

### Block scalar indicators

Multi-line content uses literal block scalars:

```yaml
context: |
  Line 1
  Line 2
  Line 3
```

### Validation checklist

Before writing, the skill checks:
- No tab characters (YAML needs spaces)
- Quote matching
- Consistent 2-space indentation
- List items aligned at same level
- Special characters quoted where needed

After writing, it reads the file back to verify it's valid YAML.

## Smart defaults

The skill suggests stack-specific conventions. Next.js + TypeScript + Tailwind gets questions about App Router vs Pages Router, Server Component boundaries, and `"use client"` directive placement. React + Vitest assumes `userEvent` over `fireEvent` and role-based queries. Python + FastAPI asks about Pydantic v1 vs v2 and dependency injection. Node.js + Prisma asks about transaction patterns and soft-delete conventions.

This reduces open-ended questions.

## Companion skill: `accelint-onboard-agent`

This skill produces the project DNA layer (structural facts). Its companion `accelint-onboard-agent` produces the behavior layer (`AGENTS.md` / `CLAUDE.md`) covering how the agent acts, communicates, and makes decisions.

If you volunteer behavioral content during the OpenSpec interview (commit conventions, workflow steps, tool preferences), the skill will redirect you:

> "That's behavioral - it belongs in AGENTS.md. I'll note it here for reference, but the `accelint-onboard-agent` skill is where to capture it."

The two skills don't overlap.

## Best practices

### Answer honestly about unknowns

If you don't know an answer, say so. The skill will try codebase inference. Fields that can't be resolved get marked `# TODO: fill in` for later.

### Review inferred values

The preview labels all inferred values with their source:

```yaml
- Runtime: Node.js 20 LTS   # inferred from .nvmrc
```

Check these before confirming. Inference can misread unconventional project structures.

### Complete TODOs after generation

If the final config has `# TODO: fill in` markers, edit the file directly. These usually represent performance targets, team-specific rules, or domain concept definitions that can't be inferred from code.

### Use refresh mode for updates

When the tech stack changes, re-run the skill. It detects drift automatically and only asks about changed sections.

### Keep context factual

The `context:` block gets injected into every AI artifact. Put objective facts there, not opinions or procedures. Guidelines like "use semantic tokens" belong in the patterns section, not as prose.

## Validation and quality

After generation, the skill:

1. Shows a labeled preview with inference sources and TODO markers
2. Asks for confirmation before writing to disk
3. Writes the file without inference comment clutter
4. Validates the YAML by reading it back
5. Reports what was configured, what was inferred vs answered, and which TODOs remain

This catches syntax errors before they hit disk.

## Troubleshooting

### "Config file has unrecognized structure"

The skill found content that doesn't match the expected schema. Choose (a) Restructure to migrate to QRSPI format, (b) Append to keep existing structure and add new sections, or (c) Dry run to preview without modifying the file.

### "YAML syntax error after generation"

The validation caught a parse error. It's automatically fixed before the final write. If you see this, the safety checks worked.

### "Agent spawning failed"

Parallel inference needs Claude Code agent support. Without it, the skill falls back to serial discovery (slower, same output).

### "Inference marked too many fields as TODO"

This happens when the project has unconventional structure or the skill can't find expected config files. Edit the file directly to fill TODOs, or re-run with more detailed interview answers.

## Version history

See [CHANGELOG.md](CHANGELOG.md) for details.

Current version: 1.3.0
- Parallel sub-agent discovery (4x faster inference)
- Anti-pattern warning for serial scanning
- Performance improvements for large codebases

## License

Apache-2.0

## Related skills

- `accelint-onboard-agent` - Generate behavioral configuration (`AGENTS.md` / `CLAUDE.md`)
- `accelint-readme-writer` - Generate README documentation
- `accelint-architecture-doc` - Create architecture.md with parallel discovery (pattern reference for this skill)
