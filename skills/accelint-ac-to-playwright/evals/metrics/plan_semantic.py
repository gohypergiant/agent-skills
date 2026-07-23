"""Plan semantic quality metric - GEval-based holistic evaluation."""

from pathlib import Path
from typing import Optional

from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, LLMTestCaseParams


class PlanSemanticMetric(GEval):
    """Evaluates semantic correctness of AC → JSON plan conversion.

    Uses LLM-as-judge to assess:
    - Every AC scenario maps to a plan test (1:1)
    - Every AC step maps to a plan action (coverage, no inventions)
    - Target pattern follows area.component.intent
    - No assertions absent from AC text
    - Follows SKILL.md Output Rules
    """

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

        # Build evaluation criteria
        criteria = """
You are evaluating the semantic correctness of an AC-to-JSON plan conversion
for the accelint-ac-to-playwright skill.

Evaluate the following dimensions:

1. **Completeness**: Every scenario in the AC source maps to exactly one test
   in the plan. No scenarios are dropped or duplicated.

2. **Step Coverage**: Every action step in the AC (When/And) corresponds to an
   action in the plan's steps array. No steps are dropped or invented.

3. **Target Pattern Compliance**: All targets in the plan follow the
   area.component.intent pattern. Valid areas: nav, header, footer, form,
   drawer, card, toast, modal, table, page, area. Valid components: button,
   link, input, dropdown, checkbox, radio, text, div, component.

4. **Grounded Assertions**: Assertions (expectText, expectVisible,
   expectNotVisible, expectUrl) only appear when the AC explicitly states
   expected outcomes. No assertions are invented.

5. **Action-Element Compatibility**: Fill actions only on input/textarea
   targets. Select actions only on dropdown targets. Click actions on button/
   link targets. No semantic mismatches.

6. **Output Rules Compliance**: Follows SKILL.md section "Output Rules":
   - Start URL defaults to '/' unless AC specifies otherwise
   - Steps preserve AC order
   - No goto actions (navigation via clicks only)
   - Visibility changes get expectNotVisible before + expectVisible after
        """

        evaluation_steps = [
            "Parse both the AC source and the generated plan",
            "Check 1:1 mapping between scenarios and tests",
            "Verify all AC steps have corresponding plan actions",
            "Validate target patterns against controlled vocabulary",
            "Trace assertions back to AC source lines",
            "Check action-element type compatibility",
            "Verify compliance with SKILL.md Output Rules",
            "Assign a score from 0 to 1 based on the number and severity of issues",
        ]

        super().__init__(
            name="Plan Semantic Quality",
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
        """Measure semantic quality."""
        if not test_case.retrieval_context:
            test_case.retrieval_context = [self.ac_source]
        # Provide a placeholder for EXPECTED_OUTPUT — the LLM judge compares the
        # plan against the AC source via retrieval_context, so we don't need a
        # reference plan, but DeepEval enforces all evaluation_params are populated.
        if not test_case.expected_output:
            test_case.expected_output = (
                "No reference plan provided — judge should evaluate solely "
                "against the AC source in retrieval_context."
            )

        return super().measure(test_case, *args, **kwargs)

    async def a_measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        """Async version."""
        if not test_case.retrieval_context:
            test_case.retrieval_context = [self.ac_source]
        if not test_case.expected_output:
            test_case.expected_output = (
                "No reference plan provided — judge should evaluate solely "
                "against the AC source in retrieval_context."
            )

        return await super().a_measure(test_case, *args, **kwargs)
