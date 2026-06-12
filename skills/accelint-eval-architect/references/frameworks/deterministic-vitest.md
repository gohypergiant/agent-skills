# Deterministic harness (vitest) — Node-native, no judge

For Node target skills whose output is fully or partially verifiable. Zero
per-run cost, no drift. The default choice for Node skills until a judge is
proven necessary.

## Why vitest for Node targets
The target already has `package.json` and (usually) vitest as its test runner.
Adding an `eval` script that runs vitest against `evals/` means no new language,
no Python venv, no extra CI toolchain. House fit lowers the maintenance barrier —
the whole reason a Node skill should not get a Python eval unless a judge forces
it.

## Layout
```
<target>/evals/
├── fixtures/            # input cases (pristine / flawed / broken) as real files
├── expected/            # goldens GENERATED from the skill's schema, not hand-typed
├── metrics/             # one .ts per metric; pure functions: (output, expected) -> {score, reason}
├── tests/               # *.test.ts (pass cases) + *.regression.test.ts (teeth)
├── README.md
└── DESIGN.md            # why deterministic-only + pre-filled Known follow-ups
```
Add to the target `package.json`:
```json
"scripts": { "eval": "vitest run evals" }
```

## Metric shape — pure function, structured result
A metric is a pure function `(output, expected) → { score, passed, reason }`.
Keep scoring out of the test so the same metric reuses across fixtures. Two
rules that get missed:
- **An empty planted set scores 1.0, not 0/0** — a clean fixture must be able
  to pass the recall metric, or precision fixtures break it.
- **The reason must NAME the missed/false items** (`Missed 2/3: no-enum,
  no-null`), not just report a number — a bare score turns every regression
  into a debugging session.

## Precision AND recall — you need both fixtures
A detection skill (code review, lint-style) needs two fixture classes:
- **dirty fixture** with *known planted* defects → measures **recall** (did it catch them).
- **clean fixture** with *zero* defects → measures **precision** (did it avoid false flags).

Recall-only evals reward a skill that flags everything. Precision-only rewards
one that flags nothing. Ship both from day one.

## Regression test = the teeth
Every metric gets a `*.regression.test.ts` that feeds a *deliberately wrong* SUT
output (or a stub under-detector) and asserts the metric drops below threshold
AND that the reason names the planted defect (`expect(r.reason).toMatch(/no-enum/)`).
A metric with only a passing test is decoration.

## Goldens: generate, never hand-write
If the skill has a schema or validator, generate `expected/` from it at scaffold
time and regenerate in AUDIT. Hand-typed goldens rot the first time the schema
changes and then fail correct output.

## Don't lose the source
`evals/` source is `.ts` — make sure it is git-tracked. Gitignore only
`evals/results/` (if you emit run artifacts) and any `node_modules`. Commit the
harness before the first run.
