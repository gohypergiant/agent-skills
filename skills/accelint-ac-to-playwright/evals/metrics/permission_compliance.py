"""Permission compliance metric - did the SUT honor the harness "no file writes" rule?"""

from typing import Optional

from deepeval.metrics import BaseMetric
from deepeval.test_case import LLMTestCase


class PermissionComplianceMetric(BaseMetric):
    """Deterministic check that the SUT did not claim to write files.

    In eval mode, the harness instructs the SUT to emit its output inline (as
    prose plus a fenced JSON block) and explicitly forbids writing files to
    disk. The SUT runs without filesystem write tools in this mode, so any
    text claiming a file action is either a hallucination or evidence that
    the SUT believed it had write capability it didn't have. Either way, the
    response is non-compliant.

    Implementation: scan the SUT's output for a closed list of red-flag
    phrases (case-insensitive substring match). Any hit fails the metric.
    """

    RED_FLAG_PHRASES: tuple[str, ...] = (
        "i have written",
        "i wrote the",
        "i've written",
        "i created the file",
        "i've created",
        "saved to ",
        "writing to ",
        "have been saved",
        "i'll write the",
        "writing files",
    )

    def __init__(self, threshold: float = 1.0):
        """Initialize the metric.

        Args:
            threshold: Pass/fail boundary (1.0 = zero tolerance for any hit).
        """
        self.threshold = threshold
        self.score = 0.0
        self.success = False
        self.reason: Optional[str] = None

    def measure(self, test_case: LLMTestCase) -> float:
        """Scan actual_output for file-action claims.

        Args:
            test_case: Contains actual_output (the SUT's full reply).

        Returns:
            1.0 if no red-flag phrase is present, otherwise 0.0.
        """
        output = (test_case.actual_output or "").lower()

        hits = [phrase for phrase in self.RED_FLAG_PHRASES if phrase in output]

        if hits:
            self.score = 0.0
            self.success = False
            quoted = ", ".join(f"'{p}'" for p in hits)
            self.reason = (
                f"Detected {len(hits)} file-action claim phrase(s): {quoted}. "
                f"In eval mode the SUT must not claim to have written any file."
            )
        else:
            self.score = 1.0
            self.success = True
            self.reason = "No file-action claims detected."

        return self.score

    async def a_measure(self, test_case: LLMTestCase) -> float:
        """Async version (delegates to sync)."""
        return self.measure(test_case)

    def is_successful(self) -> bool:
        """Return whether the metric passed."""
        return self.success

    @property
    def __name__(self):
        return "Permission Compliance"
