# Audit Report: accelint-ts-testing

## Scope and Evidence

Audited skill package: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing`

Direct evidence reviewed:
- `SKILL.md`
- `AGENTS.md`
- `README.md`
- `CHANGELOG.md`
- `evals/evals.json`
- `assets/output-report-template.md`
- `references/quick-start.md`
- package file inventory under the target skill
- related run artifact: `runs/accelint-ts-testing/iteration-2/status.json`

No files were modified.

---

## Overall Grade: A-

Strong, well-structured skill package with clear Vitest specialization, disciplined progressive disclosure, and good evidence of evaluation coverage. The main weaknesses are a few internal wording inconsistencies and one concrete example issue in the quick-start/reference material that slightly undermines trust in otherwise strong guidance.

---

## Strengths

### 1. Strong package structure and progressive disclosure
Observed package organization is coherent and complete:
- `SKILL.md`
- `AGENTS.md`
- `README.md`
- `references/` with topic-specific files
- `assets/output-report-template.md`
- `evals/evals.json`

This aligns well with the global skill-creator guidance for layered loading. `SKILL.md` explicitly routes the user to:
- `AGENTS.md` first
- only the matching reference files next
- the audit template only for audit tasks

That is evidence of an intentional reference-loading strategy rather than dumping all guidance into one file.

### 2. High-quality trigger description
`SKILL.md` frontmatter description is specific and bounded:
- names Vitest and Vitest-style patterns explicitly
- includes concrete trigger signals such as `describe`, `expect`, `vi.fn`, `vi.mock`, `*.test.ts`, `*.spec.ts`
- includes high-value problem types such as async flakiness, loose assertions, over-mocking, and parameterized cases
- sets clear boundaries against Jest-only, Playwright E2E, and TS documentation work

This is strong trigger design because it covers both direct and indirect phrasings while still defining non-goals.

### 3. Clear workflow guidance
The skill contains concrete operating workflows rather than only abstract principles:
- before writing tests
- before marking test work complete
- audit/review workflow
- selective reference loading rules
- audit-mode output-template rule

The “before marking test files complete” section is especially operational and testable. It gives direct package-manager-specific commands and explains why root `tsc` may be insufficient.

### 4. Good internal consistency across scope and evals
The eval suite in `evals/evals.json` strongly matches the skill’s claimed scope. Observed coverage includes:
- Vitest authoring
- AAA pattern
- async testing
- strict assertions
- test doubles and mocking boundaries
- property-based testing
- audit mode
- reference-loading behavior
- near-miss trigger boundaries for Jest, Playwright, and JSDoc tasks

That is strong evidence that the package is being evaluated against both positive and negative trigger cases, not just happy-path examples.

### 5. Version/changelog alignment is present
Observed alignment:
- `SKILL.md` metadata version: `3.1.1`
- `CHANGELOG.md` latest entry: `3.1.1`

The changelog entry also references the kinds of changes visible in the package now: eval additions, description tightening, workflow clarification, README updates, and prose tightening.

---

## Issues

### 1. Quick-start example contains guidance tension around `toBe` vs `toEqual`
In `references/quick-start.md`, the “incorrect” section says:
- “Uses loose assertion (`toBe` instead of `toEqual`)”

But elsewhere the skill’s assertion guidance is primarily about rejecting genuinely loose assertions such as:
- `toBeTruthy()`
- `toBeDefined()`

This creates a consistency problem. In Vitest/Jest-style testing, `toBe` is not inherently “loose” in the same sense as `toBeTruthy()`. The example may still prefer `toEqual`, but the wording overstates the issue and does not cleanly match the rest of the skill’s own terminology.

Evidence:
- `SKILL.md` explicitly says `toBeTypeOf()` is not loose and focuses loose-assertion guidance on truthy/defined-style matchers
- `references/quick-start.md` labels `toBe` as “loose”

This is not a structural defect, but it weakens precision in a skill that otherwise emphasizes precise testing guidance.

### 2. Minor naming inconsistency between title and package identity
`SKILL.md` frontmatter name is `accelint-ts-testing`, but the body heading is `# Vitest Best Practices`.

This is understandable given the scope, but it creates a slight identity mismatch:
- the package is named as a TypeScript testing skill
- the body presents it as a Vitest best-practices skill

The README follows the same “Vitest Best Practices” framing. This is not inherently wrong, but it slightly blurs whether the skill is centered on TypeScript test quality broadly or specifically Vitest practices. The description resolves this mostly well, but the naming split is observable.

### 3. Run artifacts cited in changelog are only lightly substantiated by visible state
`CHANGELOG.md` says:
- “Added run-state audit reports under `runs/accelint-ts-testing/` for audit, eval coverage, description updates, and prose review.”

In the visible run artifact inspection here, `runs/accelint-ts-testing/iteration-2/` only exposed `status.json`, which shows:

```json
{ "stage": "1", "status": "working" }
```

This does not disprove the changelog, but based on directly observed evidence in this audit, the repository-visible run state is lighter than the changelog wording suggests. That weakens evidence traceability slightly.

---

## Risks

### 1. Precision risk in example-driven guidance
Because the quick-start example is likely a high-visibility entry point, any imprecise claim there can propagate weaker heuristics. The specific `toBe` vs `toEqual` wording risks teaching a broader rule than the rest of the skill actually supports.

### 2. Boundary drift risk from mixed naming
The package name, body title, and README framing are close but not perfectly unified. Over time, that could make future edits drift between:
- “Vitest-specific testing skill”
- “TypeScript tests generally”
- “test-quality audit skill”

The current package still stays mostly consistent, but this is a governance risk to watch.

### 3. Evidence traceability risk for future audits
The changelog references run-state audit reports, but the directly visible run artifact inspected here was minimal. If this package relies on run directories as part of its quality story, sparse or partial artifacts make later audits less verifiable.

---

## Summary

`accelint-ts-testing` is a high-quality skill package with:
- strong structure
- strong trigger design
- clear workflows
- disciplined progressive loading
- good eval coverage
- aligned versioning and changelog metadata

Its weaknesses are relatively small and mostly about precision and consistency in supporting materials rather than core package design.

**Grade: A-**  
Short justification: strong, evidence-backed skill architecture and evaluation discipline, with minor but real wording and consistency issues that keep it just below an A.
