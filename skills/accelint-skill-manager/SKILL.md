---
name: accelint-skill-manager
description: Use when creating, auditing, refactoring, evaluating, or improving an agent skill package itself, including `SKILL.md`, `AGENTS.md`, `references/`, `scripts/`, `assets/`, `evals/`, and `CHANGELOG.md`. Trigger on requests like "create a skill," "make a new skill," "build a skill package," "audit this skill package," "review skill quality," "fix this SKILL.md," "refactor this skill," "optimize skill triggering," "improve eval coverage," "check version/changelog alignment," or "review consistency across skill files." Do not use for generic prompt polishing, prose-only cleanup, or README/docs work when the real task is not skill-package architecture, quality, or governance.
license: Apache-2.0
metadata:
  author: accelint
  version: "2.1.2"
---

# Skill Manager

## NEVER Do When Creating Skills

- **NEVER write tutorials explaining basics** - Assume Claude knows standard concepts, libraries, and patterns. Focus on expert-only knowledge.
- **NEVER put triggering information in the body** - "When to use" guidance belongs ONLY in the description field. The body is loaded after the activation decision.
- **NEVER dump everything in SKILL.md** - Use progressive disclosure: keep the core workflow in `SKILL.md` and move detailed content to `references/` for on-demand loading.
- **NEVER use generic warnings** - "Be careful" and "avoid errors" are useless. Provide specific anti-patterns with concrete reasons.
- **NEVER use the same freedom level for all tasks** - Creative domains (design, architecture) need high freedom with principles. Fragile operations (file formats, APIs) need low freedom with exact scripts.
- **NEVER explain standard operations** - Assume Claude knows how to read files, write code, and use common libraries. Focus on non-obvious decisions and edge cases.
- **NEVER include obvious procedures** - "Step 1: Open file, Step 2: Edit, Step 3: Save" wastes tokens. Include only domain-specific workflows Claude would not already know.
- **NEVER skip the anti-patterns section** - It is half of the expert knowledge. A skill without "NEVER Do" misses the mistakes experts learned the hard way.
- **NEVER write a vague description** - "A skill for X" causes false positives and missed activations. The description MUST include concrete trigger phrases users actually say.
- **NEVER mix creation and audit concerns** - Creating a skill, refactoring a skill, and auditing a skill are distinct workflows. Each has different inputs, outputs, and success criteria.

## Before Creating a Skill, Ask

Apply these tests to make sure the skill provides genuine value:

### Knowledge Delta Test
- **Does this capture what takes experts years to learn?** If explaining basics or standard library usage, it's redundant.
- **Am I explaining TO Claude or arming Claude?** Skills should arm agents with expert knowledge, not teach them concepts.
- **Is every paragraph earning its context space?** Token economy matters - shared with system prompts, conversation history, and other skills.

### Activation Economics
- **Does the description answer WHAT, WHEN, and include KEYWORDS?** Vague descriptions mean the skill never gets activated.
- **Would an agent reading just the description know exactly when to use this?** If unclear, the skill is invisible.

### Freedom Calibration
- **What happens if the agent makes a mistake?** High consequence = low freedom (exact scripts). Low consequence = high freedom (principles).
- **Is there one correct way or multiple valid approaches?** One way = prescriptive. Multiple ways = guidance with examples.

### Token Efficiency
- **Can this be compressed without losing expert knowledge?** References loaded on-demand save context.
- **Are there repetitive procedures that could become scripts?** Reusable code belongs in scripts/, not repeated in instructions.

## How to Use

This skill uses **progressive disclosure** to minimize context usage:

### 1. Start with the Workflow (SKILL.md)
Follow the 4-step workflow below for skill creation or refactoring.

### 2. Reference Implementation Details (AGENTS.md)
Load [AGENTS.md](AGENTS.md) for file system conventions, naming patterns, and structure rules.

### 3. Load Specific References as Needed
Each workflow step below notes which reference files to load. Only load what you need for the current step:
- Directory structure → [references/file-system.md](references/file-system.md)
- Description field conventions → [references/skill.md](references/skill.md)
- AGENTS.md patterns → [references/agents.md](references/agents.md)
- Progressive disclosure rules → [references/progressive-disclosure.md](references/progressive-disclosure.md)
- Reference file format → [references/references.md](references/references.md)
- Script conventions → [references/scripts.md](references/scripts.md)
- Asset guidelines → [references/assets.md](references/assets.md)
- CHANGELOG maintenance → [references/changelog.md](references/changelog.md)

**Do NOT load all references at once** — load only the ones relevant to your current step.

## Which Workflow Should You Follow?

