"""Helper for extracting JSON from LLM responses.

The eval harness prompts the SUT to emit a JSON test plan wrapped in a fenced
```json ... ``` block (so the SUT can also include a short conversion-readiness
assessment in prose before the JSON, matching the skill's actual workflow).
Deterministic metrics that need to parse the plan use ``extract_plan_json`` to
pull out the JSON block before calling ``json.loads``.
"""

import json
import re
from typing import Any

_FENCED_JSON_RE = re.compile(
    r"```(?:json)?\s*(\{.*?\}|\[.*?\])\s*```",
    re.DOTALL | re.IGNORECASE,
)


class PlanExtractionError(ValueError):
    """Raised when no valid JSON plan can be extracted from the response."""


def extract_plan_json(response_text: str) -> Any:
    """Return the parsed JSON plan embedded in ``response_text``.

    Strategy:
    1. Look for fenced ```json ... ``` (or bare ``` ... ```) blocks and parse
       the last one (the SUT's instruction is to put the plan at the end of
       the reply).
    2. Fallback: try parsing the whole string as JSON.
    3. Fallback: find the largest balanced ``{...}`` block and parse that.

    Raises ``PlanExtractionError`` with a descriptive message on failure.
    """
    if not response_text or not response_text.strip():
        raise PlanExtractionError("Response is empty.")

    # 1. Fenced code blocks — prefer the last one in case prose came first.
    fenced = _FENCED_JSON_RE.findall(response_text)
    for candidate in reversed(fenced):
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            continue

    # 2. Try the whole response as raw JSON.
    stripped = response_text.strip()
    try:
        return json.loads(stripped)
    except json.JSONDecodeError:
        pass

    # 3. Last-ditch: largest balanced object scan.
    obj_text = _largest_balanced_object(stripped)
    if obj_text is not None:
        try:
            return json.loads(obj_text)
        except json.JSONDecodeError as exc:
            raise PlanExtractionError(
                f"Found an object-like block but could not parse it as JSON: {exc}"
            ) from exc

    raise PlanExtractionError(
        "No JSON object found in response. Looked for ```json``` fenced blocks, "
        "a top-level JSON document, and a balanced {...} block."
    )


def _largest_balanced_object(text: str) -> str | None:
    """Return the largest substring of ``text`` that is a balanced {...} block.

    Naive scanner — adequate for the eval harness, where the SUT is asked to
    emit a single JSON document. Skips string literals so braces inside strings
    don't throw off depth counting.
    """
    best_start = best_end = -1
    best_len = 0
    depth = 0
    start = -1
    in_string = False
    escape = False
    for idx, ch in enumerate(text):
        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_string = False
            continue
        if ch == '"':
            in_string = True
        elif ch == "{":
            if depth == 0:
                start = idx
            depth += 1
        elif ch == "}":
            if depth > 0:
                depth -= 1
                if depth == 0 and start >= 0:
                    length = idx - start + 1
                    if length > best_len:
                        best_len = length
                        best_start = start
                        best_end = idx + 1
                    start = -1
    if best_start >= 0:
        return text[best_start:best_end]
    return None
