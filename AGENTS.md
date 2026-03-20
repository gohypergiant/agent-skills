# Agent Skills — Claude Reference

This repo contains agent skills: structured knowledge packages that arm Claude with expert-level, domain-specific context. Claude's role here is to create and maintain those skills.

**Full specification:** https://agentskills.io/specification
**Best practices:** https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf?hsLang=en
**Skill template:** `skills/accelint-skill-manager/assets/skill-template/`

---

## Core Philosophy

Skills externalize knowledge — they do NOT teach Claude what it already knows.

**The formula:** `Good Skill = Expert-only Knowledge − What Claude Already Knows`

Three knowledge types:
- **Expert knowledge** — non-obvious rules, hard-won patterns, domain anti-patterns → **keep**
- **Activation knowledge** — brief context that helps Claude engage correctly → **keep if short**
- **Redundant knowledge** — concepts Claude knows, generic advice, tutorials → **delete**

Ask: *"Would an expert say 'I learned this the hard way'?"* If yes, it belongs. If Claude already knows it, cut it.

**Example:**

❌ Bad: "To implement authentication, first create a user model with fields for username, email, and password..." [Claude already knows this]

✅ Good: "NEVER store JWT tokens in localStorage — survives XSS attacks where malicious scripts can exfiltrate tokens to attacker servers. Use httpOnly cookies instead, which JavaScript cannot access."

---

## Frontmatter Spec (Non-Negotiable)

```yaml
name: skill-name          # lowercase + hyphens only, ≤64 chars, matches directory name
description: "..."        # THE most critical field — 1–1024 chars (see below)
license: Apache-2.0
metadata:
  author: "accelint"
  version: "1.0"
```

### Description Requirements

The `description` must answer three questions:

1. **WHAT** — What does this skill do?
2. **WHEN** — When should it be used? (start with "Use when…")
3. **KEYWORDS** — What search terms trigger it?

**Combat undertriggering:** Claude tends to not use skills when they'd be useful. Make descriptions "pushy" by being explicit about trigger contexts. Instead of just describing functionality, actively claim relevant scenarios. Add phrases like "Make sure to use this skill whenever..." or "This applies to any situation involving..."

```
✅ "Use when users say 'create X', 'build Y', or when working with .ext files
    for purpose A or B. [WHAT it does]. Make sure to use this skill whenever
    users mention [related concepts], even if they don't explicitly name [key terms].
    [Additional trigger keywords]."
❌ "Helps with various tasks"
```

**`name` rules:** lowercase + hyphens only (no underscores, no consecutive hyphens) — ensures consistent CLI invocation and searchability across systems. The ≤64 char limit prevents UI truncation in skill pickers. Must match directory name exactly — mismatches cause load failures since the skill system uses the directory name as the canonical identifier.

---

## Directory Structure

```
skill-name/
├── SKILL.md          # Required — frontmatter + expert knowledge
├── CHANGELOG.md      # Required — version history with rationale
├── AGENTS.md         # Optional — quick reference, rules summary, TOC to references/
├── README.md         # Optional — humans/distribution only, never for internal skills
├── references/       # Optional — detailed ❌/✅ examples, loaded on-demand
├── scripts/          # Optional — reusable automation
└── assets/           # Optional — templates, data files
```

---

## Local Development Setup

This repository uses symlinks to make locally developed skills discoverable during skill creation.

**Repository structure:**
```
agent-skills/
├── skills/           # Source of truth — all locally developed skills
└── .claude/skills/   # Symlinks to skills/ — for Claude Code skill loading
```

**Why symlinks?** When creating new skills with `accelint-skill-manager` or `skill-creator`, Claude can:
1. Reference existing skills as examples of proper structure and patterns
2. Generate code that follows established conventions from other skills
3. Learn from successful skill implementations in `skills/`
4. Run evaluation loops that compare new skills against existing ones

**How they work:** Each directory in `skills/` has a corresponding symlink in both `.agents/skills/` and `.claude/skills/`, created with:
```bash
for skill in skills/*; do
  skill_name=$(basename "$skill")
  ln -sf "../../skills/$skill_name" ".claude/skills/$skill_name"
done
```

Skills loaded from `.claude/skills/` take precedence over globally installed skills, ensuring Claude always uses the latest local versions during development.

---

## Skill Template

Always start from the template — copy and customize:

`skills/accelint-skill-manager/assets/skill-template/`

The template includes detailed comments explaining WHY each section matters and HOW to write effective content. Read the comments before deleting them.

### SKILL.md Sections

| Section | Purpose | Notes |
|---------|---------|-------|
| `NEVER Do [Domain]` | 5–8 anti-patterns with non-obvious WHY | Half of expert knowledge |
| `Before [Action], Ask` | Thinking frameworks (3–5 questions) | Teach decision-making, not just steps |
| `How to Use` | Direct instructions OR progressive disclosure | Never mix both — causes confusion about when to load additional context |
| Main Workflow | Core domain-specific procedure | Chosen format: phased / decision tree / creative |
| `Freedom Calibration` | Only if skill spans multiple task types | Skip for single-type skills — adds unnecessary complexity |
| `Important Notes` | Non-obvious critical considerations only | No obvious reminders |

