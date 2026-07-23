"""Test Engineer persona converting MIXED-AC-1 (pretty-good AC with recoverable issues).

These tests were moved from test_engineer_not_ready_conversion.py (Tanya #9 split).
MIXED-AC-1 has manageable issues (not all blocking) so the SUT output is rich
enough to evaluate assumptions, internal consistency, and clarification behaviour.

The scenario label is "mixed-convert" — Engineer converting pretty-good AC.
Clarification band is 2-15 (same as the original BAD-AC band; MIXED-AC issues
are fewer but the SUT may still ask about ambiguous values).
"""

import pytest
from deepeval.test_case import LLMTestCase

from metrics.assumptions import AssumptionsMetric
from metrics.blatant_errors import BlatantErrorsMetric
from metrics.clarification_needed import ClarificationNeededMetric


_PERSONA = "engineer"
_SCENARIO = "mixed-convert"
_MODE = "conversion"


@pytest.fixture
def mixed_ac_path(fixtures_dir):
    return fixtures_dir / "MIXED-AC-1.feature"


@pytest.mark.live
def test_mixed_convert_blatant_errors(judge, mixed_ac_path, sut, record_metric):
    """SUT report/plan should be internally consistent for MIXED-AC conversion."""
    result = sut(mixed_ac_path, _MODE)
    test_case = LLMTestCase(input=str(mixed_ac_path), actual_output=result["output"])

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


@pytest.mark.live
def test_mixed_convert_assumptions(judge, mixed_ac_path, sut, record_metric):
    """SUT should not silently invent values for the AC's ambiguous items."""
    result = sut(mixed_ac_path, _MODE)
    test_case = LLMTestCase(input=str(mixed_ac_path), actual_output=result["output"])

    metric = AssumptionsMetric(
        judge_model=judge,
        ac_source_path=mixed_ac_path,
        threshold=0.7,
    )
    score = metric.measure(test_case)

    record_metric(
        name="assumptions",
        score=score,
        threshold=metric.threshold,
        dimension="pitfalls",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=metric.reason,
        passed=metric.is_successful(),
        criteria=getattr(metric, "criteria", None),
    )

    assert metric.is_successful(), f"Assumptions failed: {metric.reason}"
    assert score >= 0.7, f"Expected >= 70% assumptions score, got {score:.2%}"


def test_mixed_convert_clarification_needed(mixed_ac_path, sut, record_metric):
    """SUT should ask a reasonable number of clarifying questions for MIXED-AC (band: 2-15)."""
    result = sut(mixed_ac_path, _MODE)
    test_case = LLMTestCase(input=str(mixed_ac_path), actual_output=result["output"])

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
        criteria=getattr(metric, "criteria", None),
    )

    assert metric.is_successful(), f"Clarification-needed check failed: {metric.reason}"
