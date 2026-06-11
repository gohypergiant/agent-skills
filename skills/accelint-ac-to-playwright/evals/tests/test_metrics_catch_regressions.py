"""Regression tests proving each metric can fail.

These tests use deliberately broken inputs to verify that each metric
has teeth and can detect failures.

Plans use the CURRENT schema:
  - tests[i].name  (not testName)
  - steps[i].type = "action" | "assertion"
  - steps[i].action = "click" | "fill" | "expectText" | ...
  - steps[i].value  (not text, for expectText literals)
"""

import json
from pathlib import Path

import pytest
from deepeval.test_case import LLMTestCase

from metrics.hallucinated_assertions import HallucinatedAssertionsMetric
from metrics.plan_structural import PlanStructuralMetric
from metrics.target_coverage import TargetCoverageMetric


def test_plan_structural_catches_missing_field(tmp_path):
    """Structural metric must fail when required field is missing."""
    # Create a plan missing 'suiteName' — uses current schema elsewhere.
    broken_plan = {
        "tests": [
            {
                "name": "test one",
                "startUrl": "/",
                "steps": [],
            }
        ]
    }

    plan_json = json.dumps(broken_plan, indent=2)

    metric = PlanStructuralMetric(threshold=1.0)
    test_case = LLMTestCase(
        input="dummy",
        actual_output=plan_json,
    )

    score = metric.measure(test_case)

    # Must fail
    assert score == 0.0
    assert not metric.is_successful()
    reason_lc = metric.reason.lower()
    assert "suitename" in reason_lc or "required" in reason_lc or "expected string" in reason_lc


def test_target_coverage_catches_missing_target():
    """Target coverage metric must fail when expected target is missing."""
    # Plan with one test, missing "form.button.login" target — current schema.
    plan = {
        "suiteName": "Test Suite",
        "tests": [
            {
                "name": "test one",
                "startUrl": "/",
                "steps": [
                    {
                        "type": "action",
                        "action": "click",
                        "target": "page.button.submit",  # Wrong target
                    }
                ],
            }
        ],
    }

    plan_json = json.dumps(plan, indent=2)

    metric = TargetCoverageMetric(
        must_have_targets=["form.button.login"],  # Expected but not present
        threshold=1.0,
    )

    test_case = LLMTestCase(
        input="dummy",
        actual_output=plan_json,
    )

    score = metric.measure(test_case)

    # Must fail
    assert score == 0.0
    assert not metric.is_successful()
    assert "form.button.login" in metric.reason


def test_hallucinated_assertions_catches_invented_text(tmp_path):
    """Hallucination metric must flag expectText with text not in AC.

    Uses the CURRENT schema: type="assertion", action="expectText", value=<text>.
    """
    # Create a minimal AC source
    ac_content = """Feature: Login
    Scenario: User logs in
      When the user clicks the login button
      Then the user is on the dashboard page
"""

    ac_path = tmp_path / "test.feature"
    ac_path.write_text(ac_content, encoding="utf-8")

    # Plan adds expectText with text that doesn't appear in AC — current schema.
    plan = {
        "suiteName": "Login",
        "tests": [
            {
                "name": "user logs in",
                "startUrl": "/",
                "steps": [
                    {
                        "type": "action",
                        "action": "click",
                        "target": "form.button.login",
                    },
                    {
                        "type": "assertion",
                        "action": "expectText",
                        "target": "page.text.welcome",
                        "value": "Welcome Admin",  # This text is NOT in the AC
                    },
                    {
                        "type": "assertion",
                        "action": "expectUrl",
                        "value": "/dashboard",
                    },
                ],
            }
        ],
    }

    plan_json = json.dumps(plan, indent=2)

    metric = HallucinatedAssertionsMetric(
        ac_source_path=ac_path,
        threshold=1.0,
    )

    test_case = LLMTestCase(
        input="dummy",
        actual_output=plan_json,
    )

    score = metric.measure(test_case)

    # Must fail (score < 1.0 indicates hallucinations found)
    assert score < 1.0
    assert not metric.is_successful()
    assert "Welcome Admin" in metric.reason or "hallucination" in metric.reason.lower()


