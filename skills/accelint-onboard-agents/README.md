# accelint-onboard-agents

Generate `AGENTS.md` or `CLAUDE.md` for your repository through a structured interview. These files tell AI coding agents how to behave: workflow steps, communication style, decision rules, and guardrails.

## What it does

This skill runs a conversational interview covering agent role, communication preferences, workflow procedures, and guardrails. Before asking questions, it tries to infer behavior from your codebase—commit conventions from `commitlint.config.ts`, pre-commit checks from Husky hooks, and so on.

It supports three modes:
- **Create** — generate a new file from scratch
- **Import** — restructure existing content that doesn't match the template
- **Refresh** — update a file that already matches the expected structure

The output is behavior only. Stack details, architecture patterns, and coding standards belong in `openspec/config.yaml`, not here.

## When to use it

Use this skill to set up agent instructions for a new project, refresh behavior rules after workflow changes, or create package-specific overrides in a monorepo.

Trigger phrases: "create AGENTS.md", "set up agent rules", "configure Claude Code", "onboard agent"

Use this skill when the goal is to define agent behavior. If the real need is to document project facts, stack rules, or architecture patterns, use `accelint-onboard-openspec` or `accelint-architecture-doc` instead.

## How it works

**Phase 0: File state detection**

The skill checks whether the current directory is a monorepo package. If a root-level `AGENTS.md` exists above the current directory, it reads that file to avoid duplicating global instructions. It then checks for related onboarding documents like `openspec/config.yml`, `openspec/config.yaml`, `ARCHITECTURE.md`, and existing `AGENTS.md` or `CLAUDE.md` files. Finally, it picks the correct mode: Create, Import, or Refresh.

**Phase 1: Discovery interview**

The skill asks about agent role, communication style, workflow procedures, decision heuristics, tool preferences, and guardrails.

**Phase 2: Smart defaults**

After each answer, the skill suggests related conventions based on what it found. For example, if you mention Turborepo + pnpm, it confirms whether to use `pnpm -w` for root dependencies and `pnpm --filter` for package-scoped dependencies. If it finds `commitlint.config.ts`, it asks which commit types you use beyond the standard set.

**Phase 3: Parallel codebase discovery**

For gaps the interview doesn't fill, the skill spawns five agents in parallel to inspect config files:

- Version control and commit conventions (`commitlint`, `git log`, branch protection)
- CI/CD and pre-commit workflows (GitHub Actions, Husky, lefthook)
- Testing and code quality (`vitest`, `jest`, `pytest`, package manager lockfiles)
- Security and migrations (migration directories, `.env.example`, `.gitignore` patterns)
- OpenSpec integration (`openspec/` directory, config files)

Parallel discovery is intentional. It cuts turnaround time on repositories where relevant config files are spread across many directories.

**Phase 4: Preview and write**

The skill shows the complete file with source comments on inferred values:

```markdown
- Always run `pnpm check` before committing   # inferred from .husky/pre-commit
- Use Conventional Commits (`feat:`, `fix:`)  # inferred from commitlint.config.ts
```

After you confirm, it writes the file without the source comments. The generated file includes a Related Documentation section that cross-references onboarding files found in Phase 0 (`openspec/config.yml`, `openspec/config.yaml`, `ARCHITECTURE.md`, `README.md`). It includes only links to files that actually exist.

## AGENTS.md structure

The generated file has these sections:

```markdown
# Agent Behavior

## Role & Identity
[one-sentence role definition and scope]

## Communication
[response style, code change format, uncertainty handling]

## Workflow Procedures
[feature development, bug fixes, pre-commit checklist, commit conventions, PR rules, versioning]

## Decision Heuristics
[table of situations and default actions]

## Tool Preferences
[package manager, test runner, linter, task runner]

## Guardrails
[never rules, always-ask-first rules, security-sensitive areas]
```

