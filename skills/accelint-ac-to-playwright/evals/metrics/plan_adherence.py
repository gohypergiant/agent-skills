"""Plan adherence metric - did the SUT follow the prescribed SKILL.md workflow?"""

from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, LLMTestCaseParams


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

        if mode == "conversion":
            criteria = """
You are evaluating whether the agent followed the SKILL.md Conversion Workflow
in the prescribed order for the accelint-ac-to-playwright skill.

The required ordered procedure for Conversion mode is:

  1. Intent detection — the agent recognizes the user wants a full conversion
     (vs. an assessment-only review).
  2. Run Assessment mode first — the agent inspects the AC for issues BEFORE
     attempting any JSON plan generation. The reply should show evidence of
     this assessment pass (a readiness verdict, an issues list, or an explicit
     "AC are conversion-ready" statement).
  3. BRANCH on assessment result:
       a. If assessment surfaced BLOCKING ISSUES → the correct behavior is to
          STOP and produce NO JSON plan. A halt-and-report response is FULL
          adherence to the workflow (score 1.0). Do NOT penalize the absence
          of a plan in this case.
       b. If assessment PASSED (AC are conversion-ready) → the agent must build
          a JSON plan and output it inside a fenced ```json``` code block at the
          end of the reply. Penalize a missing plan/fenced block ONLY when
          assessment passed.

Penalize the response when it:
  - Skips the assessment pass and jumps straight to a JSON plan.
  - Invents steps that are not part of the prescribed workflow.
  - Reorders the prescribed steps (e.g., emits the plan before assessing).
  - Omits the fenced ```json``` block when assessment PASSED (blocking issues
    were NOT found).
  - Emits a JSON plan despite the assessment surfacing blocking issues.

Reward the response when the branch is correctly followed:
  - Assessment failed → agent halted and explained why (no plan emitted).
  - Assessment passed → agent produced a fenced ```json``` plan.

Score 0 (no adherence) to 1 (perfect adherence).
"""

            evaluation_steps = [
                "Identify which workflow steps from the Conversion procedure are present in the actual_output.",
                "Check that the agent ran (or shows clear evidence of running) the assessment pass BEFORE emitting any JSON plan.",
                "Determine the assessment result: did the agent find blocking issues, or did assessment pass?",
                "If assessment surfaced blocking issues: verify the agent STOPPED and produced NO JSON plan — this is correct behavior (score high). If the agent incorrectly emitted a plan despite blocking issues, penalize.",
                "If assessment passed: verify the agent produced a JSON plan inside a fenced ```json``` block — penalize a missing plan/block in this case.",
                "Check whether the agent invented any steps not in the prescribed procedure or skipped any required steps.",
                "Assign a score from 0 (workflow ignored or steps badly out of order) to 1 (correct branch followed end-to-end, no fabricated steps).",
            ]

        else:  # assessment mode
            criteria = """
You are evaluating whether the agent followed the SKILL.md Assessment Workflow
in the prescribed order for the accelint-ac-to-playwright skill.

The required ordered procedure for Assessment mode is:

  1. Intent detection - the agent recognizes the user wants an assessment /
     readiness review (NOT a full conversion).
  2. Read references - the agent shows it has consulted the AC rules
     (acceptance-criteria.md and the test-hooks controlled vocabulary). This
     can be implicit: applying the rules counts as evidence.
  3. Analyze the AC against the rules (structure & format, target pattern,
     vocabulary, action verbs, fill values, explicit outcomes).
  4. Report findings WITHOUT writing any files - the reply should be a prose
     readiness report (issues list with line/scenario references, or a
     "conversion-ready" verdict). No JSON plan, no spec file content.

Penalize the response when it:
  - Skips analysis and jumps straight to a verdict.
  - Invents steps not in the prescribed procedure.
  - Reorders the steps in a way that breaks the workflow's logic.
  - Generates a JSON test plan or a spec file (assessment mode must not
    produce conversion artifacts).

Reward the response when every prescribed step is evident, in order, with no
fabricated extras.

Score 0 (no adherence) to 1 (perfect adherence).
"""

            evaluation_steps = [
                "Identify which workflow steps from the Assessment procedure are present in the actual_output.",
                "Confirm the agent stayed in assessment mode and did NOT emit a JSON plan or spec file content.",
                "Verify the steps appear in the prescribed order (intent -> reference rules -> analyze -> report).",
                "Check whether the agent invented any steps not in the prescribed procedure or skipped any required steps.",
                "Assign a score from 0 (workflow ignored or wrong mode artifacts produced) to 1 (every prescribed step present, in order, no fabricated steps).",
            ]

        super().__init__(
            name="Plan Adherence",
            criteria=criteria,
            evaluation_steps=evaluation_steps,
            evaluation_params=[LLMTestCaseParams.ACTUAL_OUTPUT],
            model=judge_model,
            threshold=threshold,
        )

    def measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        return super().measure(test_case, *args, **kwargs)

    async def a_measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        return await super().a_measure(test_case, *args, **kwargs)
