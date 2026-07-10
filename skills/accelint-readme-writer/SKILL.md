---
name: accelint-readme-writer
description: Use when creating or editing a README.md file in any project or package. Recursively parses codebase from README location, suggests changes based on missing or changed functionality, and generates thorough, human-sounding documentation with copy-pasteable code blocks and practical examples.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.2.0"
---

# README Writer

This skill guides the creation and maintenance of comprehensive, human-friendly README documentation by analyzing the codebase and ensuring documentation stays in sync with actual functionality.

## NEVER Do When Writing READMEs

- **NEVER run discovery serially when sub-agents are available** — spawn parallel discovery agents for different aspects (entry points, dependencies, examples, existing docs) to analyze the codebase efficiently. Serial file-by-file scanning wastes time.
- **NEVER document non-exported internal functions** — only document the public API that's accessible through package entry points. Internal helper functions that aren't re-exported from `index.ts` don't belong in the README.
- **NEVER fabricate usage examples** — extract real examples from test files, JSDoc blocks, or `examples/` directories. Made-up examples often contain subtle errors that confuse users.
- **NEVER use the wrong package manager commands** — check for lockfiles (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lockb`) and use the matching package manager in all commands. Wrong commands break the user's first experience.
- **NEVER skip comparing code to existing README** — when updating documentation, identify what's missing, what's stale, and what signature changes occurred. Silent drift between code and docs causes user frustration.
- **NEVER write robotic, AI-sounding text** — use the humanizer skill to remove inflated language, promotional tone, and AI writing patterns. Documentation should sound like a helpful human wrote it.

## When to Activate This Skill

Use this skill when:

- Creating a new README.md for a project or package
- Updating an existing README.md after code changes
- Auditing documentation for completeness and accuracy
- Converting sparse documentation into thorough guides
- User asks to "document this package" or "write a README"
- User mentions README in context of a monorepo subdirectory

## When NOT to Use This Skill

Do not activate for:

- API documentation generation (use JSDoc/TSDoc tools)
- Changelog or release notes
- Internal developer notes not meant for README
- Documentation in formats other than Markdown

## How to Use

### Step 1: Locate the README Context

Identify where the README should live. In monorepos, this determines the scope of codebase analysis:

```
project-root/           # README here documents entire monorepo
├── packages/
│   └── my-lib/         # README here documents only my-lib
│       └── README.md
└── README.md
```

### Step 1.5: Check for Related Documentation

Before analyzing the codebase, check if other onboarding documents exist:

1. **Check for openspec/config.yml or openspec/config.yaml**
   - If exists: Read it to extract:
     - Package manager (use this instead of lockfile detection)
     - Tech stack summary
     - Key libraries and frameworks
   - Skip redundant codebase scanning for these facts

2. **Check for ARCHITECTURE.md**
   - If exists: Read it to understand:
     - System components and their purposes
     - Deployment model
     - External integrations
   - Use for "Architecture & Development Guides" cross-reference section

3. **Check for AGENTS.md or CLAUDE.md**
   - If exists: Note for "Contributing" section
   - Reference it for contribution guidelines

**Benefits:**
- Reduces scanning when other docs exist
- Ensures consistency (README uses same package manager as config.yml)
- Creates proper cross-references automatically

### Step 2: Parallel Codebase Discovery

**Use parallel sub-agents when available** to discover different aspects of the codebase simultaneously. If sub-agents are not available, perform these discovery tasks inline but in the same systematic order.

Spawn these discovery agents in parallel (if sub-agents available):

**Agent A — Entry Points & Public API**
- Check `package.json` for `main`, `module`, `types`, `exports` fields
- Read the main entry point file (e.g., `src/index.ts`)
- Trace all re-exports to map the complete public API
- List all exported functions, classes, types, constants with signatures
- Return: entry point paths, complete export list with types

**Agent B — Dependencies & Configuration**
- Read `package.json` for dependencies, devDependencies, peerDependencies, scripts
- Check lockfile type (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lockb`)
- Look for configuration files: `tsconfig.json`, `.eslintrc*`, `vitest.config.*`, etc.
- Return: dependency list (separate runtime vs peer), available scripts, package manager, configs found

**Agent C — Examples & Usage Patterns**
- Search for `examples/` or `__examples__/` directory
- Read test files (`*.test.ts`, `*.spec.ts`) for usage patterns
- Extract JSDoc `@example` blocks from source files
- Look for inline comments showing usage
- Return: example file paths, extracted usage patterns from tests, JSDoc examples