Each section is filled from interview answers or codebase inference. If neither source can resolve a field, the skill marks it with `<!-- TODO: fill in -->`.

## Separation of concerns

Behavior goes in AGENTS.md. Project facts go in openspec/config.yaml:

| AGENTS.md (behavior) | openspec/config.yaml (project DNA) |
|----------------------|-----------------------------------|
| "Always run `pnpm check` before committing" | "Package manager: pnpm" |
| "Use Conventional Commits" | "TypeScript 5.x, strict mode" |
| "Ask before deleting files" | "Monorepo: Turborepo + pnpm" |
| "You are a senior TS engineer" | "`type` over `interface`" |

If you mix agent behavior with project facts in the same file, every agent invocation spends context on information that belongs elsewhere.

## Monorepo behavior

When you run this inside a monorepo package, the skill checks for a root-level AGENTS.md. If found, it reads that file and only asks about package-specific differences. The generated file references the root instead of repeating global rules:

```markdown
<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->
```

This keeps package files short and avoids loading duplicate instructions.

## What it avoids

This skill avoids these common mistakes:

- Running codebase discovery one file at a time instead of using parallel agents
- Asking questions before checking config files
- Silently omitting sections instead of marking gaps with `<!-- TODO: fill in -->`
- Repeating root-level instructions in package files instead of referencing them
- Writing the final file without showing a preview first

## Installation

**npm:**
```bash
npx skills add gohypergiant/agent-skills --skill accelint-onboard-agents
```

**pnpm:**
```bash
pnpm dlx skills add gohypergiant/agent-skills --skill accelint-onboard-agents
```

## Usage

```
/accelint-onboard-agents
```

Or just say "Help me set up AGENTS.md for this project".

## Example output

For a TypeScript monorepo with Turborepo, pnpm, Conventional Commits, and Husky pre-commit hooks, the skill generates:

```markdown
# Agent Behavior

## Role & Identity
You are a senior TypeScript engineer working across the @accelint/* monorepo.

## Communication
- **Response style**: Concise for simple tasks, detailed for complex work
- **Code changes**: Show diffs separately from explanations
- **Uncertainty**: Always ask before proceeding
- **Reasoning**: Explain reasoning before taking action

## Workflow Procedures

### Pre-Commit Checklist
- [ ] `pnpm typecheck`                    # inferred from .husky/pre-commit
- [ ] `pnpm lint`                         # inferred from package.json scripts
- [ ] `pnpm test`                         # inferred from package.json scripts

### Commit Messages
Convention: Conventional Commits          # inferred from commitlint.config.ts
Format: `[type]([scope]): [description]`
Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`
Example: `feat(layer): add WebGPU fallback for Safari`

## Tool Preferences
- **Package manager**: always use `pnpm`  # inferred from pnpm-lock.yaml
- **Test runner**: `vitest`               # inferred from vitest.config.ts
- **Task runner**: `pnpm turbo run <task> --filter=<pkg>`

## Guardrails
### Never
- [ ] Never force-push to any branch       # inferred from branch protection
- [ ] Never commit secrets or credentials
- [ ] Never use `any` in TypeScript

## Related Documentation
- **openspec/config.yaml** — Project DNA: stack facts, coding patterns, domain concepts
- **ARCHITECTURE.md** — System architecture, deployment overview, component interactions
- **README.md** — Installation, quick start, usage guide for developers
```

## Version history

See [CHANGELOG.md](CHANGELOG.md) for details.

Current version: 1.4.1

Changes in 1.4.1:
- Clarified related-document detection for both `openspec/config.yml` and `openspec/config.yaml`
- Added a quality checklist for reviewing generated onboarding files before writing
- Corrected README version history to match the published skill metadata

## Related skills

- `accelint-onboard-openspec` — generates `openspec/config.yaml` for architecture and coding standards
- `accelint-architecture-doc` — creates architecture documentation

Use this skill when you want the full structured interview for agent behavior guidance.
