# ARCHITECTURE.md Template

Use this exact structure. Fill every `[placeholder]` with content from codebase scanning or the interview. Replace unresolvable placeholders with `<!-- TODO: fill in -->` — never omit a section. Every section is load-bearing for agent and engineer onboarding.

---

```markdown
# Architecture Overview

<!-- If openspec/config.yml exists, add this reference after the title: -->
<!-- > **Tech Stack:** See [openspec/config.yml](./openspec/config.yml) for detailed stack facts, coding patterns, and domain concepts. -->

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the codebase's architecture. Update this document as the codebase evolves.

## 1. Project Structure

[Project Root]/
├── [directory]/      # [one-line architectural role]
│   ├── [subdir]/     # [role]
│   └── [subdir]/     # [role]
├── [directory]/      # [one-line architectural role]
├── .github/          # CI/CD configuration
├── .gitignore
├── README.md         # Project overview and quick-start
└── ARCHITECTURE.md   # This document

<!-- Collapse noisy directories (node_modules, dist, .git, __pycache__).
     Annotate each entry with its architectural role, not just its name. -->

## 2. High-Level System Diagram

<!-- If openspec/config.yml exists, add this intro: -->
<!-- > Complete stack facts and coding patterns are in [openspec/config.yml](./openspec/config.yml). This section provides deployment and runtime context. -->

<!-- Use ASCII art for a simple block diagram showing major components and data flow.
     Keep it at a 10,000-foot view — no schemas, no function signatures. -->

[User] <--> [Frontend] <--> [Backend Service] <--> [Database]
                        |
                        +--> [External API / Third-party Service]

## 3. Core Components

### 3.1. Frontend

**Name:** [e.g., Web App, Admin Dashboard, Mobile App]

**Description:** [Primary purpose and key functionalities. How do users interact with it?]

**Technologies:** [e.g., React 18, Next.js 14 App Router, TypeScript, Tailwind CSS]

**Deployment:** [e.g., Vercel, Netlify, S3 + CloudFront]

### 3.2. Backend Services

<!-- Repeat this block for each significant backend service. -->

#### 3.2.1. [Service Name]

**Name:** [e.g., API Service, Auth Service, Data Processing Worker]

**Description:** [What does this service do? What does it own?]

**Technologies:** [e.g., Node.js 20 + Express, Python 3.12 + FastAPI, Go 1.22]

**Deployment:** [e.g., AWS ECS Fargate, Kubernetes, AWS Lambda, Heroku]

<!-- Add more services as needed: 3.2.2., 3.2.3., etc. -->

## 4. Data Stores

### 4.1. [Primary Database]

**Name:** [e.g., Primary Application Database]

**Type:** [e.g., PostgreSQL 16, MongoDB 7, DynamoDB]

**Purpose:** [What data does it store? Why this type?]

**Key Schemas / Collections:** [e.g., users, organizations, sessions, events — names only, no full schema]

### 4.2. [Cache / Queue / Other]

**Name:** [e.g., Session Cache, Job Queue]

**Type:** [e.g., Redis 7, Kafka, RabbitMQ, SQS]

**Purpose:** [e.g., Session storage and rate limiting, async job processing]

<!-- Add more data stores as needed: 4.3., 4.4., etc. -->

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| [e.g., Stripe] | [e.g., Payment processing] | [e.g., REST API via SDK] |
| [e.g., SendGrid] | [e.g., Transactional email] | [e.g., REST API] |
| [e.g., AWS S3] | [e.g., File storage] | [e.g., AWS SDK] |

<!-- TODO: fill in if no external integrations found in codebase -->

## 6. Deployment & Infrastructure

**Cloud Provider:** [e.g., AWS, GCP, Azure, Fly.io, Railway, On-premise]

**Key Services Used:** [e.g., ECS, Lambda, RDS, S3, CloudFront, Route 53]

**CI/CD Pipeline:** [e.g., GitHub Actions — `.github/workflows/deploy.yml`]

**Monitoring & Logging:** [e.g., Datadog, Sentry, CloudWatch, Grafana + Prometheus]

## 7. Security Considerations

**Authentication:** [e.g., OAuth2 via Auth0, JWT (RS256), Session cookies (HttpOnly)]

**Authorization:** [e.g., RBAC with roles: admin, editor, viewer]

**Data Encryption:** [e.g., TLS 1.3 in transit, AES-256 at rest via RDS encryption]

**Key Security Tools / Practices:** [e.g., Dependabot, SAST via CodeQL, WAF via Cloudflare]

## 8. Development & Testing Environment

<!-- If openspec/config.yml exists, add this intro: -->
<!-- > Testing patterns and standards are defined in [openspec/config.yml](./openspec/config.yml); this section covers local setup and commands. -->

**Local Setup:** [Link to CONTRIBUTING.md, or brief steps: `cp .env.example .env && docker-compose up`]

**Testing Frameworks:** [e.g., Vitest + @testing-library/react, Pytest, Playwright for E2E]

**Code Quality Tools:** [e.g., ESLint + Prettier, Biome, mypy, Ruff, SonarCloud]

## 9. Future Considerations / Roadmap

<!-- Cannot be inferred — always ask the user. -->

- <!-- TODO: fill in planned architectural changes -->
- <!-- TODO: fill in known technical debt affecting architecture -->

## 10. Project Identification

**Project Name:** [Insert Project Name]

**Repository URL:** [Insert Repository URL]

**Primary Contact / Team:** [Insert Lead Developer or Team Name]

**Date of Last Update:** [YYYY-MM-DD]

## 11. Glossary / Acronyms

<!-- Define project-specific terms that would confuse a new engineer or agent.
     Skip common industry terms (REST, API, CI/CD) unless the project uses them non-standardly. -->

| Term | Definition |
|------|-----------|
| [Term or Acronym] | [Plain-English definition] |
```
