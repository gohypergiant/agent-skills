# accelint-architecture-doc

Generate or update a living ARCHITECTURE.md document that gives agents and engineers a clear picture of how your system works.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [What is this?](#what-is-accelint-architecture-doc)
- [How it works](#how-it-works)
- [Usage modes](#usage-modes)
- [Output format](#output-format)
- [Advanced features](#advanced-features)
- [Examples](#examples)
- [License](#license)

## Installation

Install this skill using the skills CLI:

```bash
npx skills add https://github.com/accelint/agent-skills --skill accelint-architecture-doc
```

Once installed, invoke it in Claude Code with `/accelint-architecture-doc`.

## Quick Start

The simplest use case - creating a new ARCHITECTURE.md:

```bash
/accelint-architecture-doc
```

That's it. The skill detects whether you need to create a new file, refresh an existing one, or restructure non-standard documentation. It scans your codebase, asks targeted questions about what it couldn't infer, shows you a preview, and writes the file only after confirmation.

## What is accelint-architecture-doc?

This skill generates ARCHITECTURE.md files. Think of them as living documents that capture:

- Project structure and directory layout
- Tech stack (frameworks, languages, key libraries)
- System components (frontend, backend services, workers)
- Data stores (databases, caches, queues)
- External integrations and APIs
- Infrastructure, deployment, and monitoring setup
- Security model (auth, authorization, encryption)
- Testing and development environment
- Future roadmap and known technical debt

Two groups benefit from this:

**AI agents** get context about the codebase without scanning hundreds of files. **Engineers** get onboarding material and a single source of truth for architectural decisions.

## How It Works

The skill operates in three phases:

### Phase 0: Scope and File State Detection

Before scanning anything, the skill checks:

1. **Monorepo detection** - figures out if you're at the repo root or inside a package, then adjusts scope
2. **File state** - checks if ARCHITECTURE.md exists and whether it follows the standard template

Based on what it finds, it picks one of three modes:

| Mode | When | What It Does |
|------|------|-------------|
| **Create** | No ARCHITECTURE.md exists | Full scan → interview → preview → write |
| **Refresh** | File exists and follows template | Drift detection → targeted updates → preview → write |
| **Restructure** | File exists but doesn't match template | Offers to import existing content into standard structure |

### Phase 1: Parallel Discovery

If the file needs creation or a full refresh, the skill spawns five parallel subagents to scan different discovery domains:

- **Agent A** - Project identity and structure
- **Agent B** - Tech stack and components
- **Agent C** - Infrastructure, CI/CD, and deployment
- **Agent D** - Data stores, security, and external APIs
- **Agent E** - Testing and code quality

Each agent scans specific files (package.json, docker-compose.yml, IaC configs, etc.) and returns structured findings. The skill merges these into a unified discovery map and tags each field as either `INFERRED [source]` or `UNKNOWN`.

### Phase 2: Targeted Interview

The skill only asks about `UNKNOWN` fields. Questions come in groups:

1. Gaps in components (if the service list looks incomplete)
2. Infrastructure and deployment (if cloud provider or deployment model isn't clear)
3. Security (if auth mechanism is unknown)
4. Roadmap and future plans (always asked, since code can't tell us this)
5. Identity and glossary (if not found in README or package.json)

Well-documented codebases: 2-3 questions. Fresh projects with minimal config: 6-8 questions.

### Phase 3: Preview and Write

You see the complete ARCHITECTURE.md before anything gets written. Inference sources are marked inline:

```markdown
**Cloud Provider:** AWS # inferred from Dockerfile base image and .aws/ directory
**CI/CD Pipeline:** GitHub Actions # inferred from .github/workflows/deploy.yml
**Monitoring & Logging:** <!-- TODO: fill in -->
```

After you confirm, the skill writes the final file without the source annotations.

## Usage Modes

### Mode 1: Create (New File)

**When:** No ARCHITECTURE.md exists

**What happens:**
1. Full codebase scan via parallel subagents
2. Targeted interview for gaps
3. Preview with inference annotations
4. Write after confirmation

**Typical time:** 2-3 minutes with parallel discovery

**Example:**
```bash
/accelint-architecture-doc
```

Output:
```
No ARCHITECTURE.md found. Creating from scratch.
Spawning 5 discovery agents...
[Agents return findings]
I inferred most sections. I need to ask about:
1. Cloud provider (couldn't determine from codebase)
2. Monitoring stack (no observability config found)
3. Roadmap items
[Shows preview]
Does this look right?
```

### Mode 2: Refresh (Update Existing)

**When:** ARCHITECTURE.md exists and follows the standard template

**What happens:**
1. Reads the existing file to understand current state
2. Runs drift detection (scans for new frameworks, added services, updated deployment configs)
3. Asks only about what changed
4. Shows preview with changes highlighted
5. Writes after you confirm

**Takes about:** 1-2 minutes

**Example:**
```bash
/accelint-architecture-doc
```

Output:
```
Found ARCHITECTURE.md. Running drift detection...
Detected changes:
- New service: worker/ directory with Dockerfile
- Added dependency: @prisma/client (database change?)
- New CI workflow: .github/workflows/test.yml

I'll update sections 3, 4, and 8. Sections 1, 2, 5, 6, 7, 9, 10, 11 appear accurate.
[Asks targeted questions]
[Shows preview]
```

### Mode 3: Restructure (Import Existing Content)

**When:** ARCHITECTURE.md exists but doesn't follow the standard template

**What happens:**
1. Reads the existing file and notices it doesn't match the template
2. Offers three options:
   - **(a) Restructure** - import existing content into the template and fill gaps
   - **(b) Append** - add missing template sections below what's already there
   - **(c) Dry run** - preview what the restructured doc would look like
3. If you choose restructure, it maps existing content to the right template sections
4. Flags any content that doesn't fit cleanly and asks where it should go
5. Fills gaps through scanning and interview
6. Shows preview before writing

**Takes about:** 3-4 minutes (includes mapping and gap-filling)

**Example:**
```bash
/accelint-architecture-doc
```

Output:
```
ARCHITECTURE.md exists but doesn't follow the standard template structure.
I recommend restructuring it — this makes it consistent for agents and engineers.

(a) Restructure (recommended) — import your existing content into the template
(b) Append — add missing sections below what's already there
(c) Dry run — show what restructured doc would look like

Which would you prefer?
```

## Output Format

The skill generates an 11-section ARCHITECTURE.md following this structure:

1. **Project Structure** — annotated directory tree showing architectural layers
2. **High-Level System Diagram** — ASCII art block diagram of components and data flow
3. **Core Components** — detailed breakdown of frontend, backend services, and workers
4. **Data Stores** — databases, caches, queues, with purpose and key schemas
5. **External Integrations / APIs** — third-party services and integration methods
6. **Deployment & Infrastructure** — cloud provider, IaC, CI/CD, monitoring
7. **Security Considerations** — auth, authorization, encryption, security tools
8. **Development & Testing Environment** — local setup, test frameworks, code quality tools
9. **Future Considerations / Roadmap** — planned changes and known technical debt
10. **Project Identification** — name, repo URL, primary contact, last update date
11. **Glossary / Acronyms** — project-specific terms

Each section includes guidance comments in the template (loaded via `references/template.md`). The skill fills these sections through a combination of automated inference and targeted questions.

## Advanced Features

### Monorepo Support

The skill detects monorepo structure and adjusts scope:

**At monorepo root:**
- Generates a root-level ARCHITECTURE.md covering the full system
- Section 3 (Core Components) creates subsections per package
- Section 1 (Project Structure) shows workspace layout

**Inside a monorepo package:**
- Checks for root-level ARCHITECTURE.md and reads it for context
- Generates a package-specific doc that references the root doc
- Focuses on: package purpose, internal structure, dependencies on other packages

### Drift Detection (Refresh Mode)

When refreshing an existing document, the skill scans for:

| Signal Category | Example Detections |
|-----------------|-------------------|
| **New dependencies** | Added framework or major library |
| **Service changes** | New Dockerfile, new service in docker-compose.yml |
| **Infrastructure updates** | New IaC files, changed cloud provider signals |
| **CI/CD changes** | Added or modified workflows |
| **Data store additions** | New migration directories, new schema files |
| **Security changes** | New auth middleware, added secrets manager |
| **Testing updates** | New test configs, added E2E framework |
| **Monitoring additions** | New observability deps or configs |

For each detected change, the skill asks questions to understand the context instead of blindly updating.

### Agent Behavior Doc Integration

If the skill finds `AGENTS.md` or `CLAUDE.md` during discovery, it adds a reference block at the top of ARCHITECTURE.md:

```markdown
> **Agent Behavior:** See [AGENTS.md](./AGENTS.md) for how AI agents should behave when working in this codebase.
```

This connects architectural context with behavioral instructions.

### Inference Source Annotations

During preview, the skill marks how each field was determined:

```markdown
**Technologies:** React 18, Next.js 14 # inferred from package.json and next.config.js
**Deployment:** <!-- TODO: fill in -->
**Monitoring:** Datadog # from user interview
```

These annotations help you verify accuracy before the skill writes anything. The final file doesn't include them.

### Preservation of Human-Authored Content

In refresh mode, the skill won't silently remove content. If it finds sections that look human-written and can't verify their accuracy, it asks before changing them.

## Examples

### Example 1: New Next.js App

**Input:**
```bash
/accelint-architecture-doc
```

**Context:** Fresh Next.js 14 app with Prisma, deployed to Vercel, uses GitHub Actions for CI

**Output (abbreviated):**
```markdown
# Architecture Overview

## 1. Project Structure

my-app/
├── app/              # Next.js 14 App Router pages and layouts
├── components/       # Reusable React components
├── lib/             # Utility functions and shared logic
├── prisma/          # Database schema and migrations
├── public/          # Static assets
└── .github/         # CI/CD workflows

## 2. High-Level System Diagram

[User] <--> [Next.js Frontend/Backend] <--> [PostgreSQL Database]

## 3. Core Components

### 3.1. Frontend

**Name:** Web Application

**Description:** Server-rendered React application with App Router for routing and layouts

**Technologies:** React 18, Next.js 14 App Router, TypeScript, Tailwind CSS

**Deployment:** Vercel

### 3.2. Backend Services

#### 3.2.1. Next.js API Routes

**Name:** API Service

**Description:** REST API via Next.js route handlers in app/api/

**Technologies:** Next.js 14, TypeScript, Prisma ORM

**Deployment:** Vercel (serverless functions)

## 4. Data Stores

### 4.1. Primary Database

**Name:** Application Database

**Type:** PostgreSQL 15 (via Supabase)

**Purpose:** Stores user data, content, and application state

**Key Schemas:** users, posts, sessions

...
```

### Example 2: Refresh After Adding Service

**Input:**
```bash
/accelint-architecture-doc
```

**Context:** Existing ARCHITECTURE.md, added a background worker service

**Output:**
```
Found ARCHITECTURE.md. Running drift detection...

Detected changes:
- New directory: worker/ with Dockerfile and package.json
- Added dependency: bull (job queue library)
- New service in docker-compose.yml: redis

I'll update Section 3 (Core Components) to add the worker service
and Section 4 (Data Stores) to document Redis.

What does the worker service do?
> Processes video transcoding jobs asynchronously

[Shows preview with additions highlighted]
[User confirms]

Updated ARCHITECTURE.md:
- Added Section 3.2.2: Background Worker
- Added Section 4.2: Redis Job Queue
```

### Example 3: Restructure Unstructured Doc

**Input:**
```bash
/accelint-architecture-doc
```

**Context:** ARCHITECTURE.md exists but is formatted as free-form prose, not the template structure

**Output:**
```
ARCHITECTURE.md exists but doesn't follow the standard template structure.
I recommend restructuring it — this makes it consistent for agents.

(a) Restructure (recommended)
(b) Append
(c) Dry run

> a

Reading existing content...

Found content that maps to:
- Section 1: directory structure notes
- Section 3: component descriptions
- Section 6: deployment details
- Unmapped: "Performance Considerations" section

Where should "Performance Considerations" go?
(a) Section 9 (Future Considerations / Roadmap)
(b) Section 8 (Development & Testing)
(c) New custom section

> a

[Continues with gap-filling interview]
[Shows preview]
[Writes restructured file]
```

## License

Apache-2.0 - see [LICENSE](./LICENSE) for details.
