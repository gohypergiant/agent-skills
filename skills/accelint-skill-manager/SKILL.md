---
name: accelint-skill-manager
description: Use when creating, auditing, refactoring, evaluating, or improving an agent skill package itself, including SKILL.md, AGENTS.md, references, scripts, assets, evals, and CHANGELOG.md. Trigger on requests to create a skill, build a skill package, audit skill quality, fix or refactor a SKILL.md, optimize triggering, improve eval coverage, check version and changelog alignment, or review consistency across skill files. Best for skill-package architecture, quality, structure, and governance. Do not use for generic prompt polishing, prose-only cleanup, or README and docs work when the real task is not the skill package itself.
license: Apache-2.0
metadata:
  author: accelint
  version: "2.1.4"
---

# Skill Manager

## NEVER Do When Creating Skills

- **NEVER write tutorials that explain basics** - Assume Claude already knows standard concepts, libraries, and patterns. Focus on expert-only knowledge.
- **NEVER put triggering information in the body** - "When to use" guidance belongs ONLY in the description field. The body loads after the activation decision.
- **NEVER dump everything into SKILL.md** - Use progressive disclosure. Keep the core workflow in `SKILL.md` and move detailed content to `references/` for on-demand loading.
- **NEVER use generic warnings** - "Be careful" and "avoid errors" are useless. Provide specific anti-patterns with concrete reasons.
- **NEVER use one freedom level for every task** - Creative domains such as design and architecture need high freedom with principles. Fragile operations such as file formats and APIs need low freedom with exact scripts.
- **NEVER explain standard operations** - Assume Claude already knows how to read files, write code, and use common libraries. Focus on non-obvious decisions and edge cases.
- **NEVER include obvious procedures** - "Step 1: Open file, Step 2: Edit, Step 3: Save" wastes tokens. Include only domain-specific workflows Claude would not already know.
- **NEVER skip the anti-patterns section** - It carries half of the expert knowledge. A skill without a "NEVER Do" section misses the mistakes experts learned the hard way.
- **NEVER write a vague description** - "A skill for X" causes false positives and missed activations. The description MUST include concrete trigger phrases users actually say.
- **NEVER mix creation and audit concerns** - Creating a skill, refactoring a skill, and auditing a skill are distinct workflows. Each one has different inputs, outputs, and success criteria.

## Before Creating a Skill, Ask

Apply these tests to confirm that the skill provides genuine value:

### Knowledge Delta Test
- **Does this capture what takes experts years to learn?** If explaining basics or standard library usage, it's redundant.
- **Am I explaining TO Claude or arming Claude?** Skills should arm agents with expert knowledge, not teach them concepts.
- **Is every paragraph earning its context space?** Token economy matters - shared with system prompts, conversation history, and other skills.

### Activation Economics
- **Does the description clearly state when the skill should trigger and include searchable keywords?** Vague descriptions mean the skill never gets activated.
- **If the description briefly names the function, does it still avoid summarizing the workflow?** Workflow summaries in frontmatter can become shortcuts the agent follows instead of reading the skill.
- **Would an agent reading just the description know exactly when to use this?** If unclear, the skill is invisible.

### Freedom Calibration
- **What happens if the agent makes a mistake?** High consequence = low freedom (exact scripts). Low consequence = high freedom (principles).
- **Is there one correct way or multiple valid approaches?** One way = prescriptive. Multiple ways = guidance with examples.

### Token Efficiency
- **Can this be compressed without losing expert knowledge?** References loaded on-demand save context.
- **Are there repetitive procedures that could become scripts?** Reusable code belongs in scripts/, not repeated in instructions.

## How to Use

This skill uses **progressive disclosure** to minimize context usage:

### 1. Start with the workflow in `SKILL.md`
Follow the 4-step workflow below for skill creation or refactoring.

### 2. Load `AGENTS.md` for implementation details
Load [AGENTS.md](AGENTS.md) for file system conventions, naming patterns, and structure rules.

### 3. Load specific references as needed
Each workflow step below names the reference files to load. Load only the files you need for the current step:
- Directory structure → [references/file-system.md](references/file-system.md)
- Description field conventions → [references/skill.md](references/skill.md)
- AGENTS.md patterns → [references/agents.md](references/agents.md)
- Progressive disclosure rules → [references/progressive-disclosure.md](references/progressive-disclosure.md)
- Reference file format → [references/references.md](references/references.md)
- Script conventions → [references/scripts.md](references/scripts.md)
- Asset guidelines → [references/assets.md](references/assets.md)
- CHANGELOG maintenance → [references/changelog.md](references/changelog.md)

