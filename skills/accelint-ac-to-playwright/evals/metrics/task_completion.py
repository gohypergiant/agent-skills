"""Task completion metric - evaluates whether the agent accomplished its goal."""

from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, LLMTestCaseParams

# GEval accepts criteria OR evaluation_steps, never both (criteria exists only
# to auto-generate steps via an extra judge call), so the full rubric lives in
# the steps. Never restate a score scale in a step: GEval's own prompt asks the
# judge for an integer 0-10 and normalizes by /10 — a step saying "0 to 1"
# makes a literal judge emit 0/1 and the threshold becomes unreachable.

_CONVERSION_STEPS = [
    "You are evaluating whether the agent COMPLETED the task of converting "
    "acceptance criteria (AC) into a JSON test plan. Completion, not "
    "correctness: a complete but flawed plan scores high; a refusal scores low.",
    "Check if the agent produced JSON output representing a test plan "
    "(has suiteName, tests array, etc.).",
    "Check for refusal, confusion, requests for more information, or "
    "feedback-only replies with no plan — these are INCOMPLETE.",
    "Determine if the output is a complete attempt (not partial or truncated "
    "mid-generation).",
]

_ASSESSMENT_STEPS = [
    "You are evaluating whether the agent COMPLETED the task of assessing "
    "acceptance criteria (AC) and providing feedback. Completion, not quality: "
    "a complete but inaccurate assessment scores high; a refusal scores low.",
    "Check if the agent produced an assessment report in the expected format "
    "(issues list or a conversion-ready statement).",
    "Check for refusal, confusion, or mode misunderstanding (a JSON plan "
    "instead of an assessment is INCOMPLETE).",
    "Determine if the output is a complete assessment (not partial or "
    "truncated mid-generation).",
]

# All rubric text of this module, in declared order — hashed by RUBRIC_HASH.
RUBRIC_STEPS = _CONVERSION_STEPS + _ASSESSMENT_STEPS

# Recalibration tripwire (eval-architect audit check #12): sha256[:16] of
# "\n".join(RUBRIC_STEPS). A rubric edit invalidates thresholds like a model
# change does. The self-check in tests/test_rubric_hashes.py enforces this
# literal; update it (the failure message prints the value) and RECALIBRATE.
RUBRIC_HASH = "c37eb0ac93dada2f"


class TaskCompletionMetric(GEval):
    """Evaluates whether the agent completed the requested task.

    For conversion mode: Did the agent generate a valid JSON plan from the AC?
    For assessment mode: Did the agent identify and report AC issues?
    """

    # Class-level copies so record_metric call sites can pass
    # rubric_hash=metric.RUBRIC_HASH without extra imports.
    RUBRIC_HASH = RUBRIC_HASH
    RUBRIC_SOURCE = "metrics/task_completion.py"

    def __init__(
        self,
        judge_model,
        mode: str,
        threshold: float = 0.9,
    ):
        """Initialize the metric.

        Args:
            judge_model: The configured LiteLLM judge instance
            mode: "conversion" or "assessment"
            threshold: Minimum score to pass (0.9 = 90%)
        """
        self.mode = mode

        super().__init__(
            name="Task Completion",
            evaluation_steps=(
                _CONVERSION_STEPS if mode == "conversion" else _ASSESSMENT_STEPS
            ),
            evaluation_params=[LLMTestCaseParams.ACTUAL_OUTPUT],
            model=judge_model,
            threshold=threshold,
        )

    def measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        return super().measure(test_case, *args, **kwargs)

    async def a_measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        return await super().a_measure(test_case, *args, **kwargs)
