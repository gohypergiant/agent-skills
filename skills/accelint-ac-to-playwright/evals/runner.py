"""SUT (System Under Test) runner for invoking the ac-to-playwright skill."""

import hashlib
import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

from litellm import completion
from litellm_judge import ConfigurationError


class SUTError(Exception):
    """Raised when SUT invocation fails."""
    pass


def _read_file(path: Path) -> str:
    """Read a file and return its contents."""
    if not path.exists():
        raise FileNotFoundError(f"Required file not found: {path}")
    return path.read_text(encoding="utf-8")


def _hash_content(content: str) -> str:
    """Compute SHA256 hash of content for change detection."""
    return hashlib.sha256(content.encode("utf-8")).hexdigest()[:16]


def build_system_prompt() -> tuple[str, dict]:
    """Build the system prompt by concatenating SKILL.md + references.

    Returns:
        Tuple of (system_prompt_text, hashes_dict)
        hashes_dict contains skill_md_hash and references_hash for change tracking
    """
    skill_root = Path(__file__).parent.parent
    skill_md_path = skill_root / "SKILL.md"
    ac_ref_path = skill_root / "references" / "acceptance-criteria.md"
    hooks_ref_path = skill_root / "references" / "test-hooks.md"
    plan_schema_path = skill_root / "scripts" / "plan-schema.ts"

    skill_md = _read_file(skill_md_path)
    ac_ref = _read_file(ac_ref_path)
    hooks_ref = _read_file(hooks_ref_path)
    # The skill normally tells the agent to consult plan-schema.ts from disk.
    # The eval harness has no file-reading tools, so inline it here so the
    # model knows the current field names (suiteName, name, action, value, ...).
    plan_schema = _read_file(plan_schema_path)

    system_prompt = f"""{skill_md}

---

# Reference: acceptance-criteria.md

{ac_ref}

---

# Reference: test-hooks.md

{hooks_ref}

---

# Reference: scripts/plan-schema.ts (authoritative Zod schema)

```ts
{plan_schema}
```
"""

    hashes = {
        "skill_md_hash": _hash_content(skill_md),
        "references_hash": _hash_content(ac_ref + hooks_ref + plan_schema),
        "prompt_hash": _hash_content(system_prompt),
    }

    return system_prompt, hashes


def invoke_sut(
    fixture_path: Path,
    mode: Literal["conversion", "assessment"],
    temperature: float = 0.0,
    max_tokens: int = 8192,
) -> dict:
    """Invoke the SUT with a fixture and return the result.

    Args:
        fixture_path: Path to the .feature AC file
        mode: "conversion" for full pipeline, "assessment" for evaluation only
        temperature: Sampling temperature (default 0 for determinism)
        max_tokens: Maximum response tokens

    Returns:
        Dict with:
        - output: The SUT's response text
        - metadata: Run metadata (model, hashes, timestamp)

    Raises:
        ConfigurationError: If SUT env vars are missing
        SUTError: If SUT invocation fails
    """
    # Validate SUT configuration
    provider = os.getenv("SUT_PROVIDER")
    model_id = os.getenv("SUT_MODEL_ID")

    if not provider or not model_id:
        raise ConfigurationError(
            "Missing SUT configuration. Required: SUT_PROVIDER, SUT_MODEL_ID\n"
            "See evals/.env.example for configuration template."
        )

    # Provider-specific setup
    api_base = None
    api_key = None

    if provider == "litellm":
        api_base = os.getenv("SUT_LITELLM_BASE_URL")
        api_key = os.getenv("LITELLM_API_KEY")  # Can reuse judge key
        if not api_base or not api_key:
            raise ConfigurationError(
                "SUT_PROVIDER=litellm requires: SUT_LITELLM_BASE_URL, LITELLM_API_KEY"
            )
    elif provider == "anthropic":
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ConfigurationError(
                "SUT_PROVIDER=anthropic requires: ANTHROPIC_API_KEY"
            )
    else:
        raise ConfigurationError(
            f"Unsupported SUT_PROVIDER: {provider}. Supported: litellm, anthropic"
        )

    # Build system prompt
    system_prompt, hashes = build_system_prompt()

    # Read fixture
    if not fixture_path.exists():
        raise FileNotFoundError(f"Fixture not found: {fixture_path}")

    fixture_content = fixture_path.read_text(encoding="utf-8")

    # Build user message based on mode.
    #
    # IMPORTANT EVAL MODE NOTE:
    # The skill's conversion workflow normally instructs the agent to ask the user for
    # output directories and write files. In the eval harness there is no filesystem
    # and no second turn — we run a single completion call and grade the textual
    # output. The conversion prompt below therefore overrides Step 2 of the conversion
    # workflow ("require the user to explicitly provide output directories ... before
    # writing any files") and asks the model to emit the JSON test plan inline.
    #
    # Assessment mode is unchanged: it's a one-shot text response by design.
    if mode == "conversion":
        user_message = (
            "You are running inside an automated evaluation harness. There is no "
            "filesystem and no follow-up turn — your entire reply will be graded "
            "as plain text.\n\n"
            "Convert the acceptance criteria below into a JSON test plan that "
            "conforms to `references/plan-schema.ts`. Do the assessment step first, "
            "and if (and only if) the AC are conversion-ready, emit the JSON plan.\n\n"
            "Output rules for this eval run:\n"
            "1. If the AC are NOT conversion-ready, respond with the assessment-mode "
            "   failure report and stop (no JSON).\n"
            "2. If the AC ARE conversion-ready, emit the JSON test plan as the final "
            "   content of your reply, wrapped in a single ```json ... ``` fenced "
            "   code block. No file writes, no directory questions, no translation "
            "   to Playwright code — just the JSON plan.\n"
            "3. Do not omit fields or scenarios to shorten the response.\n\n"
            "Acceptance criteria:\n\n"
            f"{fixture_content}"
        )
    else:  # assessment
        user_message = (
            "Run assessment mode on these acceptance criteria and report your "
            "findings. Output the report directly as text (no file writes):\n\n"
            f"{fixture_content}"
        )

    # Invoke SUT via litellm
    try:
        # Build completion kwargs
        completion_kwargs = {
            "model": model_id,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        # Add provider-specific args
        if provider == "litellm":
            completion_kwargs["api_base"] = api_base
            completion_kwargs["api_key"] = api_key
            completion_kwargs["custom_llm_provider"] = "openai"  # Required for custom proxy
        elif provider == "anthropic":
            completion_kwargs["api_key"] = api_key

        latency_start = time.perf_counter()
        response = completion(**completion_kwargs)
        latency_seconds = time.perf_counter() - latency_start

        output = response.choices[0].message.content

        # Extract token usage from response
        usage = response.usage if hasattr(response, 'usage') else None
        token_usage = {
            "prompt_tokens": usage.prompt_tokens if usage else None,
            "completion_tokens": usage.completion_tokens if usage else None,
            "total_tokens": usage.total_tokens if usage else None,
        }

    except Exception as e:
        raise SUTError(f"SUT invocation failed: {e}")

    # Build metadata
    metadata = {
        "sut_provider": provider,
        "sut_model_id": model_id,
        "mode": mode,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "fixture": str(fixture_path.name),
        "run_timestamp": datetime.now(timezone.utc).isoformat(),
        "token_usage": token_usage,
        "latency_seconds": round(latency_seconds, 3),
        **hashes,
    }

    return {
        "output": output,
        "metadata": metadata,
    }
