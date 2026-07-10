"""Test Engineer persona asking for a conversion of BAD-AC.

Expected SUT behaviour: SKILL.md requires the agent to run assessment first
and STOP if assessment fails. BAD-AC has 8 severe errors so the SUT should
produce an assessment-style failure report and NOT emit a JSON plan. The
eval-mode user prompt already instructs the SUT to halt in this case.

The metrics here verify the SUT correctly halted (plan_adherence), did not
make any silent assumptions (assumptions), did not claim to write files
(permission_compliance), and asked for at least a few clarifications since the
AC is broken (clarification_needed).
"""

import pytest
from deepeval.test_case import LLMTestCase

from metrics.assumptions import AssumptionsMetric
from metrics.blatant_errors import BlatantErrorsMetric
from metrics.clarification_needed import ClarificationNeededMetric
from metrics.permission_compliance import PermissionComplianceMetric
from metrics.plan_adherence import PlanAdherenceMetric


_PERSONA = "engineer"
_SCENARIO = "bad-convert"
_MODE = "conversion"


@pytest.fixture
def bad_ac_path(fixtures_dir):
    return fixtures_dir / "BAD-AC.feature"


@pytest.mark.live
def test_engineer_not_ready_conversion_plan_adherence(judge, bad_ac_path, sut, record_metric):
    """The load-bearing test: did the SUT stop and NOT emit a JSON plan?"""
    result = sut(bad_ac_path, _MODE)
    test_case = LLMTestCase(input=str(bad_ac_path), actual_output=result["output"])

    metric = PlanAdherenceMetric(judge_model=judge, mode=_MODE, threshold=0.8)
    score = metric.measure(test_case)

    record_metric(
        name="plan_adherence",
        rubric_hash=metric.RUBRIC_HASH,
        rubric_source=metric.RUBRIC_SOURCE,
        score=score,
        threshold=metric.threshold,
        dimension="pitfalls",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
    )

    assert metric.is_successful(), f"Plan adherence failed: {metric.reason}"
    assert score >= 0.8, f"Expected >= 80% adherence, got {score:.2%}"


@pytest.mark.live
def test_engineer_not_ready_conversion_blatant_errors(judge, bad_ac_path, sut, record_metric):
    """SUT report should be internally consistent even when halting."""
    result = sut(bad_ac_path, _MODE)
    test_case = LLMTestCase(input=str(bad_ac_path), actual_output=result["output"])

    metric = BlatantErrorsMetric(judge_model=judge, threshold=0.9)
    score = metric.measure(test_case)

    record_metric(
        name="blatant_errors",
        rubric_hash=metric.RUBRIC_HASH,
        rubric_source=metric.RUBRIC_SOURCE,
        score=score,
        threshold=metric.threshold,
        dimension="completeness",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
    )

    assert metric.is_successful(), f"Blatant errors detected: {metric.reason}"
    assert score >= 0.9, f"Expected >= 90% blatant-error score, got {score:.2%}"


@pytest.mark.live
def test_engineer_not_ready_conversion_assumptions(judge, bad_ac_path, sut, record_metric):
    """SUT should not silently invent values for the AC's ambiguous items."""
    result = sut(bad_ac_path, _MODE)
    test_case = LLMTestCase(input=str(bad_ac_path), actual_output=result["output"])

    metric = AssumptionsMetric(
        judge_model=judge,
        ac_source_path=bad_ac_path,
        threshold=0.7,
    )
    score = metric.measure(test_case)

    record_metric(
        name="assumptions",
        rubric_hash=metric.RUBRIC_HASH,
        rubric_source=metric.RUBRIC_SOURCE,
        score=score,
        threshold=metric.threshold,
        dimension="pitfalls",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
    )

    assert metric.is_successful(), f"Assumptions failed: {metric.reason}"
    assert score >= 0.7, f"Expected >= 70% assumptions score, got {score:.2%}"


def test_engineer_not_ready_conversion_permission_compliance(bad_ac_path, sut, record_metric):
    """SUT should not claim to have written any files."""
    result = sut(bad_ac_path, _MODE)
    test_case = LLMTestCase(input=str(bad_ac_path), actual_output=result["output"])

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
    )

    assert metric.is_successful(), f"Permission compliance failed: {metric.reason}"


def test_engineer_not_ready_conversion_clarification_needed(bad_ac_path, sut, record_metric):
    """SUT should ask several clarifying questions about BAD-AC (band: 2-15)."""
    result = sut(bad_ac_path, _MODE)
    test_case = LLMTestCase(input=str(bad_ac_path), actual_output=result["output"])

    metric = ClarificationNeededMetric(
        expected_min=2,
        expected_max=15,
        threshold=1.0,
    )
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
    )

    assert metric.is_successful(), f"Clarification-needed check failed: {metric.reason}"
