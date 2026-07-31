# React Best Practices

React performance and correctness guidance for agents working with components, hooks, JSX, hydration, and React 19 patterns.

## What This Is

This skill provides React performance and correctness patterns for agents:
- Re-render optimization
- Rendering performance
- State and effect patterns
- React 19+ migration
- React Compiler awareness

Many patterns come from [Vercel's React Best Practices skill](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices). This version adds React Compiler guidance, React 19 features, and broader examples.

**Scope:** React-specific optimizations only. Framework-specific guidance for Next.js, Remix, and similar tools is out of scope unless the issue depends on React behavior.

---

## Quick Start

This is a skill package: structured guidance files that agents load on demand. No dependencies to install.

### For Agents

1. **Read [SKILL.md](SKILL.md)** - Understand when to trigger this skill and how to use it
2. **Check [AGENTS.md](AGENTS.md)** - Browse rule summaries and the quick diagnostic guide
3. **Load specific patterns** - Open detailed examples in `references/` only when needed
4. **Use checklists** - Apply [quick-checklists.md](references/quick-checklists.md) for systematic reviews

### For Humans

Humans can use this skill to:
- Learn React performance patterns
- Review code for anti-patterns
- Understand React 19+ features
- Run systematic performance audits

---

## Pattern Categories

### 1. Re-render Optimizations
Reduce unnecessary component re-renders and state updates:
- Defer state reads
- Extract memoized components
- Narrow effect dependencies
- Subscribe to derived state
- Functional setState updates
- Lazy state initialization
- Transitions for non-urgent updates

### 2. Rendering Performance
Optimize actual rendering and painting:
- Animate SVG wrapper (GPU acceleration)
- CSS content-visibility (long lists)
- Hoist static JSX
- Optimize SVG precision
- Prevent hydration mismatch
- Activity component (preserve state)
- Hoist RegExp creation
- Avoid useMemo for simple expressions

### 3. Advanced Patterns
Specialized patterns for complex scenarios:
- Store event handlers in refs (useEffectEvent)
- useLatest for stable callbacks
- Cache repeated function calls

### 4. React 19+ Migration
Patterns for React 19 and modern React:
- Named imports only
- No forwardRef (use ref prop)
- React Compiler guide

---

## Key Features

### Progressive Disclosure
- Start with rule summaries in AGENTS.md
- Load detailed examples only when needed
- Minimizes context usage for LLMs

### React Compiler Awareness
- Clear guidance on what React Compiler handles automatically
- Standardized notes on all patterns indicating manual vs automatic optimization
- Dedicated [React Compiler Guide](references/react-compiler-guide.md)

### Quick Diagnostic Guide
Find patterns by symptom:
- "Component re-renders too often" → Section 1
- "Scrolling is janky" → Section 2.2, 2.1
- "Hydration mismatch errors" → Section 2.5

### Comprehensive Checklists
Ready-to-use checklists for:
- New component creation
- Performance reviews
- SSR/SSG projects
- Effect debugging
- React 19 migration
- Bundle size optimization
- Code reviews

### Real-World Examples
[Compound Patterns](references/compound-patterns.md) includes complete examples:
- Optimized search component
- Infinite scroll list
- Dashboard with widgets
- Form with validation
- SSR dashboard with theme

---

## React 19 Support

This skill covers React 19+ features including:
- `useEffectEvent` (19.2+) for stable event handlers
- `<Activity>` component for preserving hidden component state
- `ref` as a prop (replaces deprecated `forwardRef`)
- Named imports only (no default import of React)

**Resources:**
- [React 19 Release](https://react.dev/blog/2024/12/05/react-19)
- [React 19.2 Release](https://react.dev/blog/2025/10/01/react-19-2)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

---

## Usage

Agents trigger this skill when working with:
- React components, hooks, or JSX
- Re-render or performance optimization
- Hydration mismatches
- React 19 features
- React code reviews

See [SKILL.md](SKILL.md) for complete trigger criteria.

---

## Skill Package Structure

```
accelint-react-best-practices/
├── SKILL.md                 # Skill definition and workflow
├── AGENTS.md                # Rule summaries for quick reference
├── README.md                # This file
├── CHANGELOG.md             # Version history
├── references/              # 33 detailed pattern files
│   ├── defer-state-reads.md
│   ├── extract-memoized-components.md
│   ├── prevent-hydration-mismatch.md
│   ├── react-compiler-guide.md
│   ├── quick-checklists.md
│   ├── compound-patterns.md
│   └── ...
├── scripts/                 # Automation scripts
│   ├── check-imports.sh
│   ├── find-forwardref.sh
│   ├── detect-static-jsx.sh
│   └── README.md
├── assets/
│   └── output-report-template.md
└── evals/
    └── evals.json           # 16 test cases
```

---

## Contributing

When adding new patterns:

1. **Create reference file** in `references/` following the standard format:
   - Clear title and one-line summary
   - ❌ Incorrect example(s) showing the anti-pattern
   - ✅ Correct example(s) showing the optimal implementation
   - React Compiler Note (handled automatically vs manual required)
   - Additional context if needed
2. **Add to AGENTS.md** with one-line summary and link
3. **Update SKILL.md** categorization if needed
4. **Add to checklists** in `references/quick-checklists.md`
5. **Consider compound patterns** - Add to `references/compound-patterns.md` if the pattern commonly combines with others

---

## Performance Philosophy

This skill follows these principles:

1. **Correctness first** - Avoid bugs before optimizing performance
2. **Check React Compiler first** - Do not suggest manual memoization or hoisting until you know whether the compiler is enabled
3. **Measure before optimizing** - Profile to identify real bottlenecks
4. **Optimize the slowest operations first** - Network and data-volume issues often matter more than render micro-optimizations
5. **Avoid premature optimization** - Do not optimize trivial operations
6. **Prefer simplicity** - Choose simple, readable code over clever optimizations
7. **Document non-obvious patterns** - Explain why an optimization exists

---

## References

This skill draws patterns and inspiration from:
- https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
- https://github.com/buildworksai/AgentHub/blob/main/.agent/skills/react-best-practices/skill.md
- https://github.com/programming-in-th/programming.in.th/blob/main/.claude/docs/react-patterns.md
- https://github.com/softaworks/agent-toolkit/tree/main/skills/react-dev
- https://github.com/softaworks/agent-toolkit/blob/main/skills/react-useeffect/README.md
- https://github.com/Jeffallan/claude-skills/blob/main/skills/react-expert/SKILL.md
- https://github.com/prowler-cloud/prowler/blob/master/skills/react-19/SKILL.md

---

## Version

Current version: **1.8.3**

See [CHANGELOG.md](CHANGELOG.md) for version history and recent changes.
