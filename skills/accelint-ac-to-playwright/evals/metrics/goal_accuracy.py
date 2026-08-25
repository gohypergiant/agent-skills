"""Goal accuracy metric - measures how accurately the agent achieved the intended goal."""

from pathlib import Path

from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, LLMTestCaseParams

# Rubric lives entirely in evaluation_steps (GEval: steps OR criteria, never
# both). No score scale in the steps — GEval's own prompt owns the 0-10 scale.

_CONVERSION_STEPS = [
    "You are evaluating how ACCURATELY the agent converted acceptance criteria "
    "(AC, in retrieval_context) into a JSON test plan. Accuracy is HIGH when "
    "every AC scenario maps to a plan test, every AC step maps to a plan "
    "action, and targets/values/assertions match the AC source. Accuracy is "
    "LOW when scenarios are dropped or added, steps are missing or reordered, "
    "targets don't match the AC text (wrong area/component/intent), values "
    "are invented instead of quoted from the AC, or assertions are hallucinated.",
    "Compare the number of scenarios in AC vs tests in plan",
    "For each test, verify steps match the AC scenario",
    "Check targets against AC text for accuracy",
    "Verify fill/select values are quoted from AC, not invented",
    "Check assertions are grounded in AC expectations",
    "Identify any dropped, added, or misrepresented content",
]

_ASSESSMENT_STEPS = [
    "You are evaluating how ACCURATELY the agent identified issues in the "
    "acceptance criteria (AC, in retrieval_context). Real problems include: "
    "structural issues (invalid Gherkin, wrong step ordering), target pattern "
    "violations (missing area/component/intent), action clarity issues (vague "
    "verbs, missing values), and assertion issues (no visibility triggers, "
    "vague outcomes). Accuracy is HIGH when all real issues are detected with "
    "no false positives, descriptions are specific and correct, and line "
    "references are accurate.",
    "Identify the real issues in the AC (structural, targets, actions, assertions)",
    "Check if the agent's report detected all real issues",
    "Check for false positives (flagged non-issues)",
    "Verify issue descriptions are specific and correct",
    "Verify line/scenario references are accurate",
    "Weigh missed real issues and false positives against the total number of "
    "real issues when judging accuracy",
]

# All rubric text of this module, in declared order — hashed by RUBRIC_HASH.
RUBRIC_STEPS = _CONVERSION_STEPS + _ASSESSMENT_STEPS

# Recalibration tripwire (eval-architect audit check #12): sha256[:16] of
# "\n".join(RUBRIC_STEPS). Enforced by tests/test_rubric_hashes.py; a rubric
# edit requires updating this literal AND recalibrating the threshold.
RUBRIC_HASH = "14a6990dcbe57235"


class GoalAccuracyMetric(GEval):
    """Evaluates how accurately the agent achieved the specific goal.

    For conversion mode: Did the agent create an accurate JSON plan that correctly
    represents the AC input?

    For assessment mode: Did the agent accurately identify the real issues in the AC?
    """

    # Class-level copies so record_metric call sites can pass
    # rubric_hash=metric.RUBRIC_HASH without extra imports.
    RUBRIC_HASH = RUBRIC_HASH
    RUBRIC_SOURCE = "metrics/goal_accuracy.py"

    def __init__(
        self,
        judge_model,
        mode: str,
        ac_source_path: Path,
        threshold: float = 0.8,
    ):
        """Initialize the metric.

        Args:
            judge_model: The configured LiteLLM judge instance
            mode: "conversion" or "assessment"
            ac_source_path: Path to the source AC file for reference
            threshold: Minimum score to pass (0.8 = 80%)
        """
        self.mode = mode

        if not ac_source_path.exists():
            raise FileNotFoundError(f"AC source not found: {ac_source_path}")

        self.ac_source = ac_source_path.read_text(encoding="utf-8")

        super().__init__(
            name="Goal Accuracy",
            evaluation_steps=(
                _CONVERSION_STEPS if mode == "conversion" else _ASSESSMENT_STEPS
            ),
            evaluation_params=[
                LLMTestCaseParams.ACTUAL_OUTPUT,
                LLMTestCaseParams.EXPECTED_OUTPUT,
                LLMTestCaseParams.RETRIEVAL_CONTEXT,
            ],
            model=judge_model,
            threshold=threshold,
        )

    def measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        """Measure goal accuracy."""
        self._ensure_required_fields(test_case)
        return super().measure(test_case, *args, **kwargs)

    async def a_measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        """Async version."""
        self._ensure_required_fields(test_case)
        return await super().a_measure(test_case, *args, **kwargs)

    def _ensure_required_fields(self, test_case: LLMTestCase) -> None:
        """Populate ``retrieval_context`` (AC source) and a placeholder
        ``expected_output`` so DeepEval's required-params check passes even in
        assessment mode (where there is no reference plan to compare against)."""
        if not test_case.retrieval_context:
            test_case.retrieval_context = [self.ac_source]
        if not test_case.expected_output:
            test_case.expected_output = (
                "No reference output provided — judge should grade solely "
                "against the AC source in retrieval_context."
            )