**Do NOT load all references at once** — load only the files relevant to your current step.

## Which Workflow Should You Follow?

Choose the workflow that matches the task:

- **Creating a new skill from scratch** → Follow Skill Creation Workflow (Steps 1-4)
- **Improving an existing skill** → Jump to Step 4 (Edit the Skill)
- **Auditing a skill for quality** → Follow Skill Audit Workflow

## Default Execution Paths

Use the lightest workflow that satisfies the request:

- **Quick audit** — audit frontmatter, trigger quality, structure, version/changelog alignment, eval presence, and direct usability. Do not draft a replacement skill unless the user asks for proposed rewrites.
- **Targeted refinement** — for requests like "tighten this SKILL.md" or "fix the description," load only the references needed for the touched area and make the localized improvements. Do **not** automatically propose version bumps, changelog edits, or adjacent package-maintenance work when the user asked for a narrow field-level change unless repo policy explicitly requires it or the user asks for package-release follow-through.
- **Full skill creation or large refactor** — use the full creation workflow when the user wants a new skill, a substantial structural rewrite, or new bundled resources.

If the request is only about prompt wording or prose cleanup and not about the skill package itself, prefer a prose or prompt-focused skill instead of this one. When redirecting out of scope work, lead with the better-matched skill in one sentence and avoid long explanations of this skill's workflow unless the user explicitly asks for the distinction.

## Skill Creation Workflow

To create or refactor a skill, follow the Skill Creation Workflow in order. Skip a step only when there is a clear reason it does not apply.

**Copy this checklist to track progress:**

```
- [ ] Step 1: Understanding - Gather concrete examples of skill usage
- [ ] Step 2: Planning - Identify reusable scripts, references, assets
- [ ] Step 3: Initializing - Check existing skills, create directory structure
- [ ] Step 4: Editing - Write agent-focused content with procedural knowledge and update CHANGELOG
```

Include what rules from this skill are being applied, and why, in your summary.

### Step 1: Understand the Skill with Concrete Examples

Skip this step only when the skill's usage patterns are already clear. It remains valuable even when you are working with an existing skill.

To create an effective skill, first understand concrete examples of how the skill will be used. That understanding can come from direct user examples or generated examples that the user validates.

Example: Building an image-editor skill, ask:
- "What functionality? Editing, rotating, other?"
- "Usage examples?"
- "Trigger phrases: 'Remove red-eye', 'Rotate image'—others?"

Ask 2-3 concrete questions first about functionality, examples, and trigger phrases. Then follow up based on the answers instead of front-loading every question.

Skip or compress those questions only when the brief already gives the functionality, representative examples, and likely trigger language with enough specificity to draft confidently. If you skip them, say briefly why the brief is already specific enough.

Conclude when there is a clear sense of the functionality the skill should support.

### Step 2: Plan the Reusable Skill Contents

To turn concrete examples into an effective skill, analyze each example by:

1. Considering how to execute the example from scratch
2. Identifying which scripts, references, and assets would help when you repeat that workflow

Examples:
- `pdf-editor` skill for "Rotate this PDF" → store `scripts/rotate-pdf.sh` to avoid rewriting code each time
- `frontend-app-builder` for "Build a todo app" → store `assets/hello-world/` boilerplate template
- `big-query` for "How many users logged in today?" → store `references/schema.md` with table schemas

Analyze each concrete example to create a list of reusable resources: scripts, references, and assets.

### Step 3: Initializing the Skill

**REQUIRED**: Load [references/file-system.md](references/file-system.md) before creating the directory structure.

**For new skills:** Copy the template in [assets/skill-template/](assets/skill-template/) as a starting point and customize it.

**For existing skills being refactored:** Skip directly to Step 4 — the skill already exists.

Before creating, check for existing skills that overlap:

```bash
ls -la .claude/skills 2>/dev/null || echo "No project skills found"
ls -la ~/.claude/skills 2>/dev/null || echo "No global skills found"
```

If relevant skills exist, mention them briefly: "I found [list] — should any of these be included or merged?"

Follow the conventions in [AGENTS.md](AGENTS.md) and reference files for directory structure and naming.

### Step 4: Edit the Skill

**REQUIRED**: Load [references/skill.md](references/skill.md) for description field conventions and frontmatter rules.

When editing a new or existing skill, remember that another agent instance will use it. Include information that is beneficial and non-obvious to an agent. Focus on procedural knowledge, domain-specific details, and reusable assets that help another agent instance execute the task more effectively.

**Calibrate freedom to task fragility:**

