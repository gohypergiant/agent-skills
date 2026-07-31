# Audit Report: `accelint-skill-manager`

## Grade
**A-**

Strong, coherent skill package with good progressive-disclosure structure, aligned versioning, and unusually solid eval coverage. Main weaknesses are a frontmatter-description rule conflict inside the package, a few cross-file consistency drifts, and some content that trends from expert guidance into general explanation.

---

## Frontmatter Audit

### Status
**Mostly passes**

### Evidence
From `SKILL.md`:
- `name: accelint-skill-manager`
- `description:` starts with **“Use when…”**
- `license: Apache-2.0`
- `metadata.author: accelint`
- `metadata.version: "2.1.3"`

### Findings
- **Name passes**: lowercase, hyphenated, and matches directory name `accelint-skill-manager`.
- **License present**: recommended field is included.
- **Version present**: `2.1.3` is explicit and machine-checkable.
- **Description is strong on trigger coverage**: it names package artifacts (`SKILL.md`, `AGENTS.md`, `references`, `scripts`, `assets`, `evals`, `CHANGELOG.md`) and concrete request types like “create a skill,” “audit skill quality,” “optimize triggering,” and “check version and changelog alignment.”

### Concern
- **Internal rule tension on description content**:  
  `references/skill.md` says the description should **only** describe triggering conditions and should **not** summarize workflow or what the skill does.  
  But `SKILL.md`’s frontmatter audit says description should include **WHAT / WHEN / KEYWORDS**.  
  The current description also includes evaluative/process-adjacent framing like:
  - “Best for skill-package architecture, quality, structure, and governance.”
  - “Do not use for generic prompt polishing...”
  
  This is not a fatal defect, but the package is teaching two slightly different description philosophies.

---

## Structure Audit

### Status
**Pass with minor drift**

### Evidence
Present in `SKILL.md`:
- `## NEVER Do When Creating Skills`
- `## Before Creating a Skill, Ask`
- `## How to Use`
- `## Which Workflow Should You Follow?`
- `## Default execution paths`
- `## Skill Creation Workflow`
- `## Skill Audit Workflow`

Supporting package structure exists:
- `AGENTS.md`
- `README.md`
- `CHANGELOG.md`
- `references/` with topic-specific files
- `assets/skill-template/`
- `evals/evals.json`

### Strengths
- The package follows its own progressive-disclosure model well.
- `SKILL.md` is concise enough structurally: **235 lines**, below the stated `<500 lines` guidance.
- References are decomposed into focused files rather than overloading `SKILL.md`.
- The template package under `assets/skill-template/` materially supports the workflow instead of being decorative.

### Drift / inconsistencies
1. **Expected section naming mismatch**  
   The audit workflow says to compare against:
   - `NEVER Do`
   - `Before [Action] Ask`
   - `How to Use`
   - `Main Workflow`
   
   But this skill uses:
   - `Skill Creation Workflow`
   - `Skill Audit Workflow`
   - `Default execution paths`
   - `Which Workflow Should You Follow?`

   The package is coherent, but its own audit rubric still describes a more generic section model than this concrete skill actually uses.

2. **README token guidance differs from package guidance**  
   `README.md` says:
   - “Main SKILL.md (<5000 tokens) loaded when activated”
   
   While:
   - `AGENTS.md` says keep `SKILL.md <500 lines`
   - `references/progressive-disclosure.md` says `< 5000 tokens recommended` and also `<500 lines`
   
   Not contradictory, but slightly mixed emphasis. The package uses both line-based and token-based limits without clarifying which is primary.

3. **README references `../../CLAUDE.md`**  
   `README.md` links:
   - `../../CLAUDE.md`
   
   I did not verify file existence outside this package during this audit, so this is an evidence limit rather than a confirmed defect.

---

## Changelog / Version Audit

### Status
**Pass**

### Evidence
- `SKILL.md` frontmatter: `metadata.version: "2.1.3"`
- `CHANGELOG.md` latest entry: `## [2.1.3] - 2026-07-31`

### Strengths
- Latest version matches exactly.
- Changelog uses a recognizable Keep a Changelog structure.
- Recent entries include rationale, not just change summaries.
- The 2.1.3 entry clearly ties changes to observed eval behavior:
  - “Iteration-1 eval results showed recurring drift...”

### Minor concerns
1. **Historical version notation drift inside changelog history**  
   Older entries mix:
   - `2.0`
   - `2.1`
   - `2.1.1`
   - `2.1.2`
   - `2.1.3`
   
   This is documented in the history, not a current mismatch, but it reflects evolution in the package’s own versioning guidance.

2. **Reference guidance still permits X.Y or X.Y.Z**
   `references/skill.md` says semantic versioning may be `"X.Y"` or `"X.Y.Z"`, while current package practice appears to have standardized on full semver. That weakens consistency slightly.

---

## Knowledge-Delta Findings

