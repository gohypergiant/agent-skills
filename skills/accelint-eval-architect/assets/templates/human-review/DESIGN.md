# Eval design — __SKILL_NAME__ (human review)

## Why no automation
This output is taste-based; an LLM judge would be weaker and less honest than a
human here. The structured checklist (`REVIEW-CHECKLIST.md`) is the eval. If a
deterministic slice emerges later (e.g. a syntax or schema check inside the
otherwise-subjective output), automate ONLY that slice — the taste ceiling
stays human.

## Cadence
Run the checklist on every substantive change to the skill, and record the
filled-in checklist (date + reviewer + verdict) alongside the change so review
results accumulate instead of evaporating.

## Known follow-ups
<!-- Pre-filled so this never ships "done". Update as you extend. -->
- [ ] Tailor the checklist items to this skill's actual failure modes.
- [ ] Decide where filled-in checklists are stored (PR description, evals/reviews/, …).
- [ ] Revisit whether any checklist item has become deterministically checkable.
