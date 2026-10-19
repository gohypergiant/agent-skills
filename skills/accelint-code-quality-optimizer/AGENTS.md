# Code Quality Optimizer

> **Note:**
> This document is mainly for agents and LLMs to follow when bringing a repository to a consistent, measured quality standard through behavior-preserving changes. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Rules for a repo-wide, language-neutral quality workflow with stack-specific packs. Each rule has a one-line summary here and a link to a self-contained reference with ❌/✅ examples. Load a reference only when the current workflow step needs it.

**Token efficiency principle:** These rules cover the decisions an agent gets wrong without guidance: what counts as a standard, which changes are safe without review, how to prove behavior did not change, and how to package work so humans can review it.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify relevant guidance
2. **Load references as needed**: Click through to detailed examples only when implementing
3. **Progressive loading**: Each reference file is self-contained with ❌/✅ examples

This structure minimizes context usage while providing complete implementation guidance when needed.

---

## Quick Reference

- [1.1 Tiers](#11-tiers) - Which changes are mechanical, reviewed, or design-first
- [1.2 Behavior Checks](#12-behavior-checks) - Prove each change preserves behavior
- [1.3 Standards](#13-standards) - Written rules plus approved conventions only
- [1.4 Scorecard and Ratchet](#14-scorecard-and-ratchet) - Measure per package; never get worse
- [1.5 MR/PR Packaging](#15-mrpr-packaging) - One theme, one package, small, unpushed
- [1.6 Decomposition](#16-decomposition) - Design-first splits and config unification
- [1.7 Performance](#17-performance) - Hot paths only, benchmark before and after
- [1.8 Removal and Simplification](#18-removal-and-simplification) - Dead code, duplicates, pass-through layers
- [2.1 TypeScript/React Pack](#21-typescriptreact-pack) - Tools, detections, accelint rule mapping
- [2.2 Go Pack](#22-go-pack) - Tools, detections, API diff
- [3.1 Harness Portability](#31-harness-portability) - Any harness, Claude or GPT

---

## 1. Core

### 1.1 Tiers
Classify visibility with `importers.mjs` (file-private, package-internal, package-public, unknown; unknown counts as package-public). Tier A is a tool's own type-preserving autofix for one rule; tier B is a targeted edit to file-private or package-internal code; tier C needs an approved design and covers package-public signatures, file splits and config unification.
[View detailed examples](references/tiers.md)

### 1.2 Behavior Checks
Snapshot exports and copy the files before each edit; afterwards run, in order: the repo's format, lint, typecheck and build commands; the `.d.ts` export diff on the package entries; the side-effect heuristic; tests (with characterization tests first where coverage is thin). Revert on failure.
[View detailed examples](references/behavior-checks.md)

### 1.3 Standards
A standard is a written rule with a cited source or a convention the user approved; a majority pattern alone is a proposal, and one that contradicts accelint guidance is flagged.
[View detailed examples](references/standards.md)

### 1.4 Scorecard and Ratchet
Count per-package metrics from the AST and lint output, commit a baseline, and fail CI only when a number rises; introduce the job report-only.
[View detailed examples](references/scorecard-and-ratchet.md)

### 1.5 MR/PR Packaging
One theme in one package per MR/PR, under 400 changed lines unless it is a single-rule autofix, with scorecard deltas and checks in the description, no AI trailers, and no push without approval.
[View detailed examples](references/mr-packaging.md)

### 1.6 Decomposition
Split large files by mapping responsibilities and symbol dependencies, keeping the public entry point as a re-export, and moving one symbol group per commit; unify configs one package and one flag at a time.
[View detailed examples](references/decomposition.md)

### 1.7 Performance
Change performance only in overlay `hotPaths`, with a benchmark before and after (`vitest bench`, `go test -bench` + `benchstat`, React Profiler) and at least a 10% gain; everything else is report-only.
[View detailed examples](references/performance.md)

### 1.8 Removal and Simplification
Find unused files and exports with `unused.mjs`, copy-paste with `duplicates.mjs` and pass-through wrappers with the scorecard's `passThroughs`. Each is a candidate until a text search, the history and the owner agree and the user confirms it. Remove leaves first, one file or export group per commit; consolidate only copies that must change together; keep layers that are seams.
[View detailed examples](references/removal.md)

---

## 2. Packs

### 2.1 TypeScript/React Pack
Use the repo's oxlint/ESLint, tsc and Vitest/Jest first; ratchet in lint rules rather than hand-fixing instances; map accelint TypeScript and React rules to lint, AST detection or review guidance.
[View detailed examples](references/ts-react-pack.md)

### 2.2 Go Pack
Use `go vet`, staticcheck and golangci-lint first, counted per package by `go-scorecard.mjs` together with the `rules/go` ast-grep detections (defer in loop, ignored errors, `%v` wraps, `interface{}`, `context.TODO`, prints, panics, nolint, sleeps in tests); check exported API with `apidiff`.
[View detailed examples](references/go-pack.md)

---

## 3. Runtime

### 3.1 Harness Portability
Rely only on file access, a shell and git; write approvals as explicit stops; keep state in the progress file; treat subagents and question tools as optional.
[View detailed examples](references/harness-portability.md)
