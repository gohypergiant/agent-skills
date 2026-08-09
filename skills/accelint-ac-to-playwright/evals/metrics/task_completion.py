"""Task completion metric - evaluates whether the agent accomplished its goal."""

from pathlib import Path
from typing import Optional

from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, LLMTestCaseParams


class TaskCompletionMetric(GEval):
    """Evaluates whether the agent completed the requested task.

    For conversion mode: Did the agent generate a valid JSON plan from the AC?
    For assessment mode: Did the agent identify and report AC issues?
    """

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

        if mode == "conversion":
            criteria = """
You are evaluating whether the agent successfully completed the task of converting
acceptance criteria (AC) into a JSON test plan.

The task is COMPLETE if:
1. The agent produced a JSON output
2. The JSON represents a test plan (has suiteName, tests array, etc.)
3. The agent did not give up, request clarification, or refuse the task
4. The output is a complete attempt at conversion (not partial or truncated)

The task is INCOMPLETE if:
- The agent refused or said it cannot convert
- The agent only provided feedback without generating a plan
- The output is clearly partial or cut off mid-generation
- The agent got confused about what was being asked

Note: This metric evaluates COMPLETION, not correctness. A complete but flawed
plan scores high; a refusal scores low.
"""

            evaluation_steps = [
                "Check if the agent produced JSON output",
                "Verify the output represents a test plan structure",
                "Check for refusal, confusion, or requests for more information",
                "Determine if the output is complete or partial",
                "Assign a score from 0 (did not attempt) to 1 (fully completed)",
            ]

        else:  # assessment mode
            criteria = """
You are evaluating whether the agent successfully completed the task of assessing
acceptance criteria (AC) and providing feedback.

The task is COMPLETE if:
1. The agent produced an assessment report
2. The report follows the expected format (lists issues or confirms AC are ready)
3. The agent did not refuse, get confused, or fail to provide feedback
4. The output is a complete assessment (not partial or truncated)

The task is INCOMPLETE if:
- The agent refused or said it cannot assess
- The agent provided a plan instead of an assessment
- The output is clearly partial or cut off mid-generation
- The agent got confused about what was being asked

Note: This metric evaluates COMPLETION, not quality. A complete but inaccurate
assessment scores high; a refusal scores low.
"""

            evaluation_steps = [
                "Check if the agent produced an assessment report",
                "Verify the report has the expected format (issues list or pass statement)",
                "Check for refusal, confusion, or mode misunderstanding",
                "Determine if the output is complete or partial",
                "Assign a score from 0 (did not attempt) to 1 (fully completed)",
            ]

        super().__init__(
            name="Task Completion",
            criteria=criteria,
            evaluation_steps=evaluation_steps,
            evaluation_params=[LLMTestCaseParams.ACTUAL_OUTPUT],
            model=judge_model,
            threshold=threshold,
        )
