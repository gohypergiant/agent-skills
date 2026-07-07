"""Hallucinated assertions metric - validates assertions are grounded in AC source."""

import json
import re
from pathlib import Path
from typing import Optional

from deepeval.metrics import BaseMetric
from deepeval.test_case import LLMTestCase

from metrics._json_extraction import PlanExtractionError, extract_plan_json


class HallucinatedAssertionsMetric(BaseMetric):
    """Detects assertions in the plan that have no grounding in the source AC.

    For each expectText/expectVisible/expectNotVisible/expectUrl, traces to
    the source AC line and validates the assertion has textual evidence.
    """

    # Visibility trigger words that ground expectVisible/expectNotVisible
    VISIBILITY_TRIGGERS = {
        "appears",
        "shows",
        "visible",
        "see",
        "hides",
        "disappears",
        "changes",
        "is there",
        "can see",
    }

    # Navigation trigger phrases that ground expectUrl
    NAVIGATION_TRIGGERS = [
        "is on the",
        "navigates to",
        "arrives on",
        "goes to",
        "redirects to",
    ]

    def __init__(
        self,
        ac_source_path: Path,
        threshold: float = 1.0,
    ):
        """Initialize the metric.

        Args:
            ac_source_path: Path to the source .feature or .md AC file
            threshold: Maximum allowed hallucination ratio (1.0 = zero tolerance)
        """
        self.ac_source_path = ac_source_path
        self.threshold = threshold
        self.score = 0.0
        self.success = False
        self.reason: Optional[str] = None

        # Load AC source lines
        self.ac_lines = self._load_ac_source()

    def _load_ac_source(self) -> list[str]:
        """Load AC source file and return lines."""
        if not self.ac_source_path.exists():
            raise FileNotFoundError(f"AC source not found: {self.ac_source_path}")

        return self.ac_source_path.read_text(encoding="utf-8").splitlines()

    def _is_grounded_expect_text(self, literal: str, ac_lines: list[str]) -> bool:
        """Check if an expectText literal appears in any AC line."""
        for line in ac_lines:
            if literal.lower() in line.lower():
                return True
        return False

    def _is_grounded_visibility(self, ac_lines: list[str]) -> bool:
        """Check if visibility change is signaled by trigger words."""
        for line in ac_lines:
            line_lower = line.lower()
            for trigger in self.VISIBILITY_TRIGGERS:
                if trigger in line_lower:
                    return True
        return False

    def _is_grounded_expect_url(self, ac_lines: list[str]) -> bool:
        """Check if URL navigation is signaled by trigger phrases."""
        for line in ac_lines:
            line_lower = line.lower()
            for trigger in self.NAVIGATION_TRIGGERS:
                if trigger in line_lower:
                    return True
        return False

    def measure(self, test_case: LLMTestCase) -> float:
        """Measure hallucination rate by checking assertion grounding.

        Args:
            test_case: Contains actual_output (the generated plan JSON as string)

        Returns:
            1.0 - hallucination_ratio (1.0 = zero hallucinations)
        """
        # Parse plan JSON (tolerates fenced ```json``` blocks).
        try:
            plan_data = extract_plan_json(test_case.actual_output)
        except PlanExtractionError as e:
            self.score = 0.0
            self.success = False
            self.reason = f"Could not extract JSON plan from response: {e}"
            return self.score

        # Collect all assertions
        assertions = []
        tests = plan_data.get("tests", [])

        for test_idx, test in enumerate(tests):
            steps = test.get("steps", [])
            for step_idx, step in enumerate(steps):
                step_type = step.get("type")

                if step_type in [
                    "expectText",
                    "expectVisible",
                    "expectNotVisible",
                    "expectUrl",
                ]:
                    assertions.append({
                        "type": step_type,
                        "test_idx": test_idx,
                        "step_idx": step_idx,
                        "step": step,
                    })

        if len(assertions) == 0:
            self.score = 1.0
            self.success = True
            self.reason = "No assertions found in plan"
            return self.score

        # Check each assertion for grounding
        hallucinations = []
        for assertion in assertions:
            step_type = assertion["type"]
            step = assertion["step"]

            if step_type == "expectText":
                literal = step.get("text", "") or step.get("value", "")
                if not self._is_grounded_expect_text(literal, self.ac_lines):
                    hallucinations.append({
                        "test_idx": assertion["test_idx"],
                        "step_idx": assertion["step_idx"],
                        "type": step_type,
                        "text": literal,
                        "reason": f"Text '{literal}' not found in AC source",
                    })
            elif step_type in ("expectVisible", "expectNotVisible"):
                if not self._is_grounded_visibility(self.ac_lines):
                    hallucinations.append({
                        "test_idx": assertion["test_idx"],
                        "step_idx": assertion["step_idx"],
                        "type": step_type,
                        "reason": "No visibility trigger words in AC source",
                    })
            elif step_type == "expectUrl":
                if not self._is_grounded_expect_url(self.ac_lines):
                    hallucinations.append({
                        "test_idx": assertion["test_idx"],
                        "step_idx": assertion["step_idx"],
                        "type": step_type,
                        "reason": "No navigation trigger in AC source",
                    })

        hallucination_ratio = len(hallucinations) / len(assertions)
        self.score = 1.0 - hallucination_ratio
        self.success = self.score >= self.threshold

        if self.success:
            self.reason = (
                f"All {len(assertions)} assertions are grounded in AC source"
            )
        else:
            details = "\n".join(
                f"  - test[{h['test_idx']}].step[{h['step_idx']}] ({h['type']}): {h['reason']}"
                for h in hallucinations
            )
            self.reason = (
                f"{len(hallucinations)} of {len(assertions)} assertions "
                f"are not grounded ({hallucination_ratio:.0%}):\n{details}"
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
        return "Hallucinated Assertions"
