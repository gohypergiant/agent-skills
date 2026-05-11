# accelint-onboard-agent

Generates `AGENTS.md` or `CLAUDE.md` files through an interactive interview. These files tell AI coding agents how to behave in your project — workflow conventions, communication style, decision-making rules.

## What it does

The skill runs a conversational interview covering agent role, communication preferences, workflow procedures, and guardrails. It tries to infer answers from your codebase (commit conventions from commitlint.config.ts, pre-commit checks from Husky hooks) before asking questions.

Three modes:
- Create — New file from scratch
- Import — Restructure existing content that doesn't match the template
- Refresh — Update a file that matches the expected structure

The output is *behavior* only. Stack details, architecture patterns, and coding standards belong in `openspec/config.yaml`, not here.

## When to use it

Run this skill to set up agent instructions for a new project, update rules after workflow changes, or create package-specific overrides in a monorepo.

Trigger phrases: "create AGENTS.md", "set up agent rules", "configure claude code", "onboard agent"

## How it works

**Phase 0: File state detection**

Checks if AGENTS.md exists and picks a mode. In monorepos, also looks for a root-level AGENTS.md to avoid duplicating global instructions.

**Phase 1: Discovery interview**

Asks about agent role, communication style, workflow procedures (feature dev, bug fixes, commit format), decision heuristics (when to ask vs. proceed), tool preferences, and guardrails.

**Phase 2: Smart defaults**

After you answer a question, the skill suggests related conventions based on what it found. If you mentioned Turborepo + PNPM, it confirms whether to use `pnpm -w` for root deps and `pnpm --filter` for packages. If it sees commitlint.config.ts, it asks which commit types you use beyond the standard set.

**Phase 3: Parallel codebase discovery**

For gaps the interview didn't fill, the skill spawns five agents in parallel to scan config files:

- Version control & commit conventions (commitlint, git log, branch protection)
- CI/CD & pre-commit workflows (GitHub Actions, Husky, lefthook)
- Testing & code quality (vitest/jest/pytest, package manager lockfiles)
- Security & migrations (migration directories, .env.example, .gitignore patterns)
- OpenSpec integration (openspec/ directory, config.yaml)

Running these in parallel instead of serially cuts discovery time on repos with scattered config files.

**Phase 4: Preview and write**

Shows you the complete file with source comments on inferred values:

```markdown
- Always run `pnpm check` before committing   # inferred from .husky/pre-commit
- Use Conventional Commits (`feat:`, `fix:`)  # inferred from commitlint.config.ts
```

After you confirm, it writes the file without the source comments.

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

Each section gets filled from interview answers, codebase inference, or marked `<!-- TODO: fill in -->` if neither source has the answer.

## Separation of concerns

Behavior goes in AGENTS.md. Project facts go in openspec/config.yaml:

| AGENTS.md (behavior) | openspec/config.yaml (project DNA) |
|----------------------|-----------------------------------|
| "Always run `pnpm check` before committing" | "Package manager: pnpm" |
| "Use Conventional Commits" | "TypeScript 5.x, strict mode" |
| "Ask before deleting files" | "Monorepo: Turborepo + PNPM" |
| "You are a senior TS engineer" | "`type` over `interface`" |

If you document both what the agent does and what the project is in the same file, you waste tokens loading project facts during every agent invocation.

## Monorepo behavior

When you run this inside a monorepo package, the skill checks for a root-level AGENTS.md. If found, it reads that file and only asks about package-specific differences. The generated file references the root instead of repeating global rules:

```markdown
<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->
```

This keeps package files short and avoids loading duplicate instructions.

## What it avoids

Common mistakes this skill doesn't make:

- Running codebase discovery one file at a time (uses parallel agents instead)
- Asking questions before checking config files (infers first, asks second)
- Silently omitting sections (marks gaps with `<!-- TODO: fill in -->`)
- Repeating root-level instructions in package files (references instead)
- Writing without showing you the output first (always previews)

## Installation

```bash
npx skills add https://github.com/accelint/agent-skills --skill accelint-onboard-agent
```

## Usage

```
/accelint-onboard-agent
```

Or just say "Help me set up AGENTS.md for this project".

## Example Output

For a TypeScript monorepo with Turborepo, PNPM, Conventional Commits, and Husky pre-commit hooks, the skill generates:

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
```

## Version history

See [CHANGELOG.md](CHANGELOG.md) for details.

Current version: 1.3.0

Changes in 1.3.0:
- Parallel codebase discovery (spawns 5 agents instead of scanning files one at a time)
- Anti-pattern section
- Monorepo inheritance detection

## Related skills

- `accelint-onboard-openspec` — Generates openspec/config.yaml for architecture and coding standards
- `accelint-architecture-doc` — Creates architecture documentation
- `init` — Quick CLAUDE.md setup without the interview

Use this skill when you want the full structured interview. Use `/init` when you just need something basic.
