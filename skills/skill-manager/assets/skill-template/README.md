# Skill Name

<!-- NOTE: README.md is for HUMANS and DISTRIBUTION ONLY.

     Include README.md when:
     - Publishing skill to npm/registry
     - Sharing skill on GitHub
     - Distributing to other users

     EXCLUDE README.md for:
     - Private/local skills
     - Company-internal skills
     - Skills that won't be distributed

     Why: Skills aren't software projects. Agents don't read READMEs.
     README is purely for human discovery and installation.
-->

Brief description of what this skill does and who it's for.

## Installation

**npm**
```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill skill-name
```

**pnpm**
```bash
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill skill-name
```

## Usage

Describe how users interact with this skill either via a prompt, command, or explicit skill invocation:


**prompt**
```bash
Persona:
Describe the intended persona.

Objective:
1. Goal 1
2. Goal 2
3. Goal 3

Output:
Explain what skills are used and why.
```

**command**
```bash
/command-name path/to/code
```

```bash
Persona:
Describe the intended persona.

Objective:
1. Use the skill-name skill
2. Goal 1
3. Goal 2
4. Goal 3

Output:
Explain why rules from the skill are applied.
```

## What's Included

- **SKILL.md** - Main skill documentation with usage instructions
- **AGENTS.md** - Agent-optimized reference guide with implementation rules
- **references/** - Detailed examples and best practices
- **scripts/** - Automation scripts (if applicable)
- **assets/** - Templates and static resources (if applicable)

## Requirements

- List any prerequisites
- Required tools or dependencies
- Minimum versions if applicable

## Examples

### Example 1: [Use Case]

```bash
# Example command
```

Expected result: [description]

### Example 2: [Use Case]

```bash
# Example command
```

Expected result: [description]

---

## Contributing

Contributions are welcome! When contributing to this skill:

1. **CRITICAL**: Ensure description field in SKILL.md answers WHAT/WHEN/KEYWORDS - this determines if skill gets activated
2. Follow the skill structure guidelines in the skill-manager skill
3. Ensure all examples use ❌/✅ format for clarity
4. Keep SKILL.md under 500 lines (move details to references/)
5. Focus on expert-only knowledge - assume Claude knows basics
6. Test changes with actual use cases

**NEVER create:**
- CHANGELOG.md - Use git history instead and `metadata.version` in the `SKILL.md` frontmatter
- CONTRIBUTING.md - Keep contribution guide in README only
- INSTALLATION.md - Keep installation in README only
- Other meta-documentation - Skills aren't software projects

---

## Skill Architecture Philosophy

<!-- Optional: Remove this section if your skill doesn't need philosophical grounding.
     Keep it if your skill embodies specific principles worth explaining. -->

This skill follows these principles:

1. **[Principle 1]** - [Explanation]
2. **[Principle 2]** - [Explanation]
3. **[Principle 3]** - [Explanation]

---

## Learn More

- [Agent Skills Specification](https://agentskills.io/specification)
- [AGENTS.md](AGENTS.md) - Detailed implementation rules
- [references/](references/) - Comprehensive examples and patterns

---

## License

[Your license here]
