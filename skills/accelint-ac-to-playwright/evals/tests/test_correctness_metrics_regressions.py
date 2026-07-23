"""Regression tests for the correctness-gap metrics."""

import json

import pytest
from deepeval.test_case import LLMTestCase

from metrics.blatant_errors import BlatantErrorsMetric
from metrics.json_completeness import JsonCompletenessMetric


@pytest.mark.live
def test_blatant_errors_catches_contradictions(judge):
    """A report that says 'AC ready' then lists issues should fail."""
    contradictory_output = """✓ AC are conversion-ready.

However, I noticed the following issues:
1. Line 17: Missing intent on the target.
2. Line 22: Vague action verb 'uses'.
3. Line 39: Invalid area keyword 'notification'.
"""

    metric = BlatantErrorsMetric(judge_model=judge, threshold=0.9)
    test_case = LLMTestCase(input="dummy", actual_output=contradictory_output)

    score = metric.measure(test_case)

    assert score < 0.9, (
        f"Expected blatant_errors to penalize ready-vs-issues contradiction; "
        f"got score {score:.2f}"
    )
    print(f"Blatant errors score: {score:.2f} (reason: {metric.reason})")


def test_json_completeness_catches_missing_scenarios(tmp_path):
    """A plan with 3 tests against a 5-scenario AC should score < 1.0."""
    ac_path = tmp_path / "five-scenarios.feature"
    ac_path.write_text(
        """Feature: Five scenarios

  Scenario: One
    When the user clicks the go button on the page
    Then the user is on the next page

  Scenario: Two
    When the user clicks the go button on the page
    Then the user is on the next page

  Scenario: Three
    When the user clicks the go button on the page
    Then the user is on the next page

  Scenario: Four
    When the user clicks the go button on the page
    Then the user is on the next page

  Scenario: Five
    When the user clicks the go button on the page
    Then the user is on the next page
""",
        encoding="utf-8",
    )

    plan = {
        "suiteName": "Five scenarios",
        "tests": [
            {
                "name": f"scenario {i}",
                "startUrl": "/",
                "steps": [
                    {"action": "click", "target": "page.button.go"},
                    {"action": "expectUrl", "value": "/next"},
                ],
            }
            for i in range(3)
        ],
    }

    output = f"```json\n{json.dumps(plan)}\n```"

    metric = JsonCompletenessMetric(ac_source_path=ac_path, threshold=1.0)
    test_case = LLMTestCase(input="dummy", actual_output=output)

    score = metric.measure(test_case)

    assert score < 1.0
    assert not metric.is_successful()
    # The reason should name the test count mismatch.
    assert "3" in metric.reason and "5" in metric.reason
