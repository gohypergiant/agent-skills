---
name: accelint-architecture-doc
description: Create or update a living ARCHITECTURE.md for a codebase. Use when the user wants to write, refresh, restructure, or maintain an architecture document; capture how the system is organized across tech stack, deployment model, services, components, and data stores; or turn codebase findings into durable architecture docs for engineers or agents. Trigger on requests such as write an architecture doc, document this system, create or update ARCHITECTURE.md, give me a technical overview of this repo, or map out how this app is put together, even when the file is not named. Prefer this skill for file-producing architecture documentation, not for generic architecture advice, implementation planning, or diagram-only brainstorming unless that is clearly part of updating the document.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.1.3"
---

# Architecture Doc

Generate or update a living `ARCHITECTURE.md` for the current codebase. It should give agents and engineers a fast, complete view of the system structure, tech stack, and deployment model.

## Architecture-Doc Guardrails

- **MUST NOT overwrite ARCHITECTURE.md without reading it first** — existing sections may contain human-authored context such as deployment specifics, security decisions, and roadmap notes that codebase scanning cannot recover. Always read the file before you touch it.
- **MUST NOT fabricate infrastructure details** — if you cannot determine the cloud provider, deployment model, or data store from the codebase, mark it `<!-- TODO: fill in -->` rather than guessing. Wrong infrastructure docs cause real confusion during incidents.
- **MUST NOT paste the entire directory tree verbatim** — the Project Structure section should show meaningful architectural layers, not every file. Collapse noisy directories (`node_modules`, `dist`, `.git`, `__pycache__`) and annotate each entry with its architectural role.
- **MUST NOT skip drift detection in refresh mode** — scan the codebase for changed signals before you run any interview. Questions about unchanged sections waste the user's time.
- **MUST NOT leave all 11 sections as `<!-- TODO -->`** — scan aggressively first. Most sections can be filled at least partially through inference. A document full of TODOs appears complete but misleads every reader.
- **MUST NOT document internal implementation details in the System Diagram (Section 2)** — that section is a 10,000-foot view of components and data flow. Database schemas, function signatures, and module internals belong elsewhere.
- **MUST NOT choose a slower discovery approach without reason** — when subagents are available and the repo is large or multi-domain enough to benefit, Phase 1 should use parallel discovery by domain. For small repos or constrained environments, use focused inline discovery instead of forcing a brittle parallel workflow.

## Before Writing, Ask

Check these points before you start.