Choose the workflow that matches the task:

- **Creating a new skill from scratch** → Follow Skill Creation Workflow (Steps 1-4)
- **Improving an existing skill** → Jump to Step 4 (Edit the Skill)
- **Auditing a skill for quality** → Follow Skill Audit Workflow

## Default execution paths

Use the lightest workflow that satisfies the request:

- **Quick audit** — audit frontmatter, trigger quality, structure, version/changelog alignment, eval presence, and direct usability. Do not draft a replacement skill unless the user asks for proposed rewrites.
- **Targeted refinement** — for requests like "tighten this SKILL.md" or "fix the description," load only the references needed for the touched area, make the localized improvements, and update version/changelog accordingly.
- **Full skill creation or large refactor** — use the full creation workflow when the user wants a new skill, a substantial structural rewrite, or new bundled resources.

If the request is only about prompt wording or prose cleanup and not about the skill package itself, prefer a prose or prompt-focused skill instead of this one.

## Skill Creation Workflow

To create or refactor a skill, follow the Skill Creation Workflow in order. Skip a step only when there is a clear reason that it does not apply.

**Copy this checklist to track progress:**

```
- [ ] Step 1: Understanding - Gather concrete examples of skill usage
- [ ] Step 2: Planning - Identify reusable scripts, references, assets
- [ ] Step 3: Initializing - Check existing skills, create directory structure
- [ ] Step 4: Editing - Write agent-focused content with procedural knowledge and update CHANGELOG
```

Include what rules from this skill are being applied, and why, in your summary.

### Step 1: Understanding the Skill with Concrete Examples

Skip this step only when the skill's usage patterns are already clearly understood. It remains valuable even when working with an existing skill.

To create an effective skill, clearly understand concrete examples of how the skill will be used. This understanding can come from either direct user examples or generated examples that are validated with user feedback.

Example: Building an image-editor skill, ask:
- "What functionality? Editing, rotating, other?"
- "Usage examples?"
- "Trigger phrases: 'Remove red-eye', 'Rotate image'—others?"

Ask 2-3 concrete questions first (functionality, examples, trigger phrases), then follow up based on their answers rather than front-loading all questions.

Conclude when there is a clear sense of the functionality the skill should support.

### Step 2: Planning the Reusable Skill Contents

To turn concrete examples into an effective skill, analyze each example by:

1. Considering how to execute on the example from scratch
2. Identifying what scripts, references, and assets would be helpful when executing these workflows repeatedly

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

When editing the (newly-generated or existing) skill, remember that the skill is being created for another instance of an agent to use. Focus on including information that would be beneficial and non-obvious to an agent. Consider what procedural knowledge, domain-specific details, or reusable assets would help another agent instance execute these tasks more effectively.

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

If you are updating an existing skill, you can use the templates in [assets/skill-template/](assets/skill-template/) as a reference for larger structural changes and alignment. Consistency is REQUIRED, so lean toward aggressive reformatting when needed to achieve adherence.

When updating an existing skill, ensure that the frontmatter `metadata.version` value is bumped using consistent semantic-version logic.

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

When auditing or reviewing an existing skill, and not creating one from scratch, follow this structured approach:

### 1. Frontmatter Audit
Check each field against requirements:
- `name`: lowercase, hyphens only, ≤64 chars, matches directory name
- `description`: starts with "Use when", includes WHAT/WHEN/KEYWORDS, has concrete trigger phrases
- `license`: present (optional but recommended)
- `metadata.version`: present, meaningful, and matches CHANGELOG.md latest version

### 2. Structure Audit
Compare against expected sections: NEVER Do, Before [Action] Ask, How to Use, Main Workflow. Note missing sections.

### 3. CHANGELOG and Version Audit
Check CHANGELOG.md presence and quality:
- **Missing CHANGELOG:** Flag as missing documentation
- **Version mismatch:** Verify CHANGELOG latest version matches frontmatter `metadata.version`
- **Missing rationale:** Ensure changes include WHY, not just WHAT
- **Format compliance:** Check for proper "Keep a Changelog" structure
- **Empty sections:** Verify Added/Changed/Fixed sections have meaningful content

### 4. Knowledge Delta Test
For each content block, ask: "Does Claude already know this?" Mark as REDUNDANT or EXPERT-ONLY. Calculate the percentage of redundant content. If >50% redundant, recommend substantial revision.

### 5. Produce Actionable Output
- Provide specific improvement recommendations ranked by priority
- Include a concrete improved description, not just criticism
- Provide proposed replacement text or an improved `SKILL.md` only when the user asks for rewrite help or patch-ready changes, not for every audit-only request
