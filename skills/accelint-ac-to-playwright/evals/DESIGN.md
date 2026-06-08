# LLM Evaluation Harness Design

**Version**: 2.0
**Last updated**: 2026-06-08
**Status**: In active development on `feat/llm-evaluation`

---

## Purpose

This harness grades the `accelint-ac-to-playwright` skill's LLM stage against the success-metric rubric in the eval spec. It defends the seam between unstructured acceptance criteria (AC) text and the structured test artifacts (JSON test plans, assessment reports) the skill is supposed to produce.

**This is internal infrastructure.** `evals/` and `assets/evals/expected/` are excluded from customer skill installs.

---

## The two LLM roles

Almost every confusing thing about this harness clears up once you separate the two LLM roles. They share a model alias today (Sonnet 4.5 via LiteLLM proxy) but are independent concepts:

| Role | What it is | How it's called | Configured by |
|---|---|---|---|
| **SUT** (System Under Test) | The model we're grading | `runner.invoke_sut()` — direct `litellm.completion()` call | `SUT_PROVIDER`, `SUT_MODEL_ID`, `SUT_LITELLM_BASE_URL` |
| **Judge** | A model that grades the SUT's output for GEval-based metrics | DeepEval's `LiteLLMModel` instance, used inside `GEval` | `LITELLM_BASE_URL`, `LITELLM_API_KEY`, `JUDGE_MODEL_ALIAS` |

The harness runs the SUT once per `(fixture, mode)` test, captures the text output, then runs several metrics against that output. Some metrics are pure Python (no judge); others call the judge to score the SUT's output.

---

## Failure modes (what Zod schema can't catch)

The production Zod schema (`scripts/plan-schema.ts`) catches structural errors:
- Missing required fields
- Wrong field types
- Invalid action enums
- Tag pattern violations

**It cannot catch semantic errors:**

1. **Dropped scenarios** — AC has 5 scenarios, plan has 4. Zod sees valid JSON; can't detect completeness.
2. **Target pattern violations** — Zod validates that `target` is a string; can't enforce the `area.component.intent` pattern or the controlled vocabulary.
3. **Hallucinated assertions** — Plan adds `expectText` with text that never appeared in AC. Zod validates structure, can't trace provenance.
4. **Ungrounded fill values** — AC says "fill with a valid email"; plan invents `test@example.com`. Zod validates string format, can't detect guessing.
5. **Action-element type mismatches** — AC says "fill the button"; plan generates `fill` on a button target. Zod validates action and target separately, misses semantic incompatibility.
6. **Wrong mode behaviour** — User requests assessment; LLM generates a plan. Zod never sees the user request.
7. **Step ordering bugs** — AC follows Given → When → Then; plan shuffles them. Zod validates steps independently, doesn't enforce sequence.
8. **Workflow non-adherence** — SKILL.md prescribes a specific procedure; SUT skips steps. Not a JSON property at all.
9. **Silent assumptions** — SUT silently chooses values for ambiguous AC instead of asking. Output is valid JSON, just untrustworthy.
10. **File-write claims** — SUT claims to have written files even though it has no filesystem in eval mode. Pure prose hallucination.

The metric set below is designed around enumerating + detecting each of those failure modes.

---

## Persona × scenario taxonomy

The eval spec defines five conversation workflows. Each is one (persona, scenario) tuple tested in this harness:

| Persona | Scenario | Slug | Fixture | Mode |
|---|---|---|---|---|
| PM | assesses perfect AC | `pm` / `perfect-assess` | `PERFECT-AC.feature` | assessment |
| PM | assesses pretty-good AC | `pm` / `mixed-assess` | `MIXED-AC-1.feature` | assessment |
| PM | assesses not-ready AC | `pm` / `bad-assess` | `BAD-AC.feature` | assessment |
| Engineer | converts perfect AC | `engineer` / `perfect-convert` | `PERFECT-AC.feature` | conversion |
| Engineer | converts not-ready AC | `engineer` / `bad-convert` | `BAD-AC.feature` | conversion |

The slugs are the canonical labels in `_reporter.SCENARIO_LABELS` and in the JSON artifact's `metrics[].scenario` field. Tests record their persona + scenario via the `record_metric(...)` fixture so the scorecard can group rows.

