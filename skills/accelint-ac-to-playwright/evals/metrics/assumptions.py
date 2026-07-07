"""Assumptions metric - did the SUT flag ambiguities instead of silently inventing values?"""

from pathlib import Path

from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, LLMTestCaseParams

# Rubric lives entirely in evaluation_steps (GEval: steps OR criteria, never
# both). No score scale in the steps — GEval's own prompt owns the 0-10 scale.
RUBRIC_STEPS = [
    "You are evaluating how the agent handled AMBIGUITIES in the source "
    "acceptance criteria (AC). The AC text is supplied in retrieval_context. "
    "Ambiguities include: unquoted fill/select values ('a valid email', 'any "
    "password', 'the first option'), vague action verbs ('interact with', "
    "'uses', 'handles'), missing target intent ('clicks the button' with no "
    "identification of which button), and missing or implied expected outcomes.",
    "Read retrieval_context (the source AC) and enumerate any ambiguities: "
    "unquoted fill values, vague verbs, missing target intent, missing explicit outcomes.",
    "If no ambiguities exist, the agent had nothing to flag — score perfect and stop.",
    "For each ambiguity, inspect actual_output: did the agent flag it, "
    "ask for clarification, or surface a labeled assumption?",
    "GOOD: the agent flagged the ambiguous item AND either asked for "
    "clarification or made a reasonable assumption clearly labeled as one "
    "(e.g. \"Assumption: using 'test@example.com' as a placeholder — please "
    "confirm\"). BAD: the agent silently invented a concrete value with no "
    "acknowledgement that the AC was vague. Penalize each silent invention.",
]

# Recalibration tripwire (eval-architect audit check #12): sha256[:16] of
# "\n".join(RUBRIC_STEPS). Enforced by tests/test_rubric_hashes.py; a rubric
# edit requires updating this literal AND recalibrating the threshold.
RUBRIC_HASH = "c6e54bea9fb67104"


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

    # Class-level copies so record_metric call sites can pass
    # rubric_hash=metric.RUBRIC_HASH without extra imports.
    RUBRIC_HASH = RUBRIC_HASH
    RUBRIC_SOURCE = "metrics/assumptions.py"

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

        super().__init__(
            name="Assumptions",
            evaluation_steps=RUBRIC_STEPS,
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
        self._ensure_required_fields(test_case)
        return super().measure(test_case, *args, **kwargs)

    async def a_measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        """Async version."""
        self._ensure_required_fields(test_case)
        return await super().a_measure(test_case, *args, **kwargs)

    def _ensure_required_fields(self, test_case: LLMTestCase) -> None:
        if not test_case.retrieval_context:
            test_case.retrieval_context = [self.ac_source]
        if not test_case.expected_output:
            test_case.expected_output = (
                "No reference output provided - judge should evaluate solely "
                "against the AC source in retrieval_context."
            )
