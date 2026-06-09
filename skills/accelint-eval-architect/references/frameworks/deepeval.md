# DeepEval — expert-only adoption gotchas

Not a DeepEval tutorial. These are the specific traps that cost real debugging
time on the reference impl. Read before scaffolding a DeepEval harness.

## Bedrock via a custom LiteLLM proxy: the `openai/` prefix

DeepEval's `LiteLLMModel.get_model_name()` calls `litellm.get_llm_provider(name)`
**without** `custom_llm_provider`. For a proxy alias like
`bedrock-claude-4-5-sonnet` that raises `BadRequestError: LLM Provider NOT
provided` during `GEval.__init__` — before any eval runs.

Fix: prefix the model with `openai/` so LiteLLM treats the proxy as
OpenAI-compatible. The proxy strips the prefix and routes to the real model.

```python
LiteLLMModel(
    model=f"openai/{model_alias}",   # NOT just model_alias
    api_base=base_url,
    api_key=api_key,
)
```

Passing `custom_llm_provider="openai"` as a kwarg does NOT fix it — the failure
is in `get_model_name()`, which ignores kwargs.

## GEval subclasses must forward `*args, **kwargs` (DeepEval 4.x)

`GEval.measure()` internally calls `a_measure(..., _show_indicator=False, …)`.
A subclass that overrides with a narrow signature crashes:
`TypeError: a_measure() got an unexpected keyword argument '_show_indicator'`.

```python
def measure(self, test_case, *args, **kwargs):
    return super().measure(test_case, *args, **kwargs)
async def a_measure(self, test_case, *args, **kwargs):
    return await super().a_measure(test_case, *args, **kwargs)
```

## EXPECTED_OUTPUT is required if you declare it

If a GEval metric lists `LLMTestCaseParams.EXPECTED_OUTPUT` in
`evaluation_params` but a test case doesn't set `expected_output`, DeepEval
raises `MissingTestCaseParamsError` before scoring. For metrics that grade against
`retrieval_context` (the source) rather than a reference output, inject a
placeholder in `measure()`:

```python
if not test_case.expected_output:
    test_case.expected_output = (
        "No reference output — judge against retrieval_context only."
    )
```

## The cosmetic `logprobs` ERROR

GEval first tries `generate_raw_response(..., logprobs=True)`. Bedrock rejects
`logprobs`, LiteLLM logs an ERROR, and GEval silently falls back to the schema
path and succeeds. The run is fine; the red ERROR line is noise. Suppress it with
a logging filter so it doesn't read as a real failure:

```python
class _DropLogprobsFallbackErrors(logging.Filter):
    def filter(self, record):
        return not (record.levelno >= logging.ERROR and "logprobs" in record.getMessage())
logging.getLogger().addFilter(_DropLogprobsFallbackErrors())
```

Also set `litellm.suppress_debug_info = True` to kill its ANSI "Provider List"
stdout polish.

## Fenced ```json``` output: extract before parsing

If the SUT emits a prose assessment then a ```json fenced block, a metric that
does `json.loads(actual_output)` fails. Use a tolerant extractor (last fenced
block → raw JSON → largest balanced `{...}`). Ship it once in
`metrics/_json_extraction.py` and call it from every JSON-parsing metric.

## Two model roles, one adapter pattern

Keep the **judge** (DeepEval `LiteLLMModel`, built in `litellm_judge.py`) separate
from the **SUT** (a plain `litellm.completion()` call in `runner.py`). They may
share an alias but are configured by different env vars
(`JUDGE_MODEL_ALIAS` vs `SUT_MODEL_ID`). Conflating them is the top source of
confusion.

## Cost-gating

Mark judge tests `@pytest.mark.live` and default `addopts` to `-m "not live"` so
the free deterministic metrics run by default and judge calls are opt-in via
`pytest -m live`. Without this, every run bills the judge.

## Reuse, don't rebuild

The reference impl's `_reporter.py` (scorecard + JSON artifact),
`litellm_judge.py`, and `_noise_filter.py` are skill-agnostic. The scaffold
template ships distilled copies. Generalize `conftest.py` per target (its fixture
validation is target-specific) but copy the reporter/judge/noise infra near-
verbatim.
