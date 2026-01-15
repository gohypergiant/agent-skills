# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Cursor, Copilot, etc.) when working with code in this repository.

## Creating a New Skill

### Directory Structure

```
skills/
  {skill-name}/           # kebab-case directory name
    README.md             # Required: human friendly overview of skill
    AGENTS.md             # Required: rule definitions and guidelines
    SKILL.md              # Required: skill definition with link to AGENTS.md
    scripts/              # Required: executable scripts
      {script-name}.sh    # Bash scripts (preferred)
```

### Naming Conventions

- **Skill directory**: `kebab-case` (e.g., `js-ts-best-practices`)
- **SKILL.md**: Always uppercase, always this exact filename
- **AGENTS.md**: Always uppercase, always this exact filename
- **README.md**: Always uppercase, always this exact filename
- **Scripts**: `kebab-case.sh` (e.g., `run.sh`, `fetch-logs.sh`)

### Best Practices for Context Efficiency

Skills are loaded on-demand — only the skill name and description are loaded at startup. The full `SKILL.md` loads into context only when the agent decides the skill is relevant. To minimize context usage:

- **Keep SKILL.md under 500 lines** — put detailed reference material in separate files
- **Write specific descriptions** — helps the agent know exactly when to activate the skill
- **Use progressive disclosure** — reference supporting files that get read only when needed
- **Prefer scripts over inline code** — script execution doesn't consume context (only output does)
- **File references work one level deep** — link directly from SKILL.md to supporting files

### Script Requirements

- Use `#!/bin/bash` shebang
- Use `set -e` for fail-fast behavior
- Write status messages to stderr: `echo "Message" >&2`
- Write machine-readable output (JSON) to stdout
- Include a cleanup trap for temp files
- Reference the script path as `/mnt/skills/user/{skill-name}/scripts/{script}.sh`