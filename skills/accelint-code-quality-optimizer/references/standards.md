# 1.3 Standards

## Overview

A cleanup without a written target drifts: each run "fixes" code toward whatever the agent prefers, and the next run or the next engineer moves it back. The standard is `.code-quality/standards.md`, committed in the target repo and reviewed like code. Only two things go in it: written rules with a cited source, and conventions the user approved.

## Key Principles

1. **Cite the source of every written rule**: `AGENTS.md:42`, `.oxlintrc.json`, `packages/ui/tsconfig.json`. A rule without a source is a preference.
2. **Inferred conventions are proposals**: `scripts/conventions.mjs` reports what the code does, which in an inconsistent repo can be the wrong thing.
3. **The majority can be wrong**: When the dominant value contradicts accelint guidance (`majorityContradictsGuidance: true`), present both and let the user choose. Do not silently pick the guidance either.
4. **Conflicts belong to the user**: No value at or above the share threshold means no proposal. Record the user's decision in the overlay `decisions` so later runs do not ask again.

## Examples

### Pattern 1: Majority adopted without approval

**❌ Incorrect: writing the inferred value as a rule**
```markdown
## TypeScript
- `noUncheckedIndexedAccess` is not used (9 of 14 packages leave it unset).
```

**Why this is wrong:** Leaving a safety flag unset is not a convention anyone chose; it is drift. Recording it as the standard locks the drift in.

**✅ Correct: proposal shown with counts and guidance, decided by the user**
```markdown
| Convention | Observed | Dominant | Deviating | Guidance | Decision |
|---|---|---|---|---|---|
| tsconfig `noUncheckedIndexedAccess` | unset 9, true 2, false 3 | unset (64%) | 5 | none | **User: true, adopt one package at a time (tier C)** |
```

**Why this is better:** The decision, the evidence and the migration path are explicit.

### Pattern 2: Rule without a source

**❌ Incorrect**
```markdown
- Components must be under 200 lines.
```

**✅ Correct**
```markdown
- Source files over 1000 lines are split before new features are added to them. (Source: overlay `thresholds.fileLinesMax`, approved 2026-10-16.)
```

## Standards File Sections

Use [../assets/standards-template.md](../assets/standards-template.md). It has three sections, in this order:
1. **Written rules** - each with its source file and line.
2. **Approved conventions** - each with the evidence counts and the date of approval.
3. **Open decisions** - conflicts not yet decided. Nothing in this section is enforced.

## Common Pitfalls

- Re-deriving conventions on every run. Read `.code-quality/standards.md` first; run `conventions.mjs` only for scopes or conventions it does not cover yet.
- Treating "unknown (unresolved base)" tsconfig values as unset. Install dependencies so shared bases in `node_modules` resolve, then re-run.
- Copying an accelint rule into the standard without the user's approval. Accelint guidance informs the proposal; the user decides.
