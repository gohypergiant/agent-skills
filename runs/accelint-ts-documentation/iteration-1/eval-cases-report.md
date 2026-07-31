# accelint-ts-documentation eval coverage report

- Total eval cases: 20
- JSON validation: Passed

## Coverage summary

The eval set covers the skill's full documented scope with a balance of positive, negative, and boundary cases.

### JSDoc completeness and correctness
- Exported function completeness requirements: description, `@param`, `@returns`, `@throws`, and fenced `@example`
- Internal-vs-exported sufficiency judgment
- Generic `@template` requirements
- Invalid `@returns` on `void` functions
- `@example` fence and language-identifier correctness
- Destructured object parameter dot-notation requirements
- Interface property documentation
- Constant documentation with units and constraints

### Comment-quality coverage
- Vague marker comments that need rewriting
- Removal of commented-out code and edit-history comments
- Preservation of tool directives
- Preservation of useful why/rationale comments
- End-of-line comment placement guidance

### Workflow and reference-loading behavior
- JSDoc-only implementation requests load `references/jsdoc.md`
- Comment-only cleanup requests load `references/comments.md`
- Mixed tasks require both references
- Answer-only questions should not force reference loading
- Formal audit requests should use the report-template path
- Edge-case syntax scenarios should prefer reference loading over guessing

### Trigger-boundary coverage
- A near-miss case ensures generic TypeScript code-quality audits do not incorrectly route to this skill

## Notable additions
- Added explicit coverage for reference-loading decisions, which are central to this skill's workflow but often missing from evals.
- Added exported-vs-internal sufficiency judgment cases so the skill is tested on nuance, not only tag syntax.
- Added preservation cases for directive comments and business-rationale comments to prevent over-cleaning behavior.
