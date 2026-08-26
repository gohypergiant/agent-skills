---
name: accelint-onboard-agents
description: Onboard a repository to agent-driven development by creating or refreshing a complete AGENTS.md or CLAUDE.md through behavior-focused discovery, structured interviewing, drift-aware updates, conflict-aware synthesis, proportional updates, and preview-before-write review. Use when the user wants to create, replace, refresh, import, restructure, append to, dry-run, or review AGENTS.md or CLAUDE.md guidance, mentions agent behavior, instructions, guardrails, workflow, Claude Code conventions, package-level agent files, or monorepo inheritance, or asks how to tell an AI coding agent how to behave in a project. Also use it when the user wants behavior rules kept separate from `openspec/config.yml` or `openspec/config.yaml` project DNA. Do not use it for OpenSpec config onboarding, architecture docs, or one-line AGENTS.md or CLAUDE.md edits that do not require discovery, synthesis, or section-level review.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.5.0"
---

# Onboard Agents

Guide the user through a conversational interview that produces a complete, project-specific `AGENTS.md` or `CLAUDE.md` for how an AI coding agent should behave in this repository.

## Separation of Concerns

This skill produces the **behavior layer** of the agent instruction stack.
It complements the `accelint-onboard-openspec` skill, which produces the
**project DNA layer** (`openspec/config.yml` or `openspec/config.yaml`). These layers must not
duplicate each other.

Keep content here only when it directly improves recurring agent behavior.
If a detail is better described as project background, stack fact,
architecture explanation, process handbook material, or nearby reference
documentation, prefer the canonical document and link to it instead of
restating it here.

Use the rule below to decide what stays in this file and what belongs in a
canonical companion document.

### Hard Rule: What Does NOT Belong Here

If information answers "what is the project?" rather than "how should the agent behave?", it belongs in `openspec/config.yml` or `openspec/config.yaml`, not here.

| Belongs in AGENTS.md | Belongs in config.yaml |
|---|---|
| "Always run `pnpm check` before committing" | "Package manager: pnpm" |
| "Use Conventional Commits" | "TypeScript 5.x, strict mode" |
| "Ask before deleting files" | "Monorepo: Turborepo + PNPM" |
| "Prefer small, focused PRs" | "`type` over `interface`" |
| "Work as a senior TS engineer when useful" | "Domain: geospatial visualization" |
| "Never force-push to main" | "Testing: Vitest + @testing-library" |

### Final Inclusion Rule

Only include guidance in the final `AGENTS.md` or `CLAUDE.md` when it earns a permanent place. Keep it only if it is:

- behavior-shaping
- recurring, not one-off
- non-obvious or not easy to infer
- durable enough for standing guidance
- worth loading into every agent session

If a detail is true but low-value, unstable, better housed elsewhere, or not behavior-shaping, leave it out, link to the canonical document, or use `<!-- TODO: fill in -->` instead of padding the file.

Persona or identity framing is optional. Use it only when it improves behavior. Do not let role language replace operational guidance.

---

## NEVER Do When Onboarding Agents

- **NEVER run codebase discovery serially** — when discovery is needed, use parallel subagents for different behavioral domains. Serial scanning wastes time on codebases with many config files spread across directories.
- **NEVER skip needed discovery before asking questions** — infer behavioral conventions from the codebase before adding avoidable questions to the interview. A question about commit format when `commitlint.config.ts` exists wastes the user's time. For narrow refreshes, do only the scoped discovery the request needs.
- **NEVER omit sections from the generated AGENTS.md** — if a section cannot be inferred or answered, mark it with `<!-- TODO: fill in -->` rather than leaving it out. Missing sections silently shape agent behavior in unpredictable ways.
- **NEVER duplicate root-level instructions in package-level files** — if a monorepo root `AGENTS.md` or `CLAUDE.md` exists, package files should reference it and add only what is package-specific. Repeated instructions inflate context on every agent invocation.
- **NEVER preserve conflicting standing rules only because both were found** — resolve conflicts using source precedence, or surface the unresolved issue in preview instead of emitting both as authoritative guidance.
- **NEVER write the final file without showing a preview** — the user must see inferred values with source annotations and confirm before any filesystem write.

