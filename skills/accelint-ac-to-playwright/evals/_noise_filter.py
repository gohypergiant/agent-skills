"""Noise suppression for the eval harness.

Third-party libraries print several misleading or chatty messages during a normal
eval run. They aren't actionable here and they bury the scorecard at the bottom.
"""

from __future__ import annotations

import logging
import warnings


_LOGPROBS_FRAGMENT = "logprobs"


class _DropLogprobsFallbackErrors(logging.Filter):
    """Drop the misleading 'logprobs unsupported' ERROR line from LiteLLMModel.

    DeepEval's GEval first tries ``generate_raw_response`` which forces
    ``logprobs=True``. Bedrock doesn't support that parameter, so the LiteLLM
    client raises a ``BadRequestError`` and ``LiteLLMModel.generate_raw_response``
    logs it at ERROR before returning ``(None, 0.0)``. GEval then falls back to
    the schema path, which succeeds. The ERROR is purely cosmetic — but it lights
    up red in pytest output and looks like a real failure.
    """

    def filter(self, record: logging.LogRecord) -> bool:  # pragma: no cover - trivial
        msg = record.getMessage()
        if record.levelno >= logging.ERROR and _LOGPROBS_FRAGMENT in msg:
            return False
        return True


def apply_noise_filters() -> None:
    """Install logging filters and silence litellm's stdout chatter.

    Idempotent — safe to call from pytest's session-start hook.
    """
    # Pytest's ``filterwarnings`` config doesn't catch warnings raised during
    # plugin import (before the config is loaded). Install matching filters at
    # the warnings layer too so they're suppressed from very first import.
    warnings.filterwarnings(
        "ignore", message=".*PydanticSerializationUnexpectedValue.*"
    )
    warnings.filterwarnings(
        "ignore",
        category=DeprecationWarning,
        message=".*asyncio_default_fixture_loop_scope.*",
    )

    # Drop the cosmetic logprobs ERROR on the root logger (DeepEval logs there).
    root_logger = logging.getLogger()
    if not any(isinstance(f, _DropLogprobsFallbackErrors) for f in root_logger.filters):
        root_logger.addFilter(_DropLogprobsFallbackErrors())

    # LiteLLM prints an ANSI-red "Provider List: https://docs.litellm.ai/..." line
    # plus a "Give Feedback / Get Help" pointer through plain ``print()`` whenever it
    # encounters a soft error. Both bypass logging. ``suppress_debug_info`` is the
    # documented kill switch.
    try:
        import litellm  # local import to avoid pulling litellm at module import time

        litellm.suppress_debug_info = True
    except ImportError:  # pragma: no cover - litellm is a hard dep, but be defensive
        pass
