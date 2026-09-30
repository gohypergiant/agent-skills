"""Plan semantic quality metric - GEval-based holistic evaluation."""

from pathlib import Path

from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, LLMTestCaseParams

# Rubric lives entirely in evaluation_steps (GEval: steps OR criteria, never
# both). No score scale in the steps — GEval's own prompt owns the 0-10 scale.
RUBRIC_STEPS = [
    "You are evaluating the semantic correctness of an AC-to-JSON plan "
    "conversion. Dimensions: (1) Completeness — every scenario in the AC "
    "source maps to exactly one test in the plan, none dropped or duplicated; "
    "(2) Step Coverage — every action step in the AC (When/And) corresponds "
    "to a plan action, none dropped or invented; (3) Target Pattern "
    "Compliance — targets follow area.component.intent with valid areas "
    "(nav, header, footer, form, drawer, card, toast, modal, table, page, "
    "area) and components (button, link, input, dropdown, checkbox, radio, "
    "text, div, component); (4) Grounded Assertions — expectText/"
    "expectVisible/expectNotVisible/expectUrl appear only where the AC states "
    "expected outcomes; (5) Action-Element Compatibility — fill on inputs, "
    "select on dropdowns, click on buttons/links; (6) Output Rules — start "
    "URL defaults to '/', steps preserve AC order, no goto actions, "
    "visibility changes get expectNotVisible before + expectVisible after.",
    "Parse both the AC source and the generated plan",
    "Check 1:1 mapping between scenarios and tests",
    "Verify all AC steps have corresponding plan actions",
    "Validate target patterns against controlled vocabulary",
    "Trace assertions back to AC source lines",
    "Check action-element type compatibility",
    "Verify compliance with SKILL.md Output Rules",
    "Weigh the number and severity of issues found across all six dimensions",
]

# Recalibration tripwire (eval-architect audit check #12): sha256[:16] of
# "\n".join(RUBRIC_STEPS). Enforced by tests/test_rubric_hashes.py; a rubric
# edit requires updating this literal AND recalibrating the threshold.
RUBRIC_HASH = "998d0f2e22605042"


class PlanSemanticMetric(GEval):
    """Evaluates semantic correctness of AC → JSON plan conversion.

    Uses LLM-as-judge to assess:
    - Every AC scenario maps to a plan test (1:1)
    - Every AC step maps to a plan action (coverage, no inventions)
    - Target pattern follows area.component.intent
    - No assertions absent from AC text
    - Follows SKILL.md Output Rules
    """

    # Class-level copies so record_metric call sites can pass
    # rubric_hash=metric.RUBRIC_HASH without extra imports.
    RUBRIC_HASH = RUBRIC_HASH
    RUBRIC_SOURCE = "metrics/plan_semantic.py"

    def __init__(
        self,
        judge_model,
        ac_source_path: Path,
        threshold: float = 0.8,
    ):
        """Initialize the metric.

        Args:
            judge_model: The configured LiteLLM judge instance
            ac_source_path: Path to the source AC file for reference
            threshold: Minimum score to pass (0.8 = 80%)
        """
        # Load AC source for context
        if not ac_source_path.exists():
            raise FileNotFoundError(f"AC source not found: {ac_source_path}")

        self.ac_source = ac_source_path.read_text(encoding="utf-8")

        super().__init__(
            name="Plan Semantic Quality",
            evaluation_steps=RUBRIC_STEPS,
            evaluation_params=[
                LLMTestCaseParams.ACTUAL_OUTPUT,
                LLMTestCaseParams.EXPECTED_OUTPUT,
                LLMTestCaseParams.RETRIEVAL_CONTEXT,
            ],
            model=judge_model,
            threshold=threshold,
        )

    def measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        """Measure semantic quality."""
        self._ensure_required_fields(test_case)
        return super().measure(test_case, *args, **kwargs)

    async def a_measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        """Async version."""
        self._ensure_required_fields(test_case)
        return await super().a_measure(test_case, *args, **kwargs)

    def _ensure_required_fields(self, test_case: LLMTestCase) -> None:
        """Populate ``retrieval_context`` (AC source) and a placeholder
        ``expected_output`` — the judge compares the plan against the AC source
        via retrieval_context, but DeepEval enforces all evaluation_params."""
        if not test_case.retrieval_context:
            test_case.retrieval_context = [self.ac_source]
        if not test_case.expected_output:
            test_case.expected_output = (
                "No reference plan provided — judge should evaluate solely "
                "against the AC source in retrieval_context."
            )
