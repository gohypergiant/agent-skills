# README Writer

> **Note:**
> This document is for agents and LLMs that create or update README documentation. Each rule includes a one-line summary here, with links to detailed examples in the `references/` folder. Load reference files only when you need detailed implementation guidance.

---

## Abstract

Comprehensive guide for creating thorough, human-sounding README documentation that stays in sync with actual codebase functionality. Designed for AI agents working with any JavaScript/TypeScript project, with special handling for monorepos.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify the relevant sections.
2. **Load references as needed**: Open detailed examples only when implementing.
3. **Follow the workflow**: Analyze the codebase → Compare with existing docs → Generate or update.

---

## 1. Codebase Analysis

### 1.1 Scoping the Analysis
[View detailed examples](references/codebase-analysis.md)

- Start from the README's directory, not the repository root
- In monorepos, only analyze the package/directory containing the README
- Respect package boundaries defined by `package.json`

### 1.2 Identifying Public API
[View detailed examples](references/codebase-analysis.md)

- Check the `package.json` `exports` and `main` fields for entry points.
- Find all `export` statements in the entry point files.
- Trace re-exports to their source definitions.
- Distinguish between the public API, which is exported from an entry point, and internal utilities.

### 1.3 Extracting Signatures
[View detailed examples](references/codebase-analysis.md)

- Capture function signatures with parameter types and return types
- Document generic type parameters
- Note async functions and Promise return types
- Include overloaded signatures if present

### 1.4 Finding Existing Documentation
[View detailed examples](references/codebase-analysis.md)

- Read JSDoc/TSDoc comments above exports
- Check for inline usage examples in comments
- Look for `examples/` directories
- Review test files for usage patterns

---

## 2. README Structure

### 2.1 Required Sections
[View detailed examples](references/readme-structure.md)

Every README must include these sections in this order:

1. **Heading Area** - Title, optional banner, optional badges
2. **Installation** - How to install the package
3. **Quick Start** - Minimal working example
4. **What** - What this package is
5. **Why** - Why this package exists
6. **API** - Public API signatures and descriptions
7. **Examples** - Practical usage examples
8. **License** - License information

### 2.2 Optional Sections
[View detailed examples](references/readme-structure.md)

Include when relevant:

- **Table of Contents** - For READMEs over ~200 lines
- **Further Reading** - Links to related resources
- **Contributing** - How to contribute

### 2.3 Section Ordering
[View detailed examples](references/readme-structure.md)

Follow the prescribed order strictly. Users expect Installation near the top, API details in the middle, and License or Contributing at the bottom.

---

## 3. Writing Principles

**REQUIRED SUB-SKILL:** Use `accelint-english-manager` to review all generated README content before you finalize it.

### 3.1 Be Absurdly Thorough
[View detailed examples](references/writing-principles.md)

When in doubt, include it. Assume the reader has never seen this codebase.

### 3.2 Use Code Blocks Liberally
[View detailed examples](references/writing-principles.md)

Every command should be copy-pasteable. Show example output when helpful.

### 3.3 Explain the Why
[View detailed examples](references/writing-principles.md)

Don't just say "run this command" — explain what it does and why.

### 3.4 Use Tables for Reference
[View detailed examples](references/writing-principles.md)

Environment variables, CLI options, configuration options, and script references work great as tables.

### 3.5 Keep Commands Current
[View detailed examples](references/writing-principles.md)

Detect and use the correct package manager. Never assume npm.

### 3.6 Write Like a Human
[View detailed examples](references/writing-principles.md)

Sound like someone who genuinely wants to help, not a robot generating docs.

### 3.7 Apply Humanizer Patterns

After drafting README content, apply the `accelint-english-manager` skill to remove AI writing patterns:

- Remove inflated significance language ("pivotal", "testament", "crucial", "vital")
- Replace promotional tone with neutral, specific language
- Eliminate superficial -ing analyses ("highlighting", "showcasing", "fostering")
- Replace vague attributions with specific sources or remove entirely
- Fix em dash overuse and rule-of-three patterns
- Remove sycophantic language ("Great question!", "Certainly!")
- Add personality and voice — sterile writing is as obvious as AI slop

---

## 4. Change Detection

### 4.1 Comparing Code to Docs

When updating an existing README:

1. Parse all public exports from the codebase
2. Parse all documented API from the README
3. Identify:
   - **Missing**: Exports not documented
   - **Stale**: Documentation for removed exports
   - **Changed**: Signature changes not reflected

### 4.2 Suggesting Changes

Present changes clearly:

```markdown
## Suggested README Updates

### Missing Documentation
- `parseConfig(path: string): Config` - Not documented in API section
- `ValidationError` class - Not documented

### Stale Documentation
- `oldFunction()` - Documented but no longer exported

### Signature Changes
- `createClient(url)` → `createClient(url, options?)` - New optional parameter
```

### 4.3 Preserving Custom Content

When updating:

- Keep the custom sections that the user added.
- Preserve formatting choices where possible.
- Do not overwrite detailed explanations with generated text.
- Ask before removing content that might be intentional.

---

## 5. Template and Examples

### 5.1 README Template
[View complete template](references/readme-template.md)

Use the template as a starting point. Adjust the section depth to match the package complexity.

### 5.2 API Documentation Format

For each public export:

```markdown
### `functionName(param1, param2)`

Brief description of what it does.

| Parameter | Type | Description |
|-----------|------|-------------|
| `param1` | `string` | What this parameter is for |
| `param2` | `Options` | Configuration options |

**Returns:** `ReturnType` - Description of return value

**Example:**
\`\`\`typescript
const result = functionName('input', { option: true });
\`\`\`
```

### 5.3 Utility vs Pipeline Packages

- **Utility packages** (many small exports): Document API inline with examples
- **Pipeline packages** (one main workflow): Use standalone Examples section with full workflows

---

## Quick Reference Checklist

Before finalizing a README, verify:

- [ ] Package manager matches lockfile
- [ ] All public exports are documented
- [ ] Code examples are copy-pasteable
- [ ] Installation instructions work on a fresh machine
- [ ] Examples use current API signatures
- [ ] TOC included if > 200 lines
- [ ] License section present
- [ ] No orphaned documentation for removed exports
- [ ] Content reviewed with `accelint-english-manager` skill for AI writing patterns
- [ ] Writing has personality and does not sound sterile or voiceless
