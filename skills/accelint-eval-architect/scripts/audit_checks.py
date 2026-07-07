#!/usr/bin/env python3
"""Mechanical subset of the eval-decay audit (references/audit.md).

Runs the checks that need no judgment — #2 regression-per-metric, #3 sentinel
thresholds, #7 untracked source, #8 gitignore coverage, #11 stale calibration
(model), #12 stale calibration (rubric) — so every audit applies them identically.
The judgment checks (#1 stale goldens, #5 scenario coverage, #6 rubric-vs-correct-behavior)
remain agent work.

Usage:
  audit_checks.py <evals_dir>

Exit codes: 1 if any HIGH finding, else 0.
"""

from __future__ import annotations

import argparse
import hashlib
import os
import re
import subprocess
import sys
from pathlib import Path

from _results import get_latest_run

# Exact path segments (matched against Path.parts), not substrings — a
# substring test hid real source like tests/test_results/foo.py.
_IGNORED_SEGMENTS = ("results", ".venv", "__pycache__", ".pytest_cache", "node_modules")
# Matches 0.0 with any number of trailing zeros (0.0, 0.00, …), annotated
# defaults (`threshold: float = 0.0` / `threshold: number = 0.0`), and
# dict/object-literal forms (`{ threshold: 0.0 }` / `"threshold": 0.0`).
_SENTINEL_RE = re.compile(
    r"threshold\s*(?::\ s*[\w.\[\]]+\s*)?=\s*0\.0+\b"
    r"|[\"']?threshold[\"']?\s*:\s*0\.0+\b"
    r"|record[-_]only",
    re.IGNORECASE,
)


def _finding(severity: str, check: str, evidence: str, fix: str) -> dict:
    return {"severity": severity, "check": check, "evidence": evidence, "fix": fix}


def _regression_files(tests_dir: Path):
    """Regression tests live as *regression* filenames OR under a regression/ dir."""
    for p in tests_dir.rglob("*"):
        if not p.is_file():
            continue
        rel_parts = p.relative_to(tests_dir).parts
        if "regression" in p.name or any("regression" in part for part in rel_parts[:-1]):
            yield p


def check_regression_per_metric(evals_dir: Path) -> list[dict]:
    """#2: every metric module must be referenced by some *regression* test."""
    findings: list[dict] = []
    metrics_dir = evals_dir / "metrics"
    tests_dir = evals_dir / "tests"
    if not metrics_dir.is_dir():
        return findings
    regression_text = "".join(
        p.read_text(encoding="utf-8", errors="replace") for p in _regression_files(tests_dir)
    ) if tests_dir.is_dir() else ""
    # rglob: metrics organized in subdirs (metrics/retrieval/ndcg.py) count too.
    for metric in sorted(p for p in metrics_dir.rglob("*") if p.is_file()):
        if metric.suffix not in (".py", ".ts") or metric.name.startswith("_"):
            continue
        # Word-boundary match: a bare substring test lets `recall.py` ride free
        # on a test that only references `recall_at_k`.
        if not re.search(rf"\b{re.escape(metric.stem)}\b", regression_text):
            findings.append(_finding(
                "HIGH", "regression-per-metric",
                f"{metric.relative_to(evals_dir)} is not referenced by any regression test",
                f"Add a planted-broken regression test that drives {metric.stem} below threshold.",
            ))
    return findings


def check_sentinel_thresholds(evals_dir: Path) -> list[dict]:
    """#3: thresholds still at 0.0 / record-only are uncalibrated."""
    findings: list[dict] = []
    for sub in ("metrics", "tests"):
        d = evals_dir / sub
        if not d.is_dir():
            continue
        for f in sorted(d.rglob("*")):
            if not f.is_file() or f.suffix not in (".py", ".ts"):
                continue
            for i, line in enumerate(
                f.read_text(encoding="utf-8", errors="replace").splitlines(), 1
            ):
                if _SENTINEL_RE.search(line):
                    findings.append(_finding(
                        "MEDIUM", "sentinel-threshold",
                        f"{f.relative_to(evals_dir)}:{i}: {line.strip()[:90]}",
                        "Review: run the baseline loop (suggest_thresholds.py) and commit a "
                        "real threshold — record-only is a stage, not a destination.",
                    ))
    return findings


