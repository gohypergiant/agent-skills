# Assessment — reading and classifying a target skill

Goal: turn a target skill into an **eval profile** — the structured facts that
drive the framework recommendation. Read first, classify second, recommend
third. Never recommend from the skill's name or description alone.

## What to read, and what each source decides

| Read this | Extract | Decides |
|---|---|---|
| `SKILL.md` frontmatter | `name`, `description`, the actors in "Use when…" | personas; one-line summary |
| `SKILL.md` body — mode/workflow sections | single vs multi mode; single-shot vs multi-turn | scenario axis; multi-turn pushes toward Inspect AI |
| `SKILL.md` body — output-format / "Output Rules" sections | output shape (JSON / code / prose / diagram / file writes) | **master variable** for metric inventory |
| `SKILL.md` "NEVER Do" anti-patterns | the domain failure modes, already enumerated by the author | seeds the metric list directly — do not re-derive what's already written |
| `references/*.ts`, `*.json`, schema files | controlled vocabularies, Zod/JSON schemas, type defs | free deterministic structural + coverage metrics |
| `scripts/` | a validator or CLI and how it's invoked | a validate CLI = a deterministic gate for free (the `ac-to-playwright` pattern) |
| `assets/templates`, any existing fixtures | golden outputs, sample inputs | starter fixtures; golden-file source |
| `package.json` / `pyproject.toml` | Node vs Python toolchain, existing test runner | which deterministic harness fits the house |
| existing `evals/` dir | framework, metrics, thresholds | switches to AUDIT mode |

**The "NEVER" section is the highest-value read.** A well-written target skill
has already enumerated its own failure modes as anti-patterns. Map each one to a
candidate metric before inventing any.

## The eval profile (internal JSON)

Populate this completely. Any field you cannot fill from files you actually read
goes into `unread_or_uncertain` — then ask the user rather than guessing.

```jsonc
{
  "skill_name": "accelint-ts-best-practices",
  "one_liner": "Flags TS/JS code against a closed best-practice rule set.",

  // structured_json | code | natural_language_report | file_writes
  //   | diagram_markup | multi_turn | mixed
  "output_shape": "natural_language_report",

  "schema": { "present": false, "path": null, "kind": null }, // kind: zod | jsonschema | ts_types
  "validator_cli": { "present": false, "command": null },

  // fully_verifiable | partially_verifiable | judgment_required | taste_based
  "determinism": "partially_verifiable",

  "side_effects": "none",        // none | file_writes | tool_calls | both
  "interaction": "single_shot",  // single_shot | multi_turn | clarification_heavy
  "toolchain": "node",           // node | python | both | none

  // pull these from the target's NEVER section + output rules
  "failure_modes": ["missed_violation", "false_positive_flag", "wrong_fix_suggestion"],

  "rule_source": { "kind": "reference_files", "closed_list": true },

  "existing_eval": { "present": false, "framework": null, "follow_ups": [] },

  // llm_judge_warranted | deterministic_primary_judge_optional
  //   | deterministic_only | hybrid | human_review_only | not_worth_evaluating
  "eval_recommendation": "deterministic_primary_judge_optional",

  "confidence": "high",          // high | medium | low
  "unread_or_uncertain": []      // forces a question; never a silent guess
}
```

## Classifying `output_shape` (the master variable)

| Signal in the skill | output_shape |
|---|---|
| Produces JSON conforming to a schema | `structured_json` |
| Emits source code / spec files | `code` |
| Writes a prose report, review, or summary | `natural_language_report` |
| Creates/edits files on disk as the deliverable | `file_writes` |
| Emits Mermaid/PlantUML/graphviz | `diagram_markup` |
| Holds a back-and-forth, asks clarifying questions | `multi_turn` |
| More than one of the above | `mixed` (classify the *primary* deliverable, note the rest) |

## Classifying `determinism` (decides judge vs not)

- **fully_verifiable** — a parser/compiler/schema/test-run can score it with zero judgment (valid JSON against a schema; code that compiles; a diagram that parses).
- **partially_verifiable** — structure is checkable, quality is not (JSON is schema-valid, but "did it capture the right scenarios" needs judgment).
- **judgment_required** — correctness itself needs a reader (prose factual accuracy, did-the-review-find-real-issues).
- **taste_based** — "good" is subjective (visual design, creative writing, diagram elegance). LLM judges are weak here.

`determinism` plus `output_shape` plus `toolchain` are the three inputs the
framework matrix consumes. Carry them forward.

## Refusal rule

If `SKILL.md` is unreadable, or `unread_or_uncertain` is non-empty after a good-
faith read, **stop and ask**. A recommendation built on an unread skill is worse
than no recommendation — it produces an eval that measures the wrong thing.
