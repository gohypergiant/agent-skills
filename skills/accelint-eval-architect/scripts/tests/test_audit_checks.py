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

def test_sentinel_catches_trailing_zeros_and_annotated_defaults(tmp_path):
    d = _make_eval_dir(tmp_path)
    (d / "metrics" / "m1.py").write_text("t = Metric(threshold=0.00)\n", encoding="utf-8")
    (d / "metrics" / "m2.py").write_text(
        "def __init__(self, threshold: float = 0.0):\n    pass\n", encoding="utf-8"
    )
    findings = audit_checks.check_sentinel_thresholds(d)
    evidence = " ".join(f["evidence"] for f in findings)
    assert "m1.py" in evidence, "0.00 must be caught, not just 0.0"
    assert "m2.py" in evidence, "annotated default `threshold: float = 0.0` must be caught"


def test_gitignore_node_harness_not_asked_for_pycache(tmp_path):
    d = tmp_path / "evals"
    (d / "metrics").mkdir(parents=True)
    (d / "tests").mkdir()
    (d / "metrics" / "metric.ts").write_text("export const m = 1\n", encoding="utf-8")
    (d / ".gitignore").write_text("results/\nnode_modules/\n", encoding="utf-8")
    assert audit_checks.check_gitignore(d) == [], \
        "a Node-only harness must not be asked to ignore __pycache__/"


def test_regression_tests_found_in_subdirs(tmp_path):
    d = _make_eval_dir(tmp_path)
    (d / "metrics" / "nested_metric.py").write_text("class Nested: ...\n", encoding="utf-8")
    sub = d / "tests" / "retrieval"
    sub.mkdir()
    sub.joinpath("test_nested_regression.py").write_text(
        "from metrics.nested_metric import Nested\n", encoding="utf-8"
    )
    assert audit_checks.check_regression_per_metric(d) == [], \
        "regression tests in tests/ subdirectories must count"

def test_substring_stem_does_not_satisfy_regression_check(tmp_path):
    d = _make_eval_dir(tmp_path)
    # recall.py must NOT ride free on a test that only references recall_at_k.
    (d / "metrics" / "recall.py").write_text("class Recall: ...\n", encoding="utf-8")
    (d / "metrics" / "recall_at_k.py").write_text("class RecallAtK: ...\n", encoding="utf-8")
    (d / "tests" / "test_ratk_regression.py").write_text(
        "from metrics.recall_at_k import RecallAtK\n", encoding="utf-8"
    )
    findings = audit_checks.check_regression_per_metric(d)
    assert len(findings) == 1
    assert "recall.py" in findings[0]["evidence"]


def test_metrics_in_subdirs_are_checked(tmp_path):
    d = _make_eval_dir(tmp_path)
    sub = d / "metrics" / "retrieval"
    sub.mkdir()
    (sub / "ndcg.py").write_text("class NDCG: ...\n", encoding="utf-8")
    findings = audit_checks.check_regression_per_metric(d)
    assert len(findings) == 1
    assert "ndcg" in findings[0]["evidence"]


def test_regression_dir_layout_counts(tmp_path):
    d = _make_eval_dir(tmp_path)
    (d / "metrics" / "cov.py").write_text("class Cov: ...\n", encoding="utf-8")
    sub = d / "tests" / "regression"
    sub.mkdir()
    (sub / "test_cov.py").write_text("from metrics.cov import Cov\n", encoding="utf-8")
    assert audit_checks.check_regression_per_metric(d) == [], \
        "tests/regression/*.py must count as regression coverage"


def test_sentinel_catches_object_literal_and_dict_thresholds(tmp_path):
    d = _make_eval_dir(tmp_path)
    (d / "metrics" / "opts.ts").write_text(
        "const m = makeMetric({ threshold: 0.0 })\n", encoding="utf-8"
    )
    (d / "metrics" / "cfg.py").write_text('CONFIG = {"threshold": 0.0}\n', encoding="utf-8")
    findings = audit_checks.check_sentinel_thresholds(d)
    evidence = " ".join(f["evidence"] for f in findings)
    assert "opts.ts" in evidence, "object-literal threshold: 0.0 must be caught"
    assert "cfg.py" in evidence, 'dict "threshold": 0.0 must be caught'