---

## Conflict Resolution and Source Precedence

When candidate rules conflict during import, refresh, or final synthesis, resolve them in this order:

1. **Direct user-confirmed answers**
2. **Confirmed repository policy or explicitly documented repository behavior**
3. **Evidence-backed inference from repository materials**
4. **Existing `AGENTS.md` or `CLAUDE.md` content that remains consistent with stronger evidence**
5. **Template defaults or generic skill defaults**
6. **`<!-- TODO: fill in -->` or an explicit open question instead of forced synthesis when conflict remains unresolved**

Apply this rule every time:

- Do not preserve conflicting rules because both were discovered.
- Do not let defaults outrank stronger repository evidence.
- Do not let old file content survive unchanged if it conflicts with current confirmed evidence.
- When uncertainty remains, surface it in preview or use a TODO instead of inventing a unified rule.

---

## Workflow

Follow this workflow in order. Do not skip ahead. Complete each gate before moving to the next step.

1. File state detection
2. Mode selection
3. Mode-specific discovery and interview
4. Parallel codebase discovery, but only if that mode still has unresolved behavioral gaps
5. Preview and write

If a narrower branch explicitly tells you to skip a later step, follow that branch. Otherwise, keep this order.

### Step 1 — File State Detection

Complete all three checks below before asking any interview question or choosing a mode. Never silently pick a mode. Always tell the user which mode you detected and confirm before continuing.

#### Check 1 — Monorepo root check

Before you assess the local file, determine whether the current working directory is a package inside a monorepo.

If a root-level `AGENTS.md` or `CLAUDE.md` exists above the current directory:

1. Read the root file in full.
2. Announce: *"I found a root-level `AGENTS.md` or `CLAUDE.md` at [path]. I'll use it as context to avoid duplicating instructions that apply to all packages. The file I generate here will reference the root where appropriate rather than repeating it."*
3. In the generated file, add a header reference:
   ```markdown
   <!-- Inherits from: [relative path to root AGENTS.md or CLAUDE.md] -->
   <!-- Only package-specific overrides and additions are defined here. -->
   ```
4. During the interview, at the start of each turn, state what the root file already covers for that section before asking any questions:

   > "The root `AGENTS.md` or `CLAUDE.md` defines [summary of this section's content].
   > Does this package need to add to or override any of that?"

   If the user says no, emit a reference in the generated file rather than repeating the content. If the user flags additions or overrides, ask the normal turn questions scoped to what is missing or different.

#### Check 2 — Check for related documents

After the monorepo root check and before local file-state detection, check for related onboarding documents.

1. Check for `openspec/config.yml` or `openspec/config.yaml`.
   - If either file exists, read it to understand the project's stack and patterns.
   - Note its existence for the "Related Documentation" section.
   - Announce: "Found `openspec/config.yml` or `openspec/config.yaml` — I'll reference it for the separation-of-concerns boundary."
2. Check for `ARCHITECTURE.md`.
   - If it exists, read it to understand the system structure.
   - Note its existence for the "Related Documentation" section.
   - Announce: "Found `ARCHITECTURE.md` — I'll reference it in the behavioral docs."

#### Check 3 — Detect the local file state

Only after Checks 1 and 2 are complete, detect the local `AGENTS.md` or `CLAUDE.md` state.

```text
Does a local AGENTS.md (or CLAUDE.md) exist in the current directory?
│
├── No → MODE 1: Create
│         Full interview from scratch.
│
└── Yes → Read the file, then assess:
          │
          ├── Empty or near-blank (fewer than about 10 meaningful lines)?
          │     → MODE 1: Create (with overwrite confirmation)
          │       Ask: "AGENTS.md exists but appears empty — should I
          │       populate it from scratch, or preserve any current content?"
          │
          ├── Contains recognized template sections?
          │   (`## Role & Identity`, `## Guardrails`, `## Workflow Procedures`, etc.)
          │     → MODE 3: Refresh
          │
          └── Contains real content in an unrecognized shape?
                → MODE 2: Import
