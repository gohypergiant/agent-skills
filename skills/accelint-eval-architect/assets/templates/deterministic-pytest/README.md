# Evals — __SKILL_NAME__ (deterministic, pytest)

Zero-cost deterministic eval harness. No LLM judge. Run from the skill root:

```bash
uv run --directory evals pytest         # or: npm run eval  (if wired)
```

## Layout
- `conftest.py` — startup checks + fixtures (paths, helpers)
- `fixtures/` — input cases (pristine + planted-broken)
- `expected/` — goldens GENERATED from the skill's schema/validator (do not hand-edit)
- `metrics/` — scoring functions; set `score` / `success` / `reason`
- `tests/` — `test_*.py` pass cases; `test_*_regression.py` proves each metric can fail

## If the skill has a validator CLI
Shell out to it rather than reimplementing the schema (one source of truth). Use
the BUILT path (e.g. `dist/cli/validate.js`), and add a conftest startup check
that fails fast with a clear message if the build is missing.

## Extend
1. Add a fixture pair (clean + planted-broken) per behavior.
2. Add a metric in `metrics/`.
3. Add BOTH a pass test and a `test_*_regression.py`.

## Don't lose this
Gitignore `results/`, `.venv/`, `__pycache__/`, `.pytest_cache/` — never the
source. Run `git status` after scaffolding; commit before the first run.
