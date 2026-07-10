#!/usr/bin/env python3
"""Suggest calibrated thresholds from a baseline of eval runs.

Implements steps 3-4 of the baseline loop in ``references/calibration.md``:
read the ``results/run-*.json`` artifacts a harness wrote, build the per-metric
score distribution, and print suggested thresholds WITH their evidence. The
human still commits the numbers — this script never edits anything.

Usage:
  suggest_thresholds.py --results <evals>/results [--metric name] [--min-runs 3]

Suggestion styles (pick per metric kind — see the caveats in the output):
  judge-style          max(0, mean - 2*stdev)   noisy judge metrics
  deterministic-style  max(0, min - 0.05)       stable quality ratios

Exit codes: 0 ok; 2 when the results dir has no parseable run files.
"""

from __future__ import annotations

import argparse
import statistics
import sys
from collections import defaultdict
from pathlib import Path

from _results import load_runs


def collect_scores(runs: list[dict], only_metric: str | None) -> dict[str, dict]:
    """Group scores by metric name. Returns name -> {scores, n_runs}."""
    by_name: dict[str, dict] = defaultdict(lambda: {"scores": [], "run_ids": set()})
    for run_idx, run in enumerate(runs):
        for m in run["metrics"]:
            if not isinstance(m, dict):
                continue
            name = m.get("name")
            score = m.get("score")
            # bool is excluded explicitly: isinstance(True, int) is True, and a
            # passed-flag leaking in as 1.00 silently skews the distribution.
            if name is None or isinstance(score, bool) or not isinstance(score, (int, float)):
                continue
            if only_metric and name != only_metric:
                continue
            by_name[name]["scores"].append(float(score))
            by_name[name]["run_ids"].add(run_idx)
    return by_name


def suggest(scores: list[float]) -> dict[str, float]:
    mean = statistics.fmean(scores)
    stdev = statistics.stdev(scores) if len(scores) >= 2 else 0.0
    return {
        "mean": round(mean, 2),
        "stdev": round(stdev, 2),
        "min": round(min(scores), 2),
        "max": round(max(scores), 2),
        "judge_style": round(max(0.0, mean - 2 * stdev), 2),
        "deterministic_style": round(max(0.0, min(scores) - 0.05), 2),
    }


def main() -> int:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    ap.add_argument("--results", required=True, type=Path, help="dir of run-*.json artifacts")
    ap.add_argument("--metric", default=None, help="only this metric name")
    ap.add_argument("--min-runs", type=int, default=3,
                    help="runs needed for full confidence (default 3)")
    args = ap.parse_args()

    if not args.results.is_dir():
        sys.exit(f"Results dir not found: {args.results}")
    runs = load_runs(args.results)
    if not runs:
        print(f"No parseable run-*.json files under {args.results}", file=sys.stderr)
        return 2

    by_name = collect_scores(runs, args.metric)
    if not by_name:
        print("No matching metric scores found in the runs.", file=sys.stderr)
        return 2

    header = (
        f"{'Metric':<28} {'n':>3} {'runs':>4} {'mean':>6} {'stdev':>6} "
        f"{'min':>6} {'judge':>7} {'determ':>7}"
    )
    print(f"Baseline: {len(runs)} run file(s) from {args.results}")
    print(header)
    print("-" * len(header))
    for name in sorted(by_name):
        info = by_name[name]
        s = suggest(info["scores"])
        n_runs = len(info["run_ids"])
        flag = f"  LOW CONFIDENCE (n_runs < {args.min_runs})" if n_runs < args.min_runs else ""
        print(
            f"{name:<28} {len(info['scores']):>3} {n_runs:>4} {s['mean']:>6.2f} "
            f"{s['stdev']:>6.2f} {s['min']:>6.2f} {s['judge_style']:>7.2f} "
            f"{s['deterministic_style']:>7.2f}{flag}"
        )

    print(
        "\nHow to choose (references/calibration.md):\n"
        "  - judge metrics are noisy -> use the judge-style column (mean - 2*stdev)\n"
        "  - deterministic quality ratios are stable -> use determ (min - 0.05)\n"
        "  - thresholds are valid only for the SUT+judge model pair measured;\n"
        "    recalibrate after any model upgrade\n"
        "  - the human commits the numbers; this script only suggests"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
