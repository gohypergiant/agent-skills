"""LiteLLM judge factory for DeepEval metrics.

This module builds a single configured judge instance that all metrics share.
Hard-fails if any required environment variables are missing to prevent silent
fallback to OpenAI defaults.
"""

import os
from typing import Optional

from deepeval.models import LiteLLMModel


class ConfigurationError(Exception):
    """Raised when required LiteLLM configuration is missing."""
    pass


_judge_instance: Optional[LiteLLMModel] = None


def build_judge() -> LiteLLMModel:
    """Build and return the configured LiteLLM judge instance.

    Required environment variables:
    - LITELLM_BASE_URL: The internal LiteLLM proxy URL
    - LITELLM_API_KEY: Virtual key for the proxy (never log this)
    - JUDGE_MODEL_ALIAS: Model alias registered on the proxy

    Returns:
        Configured LiteLLMModel instance

    Raises:
        ConfigurationError: If any required env var is missing or empty
    """
    global _judge_instance

    # Return cached instance if already built
    if _judge_instance is not None:
        return _judge_instance

    base_url = os.getenv("LITELLM_BASE_URL")
    api_key = os.getenv("LITELLM_API_KEY")
    model_alias = os.getenv("JUDGE_MODEL_ALIAS")

    missing = []
    if not base_url:
        missing.append("LITELLM_BASE_URL")
    if not api_key:
        missing.append("LITELLM_API_KEY")
    if not model_alias:
        missing.append("JUDGE_MODEL_ALIAS")

    if missing:
        raise ConfigurationError(
            f"Missing required environment variables: {', '.join(missing)}\n"
            f"See evals/.env.example for configuration template."
        )

    # Build judge instance.
    # The "openai/" prefix tells litellm to treat the custom proxy as OpenAI-compatible.
    # Without it, DeepEval's LiteLLMModel.get_model_name() calls litellm.get_llm_provider()
    # without custom_llm_provider, which raises BadRequestError for non-standard aliases
    # like "bedrock-claude-4-5-sonnet". The proxy strips the "openai/" prefix and routes
    # to the correct underlying model based on the alias.
    _judge_instance = LiteLLMModel(
        model=f"openai/{model_alias}",
        api_base=base_url,
        api_key=api_key,
    )

    return _judge_instance


def get_judge_metadata() -> dict:
    """Get metadata about the configured judge for result recording.

    Returns:
        Dict with judge_model_alias, judge_base_url (api_key is never included)

    Raises:
        ConfigurationError: If judge hasn't been built yet
    """
    if _judge_instance is None:
        raise ConfigurationError("Judge not built yet. Call build_judge() first.")

    return {
        "judge_model_alias": os.getenv("JUDGE_MODEL_ALIAS"),
        "judge_base_url": os.getenv("LITELLM_BASE_URL"),  # Safe to log
        # NEVER include LITELLM_API_KEY in metadata
    }
