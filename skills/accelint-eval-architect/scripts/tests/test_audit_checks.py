"""Tests for audit_checks.py — the mechanical audit must itself have teeth."""

import shutil
import subprocess
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

import audit_checks  # noqa: E402


def _make_eval_dir(tmp_path: Path) -> Path:
    d = tmp_path / "evals"
    (d / "metrics").mkdir(parents=True)
    (d / "tests").mkdir()
    (d / "metrics" / "good_metric.py").write_text("class GoodMetric: ...\n", encoding="utf-8")
    (d / "tests" / "test_good_regression.py").write_text(
        "from metrics.good_metric import GoodMetric\n", encoding="utf-8"
    )
    (d / ".gitignore").write_text("results/\n__pycache__/\n.venv/\n", encoding="utf-8")
    return d


def test_orphan_metric_is_high_finding(tmp_path):
    d = _make_eval_dir(tmp_path)
    (d / "metrics" / "orphan_metric.py").write_text("class Orphan: ...\n", encoding="utf-8")
    findings = audit_checks.check_regression_per_metric(d)
    assert len(findings) == 1
    assert findings[0]["severity"] == "HIGH"
    assert "orphan_metric" in findings[0]["evidence"]


def test_covered_metric_no_finding(tmp_path):
    d = _make_eval_dir(tmp_path)
    assert audit_checks.check_regression_per_metric(d) == []


def test_sentinel_threshold_is_medium(tmp_path):
    d = _make_eval_dir(tmp_path)
    (d / "tests" / "test_judge.py").write_text(
        "metric = Metric(threshold=0.0)  # record-only\n", encoding="utf-8"
    )
    findings = audit_checks.check_sentinel_thresholds(d)
    assert findings and all(f["severity"] == "MEDIUM" for f in findings)


def test_gitignore_findings(tmp_path):
    d = _make_eval_dir(tmp_path)
    (d / ".gitignore").unlink()
    findings = audit_checks.check_gitignore(d)
    assert findings and findings[0]["severity"] == "LOW"
    (d / ".gitignore").write_text("results/\n__pycache__/\n.venv/\n", encoding="utf-8")
    assert audit_checks.check_gitignore(d) == []


@pytest.mark.skipif(shutil.which("git") is None, reason="git unavailable")
def test_untracked_source_is_high(tmp_path):
    # Throwaway repo INSIDE tmp_path — never the project worktree.
    subprocess.run(["git", "init", "-q", str(tmp_path)], check=True)
    d = _make_eval_dir(tmp_path)
    findings = audit_checks.check_untracked_source(d)
    highs = [f for f in findings if f["severity"] == "HIGH"]
    assert highs, "untracked eval source must be a HIGH finding"
    assert any("metrics" in f["evidence"] or "evals" in f["evidence"] for f in highs)


def test_clean_dir_exits_zero(tmp_path, monkeypatch, capsys):
    if shutil.which("git") is None:
        pytest.skip("git unavailable")
    subprocess.run(["git", "init", "-q", str(tmp_path)], check=True)
    d = _make_eval_dir(tmp_path)
    subprocess.run(["git", "-C", str(tmp_path), "add", "-A"], check=True)
    subprocess.run(
        ["git", "-C", str(tmp_path), "-c", "user.name=t", "-c", "user.email=t@t",
         "commit", "-qm", "x"],
        check=True,
    )
    monkeypatch.setattr(sys, "argv", ["audit_checks.py", str(d)])
    rc = audit_checks.main()
    out = capsys.readouterr().out
    assert rc == 0
    assert "No mechanical findings" in out