```

#### Gate — Ask the intent question for Mode 2 and Mode 3

If Step 1 detects Mode 2 or Mode 3, ask this before any other discovery, drift scan, or interview step for that mode:

> "Before I start — would you like to **start fresh**, treating the
> existing file as a reference only *(recommended)*, or **work with what's
> already there**?"

If the user chooses **start fresh**, switch immediately to Mode 1. Treat the existing file as a read-only reference. Carry forward any content from the existing file that is still accurate. Do not silently discard it. Regenerate the structure from scratch.

If the user chooses **work with what's there**, continue into the detected Mode 2 or Mode 3 path.

**Recognized template sections** (any two or more = recognized shape):
`## Role & Identity`, `## Communication`, `## Workflow Procedures`,
`## Decision Heuristics`, `## Tool Preferences`, `## Guardrails`

#### Branch eligibility — Targeted refresh inside Mode 3

Only after the Mode 3 intent gate is satisfied, decide whether the request qualifies for targeted refresh.

If a recognized local file exists and the user requests one bounded update with a known target section or issue, route within Mode 3 to a targeted refresh path instead of the full refresh flow.

Use targeted refresh when the request is already within this skill's boundary and is clearly bounded, such as:

- one known contradiction to fix
- one section to update from newly confirmed evidence
- one outdated rule to remove or soften
- one narrow addition that belongs in an existing section
- one wrapper or conversion update where the surrounding structure is unchanged

In targeted refresh mode:

- inspect the affected section or sections first
- do the scoped discovery needed for that update
- avoid the full interview and full regeneration unless missing context requires it
- preserve the rest of the file unless the narrow update exposes broader contradiction or drift
- still require preview before write
- still apply the same conflict-resolution and editorial-pass rules as broader update paths

Done when: the file state, selected mode, and any targeted-refresh branch are explicit before the discovery interview or refresh analysis begins.

---

### Step 2 — Mode Selection

After Step 1 is complete and any required intent gate is answered, follow exactly one mode below.

#### Mode 1: Create

Run this path in order:

1. Discovery interview
2. Smart defaults
3. Parallel codebase discovery
4. Preview and write

Use this mode for a fresh repo, an empty or near-blank file that the user wants populated, or an explicit **start fresh** choice.

---

#### Mode 2: Import (build on what's there)

Use this mode only when the file has real content that this skill did not generate and the user chose to work with the existing file.

Before you modify or synthesize anything, present the user with these three options:

> "This AGENTS.md has existing content with a structure I don't recognize.
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

Branch handling:
- If the user chooses **(a)**, follow the restructure path below.
- If the user chooses **(b)**, follow the append path below.
- If the user chooses **(c)**, follow the dry-run path below.
- Do not start any branch until the user has chosen one.

##### Branch (a) — Restructure

Run these steps in order:

1. Read the file in full.
2. Map each existing section onto the skill's template sections.
3. Flag any content that violates the separation-of-concerns boundary, such as stack facts, tech versions, or domain descriptions. These belong in `openspec/config.yaml`.
   - For each violation, ask: *"This describes [X] — that's project DNA and belongs in `config.yaml`. Should I move it there and leave a reference here?"*
4. Run a targeted interview that covers only the gaps, meaning sections with no existing coverage.
5. Apply the source-precedence rule and remove duplicate, conflicting, or adjacent-doc material before preview.
6. Show a merged preview before writing. Inferred or existing content is labelled `# from existing file`; new content is labelled `# new`.

Done when: the merged preview is ready for user review.

##### Branch (b) — Append

Run these steps in order:

1. Discovery interview
2. Smart defaults
3. Parallel codebase discovery
4. Preview and write
5. In the final output, append the generated sections below a `---` divider and a comment: `<!-- Added by accelint-onboard-agents skill -->`.

Even in append mode, do not add conflicting standing guidance without surfacing the conflict in preview.

Done when: the appended preview is ready for user review.

##### Branch (c) — Dry run

Run these steps in order:

1. Discovery interview
2. Smart defaults
3. Parallel codebase discovery
4. Preview gate only from Preview and Write

Then stop. Present the output in the conversation and explicitly state: "No files were changed."

Offer to re-run as (a) or (b) if the user is satisfied.

Done when: the dry-run output is shown and the no-write status is explicit.

