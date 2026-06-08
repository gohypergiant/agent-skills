"""Assumptions metric - did the SUT flag ambiguities instead of silently inventing values?"""

from pathlib import Path
from typing import Optional

from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, LLMTestCaseParams


class AssumptionsMetric(GEval):
    """Evaluates how the SUT handled ambiguities in the source AC.

    The skill's Recognition Patterns section is explicit: when AC are vague
    (missing fill values like "a valid email", missing target intent, vague
    verbs like "interact"), the agent must either ask for clarification or
    surface an explicit, labeled assumption. Silently inventing concrete
    values (e.g., choosing ``test@example.com`` for "a valid email" with no
    acknowledgement) is a failure mode that produces tests grounded in
    fabricated data.

    Rubric (applied by the judge):
      - Good: SUT flagged ambiguous items, asked for clarification, OR made a
        reasonable assumption AND clearly labeled it as an assumption.
      - Bad: SUT silently picked a value with no acknowledgement.
      - Neutral: AC contained no ambiguities; metric should score 1.0.
    """

    def __init__(
        self,
        judge_model,
        ac_source_path: Path,
        threshold: float = 0.7,
    ):
        """Initialize the metric.

        Args:
            judge_model: The configured LiteLLM judge instance
            ac_source_path: Path to the source AC file (used as retrieval_context)
            threshold: Minimum score to pass (0.7 = 70%)
        """
        if not ac_source_path.exists():
            raise FileNotFoundError(f"AC source not found: {ac_source_path}")

        self.ac_source = ac_source_path.read_text(encoding="utf-8")

        criteria = """
You are evaluating how the agent handled AMBIGUITIES in the source acceptance
criteria (AC). The AC text is supplied in retrieval_context.

Ambiguities include (non-exhaustive):
  - Unquoted fill / select values such as "a valid email", "any password",
    "some text", "the first option" - the AC does not commit to a literal.
  - Vague action verbs such as "interact with", "uses", "handles" that do not
    map cleanly to a Playwright action.
  - Missing target intent (e.g., "clicks the button" with no identification
    of which button).
  - Missing or implied expected outcomes (the AC says the user "submits" but
    never states what should be visible / which URL to land on).

Rubric:
  - GOOD (high score): The agent flagged the ambiguous item AND either
    (a) asked the user for clarification, or (b) made a reasonable assumption
    AND clearly labeled it as an assumption (e.g., "Assumption: using
    'test@example.com' as a placeholder for 'a valid email' - please confirm").
  - BAD (low score): The agent silently invented a concrete value (e.g., wrote
    'test@example.com' or chose a specific dropdown option) without any
    acknowledgement that the AC was vague.
  - NEUTRAL (score 1.0): The AC in retrieval_context contained no ambiguities;
    the agent had nothing to flag.

Inspect the AC text first to enumerate ambiguities. Then inspect the agent's
output for each ambiguity in turn: was it flagged / questioned / labeled, or
silently filled in?

Score 0 (silent invention across the board) to 1 (every ambiguity surfaced,
or no ambiguities existed).
"""

        evaluation_steps = [
            "Read retrieval_context (the source AC) and enumerate any ambiguities: "
            "unquoted fill values, vague verbs, missing target intent, missing explicit outcomes.",
            "If no ambiguities exist, score 1.0 and stop.",
            "For each ambiguity, inspect actual_output: did the agent flag it, "
            "ask for clarification, or surface a labeled assumption?",
            "Assign a score from 0 (every ambiguity silently invented) to "
            "1 (every ambiguity surfaced, or none existed).",
        ]

        super().__init__(
            name="Assumptions",
            criteria=criteria,
            evaluation_steps=evaluation_steps,
            evaluation_params=[
                LLMTestCaseParams.ACTUAL_OUTPUT,
                LLMTestCaseParams.RETRIEVAL_CONTEXT,
                LLMTestCaseParams.EXPECTED_OUTPUT,
            ],
            model=judge_model,
            threshold=threshold,
        )

    def measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        """Measure assumption-handling quality."""
        if not test_case.retrieval_context:
            test_case.retrieval_context = [self.ac_source]
        if not test_case.expected_output:
            test_case.expected_output = (
                "No reference output provided - judge should evaluate solely "
                "against the AC source in retrieval_context."
            )
        return super().measure(test_case, *args, **kwargs)

    async def a_measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        """Async version."""
        if not test_case.retrieval_context:
            test_case.retrieval_context = [self.ac_source]
        if not test_case.expected_output:
            test_case.expected_output = (
                "No reference output provided - judge should evaluate solely "
                "against the AC source in retrieval_context."
            )
        return await super().a_measure(test_case, *args, **kwargs)
