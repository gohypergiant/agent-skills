---
name: skill-manager
description: Use when users say "create a skill", "make a new skill", "build a skill", "skill for X", "package this as a skill", or when refactoring/updating existing skills that extend agent capabilities with specialized knowledge, workflows, or tool integrations.
license: Apache-2.0
metadata:
  author: gohypergiant
  version: "2.1"
---

# Skill Manager

This skill provides guidance for creating and managing effective agent skills.

## About Skills

Skills are modular, self-contained packages that extend Claude's capabilities by providing specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific domains or tasks. They can transform an agent into a specialized problem solver equipped with procedural knowledge that no model can fully possess.

### What Skills Provide

1. Specialized workflows - Multi-step procedures for specific domains
2. Tool integrations - Instructions for working with specific file formats or APIs
3. Domain expertise - Company-specific knowledge, schemas, business logic
4. Bundled resources - Scripts, references, and assets for complex and repetitive tasks
5. Best practices - Documentation and examples regarding best practices for particular subjects

## When NOT to Use This Skill

Skip this skill when:
- User is just asking questions about existing skills (not creating/modifying)
- Task involves running/executing skills (not authoring them)
- Request is for general coding help unrelated to skill packaging
- User wants to modify skill behavior but not the skill file itself

## When to Activate This Skill

Use this skill when the task involves:

### Creating New Skills
- User requests to "create a skill", "make a new skill", "build a skill"
- Packaging domain expertise or workflows for reuse
- Converting repetitive tasks into reusable resources
- Bundling scripts, references, or templates into a skill

### Refactoring Existing Skills
- Updating skill structure or organization
- Improving skill compliance with specifications
- Adding progressive disclosure patterns
- Enhancing token efficiency
- Aligning with current best practices

### Auditing Skills
- Reviewing skills for best practice compliance
- Identifying optimization opportunities
- Ensuring deterministic output patterns

## Example Trigger Phrases

This skill should activate when users say things like:

**Creating New Skills:**
- "Create a skill for handling PDF documents"
- "Make a new skill that helps with BigQuery schemas"
- "Build a skill to package our React best practices"
- "Package this as a skill"
- "Skill for X" (where X is a domain/tool/workflow)

**Refactoring Existing Skills:**
- "Update the vitest skill to follow the latest patterns"
- "Refactor this skill to be more token-efficient"
- "Improve the progressive disclosure in our testing skill"
- "Align this skill with the specification"

**Auditing Skills:**
- "Audit the skill-manager skill"
- "Review this skill for best practices"
- "Check if this skill follows the guidelines"

## Flowchart Usage

```
digraph when_flowchart {
  "Need to show information?" [shape=diamond];
  "Decision where I might go wrong?" [shape=diamond];
  "Use markdown" [shape=box];
  "Small inline flowchart" [shape=box];

  "Need to show information?" -> "Decision where I might go wrong?" [label="yes"];
  "Decision where I might go wrong?" -> "Small inline flowchart" [label="yes"];
  "Decision where I might go wrong?" -> "Use markdown" [label="no"];
}
```

**Use flowcharts ONLY for:**
- Non-obvious decision points
- Process loops where you might stop too early
- "When to use A vs B" decisions

**Never use flowcharts for:**
- Reference material → Tables, lists
- Code examples → Markdown blocks
- Linear instructions → Numbered lists
- Labels without semantic meaning (step1, helper2)

## How to Use

This skill uses **progressive disclosure** to minimize context usage:

### 1. Start with the Workflow (SKILL.md)
Follow the 4-step workflow below for skill creation or refactoring.

### 2. Reference Implementation Details (AGENTS.md)
Load [AGENTS.md](AGENTS.md) for file system conventions, naming patterns, and structural rules.

### 3. Load Specific Examples as Needed
When implementing specific rules, load corresponding reference files for ❌/✅ examples.

## Skill Creation Workflow

To create or refactor a skill, follow the "Skill Creation Workflow" in order, skipping steps only if there is a clear reason why they are not applicable.

**Copy this checklist to track progress:**

```
- [ ] Step 1: Understanding - Gather concrete examples of skill usage
- [ ] Step 2: Planning - Identify reusable scripts, references, assets
- [ ] Step 3: Initializing - Check existing skills, create directory structure
- [ ] Step 4: Editing - Write agent-focused content with procedural knowledge
```

### Step 1: Understanding the Skill with Concrete Examples

Skip this step only when the skill's usage patterns are already clearly understood. It remains valuable even when working with an existing skill.

To create an effective skill, clearly understand concrete examples of how the skill will be used. This understanding can come from either direct user examples or generated examples that are validated with user feedback.

Example: Building an image-editor skill, ask:
- "What functionality? Editing, rotating, other?"
- "Usage examples?"
- "Trigger phrases: 'Remove red-eye', 'Rotate image'—others?"

Avoid overwhelming users. Start with key questions, follow up as needed.

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

At this point, it is time to actually create the skill. 

Check available skills to identify potentially relevant ones the user may have missed:

```bash
ls -la .claude/skills 2>/dev/null || echo "No project skills found"
ls -la ~/.claude/skills 2>/dev/null || echo "No global skills found"
```

Look for skills related to:
- File types the command will process (docx, pdf, xlsx, pptx)
- Domain expertise (frontend-design, product-self-knowledge)
- Workflows or patterns (skill-creator, mcp-builder)

Present relevant skills to the user:
- "I found these skills that might be relevant: [list]. Should any of these be included?"
- Be concise; only mention skills with clear relevance

Skip this step only if the skill being developed already exists, and iteration or packaging is needed. In this case, continue to the next step.

For new skills, use the template in [assets/skill-template/](assets/skill-template/) as a starting point. Copy the template directory and customize it for your specific skill.

Follow the instructions and conventions outlined in the [AGENTS.md](AGENTS.md) outline as well as the references.

### Step 4: Edit the Skill

When editing the (newly-generated or existing) skill, remember that the skill is being created for another instance of an agent to use. Focus on including information that would be beneficial and non-obvious to an agent. Consider what procedural knowledge, domain-specific details, or reusable assets would help another agent instance execute these tasks more effectively. 

If you are updating an existing skill you can use the templates in [assets/skill-template/](assets/skill-template/) as a reference for larger structural changes and alignment. Consistency is imperative so lean towards aggressive reformatting to achieve adherence.

When updating an existing skill, ensure that the frontmatter `metadata.version` value is bumped. If the scope of the change is substantial do a major change 1.0 to 2.0, otherwise minor 1.0 to 1.1.