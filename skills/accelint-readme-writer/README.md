# README Writer

A skill for creating and maintaining comprehensive, human-friendly README documentation that stays in sync with your actual codebase.

## Overview

This skill helps AI agents create thorough README documentation by:

- Recursively analyzing codebases from the README's location
- Identifying public API and extracting type signatures
- Comparing existing documentation against actual code
- Generating human-sounding documentation with practical examples
- Supporting monorepos by scoping analysis to package boundaries

## Quick Start

This skill activates automatically when you ask to create or update a README:

```
"Create a README for this package"
"Update the README to reflect the new API"
"Document packages/my-lib"
```

The skill will analyze your codebase and either generate a new README or suggest updates to an existing one.

## What This Skill Does

1. **Scopes the README correctly** - Starts from the README location and documents that package, app, service, CLI, or monorepo root rather than wandering the whole repo.
2. **Analyzes the real surface area** - For libraries, that means exports and examples. For apps and services, that means commands, setup, configuration, and operator-facing workflows.
3. **Identifies drift** - Finds missing coverage, stale examples, wrong commands, and mismatches between current behavior and the existing README.
4. **Generates grounded docs** - Produces practical, copy-pasteable README content tied to the actual repo.
5. **Maintains consistency** - Reuses nearby docs such as AGENTS.md, ARCHITECTURE.md, or OpenSpec config when they exist and are relevant.

## Why This Skill Exists

README files often become outdated as code evolves. This skill ensures:

- Documentation stays accurate without manual tracking
- New exports get documented automatically
- Removed functionality gets flagged for doc cleanup
- Examples stay current with API changes

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

### Human-Sounding Writing

Generated documentation reads like it was written by someone who genuinely wants to help, not a robot.

### Thorough by Default

When in doubt, the skill includes more detail. Every command is copy-pasteable, examples show expected output, and explanations cover the "why" not just the "what."

## README Strategy

The skill does not force the same README shape onto every repo.

- **Library/package README**: focuses on install steps, public API, examples, and exported behavior.
- **App/service README**: focuses on purpose, setup, commands, configuration, environment variables, and deployment or operator notes.
- **CLI README**: focuses on installation, commands, flags, examples, and input/output expectations.
- **Monorepo root README**: focuses on repo layout, top-level workflows, workspace commands, and links to package-specific docs.

When a public API section makes sense, the skill follows a consistent order:

1. **Heading Area** - Title, banner, badges
2. **Installation** - How to install
3. **Quick Start** - Minimal working example
4. **What** - What the package is
5. **Why** - Why it exists
6. **API** - Public API reference
7. **Examples** - Practical usage
8. **Further Reading** (optional)
9. **License**
10. **Architecture & Development Guides** (optional, only when related docs exist)
11. **Contributing** (optional)

## File Structure

```
accelint-readme-writer/
├── SKILL.md              # Main skill instructions
├── AGENTS.md             # Detailed implementation guide
├── README.md             # This file
└── references/
    ├── codebase-analysis.md   # How to parse code for docs
    ├── readme-structure.md    # Section ordering and content
    ├── readme-template.md     # Copy-pasteable template
    └── writing-principles.md  # Human-sounding writing guide
```

## Required Prose Polish

This workflow depends on `accelint-english-manager` for the final prose pass. The README work can still be drafted without it, but the output should not be treated as final until that strict audit-and-rewrite step runs.

## Architecture & Development Guides

This skill folder currently includes:

- [`AGENTS.md`](./AGENTS.md) for the agent-facing workflow summary
- [`references/`](./references/) for detailed README structure, codebase analysis, templates, and writing guidance
- [`CHANGELOG.md`](./CHANGELOG.md) for versioned changes to the skill

Add this section to generated READMEs only when related docs actually exist for the target package or repo.

## For Humans

While this skill is designed for AI agents, humans can use the references for:

- Understanding good README structure
- Learning documentation best practices
- Creating templates for team standardization
- Reviewing AI-generated documentation