(`MIXED-AC.feature` was split into `MIXED-AC-{1..5}.feature` in a separate commit to exercise more error categories per slice. Today tests use slice 1 as the canonical mixed example. Iterating all five slices is a follow-up.)

---

## Metrics

Fifteen metrics, organised around the eval spec's three dimensions plus runtime telemetry.

### Completeness & correctness (7)

| Name | Type | Catches |
|---|---|---|
| `task_completion` | GEval | refusals, mode confusion, partial / incomplete attempts |
| `goal_accuracy` | GEval | dropped scenarios, false positives/negatives, AC-source mismatches |
| `json_structural` | Deterministic (shells to Zod CLI) | every structural error class — schema is the source of truth |
| `target_coverage` | Deterministic | dropped scenarios, missing `must_have_targets` from hand-authored YAML |
| `json_completeness` | Deterministic | every AC scenario + step represented in the plan (broader than `target_coverage`) |
| `assessment_quality` | GEval | missed expected issues, false positives in assessment reports |
| `blatant_errors` | GEval | self-contradictions, malformed output, invented scenario/file names |

### Efficiency (2 metrics + runtime telemetry)

| Name | Type | Catches |
|---|---|---|
| `step_efficiency` | Deterministic | output bloat — essential content / total output length |
| `clarification_needed` | Deterministic | count of clarification-style questions vs an expected band |
| Runtime telemetry | Captured per SUT call | latency p50/p95/max, per-mode token usage, total tokens |

### LLM pitfalls (5)

| Name | Type | Catches |
|---|---|---|
| `hallucinations` | Deterministic | `expectText` / visibility / `expectUrl` assertions not grounded in AC |
| `semantic_quality` | GEval | semantic mapping: targets, action-element compatibility, ordering |
| `plan_adherence` | GEval | skipped or reordered SKILL.md workflow steps |
| `assumptions` | GEval | silent invention of values for ambiguous AC items |
| `permission_compliance` | Deterministic | claims that files were written (eval mode forbids it) |

### Tool correctness — N/A

The eval spec lists tool correctness as a desired metric. The harness invokes the SUT via a single-shot `completion()` call with no tools, so tool correctness is not measurable here. It would matter for a multi-turn / tool-using SUT runner (a future architectural shift).

### Design rules

- **GEval subclasses** override `measure` and `a_measure` with `(self, test_case, *args, **kwargs)` and forward `*args, **kwargs` to `super()`. DeepEval 4.x passes private kwargs (`_show_indicator`, `_in_component`) through that path; narrower overrides crash with `unexpected keyword argument '_show_indicator'`.
- **GEval subclasses that declare `EXPECTED_OUTPUT` in `evaluation_params`** inject a placeholder in `measure()` when the test case didn't set one. Without that injection DeepEval raises `MissingTestCaseParamsError` before recording can happen.
- **Deterministic metric classes** use the `BaseMetric` interface (set `self.score`, `self.success`, `self.reason`, implement `is_successful()` and a `__name__` property).
- **JSON-parsing metrics** all go through `metrics._json_extraction.extract_plan_json`, which tolerates `\`\`\`json` fenced blocks, raw JSON, and balanced `{...}` fallback scans.

---

## Metric regression tests

Each metric has at least one regression test proving it can fail. Live (judge-driven) regression tests are marked `@pytest.mark.live` so they don't run by default.

| Metric | Synthetic failure case | Expected behaviour |
|---|---|---|
| `json_structural` | Plan missing `suiteName` | Score 0; reason mentions Zod schema violation |
| `target_coverage` | Plan misses one `must_have_target` | Score 0; reason names the missing target |
| `hallucinations` | Plan adds `expectText` not in AC | Score < 1; reason names the unfounded text |
| `plan_adherence` (live) | Plan-only output with no assessment pass | Score < 0.8; reason notes skipped workflow |
| `assumptions` (live) | Silent invention of `test@example.com` for "a valid email" | Score < 0.7; reason notes silent invention |
| `permission_compliance` | Output claims "I have written the plan to ..." | Score 0; reason names the offending phrase |
| `step_efficiency` | Long preamble + small JSON plan | Score < 0.7; reason includes essential/total ratio |
| `clarification_needed` | 5 clarification questions, band (0, 0) | Score < 1.0; reason names the count |
| `blatant_errors` (live) | "AC ready" then 3 issues listed | Score < 0.9; reason notes contradiction |
| `json_completeness` | Plan with 3 tests, AC with 5 scenarios | Score < 1.0; reason names the count mismatch |
| `plan_semantic` (live) | Plan with 11 tests for a 10-scenario AC | Score < 1.0; reason flags the extra |
| `assessment_quality` (live) | Report with 4/7 expected issues | Score < 0.7; reason notes missing 3 |

