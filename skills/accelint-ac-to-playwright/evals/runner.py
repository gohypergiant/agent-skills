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

# SUT output persistence directory — relative to this file.
# Rationale: without persisted SUT output, judge-vs-skill-vs-rubric disputes
# require paid re-runs. Each invocation writes one .md file here so any run
# can be replayed, diffed, or inspected offline.
_SUT_OUTPUT_DIR = Path(__file__).parent / "results" / "sut"


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


def build_system_prompt(
    mode: Literal["conversion", "assessment"] = "conversion",
    skill_root: Path | None = None,
) -> tuple[str, dict]:
    """Assemble the SUT system prompt by inlining the skill's full
    progressive-disclosure tree for ``mode``.

    The eval invokes the skill as a SINGLE completion with no tool or subagent
    access. The v2 skill (PR #120) is a thin orchestrator that would, at
    runtime, load mode files + validator references on demand and spawn
    validation *subagents*. A single-shot SUT can do neither. So we pre-resolve
    the disclosure here: every reference the skill would have loaded for ``mode``
    is inlined, and an eval-context note tells the model to apply the inlined
    validator rules directly instead of spawning subagents it has no tool for.

    Resilient to BOTH layouts: the monolithic v1 SKILL.md (mode files /
    validators simply absent → skipped) and the v2 split (present → inlined),
    so the eval keeps testing the skill faithfully across the #120 merge.

    Returns ``(system_prompt, hashes)``; ``hashes`` keeps all-string values for
    change tracking, plus ``inlined_refs`` recording which references were
    actually present and folded in.
    """
    skill_root = skill_root or Path(__file__).parent.parent
    references = skill_root / "references"

    skill_md = _read_file(skill_root / "SKILL.md")

    # Ordered (title, path, fence) specs, scoped to the mode so an assessment
    # run doesn't drag in conversion-only material (and vice versa) — keeping
    # the prompt faithful to what the skill would actually have loaded.
    ref_specs: list[tuple[str, Path, str | None]] = [
        ("acceptance-criteria.md", references / "acceptance-criteria.md", None),
        ("test-hooks.md", references / "test-hooks.md", None),
    ]
    if mode == "assessment":
        ref_specs.append(("assessment-mode.md", references / "assessment-mode.md", None))
    else:
        # Conversion runs assessment first, so it legitimately needs both.
        ref_specs.append(("conversion-mode.md", references / "conversion-mode.md", None))
        ref_specs.append(("assessment-mode.md", references / "assessment-mode.md", None))

    # v2 validator references (absent in the v1 monolith). Sorted for a stable
    # prompt hash; globbed so new validators are picked up without code changes.
    if references.is_dir():
        for vpath in sorted(references.glob("validate-*.md")):
            ref_specs.append((vpath.name, vpath, None))

    # Conversion must emit a schema-conformant plan; assessment never emits one,
    # so it doesn't need the schema (and inlining it would just burn tokens).
    if mode == "conversion":
        ref_specs.append(("scripts/plan-schema.ts", skill_root / "scripts" / "plan-schema.ts", "ts"))

    blocks: list[str] = [skill_md]
    inlined_refs: list[str] = []
    ref_concat = ""
    for title, path, fence in ref_specs:
        if not path.exists():
            continue
        content = _read_file(path)
        inlined_refs.append(title)
        ref_concat += content
        body = f"```{fence}\n{content}\n```" if fence else content
        blocks.append(f"---\n\n# Reference: {title}\n\n{body}")

    # Collapse the skill's subagent orchestration into the single-shot harness.
    # Without this, the model follows the v2 instructions to "spawn a subagent
    # with references/validate-*.md" — which it cannot do here — and the whole
    # validation layer silently no-ops. Everything those subagents would read is
    # inlined above; tell the model to apply it directly.
    blocks.append(
        "---\n\n# Eval execution context (read carefully)\n\n"
        "You are running inside an automated evaluation harness as a SINGLE "
        "completion. You have NO tools: you cannot spawn subagents, read files, "
        "or run scripts. Where the skill above says to 'spawn a subagent with "
        "references/validate-*.md', 'load' a reference, or 'run' a validator "
        "script, note that every such reference has already been INLINED above. "
        "Apply those validation rules DIRECTLY and inline, then produce the same "
        "final report you would have produced after the subagents returned. Do "
        "not describe spawning subagents; just do the validation and report."
    )

    system_prompt = "\n\n".join(blocks)

    hashes = {
        "skill_md_hash": _hash_content(skill_md),
        "references_hash": _hash_content(ref_concat),
        "prompt_hash": _hash_content(system_prompt),
        "inlined_refs": ", ".join(inlined_refs),
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

    # Build system prompt — mode-scoped so the inlined disclosure matches what
    # the skill would actually load for this mode.
    system_prompt, hashes = build_system_prompt(mode)

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

    # Build timestamp once so filename and metadata share the same value.
    run_ts = datetime.now(timezone.utc)
    run_ts_iso = run_ts.isoformat()
    # Compact UTC timestamp for filenames: drop colons / plusses / microseconds
    # e.g. "20260611T153042Z"
    ts_compact = run_ts.strftime("%Y%m%dT%H%M%SZ")
    fixture_stem = fixture_path.stem

    # Persist SUT output to disk before building the metadata dict so we can
    # include the relative path in the returned metadata.
    _SUT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    sut_filename = f"{ts_compact}-{fixture_stem}-{mode}.md"
    sut_output_path = _SUT_OUTPUT_DIR / sut_filename

    sut_meta_block = {
        "model": model_id,
        "mode": mode,
        "fixture": str(fixture_path.name),
        "timestamp": run_ts_iso,
        "tokens": token_usage,
        "latency_seconds": round(latency_seconds, 3),
    }
    sut_output_path.write_text(
        "```json\n"
        + json.dumps(sut_meta_block, indent=2)
        + "\n```\n\n"
        + output,
        encoding="utf-8",
    )

    # Relative path from the evals/ root for portability in JSON artifacts.
    sut_rel_path = str(sut_output_path.relative_to(Path(__file__).parent))

    # Build metadata
    metadata = {
        "sut_provider": provider,
        "sut_model_id": model_id,
        "mode": mode,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "fixture": str(fixture_path.name),
        "run_timestamp": run_ts_iso,
        "token_usage": token_usage,
        "latency_seconds": round(latency_seconds, 3),
        "sut_output_path": sut_rel_path,
        **hashes,
    }

    return {
        "output": output,
        "metadata": metadata,
    }
