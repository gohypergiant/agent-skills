#!/usr/bin/env python3
"""Mechanical subset of the eval-decay audit (references/audit.md).

Runs the checks that need no judgment — #2 regression-per-metric, #3 sentinel
thresholds, #7 untracked source, #8 gitignore coverage — so every audit applies
them identically. The judgment checks (#1 stale goldens, #5 scenario coverage,
#6 rubric-vs-correct-behavior) remain agent work.

Usage:
  audit_checks.py <evals_dir>

Exit codes: 1 if any HIGH finding, else 0.
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

# Exact path segments (matched against Path.parts), not substrings — a
# substring test hid real source like tests/test_results/foo.py.
_IGNORED_SEGMENTS = ("results", ".venv", "__pycache__", ".pytest_cache", "node_modules")
# Matches 0.0 with any number of trailing zeros (0.0, 0.00, …), annotated
# defaults (`threshold: float = 0.0` / `threshold: number = 0.0`), and
# dict/object-literal forms (`{ threshold: 0.0 }` / `"threshold": 0.0`).
_SENTINEL_RE = re.compile(
    r"threshold\s*(?::\s*[\w.\[\]]+\s*)?=\s*0\.0+\b"
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