---

#### Mode 3: Refresh (build on what's there)

Use this mode only when the file matches the skill's expected shape and the user chose to work with the existing file.

Choose exactly one refresh path after the Mode 3 intent gate:

- **Targeted refresh** for one bounded update where the affected area is already known
- **Full refresh** when the request is broad, the file may have drifted in several places, or the narrow update reveals a contradiction, cross-section dependency, or inconsistency that requires broader review

If the request began as targeted refresh, skip the full drift and TODO sweep unless the narrow update reveals a contradiction, cross-section dependency, or inconsistency that requires escalation to the full refresh flow.

##### Targeted refresh flow

Run these steps in order:

1. Inspect the affected section or sections.
2. Do only the scoped discovery needed for that bounded update.
3. Ask only the questions needed to resolve that update.
4. Apply source precedence and the final editorial pass to the affected material and any directly dependent sections.
5. Show preview before any write.
6. If the update reveals broader contradiction or drift, escalate immediately to the full refresh flow before writing.

Done when: the narrowed preview is ready for user review or the work has been escalated to full refresh.

##### Full refresh flow

###### Refresh Step 1 — Extract external findings

Check whether the invoking prompt includes a `findings:` list.

- Parse the prompt for a `findings:` section, meaning a bulleted list of factual statements.
- Each finding is phrased as something already known to be true, never as an instruction.
- Example: "config.yaml's Anti-Patterns section says to avoid polling, but two archived changes chose polling for stated reasons"
- Store these findings for merging in Refresh Step 4.

###### Refresh Step 2 — Run drift detection

Scan the codebase for changes since the file was last updated.

| Signal | Where to look |
|---|---|
| New packages added | `package.json`, workspace `package.json` files |
| CI checks changed | `.github/workflows/` — new required gates? |
| Husky hooks modified | `.husky/` — new pre-commit steps? |
| New migration directory | `migrations/`, `prisma/migrations/`, `alembic/` |
| Versioning tooling added | `.changeset/`, `.releaserc*` |
| OpenSpec added or removed | `openspec/` directory presence |
| New protected branches | `.github/branch-protection*`, README |

###### Refresh Step 3 — Surface unresolved TODOs

Find all `<!-- TODO: fill in -->` markers left from the previous run and surface them as targeted questions.

###### Refresh Step 4 — Merge and announce findings before asking anything

Combine external findings from Refresh Step 1, drift findings from Refresh Step 2, and TODOs from Refresh Step 3.

Present the merged list to the user:

> "I found [N] external findings, [M] sections that may have drifted, and [P] unresolved TODOs.
> I'll only ask about those — the rest looks current."

If external findings exist, note their source, for example "from completed OpenSpec change".

Done when: the merged finding set is visible before the next refresh interview turn.

###### Refresh Step 5 — Interview, then preview the changed sections first

Only after Refresh Step 4 is complete:

- run the targeted refresh interview for the merged finding set
- apply source precedence
- prune duplication and low-value carry-forward text
- show a diff-style preview that includes only changed sections first
- do not re-emit unchanged sections in that first refresh preview
- still produce the full labeled preview required by Preview and Write before any write

Done when: the changed-section preview is ready for review and the file is ready for the full labeled preview in Preview and Write.

---

### Step 3 — Mode-Specific Discovery and Interview

Use the interview only after mode selection is complete. Run it conversationally. Do not dump all questions at once. Group questions into natural topic turns. If the user describes a workflow, infer related behavioral constraints and confirm them instead of asking again. Keep questions proportional to the request size. Do not ask for information that strong repository evidence already answers.

**Turn 1 — Role & Identity**
- What role should the agent play, if any role framing is useful? ("senior TypeScript engineer", "full-stack developer", "pair programmer", "code reviewer", etc.)
- Is the agent scoped to a specific domain? ("focuses on the rendering pipeline", "works across the full monorepo", etc.)
- Any role constraints? ("never makes architectural decisions alone")
- If role framing is not useful, keep this section brief and operational rather than ornamental.

