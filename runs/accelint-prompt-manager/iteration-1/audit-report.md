# accelint-prompt-manager audit report

Grade: A-

## Summary
The skill is strong, well-structured, and backed by a solid reference set. Its main weakness was a mismatch between the intended behavior and the actual workflow: it emphasized always delivering an optimized prompt even when the user was actually asking for task execution or when key details were too vague to optimize safely. I applied focused changes to make the decision flow safer, more consistent, and more aligned with the eval cases.

## Key findings
- Strong coverage of prompt-optimization concepts, anti-patterns, and supporting references.
- Good progressive-disclosure structure with useful reference files and templates.
- Weakness: the skill could push toward immediate prompt delivery even when clarification should come first.
- Weakness: task-execution vs prompt-optimization intent detection was present, but not integrated strongly enough into the main workflow.
- Weakness: template usage was implied by the asset set but not stated clearly in the core optimization workflow.
- Weakness: the "memory blocks" note was not actionable in this repository context and risked confusing the agent.

## Applied optimizations
- Strengthened the primary workflow so it starts by distinguishing prompt optimization from task execution.
- Added a clear clarification rule for high-impact missing details.
- Tightened Phase 1 so request classification is part of the main workflow rather than a side note.
- Clarified that plan mode recommendations belong in the optimized handoff for downstream complex tasks.
- Improved ambiguity handling so the skill asks only when ambiguity materially changes the result.
- Added selective template-usage guidance that points to `assets/prompt-templates/` without forcing templates on every request.
- Removed the non-actionable memory-block guidance.
- Added a concise response-patterns section to better cover explicit optimization requests, ambiguous requests, extremely vague requests, complex downstream tasks, and already-strong prompts.

## Files changed
- `skills/accelint-prompt-manager/SKILL.md`

## Notes
- No version or changelog updates were made, per request.
- Changes were kept focused to instruction quality and decision logic only.
