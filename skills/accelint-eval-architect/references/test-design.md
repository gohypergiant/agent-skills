# Test design — personas, scenarios, and the metric inventory

After the framework is chosen, design *what* to measure. Two parts: the test
matrix (which cases to run) and the metric inventory (what to score on each).

## Persona × scenario derivation

The reference impl used PM/Engineer × perfect/mixed/bad AC. That shape is not
universal — derive it, don't impose it.

**Personas** = the distinct `(user-role, intent)` pairs the skill serves. Source:
the actors in the description's "Use when…" plus the skill's modes. Most skills
have **one**; multi-mode skills (assess vs convert) have two.

**Scenarios** = the input-quality gradient × modes. The universal axis is **input
quality**, because it changes expected behavior:
- **pristine** — well-formed input; the skill should proceed cleanly, minimal back-and-forth.
- **flawed-but-recoverable** — fixable issues; the skill should surface clear, actionable feedback.
- **broken** — severe issues; the skill should refuse / halt / heavily push back.

### When the taxonomy does NOT apply
Drop the grid and use **flat fixtures** when:
- there is one persona AND
- input quality does not change expected behavior (e.g., a styling skill always receives a component; a README writer always receives a codebase).

Heuristic:
```
personas = distinct (role, intent) pairs        # usually 1–2
scenarios = {input quality levels that change expected behavior} × {modes}
if personas == 1 and input-quality doesn't change expected behavior:
    use flat fixtures, no grid
```

Forcing a grid onto a single-mode skill produces empty cells and noise. A flat
list of 3–5 fixtures spanning the realistic input range is clearer.

## Output-shape → metric inventory

Map the eval profile's `output_shape` to candidate metrics. Group by dimension:
**correctness**, **efficiency**, **pitfalls** (or the skill's own rubric names).

| output_shape | Correctness | Efficiency | Pitfalls |
|---|---|---|---|
| `structured_json` | schema-valid (deterministic); field/coverage completeness (deterministic); goal accuracy (judge) | output size vs payload (deterministic); tokens/latency (captured) | hallucinated values not in input (deterministic); semantic mapping (judge) |
| `code` | compiles / typechecks (deterministic); target test-suite passes (deterministic) | diff size; tokens | invented APIs / imports that don't resolve (deterministic) |
| `natural_language_report` | claims grounded in input (judge); refusal/format adherence (deterministic) | length vs essential content (deterministic) | hallucinated facts (judge); false-positive findings (judge or fixture-based) |
| `file_writes` | files written match spec (deterministic) | — | wrote files outside permitted scope (deterministic); side-effect enumeration (deterministic) |
| `diagram_markup` | parses / renders (deterministic); nodes/edges match input facts (judge) | — | invented entities not in source (judge); quality = human-review |
| `multi_turn` | task completed (judge); plan adherence (judge) | turns taken vs needed (deterministic); clarification quality (deterministic/judge) | context retention across turns (judge); tool-call correctness (deterministic) |

**Rule:** prefer the deterministic row entries. Reach for a judge entry only for
the columns a parser genuinely cannot fill.

## Closed-list rules beat open rubrics

When writing a metric (deterministic or judge), encode rules as **closed lists**,
not open-ended examples. The reference skill said "avoid vague verbs like
interact or use" — two examples — and models over-applied it. State instead:
"the recognised verbs are exactly {click, fill, select, …}; anything else is
flagged." Closed lists raise precision and recall for both deterministic checks
and judge prompts.

## Grounding requirement (the top anti-hallucination lever)

Every judge-based metric prompt must include: **"If you cannot quote the exact
substring of the input that violates a rule, do not report a violation."** This
single instruction does more to cut false positives than any other rubric
tuning. Bake it into every GEval criteria block the skill scaffolds.

## Regression-test design — every metric must be able to fail

A metric with no failing case is decoration. For each metric, scaffold a paired
test:
- **pass case** — a fixture the metric should score at/above threshold.
- **regression case** — a *planted-broken* input the metric must score below threshold, asserting both the low score AND that the `reason` names the planted defect.

Examples:
| Metric | Planted-broken input | Assert |
|---|---|---|
| schema-valid | JSON missing a required field | score 0; reason names the field |
| coverage | drop one expected element | score < 1; reason names what's missing |
| hallucination | inject an assertion absent from input | score < 1; reason quotes the invented text |
| violation-recall (code review) | fixture with a known planted defect | recall < 1; reason names the missed defect |
| violation-precision | clean fixture with zero defects | precision < 1 if it flags anything |
| grounding (judge) | report citing a fact not in the source | score < threshold; reason flags the ungrounded claim |

The regression test is what proves the metric has teeth. Ship it alongside the
metric, never later.
