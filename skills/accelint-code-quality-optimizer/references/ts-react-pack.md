# 2.1 TypeScript/React Pack

## Overview

Load this pack when `detect-stack.mjs` reports `ts-react`. Most TypeScript and React quality rules are already expressible in oxlint or ESLint, and a rule enforced by a ratcheted linter outlasts any number of hand-fixed instances. This pack decides, for each kind of finding, whether to enable a lint rule, use an AST detection from `scripts/`, or leave it as review guidance.

## Key Principles

1. **The repo's linter first**: If the repo uses oxlint, propose oxlint rules; if ESLint, the ESLint equivalents. Never add a second linter.
2. **Enable, ratchet, then fix**: A new rule enters as `warn` with its count in the baseline (tier C config change). Fixing instances follows as tier A or B MRs/PRs.
3. **Type-aware rules need the type-aware runner**: `no-floating-promises`, `no-misused-promises` and `switch-exhaustiveness-check` need `oxlint --type-aware` (or typescript-eslint with `parserOptions.project`). Without it they report nothing; do not read silence as a pass.
4. **React performance rules need a profile**: Memoization, `useTransition` and virtualization changes go in the report unless a React Profiler or performance trace shows the component matters.

## Rule Mapping

| Finding | First choice: lint rule (oxlint name) | Scorecard metric | Tier for fixes | Detailed guidance |
|---------|----------------------------------------|------------------|----------------|-------------------|
| Explicit `any` | `typescript/no-explicit-any` | `explicitAny` | B (non-exported), C (exported) | accelint-ts-best-practices `any` |
| Unneeded type assertion | `typescript/no-unnecessary-type-assertion` (type-aware) | `typeAssertions` | A | accelint-ts-best-practices `any` |
| Double assertion `as unknown as` | none | `doubleAssertions` | B/C | accelint-ts-best-practices `any` |
| Non-null `!` | `typescript/no-non-null-assertion` | `nonNullAssertions` | B | accelint-ts-best-practices `assertions` |
| `@ts-ignore` | `typescript/ban-ts-comment`, `typescript/prefer-ts-expect-error` | `tsSuppressions` | A (`prefer-ts-expect-error`), B | |
| `enum` | none for the ban; `typescript/prefer-literal-enum-member` for members | `enums` | C (enums are usually exported) | accelint-ts-best-practices `enums` |
| `interface` vs `type` | `typescript/consistent-type-definitions` (approved standard only) | | A | accelint-ts-best-practices `type-vs-interface` |
| Type-only imports | `typescript/consistent-type-imports` | | A | |
| Floating promises | `typescript/no-floating-promises` (type-aware) | | B | accelint-ts-best-practices `error-handling` |
| Non-exhaustive switch | `typescript/switch-exhaustiveness-check` (type-aware) | | B | |
| `console.*` in sources | `no-console` | `consoleCalls` | B (route to the repo's logger) | |
| Lint suppressions | none | `lintSuppressions` | B | |
| Import cycles | `import/no-cycle` | | C | |
| Default exports | `import/no-default-export` (approved standard only) | | C (changes import sites) | |
| File naming | `unicorn/filename-case` (approved standard only) | | C (renames change imports) | accelint-ts-testing `organization` |
| Large files | `max-lines` as `warn` at the overlay threshold | `filesOverWarn`, `filesOverMax` | C | [decomposition.md](decomposition.md) |
| Hooks rules | `react/rules-of-hooks`, `react/exhaustive-deps` | | B | accelint-react-best-practices `narrow-effect-dependencies` |
| Component defined inside a component | none in oxlint | `nestedComponents` | B | accelint-react-best-practices `no-inline-components` |
| Derived state in `useEffect` | none | `effects` (context only) | B | accelint-react-best-practices `calculate-derived-state` |
| Missing list keys / index keys | `react/jsx-key`, `react/no-array-index-key` | | B | |
| Loose test assertions | none (do not enable `vitest/prefer-to-be-truthy`; it pushes toward loose matchers) | `looseAssertions` | B | accelint-ts-testing `assertions` |
| Focused or skipped tests | `jest/no-focused-tests`, `jest/no-disabled-tests` (apply to Vitest) | | A/B | |
| Mock cleanup not configured | config check | conventions `vitest-mock-cleanup` | C (config) | accelint-ts-testing `vitest-features` |
| Config drift (`strict`, `noUncheckedIndexedAccess`) | config check | conventions `tsconfig:*` | C | [decomposition.md](decomposition.md) |

Rules marked "approved standard only" encode a style choice; enable them only after the user approves that convention in Step 1.

## Using the Accelint Skills

When the accelint TypeScript and React skills are installed, invoke them for the per-file review in Step 3, scoped to the approved themes, and tell them to report rather than apply:

```
Invoke the accelint-react-best-practices skill.

Audit packages/ui/src/components/layout for: inline components, derived state in effects, effect dependencies.
Report only. Do not apply changes. Skip performance rules unless the file is listed as a profiled hot path.
```

Their findings join the Step 4 table with the tier from this mapping. When a skill is not installed, use the "Detailed guidance" column as the rule name and the one-line summaries in this file.

## Examples

### Pattern 1: Hand-fixing instead of ratcheting

**❌ Incorrect**
```
MR: replace 140 `any` across 9 packages
```

**Why this is wrong:** Too large to review, and nothing stops the 141st.

**✅ Correct**
```
MR 1 (tier C): enable typescript/no-explicit-any as warn; baseline records 140
MR 2..n (tier B): packages/ui non-exported any, 14 -> 6; baseline lowered in the same MR
```

### Pattern 2: Lint silence from a type-aware rule

**❌ Incorrect**
```bash
oxlint -D typescript/no-floating-promises packages/data-access   # 0 findings: "no floating promises"
```

**✅ Correct**
```bash
oxlint --type-aware -D typescript/no-floating-promises packages/data-access
```

## Common Pitfalls

- Converting an exported `enum` to an `as const` object in tier B. `Kind.Track` still works, but `Kind` as a type becomes a string-literal union, so consumers that pass plain strings now compile and consumers that use `Kind` in declaration merging or `keyof typeof` break. The export diff catches it; plan it as tier C.
- Flagging every `useEffect`. The `effects` count is context; only effects that compute or copy state are findings.
- Treating `as const` as a type assertion. The scorecard already excludes it; do not count it by hand either.
