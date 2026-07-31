# Documentation Skill

This skill audits JavaScript/TypeScript documentation and provides guidance on JSDoc, comments, anti-patterns, and documentation judgment.

## Design Philosophy

This skill combines focused activation with expert judgment frameworks:

1. **Enhanced activation** - Triggers on specific keywords (@param, @returns, @template, @example, JSDoc, TODO, FIXME)
2. **Expert anti-patterns** - 6 critical "NEVER do this" patterns with examples
3. **Thinking frameworks** - Public/internal distinction with judgment criteria
4. **Decision trees** - Clear sufficiency evaluation for all code element types
5. **Edge case coverage** - Handles deprecated APIs, overloads, generics, callbacks, builders, events
6. **Conflict resolution** - Principles for resolving documentation dilemmas

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

### Activation and Loading

1. **Verify current structure** - Read the parent `SKILL.md` to confirm the current file organization.
2. **Load documentation references** - Load the expected reference files, with fallback discovery if the structure changes:
   - `jsdoc.md` - JSDoc syntax and tag requirements
   - `comments.md` - Comment markers, removal rules, preservation rules, and placement rules
3. **Apply the audit workflow** - Use the thinking frameworks and decision trees.

This approach keeps the expected file list clear while still verifying the current structure before loading references.

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

### Anti-Patterns

Visual ❌/✅ examples show common documentation mistakes:
- Approving @example without code fences
- Over-documenting internal code vs under-documenting public APIs
- Leaving commented-out code
- Documenting HOW instead of WHAT/WHY
- Using @returns for void functions
- Adding TODO without context

### Thinking Frameworks

**Two-Tier Approach:**
- Public API → Always comprehensive (no exceptions)
- Internal code → Three judgment dimensions:
  - Complexity vs Clarity
  - Maintenance Burden
  - Value vs Noise

### Decision Trees

Clear sufficiency evaluation for:
- Functions/Methods (exported vs internal requirements)
- Types/Interfaces (with/without @example)
- Classes (constructor, methods, examples)
- Constants/Variables (when documentation is needed)

### Conflict Resolution

Principles for resolving common dilemmas:
- Comprehensive vs Concise (favor comprehensive for public APIs)
- Document Complexity vs Avoid Noise (well-named internals need minimal docs)
- Stable API vs Changing Requirements (document current, note future with @remarks)
- Multiple Valid Approaches (consistency > perfection)

### Edge Cases

Handling for special scenarios:
- Deprecated APIs (@deprecated, @see, migration paths)
- Overloaded functions (single doc block, multiple examples)
- Generic utility types (@template explanations, type transformations)
- Callback parameters (dot notation for parameters)
- Builder patterns (chain examples)
- Event emitters (event-specific payloads)

### Quality Examples

Side-by-side comparison of excellent vs poor documentation with annotated explanations showing why each approach succeeds or fails.

## Benefits of Hybrid Design

**Expert knowledge layer**:
- Anti-patterns, thinking frameworks, and decision trees are unique to this skill.
- The skill adds audit-specific expertise beyond general documentation rules.
- It provides about 640 lines of focused documentation guidance.

**Smart delegation**:
- Implementation details such as JSDoc syntax and comment rules come from the parent skill.
- This avoids duplicating content that changes frequently.
- The verification step handles parent-skill reorganization.

**Activation specificity**:
- The description includes specific JSDoc tags such as `@param`, `@returns`, `@template`, and `@example`.
- It triggers on documentation-specific phrases users actually say.
- This improves activation accuracy over a general-purpose parent skill.

**Comprehensive coverage**:
- Standard cases: decision trees for all code-element types.
- Edge cases: deprecated APIs, overloads, generics, callbacks, builders, and events.
- Conflicts: resolution principles for common dilemmas.
- Quality benchmarks: excellent and poor examples.

**Drift-resilient integration**:
- The skill verifies the parent structure before loading.
- It can fall back to discovery if files are reorganized.
- It keeps the expected file list clear.

## Integration

**Use this skill when**:
- Documentation auditing is the primary focus
- You need expert judgment on what/how to document
- You're adding JSDoc to exported functions/types/classes
- You're reviewing comment quality and markers
- You need guidance on edge cases (deprecated, overloads, generics, etc.)

## Skill Metrics

- **Size**: ~640 lines (SKILL.md)
- **Knowledge ratio**: 70% expert / 20% activation / 10% redundant
- **Pattern**: Navigation wrapper with substantial original content

## License

Apache-2.0
