"""Plan comparison metric — deterministic structural gate for conversion correctness.

Compares the parsed plan extracted from the SUT's output against a hand-authored
golden JSON file using a normalised deep comparison (not a byte diff).

Normalisations applied:
  - Dict key order is irrelevant (natural for parsed dicts).
  - The ``source`` object is ignored entirely (machine-specific paths).
  - A missing ``type`` on a step is inferred from the ``action`` field:
      * action verbs (click, fill, select, hover, drag, ...) → "action"
      * expect* verbs (expectText, expectUrl, expectVisible, ...) → "assertion"
  - Tests are compared by ORDER — plan order is part of correctness.

On mismatch: score 0.0, reason = compact structured diff listing up to the
first 10 differences as dotted paths.

On extraction failure: score 0.0, reason = extraction error message.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Optional

from deepeval.metrics import BaseMetric
from deepeval.test_case import LLMTestCase

from metrics._json_extraction import PlanExtractionError, extract_plan_json


# ---------------------------------------------------------------------------
# Step-type inference
# ---------------------------------------------------------------------------

_ASSERTION_ACTIONS = frozenset(
    {
        "expecttext",
        "expecturl",
        "expectvisible",
        "expectnotvisible",
        "expectenabled",
        "expectdisabled",
        "expectchecked",
        "expectunchecked",
        "expectvalue",
        "expectattribute",
        "expectcount",
        "expectexist",
        "expectnotexist",
    }
)


def _infer_step_type(step: dict[str, Any]) -> str:
    """Return "action" or "assertion" for ``step``, inferring when ``type`` is absent."""
    explicit = step.get("type")
    if explicit in ("action", "assertion"):
        return explicit
    action_verb = (step.get("action") or "").lower()
    if action_verb in _ASSERTION_ACTIONS or action_verb.startswith("expect"):
        return "assertion"
    return "action"


# ---------------------------------------------------------------------------
# Normalisation helpers
# ---------------------------------------------------------------------------

def _normalise_step(step: dict[str, Any]) -> dict[str, Any]:
    """Return a copy of ``step`` with ``type`` always present."""
    out = dict(step)
    out["type"] = _infer_step_type(step)
    return out


def _normalise_plan(plan: dict[str, Any]) -> dict[str, Any]:
    """Return a copy of ``plan`` with ``source`` stripped and step types resolved."""
    out = {k: v for k, v in plan.items() if k != "source"}
    if "tests" in out and isinstance(out["tests"], list):
        out["tests"] = [
            {
                **{k: v for k, v in t.items()},
                "steps": [_normalise_step(s) for s in (t.get("steps") or [])],
            }
            if isinstance(t, dict)
            else t
            for t in out["tests"]
        ]
    return out


# ---------------------------------------------------------------------------
# Recursive differ
# ---------------------------------------------------------------------------

_MAX_DIFFS = 10


def _diff(golden: Any, actual: Any, path: str, diffs: list[str]) -> None:
    """Recursively collect dotted-path differences between ``golden`` and ``actual``."""
    if len(diffs) >= _MAX_DIFFS:
        return

    if isinstance(golden, dict) and isinstance(actual, dict):
        all_keys = set(golden) | set(actual)
        for key in sorted(all_keys):
            if len(diffs) >= _MAX_DIFFS:
                return
            child = f"{path}.{key}" if path else key
            if key not in actual:
                diffs.append(f"{child}: golden has value, actual missing")
            elif key not in golden:
                diffs.append(f"{child}: golden missing, actual has value")
            else:
                _diff(golden[key], actual[key], child, diffs)

    elif isinstance(golden, list) and isinstance(actual, list):
        if len(golden) != len(actual):
            diffs.append(
                f"{path}: golden has {len(golden)}, actual has {len(actual)}"
            )
        # Compare element by element up to the shorter length
        for idx in range(min(len(golden), len(actual))):
            if len(diffs) >= _MAX_DIFFS:
                return
            _diff(golden[idx], actual[idx], f"{path}[{idx}]", diffs)

    else:
        if golden != actual:
            g_repr = repr(golden) if not isinstance(golden, str) else f"'{golden}'"
            a_repr = repr(actual) if not isinstance(actual, str) else f"'{actual}'"
            diffs.append(f"{path}: golden={g_repr} actual={a_repr}")


# ---------------------------------------------------------------------------
# Metric class
# ---------------------------------------------------------------------------


class PlanComparisonMetric(BaseMetric):
    """Hard gate: normalised structural equality against a CLI-validated golden plan.

    This is the primary correctness gate for conversion mode. If this metric
    passes (score 1.0), the plan is structurally identical to the hand-authored
    golden (modulo key order and the machine-specific ``source`` object).

    GEval goal_accuracy and semantic_quality are advisory trend metrics; their
    pass/fail status does not block a run.
    """

    def __init__(self, golden_plan_path: Path, threshold: float = 1.0):
        """Initialize the metric.

        Args:
            golden_plan_path: Path to the hand-authored golden JSON file.
            threshold: Pass/fail boundary (default 1.0 = exact structural match).
        """
        if not golden_plan_path.exists():
            raise FileNotFoundError(f"Golden plan not found: {golden_plan_path}")

        self.golden_plan_path = golden_plan_path
        with open(golden_plan_path, encoding="utf-8") as fh:
            raw_golden = json.load(fh)
        self.golden = _normalise_plan(raw_golden)

        self.threshold = threshold
        self.score: float = 0.0
        self.success: bool = False
        self.reason: Optional[str] = None

    def measure(self, test_case: LLMTestCase) -> float:
        """Compare the SUT plan to the golden.

        Args:
            test_case: Contains actual_output (the SUT's full reply).

        Returns:
            1.0 on exact normalised match, 0.0 otherwise.
        """
        try:
            raw_actual = extract_plan_json(test_case.actual_output)
        except PlanExtractionError as exc:
            self.score = 0.0
            self.success = False
            self.reason = f"Plan extraction failed: {exc}"
            return self.score

        actual = _normalise_plan(raw_actual)

        diffs: list[str] = []
        _diff(self.golden, actual, "", diffs)

        if diffs:
            self.score = 0.0
            self.success = False
            suffix = " (first 10 shown)" if len(diffs) >= _MAX_DIFFS else ""
            diff_lines = "\n  ".join(diffs)
            self.reason = (
                f"Plan differs from golden in {len(diffs)} place(s){suffix}:\n"
                f"  {diff_lines}"
            )
        else:
            self.score = 1.0
            self.success = True
            self.reason = (
                f"Plan matches golden '{self.golden_plan_path.name}' "
                "(normalised comparison, source ignored)."
            )

        return self.score

    async def a_measure(self, test_case: LLMTestCase) -> float:
        """Async version (delegates to sync)."""
        return self.measure(test_case)

    def is_successful(self) -> bool:
        """Return whether the metric passed."""
        return self.success

    @property
    def __name__(self) -> str:
        return "Plan Comparison"
