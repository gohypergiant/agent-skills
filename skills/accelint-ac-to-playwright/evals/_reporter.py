"""Scorecard reporter for the eval harness.

Collects per-test metric scores + per-SUT-invocation telemetry over a run and
emits two artifacts:

1. A human-readable text scorecard rendered through pytest's
   ``pytest_terminal_summary`` hook (one screen instead of 400 lines).
2. A machine-readable ``results/run-<utc-iso>.json`` artifact for dashboards,
   regression alerts, and multi-model comparisons.

Tests register their data via two fixtures defined in ``conftest.py``:
``sut(...)`` (wraps ``invoke_sut`` and auto-records latency + tokens) and
``record_metric(...)`` (registers a single metric outcome).
"""

from __future__ import annotations

import json
import os
import statistics
import textwrap
from collections import OrderedDict, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


# ---------------------------------------------------------------------------
# Spec rubric vocabulary
# ---------------------------------------------------------------------------

DIMENSION_ORDER = ("completeness", "efficiency", "pitfalls")

DIMENSION_LABELS = {
    "completeness": "Completeness & correctness",
    "efficiency": "Efficiency",
    "pitfalls": "LLM pitfalls",
}

PERSONA_LABELS = {
    "pm": "PM",
    "engineer": "Engineer",
}

SCENARIO_LABELS = {
    "perfect-assess": "assesses perfect AC",
    "mixed-assess": "assesses pretty-good AC",
    "bad-assess": "assesses not-ready AC",
    "perfect-convert": "converts perfect AC",
    "mixed-convert": "converts pretty-good AC",
    "bad-convert": "converts not-ready AC",
    "regression-fixture": "synthetic regression fixture",
    "comparison": "side-by-side comparison",
}


# ---------------------------------------------------------------------------
# Collector
# ---------------------------------------------------------------------------


