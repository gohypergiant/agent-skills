# Skill Manager

Comprehensive guide for creating effective agent skills that extend Claude's capabilities with specialized knowledge, workflows, and tool integrations.

## Installation

**npm**
```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill skill-manager
```

**pnpm**
```bash
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill skill-manager
```

## Overview

This skill provides structured guidance for skill creation and management, covering:
- 4-step skill creation workflow
- Skill architecture and file structure
- Progressive disclosure patterns
- Best practices for reusable resources
- Examples and templates

Think of this as a "meta-skill" - a skill for building skills. It provides the methodology, conventions, and structural guidelines needed to develop high-quality agent skills.

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

1. **Read [SKILL.md](SKILL.md)** - Understand the 4-step workflow for creating skills
2. **Reference [AGENTS.md](AGENTS.md)** - Browse detailed implementation rules and conventions
3. **Load specific guidelines** - Access detailed examples in `references/` as needed
4. **Follow the workflow** - Apply the systematic approach to skill creation

### For Humans

This skill is optimized for AI agents but humans may find it useful for:
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

This ensures the skill solves actual problems rather than hypothetical ones.

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

### Step 4: Editing and Refining

Develop skill content with agent-focused information:
- Include procedural knowledge that isn't obvious
- Focus on non-obvious implementation details
- Structure content for progressive disclosure

---

## Key Features

### Progressive Disclosure
- Metadata (~100 tokens) loaded at startup
- Main SKILL.md (<5000 tokens) loaded when activated
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
- ❌/✅ examples in reference files
- Self-contained documentation

### Reusable Resources
Package three types of resources:
- **Scripts**: Automate repetitive tasks
- **References**: Document schemas, patterns, APIs
- **Assets**: Provide templates and boilerplate

---

## What Skills Provide

Skills are modular packages that extend Claude's capabilities by providing:

1. **Specialized workflows** - Multi-step procedures for specific domains
2. **Tool integrations** - Instructions for working with specific file formats or APIs
3. **Domain expertise** - Company-specific knowledge, schemas, business logic
4. **Bundled resources** - Scripts, references, and assets for complex tasks
5. **Best practices** - Documentation and examples for particular subjects

Skills act as "onboarding guides" that transform agents into specialized problem solvers equipped with procedural knowledge.

---

## Example Skills

- **pdf-editor**: Scripts for rotating, merging, and manipulating PDFs
- **frontend-app-builder**: Boilerplate templates for React/Next.js apps
- **big-query**: Table schemas and relationships for database queries
- **vitest**: Best practices and patterns for testing with Vitest
- **react-best-practices**: Performance optimization patterns for React

---

## Usage

This skill is designed to be used with environments such as Claude Code. It automatically activates when creating, refactoring, or auditing agent skills.

### Auditing an Existing Skill

**prompt**
```bash
Persona:
You are an expert skill architect.

Objective:
1. Use the skill-manager skill to audit ./skills/example-skill
2. Identify any best practice optimizations that can be made
3. Optimize towards deterministic output and correctness when auditing
4. Explain your reasoning clearly with specific examples

Output:
A complete, production-ready skill following all best practices.
```

### Creating a New Skill

**prompt**
```bash
Persona:
You are an expert skill architect.

Objective:
1. Use the skill-manager skill
2. Create a new skill for [domain/tool/workflow]
3. Follow the 4-step workflow
4. Ensure adherence to all conventions

Output:
A complete, production-ready skill following all best practices.
```

### Manual Invocation

**command**
```bash
/skill-manager
```

See [SKILL.md](SKILL.md) for complete activation criteria and detailed workflow.

---

## Contributing

When creating or updating skills:

1. **Follow the 4-step workflow** - Don't skip steps
2. **Start with concrete examples** - Real usage patterns, not hypothetical scenarios
3. **Structure for progressive disclosure** - Keep SKILL.md under 500 lines, move details to references
4. **Use consistent formatting** - Follow naming conventions and directory structure
5. **Include both ❌ and ✅ examples** - Show anti-patterns and correct implementations
6. **Document for agents** - Focus on non-obvious procedural knowledge

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
