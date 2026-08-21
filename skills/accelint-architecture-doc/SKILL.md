---
name: accelint-architecture-doc
description: Create or update a living ARCHITECTURE.md for a codebase. Use when the user wants to write, refresh, restructure, or maintain an architecture document; document how the system is organized across tech stack, deployment model, services, components, and data stores; or turn codebase findings into durable architecture docs for engineers or agents. Trigger on requests such as write an architecture doc, document this system, create or update ARCHITECTURE.md, give me a technical overview of this repo, or map out how this app is put together, even when the file is not named. Prefer this skill for file-producing architecture documentation, not for generic architecture advice, implementation planning, or diagram-only brainstorming unless that work is clearly part of updating the document.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.2.1"
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
- **MUST use parallel subagents for Stage 2 discovery when subagents are available** — spawn them simultaneously across discovery domains. Do not scan serially. If subagents are unavailable, use focused inline discovery instead.

## Before Writing, Ask

Check these points before you start.
Do them in order.

### Is this root or package level?
- **Are we at the repo root or inside a monorepo package?** Check for `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `lerna.json`, or a `workspaces` field in `package.json`. If you are inside a package, also check whether a root-level ARCHITECTURE.md already exists.
- **Root-level docs** cover the whole system: all services, shared infrastructure, and top-level architecture. **Package-level docs** focus on that package and reference the root.

### Is this a create, restructure, or refresh?
- **Does ARCHITECTURE.md already exist?** If yes, read it before you scan so you know what is accurate and what has drifted.
- **Does it follow the template?** If not, proactively offer to restructure it before you modify the file structure.

### What can I infer vs. what must I ask?
- **Use parallel subagents for discovery** when subagents are available. Spawn them simultaneously across discovery domains. Do not scan serially. If subagents are unavailable, use focused inline discovery instead.
- **Reserve questions for genuine gaps** such as deployment specifics, roadmap items, and security decisions that are not in the code.

## Workflow

## Stage 0: Track progress

Purpose: keep workflow state visible during create, refresh, or restructure handling.

### Step 0: Start progress tracking
Do this before any other stage work when the task requires create, refresh, or restructure handling.
Create a short progress checklist in your working state or reply. Update it after each stage.

- [ ] Step 1: Detect scope and related files
- [ ] Step 2: Detect mode and apply the correct gate
- [ ] Step 3: Run discovery and merge findings
- [ ] Step 4: Ask the targeted interview questions
- [ ] Step 5: Show the preview and wait for confirmation
- [ ] Step 6: Write the approved files and summarize open TODOs

Done when: the checklist exists and will be updated after each stage.

## Stage 1: Scope and mode detection

Purpose: determine scope, detect related files, and activate the correct mode gate before discovery or interview work begins.

### Step 1: Detect scope and related files
Determine whether the current working directory is a monorepo root or a package inside a monorepo.
Do this before you detect mode.

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

#### Step 1.1: Check for related documents
Requires: Step 1 scope detection is complete.

Do this before you detect `ARCHITECTURE.md` state.

1. **Check for `openspec/config.yml` or `openspec/config.yaml`.**
   - If the file exists, read it to extract stack facts such as runtime, frameworks, libraries, and patterns.
   - Use those facts to pre-fill tech stack sections and reduce redundant scanning.
   - Note the file for cross-referencing in the generated doc.
   - Announce: "Found openspec/config.yml — I'll use it as the source of truth for stack facts and coding patterns."

This step reduces scanning work and helps keep the doc consistent with the project's defined stack.

Done when: you know whether `openspec/config.yml` or `openspec/config.yaml` exists and have read it if present.

### Step 2: Detect mode and apply the correct gate
Requires: Step 1 and Step 1.1 are complete.

Classify the task in this order:

1. Check whether `ARCHITECTURE.md` exists at the target location.
   - If no, enter **MODE 1: Create** and continue to Stage 2 → Stage 3 → Stage 4 in full.
2. If yes, read the file fully before you classify it.
3. Classify the existing file:
   - **Empty or near-blank** (`< ~10 meaningful lines`) → **MODE 1: Create** `(confirm first)`
   - **Clearly follows the template as an architecture doc** — recognizable top-level architecture sections, with multiple headings that align to the template, such as Project Structure, High-Level System Diagram, Core Components, Data Stores, or Deployment & Infrastructure → **MODE 2: Refresh**
   - **Has real content but does NOT follow the template** → **MODE 3: Restructure** `(offer proactively — see below)`

**MODE 3: Restructure** — When the file has real content in an unrecognized shape and restructuring would materially improve usability, surface this immediately. Require an explicit user choice before you modify that structure:

> "ARCHITECTURE.md exists but doesn't follow the standard template structure. I recommend restructuring it — this makes it consistent for agents and engineers onboarding to the codebase. How would you like to proceed?
>
> **(a) Restructure** *(recommended)* — I'll import your existing content into the 11-section template, fill gaps with codebase scanning, and show a full preview before writing anything.
>
> **(b) Append** — I'll add the missing template sections below your existing content without modifying what's already there.
>
> **(c) Dry run** — I'll show exactly what the restructured doc would look like with no filesystem changes. Use this to evaluate fit before committing."

If **(a)** is chosen, carry all existing content forward into the appropriate template sections. Flag any content that does not map cleanly. Present it to the user and ask where it belongs rather than silently dropping it.

If MODE 3 applies, stop here after you present options **(a)**, **(b)**, and **(c)**. Do not restructure, append to, or rewrite the existing file until the user explicitly chooses one option.

**MODE 2: Refresh** — When the file follows the template structure, run this sequence in order:

1. **Read the existing file first** so you know what content is already present and what may have drifted.
2. **Extract external findings.** Check whether the invoking prompt includes a `findings:` list.
   - Parse the prompt for a `findings:` section. It must be a bulleted list of factual statements.
   - Each finding is phrased as something already known to be true, never as an instruction.
   - Example: "config.yaml's Anti-Patterns section says to avoid polling, but two archived changes chose polling for stated reasons"
   - Store these findings for merging in step 4.
3. **Run drift detection** by scanning the codebase for changes since the file was last updated. Use the signals table in Stage 2.
4. **Merge and announce all findings** before you ask anything.
   - Combine external findings from step 2 with drift findings from step 3.
   - Present the merged list to the user:
     > "I found [N] external findings and [M] sections that may have drifted.
     > I'll only ask about those — the rest looks current."
   - If external findings exist, note their source, for example, "from completed OpenSpec change".
5. **Ask only targeted questions** for changed or still-unknown sections.
   - In refresh mode, ask Turn 4 only if the roadmap or future-plans content is missing, stale, or user-signaled as changed.
6. **Show a diff-style preview** of changed sections before you write.

Done when: you know whether the task is Create, Refresh, or Restructure, and any required wait state or approval gate is active before later stages begin.

## Stage 2: Discovery

Purpose: build a merged discovery map before you ask the user about missing facts.

Stage rules:
- Use parallel subagents when subagents are available.
- Spawn them simultaneously across discovery domains. Do not scan serially.
- If subagents are unavailable, use focused inline discovery instead.
- Merge the results before Stage 3.

### Step 3: Run discovery and merge findings
Requires: Step 2 is complete, and any MODE 3 wait state has been resolved.

Collect structured findings across the discovery domains below.
Do not start Stage 3 until you have merged the discovery results.

**Discovery domains to cover simultaneously when subagents are available:**

**Agent A — Project Identity & Structure**
- Read README.md, package.json / pyproject.toml / go.mod / Cargo.toml for project name and description
- List the top 2–3 levels of the directory tree (exclude `node_modules`, `dist`, `.git`, `__pycache__`, `.next`, `build`)
- Identify monorepo workspace packages and their roles
- Check for AGENTS.md or CLAUDE.md (record path if found — used in Stage 4)
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

After all agents complete, merge their findings into a unified discovery map. Tag each field as `INFERRED [source]` or `UNKNOWN`. Fields tagged `UNKNOWN` become Stage 3 interview questions.
Do not ask interview questions until this merged map exists.

Done when: you have one merged discovery map and know which fields still require interview questions.

## Stage 3: Targeted interview

Purpose: resolve only the gaps that discovery could not determine.

Stage rule:
- Ask only about missing information. Do not ask every question at once.

### Step 4: Ask the targeted interview questions
Requires: Step 3 is complete.

Group related questions into natural conversational turns.
Ask only the turns that match remaining gaps.

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

Done when: every remaining gap is answered, or the unresolved gap is represented as `<!-- TODO: fill in -->` in the preview.

## Stage 4: Preview and write

Purpose: require a preview checkpoint before any write, then write approved files and summarize open TODOs.

Stage rule:
- Treat the preview as a required checkpoint, not a courtesy.

### Step 5: Show the preview and wait for confirmation
Requires: Step 4 is complete, or Step 3 already resolved all unknowns.

1. **Show a labeled preview** of the complete `ARCHITECTURE.md` before you write.
   - Mark auto-detected values as `# inferred from [file]`.
   - Mark unresolved fields as `<!-- TODO: fill in -->`.
