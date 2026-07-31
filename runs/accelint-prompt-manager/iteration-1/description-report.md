# accelint-prompt-manager description optimization report

## Updated description
Rewrote the `description` frontmatter in `skills/accelint-prompt-manager/SKILL.md` to improve trigger quality and boundary clarity.

## What changed
- Shifted the lead from broad "vague or confusing requests" language to the concrete job: turning user-provided requests, drafts, or prompt text into better prompts.
- Added more realistic trigger phrases from the eval set, including rewrite, tighten, clarify, structure, adapt, "help me phrase this," and "make this more actionable."
- Expanded execution-context coverage so the description now explicitly mentions system prompts, Claude Code prompts, and batch/API prompts.
- Made the optimization boundary explicit: use this skill when the main job is prompt improvement, not when the user primarily wants the underlying task executed.

## Why
The existing description was strong but slightly over-broad at the top and somewhat under-explicit about the core boundary between prompt optimization and task execution. The default eval set emphasizes:
- explicit prompt-improvement requests
- vague requests that need shaping before execution
- context-specific prompt design
- near-miss cases where the user actually wants the task done

The revised description better matches those cases by improving trigger recall for real user phrasing while reducing false positives on execution requests.

## Scope
- Updated: `skills/accelint-prompt-manager/SKILL.md`
- Added: `runs/accelint-prompt-manager/description-report.md`
- Intentionally not updated: changelog and version