**Agent D — Documentation Context** *(optional, runs concurrently)*
- Check for existing README.md
- Look for CHANGELOG.md, CONTRIBUTING.md, LICENSE
- Check for TypeDoc/JSDoc configuration
- Return: existing doc files and their key sections

**After all agents complete:** merge findings and identify documentation gaps (what exists in code but not in README, what's documented but doesn't exist, signature mismatches)

### Step 3: Compare Against Existing README

**Extract external findings first** — check if the invoking prompt includes a `findings:` list:
- Parse the prompt for a `findings:` section (a bulleted list of factual statements)
- Each finding is phrased as something already known to be true, never as an instruction
- Example: "config.yaml's Anti-Patterns section says to avoid polling, but two archived changes chose polling for stated reasons"
- Store these findings for merging with codebase scan findings below

If a README exists, identify gaps from codebase scan:

- **Missing exports**: Public API not documented
- **Stale examples**: Code samples using deprecated patterns
- **Missing sections**: No installation, no quick start, no API reference
- **Outdated commands**: Wrong package manager, missing scripts

**Merge and present all findings**:
- Combine external findings (if any) with codebase scan findings
- Present the merged list to the user before generating updates
- If external findings exist, note their source (e.g., "from completed OpenSpec change")

### Step 4: Generate or Update README

Follow the [README Structure](references/readme-structure.md) and apply [Writing Principles](references/writing-principles.md).

Use the [README Template](references/readme-template.md) as a starting point for new READMEs.

**For the Architecture & Development Guides section (section 11):** only include it if at least one of the related docs exists (checked in Step 1.5). Within the section, only list files that actually exist — do not include links to missing files. If none of the three docs exist (openspec/config.yml, ARCHITECTURE.md, AGENTS.md/CLAUDE.md), omit this section entirely.

## README Workflow Decision Tree

```
Start
  ↓
Does README.md exist?
  ├─ No → Analyze codebase → Generate from template
  └─ Yes → Analyze codebase → Compare with existing
             ↓
         Identify gaps and staleness
             ↓
         Suggest specific changes
             ↓
         Apply updates (with user confirmation)
```

## Key References

Load these as needed for detailed guidance:

- [references/readme-structure.md](references/readme-structure.md) - Section ordering and content requirements
- [references/writing-principles.md](references/writing-principles.md) - How to write human-sounding, thorough docs
- [references/codebase-analysis.md](references/codebase-analysis.md) - How to parse and understand code for documentation
- [references/readme-template.md](references/readme-template.md) - Copy-pasteable template for new READMEs

## Example Trigger Phrases

- "Create a README for this package"
- "Update the README to reflect recent changes"
- "The README is out of date, can you fix it?"
- "Document this library"
- "Write docs for packages/my-lib"
- "This package needs better documentation"

## Required Skills

This skill requires the `humanizer` skill for reviewing generated content.

If `humanizer` is not available:
1. Check Settings > Capabilities to enable it
2. Or invoke it with `/skill humanizer`

The humanizer skill removes AI writing patterns and ensures documentation sounds natural. Without it, generated READMEs may contain robotic language, inflated significance claims, and other AI artifacts.

## Important Notes

### Package Manager Detection

Always use the correct package manager based on lockfiles:

| Lockfile | Package Manager | Install Command |
|----------|-----------------|-----------------|
| `pnpm-lock.yaml` | pnpm | `pnpm install` |
| `package-lock.json` | npm | `npm install` |
| `yarn.lock` | yarn | `yarn` |
| `bun.lockb` | bun | `bun install` |

### Table of Contents

Include a TOC for READMEs over ~200 lines. Place it after the heading area, before the Installation section.

### Human-Sounding Writing

**REQUIRED SUB-SKILL:** Use `humanizer` to review and refine generated README content.

Documentation should sound like it was written by someone who genuinely wants to help. The humanizer skill identifies and removes AI writing patterns including:

- Inflated significance language ("pivotal", "testament", "crucial")
- Promotional/advertisement-like tone
- Superficial -ing analyses
- Vague attributions and weasel words
- Em dash overuse and rule-of-three patterns

After generating README content, apply the humanizer skill to ensure the output sounds natural and human-written. See [references/writing-principles.md](references/writing-principles.md) for additional guidance specific to technical documentation.