### Anti-Pattern Format

NEVER [specific thing] — [concrete reason from experience, not generic warning]

Each anti-pattern should explain WHY it fails, not just that it does. Compare these:

❌ Weak: "NEVER skip validation — causes errors"
✅ Strong: "NEVER skip validation of user-provided file paths — leads to directory traversal vulnerabilities where attackers can read arbitrary files outside the intended directory by injecting '../' sequences"

Ask: *"Would an expert say 'I learned this the hard way'?"* If not, explain more or remove it.

### Writing Style

Explain WHY rather than commanding with MUST/NEVER in all caps. When rigid structure is needed, explain the reasoning so Claude understands intent, not just instruction. Use theory of mind — think about how the model will interpret guidance.

**Examples:**

❌ "You MUST use semantic tokens. NEVER use primitive tokens."
✅ "Prefer semantic tokens (`bg-surface-default`) over primitive tokens (`bg-gray-100`) — semantic tokens adapt to theme changes automatically, while primitive tokens break in dark mode."

❌ "ALWAYS include tests."
✅ "Include tests for objectively verifiable outputs (file transforms, data extraction). Skills with subjective outputs (writing style, design taste) rely on human judgment instead."

Make guidance general, not narrow. Avoid overfitting to specific examples.

### AGENTS.md Pattern

- Quick-reference TOC with 5–10 word descriptions per item
- Rules with one-line summaries, linking out to `references/` for details

---

## Skill Patterns

Choose the pattern that fits the task type:

| Pattern | ~Lines | Best For |
|---------|--------|---------|
| Mindset | ~50 | Creative tasks requiring taste and judgment |
| Navigation | ~30 | Multiple distinct sub-scenarios |
| Philosophy | ~150 | Art/creation requiring originality |
| Process | ~200 | Complex multi-step projects |
| Tool | ~300 | Precise operations on specific formats |

---

## Progressive Disclosure (3 Layers)

1. **Metadata (~100 tokens):** `name` + `description` — always loaded, must be compelling
2. **SKILL.md body (<500 lines ideal):** loaded on activation
3. **Resources (on-demand):** `references/`, `scripts/`, `assets/` — loaded only when needed

---

## Maintaining Skills

### CHANGELOG.md

When updating skills, maintain a CHANGELOG.md file to track version history and rationale for changes. This helps future maintainers understand why decisions were made.

**Format:** Use "Keep a Changelog" style with semantic versioning

**When to update:** After each skill iteration, improvement, or bug fix

**Structure:**
```markdown
# Changelog

## [X.Y.Z] - YYYY-MM-DD

### Added
- New features or capabilities with rationale

### Changed
- Modifications to existing functionality with why and how

### Fixed
- Bug fixes with explanation

### Version
- Version bump note (e.g., "Bumped from 1.2 → 1.3")
```

**What to document:**
- **Added:** New sections, patterns, scripts, references, anti-patterns
- **Changed:** Structural improvements, rewrites, reorganizations — always include **rationale** (e.g., "Rationale: Activation knowledge belongs ONLY in frontmatter description, not skill body")
- **Fixed:** Corrections to errors, broken links, incorrect examples
- **Version:** Explicit version increment note

**Link to evaluation results:** When improvements stem from testing/evals, reference the evaluation that motivated the change (e.g., "Evaluation showed skill could be overly prescriptive...")

**Example entry:**
```markdown
## [1.3.0] - 2026-03-18

### Changed
- **CRITICAL FIX:** Removed 80 lines of activation knowledge from SKILL.md body
  - Rationale: Activation knowledge belongs ONLY in frontmatter description, not skill body

### Added
- Created comprehensive evaluation test suite (evals/evals.json)
  - 8 realistic test prompts covering all major patterns
  - Rationale: Needed objective benchmarks for iterative improvements

### Version
- Bumped from 1.2 → 1.3
```

### Version Control in Frontmatter

Update `metadata.version` in SKILL.md frontmatter with each change:
- **Major version (1.0 → 2.0):** Substantial rewrites, breaking changes, complete restructuring
- **Minor version (1.0 → 1.1):** New sections, significant additions, refinements
- **Patch version (1.0.0 → 1.0.1):** Bug fixes, typo corrections, minor clarifications (optional third digit)

The version in frontmatter must match the latest CHANGELOG entry.

---

## What to Never Include

- **Tutorials or explanations** — Claude knows standard concepts. Document only expert-level knowledge.
- **"When to use" guidance in the body** — belongs only in `description`. Duplication wastes tokens.
- **Generic warnings** — "be careful", "handle errors", "test your code" add no expert knowledge.
- **Obvious procedures** — Claude knows how to open, edit, and save files.