### Is this root or package level?
- **Are we at the repo root or inside a monorepo package?** Check for `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `lerna.json`, or a `workspaces` field in `package.json`. If you are inside a package, also check whether a root-level ARCHITECTURE.md already exists.
- **Root-level docs** cover the whole system: all services, shared infrastructure, and top-level architecture. **Package-level docs** focus on that package and reference the root.

### Is this a create, restructure, or refresh?
- **Does ARCHITECTURE.md already exist?** If yes, read it before you scan so you know what is accurate and what has drifted.
- **Does it follow the template?** If not, proactively offer to restructure it before you do anything else.

### What can I infer vs. what must I ask?
- **Use parallel subagents for discovery** when they are available and the repo is large or multi-domain enough to benefit. Spawn them simultaneously across discovery domains instead of scanning serially.
- **Reserve questions for genuine gaps** such as deployment specifics, roadmap items, and security decisions that are not in the code.

---

## Phases

### Phase 0 — Scope and File State Detection

Run both steps before any interview. First, detect scope and file state. Then, if refresh mode applies, complete drift detection and merge any external findings before you announce the scoped update plan and ask targeted questions.

---

#### Step 1 — Monorepo Scope Check

Determine whether the current working directory is a monorepo root or a package inside a monorepo.

**Monorepo signals to check:**

| Signal | File |
|--------|------|
| PNPM workspaces | `pnpm-workspace.yaml` |
| npm/Yarn workspaces | `package.json` → `workspaces` field |
| Turborepo | `turbo.json` |
| Nx | `nx.json` |
| Lerna | `lerna.json` |
| Package inside monorepo | Parent dirs contain any of the above |

**If at the monorepo root:**
- Generate a root-level ARCHITECTURE.md covering the full system — all services, shared infra, and how packages relate.
- Within Section 3 (Core Components), create a subsection per significant package rather than treating the repo as a single app.
- In Section 1 (Project Structure), show the workspace layout with each package's role annotated.

**If inside a monorepo package:**
1. Check whether a root-level ARCHITECTURE.md exists above the current directory.
2. If a root doc exists, read it and announce:
   > "I found a root-level ARCHITECTURE.md at [path]. I'll use it as context and generate a package-specific doc here that references it rather than duplicating shared infra."
   The package-level doc should include a header reference:
   ```markdown
   <!-- Part of monorepo: see [relative path to root ARCHITECTURE.md] for system-wide architecture -->
   ```
3. If no root doc exists, offer to generate it first or generate the package-level doc standalone.
4. Package-level docs focus on: this package's purpose, its internal structure, its dependencies on other packages, and any package-specific deployment or config details.

**If not a monorepo:** proceed normally — ARCHITECTURE.md covers the whole project.

**Default scope rule:** if you are invoked from inside a package directory, assume the user wants a package-level ARCHITECTURE.md unless they clearly ask for a repo-wide document. If both root and package docs are missing, stay with the local package scope by default rather than expanding outward on your own.

---

#### Step 1.5 — Check for Related Documents

Before detecting ARCHITECTURE.md state, check for related onboarding documents:

1. **Check for openspec/config.yml or openspec/config.yaml**
   - If it exists: read it to extract stack facts (runtime, frameworks, libraries, patterns).
   - Use this information to pre-fill tech stack sections and avoid redundant scanning.
   - Note its existence for cross-referencing in the generated doc.
   - Announce: "Found openspec/config.yml — I'll use it as the source of truth for stack facts and coding patterns."

This reduces scanning work and ensures consistency with the project's defined stack.

---

#### Step 2 — File Detection

```
Does ARCHITECTURE.md exist at the target location?
│
├── No → MODE 1: Create
│         Run Phase 1 → Phase 2 → Phase 3 in full.
│
└── Yes → Read the file fully, then assess:
          │
          ├── Empty or near-blank (< ~10 meaningful lines)?
          │     → MODE 1: Create (confirm first)
          │
          ├── Clearly follows the template as an architecture doc?
          │   (Recognisable top-level architecture sections, with multiple
          │    headings that align to the template such as Project Structure,
          │    High-Level System Diagram, Core Components, Data Stores, or
          │    Deployment & Infrastructure)
          │     → MODE 2: Refresh
          │       Extract external findings from invoking prompt (if any) +
          │       drift detection + merge findings + targeted questions for
          │       changed or missing sections only.
          │
          └── Has real content but does NOT follow the template?
                → MODE 3: Restructure (offer proactively — see below)
