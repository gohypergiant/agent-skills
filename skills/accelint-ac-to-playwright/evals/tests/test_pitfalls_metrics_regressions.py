"""Regression tests for the pitfalls-family metrics.

Mirrors ``test_metrics_catch_regressions.py``: each test feeds a deliberately
broken input and verifies the corresponding metric flags it. The two GEval
metrics in this family are marked ``live`` because they call the judge.
"""

import pytest
from deepeval.test_case import LLMTestCase

from metrics.assumptions import AssumptionsMetric
from metrics.permission_compliance import PermissionComplianceMetric
from metrics.plan_adherence import PlanAdherenceMetric


@pytest.mark.live
def test_plan_adherence_can_fail(judge):
    """Plan adherence should penalize a SUT response that skips the workflow.

    Conversion mode requires the agent to run the assessment pass first then
    emit a fenced ```json``` plan. This synthetic output skips assessment
    entirely and just dumps a plan. The judge should mark adherence as low.
    """
    skipped_workflow_output = """```json
{
  "suiteName": "fake",
  "tests": [
    {"name": "t1", "startUrl": "/", "steps": [{"action": "click", "target": "page.button.go"}]}
  ]
}
```"""

    metric = PlanAdherenceMetric(
        judge_model=judge,
        mode="conversion",
        threshold=0.8,
    )

    test_case = LLMTestCase(
        input="dummy",
        actual_output=skipped_workflow_output,
    )

    score = metric.measure(test_case)

    assert score < 0.8, (
        f"Expected plan_adherence to flag a workflow-skipping reply, "
        f"got score {score:.2f}"
    )
    print(f"Plan adherence score: {score:.2f} (reason: {metric.reason})")


@pytest.mark.live
def test_assumptions_can_fail(judge, tmp_path):
    """Assumptions should penalize silent invention of a vague AC value.

    The AC says "a valid email"; the SUT silently fills `test@example.com`
    without flagging the ambiguity or labeling the choice as an assumption.
    """
    ac_path = tmp_path / "ambiguous.feature"
    ac_path.write_text(
        """Feature: Vague email
  Scenario: Sign up with vague email
    When the user fills the email input on the form with a valid email address
    Then the user is on the dashboard page
""",
        encoding="utf-8",
    )

    silent_invention_output = """```json
{
  "suiteName": "Vague email",
  "tests": [
    {
      "name": "Sign up with vague email",
      "startUrl": "/",
      "steps": [
        {"action": "fill", "target": "form.input.email", "value": "test@example.com"},
        {"action": "expectUrl", "value": "/dashboard"}
      ]
    }
  ]
}
```"""

    metric = AssumptionsMetric(
        judge_model=judge,
        ac_source_path=ac_path,
        threshold=0.7,
    )

    test_case = LLMTestCase(
        input=str(ac_path),
        actual_output=silent_invention_output,
    )

    score = metric.measure(test_case)

    assert score < 0.7, (
        f"Expected assumptions metric to flag silent invention of "
        f"'test@example.com', got score {score:.2f}"
    )
    print(f"Assumptions score: {score:.2f} (reason: {metric.reason})")


def test_permission_compliance_catches_file_write_claims():
    """Permission compliance should flag any claim that files were written."""
    offending_output = (
        "Here is the assessment.\n\n"
        "I have written the plan to ./plans/foo.json and you can run it now."
    )

    metric = PermissionComplianceMetric(threshold=1.0)
    test_case = LLMTestCase(input="dummy", actual_output=offending_output)

    score = metric.measure(test_case)

    assert score == 0.0
    assert not metric.is_successful()
    # The reason should name the offending phrase.
    assert "i have written" in metric.reason.lower()
