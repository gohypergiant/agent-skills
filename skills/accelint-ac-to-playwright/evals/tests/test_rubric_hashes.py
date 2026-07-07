"""Self-check binding each judge metric's RUBRIC_HASH literal to its rubric text.

This is what makes the recalibration tripwire (eval-architect audit check #12)
live: the audit greps the LITERAL, so an edited rubric with a forgotten literal
would otherwise pass silently. Offline and free — runs in the default suite.
"""

import hashlib
import importlib

import pytest

_JUDGE_METRIC_MODULES = [
    "metrics.assessment_quality",
    "metrics.assumptions",
    "metrics.blatant_errors",
    "metrics.goal_accuracy",
    "metrics.plan_adherence",
    "metrics.plan_semantic",
    "metrics.task_completion",
]


@pytest.mark.parametrize("module_name", _JUDGE_METRIC_MODULES)
def test_rubric_hash_literal_matches_steps(module_name):
    mod = importlib.import_module(module_name)
    steps = mod.RUBRIC_STEPS
    literal = mod.RUBRIC_HASH

    assert literal != "0000000000000000", (
        f"{module_name}.RUBRIC_HASH is still the placeholder — compute it from "
        "RUBRIC_STEPS (the assertion below prints the value)."
    )
    actual = hashlib.sha256("\n".join(steps).encode()).hexdigest()[:16]
    assert literal == actual, (
        f"{module_name}.RUBRIC_HASH ({literal}) does not match the rubric text "
        f"({actual}) — the rubric was edited without updating the literal. "
        "Update it, then RECALIBRATE the metric's threshold: a rubric edit "
        "invalidates thresholds exactly like a model change does."
    )
