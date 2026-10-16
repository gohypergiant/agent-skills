# Code Quality Report: {scope}

**Date:** {YYYY-MM-DD}
**Base:** `{default-branch}` at `{base-sha}`
**Standards:** `.code-quality/standards.md` ({n} written rules, {n} approved conventions, {n} open decisions)

## Summary

{Two or three sentences: overall state of the scope, the biggest problem, and what this run proposes. If there are no findings, say so and stop here.}

| Metric | Value |
|--------|-------|
| Findings | {n} ({a} tier A, {b} tier B, {c} tier C, {r} report only) |
| Packages | {n} |
| Largest file | `{file}` ({lines} lines) |

## Findings

All findings, grouped by package and theme. Nothing has been changed.

| # | Package | Theme | Tier | Count | Source | Consequence if left |
|---|---------|-------|------|-------|--------|---------------------|
| 1 | `{packages/ui}` | {Loose test assertions} | B | {12} | {standard: exact assertions} | {Tests pass when outputs change} |
| 2 | `{packages/ui}` | {`@ts-ignore` comments} | A | {3} | {lint: typescript/prefer-ts-expect-error} | {Suppressions outlive the error they hid} |
| 3 | `{packages/ui}` | {Split dock-layout.tsx} | C | {1} | {threshold: 1000 lines} | {Every change to layout touches one 2,668-line file} |

## Details

### #{n}: {Theme} ({tier})

**Files:** `{file}:{line}`, `{file}:{line}`
**Rule or standard:** {source}

**Before:**
```ts
{code}
```

**After:**
```ts
{code}
```

{For tier C: the problem and the proposed design step instead of before/after.}

## Report Only

Items not proposed for change in this run, with the reason.

| Finding | Why not now |
|---------|-------------|
| {Memoize row renderer} | {No profile shows this path matters} |

## Open Decisions Needed

| Convention | Options |
|------------|---------|
| {} | {} |

---

**Apply which items?** Enter ids (e.g. `1, 3, 5-8`), a theme name, `tier-a` (autofix without per-item review), or `none`.
