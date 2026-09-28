"""Plan adherence metric - did the SUT follow the prescribed SKILL.md workflow?"""

from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, LLMTestCaseParams

# Rubric lives entirely in evaluation_steps (GEval: steps OR criteria, never
# both). No score scale in the steps — GEval's own prompt owns the 0-10 scale.

_CONVERSION_STEPS = [
    "You are evaluating whether the agent followed the SKILL.md Conversion "
    "Workflow in the prescribed order: (1) intent detection — recognize the "
    "user wants a full conversion, not an assessment-only review; (2) run "
    "Assessment mode FIRST — inspect the AC for issues before any plan "
    "generation, with visible evidence (a readiness verdict, an issues list, "
    "or an explicit 'AC are conversion-ready' statement); (3) build a JSON "
    "plan ONLY IF assessment passed — on blocking issues the workflow stops "
    "and no plan is produced (a correct halt is full adherence, not a "
    "failure); (4) output the plan inside a fenced ```json``` block at the "
    "end of the reply.",
    "Identify which workflow steps from the Conversion procedure are present "
    "in the actual_output.",
    "Check that the agent ran (or shows clear evidence of running) the "
    "assessment pass BEFORE emitting any JSON plan.",
    "Verify the steps appear in the prescribed order (intent -> assessment -> "
    "plan -> fenced JSON output).",
    "Penalize: skipping the assessment pass, inventing steps outside the "
    "procedure, reordering steps, or omitting the fenced ```json``` block "
    "when a plan was produced. Reward: every prescribed step present, in "
    "order, with no fabricated extras.",
]

_ASSESSMENT_STEPS = [
    "You are evaluating whether the agent followed the SKILL.md Assessment "
    "Workflow in the prescribed order: (1) intent detection — recognize the "
    "user wants an assessment/readiness review, NOT a full conversion; "
    "(2) read references — evidence of consulting the AC rules "
    "(acceptance-criteria.md and the test-hooks controlled vocabulary); "
    "applying the rules counts as implicit evidence; (3) analyze the AC "
    "against the rules (structure & format, target pattern, vocabulary, "
    "action verbs, fill values, explicit outcomes); (4) report findings "
    "WITHOUT writing any files — a prose readiness report with line/scenario "
    "references or a 'conversion-ready' verdict; no JSON plan, no spec file "
    "content.",
    "Identify which workflow steps from the Assessment procedure are present "
    "in the actual_output.",
    "Confirm the agent stayed in assessment mode and did NOT emit a JSON plan "
    "or spec file content.",
    "Verify the steps appear in the prescribed order (intent -> reference "
    "rules -> analyze -> report).",
    "Penalize: skipping analysis and jumping to a verdict, inventing steps, "
    "reordering steps in a way that breaks the workflow's logic, or producing "
    "conversion artifacts. Reward: every prescribed step evident, in order, "
    "with no fabricated extras.",
]

# All rubric text of this module, in declared order — hashed by RUBRIC_HASH.
RUBRIC_STEPS = _CONVERSION_STEPS + _ASSESSMENT_STEPS

# Recalibration tripwire (eval-architect audit check #12): sha256[:16] of
# "\n".join(RUBRIC_STEPS). Enforced by tests/test_rubric_hashes.py; a rubric
# edit requires updating this literal AND recalibrating the threshold.
RUBRIC_HASH = "6e019a98a6114ca9"


class PlanAdherenceMetric(GEval):
    """Evaluates whether the SUT followed the SKILL.md workflow steps in order.

    The accelint-ac-to-playwright skill prescribes a strict ordered procedure
    for each mode (see SKILL.md "Assessment Workflow" / "Conversion Workflow").
    This metric uses LLM-as-judge to inspect the SUT's reply for evidence that
    it walked the procedure end-to-end, in order, without skipping or inventing
    steps.

    Mode-specific workflows:
      * assessment: detect intent -> read references -> analyze AC against
        rules -> report findings without writing files.
      * conversion: detect intent -> run assessment first -> on pass, build
        a JSON plan -> output it in a fenced ```json``` block.
    """

    # Class-level copies so record_metric call sites can pass
    # rubric_hash=metric.RUBRIC_HASH without extra imports.
    RUBRIC_HASH = RUBRIC_HASH
    RUBRIC_SOURCE = "metrics/plan_adherence.py"

    def __init__(
        self,
        judge_model,
        mode: str,
        threshold: float = 0.8,
    ):
        """Initialize the metric.

        Args:
            judge_model: The configured LiteLLM judge instance
            mode: "assessment" or "conversion"
            threshold: Minimum score to pass (0.8 = 80%)
        """
        self.mode = mode

        super().__init__(
            name="Plan Adherence",
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