`task_completion`, `goal_accuracy`, `semantic_quality` rely on synthetic failures embedded in the persona/scenario tests rather than dedicated regression tests, since their failure surfaces are large and well-covered by the production flows.

---

## Scorecard architecture

The scorecard is the harness's primary user-visible artifact. It's rendered via `pytest_terminal_summary` and writes a structured JSON sibling for downstream consumers.

### Data flow

```
        ┌──────────────────────────────────────────────┐
        │  pytest collection                           │
        └─────────────────────┬────────────────────────┘
                              │
                ┌─────────────▼────────────┐
                │  Per-test execution      │
                │    1. sut(fixture, mode) │──┐
                │    2. metric.measure()   │  │
                │    3. record_metric(...) │  │
                └─────────────┬────────────┘  │
                              │               │
              ┌───────────────▼──────┐        │
              │  ScorecardCollector  │◄───────┘ (record_invocation)
              │  (session-scoped)    │
              └───────────────┬──────┘
                              │
            ┌─────────────────▼──────────────────────┐
            │  pytest_terminal_summary (conftest.py) │
            │     ├─ render_scorecard()  → stdout    │
            │     └─ write_json_artifact() → results/│
            └────────────────────────────────────────┘
```

### Key files

- `_reporter.py` — `ScorecardCollector`, the rendering functions, the JSON writer, the dimension/persona/scenario label maps
- `conftest.py` — fixtures (`sut`, `record_metric`, `judge`, ...) + the `pytest_terminal_summary` hook
- `_noise_filter.py` — logging filters that drop the cosmetic `logprobs unsupported` ERROR from DeepEval's GEval fallback path + suppression of LiteLLM's ANSI-red stdout polish

### Scorecard layout

The rendered scorecard has six blocks, in order:

1. **Header**: run timestamp, duration, SUT model, judge model, prompt hash, skill_md hash.
2. **Completeness & correctness** table: per-test PASS/FAIL with score and threshold.
3. **Efficiency** table: per-test PASS/FAIL for efficiency-dimension metrics.
4. **LLM pitfalls** table.
5. **Runtime telemetry**: latency p50/p95/max, per-mode token usage, run totals.
6. **Personas / scenarios** rollup: PASS / PARTIAL / FAIL per (persona, scenario) bucket.
7. **Failure details**: numbered blocks, each with the full untruncated judge reason word-wrapped at 88 chars.

### JSON artifact

Written to `results/run-<utc-iso>.json`. Schema is documented in README.md. Key invariants:

- `metrics[].score` is normalised to `[0, 1]`.
- `metrics[].dimension` ∈ {`completeness`, `efficiency`, `pitfalls`} — drives scorecard grouping.
- `metrics[].reason` is whitespace-normalised but **never truncated**. The full judge reasoning is preserved for dashboards / regression diffs.
- `prompt_hash`, `skill_md_hash`, `references_hash` let downstream consumers distinguish "SUT changed" from "skill prompt changed" when scores move.

---

## Environmental assumptions

| Component | Version/Config | Rationale | If wrong |
|---|---|---|---|
| Python | 3.11+ | DeepEval requires 3.9+; 3.11 used by `.venv` | Syntax errors in pattern matching |
| DeepEval | `>=4.0.0` | LiteLLMModel adapter API; `MAKE_CELL` opcode in GEval subclasses | API changes in metrics; pycdc decompile breaks |
| LiteLLM | `==1.55.0` | Compatible with DeepEval 4.x | Provider routing breaks |
| Node | ≥25 | Required by skill's TypeScript toolchain | `tsc` fails, `dist/scripts/cli/validate-plan.js` missing |
| `validate-plan` CLI | `node dist/scripts/cli/validate-plan.js <path>` after `npm run build` | TypeScript outputs to `dist/` per `tsconfig.json` | `json_structural` fails on every test |
| Fixtures | `assets/evals/{PERFECT-AC,BAD-AC,MIXED-AC-{1..5}}.feature` | Hand-authored across multiple commits | conftest aborts at startup |

