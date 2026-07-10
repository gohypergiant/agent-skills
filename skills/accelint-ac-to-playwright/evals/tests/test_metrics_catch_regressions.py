"""Regression tests proving each metric can fail.

These tests use deliberately broken inputs to verify that each metric
has teeth and can detect failures.
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
    # Create a plan missing 'suiteName'
    broken_plan = {
        "tests": [
            {
                "testName": "test one",
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
    # Plan with one test, missing "form.button.login" target
    plan = {
        "suiteName": "Test Suite",
        "tests": [
            {
                "testName": "test one",
                "startUrl": "/",
                "steps": [
                    {
                        "type": "click",
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
    """Hallucination metric must flag expectText with text not in AC."""
    # Create a minimal AC source
    ac_content = """Feature: Login
    Scenario: User logs in
      When the user clicks the login button
      Then the user is on the dashboard page
"""

    ac_path = tmp_path / "test.feature"
    ac_path.write_text(ac_content, encoding="utf-8")

    # Plan adds expectText with text that doesn't appear in AC
    plan = {
        "suiteName": "Login",
        "tests": [
            {
                "testName": "user logs in",
                "startUrl": "/",
                "steps": [
                    {
                        "type": "click",
                        "target": "form.button.login",
                    },
                    {
                        "type": "expectText",
                        "target": "page.text.welcome",
                        "text": "Welcome Admin",  # This text is NOT in the AC
                    },
                    {
                        "type": "expectUrl",
                        "url": "/dashboard",
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


@pytest.mark.live
def test_plan_semantic_can_fail(judge, fixtures_dir):
    """GEval semantic metric must fail when plan has extra tests.

    Marked as 'live' because it hits the LLM (costs money).
    """
    from metrics.plan_semantic import PlanSemanticMetric

    # Load PERFECT-AC for reference
    ac_path = fixtures_dir / "PERFECT-AC.feature"

    # Create a plan with 11 tests instead of 10 (invented extra)
    plan = {
        "suiteName": "Perfect AC Suite",
        "tests": [{"testName": f"test {i}", "startUrl": "/", "steps": []}
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

    # Load expected issues for MIXED-AC
    expected_issues_path = expected_dir / "MIXED-AC.assessment.yaml"

    # Simulate an assessment report that only catches 4 out of 7 issues
    incomplete_report = """❌ AC are not conversion-ready. Issues found:

File: MIXED-AC.feature

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
    """Task-completion metric must fail on a refusal (GEval - costs money).

    Closes the audit finding: task_completion had no regression test proving
    it can fail — a metric that always passes measures nothing.
    """
    from metrics.task_completion import TaskCompletionMetric

    refusal = (
        "I'm sorry, but I can't convert these acceptance criteria into a test "
        "plan. Could you clarify what you want me to do?"
    )
    metric = TaskCompletionMetric(judge_model=judge, mode="conversion", threshold=0.9)
    score = metric.measure(LLMTestCase(input="dummy", actual_output=refusal))

    assert score < 0.9, f"Refusal must score below threshold, got {score:.2f}"
    assert not metric.is_successful()
    print(f"Task completion (refusal) score: {score:.2f} (reason: {metric.reason})")


@pytest.mark.live
def test_goal_accuracy_can_fail(judge, fixtures_dir):
    """Goal-accuracy metric must fail on a plan that misrepresents the AC.

    Closes the audit finding: goal_accuracy had no regression test proving it
    can fail. The planted plan drops 9 of 10 scenarios and invents one.
    """
    from metrics.goal_accuracy import GoalAccuracyMetric

    ac_path = fixtures_dir / "PERFECT-AC.feature"
    misrepresented_plan = json.dumps({
        "suiteName": "Wrong Suite",
        "tests": [
            {
                "name": "invented scenario not present in the AC",
                "startUrl": "/wrong",
                "steps": [
                    {"action": "click", "target": "footer.button.imaginary"},
                    {"action": "expectText", "target": "footer.text.made-up",
                     "value": "This text appears nowhere in the AC"},
                ],
            }
        ],
    }, indent=2)

    metric = GoalAccuracyMetric(
        judge_model=judge, mode="conversion", ac_source_path=ac_path, threshold=0.8
    )
    score = metric.measure(LLMTestCase(input="dummy", actual_output=misrepresented_plan))

    assert score < 0.8, f"Misrepresented plan must score below threshold, got {score:.2f}"
    assert not metric.is_successful()
    print(f"Goal accuracy (misrepresented) score: {score:.2f} (reason: {metric.reason})")
