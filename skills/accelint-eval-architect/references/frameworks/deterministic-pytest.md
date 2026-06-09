# Deterministic harness (pytest) — Python-native, no judge

For Python target skills with verifiable output, or for any skill where the
deterministic gate must shell out to an existing CLI validator. Zero per-run
cost, no drift.

## When pytest over vitest
- the target is a Python package, OR
- the deterministic check is "run this existing CLI and check the exit code"
  (e.g., the skill ships a `validate` CLI) — pytest's `subprocess` ergonomics are
  clean and you avoid reimplementing the validator.

If the target is Node and has no Python, prefer vitest — don't grow a Python
dependency just for the eval.

## Layout
```
<target>/evals/
├── conftest.py          # fixtures: paths, sut(), record helpers
├── fixtures/            # input cases
├── expected/            # goldens generated from schema/validator
├── metrics/             # one .py per metric; BaseMetric-style: set score/success/reason
├── tests/               # test_*.py (pass) + test_*_regression.py (teeth)
├── pyproject.toml       # deps + [tool.pytest.ini_options]
└── README.md
```

## Shelling to an existing validator (the highest-value deterministic gate)
If the skill already validates its own output via a CLI, the eval should call
that CLI rather than reimplement the schema — one source of truth, no drift.

```python
import subprocess, json, tempfile, pathlib

def measure(actual_output: str) -> dict:
    data = extract_json(actual_output)            # tolerant extractor, not raw json.loads
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        json.dump(data, f); tmp = pathlib.Path(f.name)
    try:
        r = subprocess.run(["node", "dist/cli/validate.js", str(tmp)],
                           cwd=skill_root, capture_output=True, text=True, timeout=10)
        return {"score": 1.0 if r.returncode == 0 else 0.0,
                "reason": "valid" if r.returncode == 0 else r.stderr}
    finally:
        tmp.unlink(missing_ok=True)
```
Note the validator's *built* path (`dist/...`), not the source `.ts` — the eval
runs against what the build produces. Resolve this at scaffold time and write it
into the conftest startup check so a missing build fails fast with a clear message.

## pyproject defaults
```toml
[tool.pytest.ini_options]
addopts = ["-ra", "--tb=short", "-p", "no:cacheprovider"]
# if/when a judge layer is added: also add  "-m", "not live"
```

## Regression test = the teeth
Pair every metric with a `*_regression.py` that feeds planted-broken input and
asserts a failing score plus a reason that names the defect. Watch one trap:
`"field" in reason.lower()` is false when the reason capitalizes the field — match
case-insensitively or assert on the lowercased reason.

## Goldens: generate from the schema
Same rule as everywhere — generate `expected/` from the live schema/validator,
regenerate in AUDIT. Hand-typed goldens are the single most common source of an
eval that fails correct output.

## Don't lose the source
Gitignore `results/`, `.venv/`, `__pycache__/`, `.pytest_cache/` — but NOT the
source. After scaffolding, run `git status` and confirm every `.py` under
`evals/` is tracked. Commit before the first run. (The reference impl's source
was orphaned next to its gitignored dirs and had to be recovered from bytecode.)