class ScorecardCollector:
    """Captures every metric record + every SUT invocation in a run."""

    def __init__(self) -> None:
        self.run_started_at = datetime.now(timezone.utc)
        self.metrics: list[dict[str, Any]] = []
        self.invocations: list[dict[str, Any]] = []
        self.prompt_hash: str | None = None
        self.skill_md_hash: str | None = None
        self.references_hash: str | None = None
        self.judge_alias = os.getenv("JUDGE_MODEL_ALIAS", "<unset>")
        self.sut_provider = os.getenv("SUT_PROVIDER", "<unset>")
        self.sut_model_id = os.getenv("SUT_MODEL_ID", "<unset>")

    def record_metric(
        self,
        *,
        nodeid: str,
        name: str,
        score: float,
        threshold: float,
        passed: bool,
        dimension: str,
        persona: str,
        scenario: str,
        reason: str | None = None,
        rubric_hash: str | None = None,
        rubric_source: str | None = None,
    ) -> None:
        metric_data = {
            "nodeid": nodeid,
            "name": name,
            "score": float(score),
            "threshold": float(threshold),
            "passed": bool(passed),
            "dimension": dimension,
            "persona": persona,
            "scenario": scenario,
            "reason": _normalise_reason(reason),
        }
        # Only judge metrics carry a rubric; deterministic metrics omit both.
        # Consumed by the eval-architect audit's stale-rubric check (#12).
        if rubric_hash is not None:
            metric_data["rubric_hash"] = rubric_hash
        if rubric_source is not None:
            metric_data["rubric_source"] = rubric_source
        self.metrics.append(metric_data)

    def record_invocation(
        self,
        *,
        mode: str,
        fixture: str,
        metadata: dict[str, Any],
    ) -> None:
        token_usage = metadata.get("token_usage") or {}
        self.invocations.append(
            {
                "mode": mode,
                "fixture": fixture,
                "latency_seconds": metadata.get("latency_seconds"),
                "prompt_tokens": token_usage.get("prompt_tokens"),
                "completion_tokens": token_usage.get("completion_tokens"),
                "total_tokens": token_usage.get("total_tokens"),
            }
        )
        self.prompt_hash = self.prompt_hash or metadata.get("prompt_hash")
        self.skill_md_hash = self.skill_md_hash or metadata.get("skill_md_hash")
        self.references_hash = self.references_hash or metadata.get("references_hash")

    def aggregate(self) -> dict[str, Any]:
        completed_at = datetime.now(timezone.utc)
        duration_seconds = (completed_at - self.run_started_at).total_seconds()

        latencies = [
            inv["latency_seconds"]
            for inv in self.invocations
            if isinstance(inv.get("latency_seconds"), (int, float))
        ]
        total_tokens = sum(
            int(inv.get("total_tokens") or 0) for inv in self.invocations
        )
        completion_tokens = sum(
            int(inv.get("completion_tokens") or 0) for inv in self.invocations
        )
        prompt_tokens = sum(
            int(inv.get("prompt_tokens") or 0) for inv in self.invocations
        )

        per_mode_tokens: dict[str, list[int]] = defaultdict(list)
        for inv in self.invocations:
            total = inv.get("total_tokens")
            if total is not None:
                per_mode_tokens[inv["mode"]].append(int(total))

        efficiency = {
            "sut_invocations": len(self.invocations),
            "latency_p50": _percentile(latencies, 0.50),
            "latency_p95": _percentile(latencies, 0.95),
            "latency_max": max(latencies) if latencies else None,
            "total_prompt_tokens": prompt_tokens or None,
            "total_completion_tokens": completion_tokens or None,
            "total_tokens": total_tokens or None,
            "mean_tokens_by_mode": {
                mode: round(statistics.fmean(values), 1)
                for mode, values in per_mode_tokens.items()
                if values
            },
        }

        return {
            "schema_version": 2,
            "run_started_at": self.run_started_at.isoformat(),
            "run_completed_at": completed_at.isoformat(),
            "duration_seconds": round(duration_seconds, 2),
            "judge_model_alias": self.judge_alias,
            "sut_provider": self.sut_provider,
            "sut_model_id": self.sut_model_id,
            "prompt_hash": self.prompt_hash,
            "skill_md_hash": self.skill_md_hash,
            "references_hash": self.references_hash,
            "metrics": list(self.metrics),
            "invocations": list(self.invocations),
            "efficiency": efficiency,
            "summary": _summarise_metrics(self.metrics),
        }


# ---------------------------------------------------------------------------
# Pytest terminal renderer
# ---------------------------------------------------------------------------


_TABLE_WIDTH = 96
_DIMENSION_DIVIDER = "─" * _TABLE_WIDTH
_HEADING_DIVIDER = "═" * _TABLE_WIDTH
_REASON_WRAP_WIDTH = 88

_COL_STATUS = 6
_COL_METRIC = 22
_COL_SCORE = 7
_COL_THRESH = 7
_COL_SCENARIO = _TABLE_WIDTH - (_COL_STATUS + _COL_METRIC + _COL_SCORE + _COL_THRESH + 4)


