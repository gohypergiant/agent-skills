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

The skill detects file state, chooses the mode, scans for evidence, asks necessary questions, shows a preview, and writes after confirmation.

## How it works

**Phase 0: Scope and File Detection**
- Detect monorepo scope (root or package-level)
- Check whether ARCHITECTURE.md exists and follows template
- Choose mode: create, refresh, or restructure

**Phase 1: Discovery**
- Scan five domains in parallel when possible: project identity, tech stack, infrastructure, data stores, testing
- Infer from package.json, docker-compose.yml, IaC configs, CI workflows, ORM schemas
- Tag findings as `INFERRED [source]` or `UNKNOWN`

**Phase 2: Targeted Interview**
- Ask only about `UNKNOWN` fields (deployment, security, roadmap)
- Group related questions into conversational turns

**Phase 3: Preview and Write**
- Show complete ARCHITECTURE.md with inference source annotations
- Confirm before writing
- Strip annotations from final file
- Update agent behavior docs (AGENTS.md or CLAUDE.md) to reference the new file

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
- Add reference to ARCHITECTURE.md if missing

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

Current version: 1.1.2

See `CHANGELOG.md` for release history.

## License

Apache-2.0
