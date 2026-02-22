# Implementation Plan Template

Use this exact structure when creating implementation plans. Fill in all placeholders with specific information from your research.

---

```markdown
# Implementation Plan: {Feature Name}

Date: {ISO timestamp}

---

## CONTEXT REFERENCES

### Relevant Codebase Files
**IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!**

- `path/to/file.ts` (lines 15-45) - Why: {Specific pattern to follow}
- `path/to/model.ts` (lines 100-120) - Why: {Type structure reference}

### New Files to Create

- `path/to/new/file.ts` - {Purpose and description}
- `path/to/test.ts` - {Test file purpose}

### Files to Update

- `path/to/existing.ts` - {What kind of update needed}

### Relevant Documentation
**YOU SHOULD READ THESE BEFORE IMPLEMENTING!**

- [Library Docs - Section](https://example.com/docs#section)
  - Specific section: {Section name}
  - Why: {Why this is needed}
  - Version: {version from package.json}

### Patterns to Follow

**Copyright Header:**
```{language}
{Actual copyright header from project}
```

**Naming Conventions:**
- Classes: {convention with example}
- Files: {convention with example}
- Variables: {convention with example}

**Error Handling Pattern:**
```{language}
// From: src/path/file.ts:lines
{Actual code example}
```

**Logger Pattern:**
```{language}
// From: src/path/logger.ts:lines
{Actual code example}
```

**Testing Pattern:**
```{language}
// From: tests/example.test.ts:lines
{Actual code example}
```

---

## IMPLEMENTATION PLAN

### Phase 1: {Phase Name}

{Description of what this phase accomplishes}

**Tasks:**
- {High-level task 1}
- {High-level task 2}

### Phase 2: {Phase Name}

{Description}

**Tasks:**
- {High-level task}

{... additional phases ...}

---

## STEP-BY-STEP TASKS

**IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.**

### {ACTION} {target_file}

- **IMPLEMENT**: {What to build}
  ```{language}
  {Code template/example}
  ```
- **PATTERN**: {file:line reference}
- **IMPORTS**: {Required imports}
- **GOTCHA**: {Known issues/constraints}
- **VALIDATE**: `{executable command}`

{Repeat for all tasks in dependency order}

---

## NOTES

### Design Decisions

{Document key architectural and design choices with rationale}

**Decision: {Choice}**
- Rationale: {Why}
- Trade-off: {What we're sacrificing}
- Alternative considered: {What else was considered}

### Performance Considerations

{Document performance implications and optimizations}

### Trade-offs

{Document what was chosen and what was sacrificed}

### Future Enhancements

{Possible improvements for later}
```
