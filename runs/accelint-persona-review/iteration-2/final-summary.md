Changed: clarified Figma/Outline fallback instructions in `skills/accelint-persona-review/SKILL.md`, aligned `README.md` with auto-trigger usage, tightened prose in `SKILL.md` and `references/evaluation-examples.md`, and bumped version/changelog to 1.3.1.

Evidence: all changes were driven by direct repository inspection and Stage 1/2 static audit findings showing underspecified fallback behavior and README usage drift; Stage 4 prose changes were verified by direct diff/file inspection.

Blockers: no executed eval evidence was available, so confidence is limited to static audit evidence; the prose subagent hit a turn limit before writing its report, so one weakened guardrail line was manually corrected after inspection.