**Turn 2 — Communication Style**
- How verbose should responses be? (concise summaries, detailed explanations, adaptive to the question?)
- Preferred format for code changes? (show diffs, show full files, inline comments, separate explanation block?)
- How should the agent handle uncertainty? ("state assumption and proceed", "always ask before proceeding", "ask for scope-changing uncertainty only"?)
- Should the agent explain its reasoning, or just act?

**Turn 3 — Workflow Procedures**
- What is the standard flow for a new feature? (for example propose → spec → design → implement → test → PR)
- For bug fixes, is the flow different?
- What checks must always run before committing? (type-check, lint, tests?)
- Any PR conventions? (size limits, labels, draft vs. ready, review requests?)
- Commit message convention? (Conventional Commits, gitmoji, free-form, with example format?)
- Versioning workflow? (when to bump, who approves changelog?)

**Turn 4 — OpenSpec / Spec-Driven Workflow** *(skip if not using OpenSpec)*
- When should the agent invoke `/opsx:propose`?
  *Good default: "for any new feature or non-trivial change".*
- When is a spec required vs. optional?
- Should the agent reference existing specs before creating new patterns?
- How should the agent handle a task that has no existing spec?

**Turn 5 — Decision Heuristics**
- When should the agent ask vs. proceed autonomously?
  *Good prompts: "deleting files", "changing public APIs", "modifying migrations", "adding new dependencies".*
- Any operations that require explicit human sign-off before acting?
- How should scope creep be handled if discovered mid-task?
- If two approaches are equally valid, should the agent pick one, ask, or present both?

**Turn 6 — Tool & Command Preferences**
- Any tool-level preferences the agent should honor?
  *Examples: "prefer vitest over jest", "use pnpm, never npm", "biome for formatting, never prettier".*
- Any CLI commands the agent should always or never run?
  *Examples: "never run `git push --force`", "always use `pnpm` not `npm run`".*
- Any environment setup the agent should validate before starting?

**Turn 7 — Guardrails**
- Hard "never" rules? (operations that are always off-limits)
  *Examples: "never force-push to main", "never delete migration files", "never commit secrets".*
- Soft "always ask first" rules?
  *Examples: "ask before modifying `package.json` scripts", "ask before changing shared utility packages".*
- Any security-sensitive areas that require special handling?

---

### Smart Defaults

Use Smart Defaults only after the relevant workflow answers have been gathered or strongly inferred. Surface them as confirmation prompts, not as standing policy. If repository evidence or direct user answers already settle a default, do not ask it again.

Treat defaults as fallback prompts, not standing policy. Defaults must yield to stronger repository evidence, direct user answers, and still-consistent existing guidance.

**Turborepo + PNPM monorepo → suggest confirming:**
- "I'll assume you want `pnpm -w` (workspace root) for adding shared deps and `pnpm --filter <pkg>` for package-scoped deps; correct?"
- "For tasks, I'll default to `pnpm turbo run build --filter=...` rather than running package scripts directly; correct?"

**GitHub Actions CI → suggest confirming:**
- "Should I wait for CI to pass before treating a PR as mergeable?"
- "Any required status checks the agent should reference before marking work done?"

**Conventional Commits → suggest confirming:**
- "I'll use `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:` — any additional types your team uses (for example `perf:`, `ci:`)?"
- "Are breaking changes annotated with `!` suffix (for example `feat!:`) or with a footer `BREAKING CHANGE:` block?"

**Spec-Driven Development (OpenSpec) → suggest confirming:**
- "For non-trivial changes, I'll start with `/opsx:propose` before writing any code; should I also require a design artifact for changes touching more than N files?"
- "Should I link task IDs or spec refs in commit messages?"

---

### Step 4 — Parallel Codebase Discovery (fill gaps before generating)

Enter this step only after the mode-specific interview work above is complete, and only for sections that still have unresolved behavioral gaps. Skip this step when the chosen path already has enough confirmed information and no remaining unresolved sections require inference.

After the interview, audit every `AGENTS.md` section that still has no answer. For each gap, try to derive the behavioral intent directly from the codebase by using parallel subagents before asking again or leaving a `# TODO`. A behavioral file with explicit TODOs is actionable. A file with missing sections silently shapes agent behavior in unpredictable ways.

