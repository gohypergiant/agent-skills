# Architecture Overview

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the codebase's architecture. Update this document as the codebase evolves.

## 1. Project Structure

agent-skills/
├── skills/                               # Canonical source of truth for maintained agent skills
│   ├── accelint-ac-to-playwright/        # TypeScript-backed skill package with CLI tooling for AC-to-Playwright conversion
│   ├── accelint-architecture-doc/        # Skill for generating and refreshing ARCHITECTURE.md documents
│   ├── accelint-archive-synthesis/       # Skill content for archive synthesis workflows
│   ├── accelint-design-foundation/       # Skill content for design-system and styling guidance
│   ├── accelint-nextjs-best-practices/   # Skill content for Next.js guidance
│   ├── ...                               # Additional skill directories following the same pattern
│   └── accelint-ts-testing/              # Skill content for TypeScript/Vitest testing guidance
├── .agents/
│   └── skills/                           # Symlink layer exposing local skills/ content to agent harnesses
├── docs/                                 # Next.js + Fumadocs documentation application
│   ├── src/                              # App Router code, API routes, shared config, and rendering logic
│   ├── content/docs/                     # Published MDX documentation content
│   ├── package.json                      # Docs app scripts and dependencies
│   ├── next.config.mjs                   # Next.js configuration with Fumadocs MDX integration
│   ├── source.config.ts                  # Fumadocs content source configuration
│   └── README.md                         # Docs-app-specific local development notes
├── scripts/
│   └── symlink-agent-skills.sh           # Rebuilds .agents/skills symlinks from skills/
├── .github/
│   └── workflows/                        # GitHub Actions CI configuration
├── .claude/                              # Claude-related project tooling/configuration
├── .pi/                                  # Pi/agent-related project metadata
├── AGENTS.md                             # Repo-wide agent behavior and workflow rules
├── CLAUDE.md                             # Pointer file delegating to AGENTS.md
├── CONTRIBUTING.md                       # Contributor workflow guidance
├── README.md                             # Repository overview and working conventions
└── ARCHITECTURE.md                       # This document

## 2. High-Level System Diagram

[Maintainers] --> [skills/ source directories] --> [.agents/skills symlink layer] --> [Local agent harnesses]
         \
          +--> [docs/content/docs MDX content] --> [Next.js + Fumadocs docs app] --> [Vercel-hosted site]
                                                                                 \
                                                                                  +--> [LLM/text/search routes]

[GitHub Repository] --> [GitHub Actions CI] --> [Validation for skill package changes]

## 3. Core Components

### 3.1. Frontend

**Name:** Documentation Site

**Description:** A public-facing documentation application that publishes agent skill documentation, renders MDX content, exposes search, and serves machine-readable LLM-oriented routes for downstream consumption.

**Technologies:** Next.js 16, React 19, TypeScript, Fumadocs, fumadocs-mdx, Tailwind CSS v4

**Deployment:** Vercel

### 3.2. Backend Services

#### 3.2.1. Docs Route Handlers

**Name:** Embedded Docs App Route Handlers

**Description:** Lightweight server-side functionality inside the Next.js app that serves search, LLM text endpoints, and generated documentation-adjacent responses. This repo does not contain a separate standalone backend service.

**Technologies:** Next.js App Router route handlers, TypeScript

**Deployment:** Vercel

#### 3.2.2. AC-to-Playwright CLI Package

**Name:** accelint-ac-to-playwright Tooling Package

**Description:** A TypeScript-based utility package within the `skills/` tree that provides CLI commands for converting acceptance criteria into JSON test plans and Playwright spec artifacts. It is part of the repository’s authored skill ecosystem rather than a deployed service.

**Technologies:** Node.js, TypeScript, Zod, Vitest

**Deployment:** Not separately deployed; executed locally or in CI as package tooling

## 4. Data Stores

### 4.1. Skill Source Repository

**Name:** Skill Content Store

**Type:** Filesystem content repository (Git-managed)

**Purpose:** Stores canonical skill definitions, supporting references, changelogs, assets, and agent guidance under `skills/`.

**Key Schemas / Collections:** skill directories, `SKILL.md`, `CHANGELOG.md`, `AGENTS.md`, `README.md`, references, assets

### 4.2. Published Docs Content

**Name:** Documentation Content Store

**Type:** Filesystem MDX content repository (Git-managed)

**Purpose:** Stores the published documentation pages consumed by the docs app under `docs/content/docs/`.

**Key Schemas / Collections:** MDX docs pages, section indexes, generated/published skill docs

### 4.3. Local Harness Skill Exposure

**Name:** Skill Symlink Layer

**Type:** Filesystem symlink mapping

**Purpose:** Exposes canonical `skills/` directories through `.agents/skills/` so local agent harnesses can consume the same skill sources without duplication.

**Key Schemas / Collections:** symlinked skill directories

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| GitHub | Source hosting, collaboration, and CI workflow execution | GitHub repository + GitHub Actions |
| Vercel | Hosting and deployment for the docs application | Vercel-managed Next.js deployment |
| Fumadocs | Documentation framework and MDX content tooling | npm package integration inside docs app |

## 6. Deployment & Infrastructure

**Cloud Provider:** Vercel

**Key Services Used:** Vercel hosting for the Next.js docs application, GitHub for source control and automation

**CI/CD Pipeline:** GitHub Actions — `.github/workflows/vitest.yml`

**Monitoring & Logging:** None currently documented

## 7. Security Considerations

**Authentication:** No application-level authentication detected or documented for the public docs site

**Authorization:** No application-level authorization model documented

**Data Encryption:** TLS in transit is assumed for GitHub- and Vercel-hosted surfaces; <!-- TODO: fill in if stricter guarantees or policies should be documented -->

**Key Security Tools / Practices:** Git-based review workflow, GitHub Actions validation for `skills/accelint-ac-to-playwright`, repository ignores for local/generated artifacts

## 8. Development & Testing Environment

**Local Setup:** For the docs app: `cd docs && pnpm install && pnpm dev`. For local harness sync: `bash scripts/symlink-agent-skills.sh`. For the tested skill package: `cd skills/accelint-ac-to-playwright && npm ci && npx tsc -p tsconfig.json && npx vitest run --coverage`.

**Testing Frameworks:** Vitest for `skills/accelint-ac-to-playwright`; Playwright exists as generated/template output rather than a configured repo-wide test runner

**Code Quality Tools:** TypeScript, `fumadocs-mdx`, Next.js type generation, `tsc --noEmit`

## 9. Future Considerations / Roadmap

- None currently documented
- No planned architectural changes were provided
- No known architecture-affecting technical debt was provided

## 10. Project Identification

**Project Name:** Agent Skills

**Repository URL:** https://github.com/gohypergiant/agent-skills

**Primary Contact / Team:** Lyntris (formerly Accelint, formerly Hypergiant)

**Date of Last Update:** 2026-07-24

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| Agent Skill | A reusable instruction package that teaches an agent how to perform a specialized task or workflow |
| Fumadocs | The documentation framework used by the `docs/` app to render and organize MDX-based documentation |
| LLM Route | A machine-readable endpoint such as `llms.txt` or related text routes intended for LLM/tool consumption rather than normal page browsing |
| Symlink Layer | The `.agents/skills/` directory that points back to canonical `skills/` directories so local harnesses consume the same sources |
| QRSPI | A spec-planning workflow used in this repository’s skill ecosystem for structured change planning and execution |