**Judge model alias workaround**: DeepEval's `LiteLLMModel.get_model_name()` calls `litellm.get_llm_provider(self.name)` *without* `custom_llm_provider`. For non-standard aliases like `bedrock-claude-4-5-sonnet` that raises `BadRequestError`. The fix in `litellm_judge.build_judge()` is to prefix the model with `openai/` so LiteLLM treats the proxy as OpenAI-compatible. The proxy strips the prefix and routes to the actual underlying model.

**Eval-mode user prompt override**: The skill's conversion workflow normally asks the user for output directory paths before writing files. The eval harness has no filesystem and no second turn. `runner.invoke_sut()` therefore appends explicit eval-mode instructions ("emit the JSON inline in a fenced block, do not write files") to the user message. The `permission_compliance` metric then verifies the SUT didn't claim to have written anything anyway.

**Schema inlining**: The skill tells the LLM to consult `scripts/plan-schema.ts` from disk. In eval mode there's no file-reading tool, so `runner.build_system_prompt()` inlines the schema source into the system prompt. Without this the SUT emits stale field names (`testName`, `text`, `key` instead of `name`, `value`).

---

## Logging policy

**LiteLLM proxy logging**: Approved for internal material. The PERFECT/MIXED/BAD fixtures and any internal ACs are within policy.

**Proxy behaviour** (TBD — confirm with proxy admin):
- Does it persist full prompt/response payloads?
- Where are they stored?
- Retention period?
- Who has read access?

**Customer AC handling**: If this eval is ever pointed at customer-provided ACs (not internal fixtures), customer data is a separate policy category. Re-check logging policy before doing so.

---

## Ground truth artifacts

Under `assets/evals/expected/`:

- **`PERFECT-AC.plan.json`** — reference plan, hand-authored from `PERFECT-AC.feature` using SKILL.md mapping rules. Pinned by human, survives model drift.
  - *Currently stale relative to the production schema:* uses old field names (`testName`, flat `type: "click"`). The judge correctly flags the mismatch in `goal_accuracy`. Regenerating against current `scripts/plan-schema.ts` is a known follow-up.
- **`PERFECT-AC.assertions.yaml`** — structured assertions for deterministic metrics: `must_have_targets`, forbidden actions, visibility pair expectations.
- **`MIXED-AC.assessment.yaml`** — expected issues for the mixed AC: 7 hand-authored items with required substrings + fix suggestions.
- **`BAD-AC.assessment.yaml`** — expected issues for the bad AC.

**Generation process**: read fixtures carefully, enumerate issues by hand. Do not prompt an LLM to generate ground truth.

---

## CI integration

See `.github/workflows/llm-eval.yml` (when present).

**Triggers:**
- PRs touching: `SKILL.md`, `references/**`, `assets/evals/**`, `evals/**`
- Pushes to `feat/llm-evaluation`

**Status**: `continue-on-error: true` (v1 is advisory until thresholds are calibrated against more SUT-variation runs).

---

## Local developer usage

**Setup:**
1. Request a personal virtual key from the proxy admin (do not reuse CI key)
2. Copy `evals/.env.example` to `evals/.env`
3. Fill in:
   ```
   LITELLM_BASE_URL=https://litellm-ai.accelint.dev
   LITELLM_API_KEY=<your-key>
   JUDGE_MODEL_ALIAS=bedrock-claude-4-5-sonnet
   SUT_PROVIDER=litellm
   SUT_MODEL_ID=bedrock-claude-4-5-sonnet
   SUT_LITELLM_BASE_URL=https://litellm-ai.accelint.dev
   ```

**Run evals** (see `README.md` for the full set of `npm run eval` variants).

**Results** are written to `evals/results/run-<utc-iso>.json` (gitignored).

---

## Packaging exclusion

**Mechanism**: `package.json` `files` field explicitly lists what ships. `evals/` and `assets/evals/` are absent so they're excluded by default.

**Assumption**: The skill registry honors the `files` field. If the actual mechanism differs (`.skillignore`, manifest exclusion patterns), update this section.

**Verification**: after release, grep the produced artifacts for `evals/` paths and confirm none are in the distribution bundle.

---

## Known follow-ups

These are real, file-able issues — not aspirational features.

