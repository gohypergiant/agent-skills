"""Shared loader for results/run-*.json artifacts with schema versioning.

Extracts and reuses the load_runs() logic from suggest_thresholds.py, extending
it to handle schema_version (introduced in v1 of the artifact format, now tracked
for forward compatibility). Readers can treat missing schema_version as v1.

Usage:
  from _results import load_runs
  runs = load_runs(results_dir)
  for run in runs:
      print(run["judge_model_alias"], run["sut_model_id"])
"""

from __future__ import annotations

import json
import sys
from pathlib import Path


def load_runs(results_dir: Path, *, warn_on_newer: bool = True) -> list[dict]:
    """Load all parseable run-*.json artifacts; warn-and-skip malformed ones.

    Args:
        results_dir: Path to directory containing run-*.json files
        warn_on_newer: If True, emit a warning when a run has schema_version > 2

    Returns:
        List of run dicts sorted by filename (chronological). Each dict has:
          - schema_version (int, default 1 if missing)
          - run_started_at (ISO timestamp)
          - judge_model_alias (str)
          - sut_model_id (str)
          - metrics (list of dicts with name/score/threshold/passed/dimension/reason)
          - summary (dict with total/passed/failed counts)
          - [v2+] per-metric rubric_hash (if present in metrics[N])

    Notes:
        - Schema v1 (implicit): original _reporter.py.template format
        - Schema v2: adds rubric_hash per judge metric + k-sample support
        - Newer schemas are tolerated with a warning; readers must handle
          missing new-era fields gracefully (no KeyError).
    """
    runs: list[dict] = []
    for path in sorted(results_dir.glob("run-*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as e:
            print(f"[warn] skipping malformed {path.name}: {e}", file=sys.stderr)
            continue
        if not isinstance(data, dict) or not isinstance(data.get("metrics"), list):
            print(f"[warn] skipping {path.name}: no metrics list", file=sys.stderr)
            continue

        # Default missing schema_version to 1 for backward compat with artifacts
        # written before schema versioning was added
        version = data.get("schema_version", 1)
        if not isinstance(version, int):
            print(
                f"[warn] skipping {path.name}: schema_version is {type(version).__name__}, "
                f"not int", file=sys.stderr
            )
            continue

        # Tolerate newer schemas with a warning — don't block; readers must handle
        # absent fields
        if warn_on_newer and version > 2:
            print(
                f"[warn] {path.name} has schema_version {version} (loader knows v1–v2); "
                f"proceeding with caution", file=sys.stderr
            )

        runs.append(data)

    return runs


def get_latest_run(results_dir: Path) -> dict | None:
    """Return the most recent run artifact (by filename sort), or None if empty.

    Filenames are run-<ISO-timestamp>.json, so lexicographic sort is chronological.
    """
    runs = load_runs(results_dir, warn_on_newer=False)
    return runs[-1] if runs else None
