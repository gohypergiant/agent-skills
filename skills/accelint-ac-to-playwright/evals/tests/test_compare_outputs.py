"""Side-by-side comparison runs for manual inspection.

These tests don't assert anything — they exist to record SUT invocations
(latency + tokens) for two contrasting fixtures so the scorecard shows the
efficiency delta between perfect and bad AC. Marked ``sample`` so they can
be skipped via ``pytest -m 'not sample'`` if the user only wants the graded
metrics.
"""

import pytest


pytestmark = pytest.mark.sample


@pytest.fixture
def perfect_ac_path(fixtures_dir):
    return fixtures_dir / "PERFECT-AC.feature"


@pytest.fixture
def bad_ac_path(fixtures_dir):
    return fixtures_dir / "BAD-AC.feature"


def test_compare_perfect_vs_bad_assessment(perfect_ac_path, bad_ac_path, sut):
    """Record SUT invocations for perfect + bad AC in assessment mode."""
    sut(perfect_ac_path, "assessment")
    sut(bad_ac_path, "assessment")


def test_compare_perfect_vs_bad_conversion(perfect_ac_path, bad_ac_path, sut):
    """Record SUT invocations for perfect + bad AC in conversion mode."""
    sut(perfect_ac_path, "conversion")
    sut(bad_ac_path, "conversion")
