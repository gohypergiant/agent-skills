# Category Guide

Read this before running per-document extraction. It defines the eight
constraint categories, the forcing-function test in detail, and an
in-scope/out-of-scope example for each category so subagents can make a
consistent call without escalating every borderline case.

## Table of Contents

1. The forcing-function test, in detail
2. The eight categories
3. Redirect table — what looks like a constraint but usually isn't

---

## 1. The forcing-function test, in detail

A constraint is a boundary that holds regardless of team consensus, because
something outside engineering judgment enforces it. Ask two questions about
any candidate statement:

**Question 1 — Is there an external enforcer?**
Legal counsel, a compliance auditor, a security team, a paying customer's
contract, an executive, a vendor's API limits, a regulator. If the only
enforcer is "the team agreed to do it this way," it fails here.

**Question 2 — Does violating it cost something outside the codebase?**
A fine, a breach, a contract termination, a failed audit, a blown
deadline the business already committed to externally, a vendor
integration silently breaking. If the cost is purely "the code looks
inconsistent" or "a teammate would be annoyed," it fails here.

A candidate needs a **yes** on both to qualify. One yes and one no is a
near-miss — flag it, don't include it as a constraint.

**Worked example.** "We use `pnpm`, never `npm`." On its own: no external
enforcer, no external cost, this is a preference — near-miss, redirect to
`config.yaml`. Now compare: "External registry access is blocked by
network policy; only `pnpm`'s offline cache is permitted." Same surface
behavior, but now there's an enforcer (network/security policy) and a cost
(builds fail outside the permitted path). That's a constraint — and the
`pnpm` preference in `config.yaml` should probably reference it.

---

## 2. The eight categories

Each category name below is followed by its exact machine-readable slug in
backticks. **Use the slug verbatim in the `category` field of every JSON
finding** -- not the display name, not a shortened form of it. The merge
script recognizes common variants (`security` -> `security-privacy-ip-cui`,
`operational` -> `workflow-sequencing`, etc.) and will auto-correct or
fuzzy-match where it reasonably can, but it will hard-fail rather than
guess wrong, and a mismatch here is how a category's findings go missing
or a whole run aborts. Use the exact slug and skip the guesswork.

### Compliance & Governance (`compliance-governance`, ID tag `COMPLY`)
Regulatory frameworks, audit requirements, certification obligations
(SOC2, FedRAMP, ISO 27001, HIPAA, etc.) that the project must satisfy.

- **In scope:** "All merges to `main` require a documented security review,
  per SOC2 CC8.1 control mapping."
- **Out of scope:** "PRs should be small and reviewed before merge." (No
  named external framework or auditor behind it — that's a workflow
  preference for `AGENTS.md`.)

### Security, Privacy, IP & CUI (`security-privacy-ip-cui`, ID tag `SEC`)
Data classification requirements, handling rules for controlled or
sensitive information, IP ownership boundaries with external parties.

- **In scope:** "This repository processes CUI; all compute must run in an
  environment authorized for CUI handling."
- **Out of scope:** "Never log environment variable values." (A defensive
  practice with no named data-classification driver — stays in AGENTS.md's
  Security Sensitivity as a behavior, unless a source ties it back to a
  named requirement.)

### Hosting & Infrastructure Boundaries (`hosting-infrastructure`, ID tag `INFRA`)
Deployment environments, regions, or platforms the project is required —
not merely chosen — to use.

- **In scope:** "Contract clause 4.2 prohibits deployment to commercial
  cloud regions for CUI-tagged workloads; GovCloud only."
- **Out of scope:** "Deployed on AWS ECS." (A fact about the current
  choice with no stated external requirement — belongs in ARCHITECTURE.md
  as-is, unless a source explains why ECS specifically is mandatory.)

### Tooling & Approved-Path Restrictions (`tooling-approved-path`, ID tag `TOOL`)
Software, services, or registries the project is required or forbidden to
use, where the requirement comes from outside engineering preference.

- **In scope:** "Only packages from the internal approved-software list
  may be added as dependencies, per procurement policy."
- **Out of scope:** "We use Biome, never Prettier or ESLint separately."
  (Team taste — `AGENTS.md` Tool Preferences already owns this.)

### Workflow & Sequencing Requirements (`workflow-sequencing`, ID tag `FLOW`, externally mandated)
Ordering or gating requirements imposed by an outside party, distinct from
the team's own chosen process.

- **In scope:** "Changes touching the auth module require a named security
  reviewer's sign-off before merge, per client contract §7."
- **Out of scope:** "Follow TDD: write a failing test before touching
  production code." (Internal engineering discipline, no external
  enforcer — `AGENTS.md` Workflow Procedures.)

### Stakeholder & Executive Expectations (`stakeholder-executive`, ID tag `STAKE`)
Decisions or priorities set by leadership or a stakeholder with authority
over scope, not derivable from the code or team consensus.

- **In scope:** "Leadership has committed to a public beta by Q3; feature
  work outside the beta scope is explicitly deprioritized until after
  launch."
- **Out of scope:** "The team thinks performance work is more valuable
  than new features right now." (A team opinion, not a stakeholder
  decision — no named authority behind it.)

### Scope, Prioritization & Delivery Boundaries (`scope-prioritization-delivery`, ID tag `SCOPE`)
Explicit out-of-scope declarations, delivery deadlines, or budget/resource
ceilings set externally.

- **In scope:** "Internationalization is explicitly out of scope for this
  contract's deliverables; do not build for it speculatively."
- **Out of scope:** "Let's not gold-plate this feature." (Engineering
  judgment call, not an externally set boundary.)

### External Dependencies Shaping Future Planning (`external-dependencies`, ID tag `DEPS`)
Dependencies on other teams, vendors, or third-party systems whose timeline
or behavior constrains what this project can do and when.

- **In scope:** "The billing API's rate-limit increase is scheduled for
  Q2 from the vendor; do not plan high-throughput billing work before
  then."
- **Out of scope:** "We should build a caching layer before the next
  release." (An internal technical recommendation, not a dependency on an
  external party's timeline.)

---

## 3. Redirect table — what looks like a constraint but usually isn't

| Looks like | Usually is | Route to |
|---|---|---|
| A confidently-worded "must" or "never" statement | A team style preference with no named external enforcer | `config.yaml` (code-level) or `AGENTS.md` (behavioral) |
| A deployment or infrastructure fact | The current chosen architecture, not a mandate | `ARCHITECTURE.md` |
| A process step ("always do X before Y") | Internal workflow discipline | `AGENTS.md` Workflow Procedures |
| A security-sounding rule with no named data class or policy behind it | Defensive engineering practice | `AGENTS.md` Guardrails |

When a subagent finds one of these, it's a near-miss: flag it with the
one-line reason from this table rather than silently omitting it, so the
preview step can show the user what was excluded and why.