def test_hallucinated_assertions_not_vacuous_on_current_schema(tmp_path):
    """Guard: metric must NOT return vacuous 1.0 when current-schema plan has an ungrounded expectText.

    Regression guard for the bug where step_type = step.get("type") on a
    current-schema step (type="assertion", action="expectText") would collect
    ZERO assertions and silently return 1.0.
    """
    ac_content = """Feature: Login
    Scenario: User logs in
      When the user clicks the login button
      Then the user is on the dashboard page
"""
    ac_path = tmp_path / "guard.feature"
    ac_path.write_text(ac_content, encoding="utf-8")

    # Current-schema plan with an expectText whose value is NOT in the AC.
    plan = {
        "suiteName": "Guard Suite",
        "tests": [
            {
                "name": "login",
                "startUrl": "/login",
                "steps": [
                    {
                        "type": "action",
                        "action": "click",
                        "target": "form.button.login",
                    },
                    {
                        "type": "assertion",
                        "action": "expectText",
                        "target": "page.text.banner",
                        "value": "Completely Invented Text XYZ",  # NOT in AC
                    },
                ],
            }
        ],
    }

    plan_json = json.dumps(plan, indent=2)

    metric = HallucinatedAssertionsMetric(ac_source_path=ac_path, threshold=1.0)
    test_case = LLMTestCase(input="dummy", actual_output=plan_json)

    score = metric.measure(test_case)

    # If the bug is present, score would be vacuously 1.0 because no assertions
    # were collected.  After the fix the metric must detect the ungrounded
    # assertion and score < 1.0.
    assert score < 1.0, (
        "Vacuous-1.0 bug: metric returned 1.0 despite an ungrounded expectText "
        "in a current-schema plan.  Check that step_kind uses step.get('action') "
        "as the primary key, not step.get('type')."
    )


@pytest.mark.live
def test_plan_semantic_can_fail(judge, fixtures_dir):
    """GEval semantic metric must fail when plan has extra tests.

    Marked as 'live' because it hits the LLM (costs money).
    """
    from metrics.plan_semantic import PlanSemanticMetric

    # Load PERFECT-AC for reference
    ac_path = fixtures_dir / "PERFECT-AC.feature"

    # Create a plan with 11 tests instead of 10 (invented extra) — current schema.
    plan = {
        "suiteName": "Perfect AC Suite",
        "tests": [{"name": f"test {i}", "startUrl": "/", "steps": []}
            for i in range(11)  # One extra test
        ],
    }

    plan_json = json.dumps(plan, indent=2)

    metric = PlanSemanticMetric(
        judge_model=judge,
        ac_source_path=ac_path,
        threshold=0.8,
    )

    test_case = LLMTestCase(
        input="dummy",
        actual_output=plan_json,
    )

    score = metric.measure(test_case)

    # Should fail (score < 0.8 due to extra test)
    # Note: This is LLM-dependent, so we can't assert exact score,
    # but it should be penalized for the extra test
    assert score < 1.0  # At least some penalty
    print(f"Plan semantic score: {score:.2f} (reason: {metric.reason})")


@pytest.mark.live
def test_assessment_quality_can_fail(judge, fixtures_dir, expected_dir):
    """GEval assessment quality metric must fail when report misses issues.

    Marked as 'live' because it hits the LLM (costs money).
    """
    from metrics.assessment_quality import AssessmentQualityMetric

    # Load expected issues for MIXED-AC-1 (per-slice manifest rename in Task 6)
    expected_issues_path = expected_dir / "MIXED-AC-1.assessment.yaml"

    # Simulate an assessment report that only catches 4 out of 7 issues
    incomplete_report = """❌ AC are not conversion-ready. Issues found:

File: MIXED-AC-1.feature

1. Line 7: Invalid tag format (missing @ prefix)
   - Problem: Tag missing-at-symbol doesn't start with @
   - Fix: Add @ prefix

2. Line 22: Vague action verb "uses"
   - Problem: Cannot map to Playwright action
   - Fix: Use specific verb like "clicks"

3. Line 29: Missing quoted literal value
   - Problem: "a valid email address" is not a literal
   - Fix: Use 'test@example.com'

4. Line 54: Orphaned When step after Then
   - Problem: Step ordering violation
   - Fix: Move before Then or create new scenario

Summary: 4 issues found (but 7 were expected!)
"""

    metric = AssessmentQualityMetric(
        judge_model=judge,
        expected_issues_path=expected_issues_path,
        threshold=0.8,
    )

    test_case = LLMTestCase(
        input="dummy",
        actual_output=incomplete_report,
    )

    score = metric.measure(test_case)

    # Should fail for missing 3 out of 7 issues (43% detection rate)
    # LLM judge should penalize this heavily
    assert score < 0.7  # Below threshold
    print(f"Assessment quality score: {score:.2f} (reason: {metric.reason})")


