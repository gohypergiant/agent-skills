# README Writer

> **Note:**
> This document is for agents and LLMs that create or update README documentation. It summarizes the workflow and links to detailed examples in the `references/` folder. Load reference files only when you need implementation detail.

---

## Abstract

Guide for creating README documentation that stays aligned with the actual codebase. It is designed for AI agents working with JavaScript and TypeScript projects, including monorepos.

---

## How to Use This Guide

1. Start here: scan the rule summaries to find the relevant sections.
2. Load references as needed: open detailed examples only when you need implementation detail.
3. Follow the workflow: analyze the codebase, compare it with the existing docs, then generate or update the README.

---

## 1. Codebase Analysis

### 1.1 Scoping the analysis
[View detailed examples](references/codebase-analysis.md)

- Start from the README directory, not the repository root.
- In monorepos, analyze only the package or directory that contains the README.
- Respect package boundaries defined by `package.json`.

### 1.2 Identifying public API
[View detailed examples](references/codebase-analysis.md)

- Check the `package.json` `exports` and `main` fields for entry points.
- Find all `export` statements in the entry point files.
- Trace re-exports to their source definitions.
- Distinguish between the public API, which is exported from an entry point, and internal utilities.

### 1.3 Extracting signatures
[View detailed examples](references/codebase-analysis.md)

- Capture function signatures with parameter types and return types.
- Document generic type parameters.
- Note async functions and Promise return types.
- Include overloaded signatures if present.

### 1.4 Finding existing documentation
[View detailed examples](references/codebase-analysis.md)

- Read JSDoc/TSDoc comments above exports
- Check for inline usage examples in comments
- Look for `examples/` directories
- Review test files for usage patterns

---

## 2. README Structure

### 2.1 Required sections
[View detailed examples](references/readme-structure.md)

The required sections depend on what the README is documenting.

For package or library READMEs, use this default order:

1. **Heading Area** - Title, optional banner, optional badges
2. **Installation** - How to install the package
3. **Quick Start** - Minimal working example
4. **What** - What this package is
5. **Why** - Why this package exists
6. **API** - Public API signatures and descriptions
7. **Examples** - Practical usage examples
8. **License** - License information

For app, service, CLI, or monorepo-root READMEs, keep the same reader-first ordering principles but adapt the middle sections to the real public surface. Do not force an API section when the main user-facing surface is setup, commands, workflows, or operations.

### 2.2 Optional sections
[View detailed examples](references/readme-structure.md)

Include when relevant:

- **Table of Contents** - For READMEs over ~200 lines
- **Further Reading** - Links to related resources
- **Architecture & Development Guides** - Only when related docs such as `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, or OpenSpec config files actually exist
- **Contributing** - How to contribute

### 2.3 Section order
[View detailed examples](references/readme-structure.md)

Follow the prescribed order strictly for package and library READMEs. For app, service, CLI, or monorepo-root READMEs, preserve the same high-level reading flow: setup near the top, usage and workflow details in the middle, and License, Architecture & Development Guides, or Contributing near the bottom.

---

## 3. Writing Principles

Use `accelint-english-manager` to review all generated README content before you finalize it.

### 3.1 Be thorough
[View detailed examples](references/writing-principles.md)

When in doubt, include it. Assume the reader has never seen this codebase.

### 3.2 Use code blocks liberally
[View detailed examples](references/writing-principles.md)

Every command should be copy-pasteable. Show example output when helpful.

### 3.3 Explain the why
[View detailed examples](references/writing-principles.md)

Do not just say "run this command." Explain what it does and why.

### 3.4 Use tables for reference
[View detailed examples](references/writing-principles.md)

Environment variables, CLI options, configuration options, and script references work great as tables.

### 3.5 Keep commands current
[View detailed examples](references/writing-principles.md)

Detect and use the correct package manager. Never assume npm.

### 3.6 Write like a human
[View detailed examples](references/writing-principles.md)

Sound like someone who genuinely wants to help, not a robot generating docs.

### 3.7 Apply final prose-polish patterns

After drafting README content, apply the `accelint-english-manager` skill to remove AI writing patterns:

- Remove inflated significance language ("pivotal", "testament", "crucial", "vital")
- Replace promotional tone with neutral, specific language
- Eliminate superficial -ing analyses ("highlighting", "showcasing", "fostering")
- Replace vague attributions with specific sources or remove entirely
- Fix em dash overuse and rule-of-three patterns
- Remove sycophantic language ("Great question!", "Certainly!").
- Add personality and voice. Sterile writing is as obvious as AI slop.
- If `accelint-english-manager` is unavailable, deliver a clearly labeled draft and say the final polish step still needs to run.

---

## 4. Change Detection

### 4.1 Comparing code to docs

When updating an existing README:

1. Parse all public exports from the codebase
2. Parse all documented API from the README
3. Identify:
   - **Missing**: Exports not documented
   - **Stale**: Documentation for removed exports
   - **Changed**: Signature changes not reflected

### 4.2 Suggesting changes

Present the changes clearly:

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

### 4.3 Preserving custom content

When you update a README:

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

## Quick reference checklist

Before you finalize a README, verify:

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
