# Documentation Skill

Expert-level JavaScript/TypeScript documentation auditing skill with comprehensive guidance on JSDoc, comments, anti-patterns, and judgment frameworks. Delegates to ts-best-practices for detailed implementation rules.

## Design Philosophy

This skill combines **focused activation** with **expert judgment frameworks**:

1. **Enhanced activation** - Triggers on specific keywords (@param, @returns, @template, @example, JSDoc, TODO, FIXME)
2. **Expert anti-patterns** - 6 critical "NEVER do this" patterns with examples
3. **Thinking frameworks** - Public/internal distinction with judgment criteria
4. **Decision trees** - Clear sufficiency evaluation for all code element types
5. **Edge case coverage** - Handles deprecated APIs, overloads, generics, callbacks, builders, events
6. **Conflict resolution** - Principles for resolving documentation dilemmas
7. **Drift-resilient delegation** - Loads documentation references from ts-best-practices with fallback strategies

## Requirements

**ts-best-practices** skill must be available. This skill loads documentation-specific references from it.

## What This Skill Covers

### Core Capabilities

**JSDoc Auditing**
- Comprehensive standards for exported vs internal code
- Function, type, interface, class, and constant documentation
- Generic type parameter documentation (@template)
- Object parameter documentation with dot notation
- Example code fences with language identifiers
- Error documentation (@throws)

**Comment Quality**
- Comment markers (TODO, FIXME, HACK, NOTE, PERF, REVIEW, DEBUG, REMARK)
- Identifying comments to remove (dead code, edit history, obvious statements)
- Identifying comments to preserve (linter directives, business logic, markers)
- Comment placement best practices

**Expert Guidance**
- Anti-patterns with visual ❌/✅ examples
- Audit mindset and thinking frameworks
- Decision trees for documentation sufficiency
- Conflict resolution principles
- Edge case handling (deprecated APIs, overloads, callbacks, etc.)

## Usage

### Trigger Phrases

This skill activates when you use documentation-specific keywords:

```
Audit the documentation in src/utils/math.ts
```

```
Add JSDoc to all exported functions in src/api/client.ts
```

```
Add @param and @returns tags to this function
```

```
Review comments and add TODO/FIXME markers where appropriate
```

```
Document this function with @example
```

```
Fix comments in src/core/ - remove dead code and improve placement
```

### Example Audit Output

The skill provides structured audit reports:

**Missing Documentation:**
- `fetchUserProfile()` (line 45) - missing @throws for AuthenticationError
- `processData()` (line 89) - missing @param for options.timeout
- `UserConfig` interface (line 12) - missing property descriptions

**Syntax Issues:**
- `calculateTotal()` (line 34) - @example without code fence
- `authenticate()` (line 67) - void function has @returns tag

**Comment Quality:**
- Line 23: Remove commented-out code
- Line 45: Move end-of-line comment above code
- Line 78: Add FIXME marker for known bug

## How It Works

### Activation & Loading (Drift-Resilient)

1. **Verify Parent Skill** - Checks ts-best-practices availability
2. **Verify Current Structure** - Reads parent SKILL.md to confirm current file organization
3. **Load Documentation References** - Loads 5 expected files with fallback discovery if reorganized:
   - `jsdoc.md` - JSDoc syntax and tag requirements
   - `comment-markers.md` - TODO, FIXME, HACK markers
   - `comments-to-remove.md` - What to delete
   - `comments-to-preserve.md` - What to keep
   - `comments-placement.md` - Where to put comments
4. **Apply Audit Workflow** - Uses thinking frameworks and decision trees

**Hybrid approach** provides specific file list for clarity while verifying against parent SKILL.md for drift-resilience.

### Audit Process

**Step 1: Determine Scope**
- Is code exported (public API)? → Comprehensive docs required
- Is code internal? → Apply judgment frameworks

**Step 2: Check Completeness**
- Use decision trees for Functions, Types, Classes, Constants
- Verify all required tags present (@param, @returns, @template, @throws, @example)

**Step 3: Validate Syntax**
- @example tags must use code fences with language identifier
- Object parameters must use dot notation
- void functions should not have @returns
- Generic functions must include @template

