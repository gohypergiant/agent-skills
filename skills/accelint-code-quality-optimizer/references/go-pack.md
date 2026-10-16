# 2.2 Go Pack

## Overview

Load this pack when `detect-stack.mjs` reports `go`. Go's own toolchain already catches most quality problems precisely, using type information. Use it first, measure with its output, and add detections only for what it misses. Go has a stable notion of exported API (capitalized identifiers), so the tier boundary is mechanical: any change to an exported identifier's signature is tier C.

## Tools, In Order

| Tool | Command (from the module root) | Use |
|------|-------------------------------|-----|
| gofmt / goimports | `gofmt -l .`, `goimports -l .` | Tier A formatting |
| go vet | `go vet ./...` | Correctness; every finding is in scope |
| staticcheck | `staticcheck -f json ./...` | Quality and bugs; counts by check code |
| golangci-lint | `golangci-lint run --out-format json ./...` (v1) or `--output.json.path stdout` (v2) | When the repo has `.golangci.yml`; use its config only |
| apidiff | `go run golang.org/x/exp/cmd/apidiff@latest <before.export> <after.export>` | Export signature check |
| race detector | `go test -race -count=N ./<pkg>/...` | Stability runs for concurrency changes |
| ast-grep | run by `scripts/go-scorecard.mjs` with `rules/sgconfig.yml` | The detections the tools above do not make |

Use only tools the repo already has or the user approves installing. `detect-stack.mjs` reports which are on `PATH`; `go-scorecard.mjs` reports in `warnings` which ones it could not run, and never invents a count.

## Go Scorecard

```bash
node scripts/go-scorecard.mjs <worktree> --scope services/materializer --out <original>/.code-quality/runs/go-scorecard-before.json
# with the repo's own golangci-lint config, when it has one:
golangci-lint run --out-format json ./... > <original>/.code-quality/runs/golangci.json
node scripts/go-scorecard.mjs <worktree> --scope services/materializer --golangci-report <original>/.code-quality/runs/golangci.json --out ...
```

It counts per Go package directory, skips generated files (`// Code generated ... DO NOT EDIT.`), `testdata/` and overlay `ignore` globs, and writes the same shape as `scorecard.mjs`, so `ratchet.mjs` works on it unchanged. Keep a separate baseline for it: `.code-quality/go-scorecard.baseline.json`.

| Metric | Counted from | Ratcheted |
|--------|-------------|-----------|
| `vetFindings`, `lint:vet:<analyzer>` | `go vet -json ./...` per module | yes |
| `staticcheckFindings`, `lint:staticcheck:<code>` | `staticcheck -f json ./...` per module | yes |
| `lint:golangci:<linter>` | `--golangci-report` | yes |
| `unformattedFiles` | `gofmt -l .` per module | yes |
| `deferInLoop` | rule `go-defer-in-loop` | yes |
| `ignoredErrors` | rule `go-ignored-error`: `_ = f()`, `v, _ := f()` | yes |
| `errorfWithV` | rule `go-errorf-wrap-v`: `fmt.Errorf` with `%v` and an `err` argument, no `%w` | yes |
| `emptyInterfaces` | rule `go-empty-interface`: `interface{}` | yes |
| `contextTodo` | rule `go-context-todo`: `context.TODO()` | yes |
| `printCalls` | rule `go-print-call`: `fmt.Print*`, non-test files | yes |
| `panicCalls` | rule `go-panic-call`: `panic(...)`, non-test files | yes |
| `lintSuppressions` | rule `go-nolint`: `//nolint` comments | yes |
| `sleepInTests` | rule `go-sleep-in-test`: `time.Sleep` in `_test.go` | yes |
| `filesOverWarn`, `filesOverMax` | non-test files over the overlay thresholds | yes |
| `sourceFiles`, `testFiles`, `sourceLines`, `testLines`, `maxFileLines`, `bareGoroutines` | file counts; `go` statements with no visible `ctx`/`done`/`wg`/`cancel` (heuristic) | no |

Each package's `samples` lists up to five `file:line` locations per metric. The rules live in `rules/go/*.yml` with tests in `rules/go-tests/`; `ast-grep test -c rules/sgconfig.yml --skip-snapshot-tests` runs them. A finding from a rule is a lead, not a verdict: `ignoredErrors` counts every discarded return, and the agent decides per site whether the discarded value is an error.

## Export Signature Check

```bash
go run golang.org/x/exp/cmd/apidiff@latest -w before.export ./pkg   # before the change
go run golang.org/x/exp/cmd/apidiff@latest -w after.export ./pkg    # after
go run golang.org/x/exp/cmd/apidiff@latest before.export after.export
```

Any "incompatible" or "compatible" change fails tier A and B. "Compatible" additions are still public API changes and belong in tier C.

## Detections Still Done By Reading

Two of the original detections have no reliable syntactic form and stay manual. Locate candidates with the scorecard's `bareGoroutines` samples and `grep -n 'Lock()'`, then read:
- `go func()` with no context, done channel or `errgroup` in long-lived code (goroutine leak). `bareGoroutines` lists the candidates; confirm the lifetime by hand.
- A mutex held across a network, disk or channel operation.

## Examples

### Pattern 1: Fixing what vet already reports, one by one

**❌ Incorrect**
```
MR: fix 12 printf format issues found by reading the code
```

**✅ Correct**
```bash
node scripts/go-scorecard.mjs . --scope services/materializer   # lint: { "vet:printf": 12 }, recorded as the baseline
```
Fix them in one tier B MR per package with the count before and after.

### Pattern 2: Exported signature changed in a cleanup

**❌ Incorrect**
```go
-func Parse(raw map[string]interface{}) (*Record, error)
+func Parse(raw map[string]any) (*Record, error)
```

**Why this is wrong:** Identical types (`any` is an alias), so apidiff passes, but it touches public API docs and every reader's diff. It is a tier A `gofmt -r` style change only if the standard says so; otherwise skip it.

### Pattern 3: Error wrapping found by rule, fixed by rule

**❌ Incorrect**
```go
return fmt.Errorf("load %s: %v", name, err)   // errorfWithV: errors.Is(err, fs.ErrNotExist) is false upstream
```

**✅ Correct**
```go
return fmt.Errorf("load %s: %w", name, err)
```
One tier B MR per package, `errorfWithV` before/after in the description. `go vet` and the package tests cover the change; apidiff shows nothing because no signature moved.

## Common Pitfalls

- Running golangci-lint with linters the repo did not enable. Report against the repo's config; propose new linters as a tier C config change.
- Forgetting multi-module repos. `go-scorecard.mjs` runs vet, staticcheck and gofmt per `go.mod`; run any command you add yourself per module, from that module's directory.
- Counting generated files (`// Code generated ... DO NOT EDIT.`). The scorecard excludes them; never edit them by hand.
- Treating `staticcheckFindings` and `vetFindings` as different problems. The same printf bug is reported by both (`vet:printf`, `staticcheck:SA5009`); fix it once and both counts drop.
