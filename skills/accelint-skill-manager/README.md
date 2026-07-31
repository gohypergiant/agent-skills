# Skill Manager

Create, audit, refactor, and maintain agent skills using structured workflows, progressive disclosure, and evidence-based patterns.

## Installation

**npm:**
```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-skill-manager
```

**pnpm:**
```bash
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-skill-manager
```

---

## Overview

This skill provides guidance for skill creation and management, including:
- 4-step skill creation workflow
- Skill architecture and file structure
- Progressive disclosure patterns
- Version and changelog conventions
- Audit procedures for skill quality

Think of this as a "meta-skill": a skill for building skills. It provides the methodology, conventions, and structure guidelines needed to develop high-quality agent skills.

**Note:** This skill is optimized for AI agents creating other skills, but humans may find it useful for understanding skill architecture and contributing to skill development.

---

## Requirements

- Claude Code CLI or compatible agent environment
- File system write permissions for skill creation
- Git repository (recommended for version tracking)
- Understanding of agent skill architecture

---

## Quick Start

### For Agents/LLMs

1. **Read [SKILL.md](SKILL.md)** - Understand the 4-step workflow for creating skills.
2. **Reference [AGENTS.md](AGENTS.md)** - Browse detailed implementation rules and conventions.
3. **Load specific guidelines** - Access detailed examples in `references/` only as needed.
4. **Follow the workflow** - Apply the structured approach to skill creation.

### For Humans

This skill is optimized for AI agents, but humans may also find it useful for:
- Understanding how agent skills are structured
- Learning best practices for skill architecture
- Contributing to existing skills
- Creating new skills for specialized domains
- Packaging domain expertise for AI agents

---

## Skill Creation Workflow

### Step 1: Understanding with Concrete Examples

Gather real examples of how the skill will be used. Ask questions to understand:
- What functionality should the skill support?
- Can you give examples of how this skill would be used?
- What would a user say that should trigger this skill?

This keeps the skill grounded in actual problems instead of hypothetical ones.

### Step 2: Planning Reusable Contents

Analyze each example to identify reusable resources:
- **Scripts**: Executable helpers that eliminate repetitive coding
- **References**: Documentation of schemas, patterns, or domain knowledge
- **Assets**: Templates, boilerplate, or example files

### Step 3: Initializing the Skill

Create the skill structure following established conventions:
- Check for existing relevant skills
- Follow naming conventions (kebab-case directories, uppercase SKILL.md)
- Set up proper directory structure
- Use the template in `assets/skill-template/` as a starting point

### Step 4: Editing and Refining

Develop skill content with agent-focused information:
- Include procedural knowledge that isn't obvious
- Focus on non-obvious implementation details
- Structure content for progressive disclosure
- Update version and changelog using semantic versioning

---

## Key Features

### Progressive Disclosure
- Metadata (~100 tokens) loaded at startup
- Main `SKILL.md` should stay concise; prefer keeping it under ~500 lines and move detailed examples into `references/`
- References loaded only when needed
- Minimizes context usage for LLMs

### Concrete Examples
Every skill should be built around real usage patterns:
- Start with actual user requests
- Identify repetitive workflows
- Package reusable solutions

### Structured Guidelines
All guidelines follow a consistent format:
- One-line summaries with links
- Anti-pattern/correct-pattern examples in reference files
- Self-contained documentation

### Version Control
- Semantic versioning (major.minor.patch)
- CHANGELOG.md with rationale for each change
- Version alignment between SKILL.md frontmatter and CHANGELOG

### Reusable Resources
Package three types of resources:
- **Scripts**: Automate repetitive tasks
- **References**: Document schemas, patterns, APIs
- **Assets**: Provide templates and boilerplate

---

## Package Focus

