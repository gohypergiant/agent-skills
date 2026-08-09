"""Blatant errors metric - LLM-as-judge check for internal inconsistencies.

This metric is a safety net for the kinds of obviously-wrong outputs that the
deterministic and semantic metrics can each individually miss: a report that
declares "AC are conversion-ready" and then enumerates issues, a plan that
claims "5 tests" in prose but only includes 3, garbled markdown, references to
scenarios or fixtures that aren't in the source, etc.

It's intentionally narrow — we're not asking the judge to assess *correctness*
(other metrics handle that), only whether the output contradicts itself or is
structurally malformed.
"""

from typing import Optional

from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, LLMTestCaseParams


class BlatantErrorsMetric(GEval):
    """Detects internal contradictions and obviously-wrong outputs.

    Score 1.0 means no blatant errors. Each contradiction, factual
    self-reference error, or structural malformation costs proportional score.
    """

    def __init__(
        self,
        judge_model,
        threshold: float = 0.9,
    ):
        """Initialize the metric.

        Args:
            judge_model: The configured LiteLLM judge instance
            threshold: Minimum score to pass (0.9 = at most one minor blip)
        """
        criteria = """
You are evaluating whether the agent's output contains any BLATANT errors —
internal contradictions, factual self-references that don't match, structural
malformations, or claims that contradict another claim within the same output.

You are NOT evaluating whether the output is correct against the source AC,
nor whether the output is high quality. You are ONLY looking for outputs that
contradict THEMSELVES or are obviously malformed on their face.

Examples of blatant errors:
- Report says "✓ AC are conversion-ready" and then lists issues to fix
- Report says "0 issues found" and then enumerates problems
- JSON plan claims "5 tests" in a header/summary but only includes 3
- Same tag listed at both the suite level and a test level (SKILL.md forbids
  tag duplication across levels)
- Output references scenarios, fixtures, or files that don't exist in the
  source it claims to be working from (i.e. the agent invented a name)
- Garbled formatting: incomplete markdown headings, unclosed code blocks,
  truncated JSON, mid-sentence cut-offs

A clean, internally consistent output (even if it's wrong against the source)
should score 1.0. Penalise each distinct blatant error proportionally.
"""

        evaluation_steps = [
            "Read the actual_output end-to-end without comparing it to any reference.",
            "Look for structural malformations: unclosed code fences, broken "
            "markdown, truncated JSON, mid-sentence cut-offs, duplicate tags across "
            "suite and test levels.",
            "Assign 1.0 if the output is internally consistent and well-formed; "
            "subtract proportional credit for each distinct contradiction or "
            "structural error.",
        ]

        super().__init__(
            name="Blatant Errors",
            criteria=criteria,
            evaluation_steps=evaluation_steps,
            evaluation_params=[LLMTestCaseParams.ACTUAL_OUTPUT],
            model=judge_model,
            threshold=threshold,
        )

    def measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        """Measure blatant-error rate.

        Args:
            test_case: Contains actual_output (the SUT response to evaluate).

        Returns:
            Score from 0 (many errors) to 1 (clean output).
        """
        return super().measure(test_case, *args, **kwargs)

    async def a_measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        """Async version."""
        return await super().a_measure(test_case, *args, **kwargs)
