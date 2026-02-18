# Agent Skills

A collection of skills and commands that transform AI agents into specialized problem solvers. Skills provide domain expertise, coding standards, and reusable workflows that help agents write better code with less context.

To have a greater guarantee of a skill being utilized, we recommend appending the following to any prompt you use:

```markdown
Before relying on your training data you MUST evaluate and apply ALL APPLICABLE SKILLS to your problem space. IF AND ONLY IF you do not find a skill that applies are you allowed to fall back to your training data. This is not negotiable. This is not optional. You cannot rationalize your way out of this.
```

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Skill Development Workflow](#skill-development-workflow)
- [What are Agent Skills?](#what-are-agent-skills)
- [Why Agent Skills?](#why-agent-skills)
- [Available Skills](#available-skills)
- [Ecosystem](#ecosystem)
- [Testing](#testing)
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

```bash
# Agents will use accelint-ts-security when you ask:
"Add input validation to this function"

# Agents will use accelint-react-best-practices when you ask:
"Optimize this component's re-renders"

# Agents will use accelint-ts-testing when you ask:
"Write tests for this utility function"

# Skills can be explicitly requested in prompt:
"Use the accelint-react-testing skill to write tests for this interactive modal"

# Skills can be invoked directly with slash command:
claude /accelint-react-best-practices <dir>
```

For more in-depth examples, see [Prompt Patterns](#prompt-patterns)

## Skill Development Workflow

To scaffold and establish a new skill you can invoke the `accelint-skill-manager` skill like so:

```
/accelint-skill-manager <description of skill>. Can you help me refine and complete it?
```

After creating or significantly modifying a skill, run this 4-step audit loop before considering the work done.

### Step 1 — Initial skill-judge audit

Run the `skill-judge` skill against the completed skill. Apply all suggested improvements before proceeding.

### Step 2 — accelint-skill-manager audit

Run `/clear` to reset context, then run the `accelint-skill-manager` skill against the skill. Apply all structural and content suggestions before proceeding.

### Step 3 — Final skill-judge audit

Run `/clear`, then run `skill-judge` again. Apply remaining suggestions. Target **grade A or higher (>=108/120)**.

### Step 4 — Frontmatter verification checklist

- [ ] `name` is lowercase, no uppercase letters, no consecutive hyphens, ≤64 chars, matches directory name
- [ ] `description` answers WHAT + WHEN + KEYWORDS, is non-empty, ≤1024 chars
- [ ] `metadata.version` is bumped (major for substantial changes, minor for small fixes)

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

### accelint-ts-best-practices

TypeScript and JavaScript coding standards covering:

- Naming conventions and code structure
- TypeScript patterns (avoid `any`, prefer `type` over `interface`, use `as const` instead of `enum`)
- Safety patterns (input validation, assertions, error handling)
- Function design and control flow

**Activates when:** Writing JS/TS functions, fixing type errors, adding validation, reviewing code quality.

### accelint-ts-performance

Systematic JavaScript/TypeScript performance optimization using V8 profiling:

- Algorithmic complexity fixes (O(n²) → O(n) with Maps/Sets)
- Loop optimization and allocation reduction
- Caching and memoization patterns
- I/O batching and async optimization
- Memory locality and predictable execution

**Activates when:** Code is measurably slow, optimizing hot paths, profiling shows bottlenecks, fixing excessive allocations, improving execution speed.

### accelint-react-best-practices

React performance optimization and modern patterns for React 19+:

- Re-render optimization (defer state reads, extract memoized components, narrow effect dependencies)
- Rendering performance (hoist static JSX, content-visibility CSS, SVG optimization)
- Hydration mismatch prevention for SSR/SSG
- React 19 features (`useEffectEvent`, `<Activity>`, ref as prop)
- React Compiler awareness

**Activates when:** Writing React components, debugging re-renders, fixing hydration errors, optimizing list rendering.

### accelint-ts-testing

Testing patterns for Vitest:

- Test structure and AAA pattern (Arrange, Act, Assert)
- Parameterized tests with `it.each()`
- Assertions, mocking, and test doubles
- Async testing and performance optimization
- Snapshot testing guidelines

**Activates when:** Writing `*.test.ts` files, adding test coverage, debugging flaky tests, reviewing test code.

### accelint-ts-documentation

Documentation standards for JavaScript and TypeScript:

- JSDoc comment structure (@param, @returns, @template, @example with code fences)
- Comment markers (TODO, FIXME, HACK, NOTE, PERF, REVIEW, DEBUG, REMARK)
- Documentation sufficiency for exported vs internal code
- Comment quality (removing unnecessary comments, preserving important ones)

**Activates when:** Adding JSDoc comments, documenting functions or types, auditing documentation completeness, adding TODO/FIXME markers, improving code comments.

### accelint-nextjs-best-practices

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

### accelint-tanstack-query-best-practices

TanStack Query best practices for React applications with Next.js App Router:

- QueryClient configuration (server isolation, retry logic, cache defaults)
- Query key architecture (deterministic factories, hierarchical invalidation)
- Observer economics (N queries vs N observers, hoisting patterns)
- Mutation patterns (optimistic vs pessimistic updates, rollback handling)
- Cache invalidation strategies (invalidateQueries, setQueryData, cancelQueries)
- Server-client integration (HydrationBoundary, SSR/SSG patterns, multi-layer caching)
- Performance optimization (structural sharing, observer count management)

**Activates when:** Configuring QueryClient, implementing mutations, debugging performance issues, adding optimistic updates, working with query keys, handling cache invalidation, integrating with Next.js Server Components, debugging hydration issues, or using TanStack Query hooks (useQuery, useSuspenseQuery, useMutation).

### accelint-security-best-practices

Comprehensive security audit and vulnerability detection following OWASP Top 10:

- Secrets management (never hardcode, use environment variables)
- Input validation and file upload security
- Injection prevention (SQL, NoSQL, XSS)
- Authentication and authorization patterns
- CSRF protection and rate limiting
- Sensitive data protection and security headers
- Dependency security and SSRF prevention

**Activates when:** Auditing security, checking for vulnerabilities, implementing authentication, adding API endpoints, handling user input, working with secrets or sensitive data, implementing payment features, or conducting pre-deployment security checks.

### accelint-skill-manager

A meta-skill for creating and managing other skills:

- Skill creation workflow with concrete examples
- Progressive disclosure structure guidance
- Reference file organization
- SKILL.md and AGENTS.md formatting

**Activates when:** Creating new skills or updating existing ones.

### accelint-command-creator

Guide for creating Claude Code commands:

- Command specification format (YAML front matter + Markdown)
- Skill discovery and integration
- Argument definition patterns
- Workflow and statistics reporting

**Activates when:** Creating new Claude Code commands.

### accelint-readme-writer

README documentation generator and updater:

- Recursive codebase analysis from README location
- Public API mapping (exports, types, constants)
- Gap detection for existing READMEs (missing exports, stale examples)
- Human-sounding documentation with practical examples
- Package manager detection and correct install commands

**Activates when:** Creating or updating README.md files, documenting packages, or auditing documentation completeness.

### ac-to-playwright

Converts acceptance criteria into JSON test plans and then Playwright `*.spec.ts` files:

- AC -> JSON plan generation that conforms to a plan schema (via LLM)
- JSON plan -> Playwright test generation (via code)
- Supports Gherkin (.feature) and bullet (.md) acceptance criteria
- Acceptance criteria writing and mapping patterns
- Test hook naming/structure conventions

**Activates when:** Turning acceptance criteria into Playwright `*.spec.ts` tests.

## Available Commands

Commands are task-specific specifications stored in `commands/`. They define workflows that Claude executes autonomously.

### Feature Planning Commands

| Command | Description |
|---------|-------------|
| `/feature-planning:acceptance` | Define acceptance criteria for a feature. |
| `/feature-planning:implementation` | Research codebase patterns and create implementation tasks. |
| `/feature-planning:testing` | Generate test plans based on implementation. |

## Ecosystem

You can search and audit third party skills at [skills.sh](https://skills.sh/)

These third-party skills have been vetted for use alongside the Accelint skills:

- [Context7](https://skills.sh/intellectronica/agent-skills/context7) - MCP based context management
- [Next Cache Components](https://skills.sh/vercel-labs/next-skills/next-cache-components) - Next.js Cache Components Usage and Best Practices

Install ecosystem skills the same way you do Accelint skills:

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

## Testing

To test a skill locally before publishing:

1. Copy the skill directory from `skills/` to `.claude/skills/` in your project
2. Or install globally to `~/.claude/skills/` for cross-project testing

Skills in `.claude/skills/` take precedence over globally installed skills.

## Prompt Patterns

Reusable prompt patterns for common development tasks. These patterns work well with the skills and commands in this repository.

### Tips

- Voice dictation (fn x2 on macOS): You speak 3x faster than you type. Your prompts get way more detailed.
- Plan Mode (Shift+Tab twice): Claude drafts a plan before acting. Use it for anything beyond a one-liner.
- Subagents: Append "use subagents" to any request where you want Claude to throw more compute at the problem.

### Planning

```
# Start with a plan
I want to [your task]. Research the codebase and create a plan. Do NOT write any code yet.

# Get a second opinion on the plan
Review this plan as a skeptical staff engineer. What's missing? What could go wrong? What would you push back on?

# Surface unknowns before proceeding
Make the plan extremely concise. At the end, give me a list of unresolved questions to answer before we start.

# Re-plan when stuck
This approach isn't working. Stop. Let's go back to plan mode. What went wrong and what's a better approach?
```

### Quality Check

```
# Demand elegance
Knowing everything you know now, scrap this and implement the elegant solution.

# Make Agent your reviewer
Grill me on these changes and don't make a PR until I pass your test.

# Prove it works
Prove to me this works. Diff the behavior between main and this branch.
```

### Self Improvement

```
# After Agent makes a mistake and you correct it
Update AGENTS.md so you don't make that mistake again.
```

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
```

**Invokes:** accelint-ts-best-practices, accelint-react-best-practices, accelint-ts-testing, accelint-nextjs-best-practices (depending on code type)

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
```

**Invokes:** accelint-ts-best-practices, accelint-react-best-practices, accelint-ts-testing, accelint-nextjs-best-practices (depending on code type)

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
```

**Invokes:** accelint-ts-best-practices, accelint-ts-performance, accelint-react-best-practices, accelint-nextjs-best-practices

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
```

**Invokes:** accelint-ts-best-practices, accelint-ts-performance, accelint-react-best-practices, accelint-nextjs-best-practices, accelint-security-best-practices

### Skill Management
```
Persona:
You are a expert agent skill architect.

Objective:
1. Use the accelint-skill-manager skill to audit ./skills/example-skill
2. Identify any best practice optimizations that can be made
3. Optimize towards deterministic output and correctness when auditing
4. Explain your reasoning clearly with specific examples
5. Re-run this loop but with the skill-judge skill instead
```

**Invokes:** accelint-skill-manager, skill-judge

### Generate Playwright Tests from Acceptance Criteria
```
Persona:
You are a senior QA automation engineer with deep Playwright experience.

Objective:
1. Convert the acceptance criteria at [AC_PATH] into JSON test plans.
2. Validate each plan against the schema.
3. Translate validated plans into Playwright spec files.

Requirements:
- Follow the AC rules and mappings in the skill references.
- Process one AC file at a time.
- Ask for any missing required fields before generating plans.
- Do not invent assertions. If the correct assertion to use isn't clear from the AC, ask.
- Require explicit output directories for plans, tests, and summaries before writing files.

Output:
Validated JSON plans and Playwright spec files, plus a brief summary of what was generated.
```

## Internal Skills

This repository leverages the following third party agent skills internally:

- [humanizer](https://skills.sh/softaworks/agent-toolkit/humanizer)
- [ask-questions-if-underspecified](https://skills.sh/trailofbits/skills/ask-questions-if-underspecified)
- [skill-judge](https://skills.sh/softaworks/agent-toolkit/skill-judge)
- [bash-defensive-patterns](https://skills.sh/wshobson/agents/bash-defensive-patterns)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions.

**Quick contribution guide:**

1. Fork the repository
2. Create your feature branch
3. Follow existing skill/command patterns
4. Submit a pull request

## License

Apache 2.0 - see [LICENSE](./LICENSE) for details.