def test_stale_model_alias_matching_no_finding(tmp_path, monkeypatch):
    """When current env matches recorded aliases, no finding."""
    d = _make_eval_dir(tmp_path)
    results = d / "results"
    results.mkdir()
    (results / "run-20260707T120000.json").write_text(
        '{"schema_version":1,"judge_model_alias":"gpt-4","sut_model_id":"claude-sonnet-4",'
        '"metrics":[{"name":"quality","score":0.9,"threshold":0.8}]}',
        encoding="utf-8"
    )
    monkeypatch.setenv("JUDGE_MODEL_ALIAS", "gpt-4")
    monkeypatch.setenv("SUT_MODEL_ID", "claude-sonnet-4")
    findings = audit_checks.check_stale_calibration_model(d)
    assert findings == [], "matching aliases should produce no finding"


def test_stale_model_alias_mismatch_high_finding(tmp_path, monkeypatch):
    """When env differs from recorded, HIGH finding."""
    d = _make_eval_dir(tmp_path)
    results = d / "results"
    results.mkdir()
    (results / "run-20260707T120000.json").write_text(
        '{"schema_version":1,"judge_model_alias":"gpt-4","sut_model_id":"claude-sonnet-4",'
        '"metrics":[{"name":"quality","score":0.9,"threshold":0.8}]}',
        encoding="utf-8"
    )
    monkeypatch.setenv("JUDGE_MODEL_ALIAS", "gpt-4o")
    monkeypatch.setenv("SUT_MODEL_ID", "claude-opus-4")
    findings = audit_checks.check_stale_calibration_model(d)
    assert len(findings) == 1
    assert findings[0]["severity"] == "HIGH"
    assert "gpt-4" in findings[0]["evidence"]
    assert "gpt-4o" in findings[0]["evidence"]


def test_stale_model_alias_record_only_no_finding(tmp_path, monkeypatch):
    """When all thresholds are record-only (0.0), no tripwire needed."""
    d = _make_eval_dir(tmp_path)
    results = d / "results"
    results.mkdir()
    (results / "run-20260707T120000.json").write_text(
        '{"schema_version":1,"judge_model_alias":"gpt-4","sut_model_id":"claude-sonnet-4",'
        '"metrics":[{"name":"quality","score":0.9,"threshold":0.0}]}',
        encoding="utf-8"
    )
    monkeypatch.setenv("JUDGE_MODEL_ALIAS", "gpt-4o")
    monkeypatch.setenv("SUT_MODEL_ID", "claude-opus-4")
    findings = audit_checks.check_stale_calibration_model(d)
    assert findings == [], "record-only thresholds don't trigger tripwire"


def test_stale_model_alias_env_unset_low_finding(tmp_path, monkeypatch):
    """When env vars unset, LOW informational."""
    d = _make_eval_dir(tmp_path)
    results = d / "results"
    results.mkdir()
    (results / "run-20260707T120000.json").write_text(
        '{"schema_version":1,"judge_model_alias":"gpt-4","sut_model_id":"claude-sonnet-4",'
        '"metrics":[{"name":"quality","score":0.9,"threshold":0.8}]}',
        encoding="utf-8"
    )
    monkeypatch.delenv("JUDGE_MODEL_ALIAS", raising=False)
    monkeypatch.delenv("SUT_MODEL_ID", raising=False)
    findings = audit_checks.check_stale_calibration_model(d)
    assert len(findings) == 1
    assert findings[0]["severity"] == "LOW"


def test_stale_rubric_no_recorded_hash_no_finding(tmp_path):
    """When no rubric hashes are recorded, no finding."""
    d = _make_eval_dir(tmp_path)
    results = d / "results"
    results.mkdir()
    (results / "run-20260707T120000.json").write_text(
        '{"schema_version":1,"metrics":[{"name":"quality","threshold":0.8}]}',
        encoding="utf-8"
    )
    (d / "metrics" / "quality.py").write_text(
        'RUBRIC_HASH = "abc123def4567890"\n', encoding="utf-8"
    )
    findings = audit_checks.check_stale_calibration_rubric(d)
    assert findings == [], "no recorded rubric_hash should produce no finding"


def test_stale_rubric_hash_matching_no_finding(tmp_path):
    """When current rubric hash matches recorded, no finding."""
    d = _make_eval_dir(tmp_path)
    results = d / "results"
    results.mkdir()
    (results / "run-20260707T120000.json").write_text(
        '{"schema_version":2,"metrics":[{"name":"quality","rubric_hash":"abc123def4567890","rubric_source":"metrics/quality.py"}]}',
        encoding="utf-8"
    )
    (d / "metrics" / "quality.py").write_text(
        'RUBRIC_HASH = "abc123def4567890"\n', encoding="utf-8"
    )
    findings = audit_checks.check_stale_calibration_rubric(d)
    assert findings == [], "matching rubric hash should produce no finding"