def check_untracked_source(evals_dir: Path) -> list[dict]:
    """#7: eval SOURCE sitting untracked next to gitignored dirs is one git clean from gone."""
    try:
        out = subprocess.run(
            ["git", "status", "--porcelain", "--", str(evals_dir)],
            cwd=evals_dir, capture_output=True, text=True, timeout=10,
        )
    except (FileNotFoundError, subprocess.TimeoutExpired) as e:
        return [_finding("LOW", "untracked-source",
                         f"could not run git status: {e}",
                         "Verify manually that all eval source is committed.")]
    if out.returncode != 0:
        return [_finding("LOW", "untracked-source",
                         f"git status failed: {out.stderr.strip()[:120]}",
                         "Verify manually that all eval source is committed.")]
    findings: list[dict] = []
    for line in out.stdout.splitlines():
        if not line.startswith("??"):
            continue
        path = line[3:].strip()
        if Path(path).name == ".env" or any(seg in Path(path).parts for seg in _IGNORED_SEGMENTS):
            continue
        findings.append(_finding(
            "HIGH", "untracked-source",
            f"untracked: {path}",
            "git add + commit before the next run — orphaned eval source has "
            "previously required bytecode recovery.",
        ))
    return findings


def check_gitignore(evals_dir: Path) -> list[dict]:
    """#8: run artifacts and venvs must be ignored (and never the source)."""
    gi = evals_dir / ".gitignore"
    if not gi.is_file():
        return [_finding("LOW", "gitignore",
                         f"no .gitignore in {evals_dir}",
                         "Add one covering results/, __pycache__/, .venv/ (or node_modules/).")]
    text = gi.read_text(encoding="utf-8", errors="replace")
    findings: list[dict] = []
    missing = [p for p in ("results/",) if p not in text]
    # __pycache__/ only applies to Python harnesses — demanding it of a Node
    # (vitest) eval is a false positive. Probe metrics/ and tests/ rather than
    # the whole tree so vendored .py files (node_modules, .venv) don't count.
    is_python = any(
        (evals_dir / d).is_dir() and any((evals_dir / d).rglob("*.py"))
        for d in ("metrics", "tests")
    )
    if is_python and "__pycache__/" not in text:
        missing.append("__pycache__/")
    if not any(p in text for p in (".venv/", "node_modules/")):
        missing.append(".venv/ or node_modules/")
    for p in missing:
        findings.append(_finding(
            "LOW", "gitignore",
            f".gitignore does not cover {p}",
            f"Add {p} so run artifacts never get committed as noise.",
        ))
    return findings


def check_stale_calibration_model(evals_dir: Path) -> list[dict]:
    """#11: thresholds calibrated against old model aliases are invalid."""
    findings: list[dict] = []
    results_dir = evals_dir / "results"
    if not results_dir.is_dir():
        return findings  # no runs yet; nothing to check

    latest = get_latest_run(results_dir)
    if not latest:
        return findings  # no parseable runs

    # Gate 1: Check for any non-record-only threshold (threshold > 0.0)
    has_live_threshold = any(
        isinstance(m, dict) and isinstance(m.get("threshold"), (int, float)) and m["threshold"] > 0.0
        for m in latest.get("metrics", [])
    )

    if not has_live_threshold:
        return findings  # all record-only; no tripwire needed yet

    # Gate 2: Check if env vars are set
    current_judge = os.getenv("JUDGE_MODEL_ALIAS")
    current_sut = os.getenv("SUT_MODEL_ID")

    if not current_judge or not current_sut:
        return [_finding(
            "LOW", "stale-calibration (model)",
            "JUDGE_MODEL_ALIAS or SUT_MODEL_ID not set in env; cannot verify model consistency",
            "Set both env vars to enable the recalibration tripwire (audit check #11).",
        )]

    # Gate 3: Compare recorded vs current models
    recorded_judge = latest.get("judge_model_alias", "<unknown>")
    recorded_sut = latest.get("sut_model_id", "<unknown>")

    if recorded_judge != current_judge or recorded_sut != current_sut:
        findings.append(_finding(
            "HIGH", "stale-calibration (model)",
            f"Thresholds calibrated against judge={recorded_judge} / sut={recorded_sut}, "
            f"but env now points to judge={current_judge} / sut={current_sut}",
            "Re-run the baseline loop (suggest_thresholds.py) and recalibrate. "
            "Thresholds are valid only for the model pair they were measured against.",
        ))

    return findings