2. Ask: *"Does this look right? Any sections to correct before I write?"*
3. Wait for explicit confirmation.

Do not write or edit `ARCHITECTURE.md`, `AGENTS.md`, or `CLAUDE.md` until you have shown the preview for the chosen mode and received confirmation to proceed.
Do not treat silence, partial feedback, or implied approval as confirmation.

Done when: the user has reviewed the preview and explicitly confirmed that you may write.

### Step 6: Write the approved files and summarize open TODOs
Requires: Step 5 is complete.

1. Write `ARCHITECTURE.md` at the target location, root or package dir.
   - **Strip inference source comments** because they are for review only, not for the final file.
   - **For openspec/config.yml references:** include them only if the file actually exists, as checked in Step 1.1. Do not add references to files that do not exist.
2. **Update the agent behavior doc if present.** If Agent A found `AGENTS.md` or `CLAUDE.md`, check whether it references `ARCHITECTURE.md`. If not, append a reference block to help agents understand the system structure. Treat this as a secondary follow-up edit after the architecture document itself is ready, as described below.
3. Print a brief summary of what was inferred, what was answered directly, and which `<!-- TODO -->` sections still need human input.

Done when: the approved files are written and the remaining TODOs are summarized.

## Interaction Principles

- **Parallel discovery.** When subagents are available, spawn them for Stage 2 simultaneously. Do not scan config files one by one in that case.
- **Scan first, ask second.** Reserve interview questions for genuine gaps that subagents could not fill.
- **Restructure by default.** When a file does not follow the template, recommend restructuring and make it the easy choice rather than option (c) buried at the bottom.
- **Monorepo awareness.** Root docs and package docs serve different audiences. Keep them scoped appropriately and reference each other.
- **Announce what you found.** In refresh mode, tell the user what drifted before you ask anything.
- **Preview before writing.** Always show the full generated document and get confirmation before you touch the filesystem.
- **Infer before asking, ask before omitting.** A doc with explicit `<!-- TODO -->` markers is actionable. A doc with missing sections silently misleads.
- **Preserve human-authored content.** In refresh mode, never silently remove content. Surface it and confirm whether it is still accurate.
- **Date every write.** Set "Date of Last Update" in Section 10 to today's date on every write.

