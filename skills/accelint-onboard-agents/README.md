# accelint-onboard-agents

Generates `AGENTS.md` or `CLAUDE.md` files through an interactive interview. These files tell AI coding agents how to behave in your project — workflow conventions, communication style, decision-making rules.

## What it does

The skill runs a conversational interview covering agent behavior, communication preferences, workflow procedures, and guardrails. It tries to infer answers from your codebase (commit conventions from commitlint.config.ts, pre-commit checks from Husky hooks) before asking questions.

Three modes:
- Create — New file from scratch
- Import — Work with existing content that does not match the template through restructure, append, or dry-run paths
- Refresh — Update a file that matches the expected structure through targeted refresh or full refresh paths

The output is the agent behavior layer only. Project DNA, system structure, constraints, assumptions, and internal terminology belong in canonical companion documents such as `openspec/config.yml`, `openspec/config.yaml`, `ARCHITECTURE.md`, `CONSTRAINTS.md`, `EPISTEMIC-MAP.md`, and `JARGON.md`, not in `AGENTS.md` or `CLAUDE.md`.

## When to use it

Run this skill to set up agent instructions for a new project, update rules after workflow changes, or create package-specific overrides in a monorepo.

Trigger phrases: "create AGENTS.md", "set up agent rules", "configure claude code", "onboard agent"

## How it works

**Step 1: File state detection**

First checks whether the current directory is a monorepo package. If a root-level `AGENTS.md` or `CLAUDE.md` exists above the current directory, it reads that file to avoid duplicating global instructions. Then it checks for canonical companion documents such as `openspec/config.yml`, `openspec/config.yaml`, `ARCHITECTURE.md`, `CONSTRAINTS.md`, `EPISTEMIC-MAP.md`, and `JARGON.md` so it can keep the behavior-layer boundary intact and populate `## Related Documentation` correctly. Only after those checks does it assess the local `AGENTS.md` or `CLAUDE.md` state and classify the path as Create, Import, or Refresh.

For Import and Refresh, it asks an intent gate before any deeper discovery: start fresh, or work with what is already there.

**Step 2: Mode selection**

Runs exactly one mode:

- Create — full interview, smart defaults, parallel discovery, preview, and write
- Import — restructure, append, or dry-run path for existing non-template content
- Refresh — targeted refresh for one bounded update, or full refresh when drift is broader

**Step 3: Mode-specific discovery and interview**

Runs a conversational interview only after mode selection is complete. Questions map directly to the canonical sections in `./assets/template.md`, and the skill asks only for information that belongs in that template. It keeps the interview proportional to the request and confirms inferred workflow constraints instead of asking the same question twice.

**Smart defaults**

After the relevant template fields are gathered or strongly inferred, the skill offers repository-shaped defaults as confirmation prompts. If you mentioned Turborepo + PNPM, it confirms whether to use `pnpm -w` for root deps and `pnpm --filter` for packages. If it sees `commitlint.config.ts`, it asks which commit types you use beyond the standard set.

**Step 4: Parallel codebase discovery**

For canonical template sections or required fields that still have behavioral gaps after the interview, the skill spawns five agents in parallel to scan config files:

- Version control & commit conventions (`commitlint`, `git log`, branch protection)
- CI/CD & pre-commit workflows (GitHub Actions, Husky, lefthook)
- Testing & code quality (Vitest/Jest/Pytest, package manager lockfiles)
- Security & migrations (migration directories, `.env.example`, `.gitignore` patterns)
- OpenSpec & development workflow (`openspec/` directory, config files, `/opsx:*` usage)

Running these in parallel instead of serially cuts discovery time on repos with scattered config files.

**Step 5: Preview and write**

Before any write, the skill runs a mandatory editorial pass to deduplicate overlapping guidance, resolve contradictions through source precedence, and remove handbook-style material that does not directly govern agent behavior. Then it shows the complete file with source comments on inferred values:

```markdown
- Always run `pnpm check` before committing   # inferred from .husky/pre-commit
- Use Conventional Commits (`feat:`, `fix:`)  # inferred from commitlint.config.ts
```

After you confirm, it writes the file without the source comments. The generated file includes a `## Related Documentation` section that references only canonical documents that actually exist and materially help agent behavior.

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
npx skills add https://github.com/accelint/agent-skills --skill accelint-onboard-agents
```

## Usage

```
/accelint-onboard-agents
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

## Related Documentation
- **openspec/config.yaml** — Project DNA: stack facts, coding patterns, domain concepts
- **ARCHITECTURE.md** — System architecture, deployment overview, component interactions
- **README.md** — Installation, quick start, usage guide for developers
```

## Version history

See [CHANGELOG.md](CHANGELOG.md) for details.

Current version: 1.6.0

For the complete version history, see [CHANGELOG.md](CHANGELOG.md).

## Related skills

- `accelint-onboard-openspec` — Generates openspec/config.yaml for architecture and coding standards
- `accelint-architecture-doc` — Creates architecture documentation
- `init` — Quick CLAUDE.md setup without the interview

Use this skill when you want the full structured interview. Use `init` when you just need something basic.
