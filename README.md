# Agent Skills

Skills are modular, self-contained packages that extend Claude's capabilities by providing specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific domains or tasks. They can transform an agent into a specialized problem solver equipped with procedural knowledge that no model can fully possess.

- SKILLS.md follow the [Agent Skills](https://agentskills.io/) format.
- AGENTS.md follow the [Agents.md](https://agents.md/) format.

## Installation

If your project uses `npm`:
```bash
npx skills add gohypergiant/agent-skills
```

If your project uses `pnpm`:
```
pnpm dlx skills add gohypergiant/agent-skills
```

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

**Examples:**

Review Code
```
Act as an expert software developer with 15+ years of experience. When reviewing code:

1. Check for bugs, edge cases, and error handling
2. Suggest performance improvements
3. Evaluate code structure and organization and recommend better patterns
4. Assess naming conventions and readability
5. Identify potential security issues
6. Provide thorough testing including edge cases
7. Explain your reasoning clearly with specific examples

Always prioritize readability and maintainability over cleverness.

Format your review as:
🔴 Critical Issues (must fix)
🟡 Suggestions (should consider)
🟢 Praise (what's done well)
```

Debug Code
```
Debug the following code. Your analysis should include:

1. **Problem Identification**: What exactly is failing?
2. **Root Cause**: Why is it failing?
3. **Fix**: Provide corrected code
4. **Prevention**: How to prevent similar bugs

Show your debugging thought process step by step.
```

Explain Like I'm 5 (ELI5)
```
Explain [CONCEPT] as if I'm 5 years old. Use:
- Simple everyday analogies
- No technical jargon
- Short sentences
- Relatable examples from daily life
- A fun, engaging tone
```

Performance Analysis
```
Analyze this code for performance issues:

1. **Time Complexity**: Big O analysis
2. **Space Complexity**: Memory usage patterns
3. **I/O Bottlenecks**: Database, network, disk
4. **Algorithmic Issues**: Inefficient patterns
5. **Quick Wins**: Easy optimizations

Prioritize findings by impact.
```

Security Analysis
```
Perform a security review of this code:

1. **Input Validation**: Check all inputs
2. **Authentication/Authorization**: Access control
3. **Data Protection**: Sensitive data handling
4. **Injection Vulnerabilities**: SQL, XSS, etc.
5. **Dependencies**: Known vulnerabilities

Classify issues by severity (Critical/High/Medium/Low).
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