## Output Template

Load `references/template.md` for the full 11-section ARCHITECTURE.md skeleton.

**Monorepo package docs:** Include the following immediately after the opening heading:

```markdown
<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->
```

Adjust the relative path to point at the actual root ARCHITECTURE.md.

## Updating Agent Behavior Documents

`ARCHITECTURE.md` is a technical document about system structure. Do not reference agent behavior files from it. Agent behavior files such as `AGENTS.md` or `CLAUDE.md` should reference `ARCHITECTURE.md` because system structure may inform agent behavior.

After you write `ARCHITECTURE.md`, if Agent A found `AGENTS.md` or `CLAUDE.md`, do this in order:

1. **Read the agent behavior file** and check whether it already mentions `ARCHITECTURE.md`.
2. **If using `CLAUDE.md`** and it simply points to `AGENTS.md`, for example `@AGENTS.md`, update `AGENTS.md` instead. Do not modify the pointer file. Treat pointer files as routing stubs, not as the place to add architecture guidance.
3. **If no `ARCHITECTURE.md` reference exists,** add or update a `## Related Documentation` section that follows the same structure used by `accelint-onboard-agents` (bottom of file):

```markdown
## Related Documentation

- **ARCHITECTURE.md** — System architecture, deployment overview, component interactions
  _(Reference this when behavioral decisions depend on understanding system structure)_
```

4. **Keep the section format exact.** Use the title `## Related Documentation`. Format each entry as:

```markdown
- **<filename>** — description
  _(Condition or scenario by which this file is used)_
```

5. **If a `## Related Documentation` section already exists,** add the `ARCHITECTURE.md` entry to that list instead of creating a duplicate section. Preserve the existing list style. Keep the explanatory usage note on its own indented line.
6. **If no real agent behavior file exists,** do not create one as part of this skill. Limit the write to the approved architecture document.

Done when: the architecture guidance lives in the real agent behavior file, uses the `## Related Documentation` structure, and does not modify a pointer stub.