def render_scorecard(report: dict[str, Any]) -> str:
    """Render the run report as a fixed-width text scorecard."""
    lines: list[str] = []

    lines.append(_HEADING_DIVIDER)
    lines.append("EVAL SCORECARD")
    lines.append(_HEADING_DIVIDER)

    started = report["run_started_at"]
    duration_str = _format_duration(report["duration_seconds"])
    lines.append(f"Run started     {started}   ({duration_str} total)")
    lines.append(
        f"SUT             {report['sut_model_id']} ({report['sut_provider']})"
    )
    lines.append(f"Judge           {report['judge_model_alias']}")
    if report.get("prompt_hash"):
        lines.append(
            f"Prompt hash     {report['prompt_hash']}   "
            f"skill_md={report.get('skill_md_hash')}"
        )
    lines.append("")

    by_dimension: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for metric in report["metrics"]:
        by_dimension[metric["dimension"]].append(metric)

    for dimension in DIMENSION_ORDER:
        rows = by_dimension.get(dimension)
        if not rows:
            continue
        lines.append(DIMENSION_LABELS.get(dimension, dimension))
        lines.append(_DIMENSION_DIVIDER)
        lines.append(_table_header())
        lines.append(_table_separator())
        for row in rows:
            lines.append(_format_metric_row(row))
        lines.append("")

    # Runtime aggregates — distinct from the Efficiency metric table above.
    # The metric table shows per-test PASS/FAIL; this block shows per-call
    # telemetry across the whole run.
    eff = report["efficiency"]
    lines.append("Runtime telemetry")
    lines.append(_DIMENSION_DIVIDER)
    lines.append(
        "  Latency       p50 {p50}  p95 {p95}  max {pmax}  "
        "(across {n} SUT calls)".format(
            p50=_format_latency(eff.get("latency_p50")),
            p95=_format_latency(eff.get("latency_p95")),
            pmax=_format_latency(eff.get("latency_max")),
            n=eff.get("sut_invocations") or 0,
        )
    )
    mean_tokens = eff.get("mean_tokens_by_mode") or {}
    if mean_tokens:
        per_mode = "  ".join(
            f"{mode} mean {_format_tokens(value)}"
            for mode, value in mean_tokens.items()
        )
        lines.append(f"  Tokens        {per_mode}")
    if eff.get("total_tokens"):
        lines.append(
            "  Run totals    prompt {p}  completion {c}  total {t}".format(
                p=_format_tokens(eff.get("total_prompt_tokens")),
                c=_format_tokens(eff.get("total_completion_tokens")),
                t=_format_tokens(eff.get("total_tokens")),
            )
        )
    lines.append("")

    persona_rows = _persona_rollup(report["metrics"])
    if persona_rows:
        lines.append("Personas / scenarios")
        lines.append(_DIMENSION_DIVIDER)
        for label, summary in persona_rows:
            lines.append(
                f"  {summary['status']}  {label}  ({summary['detail']})"
            )
        lines.append("")

    failures = [m for m in report["metrics"] if not m["passed"] and m.get("reason")]
    if failures:
        lines.append("Failure details")
        lines.append(_DIMENSION_DIVIDER)
        for idx, failure in enumerate(failures, start=1):
            lines.extend(_format_failure_block(idx, failure))
            lines.append("")

    summary = report["summary"]
    lines.append(
        "Summary: {passed} passed, {failed} failed of {total} graded metrics".format(
            passed=summary["passed"],
            failed=summary["failed"],
            total=summary["total"],
        )
    )
    if summary["below_threshold"]:
        below = ", ".join(summary["below_threshold"])
        lines.append(f"Below threshold: {below}")
    lines.append(_HEADING_DIVIDER)

    return "\n".join(lines)


def write_json_artifact(report: dict[str, Any], results_dir: Path) -> Path:
    """Write the structured run report to ``results/run-<utc-iso>.json``."""
    results_dir.mkdir(parents=True, exist_ok=True)
    stamp = report["run_started_at"].replace(":", "").replace("-", "")
    artifact = results_dir / f"run-{stamp}.json"
    artifact.write_text(json.dumps(report, indent=2), encoding="utf-8")
    return artifact


# ---------------------------------------------------------------------------
# Formatting helpers
# ---------------------------------------------------------------------------


def _table_header() -> str:
    return "  ".join(
        [
            "Status".ljust(_COL_STATUS),
            "Metric".ljust(_COL_METRIC),
            "Score".rjust(_COL_SCORE),
            "Thresh".rjust(_COL_THRESH),
            "Persona · Scenario".ljust(_COL_SCENARIO),
        ]
    )


def _table_separator() -> str:
    return "  ".join(
        [
            "-" * _COL_STATUS,
            "-" * _COL_METRIC,
            "-" * _COL_SCORE,
            "-" * _COL_THRESH,
            "-" * _COL_SCENARIO,
        ]
    )


