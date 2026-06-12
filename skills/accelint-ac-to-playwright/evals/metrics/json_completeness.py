"""JSON completeness metric - every AC scenario + step should be represented in the plan."""

import re
from pathlib import Path
from typing import Optional

from deepeval.metrics import BaseMetric
from deepeval.test_case import LLMTestCase

from metrics._json_extraction import PlanExtractionError, extract_plan_json


# Match lines that start a scenario block. ``Scenario Outline`` is captured by
# the second group; the regex matches both ``Scenario:`` and ``Scenario Outline:``.
_SCENARIO_RE = re.compile(r"^\s*Scenario(?:\s+Outline)?\s*:", re.MULTILINE)
# Match step keywords at the start of a line (after optional indentation).
_STEP_RE = re.compile(
    r"^\s*(?:Given|When|Then|And|But)\b", re.MULTILINE
)
# Match Examples blocks following a Scenario Outline.
_EXAMPLES_RE = re.compile(r"^\s*Examples\s*:", re.MULTILINE)


class JsonCompletenessMetric(BaseMetric):
    """Verify every AC scenario maps to a test and every step maps to an action.

    ``target_coverage`` already checks a curated list of "must-have" targets.
    This metric is broader: it counts AC scenarios and steps and compares to the
    plan's test/step totals. Drops or omissions show up as < 1.0 scores.
    """

    def __init__(self, ac_source_path: Path, threshold: float = 1.0):
        """Initialize the metric.

        Args:
            ac_source_path: Path to the source .feature AC file.
            threshold: Coverage threshold (default 1.0 = every scenario + step
                must appear in the plan).
        """
        if not ac_source_path.exists():
            raise FileNotFoundError(f"AC source not found: {ac_source_path}")

        self.ac_source_path = ac_source_path
        self.ac_source = ac_source_path.read_text(encoding="utf-8")
        self.threshold = threshold
        self.score = 0.0
        self.success = False
        self.reason: Optional[str] = None

        self.ac_scenarios, self.ac_steps = self._count_ac(self.ac_source)

    def _count_ac(self, source: str) -> tuple[int, int]:
        """Return (scenario_count, step_count) for the AC source.

        Handles:
          - Plain Scenario blocks.
          - Scenario Outline blocks (multiplied by Examples row count).
          - Background blocks (steps counted but no scenario added).
        """
        # Identify scenario starts and outline starts.
        scenario_matches = list(_SCENARIO_RE.finditer(source))
        examples_matches = list(_EXAMPLES_RE.finditer(source))
        step_matches = list(_STEP_RE.finditer(source))

        if not scenario_matches:
            return (0, 0)

        # Walk scenarios, partitioning steps into Background (before first
        # Scenario) and per-scenario sections (between consecutive Scenarios).
        scenario_count = 0
        step_count = 0

        # Steps before the first scenario header belong to Background; count
        # them once as setup steps.
        first_scenario_offset = scenario_matches[0].start()
        background_steps = [s for s in step_matches if s.start() < first_scenario_offset]
        step_count += len(background_steps)

        # Slice scenarios by their start offsets.
        for idx, match in enumerate(scenario_matches):
            start = match.start()
            end = scenario_matches[idx + 1].start() if idx + 1 < len(scenario_matches) else len(source)
            block = source[start:end]
            block_steps = len(_STEP_RE.findall(block))
            is_outline = bool(re.match(r"^\s*Scenario\s+Outline\s*:", source[start : start + 60], re.MULTILINE))
            if is_outline:
                # Find Examples rows inside the block — count non-header rows
                # (lines that start with '|' inside an Examples: section).
                ex_match = _EXAMPLES_RE.search(block)
                if ex_match:
                    ex_text = block[ex_match.end():]
                    rows = [
                        line for line in ex_text.splitlines()
                        if line.strip().startswith("|")
                    ]
                    # First row is header; subsequent rows are data.
                    data_rows = max(0, len(rows) - 1)
                    if data_rows == 0:
                        data_rows = 1  # Outlines with no Examples still count once.
                    scenario_count += data_rows
                    step_count += block_steps * data_rows
                else:
                    scenario_count += 1
                    step_count += block_steps
            else:
                scenario_count += 1
                step_count += block_steps

        return (scenario_count, step_count)

    def measure(self, test_case: LLMTestCase) -> float:
        """Compare AC scenario/step counts to plan test/action counts.

        Args:
            test_case: Contains actual_output (the SUT's plan JSON).

        Returns:
            Combined coverage score in [0, 1].
        """
        try:
            plan = extract_plan_json(test_case.actual_output)
        except PlanExtractionError as e:
            self.score = 0.0
            self.success = False
            self.reason = f"No plan found ({e})."
            return self.score

        plan_tests = plan.get("tests") or []
        plan_test_count = len(plan_tests)
        plan_step_count = sum(len(t.get("steps") or []) for t in plan_tests)

        if self.ac_scenarios == 0:
            self.score = 1.0
            self.success = True
            self.reason = "No scenarios found in AC source; nothing to count."
            return self.score

        test_ratio = min(plan_test_count, self.ac_scenarios) / self.ac_scenarios
        step_ratio = (
            min(plan_step_count, self.ac_steps) / self.ac_steps
            if self.ac_steps > 0
            else 1.0
        )

        self.score = (test_ratio + step_ratio) / 2.0
        self.success = self.score >= self.threshold

        self.reason = (
            f"Plan has {plan_test_count} tests / {self.ac_scenarios} expected "
            f"scenarios ({int(test_ratio * 100)}%); plan has "
            f"{plan_step_count} steps / {self.ac_steps} expected steps "
            f"({int(step_ratio * 100)}%). Combined {int(self.score * 100)}%."
        )

        return self.score

    async def a_measure(self, test_case: LLMTestCase) -> float:
        """Async version (delegates to sync)."""
        return self.measure(test_case)

    def is_successful(self) -> bool:
        """Return whether the metric passed."""
        return self.success

    @property
    def __name__(self):
        return "JSON Completeness"
