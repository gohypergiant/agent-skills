"""Pytest configuration and fixtures for eval harness."""

import os
import subprocess
from pathlib import Path
from typing import Any, Callable

import pytest
from dotenv import load_dotenv

from _noise_filter import apply_noise_filters
from _reporter import ScorecardCollector, render_scorecard, write_json_artifact
from litellm_judge import ConfigurationError, build_judge


# Load .env file if present (for local dev)
env_file = Path(__file__).parent / ".env"
if env_file.exists():
    load_dotenv(env_file)


# Silence the misleading logprobs ERROR log + the litellm "Provider List" stdout
# polish. Apply before any tests import litellm.
apply_noise_filters()


# Session-scoped collector — one per pytest run.
_collector: ScorecardCollector | None = None


def _get_collector() -> ScorecardCollector:
    global _collector
    if _collector is None:
        _collector = ScorecardCollector()
    return _collector


def pytest_configure(config):
    """Register custom markers.

    Env validation deliberately does NOT live here: each requirement is
    checked by the fixture that actually needs it (judge env in ``judge``,
    SUT env + CLI build in ``sut``, fixture files in ``fixtures_dir``), so
    the free offline runs — regression tests, rubric self-checks — need no
    judge credentials, no SUT credentials, and no built CLI.
    """
    config.addinivalue_line(
        "markers",
        "live: marks tests that hit the LLM (cost money, skipped by default)",
    )
    config.addinivalue_line(
        "markers",
        "sample: side-by-side sample-output runs (no assertions; just feed the scorecard)",
    )


@pytest.fixture(scope="session")
def judge():
    """Return the configured judge instance (session-scoped, built once)."""
    try:
        judge = build_judge()
    except ConfigurationError as e:
        pytest.fail(
            f"Judge configuration failed (needed for -m live):\n{e}\n"
            "See evals/.env.example for required environment variables."
        )
    print(f"\n[OK] Judge configured: {os.getenv('JUDGE_MODEL_ALIAS')}")
    return judge


@pytest.fixture(scope="session")
def _sut_preflight():
    """Validate SUT env + the built validate-plan CLI, once per session.

    Only tests that invoke the SUT (via the ``sut`` fixture) pay this check.
    """
    sut_provider = os.getenv("SUT_PROVIDER")
    sut_model = os.getenv("SUT_MODEL_ID")
    if not sut_provider or not sut_model:
        pytest.fail(
            "SUT configuration missing (needed by tests that invoke the SUT).\n"
            "Required: SUT_PROVIDER, SUT_MODEL_ID — see evals/.env.example."
        )

    skill_root = Path(__file__).parent.parent
    test_plan = skill_root / "scripts" / "tests" / "fixtures" / "all-actions.json"
    if not test_plan.exists():
        pytest.fail(f"Test plan file not found: {test_plan} (required to validate the CLI)")

    try:
        cli_check = subprocess.run(
            ["node", "dist/scripts/cli/validate-plan.js", str(test_plan)],
            cwd=skill_root,
            capture_output=True,
            timeout=5,
        )
        if cli_check.returncode != 0:
            pytest.fail(
                "validate-plan CLI not found or not working. Did you run "
                f"'npm run build' from the skill root ({skill_root})?\n"
                f"CLI stderr: {cli_check.stderr.decode()}"
            )
    except FileNotFoundError:
        pytest.fail("Node.js not found in PATH (required for the validate-plan CLI).")

    print(f"\n[OK] SUT configured: {sut_provider}/{sut_model}; validate-plan CLI available")


@pytest.fixture(scope="session")
def skill_root():
    """Return the skill root directory path."""
    return Path(__file__).parent.parent


@pytest.fixture(scope="session")
def fixtures_dir(skill_root):
    """Return the fixtures directory path, verifying the fixtures exist.

    MIXED-AC was split into MIXED-AC-{1..5}.feature in a recent commit; we
    canonically point at MIXED-AC-1.feature. These files are eval SOURCE —
    the harness was dead for a month when they existed only on one machine;
    keep them git-tracked.
    """
    fixtures = ["PERFECT-AC.feature", "MIXED-AC-1.feature", "BAD-AC.feature"]
    d = skill_root / "assets" / "evals"
    missing = [f for f in fixtures if not (d / f).exists()]
    if missing:
        pytest.fail(f"Fixture(s) not found in {d}: {', '.join(missing)}")
    return d


@pytest.fixture(scope="session")
def expected_dir(skill_root):
    """Return the expected artifacts directory path."""
    return skill_root / "assets" / "evals" / "expected"


# ---------------------------------------------------------------------------
# Reporter fixtures + terminal summary hook
# ---------------------------------------------------------------------------


@pytest.fixture
def sut(request, _sut_preflight) -> Callable[..., dict]:
    """Invoke the SUT and auto-record latency + tokens into the scorecard.

    Drop-in replacement for ``invoke_sut`` for tests that want their run-time
    telemetry to land in the scorecard. Tests that don't need recording can
    keep importing ``invoke_sut`` directly.
    """
    from runner import invoke_sut

    collector = _get_collector()

    def _run(fixture_path: Path, mode: str, **kwargs: Any) -> dict:
        result = invoke_sut(fixture_path=fixture_path, mode=mode, **kwargs)
        collector.record_invocation(
            mode=mode,
            fixture=str(fixture_path.name),
            metadata=result.get("metadata") or {},
        )
        return result

    return _run


@pytest.fixture
def record_metric(request) -> Callable[..., None]:
    """Register a metric outcome with the scorecard.

    Tests call this immediately after ``metric.measure(...)``. Recording happens
    BEFORE any ``assert`` so the metric is captured even when the assertion
    fails (which is exactly when we most want to see the score and reason).
    """
    collector = _get_collector()
    nodeid = request.node.nodeid

    def _record(
        *,
        name: str,
        score: float,
        threshold: float,
        dimension: str,
        persona: str,
        scenario: str,
        reason: str | None = None,
        passed: bool | None = None,
        rubric_hash: str | None = None,
        rubric_source: str | None = None,
    ) -> None:
        if passed is None:
            passed = float(score) >= float(threshold)
        collector.record_metric(
            nodeid=nodeid,
            name=name,
            score=score,
            threshold=threshold,
            passed=bool(passed),
            dimension=dimension,
            persona=persona,
            scenario=scenario,
            reason=reason,
            rubric_hash=rubric_hash,
            rubric_source=rubric_source,
        )

    return _record


def pytest_terminal_summary(terminalreporter, exitstatus, config) -> None:
    """Render the scorecard + write the JSON artifact at the end of the run."""
    if _collector is None:
        return
    report = _collector.aggregate()
    text = render_scorecard(report)

    tr = terminalreporter
    tr.write_line("")
    for line in text.splitlines():
        tr.write_line(line)

    results_dir = Path(__file__).parent / "results"
    artifact_path = write_json_artifact(report, results_dir)
    tr.write_line("")
    tr.write_line(f"Wrote {artifact_path.relative_to(Path(__file__).parent)}")