def _format_metric_row(row: dict[str, Any]) -> str:
    persona = PERSONA_LABELS.get(row["persona"], row["persona"])
    scenario = SCENARIO_LABELS.get(row["scenario"], row["scenario"])
    status = "PASS" if row["passed"] else "FAIL"
    scenario_cell = f"{persona} · {scenario}"
    return "  ".join(
        [
            status.ljust(_COL_STATUS),
            row["name"][:_COL_METRIC].ljust(_COL_METRIC),
            f"{row['score']:.2f}".rjust(_COL_SCORE),
            f"≥ {row['threshold']:.2f}".rjust(_COL_THRESH),
            scenario_cell[:_COL_SCENARIO].ljust(_COL_SCENARIO),
        ]
    )


def _format_failure_block(idx: int, failure: dict[str, Any]) -> list[str]:
    persona = PERSONA_LABELS.get(failure["persona"], failure["persona"])
    scenario = SCENARIO_LABELS.get(failure["scenario"], failure["scenario"])
    header = (
        f"[{idx}] {failure['name']}  "
        f"({persona} · {scenario})  "
        f"score {failure['score']:.2f} < {failure['threshold']:.2f}"
    )
    reason = failure.get("reason") or "(no reason provided)"
    collapsed = " ".join(reason.split())
    wrapped = textwrap.wrap(
        collapsed,
        width=_REASON_WRAP_WIDTH,
        initial_indent="    ",
        subsequent_indent="    ",
        break_long_words=False,
        break_on_hyphens=False,
    )
    return [header, *wrapped]


def _normalise_reason(reason: str | None) -> str | None:
    """Collapse repeated whitespace so the JSON artifact stores tidy text.

    No truncation — full reasoning is preserved for both the scorecard and
    downstream consumers (dashboards, regression diffs)."""
    if not reason:
        return None
    return " ".join(reason.split())


def _format_latency(value: float | None) -> str:
    if value is None:
        return "—"
    return f"{value:5.1f}s"


def _format_tokens(value: float | None) -> str:
    if value is None:
        return "—"
    if value >= 1000:
        return f"{value / 1000:.1f}k"
    return f"{int(value)}"


def _format_duration(seconds: float) -> str:
    minutes, remainder = divmod(int(seconds), 60)
    if minutes:
        return f"{minutes}m{remainder:02d}s"
    return f"{remainder}s"


def _percentile(values: list[float], pct: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    if len(ordered) == 1:
        return float(ordered[0])
    rank = pct * (len(ordered) - 1)
    low = int(rank)
    high = min(low + 1, len(ordered) - 1)
    frac = rank - low
    return float(ordered[low] + (ordered[high] - ordered[low]) * frac)


def _summarise_metrics(metrics: list[dict[str, Any]]) -> dict[str, Any]:
    total = len(metrics)
    passed = sum(1 for m in metrics if m["passed"])
    failed = total - passed
    below_threshold = sorted({m["name"] for m in metrics if not m["passed"]})
    return {
        "total": total,
        "passed": passed,
        "failed": failed,
        "below_threshold": below_threshold,
    }


def _persona_rollup(metrics: list[dict[str, Any]]) -> list[tuple[str, dict[str, str]]]:
    """Group metrics by (persona, scenario) and report PASS/FAIL/MIXED per group."""
    buckets: dict[tuple[str, str], list[dict[str, Any]]] = OrderedDict()
    for metric in metrics:
        if metric["scenario"] == "regression-fixture":
            continue
        key = (metric["persona"], metric["scenario"])
        buckets.setdefault(key, []).append(metric)

    rows: list[tuple[str, dict[str, str]]] = []
    for (persona, scenario), group in buckets.items():
        passed = sum(1 for m in group if m["passed"])
        total = len(group)
        if passed == total:
            status = "PASS   "
        elif passed == 0:
            status = "FAIL   "
        else:
            status = "PARTIAL"
        label = (
            f"{PERSONA_LABELS.get(persona, persona)} "
            f"{SCENARIO_LABELS.get(scenario, scenario)}"
        )
        rows.append((label, {"status": status, "detail": f"{passed}/{total} checks"}))
    return rows
