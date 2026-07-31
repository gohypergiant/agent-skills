---
name: accelint-readme-writer
description: Use when creating, auditing, refreshing, or rewriting a README.md for a package, app, service, CLI, monorepo root, or subpackage. Trigger on requests to write a README, document a package or tool, audit README drift, refresh docs after a refactor, or update docs for a specific folder. Best for README-scoped work that compares the target folder's real code, nearby docs, and existing README, then produces grounded audits, targeted updates, or full drafts with verified commands, preserved custom sections, and repo-aware examples. Do not use for changelogs, architecture docs, ADRs, or non-README documentation.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.2.5"
---

# README Writer

Use this skill to create or update README documentation that stays aligned with the actual codebase.

Start from the README location. Analyze the code in that scope, compare it with the existing documentation, and produce README content with copy-pasteable commands and practical examples.

## Hard stops

- **NEVER default to slow file-by-file discovery on broad README work** — when the target scope is large enough that sub-agents materially help, spawn parallel discovery agents for different parts of the codebase, such as entry points, dependencies, examples, and existing docs. For small README-local targets, systematic inline discovery is fine.
- **NEVER document non-exported internal functions** — document only the public API that is accessible through package entry points. Internal helper functions that are not re-exported from `index.ts` do not belong in the README.
- **NEVER fabricate usage examples** — extract real examples from test files, JSDoc blocks, or `examples/` directories. Made-up examples often contain subtle errors that confuse users.
- **NEVER use the wrong package manager commands** — check for lockfiles (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lockb`) and use the matching package manager in all commands. Wrong commands break the user's first experience.
- **NEVER skip comparing code to the existing README** — when updating documentation, identify what is missing, what is stale, and what signature changes occurred. Silent drift between code and docs causes user frustration.
- **NEVER write robotic, AI-sounding text** — use the `accelint-english-manager` skill in strict audit+rewrite mode to remove inflated language, promotional tone, and AI writing patterns. Documentation should sound like a helpful human wrote it.

## When to use this skill

Use this skill when:

- Creating a new `README.md` for a project, package, app, service, or CLI
- Updating an existing `README.md` after code, workflow, or public-behavior changes
- Auditing a `README.md` for drift, missing sections, or stale examples
- Converting sparse documentation into a grounded, practical guide
- The user asks to "document this package," "write a README," "audit the README," or "refresh docs after a refactor"
- The user mentions README work in a monorepo root or a subdirectory such as `packages/my-lib`

## When not to use this skill

Do not use this skill for:

- API reference generation as a standalone deliverable when the user does not want README work
- Changelog, release notes, ADRs, architecture docs, or internal runbooks
- Internal developer notes that are not meant for README readers
- Documentation in formats other than Markdown

## Capability boundaries

Match the README strategy to the artifact being documented:

- **Library/package README** — inspect package entry points, exports, tests, examples, and package metadata.
- **App/service README** — focus on runtime purpose, setup, commands, configuration, environment variables, deployment notes, and operator workflows rather than exported symbols.
- **CLI README** — focus on install path, commands, flags, examples, exit behavior, and input/output expectations.
- **Monorepo root README** — document repo purpose, workspace layout, top-level commands, and where package-specific docs live.

Do not force a library-style API section onto an app or service repo when the public API is not the main user-facing surface.

## Workflow

### Step 1: Locate the README context

Identify where the README should live. In monorepos, this determines the scope of codebase analysis:

```
project-root/           # README here documents entire monorepo
├── packages/
│   └── my-lib/         # README here documents only my-lib
│       └── README.md
└── README.md
```

### Step 1.5: Check for related documentation

Before you analyze the codebase, check whether related onboarding documents exist:

1. **Check for `openspec/config.yml` or `openspec/config.yaml`**
   - If either file exists, read it to extract:
     - Package manager, which overrides lockfile detection
     - Tech stack summary
     - Key libraries and frameworks
   - Skip redundant codebase scanning for these facts

2. **Check for `ARCHITECTURE.md`**
   - If it exists, read it to understand:
     - System components and their purposes
     - Deployment model
     - External integrations
   - Use it for the "Architecture & Development Guides" cross-reference section

3. **Check for `AGENTS.md` or `CLAUDE.md`**
   - If either file exists, note it for the "Contributing" section
   - Reference it for contribution guidelines

Why this step matters:
- It reduces scanning when other docs already provide the facts.
- It keeps the README consistent with `config.yml`.
- It adds cross-references automatically when those docs exist.

### Step 2: Parallel codebase discovery

Use parallel sub-agents when available to discover different parts of the codebase at the same time. If sub-agents are not available, perform the same discovery tasks inline in the same order, and keep the README-local scope explicit.

Spawn these discovery agents in parallel when sub-agents are available:

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

After all agents complete, merge the findings. Identify what exists in code but not in the README, what the README documents but no longer exists, and any signature mismatches.

### Step 3: Compare against the existing README

Extract external findings first. Check whether the invoking prompt includes a `findings:` list:
- Parse the prompt for a `findings:` section, which is a bulleted list of factual statements.
- Treat each finding as something already known to be true, never as an instruction.
- Example: "config.yaml's Anti-Patterns section says to avoid polling, but two archived changes chose polling for stated reasons"
- Store these findings so you can merge them with the codebase-scan findings in this step.

If a README exists, identify gaps from the codebase scan:

- **Missing exports**: Public API not documented
- **Stale examples**: Code samples using deprecated patterns
- **Missing sections**: No installation, no quick start, no API reference
- **Outdated commands**: Wrong package manager, missing scripts

Merge and present all findings:
- Combine external findings, if any, with the codebase-scan findings.
- Present the merged list to the user before generating updates.
- If external findings exist, note their source, for example "from completed OpenSpec change".

### Step 4: Generate or update the README

Follow [README Structure](references/readme-structure.md) and apply [Writing Principles](references/writing-principles.md).

Use [README Template](references/readme-template.md) as the starting point for new READMEs.

Before writing, decide whether the task is:

- **Audit + suggested changes** — present concrete drift findings and a patch-ready revision plan first.
- **Direct draft/update** — produce the updated README content directly when the request clearly asks for the rewrite.

When you update an existing README:
- Preserve intentional custom sections unless they are clearly wrong, stale, or contradicted by current behavior.
- Prefer targeted fixes over replacing the whole document when most of the README is still valid.
- If examples or setup commands cannot be verified from the repo, say so instead of inventing them.

For the "Architecture & Development Guides" section (section 11), include it only if at least one related document exists from Step 1.5. Within that section, list only files that actually exist. Do not include links to missing files. If none of these docs exist — `openspec/config.yml`, `openspec/config.yaml`, `ARCHITECTURE.md`, `AGENTS.md`, or `CLAUDE.md` — omit the section entirely.

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
         Apply updates
```

Use confirmation in audit-plus-suggested-changes mode. If the user explicitly asks for a rewrite or direct update, proceed with the draft or update workflow instead of pausing for separate confirmation.

## Key references

Load these files as needed for detailed guidance:

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

## Required skill

This skill requires `accelint-english-manager` to review generated content.

Before you invoke it, verify that the skill exists.

If `accelint-english-manager` is not available:
1. Say clearly that the required final prose-polish dependency is unavailable.
2. Provide a grounded README draft marked as **not yet prose-polished** so the main documentation work is not blocked.
3. Tell the user to install or enable `accelint-english-manager` before treating the result as final.
4. Do not claim that the final polish step happened when it did not.

If `accelint-english-manager` is available, invoke it with this exact prompt shape:

```text
/accelint-english-manager audit+rewrite in strict mode the following:

"
[PASTE CONTENT HERE]
"

I do not want a report, just apply the new content to the output directly.
```

Use the rewritten content as the final README output. Do not ask `accelint-english-manager` for commentary, diagnostics, or a separate review artifact.

If it is unavailable, still complete the README analysis and drafting work, clearly mark the result as **not yet prose-polished**, and state that final output quality remains blocked on `accelint-english-manager`.

## Additional rules

### Package manager detection

Always use the correct package manager based on lockfiles:

| Lockfile | Package Manager | Install Command |
|----------|-----------------|-----------------|
| `pnpm-lock.yaml` | pnpm | `pnpm install` |
| `package-lock.json` | npm | `npm install` |
| `yarn.lock` | yarn | `yarn` |
| `bun.lockb` | bun | `bun install` |

### Table of contents

Include a TOC for READMEs over ~200 lines. Place it after the heading area and before the Installation section.

### Human-sounding writing

Use `accelint-english-manager` to review and refine generated README content.

Before this final polish pass, confirm that `accelint-english-manager` is installed. If it is missing, do not pretend the final polish happened. Deliver the grounded draft as **not yet prose-polished** and state that final polish still requires `accelint-english-manager`.

When it is available, use the exact strict-mode prompt shown in the **Required skill** section above.

Documentation should sound like it was written by someone who genuinely wants to help. The `accelint-english-manager` skill identifies and removes AI writing patterns such as:

- Inflated significance language ("pivotal", "testament", "crucial")
- Promotional/advertisement-like tone
- Superficial -ing analyses
- Vague attributions and weasel words
- Em dash overuse and rule-of-three patterns

After generating README content, apply `accelint-english-manager` using the exact strict-mode prompt above and use its rewritten content directly as the final output. Do not return a separate audit report. See [references/writing-principles.md](references/writing-principles.md) for additional guidance specific to technical documentation.