### Overall assessment
**Good knowledge delta, but not uniformly expert-only**

### Expert-only / high-value content
These sections carry real package-specific expertise:
- The distinction between activation-time description vs body-loaded instructions
- Scope control via `Default execution paths`
- Audit-only vs targeted-refinement vs full-refactor boundaries
- Guidance to avoid auto-expanding narrow requests into version/changelog work
- Redirect behavior for prose-only or docs-only near misses
- Changelog rationale expectations tied to eval evidence
- Cross-artifact package maintenance framing

### More redundant / general content
Some content reads closer to general LLM instruction than hard-won package expertise:
- Parts of `README.md` explaining what skills are in broad terms
- Some anti-patterns in `SKILL.md` are strong, but a few are fairly universal prompt-writing advice
- The template comments in `assets/skill-template/SKILL.md` are helpful, but some are generic enough that they teach documentation mechanics more than specialized skill-authoring insight

### Net judgment
- Redundancy does **not** appear to exceed 50%.
- The package remains meaningfully expert-oriented.
- The biggest knowledge-delta issue is not excess basics, but **rule duplication with slight wording drift** across `SKILL.md`, `AGENTS.md`, `README.md`, and references.

---

## Prioritized Improvement Opportunities

### 1. Resolve the description-rule conflict across the package
**Priority: High**

### Evidence
- `references/skill.md`: description should **only** describe triggering conditions and not summarize workflow.
- `SKILL.md` frontmatter audit: description should include **WHAT/WHEN/KEYWORDS**.
- `assets/skill-template/SKILL.md`: explicitly teaches WHAT/WHEN/KEYWORDS in description comments.

### Why it matters
This is the most important coherence issue in the package. The skill teaches multiple nearby but not identical theories of how frontmatter descriptions should work. That can produce inconsistent downstream skills.

### Smallest safe improvement
Choose one canonical rule set for description writing and align:
- `SKILL.md`
- `references/skill.md`
- `assets/skill-template/SKILL.md`

---

### 2. Tighten the audit rubric so it matches this package’s actual workflow shapes
**Priority: High**

### Evidence
`SKILL.md` audit workflow expects a generic `Main Workflow` section, but this skill itself uses:
- `Which Workflow Should You Follow?`
- `Default execution paths`
- `Skill Creation Workflow`
- `Skill Audit Workflow`

### Why it matters
A meta-skill should make its own audit rubric accurately describe modern package patterns, especially when it audits other skills.

### Smallest safe improvement
Update the audit rubric to distinguish:
- required conceptual sections
- acceptable section-name variants
- optional routing sections for more advanced skills

---

### 3. Normalize version-format guidance across references and templates
**Priority: Medium**

### Evidence
- `references/skill.md` allows `"X.Y"` or `"X.Y.Z"`
- current package uses `2.1.3`
- changelog history explicitly notes a shift to full semver

### Why it matters
The package’s current practice and historical direction point toward full semver, but one core reference still permits two formats.

### Smallest safe improvement
Either:
- standardize on `X.Y.Z` everywhere, or
- explicitly explain when `X.Y` is still acceptable.

---

### 4. Reduce rule duplication where the same policy is repeated in multiple artifacts
**Priority: Medium**

### Evidence
Similar guidance appears across:
- `SKILL.md`
- `AGENTS.md`
- `README.md`
- `references/progressive-disclosure.md`
- `references/skill.md`

Examples:
- progressive disclosure limits
- version/changelog alignment
- “Use when...” description expectations

### Why it matters
The issue is not size alone; it is drift risk. Repeated policy text across multiple files is how contradictions emerge.

### Smallest safe improvement
Make one file canonical per topic and convert others to shorter summaries with links.

---

### 5. Revisit README sections that explain generic concepts rather than package-specific decisions
**Priority: Low**

### Evidence
`README.md` includes broad sections like:
- “What Skills Provide”
- general examples of skills
- general architecture philosophy

### Why it matters
This is useful for humans, but some of it is less specialized than the rest of the package and weakens the knowledge-delta profile slightly.

### Smallest safe improvement
Trim or compress generic explanatory material unless it directly supports maintainers of this package.

---

## Evidence Limits / Blockers

- I audited only direct file evidence inside `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-skill-manager`.
- I did **not** verify external path targets such as:
  - `../../ARCHITECTURE.md`
  - `../../AGENTS.md`
  - `../../CLAUDE.md`
- I did **not** execute evals or inspect prior run outputs; conclusions about evaluation quality are based only on `evals/evals.json` and changelog claims.
- I did **not** validate whether every reference/template file is semantically complete beyond the files directly read for this audit.

## Bottom Line

`accelint-skill-manager` is a strong skill package with good package hygiene, strong audit boundaries, and unusually mature eval coverage. The main issue is not missing structure or broken versioning; it is **intra-package policy drift**, especially around how frontmatter descriptions should be specified and how audit expectations map to modern skill layouts.
