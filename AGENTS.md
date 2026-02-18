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

---

## Frontmatter Spec (Non-Negotiable)

```yaml
name: skill-name          # lowercase + hyphens only, ≤64 chars, matches directory name
description: "..."        # THE most critical field — 1–1024 chars
license: Apache-2.0       # optional
metadata:
  author: "gohypergiant"  # optional
  version: "1.0"          # optional
```

### Description Requirements

The `description` must answer three questions:

1. **WHAT** — What does this skill do?
2. **WHEN** — When should it be used? (start with "Use when…")
3. **KEYWORDS** — What search terms trigger it?

```
✅ "Use when users say 'create X', 'build Y', or when working with .ext files
    for purpose A or B. [WHAT it does]. [Additional trigger keywords]."
❌ "Helps with various tasks"
```

**`name` rules:** lowercase only, hyphens only (no underscores), no consecutive hyphens, ≤64 chars, must match directory name exactly.

---

## Directory Structure

```
skill-name/
├── SKILL.md          # Required — frontmatter + expert knowledge
├── AGENTS.md         # Optional — quick reference, rules summary, TOC to references/
├── README.md         # Optional — humans/distribution only, never for internal skills
├── references/       # Optional — detailed ❌/✅ examples, loaded on-demand
├── scripts/          # Optional — reusable automation
└── assets/           # Optional — templates, data files
```

---

## Skill Template

Always start from the template — copy and customize:

```
skills/accelint-skill-manager/assets/skill-template/
```

### SKILL.md Sections

| Section | Purpose | Notes |
|---------|---------|-------|
| `NEVER Do [Domain]` | 5–8 anti-patterns with non-obvious WHY | Half of expert knowledge |
| `Before [Action], Ask` | Thinking frameworks (3–5 questions) | Teach decision-making, not just steps |
| `How to Use` | Direct instructions OR progressive disclosure | Never mix both |
| Main Workflow | Core domain-specific procedure | Chosen format: phased / decision tree / creative |
| `Freedom Calibration` | Only if skill spans multiple task types | Skip for single-type skills |
| `Important Notes` | Non-obvious critical considerations only | No obvious reminders |

### Anti-Pattern Format

```
NEVER [specific thing] — [concrete reason from experience, not generic warning]
```

Ask: *"Would an expert say 'I learned this the hard way'?"*

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

## What to Never Include

- Tutorials explaining concepts Claude already knows
- "When to use" guidance in the body — that belongs **only** in `description`
- Generic warnings ("be careful", "handle errors", "test your code")
- Obvious procedures (open file, edit, save)
- `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md` for private/internal skills

---

## Verification Workflow (MANDATORY)

After creating or significantly modifying a skill, run this 4-step audit loop before considering the work done.

### Step 1 — Initial skill-judge audit
Run the `skill-judge` skill against the completed skill. Apply all suggested improvements before proceeding.

### Step 2 — accelint-skill-manager audit
Run `/clear` to reset context, then run the `accelint-skill-manager` skill against the skill. Apply all structural and content suggestions before proceeding.

### Step 3 — Final skill-judge audit
Run `/clear`, then run `skill-judge` again. Apply remaining suggestions. Target **grade B or higher (≥96/120)**.

### Step 4 — Frontmatter verification checklist

- [ ] `name` is lowercase, no uppercase letters, no consecutive hyphens, ≤64 chars, matches directory name
- [ ] `description` answers WHAT + WHEN + KEYWORDS, is non-empty, ≤1024 chars
- [ ] `metadata.version` is bumped (major for substantial changes, minor for small fixes)
