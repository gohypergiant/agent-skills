"""Clarification-needed metric - counts clarification questions in SUT output.

For perfect AC the model should produce no clarification requests; for not-ready
AC, some clarification is expected and good. The metric scores against a
per-scenario expected band passed at construction.
"""

import re
from typing import Optional

from deepeval.metrics import BaseMetric
from deepeval.test_case import LLMTestCase


_CLARIFICATION_PHRASES = (
    "should i",
    "would you like",
    "do you want",
    "could you",
    "please provide",
    "please clarify",
    "which one",
    "what should",
    "can you confirm",
    "which value",
    "please specify",
)

_SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+")


class ClarificationNeededMetric(BaseMetric):
    """Score how well the SUT's clarification volume matches expectations.

    Counts sentences that look like clarification requests (end with '?' and
    contain a known clarification phrase) and compares the count to a band:
    in-band → 1.0, under → count/expected_min, over → expected_max/count.
    """

    def __init__(
        self,
        expected_min: int = 0,
        expected_max: int = 0,
        threshold: float = 1.0,
    ):
        """Initialize the metric.

        Args:
            expected_min: Inclusive lower bound on expected clarification count.
            expected_max: Inclusive upper bound on expected clarification count.
            threshold: Score threshold for success (default 1.0 = must be in band).
        """
        if expected_min < 0 or expected_max < 0:
            raise ValueError("expected_min and expected_max must be non-negative")
        if expected_max < expected_min:
            raise ValueError("expected_max must be >= expected_min")

        self.expected_min = expected_min
        self.expected_max = expected_max
        self.threshold = threshold
        self.score = 0.0
        self.success = False
        self.reason: Optional[str] = None

    def measure(self, test_case: LLMTestCase) -> float:
        """Measure clarification count against expected band.

        Args:
            test_case: Contains actual_output (the full SUT response string).

        Returns:
            Score in [0, 1].
        """
        output = test_case.actual_output or ""

        clarifications = self._detect_clarifications(output)
        count = len(clarifications)

        if self.expected_min <= count <= self.expected_max:
            self.score = 1.0
        elif count < self.expected_min:
            self.score = count / max(self.expected_min, 1)
        else:  # count > expected_max
            self.score = self.expected_max / count if count > 0 else 0.0

        # Clamp to [0, 1].
        if self.score > 1.0:
            self.score = 1.0
        elif self.score < 0.0:
            self.score = 0.0

        self.success = self.score >= self.threshold

        if self.expected_min == self.expected_max:
            band = f"exactly {self.expected_min}"
        else:
            band = f"{self.expected_min}-{self.expected_max}"

        sample = ""
        if clarifications:
            sampled = [s[:80] for s in clarifications[:3]]
            sample = " Examples: " + " | ".join(f"'{s}'" for s in sampled)

        self.reason = (
            f"Detected {count} clarification question(s); expected {band}.{sample}"
        )

        return self.score

    def _detect_clarifications(self, output: str) -> list[str]:
        """Return list of sentences that look like clarification requests."""
        if not output:
            return []
        sentences = _SENTENCE_SPLIT_RE.split(output)
        results: list[str] = []
        for sentence in sentences:
            trimmed = sentence.strip()
            if not trimmed.endswith("?"):
                continue
            lowered = trimmed.lower()
            if any(phrase in lowered for phrase in _CLARIFICATION_PHRASES):
                results.append(trimmed)
        return results

    async def a_measure(self, test_case: LLMTestCase) -> float:
        """Async version (delegates to sync)."""
        return self.measure(test_case)

    def is_successful(self) -> bool:
        """Return whether the metric passed."""
        return self.success

    @property
    def __name__(self):
        return "Clarification Needed"
