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
└── README.md
```
Add to the target `package.json`:
```json
"scripts": { "eval": "vitest run evals" }
```

## Metric shape — pure function, structured result
A metric is a pure function returning a score and a human reason. Keep scoring
out of the test so the same metric can be reused across fixtures.

```ts
export interface MetricResult { score: number; passed: boolean; reason: string; }

export function violationRecall(
  reported: ReadonlySet<string>,
  planted: ReadonlySet<string>,
): MetricResult {
  const caught = [...planted].filter((v) => reported.has(v));
  const missed = [...planted].filter((v) => !reported.has(v));
  const score = planted.size === 0 ? 1 : caught.length / planted.size;
  return {
    score,
    passed: score >= 1,
    reason: missed.length
      ? `Missed ${missed.length}/${planted.size}: ${missed.join(", ")}`
      : `All ${planted.size} planted violations caught`,
  };
}
```

## Precision AND recall — you need both fixtures
A detection skill (code review, lint-style) needs two fixture classes:
- **dirty fixture** with *known planted* defects → measures **recall** (did it catch them).
- **clean fixture** with *zero* defects → measures **precision** (did it avoid false flags).

Recall-only evals reward a skill that flags everything. Precision-only rewards
one that flags nothing. Ship both from day one.

## Regression test = the teeth
Every metric gets a `*.regression.test.ts` that feeds a *deliberately wrong* SUT
output (or a stub under-detector) and asserts the metric drops below threshold
AND the reason names the defect. A metric with only a passing test is decoration.

```ts
test("recall metric fails when a planted violation is missed", () => {
  const planted = new Set(["no-any", "no-enum", "no-null"]);
  const reportedByBuggyStub = new Set(["no-any"]); // misses two
  const r = violationRecall(reportedByBuggyStub, planted);
  expect(r.passed).toBe(false);
  expect(r.reason).toMatch(/no-enum|no-null/);
});
```

## Goldens: generate, never hand-write
If the skill has a schema or validator, generate `expected/` from it at scaffold
time and regenerate in AUDIT. Hand-typed goldens rot the first time the schema
changes and then fail correct output.

## Don't lose the source
`evals/` source is `.ts` — make sure it is git-tracked. Gitignore only
`evals/results/` (if you emit run artifacts) and any `node_modules`. Commit the
harness before the first run.