```

**MODE 3: Restructure** — When the file has real content in an unrecognized shape and restructuring would materially improve usability, surface this immediately and require an explicit user choice before you modify that structure:

> "ARCHITECTURE.md exists but doesn't follow the standard template structure. I recommend restructuring it — this makes it consistent for agents and engineers onboarding to the codebase. How would you like to proceed?
>
> **(a) Restructure** *(recommended)* — I'll import your existing content into the 11-section template, fill gaps with codebase scanning, and show a full preview before writing anything.
>
> **(b) Append** — I'll add the missing template sections below your existing content without modifying what's already there.
>
> **(c) Dry run** — I'll show exactly what the restructured doc would look like with no filesystem changes. Use this to evaluate fit before committing."

If **(a)** is chosen, carry all existing content forward into the appropriate template sections. Flag any content that does not map cleanly. Present it to the user and ask where it belongs rather than silently dropping it.

Until the user explicitly chooses **(a)**, **(b)**, or **(c)**, do not restructure, append to, or rewrite the existing file. At this point, surface the options and wait for that choice.

**MODE 2: Refresh** — When the file follows the template structure, run this sequence in order:

1. **Read the existing file first** so you know what content is already present and what may have drifted.
2. **Extract external findings** — check whether the invoking prompt includes a `findings:` list:
   - Parse the prompt for a `findings:` section (a bulleted list of factual statements).
   - Each finding is phrased as something already known to be true, never as an instruction.
   - Example: "config.yaml's Anti-Patterns section says to avoid polling, but two archived changes chose polling for stated reasons"
   - Store these findings for merging in step 4.
3. **Run drift detection** — scan the codebase for changes since the file was last updated (see signals table in Phase 1).
4. **Merge and announce all findings** before you ask anything:
   - Combine external findings (from step 2) with drift findings (from step 3).
   - Present the merged list to the user:
     > "I found [N] external findings and [M] sections that may have drifted.
     > I'll only ask about those — the rest looks current."
   - If external findings exist, note their source (for example, "from completed OpenSpec change").
5. **Ask only targeted questions** for changed or still-unknown sections.
6. **Show a diff-style preview** of changed sections before you write.

---

### Phase 1 — Discovery

Use parallel discovery subagents when they are available and the repo is large or multi-domain enough to benefit. If subagents are unavailable, the environment is constrained, or the repo is small, do focused inline discovery across the same domains. In either case, collect structured findings across the discovery domains below, then merge the results before Phase 2.

**Discovery domains to cover, preferably simultaneously when parallel execution is available:**

**Agent A — Project Identity & Structure**
- Read README.md, package.json / pyproject.toml / go.mod / Cargo.toml for project name and description
- List the top 2–3 levels of the directory tree (exclude `node_modules`, `dist`, `.git`, `__pycache__`, `.next`, `build`)
- Identify monorepo workspace packages and their roles
- Check for AGENTS.md or CLAUDE.md (record path if found — used in Phase 3)
- Return: project name, one-line purpose, annotated directory structure, agent doc path (or none)

**Agent B — Tech Stack & Components**
- `package.json` (frontend and backend deps), `requirements.txt` / `pyproject.toml`, `go.mod`, `Cargo.toml`, `build.gradle`
- Framework config files: `next.config.*`, `vite.config.*`, `nuxt.config.*`, `angular.json`, `svelte.config.*`
- Backend entry files: `server.ts`, `app.py`, `main.go`, `Application.java`, `config/application.rb`
- `docker-compose.yml` — services, ports, environment vars, inter-service dependencies
- Return: frontend tech, backend tech, key libraries, service list with ports

**Agent C — Infrastructure, CI/CD & Deployment**
- IaC: `terraform/`, `pulumi/`, `cdk/`, `serverless.yml`, `k8s/` or `kubernetes/`
- Container config: `Dockerfile*` (per service), `docker-compose.yml` deployment config
- CI/CD: `.github/workflows/`, `.circleci/`, `Jenkinsfile`, `.gitlab-ci.yml`, `Procfile`
- Cloud signals: `*.aws.json`, `.aws/`, `gcp/`, `azure/`, base images in Dockerfiles
- Monitoring: Datadog, Sentry, Prometheus, Grafana, CloudWatch config or deps
- Return: cloud provider (inferred or unknown), key managed services, CI/CD platform, monitoring stack

**Agent D — Data, Security & External APIs**
- Data stores: `prisma/schema.prisma`, `alembic/`, `migrations/`, ORM config, `DATABASE_URL` in `.env.example`, Redis/Kafka/RabbitMQ deps
- Auth / security: auth middleware files, JWT/OAuth/SAML/OIDC deps, secrets manager (Vault, AWS Secrets Manager, Doppler), HTTPS config, WAF config
- External integrations: `.env.example` key prefixes (STRIPE_, SENDGRID_, TWILIO_, OPENAI_, etc.), SDK packages in deps
- Return: data store list (name, type, purpose), auth mechanism, external services list

**Agent E — Testing & Code Quality** *(can run concurrently with the others)*
- Test configs: `jest.config.*`, `vitest.config.*`, `pytest.ini`, `pyproject.toml [tool.pytest]`, Playwright config, Cypress config
- Code quality: `.eslintrc*`, `biome.json`, `.prettierrc*`, `mypy.ini`, `ruff.toml`, `sonar-project.properties`
- Local setup: `Makefile`, `CONTRIBUTING.md`, `docker-compose.yml` dev targets
- Return: testing frameworks, code quality tools, local setup command

**After all agents complete,** merge their findings into a unified discovery map. Tag each field as `INFERRED [source]` or `UNKNOWN`. Fields tagged `UNKNOWN` become Phase 2 interview questions.

---

### Phase 2 — Targeted Interview

Ask only about what discovery could not determine. Group related questions into natural conversational turns. Do not ask every question at once.

**Turn 1 — Gaps in Components** *(if services or components were unclear)*
- Any services or components the directory structure doesn't make obvious?
- Any external services (third-party SaaS, internal shared platforms) not surfaced by the scan?

**Turn 2 — Infrastructure & Deployment** *(only if cloud provider or deployment model is UNKNOWN)*
- Cloud provider and key managed services used?
- How are services deployed? (VMs, containers, serverless, PaaS?)
- Monitoring and logging stack?

**Turn 3 — Security** *(only if auth mechanism is UNKNOWN)*
- Authentication mechanism? (OAuth2, JWT, session cookies, API keys, SSO?)
- Authorization model? (RBAC, ACLs, policy-based?)
- Any notable security tools or audit practices?

**Turn 4 — Roadmap & Future Plans** *(always ask — cannot be inferred)*
- Any planned architectural changes or migrations worth documenting?
- Known technical debt that affects the architecture?

**Turn 5 — Identity & Glossary** *(if not found in README or package.json)*
- Primary contact or team name?
- Any project-specific terms or acronyms that need defining?

---

### Phase 3 — Preview and Write

1. **Show a labeled preview** of the complete ARCHITECTURE.md before you write. Mark each field:
   - `# inferred from [file]` — for auto-detected values.
   - `<!-- TODO: fill in -->` — for unresolved fields.