1. **Regenerate `PERFECT-AC.plan.json`** against the current Zod schema. The current fixture uses old field names; `goal_accuracy` in conversion mode legitimately fails because of the mismatch. This is fixture maintenance, not a metric bug.
2. **Fix `target_coverage` test errors**. After fixture / schema drift the test errors before measuring. Needs a 10-minute look at how `perfect_ac_expected` is shaped.
3. **Recalibrate `plan_adherence` for conversion mode**. The rubric currently penalises a correct halt-on-failed-assessment (it expects a JSON plan to always appear). For `Engineer · converts not-ready AC` the SUT does the right thing per SKILL.md and the metric still scores it low. The rubric needs a branch for "AC not ready → no plan expected → halt = adherence".
4. **`MIXED-AC` slice iteration**. Tests currently use slice 1 as canonical mixed. Iterating slices 2–5 would broaden coverage without new fixture work.
5. **SUT call caching by `(fixture, mode)`**. Today each test invokes the SUT independently even when scenarios overlap. A session-scoped cache would drop SUT calls from ~26 to ~5 per full run — a meaningful cost saver.
6. **Multi-model harness**. The eval spec calls for a `models.yaml` config supporting `bedrock-claude-4-5-sonnet`, `bedrock-claude-3-haiku`, and `bedrock-nova-pro` with `active` and `threshold_mode` (`strict` vs `baseline`) per model. Today the harness runs a single SUT defined via env vars. Spec-compliant version is a follow-up.
7. **Backfill new metrics to existing scenarios**. The 7 metrics added in 2026-06-08's expansion are wired into the two new scenarios (`pm/perfect-assess`, `engineer/bad-convert`) but not into the three pre-existing scenarios (`pm/mixed-assess`, `pm/bad-assess`, `engineer/perfect-convert`). Backfilling would give every persona/scenario the same full rubric.
8. **Multi-turn / tool-using SUT runner**. The current single-shot completion path makes `tool_correctness` and context-retention metrics from the spec inapplicable. A multi-turn runner would unlock them but is a significant architectural change.

---

## Architecture decisions and rationale

A few non-obvious design calls worth documenting:

### Why the judge model gets an `openai/` prefix
DeepEval's `LiteLLMModel.get_model_name()` doesn't pass `custom_llm_provider` to `litellm.get_llm_provider()`. For our proxy-aliased Bedrock model this raises `BadRequestError` during `GEval.__init__`. Prefixing with `openai/` makes LiteLLM treat the proxy as OpenAI-compatible at the get-provider call; the proxy strips the prefix at request time. Verified via direct `LiteLLMModel.generate()` test that the actual completion calls route correctly.

### Why the eval-mode user prompt overrides the skill's "ask for directories" step
The SKILL.md conversion workflow is *correct* for production (multi-turn agentic use). The eval harness is single-shot completion — there's no second turn for the SUT to receive directory paths. Two options:
- (A) Make the eval harness do tool use. Big change, would unlock tool_correctness but require multi-turn orchestration.
- (B) Override the file-write instruction in the user prompt, ask for inline JSON, then verify the SUT didn't *claim* to have written files anyway via `permission_compliance`.

(B) was chosen because it keeps the harness simple and isolates the "is the model trying to do things it doesn't have permission to do" check as its own metric.

### Why every metric reason is preserved fully in the JSON artifact
The metric `reason` field is the actionable output — it's what tells a human *why* a test failed. Truncating it in the JSON breaks downstream regression diffs (you can't tell if the same root cause is recurring). The scorecard renders reasons inline with word-wrap; the JSON keeps them whitespace-normalised but full-length.

### Why deterministic metrics shell to the production Zod validator
`json_structural` runs `node dist/scripts/cli/validate-plan.js` instead of reimplementing the schema in Python. This guarantees the test sees the same schema production sees — if `scripts/plan-schema.ts` changes, the test picks it up at the next `npm run build`. Reimplementing would create a second source of truth and silent drift.

### Why we use a session-scoped collector + terminal_summary hook instead of writing per-test
pytest hooks like `pytest_runtest_logreport` would let each test write its own JSON entry. Aggregating at session-end via `pytest_terminal_summary` makes the rollup (latency p50/p95, persona/scenario PASS rollup, "below_threshold" summary) trivial and atomic. A crash mid-run produces no partial artifact — which is preferable to a half-written file that looks complete.
