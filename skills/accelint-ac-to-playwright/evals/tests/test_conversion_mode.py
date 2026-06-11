"""Test conversion mode (AC → JSON plan) with all metrics."""

import json
from pathlib import Path

import pytest
from deepeval.test_case import LLMTestCase

from metrics.goal_accuracy import GoalAccuracyMetric
from metrics.hallucinated_assertions import HallucinatedAssertionsMetric
from metrics.plan_semantic import PlanSemanticMetric
from metrics.plan_structural import PlanStructuralMetric
from metrics.target_coverage import TargetCoverageMetric
from metrics.task_completion import TaskCompletionMetric


# All tests in this file: Engineer translating fully-ready AC into tests.
_PERSONA = "engineer"
_SCENARIO = "perfect-convert"


@pytest.fixture
def perfect_ac_path(fixtures_dir):
    """Return path to PERFECT-AC.feature."""
    return fixtures_dir / "PERFECT-AC.feature"


@pytest.fixture
def perfect_ac_expected(expected_dir):
    """Load expected artifacts for PERFECT-AC."""
    import yaml

    plan_path = expected_dir / "PERFECT-AC.plan.json"
    assertions_path = expected_dir / "PERFECT-AC.assertions.yaml"

    with open(plan_path, "r", encoding="utf-8") as f:
        expected_plan = json.load(f)

    with open(assertions_path, "r", encoding="utf-8") as f:
        expected_assertions = yaml.safe_load(f)

    return {
        "plan": expected_plan,
        "assertions": expected_assertions,
    }


def test_perfect_ac_conversion_structural(perfect_ac_path, sut, record_metric):
    """Test structural validation on PERFECT-AC conversion."""
    result = sut(perfect_ac_path, "conversion")
    test_case = LLMTestCase(input=str(perfect_ac_path), actual_output=result["output"])

    metric = PlanStructuralMetric(threshold=1.0)
    score = metric.measure(test_case)

    record_metric(
        name="json_structural",
        score=score,
        threshold=metric.threshold,
        dimension="completeness",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
        criteria=getattr(metric, "criteria", None),
    )

    assert metric.is_successful(), (
        f"Structural validation failed: {metric.reason}\n"
        f"Full output length: {len(result['output'])} chars"
    )
    assert score == 1.0, f"Expected perfect score, got {score}"


def test_perfect_ac_conversion_target_coverage(
    perfect_ac_path, perfect_ac_expected, sut, record_metric
):
    """Test target coverage on PERFECT-AC conversion."""
    result = sut(perfect_ac_path, "conversion")
    must_have_targets = perfect_ac_expected["assertions"]["must_have_targets"]
    test_case = LLMTestCase(input=str(perfect_ac_path), actual_output=result["output"])

    metric = TargetCoverageMetric(must_have_targets=must_have_targets, threshold=1.0)
    score = metric.measure(test_case)

    record_metric(
        name="target_coverage",
        score=score,
        threshold=metric.threshold,
        dimension="completeness",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
        criteria=getattr(metric, "criteria", None),
    )

    assert metric.is_successful(), f"Target coverage failed: {metric.reason}"
    assert score >= 0.95, f"Expected >= 95% coverage, got {score:.2%}"


def test_perfect_ac_conversion_no_hallucinations(perfect_ac_path, sut, record_metric):
    """Test hallucination detection on PERFECT-AC conversion."""
    result = sut(perfect_ac_path, "conversion")
    test_case = LLMTestCase(input=str(perfect_ac_path), actual_output=result["output"])

    metric = HallucinatedAssertionsMetric(ac_source_path=perfect_ac_path, threshold=1.0)
    score = metric.measure(test_case)

    record_metric(
        name="hallucinations",
        score=score,
        threshold=metric.threshold,
        dimension="pitfalls",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
        criteria=getattr(metric, "criteria", None),
    )

    assert metric.is_successful(), f"Hallucinations detected: {metric.reason}"
    assert score == 1.0, f"Expected zero hallucinations, got score {score}"


@pytest.mark.live
def test_perfect_ac_conversion_task_completion(judge, perfect_ac_path, sut, record_metric):
    """Test task completion on PERFECT-AC conversion (GEval - costs money)."""
    result = sut(perfect_ac_path, "conversion")
    test_case = LLMTestCase(input=str(perfect_ac_path), actual_output=result["output"])

    metric = TaskCompletionMetric(judge_model=judge, mode="conversion", threshold=0.9)
    score = metric.measure(test_case)

    record_metric(
        name="task_completion",
        score=score,
        threshold=metric.threshold,
        dimension="completeness",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
        criteria=getattr(metric, "criteria", None),
    )

    assert metric.is_successful(), f"Task completion failed: {metric.reason}"
    assert score >= 0.9, f"Expected >= 90% completion, got {score:.2%}"


@pytest.mark.live
def test_perfect_ac_conversion_goal_accuracy(
    judge, perfect_ac_path, perfect_ac_expected, sut, record_metric
):
    """Test goal accuracy on PERFECT-AC conversion (GEval - costs money)."""
    result = sut(perfect_ac_path, "conversion")
    test_case = LLMTestCase(
        input=str(perfect_ac_path),
        actual_output=result["output"],
        expected_output=json.dumps(perfect_ac_expected["plan"], indent=2),
    )

    metric = GoalAccuracyMetric(
        judge_model=judge,
        mode="conversion",
        ac_source_path=perfect_ac_path,
        threshold=0.8,
    )
    score = metric.measure(test_case)

    record_metric(
        name="goal_accuracy",
        score=score,
        threshold=metric.threshold,
        dimension="completeness",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
        criteria=getattr(metric, "criteria", None),
    )

    assert metric.is_successful(), f"Goal accuracy failed: {metric.reason}"
    assert score >= 0.8, f"Expected >= 80% accuracy, got {score:.2%}"


@pytest.mark.live
def test_perfect_ac_conversion_semantic_quality(judge, perfect_ac_path, sut, record_metric):
    """Test semantic quality on PERFECT-AC conversion (GEval - costs money)."""
    result = sut(perfect_ac_path, "conversion")
    test_case = LLMTestCase(input=str(perfect_ac_path), actual_output=result["output"])

    metric = PlanSemanticMetric(
        judge_model=judge, ac_source_path=perfect_ac_path, threshold=0.8
    )
    score = metric.measure(test_case)

    record_metric(
        name="semantic_quality",
        score=score,
        threshold=metric.threshold,
        dimension="pitfalls",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
        criteria=getattr(metric, "criteria", None),
    )

    assert metric.is_successful(), f"Semantic quality failed: {metric.reason}"
    assert score >= 0.8, f"Expected >= 80% quality, got {score:.2%}"
