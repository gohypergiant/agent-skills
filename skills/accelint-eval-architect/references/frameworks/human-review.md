# Human-review-only — when NOT to automate

Some output should not be scored by an LLM judge. Recognizing this and saying so
is a first-class outcome, not a failure to find a framework.

## When this is the honest answer

Recommend human-review-only when the eval profile shows **`determinism:
taste_based`** — i.e., "good" is subjective and an LLM judge is weaker and less
honest than a person. Signals:
- output is visual / aesthetic (design, layout, color, diagram *elegance*).
- output is creative (prose voice, naming taste, narrative quality).
- the skill's own `NEVER` rules are themselves taste judgments
  ("NEVER use Inter/Roboto — overused in AI designs") — a judge LLM shares the
  same taste blind spots it would be grading.
- success is defined by a human stakeholder reaction, not a checkable property.

Repo examples: `accelint-persona-review` (UX critique from operator personas),
`accelint-design-foundation` (styling) — the *correctness* slivers (does the CSS
compile, does the token exist) are deterministic, but "is this good design" is not.

## Hybrid is common — split the output

Most "taste" skills have a deterministic sliver. Separate them explicitly:
- **Automate** the verifiable part — diagram parses, CSS compiles, tokens exist,
  required sections present. Use deterministic-vitest/pytest for these.
- **Human-review** the taste part — with a structured checklist so review is
  consistent across reviewers, not vibes.

Be explicit in the recommendation about where the automated/human line falls.
Pretending a judge can grade taste produces a number people trust and shouldn't.

## The review-checklist deliverable

Instead of a harness, scaffold `evals/REVIEW-CHECKLIST.md` — a repeatable rubric
a human fills in per output. Structure:

```markdown
# Review checklist — <skill-name>

Reviewer: ____   Date: ____   Input reviewed: ____

## Automated (must pass before human review — see evals/ if present)
- [ ] <deterministic check 1, e.g. "diagram parses">
- [ ] <deterministic check 2>

## Human judgment (the part no judge should score)
For each, mark Poor / OK / Good and add one sentence of why.

| Dimension | Poor · OK · Good | Note |
|---|---|---|
| <taste dimension 1, e.g. "abstraction is at the right level"> | | |
| <taste dimension 2, e.g. "naming reads naturally"> | | |
| <taste dimension 3> | | |

## Verdict
- [ ] Ship   [ ] Revise (notes above)   [ ] Reject
```

Derive the dimensions from the skill's purpose and its `NEVER` section — those
anti-patterns are exactly what a reviewer should check the output did not do.

## Do not

- Do not scaffold a judge "because we can" when the output is taste-based — it
  manufactures false precision.
- Do not skip the deterministic sliver — even taste skills usually have one
  checkable property worth a free test.
