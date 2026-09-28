"""Structural validation metric - shells out to production Zod validator CLI."""

import json
import subprocess
import tempfile
from pathlib import Path
from typing import Optional

from deepeval.metrics import BaseMetric
from deepeval.test_case import LLMTestCase

from metrics._json_extraction import PlanExtractionError, extract_plan_json


class PlanStructuralMetric(BaseMetric):
    """Validates plan JSON against the production Zod schema.

    Shells out to `node scripts/cli/validate-plan.js` to ensure we're testing
    against the actual schema that production uses, not a Python reimplementation.
    """

    def __init__(self, threshold: float = 1.0):
        """Initialize the metric.

        Args:
            threshold: Must be 1.0 (pass/fail only, no partial credit)
        """
        self.threshold = threshold
        self.score = 0.0
        self.success = False
        self.reason: Optional[str] = None

    def measure(self, test_case: LLMTestCase) -> float:
        """Measure structural validity by invoking the Zod validator CLI.

        Args:
            test_case: Contains actual_output (the generated plan JSON as string)

        Returns:
            1.0 if valid, 0.0 if invalid
        """
        # Extract plan JSON from test case. The SUT prompt asks for a
        # ```json``` fenced block, but we tolerate raw JSON too.
        try:
            plan_data = extract_plan_json(test_case.actual_output)
        except PlanExtractionError as e:
            self.score = 0.0
            self.success = False
            self.reason = f"Could not extract JSON plan from response: {e}"
            return self.score

        # Write to temp file for CLI
        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".json",
            delete=False,
        ) as f:
            json.dump(plan_data, f, indent=2)
            temp_path = Path(f.name)

        try:
            # Find skill root (evals/ is sibling to scripts/)
            skill_root = Path(__file__).parent.parent.parent

            # Shell out to validator CLI
            result = subprocess.run(
                ["node", "dist/scripts/cli/validate-plan.js", str(temp_path)],
                cwd=skill_root,
                capture_output=True,
                text=True,
                timeout=10,
            )

            if result.returncode == 0:
                self.score = 1.0
                self.success = True
                self.reason = "Plan passes Zod schema validation"
            else:
                self.score = 0.0
                self.success = False
                self.reason = f"Zod validation failed:\n{result.stderr}"

        except subprocess.TimeoutExpired:
            self.score = 0.0
            self.success = False
            self.reason = "Validator CLI timed out (>10s)"

        except FileNotFoundError:
            self.score = 0.0
            self.success = False
            self.reason = (
                "Validator CLI not found. Did you run 'npm run build' "
                "from the skill root?"
            )

        finally:
            temp_path.unlink(missing_ok=True)

        return self.score

    async def a_measure(self, test_case: LLMTestCase) -> float:
        """Async version (delegates to sync)."""
        return self.measure(test_case)

    def is_successful(self) -> bool:
        """Return whether the metric passed."""
        return self.success

    @property
    def __name__(self):
        return "Plan Structural"
