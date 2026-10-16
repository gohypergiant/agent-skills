# Code Quality Optimizer

Brings a whole repository to one consistent, measured quality standard through small, behavior-preserving changes delivered as merge requests or pull requests. Built for codebases written by many people (or many agents) without shared conventions. Supports TypeScript/React and Go in this version; other stacks are reported as out of scope.

## Installation

**npm**
```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-code-quality-optimizer
```

**pnpm**
```bash
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-code-quality-optimizer
```

For the detailed TypeScript and React rules, also install `accelint-ts-best-practices`, `accelint-react-best-practices`, `accelint-ts-testing` and `accelint-react-testing`. The skill works without them using its built-in rule mapping.

## Usage

**prompt**
```
Persona:
Staff engineer responsible for code quality across a pnpm monorepo.

Objective:
1. Use the accelint-code-quality-optimizer skill on packages/sensor-health
2. Build the standard from our configs and propose conventions for approval
3. Baseline the scorecard and report findings by package and theme
4. Apply only the items I approve, as one MR per theme

Output:
The findings table first, then wait for my approval.
```

The agent stops for your decision three times: to approve conventions, to choose which findings to apply, and before pushing any branch.

## What's Included

- **SKILL.md** - The workflow with its stop points, anti-patterns and pre-flight questions
- **AGENTS.md** - Rule summaries with links to references
- **references/** - Tiers and visibility levels, behavior checks, standards, scorecard and ratchet, MR/PR packaging, decomposition, performance, harness portability, TypeScript/React pack, Go pack
- **scripts/** - Node CLIs with JSON output:
  - `detect-stack.mjs` - stacks, packages, verification commands, configs, tools
  - `conventions.mjs` - inferred conventions as proposals, with accelint guidance
  - `scorecard.mjs` - per-package metrics from the TypeScript AST and lint output
  - `ratchet.mjs` - fail only when a number gets worse; refuse baseline updates that hide regressions
  - `importers.mjs` - classifies each export as file-private, package-internal, package-public or unknown from the import graph, resolved with the compiler (tsconfig `paths`, package `exports`, workspace links)
  - `export-diff.mjs` - snapshots what each export of a package entry exposes (its emitted declaration plus everything it references) and compares two snapshots; moves with re-export, reorders and formatting are not changes
  - `side-effect-diff.mjs` - flags added, removed or reordered I/O, logging, timer and awaited calls
  - `symbol-map.mjs` - symbols and dependencies for planning file splits
  - `hot-paths.mjs` - says which files are on declared hot paths, the only place performance changes are allowed
  - `go-scorecard.mjs` - per-package Go metrics from `go vet`, staticcheck, gofmt, optional golangci-lint output and the `rules/go` ast-grep rules, in the same shape as `scorecard.mjs` so the ratchet works on it
- **rules/** - ast-grep rules (`rules/go/*.yml`) with tests (`rules/go-tests/`); `ast-grep test -c rules/sgconfig.yml --skip-snapshot-tests` runs them
- **assets/** - Progress, overlay, standards, report and MR/PR description templates
- **evals/** - Synthetic fixture repos (a TypeScript monorepo and a Go service), expected script results, agent eval prompts

## Requirements

- Node.js 20 or newer
- The target repo's dependencies installed, so its own `typescript` package is used for parsing (or pass `--typescript <path>` / set `CQO_TYPESCRIPT`), and its workspace built, so packages that point at `dist/` resolve for `export-diff` and `importers`
- git
- Optional: oxlint or ESLint (lint counts); for the Go pack `go` (with gofmt), staticcheck (`go install honnef.co/go/tools/cmd/staticcheck@latest`), ast-grep (`npm i -g @ast-grep/cli`) and golangci-lint when the repo uses it. `go-scorecard.mjs` reports in `warnings` which of these it could not run.

Works in any agent harness with file access, a shell and git, on Claude or GPT models.

## Examples

### Example 1: Baseline a package

```bash
node skills/accelint-code-quality-optimizer/scripts/detect-stack.mjs .
pnpm exec oxlint --format=json packages/ui > lint.json
node skills/accelint-code-quality-optimizer/scripts/scorecard.mjs . --scope packages/ui --lint-report lint.json --out scorecard.json
node skills/accelint-code-quality-optimizer/scripts/ratchet.mjs update --baseline .code-quality/scorecard.baseline.json --current scorecard.json
```

Expected result: per-package counts of `any`, casts, suppressions, enums, console calls, nested components, loose test assertions and oversized files, plus lint counts by rule, and a committed baseline.

### Example 2: Check that a refactor kept the public API

```bash
node skills/accelint-code-quality-optimizer/scripts/export-diff.mjs snapshot . --entry packages/ui/src/index.ts --out before.json
# ...make the change...
node skills/accelint-code-quality-optimizer/scripts/export-diff.mjs snapshot . --entry packages/ui/src/index.ts --out after.json
node skills/accelint-code-quality-optimizer/scripts/export-diff.mjs compare before.json after.json
```

Expected result: `"status": "unchanged"` and exit code 0, or the list of exports whose types changed and exit code 1.

## Evals

```bash
cd skills/accelint-code-quality-optimizer
node evals/run-script-evals.mjs --typescript <path to a typescript package>
```

Checks every script against the planted problems in `evals/fixtures/ts-monorepo` and `evals/fixtures/go-service`, and runs the ast-grep rule tests. The Go checks need `go`, staticcheck and ast-grep on PATH and are reported as `skip` (not pass) without them. `evals/evals.json` holds agent-level prompts with assertions; run them on both a Claude model and a GPT model and report results for each.

---

## Contributing

Contributions are welcome! When contributing to this skill:

1. **CRITICAL**: Ensure description field in SKILL.md answers WHAT/WHEN/KEYWORDS - this determines if skill gets activated
2. Follow the skill structure guidelines in the accelint-skill-manager skill
3. Ensure all examples use ❌/✅ format for clarity
4. Keep SKILL.md under 500 lines (move details to references/)
5. Focus on expert-only knowledge - assume the agent knows basics
6. Run `node evals/run-script-evals.mjs` after changing any script

**Maintain CHANGELOG.md:**
- Use "Keep a Changelog" format with semantic versioning
- Update after each skill iteration with Added/Changed/Fixed/Version sections
- Always include rationale (WHY changes were made)
- Link to evaluation results when changes stem from testing
- Ensure version matches `metadata.version` in SKILL.md frontmatter

---

## Skill Architecture Philosophy

1. **Measure, then change** - Deterministic scripts count and compare; the model decides and explains.
2. **The standard is approved, not inferred** - Majorities are proposals until a person accepts them.
3. **Behavior is proven, not claimed** - Every change passes the repo's checks, an export diff and a side-effect check.
4. **Reviewable output** - Small MRs/PRs, one theme each, prepared but never pushed or merged without approval.

---

## Learn More

- [Agent Skills Specification](https://agentskills.io/specification)
- [AGENTS.md](AGENTS.md) - Rule summaries
- [references/](references/) - Detailed rules with examples

---

## License

Apache-2.0