Discovery is for filling behavioral gaps, not for maximizing output surface area. Gather broadly when needed, but carry forward only findings that survive the final inclusion rule.

Spawn discovery subagents in parallel. Do not scan serially. Each agent focuses on one behavioral domain and returns structured findings. Wait for all agents to complete, then merge results before Preview and Write.

**Spawn these agents at the same time:**

**Agent A — Version Control & Commit Conventions**
- Commit convention: `commitlint.config.*`, recent `git log --oneline`, `.gitmessage`, `.releaserc*`
- Versioning workflow: `.changeset/`, `CHANGELOG.md`, `standard-version`, `conventional-changelog`
- Forced-push protection: `.github/branch-protection*`, README mentions of branch policy
- Return: commit message format with types and examples, versioning commands, branch protection rules

**Agent B — CI/CD & Pre-commit Workflows**
- PR workflow: `.github/PULL_REQUEST_TEMPLATE.md`, `.github/workflows/` (CI gate names, required checks)
- Pre-commit checks: `.husky/`, `.lefthook.yml`, `package.json#scripts` (lint, typecheck, test)
- Return: PR conventions (size, labels, templates), pre-commit checklist with commands, CI required checks

**Agent C — Testing & Code Quality**
- Test runner: `vitest.config.*`, `jest.config.*`, `pytest.ini`, `pyproject.toml [tool.pytest]`, Playwright, Cypress
- Package manager: `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`
- TypeScript project: `tsconfig.json` presence, path aliases in `tsconfig.json#paths` or `vite.config`
- Vitest config: `vitest.config.ts` — check for `clearMocks`, `mockReset`, `restoreMocks` flags
- Test file type checking: CI workflows, `package.json` scripts — check if `tsc --noEmit` runs on test files
- Return: test framework, package manager, TS-specific guardrails if applicable, vitest cleanup config

**Agent D — Security & Migrations**
- Migration files: presence of `migrations/`, `prisma/migrations/`, `alembic/`
- Secret handling: `.env.example`, `.gitignore` patterns, presence of `dotenv` or vault tooling
- Return: migration guardrails if migrations exist, secret handling practices

**Agent E — OpenSpec & Development Workflow**
- OpenSpec: `openspec/` directory, `openspec/config.yaml`, any `/opsx:*` references in docs or CLAUDE.md
- Return: OpenSpec usage status, when to invoke spec workflow

**After all agents complete:** merge their findings into a unified discovery map.
Tag each field as `# inferred from [source]` or leave it empty if unknown. Fields that remain empty after discovery become explicit `<!-- TODO: fill in -->` markers in the generated file.

**Preview with source annotations:**

After you merge discovery results, show a preview with trailing comments on inferred values:

```markdown
- Always run `pnpm check` before committing   # inferred from .husky/pre-commit
- Use Conventional Commits (`feat:`, `fix:`)  # inferred from commitlint.config.ts
```

**If a field cannot be inferred** — for example decision heuristics, communication style, or role definition — mark it with `<!-- TODO: fill in -->` rather than omitting the section.

---

### Step 5 — Preview and Write

Do not enter this step until all earlier required steps for the chosen path are complete.

#### Step 1 — Run the mandatory final editorial pass before preview

Clean the assembled draft before the user reviews it.

- Deduplicate overlapping guidance across sections.
- Resolve contradictions using the source-precedence rule.
- Remove adjacent-doc or handbook-style material that does not directly govern agent behavior.
- Downgrade brittle specifics unless the specifics are evidenced, behavior-shaping, and durable.
- Replace weakly supported specifics with a durable rule, a canonical link, or `<!-- TODO: fill in -->` when confidence is too low.
- Prefer a shorter, sharper, more behavior-focused final draft over a broader but noisier one.

Done when: the draft is cleaned and ready for preview.

#### Step 2 — Show the labeled preview before any write

Show the full labeled preview of the cleaned `AGENTS.md` or `CLAUDE.md` before writing anything.

- Inferred values carry their source comment.
- Unresolved sections carry `<!-- TODO: fill in -->`.
- For refresh flows, you may show changed sections first, but the full labeled preview is still required before any write.

This gives the user a complete confidence map.