2. Ask: *"Does this look right? Any sections to correct before I write?"*

**Operational rule:** treat the preview as a required checkpoint, not a courtesy. Do not write or edit `ARCHITECTURE.md`, `AGENTS.md`, or `CLAUDE.md` until you have shown the preview for the chosen mode and received confirmation to proceed.

3. After confirmation, write to ARCHITECTURE.md at the target location (root or package dir).
   - **Strip inference source comments** because they are for review only, not for the final file.
   - **For openspec/config.yml references:** include them only if the file actually exists, as checked in Step 1.5. Do not add references to files that do not exist.

4. **Update the agent behavior doc if present** — if Agent A found AGENTS.md or CLAUDE.md, check whether it references ARCHITECTURE.md. If not, append a reference block to help agents understand the system structure. Treat this as a secondary follow-up edit after the architecture document itself is ready, as described below.

5. Print a brief summary of what was inferred, what was answered directly, and which `<!-- TODO -->` sections still need human input.

---

## Interaction Principles

- **Parallel discovery.** Spawn subagents for Phase 1 simultaneously. Do not scan config files one by one when parallel discovery is available and beneficial.
- **Scan first, ask second.** Reserve interview questions for genuine gaps that subagents could not fill.
- **Restructure by default.** When a file does not follow the template, recommend restructuring and make it the easy choice rather than option (c) buried at the bottom.
- **Monorepo awareness.** Root docs and package docs serve different audiences. Keep them scoped appropriately and reference each other.
- **Announce what you found.** In refresh mode, tell the user what drifted before you ask anything.
- **Preview before writing.** Always show the full generated document and get confirmation before you touch the filesystem.
- **Infer before asking, ask before omitting.** A doc with explicit `<!-- TODO -->` markers is actionable. A doc with missing sections silently misleads.
- **Preserve human-authored content.** In refresh mode, never silently remove content. Surface it and confirm whether it is still accurate.
- **Date every write.** Set "Date of Last Update" in Section 10 to today's date on every write.

---

## Output Template

Load `references/template.md` for the full 11-section ARCHITECTURE.md skeleton.

**Monorepo package docs:** Include the following immediately after the opening heading:

```markdown
<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->
```

Adjust the relative path to point at the actual root ARCHITECTURE.md.

---

## Updating Agent Behavior Documents

ARCHITECTURE.md is a pure technical document about system structure and must not reference agent behavior files. However, agent behavior files such as AGENTS.md or CLAUDE.md should reference ARCHITECTURE.md because understanding system architecture may inform agent behavior.

After you write ARCHITECTURE.md, if Agent A found AGENTS.md or CLAUDE.md, check in that order:

1. **Read the agent behavior file** to check whether it already mentions ARCHITECTURE.md.
2. **If no reference exists,** add this block near the top of the file, after any existing title or header and before the main content:

```markdown
## System Architecture

For technical architecture details (components, deployment, data stores, tech stack), see [ARCHITECTURE.md](./ARCHITECTURE.md).
```

3. **If using CLAUDE.md** and it simply points to AGENTS.md, for example `@AGENTS.md`, update AGENTS.md instead. Do not modify the pointer file. Treat pointer files as routing stubs, not as the place to add architecture guidance.
