"""Infrastructure unit tests — no network, no live marker.

Tests:
  - _reporter: record → aggregate → summary counts; _percentile edge cases;
    criteria persisted in artifact dict.
  - _json_extraction.extract_plan_json: fenced block, raw JSON, garbage.
  - litellm_judge.build_judge: ConfigurationError when env empty; model name
    starts with "openai/" when env is set.
  - runner.build_system_prompt: non-empty, contains skill name, deterministic
    hash across two calls.
"""

import importlib
import json
import os
import sys
from pathlib import Path

import pytest


# ---------------------------------------------------------------------------
# _reporter tests
# ---------------------------------------------------------------------------


def _make_collector():
    """Return a fresh ScorecardCollector (import inside function to avoid
    conftest interaction at module-import time)."""
    from _reporter import ScorecardCollector
    return ScorecardCollector()


def test_reporter_summary_counts():
    """record → aggregate → summary: passed/failed counts are accurate."""
    col = _make_collector()

    # 2 passed, 1 failed
    col.record_metric(
        nodeid="test_a",
        name="metric_a",
        score=0.95,
        threshold=0.8,
        passed=True,
        dimension="completeness",
        persona="pm",
        scenario="perfect-assess",
        reason="All good",
        criteria="some criteria text",
    )
    col.record_metric(
        nodeid="test_b",
        name="metric_b",
        score=0.75,
        threshold=0.8,
        passed=False,
        dimension="completeness",
        persona="pm",
        scenario="perfect-assess",
        reason="Score too low",
        criteria=None,
    )
    col.record_metric(
        nodeid="test_c",
        name="metric_c",
        score=1.0,
        threshold=1.0,
        passed=True,
        dimension="pitfalls",
        persona="engineer",
        scenario="perfect-convert",
        reason=None,
        criteria="another criteria",
    )

    report = col.aggregate()
    summary = report["summary"]

    assert summary["total"] == 3
    assert summary["passed"] == 2
    assert summary["failed"] == 1
    assert "metric_b" in summary["below_threshold"]


def test_reporter_criteria_persisted_in_artifact():
    """criteria field must appear in the metric record inside the JSON artifact."""
    col = _make_collector()

    col.record_metric(
        nodeid="test_x",
        name="metric_x",
        score=0.9,
        threshold=0.8,
        passed=True,
        dimension="completeness",
        persona="pm",
        scenario="perfect-assess",
        criteria="Judge on these specific rules: ...",
    )

    report = col.aggregate()
    metric_record = report["metrics"][0]

    assert "criteria" in metric_record
    assert metric_record["criteria"] == "Judge on these specific rules: ..."


def test_reporter_criteria_none_when_not_provided():
    """criteria defaults to None when not passed to record_metric."""
    col = _make_collector()

    col.record_metric(
        nodeid="test_y",
        name="metric_y",
        score=0.9,
        threshold=0.8,
        passed=True,
        dimension="completeness",
        persona="pm",
        scenario="perfect-assess",
    )

    report = col.aggregate()
    assert report["metrics"][0]["criteria"] is None


def test_reporter_percentile_edge_cases():
    """_percentile handles empty list and single-element list gracefully."""
    from _reporter import _percentile

    assert _percentile([], 0.5) is None
    assert _percentile([42.0], 0.5) == 42.0
    assert _percentile([42.0], 0.0) == 42.0
    assert _percentile([42.0], 1.0) == 42.0


def test_reporter_percentile_interpolation():
    """_percentile interpolates correctly for a two-element list."""
    from _reporter import _percentile

    values = [0.0, 10.0]
    assert _percentile(values, 0.0) == 0.0
    assert _percentile(values, 1.0) == 10.0
    # p50 of [0, 10] should be 5.0
    assert _percentile(values, 0.5) == pytest.approx(5.0)


# ---------------------------------------------------------------------------
# _json_extraction tests
# ---------------------------------------------------------------------------


def test_json_extraction_fenced_block():
    """extract_plan_json extracts JSON from a fenced ```json ... ``` block."""
    from metrics._json_extraction import extract_plan_json

    response = (
        "Here is the plan:\n\n"
        "```json\n"
        '{"suiteName": "Suite", "tests": []}\n'
        "```\n"
    )
    result = extract_plan_json(response)
    assert result["suiteName"] == "Suite"
    assert result["tests"] == []


