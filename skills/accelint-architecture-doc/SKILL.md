---
name: accelint-architecture-doc
description: Generate or update an ARCHITECTURE.md living document for any codebase. Use this skill whenever a user mentions "architecture.md", "ARCHITECTURE.md", "document my architecture", "architecture overview", "system architecture", "generate architecture doc", "create architecture file", "update architecture", "architecture diagram", or wants a technical overview of how their project is structured. Make sure to use this skill whenever users want to document how their system works — even if they phrase it as "write up the system", "document the tech stack", "create a technical overview", or "help me describe the architecture". Always prefer this skill over ad-hoc architecture documentation.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.0.0"
---

# Architecture Doc

Generate or update a living `ARCHITECTURE.md` for the current codebase — a document that gives agents and engineers an instant, complete picture of how the system is structured, what it uses, and how it deploys.

## NEVER Do When Writing Architecture Docs

- **NEVER overwrite ARCHITECTURE.md without reading it first** — existing sections contain human-authored context (deployment specifics, security decisions, roadmap notes) that codebase scanning cannot recover. Always read before touching.
- **NEVER fabricate infrastructure details** — if you cannot determine the cloud provider, deployment model, or data store from the codebase, mark it `<!-- TODO: fill in -->` rather than guessing. Wrong infrastructure docs cause real confusion during incidents.
- **NEVER paste the entire directory tree verbatim** — the Project Structure section should show meaningful architectural layers, not every file. Collapse noisy directories (`node_modules`, `dist`, `.git`, `__pycache__`) and annotate each entry with its architectural role.
- **NEVER skip drift detection in refresh mode** — scan the codebase for changed signals before running any interview. Asking questions about unchanged sections wastes the user's time.
- **NEVER leave all 11 sections as `<!-- TODO -->`** — scan aggressively first. Most sections can be at least partially filled through inference. A document full of TODOs appears complete but misleads every reader.
- **NEVER document internal implementation details in the System Diagram (Section 2)** — that section is a 10,000-foot view of components and data flow. Database schemas, function signatures, and module internals belong elsewhere.
- **NEVER run discovery serially when subagents are available** — Phase 1 spawns parallel subagents for different discovery domains. Serial scanning wastes time on codebases with many config files spread across directories.

## Before Writing, Ask

### Is this root or package level?
- **Are we at the repo root or inside a monorepo package?** Check for `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `lerna.json`, or `workspaces` field in `package.json`. If inside a package, check whether a root-level ARCHITECTURE.md already exists.
- **Root-level docs** cover the whole system — all services, shared infra, top-level architecture. Package-level docs focus on that package and reference the root.

### Is this a create, restructure, or refresh?
- **Does ARCHITECTURE.md already exist?** If yes, read it before scanning — understand what's accurate vs. drifted.
- **Does it follow the template?** If not, proactively offer to restructure it before doing anything else.

### What can I infer vs. what must I ask?
- **Use parallel subagents for discovery.** Spawn them simultaneously across discovery domains — don't scan serially.
- **Reserve questions for genuine gaps** — deployment specifics, roadmap items, and security decisions that aren't in the code.

---

## Phases

### Phase 0 — Scope and File State Detection

Run both steps before any scanning or interview. Announce findings and confirm mode with the user.

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
          ├── Follows the template structure?
          │   (Has ≥3 of: ## 1. Project Structure, ## 2. High-Level
          │    System Diagram, ## 3. Core Components, ## 4. Data Stores,
          │    ## 6. Deployment & Infrastructure)
          │     → MODE 2: Refresh
          │       Drift detection + targeted questions for changed or
          │       missing sections only.
          │
          └── Has real content but does NOT follow the template?
                → MODE 3: Restructure (offer proactively — see below)
```

**MODE 3: Restructure** — When the file has real content in an unrecognised shape, surface this immediately and offer options before doing anything else:

> "ARCHITECTURE.md exists but doesn't follow the standard template structure. I recommend restructuring it — this makes it consistent for agents and engineers onboarding to the codebase. How would you like to proceed?
>
> **(a) Restructure** *(recommended)* — I'll import your existing content into the 11-section template, fill gaps with codebase scanning, and show a full preview before writing anything.
>
> **(b) Append** — I'll add the missing template sections below your existing content without modifying what's already there.
>
> **(c) Dry run** — I'll show exactly what the restructured doc would look like with no filesystem changes. Use this to evaluate fit before committing."

If **(a)** is chosen: carry all existing content forward into the appropriate template sections. Flag any content that doesn't map cleanly — present it to the user and ask where it belongs rather than silently dropping it.

---

### Phase 1 — Parallel Discovery via Subagents

Spawn discovery subagents in parallel — don't scan serially. Each agent focuses on one domain and returns structured findings. Wait for all agents to complete, then merge results before Phase 2.

**Spawn these agents simultaneously:**

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

**After all agents complete:** merge their findings into a unified discovery map. Tag each field as `INFERRED [source]` or `UNKNOWN`. Fields tagged `UNKNOWN` become Phase 2 interview questions.

---

### Phase 2 — Targeted Interview

Ask only about what discovery couldn't determine. Group related questions into natural conversational turns — never dump all questions at once.

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

1. **Check for agent behavior doc** — if Agent A found AGENTS.md or CLAUDE.md, prepare a reference block for inclusion at the top of ARCHITECTURE.md (see template note below).

2. **Show a labeled preview** of the complete ARCHITECTURE.md before writing. Mark each field:
   - `# inferred from [file]` — for auto-detected values
   - `<!-- TODO: fill in -->` — for unresolved fields

3. Ask: *"Does this look right? Any sections to correct before I write?"*

4. After confirmation, write to ARCHITECTURE.md at the target location (root or package dir), **stripping inference source comments** — they are for review only, not the final file.

5. Print a brief summary: what was inferred, what was answered directly, which `<!-- TODO -->` sections still need human input.

---

## Interaction Principles

- **Parallel discovery.** Spawn subagents for Phase 1 simultaneously — don't scan config files one-by-one.
- **Scan first, ask second.** Reserve interview questions for genuine gaps that subagents couldn't fill.
- **Restructure by default.** When a file doesn't follow the template, recommend restructuring and make it the easy choice — not option (c) buried at the bottom.
- **Monorepo awareness.** Root docs and package docs serve different audiences. Keep them scoped appropriately and reference each other.
- **Announce what you found.** In refresh mode, tell the user what drifted before asking anything.
- **Preview before writing.** Always show the full generated document and get confirmation before touching the filesystem.
- **Infer before asking, ask before omitting.** A doc with explicit `<!-- TODO -->` markers is actionable. A doc with missing sections silently misleads.
- **Preserve human-authored content.** In refresh mode, never silently remove content — surface it and confirm whether it's still accurate.
- **Date every write.** Set "Date of Last Update" in Section 10 to today's date on every write.

---

## Output Template

Load `references/template.md` for the full 11-section ARCHITECTURE.md skeleton.

**Agent behavior doc reference:** If AGENTS.md or CLAUDE.md was found (checked in that order), include this block immediately after the opening `# Architecture Overview` heading:

```markdown
> **Agent Behavior:** See [AGENTS.md](./AGENTS.md) for how AI agents should behave when working in this codebase.
```

(Use `CLAUDE.md` in the link if only CLAUDE.md was found. Omit the block if neither file exists.)

**Monorepo package docs:** Include the following immediately after the opening heading:

```markdown
<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->
```

Adjust the relative path to point at the actual root ARCHITECTURE.md.
