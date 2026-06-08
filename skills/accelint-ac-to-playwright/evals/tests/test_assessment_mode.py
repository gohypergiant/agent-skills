"""Test assessment mode (AC → report) with all metrics."""

from pathlib import Path

import pytest
from deepeval.test_case import LLMTestCase

from metrics.assessment_quality import AssessmentQualityMetric
from metrics.goal_accuracy import GoalAccuracyMetric
from metrics.task_completion import TaskCompletionMetric


# Assessment mode is the PM's workflow — reviewing AC for conversion readiness.
_PERSONA = "pm"


@pytest.fixture
def mixed_ac_path(fixtures_dir):
    """Return path to MIXED-AC-1.feature (one slice of the split mixed fixtures)."""
    return fixtures_dir / "MIXED-AC-1.feature"


@pytest.fixture
def bad_ac_path(fixtures_dir):
    """Return path to BAD-AC.feature (8 severe errors)."""
    return fixtures_dir / "BAD-AC.feature"


@pytest.fixture
def mixed_ac_expected_issues(expected_dir):
    """Load expected issues for MIXED-AC."""
    return expected_dir / "MIXED-AC.assessment.yaml"


@pytest.fixture
def bad_ac_expected_issues(expected_dir):
    """Load expected issues for BAD-AC."""
    return expected_dir / "BAD-AC.assessment.yaml"


@pytest.mark.live
def test_mixed_ac_assessment_task_completion(judge, mixed_ac_path, sut, record_metric):
    """Test task completion on MIXED-AC assessment (GEval - costs money)."""
    result = sut(mixed_ac_path, "assessment")
    test_case = LLMTestCase(input=str(mixed_ac_path), actual_output=result["output"])

    metric = TaskCompletionMetric(judge_model=judge, mode="assessment", threshold=0.9)
    score = metric.measure(test_case)

    record_metric(
        name="task_completion",
        score=score,
        threshold=metric.threshold,
        dimension="completeness",
        persona=_PERSONA,
        scenario="mixed-assess",
        reason=metric.reason,
        passed=metric.is_successful(),
    )

    assert metric.is_successful(), f"Task completion failed: {metric.reason}"
    assert score >= 0.9, f"Expected >= 90% completion, got {score:.2%}"


@pytest.mark.live
def test_mixed_ac_assessment_goal_accuracy(judge, mixed_ac_path, sut, record_metric):
    """Test goal accuracy on MIXED-AC assessment (GEval - costs money)."""
    result = sut(mixed_ac_path, "assessment")
    test_case = LLMTestCase(input=str(mixed_ac_path), actual_output=result["output"])

    metric = GoalAccuracyMetric(
        judge_model=judge,
        mode="assessment",
        ac_source_path=mixed_ac_path,
        threshold=0.8,
    )
    score = metric.measure(test_case)

    record_metric(
        name="goal_accuracy",
        score=score,
        threshold=metric.threshold,
        dimension="completeness",
        persona=_PERSONA,
        scenario="mixed-assess",
        reason=metric.reason,
        passed=metric.is_successful(),
    )

    assert metric.is_successful(), f"Goal accuracy failed: {metric.reason}"
    assert score >= 0.8, f"Expected >= 80% accuracy, got {score:.2%}"


@pytest.mark.live
def test_mixed_ac_assessment_quality(
    judge, mixed_ac_path, mixed_ac_expected_issues, sut, record_metric
):
    """Test assessment quality on MIXED-AC (GEval - costs money)."""
    result = sut(mixed_ac_path, "assessment")
    test_case = LLMTestCase(input=str(mixed_ac_path), actual_output=result["output"])

    metric = AssessmentQualityMetric(
        judge_model=judge,
        expected_issues_path=mixed_ac_expected_issues,
        threshold=0.8,
    )
    score = metric.measure(test_case)

    record_metric(
        name="assessment_quality",
        score=score,
        threshold=metric.threshold,
        dimension="completeness",
        persona=_PERSONA,
        scenario="mixed-assess",
        reason=metric.reason,
        passed=metric.is_successful(),
    )

    assert metric.is_successful(), f"Assessment quality failed: {metric.reason}"
    assert score >= 0.8, f"Expected >= 80% quality, got {score:.2%}"


@pytest.mark.live
def test_bad_ac_assessment_task_completion(judge, bad_ac_path, sut, record_metric):
    """Test task completion on BAD-AC assessment (GEval - costs money)."""
    result = sut(bad_ac_path, "assessment")
    test_case = LLMTestCase(input=str(bad_ac_path), actual_output=result["output"])

    metric = TaskCompletionMetric(judge_model=judge, mode="assessment", threshold=0.9)
    score = metric.measure(test_case)

    record_metric(
        name="task_completion",
        score=score,
        threshold=metric.threshold,
        dimension="completeness",
        persona=_PERSONA,
        scenario="bad-assess",
        reason=metric.reason,
        passed=metric.is_successful(),
    )

    assert metric.is_successful(), f"Task completion failed: {metric.reason}"
    assert score >= 0.9, f"Expected >= 90% completion, got {score:.2%}"


@pytest.mark.live
def test_bad_ac_assessment_quality(
    judge, bad_ac_path, bad_ac_expected_issues, sut, record_metric
):
    """Test assessment quality on BAD-AC with 8 severe errors (GEval - costs money)."""
    result = sut(bad_ac_path, "assessment")
    test_case = LLMTestCase(input=str(bad_ac_path), actual_output=result["output"])

    metric = AssessmentQualityMetric(
        judge_model=judge,
        expected_issues_path=bad_ac_expected_issues,
        threshold=0.8,
    )
    score = metric.measure(test_case)

    record_metric(
        name="assessment_quality",
        score=score,
        threshold=metric.threshold,
        dimension="completeness",
        persona=_PERSONA,
        scenario="bad-assess",
        reason=metric.reason,
        passed=metric.is_successful(),
    )

    assert metric.is_successful(), f"Assessment quality failed: {metric.reason}"
    assert score >= 0.8, f"Expected >= 80% quality, got {score:.2%}"