**Step 4: Review Comments**
- Apply markers (TODO, FIXME, HACK, NOTE, etc.)
- Remove dead code and edit history
- Preserve linter directives and business logic
- Improve placement (move end-of-line comments above code)

**Step 5: Report Findings**
- Structured output with file:line references
- Categorized by issue type
- Specific, actionable recommendations

## Key Features

### 🚫 Anti-Patterns (6 Critical Mistakes)

Visual ❌/✅ examples of common documentation mistakes:
- Approving @example without code fences
- Over-documenting internal code vs under-documenting public APIs
- Leaving commented-out code
- Documenting HOW instead of WHAT/WHY
- Using @returns for void functions
- Adding TODO without context

### 🧠 Thinking Frameworks

**Two-Tier Approach:**
- Public API → Always comprehensive (no exceptions)
- Internal code → Three judgment dimensions:
  - Complexity vs Clarity
  - Maintenance Burden
  - Value vs Noise

### 🌲 Decision Trees

Clear sufficiency evaluation for:
- Functions/Methods (exported vs internal requirements)
- Types/Interfaces (with/without @example)
- Classes (constructor, methods, examples)
- Constants/Variables (when documentation is needed)

### 🔀 Conflict Resolution

Principles for resolving common dilemmas:
- Comprehensive vs Concise (favor comprehensive for public APIs)
- Document Complexity vs Avoid Noise (well-named internals need minimal docs)
- Stable API vs Changing Requirements (document current, note future with @remarks)
- Multiple Valid Approaches (consistency > perfection)

### 🎯 Edge Cases

Handling for special scenarios:
- Deprecated APIs (@deprecated, @see, migration paths)
- Overloaded functions (single doc block, multiple examples)
- Generic utility types (@template explanations, type transformations)
- Callback parameters (dot notation for parameters)
- Builder patterns (chain examples)
- Event emitters (event-specific payloads)

### 📚 Quality Examples

Side-by-side comparison of excellent vs poor documentation with annotated explanations showing why each approach succeeds or fails.

## Benefits of Hybrid Design

**Expert knowledge layer**:
- Anti-patterns, thinking frameworks, and decision trees are unique to this skill
- Provides audit-specific expertise beyond general documentation rules
- ~640 lines of focused documentation guidance

**Smart delegation**:
- Implementation details (JSDoc syntax, comment rules) come from parent skill
- Avoids duplicating content that changes frequently
- Hybrid verification approach handles parent skill reorganization

**Activation specificity**:
- Enhanced description with specific JSDoc tags (@param, @returns, @template, @example)
- Triggers on documentation-specific phrases users actually say
- Higher activation accuracy than general-purpose parent skill

**Comprehensive coverage**:
- Standard cases (decision trees for all code element types)
- Edge cases (deprecated, overloads, generics, callbacks, builders, events)
- Conflicts (resolution principles for common dilemmas)
- Quality benchmarks (excellent vs poor examples)

**Drift-resilient integration**:
- Verifies parent structure before loading
- Fallback discovery if files reorganized
- Clear expected file list with pattern-based alternatives

## Integration

**Use this skill when**:
- Documentation auditing is the primary focus
- You need expert judgment on what/how to document
- You're adding JSDoc to exported functions/types/classes
- You're reviewing comment quality and markers
- You need guidance on edge cases (deprecated, overloads, generics, etc.)

**Use ts-best-practices when**:
- You need comprehensive code quality across all dimensions
- Documentation is one of many concerns (performance, safety, types, control flow, etc.)
- You need implementation-level rules (naming, functions, state management)

**Use both when**:
- Comprehensive code review where documentation is critical
- The codebase has both documentation and code quality issues
- You need audit-level thinking (this skill) + implementation rules (parent skill)

## Skill Metrics

- **Size**: ~640 lines (SKILL.md)
- **Knowledge ratio**: 70% expert / 20% activation / 10% redundant
- **Pattern**: Navigation wrapper with substantial original content
- **Dependencies**: ts-best-practices (loads ~470 lines of references)
- **Total context**: ~1100 lines when fully loaded

## License

Apache-2.0

Authored by gohypergiant. Delegates to ts-best-practices v1.4 by gohypergiant.
