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
    """Pytest startup hook - validate configuration before running tests."""
    # Register custom markers
    config.addinivalue_line(
        "markers",
        "live: marks tests that hit the LLM (cost money, skipped by default)",
    )
    config.addinivalue_line(
        "markers",
        "sample: side-by-side sample-output runs (no assertions; just feed the scorecard)",
    )

    # Validate judge configuration
    try:
        judge = build_judge()
        print(f"\n[OK] Judge configured: {os.getenv('JUDGE_MODEL_ALIAS')}")
    except ConfigurationError as e:
        pytest.exit(
            f"\n[ERROR] Judge configuration failed:\n{e}\n\n"
            f"See evals/.env.example for required environment variables.",
            returncode=1,
        )

    # Validate SUT configuration
    sut_provider = os.getenv("SUT_PROVIDER")
    sut_model = os.getenv("SUT_MODEL_ID")

    if not sut_provider or not sut_model:
        pytest.exit(
            "\n[ERROR] SUT configuration missing.\n"
            "Required: SUT_PROVIDER, SUT_MODEL_ID\n"
            "See evals/.env.example for configuration template.",
            returncode=1,
        )

    print(f"[OK] SUT configured: {sut_provider}/{sut_model}")

    # Validate validate-plan CLI is available
    skill_root = Path(__file__).parent.parent
    test_plan = skill_root / "scripts" / "tests" / "fixtures" / "all-actions.json"

    if not test_plan.exists():
        pytest.exit(
            f"\n[ERROR] Test plan file not found: {test_plan}\n"
            "This is required to validate the CLI.",
            returncode=1,
        )

    try:
        cli_check = subprocess.run(
            ["node", "dist/scripts/cli/validate-plan.js", str(test_plan)],
            cwd=skill_root,
            capture_output=True,
            timeout=5,
        )

        if cli_check.returncode != 0:
            pytest.exit(
                "\n[ERROR] validate-plan CLI not found or not working.\n"
                "Did you run 'npm run build' from the skill root?\n"
                f"Skill root: {skill_root}\n"
                f"CLI stderr: {cli_check.stderr.decode()}\n"
                f"CLI stdout: {cli_check.stdout.decode()}",
                returncode=1,
            )

        print("[OK] validate-plan CLI available")
    except FileNotFoundError:
        pytest.exit(
            "\n[ERROR] Node.js not found in PATH.\n"
            "Please install Node.js or ensure it's in your PATH.",
            returncode=1,
        )

    # Validate fixture files exist.
    # MIXED-AC was split into MIXED-AC-{1..5}.feature in a recent commit; we
    # canonically point at MIXED-AC-1.feature here. Tests can opt to iterate
    # the other slices if they want broader coverage.
    fixtures = ["PERFECT-AC.feature", "MIXED-AC-1.feature", "BAD-AC.feature"]
    fixtures_dir = skill_root / "assets" / "evals"

    for fixture in fixtures:
        fixture_path = fixtures_dir / fixture
        if not fixture_path.exists():
            pytest.exit(
                f"\n[ERROR] Fixture not found: {fixture_path}\n"
                f"Expected in: {fixtures_dir}",
                returncode=1,
            )

    print(f"[OK] Fixtures available: {', '.join(fixtures)}")

    print("\n[OK] All configuration checks passed\n")


@pytest.fixture(scope="session")
def judge():
    """Return the configured judge instance (session-scoped, built once)."""
    return build_judge()


@pytest.fixture(scope="session")
def skill_root():
    """Return the skill root directory path."""
    return Path(__file__).parent.parent


@pytest.fixture(scope="session")
def fixtures_dir(skill_root):
    """Return the fixtures directory path."""
    return skill_root / "assets" / "evals"


@pytest.fixture(scope="session")
def expected_dir(skill_root):
    """Return the expected artifacts directory path."""
    return skill_root / "assets" / "evals" / "expected"


# ---------------------------------------------------------------------------
# Reporter fixtures + terminal summary hook
# ---------------------------------------------------------------------------


@pytest.fixture
def sut(request) -> Callable[..., dict]:
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
        criteria: str | None = None,
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
            criteria=criteria,
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
