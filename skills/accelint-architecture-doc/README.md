# accelint-architecture-doc

Create or update ARCHITECTURE.md by scanning the codebase, asking targeted questions only about gaps, and writing structured documentation after preview and confirmation.

Three modes:
- **Create** — new ARCHITECTURE.md from scratch
- **Refresh** — update existing file based on drift
- **Restructure** — import unstructured content into standard template

## Installation

Install this skill using the skills CLI:

```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-architecture-doc
```

```bash
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-architecture-doc
```

Select `accelint-architecture-doc` when prompted.

## Usage

Usage examples:

```
Create an ARCHITECTURE.md for this repo
```

```
Update ARCHITECTURE.md to reflect the new Redis caching layer
```

```
Restructure our architecture doc into the standard template
```

The skill detects file state, chooses the mode, scans for evidence, asks only necessary questions, shows a preview, and writes after confirmation.

## How it works

### Step 0: Track progress
For create, refresh, or restructure workflows, start with a short checklist and update it after each major step.

### Step 1: Detect scope and related files
1. Detect monorepo scope, root or package-level.
2. Check for `openspec/config.yml` or `openspec/config.yaml` before mode detection.

### Step 2: Detect mode and apply the correct gate
1. Check whether `ARCHITECTURE.md` exists and follows the template.
2. Choose mode: create, refresh, or restructure.
3. In restructure mode, stop and wait for the user's explicit `(a)`, `(b)`, or `(c)` choice before you modify the file structure.

### Step 3: Run discovery and merge findings
1. When subagents are available, scan the discovery domains in parallel. Do not scan serially in that case. If subagents are unavailable, use focused inline discovery instead.
2. Infer from `package.json`, `docker-compose.yml`, IaC configs, CI workflows, ORM schemas, auth files, and integration signals.
3. Merge the results before you start the interview.
4. Tag findings as `INFERRED [source]` or `UNKNOWN`.

### Step 4: Ask the targeted interview questions
1. Ask only about `UNKNOWN` fields and confirmed drift gaps.
2. Group related questions into conversational turns.
3. Ask only the turns that match remaining gaps.

### Step 5: Show the preview and wait for confirmation
1. Show the complete `ARCHITECTURE.md` with inference source annotations.
2. Treat the preview as a required checkpoint, not a courtesy.
3. Wait for explicit confirmation before you write.

### Step 6: Write the approved files and summarize open TODOs
1. Confirm before writing.
2. Strip annotations from the final file.
3. Update the real agent behavior file, `AGENTS.md` or `CLAUDE.md`, to reference the new file when needed. If `CLAUDE.md` is only a pointer stub to `AGENTS.md`, update `AGENTS.md` instead and do not modify the pointer file. Do not create a new agent behavior file as part of this skill.

## Output structure

Output is an 11-section document:

1. Project Structure
2. High-Level System Diagram
3. Core Components
4. Data Stores
5. External Integrations / APIs
6. Deployment & Infrastructure
7. Security Considerations
8. Development & Testing Environment
9. Future Considerations / Roadmap
10. Project Identification
11. Glossary / Acronyms

See `references/template.md` for the full skeleton.

## Features

**Monorepo support**
- Root-level docs cover the full system
- Package-level docs reference the root and focus on package scope

**Drift detection**
- Scan for new dependencies, services, IaC changes, CI/CD updates, data stores, security changes, testing updates, monitoring additions
- Present detected changes before asking questions

**External findings support**
- Accept `findings:` list from invoking prompt
- Merge external findings with drift detection
- Used for doc updates after completed OpenSpec changes

**Agent behavior integration**
- Check for AGENTS.md or CLAUDE.md
- Add a reference to ARCHITECTURE.md if the real agent behavior file exists and the reference is missing
- Do not create a new agent behavior file as part of this skill

**OpenSpec awareness**
- Read openspec/config.yml or openspec/config.yaml when present
- Use as source of truth for stack facts and coding patterns
- Reduce redundant scanning

## Examples

**Create mode:**
```
Create an ARCHITECTURE.md for this Next.js app
```
→ Scans the codebase, asks about deployment and roadmap, shows preview, writes file

**Refresh mode:**
```
Update ARCHITECTURE.md — we added a worker service and Redis
```
→ Detects changes, asks targeted questions, shows diff-style preview, updates file

**Restructure mode:**
```
Our ARCHITECTURE.md is messy. Can you clean it up?
```
→ Offers restructure/append/dry-run options, maps existing content to template sections, fills gaps, shows preview

**Monorepo root:**
```
Generate root ARCHITECTURE.md for this monorepo
```
→ Produces a repo-wide doc with package-aware component coverage

**Monorepo package:**
```
Create ARCHITECTURE.md for packages/web
```
→ Generates package-level doc that references root ARCHITECTURE.md

**With external findings:**
```
Refresh ARCHITECTURE.md. Findings: - Auth migrated from sessions to JWT. - Worker switched from BullMQ to Redis streams.
```
→ Merges findings with drift detection, scopes questions accordingly

## Testing

The skill includes 11 eval scenarios in `evals/evals.json` covering create, refresh, restructure, monorepo, OpenSpec-aware, and agent-doc integration workflows.

## Version

Current version: 1.2.0

See `CHANGELOG.md` for release history.

## License

Apache-2.0