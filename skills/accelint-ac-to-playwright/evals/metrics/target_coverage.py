"""Target coverage metric - validates expected targets are present in plan."""

import json
from typing import Optional

from deepeval.metrics import BaseMetric
from deepeval.test_case import LLMTestCase

from metrics._json_extraction import PlanExtractionError, extract_plan_json


class TargetCoverageMetric(BaseMetric):
    """Validates that all expected targets appear in the generated plan.

    Catches dropped scenarios and target pattern violations by asserting
    must_have_targets ⊆ produced_targets.
    """

    def __init__(
        self,
        must_have_targets: list[str],
        threshold: float = 1.0,
    ):
        """Initialize the metric.

        Args:
            must_have_targets: List of target strings that must appear
                (e.g., ["form.button.login", "page.text.success"])
            threshold: Coverage threshold (1.0 = all targets required)
        """
        self.must_have_targets = set(must_have_targets)
        self.threshold = threshold
        self.score = 0.0
        self.success = False
        self.reason: Optional[str] = None

    def measure(self, test_case: LLMTestCase) -> float:
        """Measure target coverage by parsing plan and extracting targets.

        Args:
            test_case: Contains actual_output (the generated plan JSON as string)

        Returns:
            Coverage ratio (found_targets / must_have_targets)
        """
        # Parse plan JSON (tolerates fenced ```json``` blocks).
        try:
            plan_data = extract_plan_json(test_case.actual_output)
        except PlanExtractionError as e:
            self.score = 0.0
            self.success = False
            self.reason = f"Could not extract JSON plan from response: {e}"
            return self.score

        # Extract all targets from plan
        produced_targets = set()

        tests = plan_data.get("tests", [])
        for test in tests:
            steps = test.get("steps", [])
            for step in steps:
                # Actions have targets
                if "target" in step:
                    produced_targets.add(step["target"])

                # Assertions also have targets
                if step.get("type") in [
                    "expectText",
                    "expectVisible",
                    "expectNotVisible",
                    "expectUrl",
                ]:
                    if "target" in step:
                        produced_targets.add(step["target"])

        # Calculate coverage
        found_targets = self.must_have_targets & produced_targets
        missing_targets = self.must_have_targets - produced_targets

        if len(self.must_have_targets) == 0:
            self.score = 1.0
            self.success = True
            self.reason = "No targets required (empty must_have_targets)"
        else:
            self.score = len(found_targets) / len(self.must_have_targets)
            self.success = self.score >= self.threshold

            if self.success:
                self.reason = f"All {len(self.must_have_targets)} required targets found"
            else:
                missing_list = ", ".join(sorted(missing_targets))
                self.reason = (
                    f"Missing {len(missing_targets)} targets: {missing_list}\n"
                    f"Coverage: {self.score:.2%} (threshold: {self.threshold:.2%})"
                )

        return self.score

    async def a_measure(self, test_case: LLMTestCase) -> float:
        """Async version (delegates to sync)."""
        return self.measure(test_case)

    def is_successful(self) -> bool:
        """Return whether the metric passed."""
        return self.success

    @property
    def __name__(self):
        return "Target Coverage"
