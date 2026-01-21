# Agent Skills

Skills are modular, self-contained packages that extend Claude's capabilities by providing specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific domains or tasks. They can transform an agent into a specialized problem solver equipped with procedural knowledge that no model can fully possess.

- SKILLS.md follow the [Agent Skills](https://agentskills.io/) format.
- AGENTS.md follow the [Agents.md](https://agents.md/) format.

## Installation

```bash
npx skills add gohypergiant/agent-skills
```

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

**Examples:**
```
Ensure proper safety and error handling of this function
```

```
Review this React component for performance issues
```

```
Create a joystick component utilizing `react-aria-components` and `@accelint/design-toolkit`
```

```
Help me optimize this Next.js page for partial pre-rendering
```

## Testing

If a skill needs to be tested internal to this repo you can copy paste the directory from `skills/` into `./claude/skills/`. Optionally, you can install the skill globally to test it across multiple repos.

## Ecosystem

The following skills have been vetted and approved for usage alongside the other Accelint skills:

- [Motion Skill](https://skills.sh/onmax/nuxt-skills/motion)
- [Context7](https://skills.sh/intellectronica/agent-skills/context7)
- [Tanstack Query](https://skills.sh/jezweb/claude-skills/tanstack-query)

You can install these the same way as the Accelint skills:

```
npx skills add onmax/nuxt-skills --skill "motion"
```