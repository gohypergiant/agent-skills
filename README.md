# Agent Skills

A collection of skills and commands that transform AI agents into specialized problem solvers. Skills provide domain expertise, coding standards, and reusable workflows that help agents write better code with less context.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [What are Agent Skills?](#what-are-agent-skills)
- [Why Agent Skills?](#why-agent-skills)
- [Available Skills](#available-skills)
- [Available Commands](#available-commands)
- [Ecosystem](#ecosystem)
- [Testing](#testing)
- [Documentation](#documentation)
- [Prompt Patterns](#prompt-patterns)
- [Contributing](#contributing)
- [License](#license)

## Installation

Skills follow the [Agent Skills](https://agentskills.io/) format and can be installed using the skills CLI.

**npm:**
```bash
npx skills add gohypergiant/agent-skills
```

**pnpm:**
```bash
pnpm dlx skills add gohypergiant/agent-skills
```

## Quick Start

Once installed, skills activate automatically when relevant tasks are detected. No configuration needed.
```
# Agents will use js-ts-best-practices when you ask:
"Add input validation to this function"

# Agents will use react-best-practices when you ask:
"Optimize this component's re-renders"

# Agents will use vitest-best-practices when you ask:
"Write tests for this utility function"
```
For more in-depth examples, see [Prompt Patterns](#prompt-patterns)

Commands can be invoked directly:
```bash
# Audit JSDoc comments in your codebase
claude /audit:js-ts-docs ./src

# Generate implementation plans for a feature
claude /feature-planning:implementation ./requirements.md

# Create a new skill
claude /create:skill
```

## What are Agent Skills?

Skills are modular packages that extend agent's capabilities with specialized knowledge. They work like onboarding guides for specific domains, providing:

- **Coding standards** - Language-specific best practices with concrete examples
- **Performance patterns** - Optimization techniques for common bottlenecks
- **Safety guidelines** - Input validation, error handling, and security patterns
- **Reusable workflows** - Multi-step procedures for complex tasks

Skills use a progressive disclosure structure. The agent reads a compact overview first (AGENTS.md), then loads detailed reference files only when needed. This minimizes context usage while keeping deep knowledge available.

## Why Agent Skills?

LLMs have broad knowledge but lack project-specific conventions and current best practices. Skills bridge this gap by providing:

- **Up-to-date patterns** - React 19 features, TypeScript 5 idioms, modern testing approaches
- **Consistent standards** - Same conventions across all AI-assisted code in your project
- **Actionable examples** - Every rule includes "wrong" and "right" code samples
- **Reduced hallucination** - Concrete references prevent the agent from guessing

Skills are designed for agents, not humans. They're structured for efficient context usage and include trigger conditions that help Claude know when to activate them.

## Available Skills

### js-ts-best-practices

JavaScript and TypeScript coding standards covering:

- Naming conventions and code structure
- TypeScript patterns (avoid `any`, prefer `type` over `interface`, use `as const` instead of `enum`)
- Safety patterns (input validation, assertions, error handling)
- Performance optimization (reduce branching, memoization, caching, avoid allocations)
- Documentation standards (JSDoc, comment markers)

**Activates when:** Writing JS/TS functions, fixing type errors, optimizing loops, adding validation, reviewing code quality.

### react-best-practices

React performance optimization and modern patterns for React 19+:

- Re-render optimization (defer state reads, extract memoized components, narrow effect dependencies)
- Rendering performance (hoist static JSX, content-visibility CSS, SVG optimization)
- Hydration mismatch prevention for SSR/SSG
- React 19 features (`useEffectEvent`, `<Activity>`, ref as prop)
- React Compiler awareness

**Activates when:** Writing React components, debugging re-renders, fixing hydration errors, optimizing list rendering.

### vitest-best-practices

Testing patterns for Vitest:

- Test structure and AAA pattern (Arrange, Act, Assert)
- Parameterized tests with `it.each()`
- Assertions, mocking, and test doubles
- Async testing and performance optimization
- Snapshot testing guidelines

**Activates when:** Writing `*.test.ts` files, adding test coverage, debugging flaky tests, reviewing test code.

### nextjs-best-practices

Next.js performance optimization and best practices:

- Security patterns (authenticate Server Actions, validate inputs, authorization checks)
- Waterfall elimination (start operations immediately, parallelize with Promise.allSettled())
- RSC serialization optimization (minimize payload, avoid duplicate serialization)
- Parallel data fetching with component composition
- Per-request deduplication with React.cache()
- Strategic Suspense boundaries for streaming
- Non-blocking operations with after()
- Import optimization (avoid barrel files)
- Server vs Client Component decision-making

**Activates when:** Writing Server Components/Actions, implementing data fetching in RSC, optimizing API routes, debugging waterfall issues, reviewing Next.js code for performance, fixing authentication in Server Actions, reducing HTML payload size, or deciding between Server/Client Components.

### skill-manager

A meta-skill for creating and managing other skills:

- Skill creation workflow with concrete examples
- Progressive disclosure structure guidance
- Reference file organization
- SKILL.md and AGENTS.md formatting

**Activates when:** Creating new skills or updating existing ones.

### command-creator

Guide for creating Claude Code commands:

- Command specification format (YAML front matter + Markdown)
- Skill discovery and integration
- Argument definition patterns
- Workflow and statistics reporting

**Activates when:** Creating new Claude Code commands.

### readme-writer

README documentation generator and updater:

- Recursive codebase analysis from README location
- Public API mapping (exports, types, constants)
- Gap detection for existing READMEs (missing exports, stale examples)
- Human-sounding documentation with practical examples
- Package manager detection and correct install commands

**Activates when:** Creating or updating README.md files, documenting packages, or auditing documentation completeness.

## Available Commands

Commands are task-specific specifications stored in `commands/`. They define workflows that Claude executes autonomously.

### Audit Commands

| Command | Description |
|---------|-------------|
| `/audit:js-ts-docs` | Audit JSDoc comments for completeness against js-ts-best-practices standards. Supports interactive fixing. |
| `/audit:js-ts-perf` | Audit JavaScript/TypeScript code for performance issues. |
| `/audit:js-test-coverage` | Audit unit test coverage and format compliance. Identifies untested branches, error paths, boundaries, and async patterns. Also validates existing tests against vitest-best-practices (AAA pattern, descriptions, assertions). Supports interactive or automatic fixing. |

### Create Commands

| Command | Description |
|---------|-------------|
| `/create:skill` | Create a new skill with proper structure and documentation. |
| `/create:command` | Create a new Claude Code command specification. |
| `/create:readme` | Generate or update README.md for a package by analyzing its codebase. Uses readme-writer skill to identify public APIs and produce documentation with practical examples. |

### Feature Planning Commands

| Command | Description |
|---------|-------------|
| `/feature-planning:acceptance` | Define acceptance criteria for a feature. |
| `/feature-planning:implementation` | Research codebase patterns and create implementation tasks. |
| `/feature-planning:testing` | Generate test plans based on implementation. |

## Ecosystem

These third-party skills have been vetted for use alongside the Accelint skills:

- [Motion Skill](https://skills.sh/onmax/nuxt-skills/motion) - Motion animation library patterns
- [Context7](https://skills.sh/intellectronica/agent-skills/context7) - Context management
- [Tanstack Query](https://skills.sh/jezweb/claude-skills/tanstack-query) - Data fetching patterns

Install ecosystem skills the same way:
```bash
npx skills add onmax/nuxt-skills --skill "motion"
```

## Testing

To test a skill locally before publishing:

1. Copy the skill directory from `skills/` to `.claude/skills/` in your project
2. Or install globally to `~/.claude/skills/` for cross-project testing

Skills in `.claude/skills/` take precedence over globally installed skills.

## Documentation

For detailed guides on how skills and commands work:

- [Skills Guide](./documentation/Skills.md) - Comprehensive guide to skill architecture, progressive disclosure, and development workflow
- [Commands Guide](./documentation/Commands.md) - Full specification for creating Claude Code commands

## Prompt Patterns

Reusable prompt patterns for common development tasks. These patterns work well with the skills and commands in this repository.

### Explain Like I'm 5 (ELI5)
```
Persona:
You are an expert in the field of [CONCEPT] and a professional science communicator.

Objective:
Explain [CONCEPT] as if I'm 5 years old.

Requirements:
- Use simple everyday analogies
- Be specific, not grandiose. Say what it actually does
- Avoid technical jargon
- Avoid puffery: pivotal, crucial, vital, testament, enduring legacy
- Avoid empty "-ing" phrases: ensuring reliability, showcasing features, highlighting capabilities
- Avoid promotional adjectives: groundbreaking, seamless, robust, cutting-edge
- Avoid overused AI vocabulary: delve, leverage, multifaceted, foster, realm, tapestry
- Avoid formatting overuse: excessive bullets, emoji decorations, bold on every other word
```

**Invokes:** No specific skills (general-purpose explanation pattern)

### Review Code
```
Persona:
You are a lead software engineer and technical writer with 15+ years of experience.

Objective:
1. Check for bugs, edge cases, and error handling
2. Suggest performance improvements
3. Evaluate code structure and organization and recommend better patterns
4. Assess naming conventions and readability
5. Identify potential security issues
6. Provide thorough testing including edge cases
7. Explain your reasoning clearly with specific examples

Requirements:
Always prioritize readability and maintainability over cleverness.

Output:
Detailed and concise explanation of improvements.

Format and classify your review as:
1. 🔴 Critical
2. 🟠 High
3. 🟡 Medium
4. 🟢 Low
```

**Invokes:** js-ts-best-practices, react-best-practices, vitest-best-practices, nextjs-best-practices (depending on code type)

### Debug Code
```
Persona:
You are a lead software engineer and technical writer with 15+ years of experience.

Objective:
1. **Problem Identification**: What exactly is failing?
2. **Root Cause**: Why is it failing?
3. **Fix**: Provide corrected code
4. **Prevention**: How to prevent similar bugs

Requirements:
Show your debugging thought process step by step.

Output:
Reproducible and testable debugging steps.

Format and classify your review as:
1. 🔴 Mystery
2. 🟡 Unsure
3. 🟢 Confident
```

**Invokes:** js-ts-best-practices, react-best-practices, vitest-best-practices, nextjs-best-practices (depending on code type)

### Performance Analysis
```
Persona:
You are a lead software engineer and technical writer with 15+ years of experience.

Objective:
Analyze this code for performance issues.

Requirements:
1. **Time Complexity**: Big O analysis
2. **Space Complexity**: Memory usage patterns
3. **I/O Bottlenecks**: Database, network, disk
4. **Algorithmic Issues**: Inefficient patterns
5. **Quick Wins**: Easy optimizations

Output:
A detailed performance analysis with benchmarks.

Format and classify your review as:
1. 🔴 Critical
2. 🟠 High
3. 🟡 Medium
4. 🟢 Low
```

**Invokes:** js-ts-best-practices, react-best-practices, nextjs-best-practices

### Security Analysis
```
Persona:
You are a lead security analyst and technical writer with 15+ years of experience.

Objective:
Perform a security review of this code.

Requirements:
1. **Input Validation**: Check all inputs
2. **Authentication/Authorization**: Access control
3. **Data Protection**: Sensitive data handling
4. **Injection Vulnerabilities**: SQL, XSS, etc.
5. **Dependencies**: Known vulnerabilities

Output:
A detailed security analysis with test instructions.

Format and classify your review as:
1. 🔴 Critical
2. 🟠 High
3. 🟡 Medium
4. 🟢 Low
```

**Invokes:** js-ts-best-practices, react-best-practices, nextjs-best-practices

### Skill Management
```
Persona:
You are a expert skill architect.

Objective:
1. Use the skill-manager skill to audit ./skills/example-skill
2. Identify any best practice optimizations that can be made
3. Optimize towards deterministic output and correctness when auditing
4. Explain your reasoning clearly with specific examples

Output:
A complete, production-ready skill following all best practices.

Format and classify your review as:
1. 🔴 Critical
2. 🟠 High
3. 🟡 Medium
4. 🟢 Low
```

**Invokes:** skill-manager

## Internal Skills

This repository leverages the following third party agent skills internally:

- https://skills.sh/softaworks/agent-toolkit/humanizer
- https://skills.sh/trailofbits/skills/ask-questions-if-underspecified

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions.

**Quick contribution guide:**

1. Fork the repository
2. Create your feature branch
3. Follow existing skill/command patterns
4. Submit a pull request

## License

Apache 2.0 - see [LICENSE](./LICENSE) for details.