@pytest.mark.live
def test_task_completion_can_fail(judge):
    """TaskCompletionMetric must score < 0.9 when the SUT refuses.

    Marked as 'live' because it calls the LLM judge.
    """
    from metrics.task_completion import TaskCompletionMetric

    refusal = (
        "I cannot convert these acceptance criteria into a test plan. "
        "The AC are too ambiguous and under-specified. Please rewrite them "
        "using the required format before requesting conversion."
    )

    metric = TaskCompletionMetric(judge_model=judge, mode="conversion", threshold=0.9)
    test_case = LLMTestCase(input="dummy", actual_output=refusal)

    score = metric.measure(test_case)

    assert score < 0.9, (
        f"TaskCompletionMetric returned {score:.2f} for a refusal response — "
        "metric has no teeth for the conversion-refusal case."
    )
    print(f"task_completion refusal score: {score:.2f} (reason: {metric.reason})")


@pytest.mark.live
def test_goal_accuracy_can_fail(judge, tmp_path):
    """GoalAccuracyMetric must score < 0.8 when the plan omits scenarios.

    Marked as 'live' because it calls the LLM judge.

    Fixture: tiny inline 2-scenario AC file; actual_output covers only 1 of the
    2 scenarios; expected_output contains the full 2-test plan.
    """
    from metrics.goal_accuracy import GoalAccuracyMetric

    ac_content = """\
Feature: Checkout
  Scenario: Guest checkout
    Given the user is on the cart page
    When the user clicks 'Checkout as Guest'
    Then the user is on the shipping page

  Scenario: Logged-in checkout
    Given the user is logged in
    When the user clicks 'Checkout'
    Then the user is on the order summary page
"""
    ac_path = tmp_path / "checkout.feature"
    ac_path.write_text(ac_content, encoding="utf-8")

    # Actual output only covers 1 of 2 scenarios — current schema.
    actual_plan = {
        "suiteName": "Checkout",
        "tests": [
            {
                "name": "Guest checkout",
                "startUrl": "/cart",
                "steps": [
                    {"type": "action", "action": "click", "target": "page.button.checkout-guest"},
                    {"type": "assertion", "action": "expectUrl", "value": "/shipping"},
                ],
            }
        ],
    }

    # Expected output has both scenarios — current schema.
    expected_plan = {
        "suiteName": "Checkout",
        "tests": [
            {
                "name": "Guest checkout",
                "startUrl": "/cart",
                "steps": [
                    {"type": "action", "action": "click", "target": "page.button.checkout-guest"},
                    {"type": "assertion", "action": "expectUrl", "value": "/shipping"},
                ],
            },
            {
                "name": "Logged-in checkout",
                "startUrl": "/cart",
                "steps": [
                    {"type": "action", "action": "click", "target": "page.button.checkout"},
                    {"type": "assertion", "action": "expectUrl", "value": "/order-summary"},
                ],
            },
        ],
    }

    metric = GoalAccuracyMetric(
        judge_model=judge,
        mode="conversion",
        ac_source_path=ac_path,
        threshold=0.8,
    )

    test_case = LLMTestCase(
        input="dummy",
        actual_output=json.dumps(actual_plan, indent=2),
        expected_output=json.dumps(expected_plan, indent=2),
    )

    score = metric.measure(test_case)

    assert score < 0.8, (
        f"GoalAccuracyMetric returned {score:.2f} for a plan missing 1 of 2 scenarios — "
        "metric has no teeth for the dropped-scenario case."
    )
    print(f"goal_accuracy dropped-scenario score: {score:.2f} (reason: {metric.reason})")