#### Gate — Collect review feedback before any write

Ask: *"Does this look right? Any sections to correct or expand before I write the file?"*

In non-interactive or headless contexts, still produce the full labeled preview and explicitly note that human confirmation could not be collected in-session. Do not claim the file was human-confirmed if it was not.

Do not write the file until this gate is satisfied or the context is explicitly non-interactive.

#### Step 3 — Write the confirmed file

Only after the review gate is satisfied, write to `AGENTS.md` or `CLAUDE.md` in the target directory being onboarded, **stripping the inference source comments**.

Those comments are for review only and must not appear in the final file.

For the Related Documentation section, include links only for files that exist in the repository. Check each file (`openspec/config.yml`, `openspec/config.yaml`, `ARCHITECTURE.md`, `README.md`) before including its link. If both `openspec/config.yml` and `openspec/config.yaml` are absent, do not include either path.

Done when: the confirmed file is written without review-only comments.

#### Step 4 — Print the completion summary

After the write is complete, print a brief summary of what was generated, what was inferred versus answered directly, and which `<!-- TODO -->` sections still need human input.

Done when: the user has the final write summary.
---

## AGENTS.md Template

Use this exact structure. Fill every `[placeholder]` with content from the interview or codebase inference. If a field cannot be resolved by either source, replace its placeholder with `<!-- TODO: fill in -->`. Never omit the section. Every section shapes global agent behavior.

Keep each section as lean as possible while still being useful. Template examples are illustrative defaults, not automatic policy. Carry them into the final file only when they are confirmed, strongly inferred, or necessary as durable behavioral guidance.

```markdown
# Agent Behavior

> NOTE: This file governs HOW the agent behaves. Project facts (stack,
> architecture, domain concepts, coding standards) belong in
> `openspec/config.yml` or `openspec/config.yaml`, not here. See the separation of concerns in
> the OpenSpec documentation.

---

## Role & Identity

[One-sentence role definition if behaviorally useful, e.g., "You are a senior TypeScript engineer
working across the @accelint/* monorepo."]

[Scope constraints, if any, e.g., "Focus on rendering pipeline packages
(@accelint/standard-toolkit, @accelint/layer-orchestration). Escalate cross-cutting
architectural decisions."]

[If role framing adds little value, keep this section brief and concrete rather than decorative.]

---

## Communication

- **Response style**: [preferred level of detail]
- **Code changes**: [preferred presentation format]
- **Uncertainty**: [when to ask vs. proceed]
- **Reasoning**: [explain reasoning before acting / explain only when useful / other]

---

## Workflow Procedures

### New Features
[step-by-step procedure, e.g.:]
1. Start with `/opsx:propose` for any non-trivial change
2. Get proposal reviewed before writing code
3. Run `pnpm check` and `pnpm test` after each meaningful change
4. Open a draft PR early; mark ready only after CI passes

### Bug Fixes
[project-specific bug-fix workflow]

[If TDD is confirmed or strongly inferred, express it here clearly. Do not assume a full TDD doctrine unless supported.]

### Pre-Commit Checklist
- [ ] [check, e.g., `pnpm typecheck`]
- [ ] [check, e.g., `pnpm lint`]
- [ ] [check, e.g., `pnpm test`]
- [ ] [additional checks only if evidenced or confirmed]

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

### Completion Summary

[Describe any required end-of-task summary format only if it is expected in this repo.]

---

## Decision Heuristics

| Situation | Default Action |
|---|---|
| Uncertain about scope | [ask / proceed with stated assumption] |
| Deleting files | [always ask first] |
| Changing public API | [always ask first] |
| Adding a new dependency | [ask, state rationale] |
| Modifying shared utilities | [ask, list affected packages] |
| Discovering scope creep mid-task | [pause and surface to user] |
| Two equally valid approaches | [pick one and state choice / ask] |
| [additional recurring situations only if behaviorally useful] | [default action] |

---

## Tool Preferences

- **Package manager**: [e.g., always use `pnpm`; never `npm` or `yarn`]
- **Test runner**: [e.g., `vitest`]
- **Linting / formatting**: [e.g., `biome`]
- **Task runner**: [e.g., `pnpm turbo run <task> --filter=<pkg>`]
- **Version control**: [e.g., `git` via CLI]

### TypeScript/Testing Preferences (if applicable)
- [Include only durable, repo-supported preferences.]
- [Do not add stack-specific doctrine unless confirmed or strongly inferred.]

[additional tool preferences]

---

## Guardrails

### Never (hard stops — no exceptions)
- [ ] Never force-push to any branch
- [ ] Never commit secrets, tokens, or credentials
- [ ] Never break backward compatibility without explicit approval
- [ ] Never remove public exports, types, or functions without asking
- [ ] Never run destructive operations (deletes, truncates, drops) without
      confirmation
- [ ] [additional project-specific hard stops]

### Always Ask First (soft gates)
- [ ] Before making performance trade-offs in hot paths
- [ ] Before implementing architectural changes
- [ ] Before adding any new dependency to `package.json`
- [ ] Before deleting any tracked file
- [ ] Before modifying `package.json` scripts in a shared package
- [ ] Before changing a migration file
- [ ] [additional project-specific soft gates]

### Security Sensitivity
- [any areas requiring special care, e.g., "treat all environment variable
  names as sensitive — never log them, even in debug output"]

---

## Related Documentation

<!-- Include only files that actually exist in the repository -->

- **openspec/config.yml** or **openspec/config.yaml** — Project DNA: stack facts, coding patterns, domain concepts
  *(Include only the path that exists. Separation of concerns: this file defines WHAT the project is; AGENTS.md defines HOW agents behave)*
- **ARCHITECTURE.md** — System architecture, deployment overview, component interactions
  *(Reference this when behavioral decisions depend on understanding system structure)*
- **README.md** — Installation, quick start, usage guide for developers
```

