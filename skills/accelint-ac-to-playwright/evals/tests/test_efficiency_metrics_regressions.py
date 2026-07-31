"""Regression tests for the efficiency-family metrics.

All deterministic — no judge calls. Each test feeds a synthetic input and
verifies the metric behaves as designed (flags chatty / silent / padded
outputs correctly).
"""

import pytest
from deepeval.test_case import LLMTestCase

from metrics.clarification_needed import ClarificationNeededMetric
from metrics.step_efficiency import StepEfficiencyMetric


def test_step_efficiency_flags_padded_output():
    """A long preamble before a small JSON plan should score below threshold."""
    preamble = (
        "Let me walk through my reasoning step by step. " * 80
    )  # ~3200 chars of filler
    plan_json = """```json
{
  "suiteName": "tiny",
  "tests": [
    {"name": "t", "startUrl": "/", "steps": [{"action": "click", "target": "page.button.x"}]}
  ]
}
```"""
    padded_output = f"{preamble}\n\n{plan_json}"

    metric = StepEfficiencyMetric(mode="conversion", threshold=0.7)
    test_case = LLMTestCase(input="dummy", actual_output=padded_output)

    score = metric.measure(test_case)

    assert score < 0.7, (
        f"Expected padded output to score below 0.7; got {score:.2f}"
    )
    assert not metric.is_successful()
    reason_lc = metric.reason.lower()
    assert "essential" in reason_lc
    assert "%" in metric.reason  # percentage included in reason


def test_clarification_needed_flags_chatty_output():
    """Five clarification-style questions should fail the (0, 0) band."""
    chatty_output = (
        "Should I treat the login button as primary? "
        "Could you confirm the dropdown label is 'Premium Plan'? "
        "Would you like me to add error-handling tests as well? "
        "Do you want me to include keyboard shortcuts? "
        "Please provide the expected URL for success. "
    )

    metric = ClarificationNeededMetric(
        expected_min=0,
        expected_max=0,
        threshold=1.0,
    )
    test_case = LLMTestCase(input="dummy", actual_output=chatty_output)

    score = metric.measure(test_case)

    assert score < 1.0
    assert not metric.is_successful()
    # The reason should name the count detected.
    assert "5" in metric.reason or "clarification" in metric.reason.lower()


def test_clarification_needed_passes_when_silent_and_band_is_zero():
    """A silent output (no clarification questions) against (0, 0) → 1.0."""
    silent_output = (
        "The acceptance criteria are conversion-ready. All targets follow "
        "the area.component.intent pattern and all action verbs are recognised."
    )

    metric = ClarificationNeededMetric(
        expected_min=0,
        expected_max=0,
        threshold=1.0,
    )
    test_case = LLMTestCase(input="dummy", actual_output=silent_output)

    score = metric.measure(test_case)

    assert score == 1.0
    assert metric.is_successful()
