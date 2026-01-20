# React Best Practices

Comprehensive performance optimization and best practices for React applications, designed for AI agents and LLMs working with React code.

## Overview

This skill provides structured guidance for React performance optimization, covering:
- Re-render optimizations
- Rendering performance improvements
- Advanced patterns for state and effects
- React 19+ migration guidance
- React Compiler awareness

A large number of these patterns were originally from [Vercel's Skill](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) and have been expanded with additional patterns, React Compiler guidance, and comprehensive examples.

**Note:** This skill focuses on React-specific optimizations. Meta-framework specific optimizations (Next.js, Remix, etc.) are not included.

---

## Quick Start

### For Agents/LLMs

1. **Read [SKILL.md](SKILL.md)** - Understand when to activate this skill and how to use it
2. **Reference [AGENTS.md](AGENTS.md)** - Browse rule summaries with Quick Diagnostic Guide and Priority Matrix
3. **Load specific patterns** - Access detailed examples in `references/` as needed
4. **Use checklists** - Apply [quick-checklists.md](references/quick-checklists.md) for systematic reviews

### For Humans

This skill is optimized for AI agents but humans may find it useful for:
- Learning React performance optimization patterns
- Reviewing code for common anti-patterns
- Understanding React 19+ features and migrations
- Systematic performance auditing with checklists

---

## Pattern Categories

### 1. Re-render Optimizations
Patterns to reduce unnecessary component re-renders and state updates:
- Defer state reads
- Extract to memoized components
- Narrow effect dependencies
- Subscribe to derived state
- Functional setState updates
- Lazy state initialization
- Transitions for non-urgent updates

### 2. Rendering Performance
Patterns to optimize actual rendering and painting:
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
Navigate directly to relevant patterns based on symptoms:
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
[Compound Patterns](references/compound-patterns.md) shows complete examples:
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

## Usage in Claude Code

This skill is designed to be used with environments such as Claude Code (claude.ai/claude-code) and automatically activates when:
- Writing React components, hooks, or JSX
- Refactoring React code
- Optimizing re-renders or performance
- Reviewing React code
- Fixing hydration mismatches
- Implementing React 19 features

See [SKILL.md](SKILL.md) for complete activation criteria and trigger phrases.

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
2. **Measure before optimizing** - Profile to identify real bottlenecks
3. **Optimize slowest operations first** - Network > rendering > computation
4. **Avoid premature optimization** - Don't optimize trivial operations
5. **Prefer simplicity** - Simple, readable code over clever optimizations
6. **Document non-obvious patterns** - Explain why optimizations exist