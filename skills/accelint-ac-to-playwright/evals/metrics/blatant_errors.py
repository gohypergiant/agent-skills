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

from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, LLMTestCaseParams

# Rubric lives entirely in evaluation_steps (GEval: steps OR criteria, never
# both). No score scale in the steps — GEval's own prompt owns the 0-10 scale.
RUBRIC_STEPS = [
    "You are looking ONLY for BLATANT errors: internal contradictions, factual "
    "self-references that don't match, structural malformations, or claims "
    "that contradict another claim within the same output. You are NOT judging "
    "correctness against the source AC, nor overall quality — a clean, "
    "internally consistent output (even if wrong against the source) is perfect.",
    "Read the actual_output end-to-end without comparing it to any reference.",
    "Look for self-contradictions, e.g.: a report that says '✓ AC are "
    "conversion-ready' and then lists issues; '0 issues found' followed by "
    "enumerated problems; a summary claiming '5 tests' when only 3 appear; the "
    "same tag at both suite and test level; references to scenarios, fixtures, "
    "or files that the source it claims to work from does not contain.",
    "Look for structural malformations: unclosed code fences, broken markdown, "
    "truncated JSON, mid-sentence cut-offs.",
    "Penalize each distinct blatant error proportionally; an output with no "
    "blatant errors is perfect.",
]

# Recalibration tripwire (eval-architect audit check #12): sha256[:16] of
# "\n".join(RUBRIC_STEPS). Enforced by tests/test_rubric_hashes.py; a rubric
# edit requires updating this literal AND recalibrating the threshold.
RUBRIC_HASH = "48f22135c9e9e20b"


class BlatantErrorsMetric(GEval):
    """Detects internal contradictions and obviously-wrong outputs.

    Score 1.0 means no blatant errors. Each contradiction, factual
    self-reference error, or structural malformation costs proportional score.
    """

    # Class-level copies so record_metric call sites can pass
    # rubric_hash=metric.RUBRIC_HASH without extra imports.
    RUBRIC_HASH = RUBRIC_HASH
    RUBRIC_SOURCE = "metrics/blatant_errors.py"

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
        super().__init__(
            name="Blatant Errors",
            evaluation_steps=RUBRIC_STEPS,
            evaluation_params=[LLMTestCaseParams.ACTUAL_OUTPUT],
            model=judge_model,
            threshold=threshold,
        )

    def measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        """Measure blatant-error rate."""
        return super().measure(test_case, *args, **kwargs)

    async def a_measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        """Async version."""
        return await super().a_measure(test_case, *args, **kwargs)