def test_stale_rubric_hash_mismatch_high_finding(tmp_path):
    """When rubric hash changes, HIGH finding."""
    d = _make_eval_dir(tmp_path)
    results = d / "results"
    results.mkdir()
    (results / "run-20260707T120000.json").write_text(
        '{"schema_version":2,"metrics":[{"name":"quality","rubric_hash":"abc123def4567890","rubric_source":"metrics/quality.py"}]}',
        encoding="utf-8"
    )
    # Valid hex, deliberately different from the recorded hash.
    (d / "metrics" / "quality.py").write_text(
        'RUBRIC_HASH = "9876fedcba054321"\n', encoding="utf-8"
    )
    findings = audit_checks.check_stale_calibration_rubric(d)
    assert len(findings) == 1
    assert findings[0]["severity"] == "HIGH"
    assert "abc123def4567890" in findings[0]["evidence"]
    assert "9876fedcba054321" in findings[0]["evidence"]


def test_stale_rubric_unverifiable_medium_finding(tmp_path):
    """A recorded rubric_hash whose source has no valid 16-hex literal (here:
    non-hex chars) must fire MEDIUM — silence is the tripwire dying unnoticed."""
    d = _make_eval_dir(tmp_path)
    results = d / "results"
    results.mkdir()
    (results / "run-20260707T120000.json").write_text(
        '{"schema_version":2,"metrics":[{"name":"quality","rubric_hash":"abc123def4567890","rubric_source":"metrics/quality.py"}]}',
        encoding="utf-8"
    )
    (d / "metrics" / "quality.py").write_text(
        'RUBRIC_HASH = "xyz987fedcba6543"\n', encoding="utf-8"  # x/y/z: not hex
    )
    findings = audit_checks.check_stale_calibration_rubric(d)
    assert len(findings) == 1
    assert findings[0]["severity"] == "MEDIUM"
    assert "metrics/quality.py" in findings[0]["evidence"]
    assert "abc123def4567890" in findings[0]["evidence"]


def test_computed_rubric_hash_fires_unverifiable_medium(tmp_path):
    """A computed RUBRIC_HASH expression is unverifiable by grep — it must fire
    the MEDIUM finding, not pass silently (the old zero-findings behavior was
    the bug this branch exists to fix)."""
    d = _make_eval_dir(tmp_path)
    results = d / "results"
    results.mkdir()
    (results / "run-20260707T120000.json").write_text(
        '{"schema_version":2,"metrics":[{"name":"bad_metric","rubric_hash":"abc123def4567890","rubric_source":"metrics/bad_metric.py"}]}',
        encoding="utf-8"
    )
    (d / "metrics" / "bad_metric.py").write_text(
        '''import hashlib
_STEPS = ["step 1", "step 2"]
RUBRIC_HASH = hashlib.sha256("\\n".join(_STEPS).encode()).hexdigest()[:16]
''',
        encoding="utf-8"
    )
    findings = audit_checks.check_stale_calibration_rubric(d)
    assert len(findings) == 1
    assert findings[0]["severity"] == "MEDIUM"
    assert "bad_metric.py" in findings[0]["evidence"]


def test_stale_rubric_missing_source_file_fires_unverifiable_medium(tmp_path):
    """rubric_source pointing at a nonexistent file must fire MEDIUM too."""
    d = _make_eval_dir(tmp_path)
    results = d / "results"
    results.mkdir()
    (results / "run-20260707T120000.json").write_text(
        '{"schema_version":2,"metrics":[{"name":"gone","rubric_hash":"abc123def4567890","rubric_source":"metrics/deleted_metric.py"}]}',
        encoding="utf-8"
    )
    findings = audit_checks.check_stale_calibration_rubric(d)
    assert len(findings) == 1
    assert findings[0]["severity"] == "MEDIUM"
    assert "deleted_metric.py" in findings[0]["evidence"]


