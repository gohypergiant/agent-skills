# README Writer

A skill for creating and maintaining README documentation that stays in sync with your actual codebase.

## Installation

Install this skill using the skills CLI:

```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-readme-writer
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-readme-writer
```

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [What This Skill Does](#what-this-skill-does)
- [Why This Skill Exists](#why-this-skill-exists)
- [Key Features](#key-features)
  - [Monorepo Support](#monorepo-support)
  - [Package Manager Detection](#package-manager-detection)
  - [Parallel Discovery](#parallel-discovery)
  - [External Findings Support](#external-findings-support)
- [README Strategy](#readme-strategy)
- [File Structure](#file-structure)
- [Required Dependencies](#required-dependencies)
- [Hard Stops](#hard-stops)
- [Architecture & Development Guides](#architecture--development-guides)
- [For Humans](#for-humans)
- [License](#license)

## Overview

Analyzes codebases from the README's location, identifies public API and configuration, compares existing docs against actual code, and generates documentation with practical examples. Supports monorepos by scoping analysis to package boundaries.

## Quick Start

This skill activates automatically when you ask to create or update a README:

```
"Create a README for this package"
"Update the README to reflect the new API"
"Document packages/my-lib"
```

The skill analyzes your codebase and either generates a new README or suggests updates to an existing one.

## What This Skill Does

1. **Scopes the README correctly** - Starts from the README location and documents that package, app, service, CLI, or monorepo root rather than scanning the whole repo.
2. **Analyzes the real surface area** - For libraries, that means exports and examples. For apps and services, that means commands, setup, configuration, and operator workflows.
3. **Identifies drift** - Finds missing coverage, stale examples, wrong commands, and mismatches between current behavior and the existing README.
4. **Generates grounded docs** - Produces practical, copy-pasteable README content tied to the actual repo.
5. **Maintains consistency** - Reuses nearby docs such as AGENTS.md, ARCHITECTURE.md, or OpenSpec config when they exist and are relevant.

## Why This Skill Exists

README files go stale as code evolves. This skill:

- Keeps documentation accurate without manual tracking
- Documents new exports automatically
- Flags removed functionality for cleanup
- Updates examples when APIs change

## Key Features

### Monorepo Support

In monorepos, the skill scopes analysis to the package containing the README, not the entire repository.

### Package Manager Detection

Automatically detects and uses the correct package manager based on lockfiles:

| Lockfile | Package Manager |
|----------|-----------------|
| `pnpm-lock.yaml` | pnpm |
| `package-lock.json` | npm |
| `yarn.lock` | yarn |
| `bun.lockb` | bun |

### Parallel Discovery

When sub-agents are available, the skill spawns parallel discovery agents to analyze different parts of the codebase simultaneously:

- **Agent A** — Entry points and public API
- **Agent B** — Dependencies and configuration
- **Agent C** — Examples and usage patterns
- **Agent D** — Documentation context

This cuts analysis time on codebases with files spread across directories. When sub-agents are unavailable, discovery runs inline in the same systematic order.

### External Findings Support

The skill accepts a `findings:` list from the invoking prompt — factual statements about changes already known to be true. It merges these external findings with codebase gap analysis before presenting the combined update plan.

Example:
```
findings:
- The skill now depends on accelint-english-manager by exact name for the final prose-polish step.
- The references folder contains behavior details that the README should surface more clearly.
```

This lets upstream workflows (like OpenSpec change implementation) pass change-specific context for README updates — capturing decisions about features or configuration that haven't yet shown up in exported APIs.

## README Strategy

The skill does not force the same README shape onto every repo.

- **Library/package README**: focuses on install steps, public API, examples, and exported behavior.
- **App/service README**: focuses on purpose, setup, commands, configuration, environment variables, and deployment or operator notes.
- **CLI README**: focuses on installation, commands, flags, examples, and input/output expectations.
- **Monorepo root README**: focuses on repo layout, top-level workflows, workspace commands, and links to package-specific docs.

When a public API section makes sense, the skill follows a consistent order:

1. Heading Area
2. Table of Contents (if > 200 lines)
3. Installation
4. Quick Start
5. What
6. Why
7. API
8. Examples
9. Further Reading (optional)
10. License
11. Architecture & Development Guides (optional, only when related docs exist)
12. Contributing (optional)

## File Structure

```
accelint-readme-writer/
├── SKILL.md              # Main skill instructions
├── AGENTS.md             # Detailed implementation guide
├── README.md             # This file
├── CHANGELOG.md          # Version history
├── evals/
│   └── evals.json        # Skill evaluation cases
└── references/
    ├── codebase-analysis.md   # How to parse code for docs
    ├── readme-structure.md    # Section ordering and content
    ├── readme-template.md     # Copy-pasteable template
    └── writing-principles.md  # Human-sounding writing guide
```

## Required Dependencies

Depends on `accelint-english-manager` for the final prose pass. README work can still be drafted without it, but the output is not final until that strict audit-and-rewrite step runs.

If the dependency is unavailable:
1. The skill will state clearly that the required final prose-polish dependency is unavailable.
2. It will provide a grounded README draft marked as **not yet prose-polished**.
3. It will tell the user to install or enable `accelint-english-manager` before treating the result as final.

## Hard Stops

The skill enforces these anti-patterns to prevent common failure modes:

- **NEVER run discovery serially when sub-agents are available** — Spawn parallel discovery agents for different parts of the codebase. Serial file-by-file scanning wastes time.
- **NEVER document non-exported internal functions** — Document only the public API accessible through package entry points. Internal helpers not re-exported from `index.ts` do not belong in the README.
- **NEVER fabricate usage examples** — Extract real examples from test files, JSDoc blocks, or `examples/` directories. Made-up examples often contain subtle errors.
- **NEVER use the wrong package manager commands** — Check for lockfiles and use the matching package manager in all commands. Wrong commands break the user's first experience.
- **NEVER skip comparing code to the existing README** — When updating documentation, identify what is missing, what is stale, and what signature changes occurred. Silent drift causes frustration.
- **NEVER write robotic, AI-sounding text** — Use `accelint-english-manager` in strict audit+rewrite mode to remove inflated language, promotional tone, and AI writing patterns.

## Architecture & Development Guides

For deeper technical and behavioral context:

- **[AGENTS.md](./AGENTS.md)** — Agent workflow summary and detailed implementation guidance
- **[ARCHITECTURE.md](../../ARCHITECTURE.md)** — Repository architecture and system overview
- **[references/](./references/)** — Detailed README structure, codebase analysis, templates, and writing guidance

These documents form a layered guidance system: ARCHITECTURE.md explains how the repository is structured, AGENTS.md governs how agents work in this skill folder, and references/ provides detailed implementation patterns.

## For Humans

While this skill is designed for AI agents, humans can use the references for:

- Understanding good README structure
- Learning documentation best practices
- Creating templates for team standardization
- Reviewing AI-generated documentation

## License

Apache-2.0 - see [LICENSE](../../LICENSE) for details.