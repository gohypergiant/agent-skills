"""Test PM persona assessing the PERFECT-AC fixture.

Expected SUT behavior: produce a "✓ AC are conversion-ready" report with no
clarification questions. This persona × scenario combo verifies the skill does
NOT raise spurious issues against AC that genuinely require no changes.
"""

import pytest
from deepeval.test_case import LLMTestCase

from metrics.blatant_errors import BlatantErrorsMetric
from metrics.clarification_needed import ClarificationNeededMetric
from metrics.permission_compliance import PermissionComplianceMetric
from metrics.plan_adherence import PlanAdherenceMetric
from metrics.step_efficiency import StepEfficiencyMetric
from metrics.task_completion import TaskCompletionMetric


_PERSONA = "pm"
_SCENARIO = "perfect-assess"
_MODE = "assessment"


@pytest.fixture
def perfect_ac_path(fixtures_dir):
    return fixtures_dir / "PERFECT-AC.feature"


@pytest.mark.live
def test_pm_perfect_assessment_task_completion(judge, perfect_ac_path, sut, record_metric):
    """SUT should produce a complete assessment report on PERFECT-AC."""
    result = sut(perfect_ac_path, _MODE)
    test_case = LLMTestCase(input=str(perfect_ac_path), actual_output=result["output"])

    metric = TaskCompletionMetric(judge_model=judge, mode=_MODE, threshold=0.9)
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
def test_pm_perfect_assessment_blatant_errors(judge, perfect_ac_path, sut, record_metric):
    """SUT response should be free of internal contradictions or malformations."""
    result = sut(perfect_ac_path, _MODE)
    test_case = LLMTestCase(input=str(perfect_ac_path), actual_output=result["output"])

    metric = BlatantErrorsMetric(judge_model=judge, threshold=0.9)
    score = metric.measure(test_case)

    record_metric(
        name="blatant_errors",
        score=score,
        threshold=metric.threshold,
        dimension="completeness",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
        criteria=getattr(metric, "criteria", None),
    )

    assert metric.is_successful(), f"Blatant errors detected: {metric.reason}"
    assert score >= 0.9, f"Expected >= 90% blatant-error score, got {score:.2%}"


def test_pm_perfect_assessment_clarification_needed(perfect_ac_path, sut, record_metric):
    """No clarification questions should be needed for PERFECT-AC."""
    result = sut(perfect_ac_path, _MODE)
    test_case = LLMTestCase(input=str(perfect_ac_path), actual_output=result["output"])

    metric = ClarificationNeededMetric(expected_min=0, expected_max=0, threshold=1.0)
    score = metric.measure(test_case)

    record_metric(
        name="clarification_needed",
        score=score,
        threshold=metric.threshold,
        dimension="efficiency",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
        criteria=getattr(metric, "criteria", None),
    )

    assert metric.is_successful(), f"Clarification-needed check failed: {metric.reason}"


def test_pm_perfect_assessment_step_efficiency(perfect_ac_path, sut, record_metric):
    """SUT report should not pad with preamble / sign-off chatter."""
    result = sut(perfect_ac_path, _MODE)
    test_case = LLMTestCase(input=str(perfect_ac_path), actual_output=result["output"])

    metric = StepEfficiencyMetric(mode=_MODE, threshold=0.6)
    score = metric.measure(test_case)

    record_metric(
        name="step_efficiency",
        score=score,
        threshold=metric.threshold,
        dimension="efficiency",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
        criteria=getattr(metric, "criteria", None),
    )

    assert metric.is_successful(), f"Step efficiency failed: {metric.reason}"


@pytest.mark.live
def test_pm_perfect_assessment_plan_adherence(judge, perfect_ac_path, sut, record_metric):
    """SUT should follow the Assessment Workflow steps in order."""
    result = sut(perfect_ac_path, _MODE)
    test_case = LLMTestCase(input=str(perfect_ac_path), actual_output=result["output"])

    metric = PlanAdherenceMetric(judge_model=judge, mode=_MODE, threshold=0.8)
    score = metric.measure(test_case)

    record_metric(
        name="plan_adherence",
        score=score,
        threshold=metric.threshold,
        dimension="pitfalls",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
        criteria=getattr(metric, "criteria", None),
    )

    assert metric.is_successful(), f"Plan adherence failed: {metric.reason}"
    assert score >= 0.8, f"Expected >= 80% adherence, got {score:.2%}"


def test_pm_perfect_assessment_permission_compliance(perfect_ac_path, sut, record_metric):
    """SUT should not claim to have written files."""
    result = sut(perfect_ac_path, _MODE)
    test_case = LLMTestCase(input=str(perfect_ac_path), actual_output=result["output"])

    metric = PermissionComplianceMetric(threshold=1.0)
    score = metric.measure(test_case)

    record_metric(
        name="permission_compliance",
        score=score,
        threshold=metric.threshold,
        dimension="pitfalls",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
        criteria=getattr(metric, "criteria", None),
    )

    assert metric.is_successful(), f"Permission compliance failed: {metric.reason}"