def check_stale_calibration_rubric(evals_dir: Path) -> list[dict]:
    """#12: rubric edits invalidate thresholds like model changes do."""
    findings: list[dict] = []
    results_dir = evals_dir / "results"
    metrics_dir = evals_dir / "metrics"

    if not results_dir.is_dir() or not metrics_dir.is_dir():
        return findings

    latest = get_latest_run(results_dir)
    if not latest:
        return findings

    # Build map of recorded rubric hashes: rubric_source -> (metric_name, hash)
    recorded_by_source: dict[str, tuple[str, str]] = {}
    for m in latest.get("metrics", []):
        if isinstance(m, dict) and "rubric_hash" in m and "rubric_source" in m:
            # Use rubric_source as join key for exact matching
            recorded_by_source[m["rubric_source"]] = (m["name"], m["rubric_hash"])

    if not recorded_by_source:
        return findings  # no judge metrics recorded hashes; nothing to check

    # Read current metric files and compute their rubric hashes
    verified_sources: set[str] = set()
    for metric_file in metrics_dir.rglob("*.py"):
        if metric_file.name.startswith("_"):
            continue
        try:
            content = metric_file.read_text(encoding="utf-8")
        except OSError:
            continue

        # Extract RUBRIC_HASH constant if present
        match = re.search(r'RUBRIC_HASH\s*=\s*["\']([a-f0-9]{16})["\']', content)
        if not match:
            continue  # not a judge metric or hash not declared

        current_hash = match.group(1)
        if current_hash == "0000000000000000":
            # Scaffold placeholder is valid hex — without this carve-out an
            # artifact recording the placeholder would "match" and pass silently.
            continue  # falls through to the unverifiable MEDIUM below if recorded

        # Use relative path as rubric_source key for exact join
        rubric_source = str(metric_file.relative_to(evals_dir))

        if rubric_source in recorded_by_source:
            verified_sources.add(rubric_source)
            metric_name, recorded_hash = recorded_by_source[rubric_source]
            if recorded_hash != current_hash:
                findings.append(_finding(
                    "HIGH", "stale-calibration (rubric)",
                    f"Metric {metric_name}: rubric hash changed from {recorded_hash} to {current_hash}",
                    f"Rubric edit in {rubric_source} invalidates thresholds. "
                    "Re-run the baseline loop and recalibrate.",
                ))

    # Recorded-but-unverifiable: the artifact claims a rubric_hash for a source
    # that has no valid 16-hex RUBRIC_HASH literal (missing file, computed
    # expression, malformed literal, or the scaffold placeholder). Without this
    # branch the tripwire dies silently in exactly the case it exists for.
    for rubric_source in sorted(set(recorded_by_source) - verified_sources):
        metric_name, recorded_hash = recorded_by_source[rubric_source]
        findings.append(_finding(
            "MEDIUM", "stale-calibration (rubric)",
            f"Metric {metric_name}: run artifact records rubric_hash {recorded_hash} "
            f"for {rubric_source}, but no verifiable RUBRIC_HASH literal found there",
            f"Declare RUBRIC_HASH as a computed 16-hex string LITERAL in {rubric_source} "
            "(paired with its self-check test) — a computed-at-runtime, missing, or "
            "placeholder literal makes rubric drift undetectable.",
        ))

    return findings


def main() -> int:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    ap.add_argument("evals_dir", type=Path)
    args = ap.parse_args()

    evals_dir = args.evals_dir.resolve()
    if not evals_dir.is_dir():
        sys.exit(f"Evals dir not found: {evals_dir}")

    findings = (
        check_regression_per_metric(evals_dir)
        + check_sentinel_thresholds(evals_dir)
        + check_untracked_source(evals_dir)
        + check_gitignore(evals_dir)
        + check_stale_calibration_model(evals_dir)
        + check_stale_calibration_rubric(evals_dir)
    )

    counts = {"HIGH": 0, "MEDIUM": 0, "LOW": 0}
    for sev in ("HIGH", "MEDIUM", "LOW"):
        group = [f for f in findings if f["severity"] == sev]
        counts[sev] = len(group)
        if group:
            print(f"\n{sev} ({len(group)})")
            for f in group:
                print(f"  [{f['check']}] {f['evidence']}")
                print(f"      fix: {f['fix']}")

    print(f"\nSummary: {counts['HIGH']} high, {counts['MEDIUM']} medium, {counts['LOW']} low")
    if not findings:
        print(
            "No mechanical findings — judgment checks (#1, #5, #6 in "
            "references/audit.md) still apply."
        )
    return 1 if counts["HIGH"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
