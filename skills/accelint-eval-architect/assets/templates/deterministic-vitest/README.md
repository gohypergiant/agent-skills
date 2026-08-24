# Evals — __SKILL_NAME__ (deterministic, vitest)

Zero-cost deterministic eval harness. No LLM judge. Run from the skill root:

```bash
npm run eval          # runs vitest against evals/
```

## Layout
- `fixtures/` — input cases (pristine + planted-broken)
- `expected/` — goldens GENERATED from the skill's schema (do not hand-edit)
- `metrics/` — pure scoring functions `(output, expected) -> {score, passed, reason}`
- `tests/` — `*.test.ts` pass cases; `*.regression.test.ts` proves each metric can fail

## Extend
1. Add a fixture pair (clean + dirty) for each new behavior.
2. Add a metric as a pure function in `metrics/`.
3. Add BOTH a pass test and a `*.regression.test.ts` — a metric with no failing
   case is decoration.

## Don't lose this
All files here are source — keep them git-tracked. Gitignore only run artifacts.
Commit before the first run.
