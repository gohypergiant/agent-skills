"""Goal accuracy metric - measures how accurately the agent achieved the intended goal."""

from pathlib import Path
from typing import Optional

from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, LLMTestCaseParams


class GoalAccuracyMetric(GEval):
    """Evaluates how accurately the agent achieved the specific goal.

    For conversion mode: Did the agent create an accurate JSON plan that correctly
    represents the AC input?

    For assessment mode: Did the agent accurately identify the real issues in the AC?
    """

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

        if mode == "conversion":
            criteria = """
You are evaluating how ACCURATELY the agent converted acceptance criteria (AC)
into a JSON test plan.

The goal is to create a plan that:
1. Captures all scenarios from the AC (no dropped scenarios)
2. Represents each scenario's steps accurately (no missing or extra steps)
3. Uses correct targets that match the AC text
4. Uses correct values (quoted literals from AC, not invented)
5. Includes appropriate assertions based on AC expectations

Accuracy is HIGH when:
- Every AC scenario maps to a plan test
- Every AC step maps to a plan action
- Targets, values, and assertions match the AC source
- No inventions or hallucinations

Accuracy is LOW when:
- Scenarios are dropped or added
- Steps are missing, added, or reordered incorrectly
- Targets don't match AC text (wrong area/component/intent)
- Values are invented instead of quoted from AC
- Assertions are hallucinated

Score from 0 (completely inaccurate) to 1 (perfectly accurate).
"""

            evaluation_steps = [
                "Compare the number of scenarios in AC vs tests in plan",
                "For each test, verify steps match the AC scenario",
                "Check targets against AC text for accuracy",
                "Verify fill/select values are quoted from AC, not invented",
                "Check assertions are grounded in AC expectations",
                "Identify any dropped, added, or misrepresented content",
                "Assign a score based on accuracy (0 = many errors, 1 = nearly perfect)",
            ]

        else:  # assessment mode
            criteria = """
You are evaluating how ACCURATELY the agent identified issues in the acceptance
criteria (AC).

The goal is to find real problems:
1. Structural issues (invalid Gherkin, wrong step ordering)
2. Target pattern violations (missing area/component/intent)
3. Action clarity issues (vague verbs, missing values)
4. Assertion issues (no visibility triggers, vague outcomes)

Accuracy is HIGH when:
- All real issues are detected (no false negatives)
- No non-issues are flagged (no false positives)
- Issue descriptions are specific and correct
- Line references are accurate

Accuracy is LOW when:
- Real issues are missed
- Non-issues are flagged as problems
- Issue descriptions are vague or incorrect
- Line references are wrong

Score from 0 (completely inaccurate) to 1 (perfectly accurate).
"""

            evaluation_steps = [
                "Identify the real issues in the AC (structural, targets, actions, assertions)",
                "Check if the agent's report detected all real issues",
                "Check for false positives (flagged non-issues)",
                "Verify issue descriptions are specific and correct",
                "Verify line/scenario references are accurate",
                "Calculate accuracy: (true_positives - false_positives) / total_real_issues",
                "Assign a score from 0 to 1 based on detection accuracy",
            ]

        super().__init__(
            name="Goal Accuracy",
            criteria=criteria,
            evaluation_steps=evaluation_steps,
            evaluation_params=[
                LLMTestCaseParams.ACTUAL_OUTPUT,
                LLMTestCaseParams.EXPECTED_OUTPUT,
                LLMTestCaseParams.RETRIEVAL_CONTEXT,
            ],
            model=judge_model,
            threshold=threshold,
        )

    def measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        """Measure goal accuracy.

        Args:
            test_case: Contains actual_output, retrieval_context (AC source)

        Returns:
            Score from 0 to 1
        """
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
