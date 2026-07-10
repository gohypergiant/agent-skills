"""Step efficiency metric - detects unnecessary content / output bloat."""

import json
import re
from typing import Optional

from deepeval.metrics import BaseMetric
from deepeval.test_case import LLMTestCase

from metrics._json_extraction import PlanExtractionError, extract_plan_json


# Markers that signal the start of the "essential" content in assessment mode.
_ASSESSMENT_MARKERS = (
    "❌ ac are not conversion-ready",
    "✓ ac are conversion-ready",
    "# assessment",
)

# Outputs shorter than this floor are too small to meaningfully measure.
_MIN_OUTPUT_FOR_MEASUREMENT = 200


class StepEfficiencyMetric(BaseMetric):
    """Measure how much of the SUT's reply is actual deliverable content vs filler.

    Heuristic: compute essential_len / output_len. Conversion mode treats the
    canonical (compact) JSON dump of the parsed plan as essential. Assessment
    mode treats the section starting from the first recognised report-opening
    marker as essential. Anything below ~70% is bloated.

    Notes:
      - Outputs shorter than ``_MIN_OUTPUT_FOR_MEASUREMENT`` chars score 1.0
        because they're too small to penalise meaningfully (no room for fluff).
      - Conversion mode that emits no parseable JSON scores 0.0 with the reason
        "no plan found" — same failure mode the structural metric flags.
    """

    def __init__(self, mode: str, threshold: float = 0.7):
        """Initialize the metric.

        Args:
            mode: "assessment" or "conversion"
            threshold: Minimum essential/output ratio to pass (default 0.7).
        """
        if mode not in ("assessment", "conversion"):
            raise ValueError(
                f"mode must be 'assessment' or 'conversion', got {mode!r}"
            )
        self.mode = mode
        self.threshold = threshold
        self.score = 0.0
        self.success = False
        self.reason: Optional[str] = None

    def measure(self, test_case: LLMTestCase) -> float:
        """Measure essential content ratio.

        Args:
            test_case: Contains actual_output (the SUT's full reply).

        Returns:
            Score in [0, 1].
        """
        output = test_case.actual_output or ""
        output_len = len(output)

        # Floor: outputs too short to measure meaningfully always pass.
        if output_len < _MIN_OUTPUT_FOR_MEASUREMENT:
            self.score = 1.0
            self.success = True
            self.reason = f"Output too short to measure ({output_len} chars < {_MIN_OUTPUT_FOR_MEASUREMENT})."
            return self.score

        if self.mode == "conversion":
            try:
                plan = extract_plan_json(output)
            except PlanExtractionError as e:
                self.score = 0.0
                self.success = False
                self.reason = f"No plan found ({e}); cannot compute efficiency."
                return self.score
            essential_len = len(json.dumps(plan))
        else:  # assessment
            essential_start = -1
            lowered = output.lower()
            for marker in _ASSESSMENT_MARKERS:
                idx = lowered.find(marker)
                if idx >= 0 and (essential_start == -1 or idx < essential_start):
                    essential_start = idx
            if essential_start == -1:
                # No marker found — treat full output as essential (no penalty).
                essential_len = output_len
            else:
                essential_len = output_len - essential_start

        ratio = essential_len / output_len if output_len > 0 else 0.0
        ratio = max(0.0, min(1.0, ratio))

        self.score = ratio
        self.success = self.score >= self.threshold

        pct = int(round(ratio * 100))
        if self.success:
            self.reason = (
                f"Essential content fills {essential_len} of {output_len} chars "
                f"({pct}%); meets {int(self.threshold * 100)}% threshold."
            )
        else:
            self.reason = (
                f"Essential content is {essential_len} of {output_len} chars "
                f"({pct}%); below {int(self.threshold * 100)}% threshold suggests "
                f"excess preamble."
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
        return "Step Efficiency"