def test_stale_rubric_placeholder_literal_fires_unverifiable_medium(tmp_path):
    """The scaffold placeholder 0000000000000000 is valid hex — it must NOT
    satisfy the tripwire, even when the artifact recorded the same placeholder."""
    d = _make_eval_dir(tmp_path)
    results = d / "results"
    results.mkdir()
    (results / "run-20260707T120000.json").write_text(
        '{"schema_version":2,"metrics":[{"name":"quality","rubric_hash":"0000000000000000","rubric_source":"metrics/quality.py"}]}',
        encoding="utf-8"
    )
    (d / "metrics" / "quality.py").write_text(
        'RUBRIC_HASH = "0000000000000000"\n', encoding="utf-8"
    )
    findings = audit_checks.check_stale_calibration_rubric(d)
    assert len(findings) == 1
    assert findings[0]["severity"] == "MEDIUM"
    assert "metrics/quality.py" in findings[0]["evidence"]


def test_geval_both_kwargs_high_finding(tmp_path):
    d = _make_eval_dir(tmp_path)
    (d / "metrics" / "judge_metric.py").write_text(
        'class M(GEval):\n'
        '    def __init__(self, judge):\n'
        '        super().__init__(name="M", criteria="c",\n'
        '                         evaluation_steps=["s"], model=judge)\n',
        encoding="utf-8"
    )
    findings = audit_checks.check_geval_criteria_and_steps(d)
    assert len(findings) == 1
    assert findings[0]["severity"] == "HIGH"
    assert "judge_metric.py" in findings[0]["evidence"]


def test_geval_steps_only_no_finding(tmp_path):
    d = _make_eval_dir(tmp_path)
    (d / "metrics" / "judge_metric.py").write_text(
        'class M(GEval):\n'
        '    def __init__(self, judge):\n'
        '        super().__init__(name="M", evaluation_steps=["s"], model=judge)\n',
        encoding="utf-8"
    )
    assert audit_checks.check_geval_criteria_and_steps(d) == []


def test_scale_restated_medium_finding(tmp_path):
    d = _make_eval_dir(tmp_path)
    (d / "metrics" / "m1.py").write_text(
        'STEPS = ["Assign a score from 0 (poor) to 1 (excellent)."]\n', encoding="utf-8"
    )
    # Split across implicit string concatenation — must still be caught.
    (d / "metrics" / "m2.py").write_text(
        'STEPS = ["Assign a score from 0 (poor) "\n         "to 1 (excellent)."]\n',
        encoding="utf-8"
    )
    # 0-10 scale is GEval's own convention — must NOT be flagged.
    (d / "metrics" / "m3.py").write_text(
        'STEPS = ["Assign a score from 0 to 10."]\n', encoding="utf-8"
    )
    findings = audit_checks.check_scale_restated_in_steps(d)
    files = " ".join(f["evidence"] for f in findings)
    assert "m1.py" in files
    assert "m2.py" in files, "scale split across concatenated strings must be caught"
    assert "m3.py" not in files, "0-10 (GEval's own scale) must not be flagged"
    assert all(f["severity"] == "MEDIUM" for f in findings)


def test_dangling_fixture_path_medium_finding(tmp_path):
    d = _make_eval_dir(tmp_path)
    (d / "conftest.py").write_text(
        'FIXTURES = ["MISSING-AC.feature", "present.yaml"]\n'
        'GLOB = "results/run-*.json"\n',
        encoding="utf-8"
    )
    (d / "present.yaml").write_text("x: 1\n", encoding="utf-8")
    findings = audit_checks.check_dangling_fixture_paths(d)
    assert len(findings) == 1
    assert findings[0]["severity"] == "MEDIUM"
    assert "MISSING-AC.feature" in findings[0]["evidence"]


def test_fixture_path_resolving_anywhere_in_target_no_finding(tmp_path):
    d = _make_eval_dir(tmp_path)
    # Fixture lives OUTSIDE evals/, elsewhere in the target — still resolves.
    assets = tmp_path / "assets" / "evals"
    assets.mkdir(parents=True)
    (assets / "PERFECT-AC.feature").write_text("Feature: x\n", encoding="utf-8")
    (d / "conftest.py").write_text(
        'FIXTURES = ["PERFECT-AC.feature"]\nREL = "assets/evals/PERFECT-AC.feature"\n',
        encoding="utf-8"
    )
    assert audit_checks.check_dangling_fixture_paths(d) == []


def test_tmp_path_created_fixture_not_flagged(tmp_path):
    """Literals joined onto tmp_path are created at runtime — not dangling."""
    d = _make_eval_dir(tmp_path)
    (d / "tests" / "test_x_regression.py").write_text(
        'def test_x(tmp_path):\n'
        '    ac_path = tmp_path / "runtime-only.feature"\n'
        '    ac_path.write_text("Feature: x")\n',
        encoding="utf-8"
    )
    assert audit_checks.check_dangling_fixture_paths(d) == []
