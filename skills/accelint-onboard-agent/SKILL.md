---
name: accelint-onboard-agents
description: Interactively onboard a project to agent-driven development by running a structured interview and generating a complete AGENTS.md (or CLAUDE.md). Use this skill whenever a user mentions "AGENTS.md", "CLAUDE.md", "agent behavior", "agent instructions", "agent config", "set up agent rules", "onboard agent", "configure claude code", "agent guardrails", "agent workflow", or asks how to tell an AI agent how to behave in their project — even if they just say "help me write AGENTS.md" or "what should go in CLAUDE.md". Always prefer this skill over ad-hoc agent instruction generation.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.0.0"
---

# Onboard Agents

Guide the user through a conversational interview to produce a complete,
project-specific `AGENTS.md` (or `CLAUDE.md`) governing how an AI coding
agent behaves across all interactions in the project.

## Separation of Concerns

This skill produces the **behavior layer** of the agent instruction stack.
It is the companion to the `accelint-onboard-openspec` skill, which produces the
**project DNA layer** (`openspec/config.yaml`). They never duplicate each
other.

```
┌──────────────────────────────────────────────────────────────┐
│                    Agent Instruction Stack                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  AGENTS.md / CLAUDE.md   ← THIS SKILL                        │
│  ─────────────────────   (Layer 1: Agent Identity)           │
│  WHO the agent is, HOW it works, WHEN it communicates        │
│                                                              │
│  • Role definition                                           │
│  • Communication style and tone                              │
│  • Workflow procedures (PR flow, commit conventions)         │
│  • Decision-making heuristics                                │
│  • Tool usage preferences                                    │
│  • Behavioral guardrails                                     │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  openspec/config.yaml    ← accelint-onboard-openspec skill   │
│  ────────────────────    (Layer 2: Project DNA)              │
│  WHAT the project is, WHAT stack it uses, WHAT rules apply   │
│                                                              │
│  • Domain description and tech stack                         │
│  • Architectural patterns and coding standards               │
│  • Project structure and per-artifact rules                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Hard Rule: What Does NOT Belong Here

If a piece of information answers "what is the project?" rather than "how
should the agent behave?", it belongs in `config.yaml`, not here.

| Belongs in AGENTS.md              | Belongs in config.yaml            |
|-----------------------------------|-----------------------------------|
| "Always run `pnpm check` before committing" | "Package manager: pnpm"  |
| "Use Conventional Commits"        | "TypeScript 5.x, strict mode"     |
| "Ask before deleting files"       | "Monorepo: Turborepo + PNPM"      |
| "Prefer small, focused PRs"       | "`type` over `interface`"         |
| "You are a senior TS engineer"    | "Domain: geospatial visualization"|
| "Never force-push to main"        | "Testing: Vitest + @testing-library"|

---

## Phases

### Phase 0 — File State Detection

Before any interview question is asked, check whether the target file exists
and assess its state. Never silently pick a mode — always announce the
detected mode to the user and confirm before proceeding.

**Detection logic:**

```
Does AGENTS.md (or CLAUDE.md) exist?
│
├── No → MODE 1: Create
│         Full interview from scratch.
│
└── Yes → Read the file, then assess:
          │
          ├── Empty or near-blank (< ~10 meaningful lines)?
          │     → MODE 1: Create (with overwrite confirmation)
          │       Ask: "AGENTS.md exists but appears empty — should I
          │       populate it from scratch, or preserve any current content?"
          │
          ├── Contains recognised template sections?
          │   (## Role & Identity, ## Guardrails, ## Workflow Procedures, etc.)
          │     → MODE 3: Refresh
          │       Abbreviated interview covering only detected drift and
          │       unresolved <!-- TODO --> markers.
          │
          └── Contains real content in an unrecognised shape?
                → MODE 2: Import
                  Present three options (A / B / C) before proceeding.
```

**Recognised template sections** (any two or more = recognised shape):
`## Role & Identity`, `## Communication`, `## Workflow Procedures`,
`## Decision Heuristics`, `## Tool Preferences`, `## Guardrails`

---

#### Mode 1: Create

Run the full Phase 1 → Phase 2 → Phase 3 → Phase 4 interview. This is the
happy path for a fresh repo.

---

#### Mode 2: Import

The file has real content that was not generated by this skill. Present the
user with three options before touching anything:

> "This AGENTS.md has existing content with a structure I don't recognise.
> How would you like to proceed?
>
> **(a) Restructure** — I'll import your existing content, map it onto this
> skill's template sections, flag any material that belongs in
> `openspec/config.yaml` instead, run a targeted interview to fill gaps,
> and produce a merged file ready to replace the current one.
>
> **(b) Append** — I'll run the full interview and add this skill's sections
> below your existing content without modifying what's already there.
>
> **(c) Dry run** — I'll run the full interview and show you exactly what I
> would have generated, with no changes to the filesystem. Use this to
> evaluate fit before committing."

**If option (a) is chosen:**
1. Read the file in full.
2. Map each existing section onto the skill's template sections.
3. Flag any content that violates the separation-of-concerns boundary
   (e.g., stack facts, tech versions, domain descriptions) — these belong
   in `openspec/config.yaml`. For each violation, ask: *"This describes
   [X] — that's project DNA and belongs in `config.yaml`. Should I move it
   there and leave a reference here?"*
4. Run a targeted interview covering only the gaps (sections with no
   existing coverage).
5. Show a merged preview before writing. Inferred/existing content is
   labelled `# from existing file`; new content is labelled `# new`.

**If option (b) is chosen:**
Run the full Phase 1 → Phase 4 interview and append the generated sections
below a `---` divider and a comment: `<!-- Added by accelint-onboard-agents skill -->`.

**If option (c) is chosen:**
Run the full Phase 1 → Phase 4 interview and present the output in the
conversation. Explicitly state: "No files were changed." Offer to re-run
as (a) or (b) if the user is satisfied.

---

#### Mode 3: Refresh

The file matches the skill's expected shape — it was likely produced by a
previous run. Run an abbreviated interview covering only:

1. **Drift detection** — scan the codebase for changes since the file was
   last updated:

   | Signal | Where to look |
   |--------|---------------|
   | New packages added | `package.json`, workspace `package.json` files |
   | CI checks changed | `.github/workflows/` — new required gates? |
   | Husky hooks modified | `.husky/` — new pre-commit steps? |
   | New migration directory | `migrations/`, `prisma/migrations/`, `alembic/` |
   | Versioning tooling added | `.changeset/`, `.releaserc*` |
   | OpenSpec added/removed | `openspec/` directory presence |
   | New protected branches | `.github/branch-protection*`, README |

2. **Unresolved TODOs** — find all `<!-- TODO: fill in -->` markers left
   from the previous run and surface them as targeted questions.

3. **Announce findings** before asking anything:
   > "I found [N] sections that may have drifted and [M] unresolved TODOs.
   > I'll only ask about those — the rest looks current."

4. After the targeted interview, show a diff-style preview (changed sections
   only) before writing. Do not re-emit sections that have not changed.

---

### Phase 1 — Discovery Interview

Run the interview conversationally. Don't dump all questions at once. Group
them into natural topic turns. If the user describes a workflow, infer related
behavioral constraints and confirm rather than asking again.

**Turn 1 — Role & Identity**
- What role should the agent play? ("senior TypeScript engineer", "full-stack
  developer", "pair programmer", "code reviewer", etc.)
- Is the agent scoped to a specific domain? ("focuses on the rendering
  pipeline", "works across the full monorepo", etc.)
- Any role constraints? ("never makes architectural decisions alone")

**Turn 2 — Communication Style**
- How verbose should responses be? (concise summaries, detailed explanations,
  adaptive to the question?)
- Preferred format for code changes? (show diffs, show full files, inline
  comments, separate explanation block?)
- How should the agent handle uncertainty? ("state assumption and proceed",
  "always ask before proceeding", "ask for scope-changing uncertainty only"?)
- Should the agent explain its reasoning, or just act?

**Turn 3 — Workflow Procedures**
- What is the standard flow for a new feature? (e.g., propose → spec → design
  → implement → test → PR)
- For bug fixes, is the flow different?
- What checks must always run before committing? (type-check, lint, tests?)
- Any PR conventions? (size limits, labels, draft vs. ready, review requests?)
- Commit message convention? (Conventional Commits, gitmoji, free-form, with
  example format?)
- Versioning workflow? (when to bump, who approves changelog?)

**Turn 4 — OpenSpec / Spec-Driven Workflow** *(skip if not using OpenSpec)*
- When should the agent invoke `/opsx:propose`?
  *Good default: "for any new feature or non-trivial change".*
- When is a spec required vs. optional?
- Should the agent reference existing specs before creating new patterns?
- How should the agent handle a task that has no existing spec?

**Turn 5 — Decision Heuristics**
- When should the agent ask vs. proceed autonomously?
  *Good prompts: "deleting files", "changing public APIs", "modifying
  migrations", "adding new dependencies".*
- Any operations that require explicit human sign-off before acting?
- How should scope creep be handled if discovered mid-task?
- If two approaches are equally valid, should the agent pick one, ask, or
  present both?

**Turn 6 — Tool & Command Preferences**
- Any tool-level preferences the agent should honor?
  *Examples: "prefer vitest over jest", "use pnpm, never npm", "biome for
  formatting, never prettier".*
- Any CLI commands the agent should always/never run?
  *Examples: "never run `git push --force`", "always use `pnpm` not `npm run`".*
- Any environment setup the agent should validate before starting?

**Turn 7 — Guardrails**
- Hard "never" rules? (operations that are always off-limits)
  *Examples: "never force-push to main", "never delete migration files",
  "never commit secrets".*
- Soft "always ask first" rules?
  *Examples: "ask before modifying `package.json` scripts", "ask before
  changing shared utility packages".*
- Any security-sensitive areas that require special handling?

---

### Phase 2 — Smart Defaults

After each workflow answer, surface relevant behavioral conventions to
confirm. Use these examples as a pattern; extend to other stacks as
appropriate.

**Turborepo + PNPM monorepo → suggest confirming:**
- "I'll assume you want `pnpm -w` (workspace root) for adding shared deps
  and `pnpm --filter <pkg>` for package-scoped deps; correct?"
- "For tasks, I'll default to `pnpm turbo run build --filter=...` rather
  than running package scripts directly; correct?"

**GitHub Actions CI → suggest confirming:**
- "Should I wait for CI to pass before treating a PR as mergeable?"
- "Any required status checks the agent should reference before marking
  work done?"

**Conventional Commits → suggest confirming:**
- "I'll use `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:` — any
  additional types your team uses (e.g., `perf:`, `ci:`)?"
- "Are breaking changes annotated with `!` suffix (e.g., `feat!:`) or with
  a footer `BREAKING CHANGE:` block?"

**Spec-Driven Development (OpenSpec) → suggest confirming:**
- "For non-trivial changes, I'll start with `/opsx:propose` before writing
  any code; should I also require a design artifact for changes touching more
  than N files?"
- "Should I link task IDs or spec refs in commit messages?"

---

### Phase 3 — Codebase Inference (fill gaps before generating)

After the interview, audit every AGENTS.md section that still has no answer.
For each gap, attempt to derive the behavioral intent directly from the
codebase before asking or leaving a `# TODO`. A behavioral file with explicit
TODOs is actionable; a file with missing sections silently shapes agent
behavior in unpredictable ways.

**Inference targets and where to look:**

| Gap | Files / signals to inspect |
|-----|---------------------------|
| Commit convention | `commitlint.config.*`, recent `git log --oneline`, `.gitmessage`, `.releaserc*` |
| PR workflow | `.github/PULL_REQUEST_TEMPLATE.md`, `.github/workflows/` (CI gate names) |
| Pre-commit checks | `.husky/`, `.lefthook.yml`, `package.json#scripts` (lint, typecheck, test) |
| Test runner preference | `vitest.config.*`, `jest.config.*` — whichever is present |
| Package manager | `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb` |
| Forced-push protection | `.github/branch-protection*`, README mentions of branch policy |
| Migration guardrails | Presence of `migrations/`, `prisma/migrations/`, `alembic/` |
| Secret handling | `.env.example`, `.gitignore` patterns, presence of `dotenv` / vault tooling |
| OpenSpec usage | `openspec/` directory, `openspec/config.yaml`, any `/opsx:*` references in docs |
| Versioning workflow | `.changeset/`, `CHANGELOG.md`, `standard-version`, `conventional-changelog` |
| Path aliases (for tool commands) | `tsconfig.json#paths`, `vite.config` — infer preferred import style |

**After inference, for each field resolved this way**, note the source in the
preview with a trailing comment, e.g.:

```markdown
- Always run `pnpm check` before committing   # inferred from .husky/pre-commit
- Use Conventional Commits (`feat:`, `fix:`)  # inferred from commitlint.config.ts
```

**If a field genuinely cannot be inferred** (e.g., decision heuristics,
communication style, role definition), mark it with `<!-- TODO: fill in -->`
rather than omitting the section.

---

### Phase 4 — Preview and Write

1. **Show a labeled preview** of the full AGENTS.md before writing anything.
   Inferred values carry their source comment; unresolved sections carry
   `<!-- TODO: fill in -->`. This gives the user a complete confidence map.
2. Ask: *"Does this look right? Any sections to correct or expand before I
   write the file?"*
3. After confirmation, write to `AGENTS.md` at the project root (or
   `CLAUDE.md` if the user is using Claude Code conventions), **stripping
   the inference source comments** — they are for review only, not the
   final file.
4. Print a brief summary of what was generated, what was inferred vs.
   answered directly, and which `<!-- TODO -->` sections still need human
   input.

---

## AGENTS.md Template

Use this exact structure. Fill every `[placeholder]` with content from the
interview or codebase inference. If a field cannot be resolved by either
means, replace its placeholder with `<!-- TODO: fill in -->` — never omit
the section. Every section shapes global agent behavior.

```markdown
# Agent Behavior

> NOTE: This file governs HOW the agent behaves. Project facts (stack,
> architecture, domain concepts, coding standards) belong in
> `openspec/config.yaml`, not here. See the separation of concerns in
> the OpenSpec documentation.

---

## Role & Identity

[One-sentence role definition, e.g., "You are a senior TypeScript engineer
working across the @certes/* monorepo."]

[Scope constraints, if any, e.g., "Focus on rendering pipeline packages
(@certes/ordo.gl, @certes/layer-orchestration). Escalate cross-cutting
architectural decisions."]

---

## Communication

- **Response style**: [concise / detailed / adaptive — describe when each applies]
- **Code changes**: [show diffs / show full file / inline comments / separate block]
- **Uncertainty**: [always ask / ask for scope-changing uncertainty only / state assumption and proceed]
- **Reasoning**: [explain reasoning / act without narrating / explain only when asked]

---

## Workflow Procedures

### New Features
[step-by-step procedure, e.g.:]
1. Start with `/opsx:propose` for any non-trivial change
2. Get proposal reviewed before writing code
3. Run `pnpm check` and `pnpm test` after each meaningful change
4. Open a draft PR early; mark ready only after CI passes

### Bug Fixes
[procedure — often shorter than feature flow, e.g.:]
1. Reproduce with a failing test before touching code
2. Fix the root cause, not the symptom
3. Confirm the test passes, then open a PR

### Pre-Commit Checklist
- [ ] [check, e.g., `pnpm typecheck`]
- [ ] [check, e.g., `pnpm lint`]
- [ ] [check, e.g., `pnpm test`]

### Commit Messages
Convention: [e.g., Conventional Commits]
Format: `[type]([scope]): [description]`
Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`[, additional types]
Example: `feat(layer): add WebGPU fallback for Safari`

### PR Conventions
- [size guideline, e.g., "prefer small, focused PRs over large changesets"]
- [label convention, if any]
- [review request convention, if any]

### Versioning
- [when and how to bump versions, e.g., "use `pnpm changeset` for any
  user-facing change; patch for fixes, minor for features, major for
  breaking changes"]

---

## Decision Heuristics

| Situation | Default Action |
|-----------|---------------|
| Uncertain about scope | [ask / proceed with stated assumption] |
| Deleting files | [always ask first] |
| Changing public API | [always ask first] |
| Adding a new dependency | [ask, state rationale] |
| Modifying shared utilities | [ask, list affected packages] |
| Discovering scope creep mid-task | [pause and surface to user] |
| Two equally valid approaches | [pick one and state choice / ask] |
[additional heuristics]

---

## Tool Preferences

- **Package manager**: [e.g., always use `pnpm`; never `npm` or `yarn`]
- **Test runner**: [e.g., `vitest` — never `jest`]
- **Linting / formatting**: [e.g., `biome` — never `prettier` or `eslint` separately]
- **Task runner**: [e.g., `pnpm turbo run <task> --filter=<pkg>`]
- **Version control**: [e.g., `git` via CLI — no GUI wrappers]
[additional tool preferences]

---

## Guardrails

### Never (hard stops — no exceptions)
- [ ] Never force-push to `main` or `[protected branch]`
- [ ] Never commit secrets, tokens, or credentials
- [ ] [additional hard stop]

### Always Ask First (soft gates)
- [ ] Before deleting any tracked file
- [ ] Before modifying `package.json` scripts in a shared package
- [ ] Before changing a migration file
- [ ] [additional soft gate]

### Security Sensitivity
- [any areas requiring special care, e.g., "treat all environment variable
  names as sensitive — never log them, even in debug output"]
```

---

## Interaction Principles

- **Conversational, not interrogative.** Bundle related questions into a
  single turn. Use natural language, not bullet-dump forms.
- **Infer and confirm.** "You mentioned Husky — I'll assume the pre-commit
  hook runs `pnpm check`; can you confirm?" is better than asking from
  scratch.
- **Examples reduce ambiguity.** When asking about decision heuristics,
  offer concrete triggering scenarios so the user can pattern-match.
- **Iterative.** Let the user amend answers before the final write.
- **Preview before writing.** Always show the full generated AGENTS.md and
  get explicit confirmation before touching the filesystem.
- **Infer before asking, ask before omitting.** A file with explicit TODOs
  is actionable; a file with missing sections silently degrades every
  interaction it governs.
- **Don't cross the layer boundary.** If the user volunteers stack facts
  during this interview, acknowledge them and note they belong in
  `openspec/config.yaml`, not AGENTS.md. Offer to run the
  `accelint-onboard-openspec` skill for that content.