---

## Quality Checklist

Before you consider the onboarding complete, verify that the generated file:

- preserves the behavior/project-DNA separation and redirects stack facts to `openspec/config.yml` or `openspec/config.yaml`
- covers every template section, using `<!-- TODO: fill in -->` where facts remain unknown
- references root-level agent guidance instead of duplicating it in monorepo package files
- includes only related-document links that exist in the repository
- resolves contradictions using source precedence instead of preserving competing standing rules
- deduplicates overlapping guidance across sections
- removes low-value, unstable, handbook-style, or adjacent-doc material that does not materially steer agent behavior
- keeps sections lean and behavior-layer focused rather than padded for surface completeness
- treats template examples and defaults as illustrative scaffolding, not automatic policy
- shows a full preview before any filesystem write and strips inference comments from the final file

---

## Interaction Principles

- **Parallel discovery.** When discovery is needed, spawn subagents at the same time. Do not scan config files one by one.
- **Conversational, not interrogative.** Bundle related questions into a single turn. Use natural language, not bullet-dump question lists.
- **Infer and confirm.** "You mentioned Husky — I'll assume the pre-commit hook runs `pnpm check`; can you confirm?" is better than asking from scratch.
- **Examples reduce ambiguity.** When asking about decision heuristics, offer concrete scenarios so the user can pattern-match.
- **Iterative.** Let the user amend answers before the final write.
- **Preview before writing.** Always show the full generated `AGENTS.md` or `CLAUDE.md` and get explicit confirmation before touching the filesystem.
- **Infer before asking, ask before omitting.** A file with explicit TODOs is actionable. A file with missing sections silently degrades every interaction it governs.
- **Proportionality matters.** Use the lightest workflow that still produces a reliable result. Narrow refreshes should stay narrow unless they expose wider drift.
- **Do not cross the layer boundary.** If the user volunteers stack facts during this interview, acknowledge them and note they belong in `openspec/config.yml` or `openspec/config.yaml`, not `AGENTS.md` or `CLAUDE.md`. Offer to run the `accelint-onboard-openspec` skill for that content.
- **Monorepo: reference, do not duplicate.** If a root-level `AGENTS.md` or `CLAUDE.md` exists, package-level files should reference it and add only what is specific to that package. Repeated instructions across root and package files inflate context on every agent invocation, so keep package files additive, not redundant.
- **Synthesize, then preview.** The user should review the cleaned final draft, not raw assembled notes.