def test_json_extraction_raw_json():
    """extract_plan_json handles a response that is raw JSON with no fence."""
    from metrics._json_extraction import extract_plan_json

    raw = '{"suiteName": "Raw", "tests": [{"name": "t1"}]}'
    result = extract_plan_json(raw)
    assert result["suiteName"] == "Raw"
    assert len(result["tests"]) == 1


def test_json_extraction_garbage_raises():
    """extract_plan_json raises PlanExtractionError on unparseable input."""
    from metrics._json_extraction import PlanExtractionError, extract_plan_json

    with pytest.raises(PlanExtractionError):
        extract_plan_json("This is just plain text with no JSON at all.")


def test_json_extraction_empty_raises():
    """extract_plan_json raises PlanExtractionError on empty input."""
    from metrics._json_extraction import PlanExtractionError, extract_plan_json

    with pytest.raises(PlanExtractionError):
        extract_plan_json("")


# ---------------------------------------------------------------------------
# litellm_judge.build_judge tests
# ---------------------------------------------------------------------------


def _reset_judge_module():
    """Force a fresh import of litellm_judge so the module-level cache is cleared."""
    mod_name = "litellm_judge"
    if mod_name in sys.modules:
        del sys.modules[mod_name]
    # Re-import so the new import has a clear _judge_instance = None
    import litellm_judge  # noqa: F401


def test_build_judge_raises_configuration_error_when_env_empty(monkeypatch):
    """build_judge must raise ConfigurationError when env vars are absent."""
    _reset_judge_module()

    monkeypatch.delenv("LITELLM_BASE_URL", raising=False)
    monkeypatch.delenv("LITELLM_API_KEY", raising=False)
    monkeypatch.delenv("JUDGE_MODEL_ALIAS", raising=False)

    # After reset, import fresh and test
    _reset_judge_module()
    from litellm_judge import ConfigurationError, build_judge

    with pytest.raises(ConfigurationError):
        build_judge()


def test_build_judge_model_name_starts_with_openai_prefix(monkeypatch):
    """build_judge must return a model whose name starts with 'openai/' when
    all required env vars are set."""
    _reset_judge_module()

    monkeypatch.setenv("LITELLM_BASE_URL", "http://localhost:4000")
    monkeypatch.setenv("LITELLM_API_KEY", "sk-dummy")
    monkeypatch.setenv("JUDGE_MODEL_ALIAS", "my-model")

    _reset_judge_module()
    from litellm_judge import build_judge

    judge = build_judge()
    # DeepEval's LiteLLMModel stores the model identifier in .name
    # (set via DeepEvalBaseLLM.__init__); .model is not the right attribute.
    assert judge.name.startswith("openai/"), (
        f"Expected model name to start with 'openai/', got: {judge.name!r}"
    )

    # Clean up: reset again so other tests see a clean state
    _reset_judge_module()


# ---------------------------------------------------------------------------
# runner.build_system_prompt tests
# ---------------------------------------------------------------------------


def test_build_system_prompt_non_empty_and_contains_skill_name():
    """build_system_prompt must return a non-empty prompt referencing the skill."""
    from runner import build_system_prompt

    prompt, hashes = build_system_prompt()

    assert isinstance(prompt, str)
    assert len(prompt) > 100, "System prompt is suspiciously short"
    # The skill name should appear somewhere in the prompt
    assert "ac-to-playwright" in prompt.lower() or "playwright" in prompt.lower(), (
        "Expected skill name 'playwright' in system prompt"
    )


def test_build_system_prompt_hashes_are_deterministic():
    """build_system_prompt must produce the same hashes across two calls
    (verifies that hash computation is content-based, not time-based)."""
    from runner import build_system_prompt

    _, hashes_a = build_system_prompt()
    _, hashes_b = build_system_prompt()

    assert hashes_a["prompt_hash"] == hashes_b["prompt_hash"]
    assert hashes_a["skill_md_hash"] == hashes_b["skill_md_hash"]
    assert hashes_a["references_hash"] == hashes_b["references_hash"]


def test_build_system_prompt_returns_all_hash_keys():
    """build_system_prompt hashes dict must contain all expected keys."""
    from runner import build_system_prompt

    _, hashes = build_system_prompt()

    assert "prompt_hash" in hashes
    assert "skill_md_hash" in hashes
    assert "references_hash" in hashes
    # Hashes should be non-empty strings
    for key, val in hashes.items():
        assert isinstance(val, str) and len(val) > 0, f"{key} is empty"