This package is for maintainers creating or improving skill packages. For general background on what skills are, see the external references linked in [Learn More](#learn-more). This README stays focused on the package workflow, artifact set, and maintenance conventions used here.

---

## Usage

This skill is designed for environments such as Claude Code. It automatically activates when creating, refactoring, or auditing agent skills.

### Auditing an Existing Skill

**prompt:**
```
Persona:
You are an expert skill architect.

Objective:
1. Use the accelint-skill-manager skill to audit ./skills/example-skill
2. Identify any best practice optimizations that can be made
3. Optimize towards deterministic output and correctness when auditing
4. Explain your reasoning clearly with specific examples

Output:
A complete, production-ready skill following all best practices.
```

### Creating a New Skill

**prompt:**
```
Persona:
You are an expert skill architect.

Objective:
1. Use the accelint-skill-manager skill
2. Create a new skill for [domain/tool/workflow]
3. Follow the 4-step workflow
4. Ensure adherence to all conventions

Output:
A complete, production-ready skill following all best practices.
```

### Manual Invocation

**command:**
```bash
/accelint-skill-manager
```

See [SKILL.md](SKILL.md) for complete activation criteria and detailed workflow.

---

## File Structure

```
accelint-skill-manager/
├── SKILL.md                     # Main skill workflow and instructions
├── AGENTS.md                    # Implementation rules for maintainers
├── README.md                    # This file
├── CHANGELOG.md                 # Version history with rationale
├── references/                  # Detailed implementation guides
│   ├── agents.md                # AGENTS.md formatting conventions
│   ├── assets.md                # Asset file guidelines
│   ├── changelog.md             # CHANGELOG best practices
│   ├── file-system.md           # Directory structure conventions
│   ├── progressive-disclosure.md # Context optimization patterns
│   ├── references.md            # Reference file format
│   ├── scripts.md               # Script conventions
│   └── skill.md                 # SKILL.md frontmatter and structure
├── assets/                      # Templates and boilerplate
│   └── skill-template/          # Starting template for new skills
│       ├── SKILL.md
│       ├── AGENTS.md
│       ├── README.md
│       ├── CHANGELOG.md
│       └── references/
│           └── example.md
└── evals/                       # Test cases for skill behavior
    └── evals.json               # Structured evaluation suite
```

---

## Contributing

When creating or updating skills:

1. **Follow the 4-step workflow** - Do not skip steps without a clear reason.
2. **Start with concrete examples** - Use real usage patterns, not hypothetical scenarios.
3. **Structure for progressive disclosure** - Keep `SKILL.md` under 500 lines and move details to `references/`.
4. **Use consistent formatting** - Follow naming conventions and directory structure.
5. **Include both anti-pattern and correct-pattern examples** - Show what not to do and what to do instead.
6. **Document for agents** - Focus on non-obvious procedural knowledge.
7. **Maintain version control** - Update both version and CHANGELOG with rationale for changes.

See [AGENTS.md](AGENTS.md) for detailed implementation guidelines.

**Learn More:**
- [Agent Skills Specification](https://agentskills.io/specification)
- [references/](references/) - Detailed examples and best practices

---

## Skill Architecture Philosophy

This skill follows these principles:

1. **Progressive disclosure** - Load information only when needed
2. **Concrete over abstract** - Build from real examples, not hypothetical use cases
3. **Agent-focused content** - Include procedural knowledge that helps agents execute effectively
4. **Reusable resources** - Package scripts, schemas, and templates to eliminate repetitive work
5. **Consistent structure** - Follow conventions for predictable, maintainable skills
6. **Minimal nesting** - Keep file references one level deep from SKILL.md

---

## Architecture & Development Guides

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Repository architecture and technical overview
- [AGENTS.md](../../AGENTS.md) - Agent behavior rules for this repository
- [CLAUDE.md](../../CLAUDE.md) - Claude-specific agent conventions

---

## Learn More

- [Agent Skill Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices.md)
- [What Are Agent Skills?](https://agentskills.io/what-are-skills.md)
- [Agent Skill Spec](https://agentskills.io/specification.md)

---

## License

Apache 2.0
