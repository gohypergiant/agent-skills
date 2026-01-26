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

1. **Analyzes your code** - Parses exports, types, and function signatures
2. **Identifies gaps** - Finds undocumented exports and stale documentation
3. **Generates docs** - Creates thorough, copy-pasteable documentation
4. **Maintains consistency** - Ensures docs match actual functionality

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

## README Structure

The skill follows a consistent structure:

1. **Heading Area** - Title, banner, badges
2. **Installation** - How to install
3. **Quick Start** - Minimal working example
4. **What** - What the package is
5. **Why** - Why it exists
6. **API** - Public API reference
7. **Examples** - Practical usage
8. **Further Reading** (optional)
9. **License**
10. **Contributing** (optional)

## File Structure

```
readme-writer/
├── SKILL.md              # Main skill instructions
├── AGENTS.md             # Detailed implementation guide
├── README.md             # This file
└── references/
    ├── codebase-analysis.md   # How to parse code for docs
    ├── readme-structure.md    # Section ordering and content
    ├── readme-template.md     # Copy-pasteable template
    └── writing-principles.md  # Human-sounding writing guide
```

## For Humans

While this skill is designed for AI agents, humans can use the references for:

- Understanding good README structure
- Learning documentation best practices
- Creating templates for team standardization
- Reviewing AI-generated documentation
