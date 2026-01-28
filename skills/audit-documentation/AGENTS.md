# Documentation Audit - Quick Reference

This skill is a **delegating wrapper** around js-ts-best-practices. It provides focused activation for documentation tasks.

## Required Skill

**js-ts-best-practices** must be available. This skill loads only documentation-related references from it.

## Documentation References to Load

When activated, discover and load documentation references from js-ts-best-practices.

**Category to file name patterns (reference only - verify with parent SKILL.md):**
- **JSDoc standards** → Files with "jsdoc" in name
- **Comment markers** → Files with "marker" in name
- **Comment management** → Files with "comment" in name (placement, removal, preservation)

**Always consult `js-ts-best-practices/SKILL.md` "Documentation" section to confirm current file names and availability.**

Expected categories cover:
- JSDoc requirements for functions, types, interfaces, constants, classes
- Comment markers (TODO, FIXME, HACK, NOTE, PERF, REVIEW, DEBUG, REMARK)
- Identifying comments to remove (commented-out code, edit history)
- Preserving important comments (markers, linter directives, business logic)
- Comment placement guidelines

## Audit Checklist

Quick checklist for documentation audits:

### JSDoc Completeness
- [ ] All exported functions have complete JSDoc (description, @param, @returns, @throws, @example)
- [ ] Internal functions have minimal JSDoc (description, @param, @returns, @template)
- [ ] Generic functions include @template tags
- [ ] Object parameters use dot notation (props.propertyName)
- [ ] void functions omit @returns
- [ ] All @example tags use code fences with language identifier
- [ ] Types/interfaces have descriptions and @template
- [ ] Constants have descriptions
- [ ] Classes have descriptions and @example (if exported)

### Comment Quality
- [ ] Comment markers used appropriately (TODO, FIXME, HACK, NOTE, PERF, REVIEW)
- [ ] Commented-out code identified for removal
- [ ] Edit history comments identified for removal
- [ ] Directive comments preserved (eslint-disable, @ts-ignore, prettier-ignore)
- [ ] Business logic has explanatory comments
- [ ] End-of-line comments moved above code

## Workflow

1. Check js-ts-best-practices skill is available
2. Consult `js-ts-best-practices/SKILL.md` "Documentation" section for current file organization
3. Load all documentation-related references using category patterns above
4. Apply documentation audit workflow from SKILL.md
5. Report findings with specific reference to loaded rules
