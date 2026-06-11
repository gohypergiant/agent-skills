"""Test Engineer persona asking for a conversion of BAD-AC.

Expected SUT behaviour: SKILL.md requires the agent to run assessment first
and STOP if assessment fails. BAD-AC has 8 severe errors so the SUT should
produce an assessment-style failure report and NOT emit a JSON plan. The
eval-mode user prompt already instructs the SUT to halt in this case.

Halt contract tests (Tanya #9, split variant):
  - test_bad_ac_conversion_halts: deterministic — SUT must NOT emit a JSON plan.
  - plan_adherence: live LLM judge — workflow adherence score.
  - permission_compliance: deterministic — no file-write claims.

The assumptions, blatant_errors, and clarification_needed tests have been
moved to test_mixed_convert.py (MIXED-AC-1.feature, conversion mode) where
the SUT output is manageable and the AC issues are recoverable (Tanya #9).
"""

import pytest
from deepeval.test_case import LLMTestCase

from metrics._json_extraction import PlanExtractionError, extract_plan_json
from metrics.permission_compliance import PermissionComplianceMetric
from metrics.plan_adherence import PlanAdherenceMetric


_PERSONA = "engineer"
_SCENARIO = "bad-convert"
_MODE = "conversion"


@pytest.fixture
def bad_ac_path(fixtures_dir):
    return fixtures_dir / "BAD-AC.feature"


def test_bad_ac_conversion_halts(bad_ac_path, sut, record_metric):
    """Deterministic halt contract: SUT must NOT emit a JSON plan for BAD-AC.

    The skill's conversion workflow requires halting on a failed assessment.
    BAD-AC has 8 severe errors that must trigger a halt. If a plan IS
    successfully extracted, the skill violated the halt contract.
    """
    result = sut(bad_ac_path, _MODE)

    try:
        plan = extract_plan_json(result["output"])
        # If we reach here, a plan was extracted — this is a failure.
        score = 0.0
        passed = False
        reason = (
            f"skill must halt on failed assessment: a JSON plan was extracted "
            f"(suiteName={plan.get('suiteName')!r}, "
            f"tests={len(plan.get('tests') or [])}). "
            f"BAD-AC has 8 blocking errors; the SUT should stop and report them."
        )
    except PlanExtractionError:
        # Correct: no plan emitted, halt contract satisfied.
        score = 1.0
        passed = True
        reason = "No JSON plan emitted — halt contract satisfied for BAD-AC."

    record_metric(
        name="halt_contract",
        score=score,
        threshold=1.0,
        dimension="pitfalls",
        persona=_PERSONA,
        scenario=_SCENARIO,
        reason=reason,
        passed=passed,
        criteria=None,
    )

    assert passed, reason


@pytest.mark.live
def test_engineer_not_ready_conversion_plan_adherence(judge, bad_ac_path, sut, record_metric):
    """The load-bearing test: did the SUT stop and NOT emit a JSON plan?"""
    result = sut(bad_ac_path, _MODE)
    test_case = LLMTestCase(input=str(bad_ac_path), actual_output=result["output"])

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
        criteria=getattr(metric, "criteria", None),
    )

    assert metric.is_successful(), f"Permission compliance failed: {metric.reason}"