| Task Type | Freedom Level | Guidance Format | Example |
|-----------|---------------|-----------------|---------|
| **Creative/Design** | High freedom | Principles, thinking patterns, anti-patterns | "Commit to a bold aesthetic" |
| **Code Review** | Medium freedom | Guidelines with examples, decision frameworks | "Priority: security > logic > performance" |
| **File Operations** | Low freedom | Exact scripts, specific steps, no variation | "Use exact command: `pandoc --flag`" |

**The test:** "If the agent makes a mistake, what's the consequence?"
- High consequence (file corruption, data loss) → Low freedom with precise scripts
- Medium consequence (suboptimal code, style issues) → Medium freedom with examples
- Low consequence (aesthetic choices, multiple valid approaches) → High freedom with principles

If you are updating an existing skill, you can use the templates in [assets/skill-template/](assets/skill-template/) as a reference for larger structural changes and alignment. Consistency is REQUIRED, so use stronger reformatting when needed to achieve adherence.

When updating an existing skill, ensure that the frontmatter `metadata.version` value is bumped using consistent semantic-version logic **only when the requested work actually changes the published skill package and the repo expects manual version tracking for that change**. For audit-only requests, boundary redirects, or narrow proposed-only refinements, do not assume a version bump is part of scope.

**Version Control:**
- **Major (1.0.0 → 2.0.0):** Substantial rewrites, breaking changes, complete restructuring, or meaningfully different trigger/behavior expectations
- **Minor (1.0.0 → 1.1.0):** New sections, significant additions, stronger eval coverage, or meaningful refinements without breaking the skill's contract
- **Patch (1.0.0 → 1.0.1):** Small fixes, localized wording corrections, artifact consistency fixes, or other non-breaking maintenance updates

**CHANGELOG Maintenance:**
After updating a skill, update or create `CHANGELOG.md` using "Keep a Changelog" format:

```markdown
# Changelog

## [X.Y.Z] - YYYY-MM-DD

### Added
- New features/capabilities with rationale

### Changed
- Modifications with why (always include rationale)

### Fixed
- Bug fixes with explanation

### Version
- Version bump note
```

Document what changed and **why** — the rationale is critical for future maintainers. Link to evaluation results when improvements stem from testing. The CHANGELOG version must match the frontmatter `metadata.version`.

## Skill Audit Workflow

When auditing or reviewing an existing skill instead of creating one from scratch, follow this structured approach:

### 1. Frontmatter Audit
Check each field against requirements:
- `name`: lowercase, hyphens only, ≤64 chars, matches directory name
- `description`: starts with "Use when", focuses on triggering conditions rather than workflow summary, and includes concrete searchable trigger phrases/keywords
- `license`: present (optional but recommended)
- `metadata.version`: present, meaningful, uses full semver (`X.Y.Z`), and matches CHANGELOG.md latest version

### 2. Structure Audit
Compare the skill against expected concepts instead of one exact heading set. Core expectations are a `NEVER Do` anti-pattern section, a `Before [Action] Ask` thinking section, a `How to Use` section, and one or more main workflow sections. Accept clear variants such as separate creation and audit workflows, decision-tree sections, and optional routing sections like `Which Workflow Should You Follow?` or `Default execution paths`. Note truly missing concepts instead of penalizing well-structured naming variants.

### 3. CHANGELOG and Version Audit
Check CHANGELOG.md presence and quality:
- **Missing CHANGELOG:** Flag as missing documentation
- **Version mismatch:** Verify CHANGELOG latest version matches frontmatter `metadata.version`
- **Missing rationale:** Ensure changes include WHY, not just WHAT
- **Format compliance:** Check for proper "Keep a Changelog" structure
- **Empty sections:** Verify Added/Changed/Fixed sections have meaningful content

For narrow verification requests such as "do the version and changelog align?", stop after answering the requested check with evidence unless a directly related blocking issue changes that answer. Do not append broader changelog critique by default.

### 4. Knowledge Delta Test
For each content block, ask: "Does Claude already know this?" Mark as REDUNDANT or EXPERT-ONLY. Calculate the percentage of redundant content. If >50% redundant, recommend substantial revision.

### 5. Produce Actionable Output
- Provide specific improvement recommendations ranked by priority.
- Include a concrete improved description, not just criticism.
- Verify counts, path claims, and "all clear" statements before you assert them.
- Keep conclusion strength proportional to the evidence. Avoid claims like "production-ready" or "all links are correct" unless you actually verified that scope.
- Provide proposed replacement text or an improved `SKILL.md` only when the user asks for rewrite help or patch-ready changes, not for every audit-only request.
