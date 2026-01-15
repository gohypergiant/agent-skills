# Agent Skills

A collection of skills for AI coding agents. Skills are packaged instructions and scripts that extend agent capabilities.

- SKILLS.md follow the [Agent Skills](https://agentskills.io/) format.
- AGENTS.md follow the [Agents.md](https://agents.md/) format.

## Installation

```bash
npx add-skill gohypergiant/agent-skills
```

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

**Examples:**
```
Ensure proper safety of this function
```

```
Review this React component for performance issues
```

```
Create a joystick component utilizing `react-aria-components` and `@accelint/design-toolkit`
```

```
Help me optimize this Next.js page
```

## Skill Structure

Each skill contains:
- `SKILL.md` - Agent Skills formatted document
- `README.md` - Overview for humans
- `AGENTS.md` - Agents.md formatted document
- `scripts/` - Helper scripts for automation (optional)
- `references/` - Supporting documentation (optional)

### AGENTS.md Structure

General rule of thumb is to follow guidance from [Agent Skills](https://agentskills.io/). Since the bulk of the content is held in the `AGENTS.md` file the content for this file should be optimized towards helping the agent understand if this skill is relevant.

```markdown
---
name: (your-name-here)
description: (your-description-here)
metadata:
  author: gohypergiant
  version: "1.0"
---

# Title

## When to Apply

Reference these guidelines when:
- Writing JavaScript or TypeScript code
- Refactoring existing JavaScript or TypeScript code
- Reviewing code for style issues
- Reviewing code for performance issues
- Reviewing code for safety issues
- Etc...

## How to Use

Read the complete guide with all rules: [AGENTS.md](AGENTS.md)
```


### AGENTS.md Structure

General rule of thumb is to follow guidance from [Agents.md](https://agents.md/). At minimum try and provide concise and descriptive examples of what incorrect and correct. Consolidate examples as reasonably as possible to reduce token usage.

```markdown
## Rule Title Here

Brief explanation of the rule and why it matters.

**❌ Incorrect: (description of why)**
```ts
// Bad code example
```

**✅ Correct: (description of why)**
```ts
// Good code example
```

Optional explanatory text after examples.

Reference: [Link](https://example.com)
```