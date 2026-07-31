# 1.1 File System

## Directory Structure

A skill is a directory that contains at minimum a `SKILL.md` file. You can optionally include additional directories such as `scripts/`, `references/`, and `assets/` to support the skill. Include a `README.md` file with a general overview optimized for human readers, not agent readers. Keep file references one level deep from `SKILL.md`. Avoid deeply nested reference chains.

### Naming Conventions

- **Skill directory**: `kebab-case` (e.g., `ts-best-practices`)
- **SKILL.md**: Always uppercase, always this exact filename
- **AGENTS.md**: Always uppercase, always this exact filename
- **README.md**: Always uppercase, always this exact filename
- **Scripts directory**: `scripts` - use this exact folder name
- **Scripts**: `kebab-case.sh` (e.g., `run.sh`, `fetch-logs.sh`)
- **References directory**: `references` - use this exact folder name
- **References**: `kebab-case.md` (e.g., `aaa-pattern.md`, `derive-state.md`)

### Local File References

When referencing other files in your skill, use relative paths from the skill root:

```
See [the reference guide](references/REFERENCE.md) for details.

Run the extraction script:
scripts/extract.sh
```

---

Reference: https://agentskills.io/specification#directory-structure
