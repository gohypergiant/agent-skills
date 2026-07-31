"""Tests for suggest_thresholds.py — suggestions must come from the data."""

import json
import statistics
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import suggest_thresholds  # noqa: E402


def _write_run(results: Path, idx: int, scores: dict[str, float]) -> None:
    results.mkdir(exist_ok=True)
    payload = {"metrics": [{"name": k, "score": v, "threshold": 0.0} for k, v in scores.items()]}
    (results / f"run-{idx:03d}.json").write_text(json.dumps(payload), encoding="utf-8")


def _run_main(argv: list[str], monkeypatch) -> int:
    monkeypatch.setattr(sys, "argv", ["suggest_thresholds.py", *argv])
    return suggest_thresholds.main()


def test_suggestions_match_distribution(tmp_path, monkeypatch, capsys):
    results = tmp_path / "results"
    judge_scores = [0.86, 0.91, 0.88]
    for i, js in enumerate(judge_scores):
        _write_run(results, i, {"faithfulness": js, "recall_at_k": 1.0})

    rc = _run_main(["--results", str(results)], monkeypatch)
    assert rc == 0
    out = capsys.readouterr().out
    assert "faithfulness" in out and "recall_at_k" in out

    expected_judge = max(0.0, statistics.fmean(judge_scores) - 2 * statistics.stdev(judge_scores))
    sugg = suggest_thresholds.suggest(judge_scores)
    assert abs(sugg["judge_style"] - expected_judge) <= 0.02
    # deterministic style for the stable 1.0 metric: min - 0.05 = 0.95
    assert suggest_thresholds.suggest([1.0, 1.0, 1.0])["deterministic_style"] == 0.95
    assert "LOW CONFIDENCE" not in out  # 3 runs meet the default min


def test_malformed_run_skipped(tmp_path, monkeypatch, capsys):
    results = tmp_path / "results"
    _write_run(results, 0, {"m": 0.9})
    _write_run(results, 1, {"m": 0.8})
    (results / "run-bad.json").write_text("{not json", encoding="utf-8")
    rc = _run_main(["--results", str(results)], monkeypatch)
    assert rc == 0
    assert "skipping malformed" in capsys.readouterr().err


def test_empty_dir_exit_2(tmp_path, monkeypatch):
    results = tmp_path / "results"
    results.mkdir()
    assert _run_main(["--results", str(results)], monkeypatch) == 2


def test_low_confidence_marker_single_run(tmp_path, monkeypatch, capsys):
    results = tmp_path / "results"
    _write_run(results, 0, {"m": 0.9})
    rc = _run_main(["--results", str(results)], monkeypatch)
    assert rc == 0
    assert "LOW CONFIDENCE" in capsys.readouterr().out
