# accelint-onboard-openspec audit report

Grade: A-

## Summary
This skill is strong overall: the trigger description is specific, the workflow is well structured, and the config template is detailed and reusable. The main issues were small clarity and maintenance gaps rather than broken behavior.

## Findings
1. Phase 3 strongly requires parallel subagents but did not say what to do when subagents are unavailable. The README mentioned a serial fallback, which created mismatch with the skill's stricter guidance.
2. Refresh-mode preview behavior was slightly ambiguous. Phase 4 said to show a full preview, while Refresh mode said to show only changed sections.
3. The skill handled fact-vs-behavior separation well in some places, but that principle was worth reinforcing in the interaction guidance because blended answers are common during onboarding.
4. The skill README had stale maintenance details:
   - `Current version: 1.3.0` did not match the skill metadata/changelog (`1.5.0`)
   - Troubleshooting language implied a serial fallback without clarifying that the skill should explicitly disclose the limitation

## Applied optimizations
- Updated `skills/accelint-onboard-openspec/SKILL.md` to:
  - define the non-subagent fallback more clearly
  - align preview guidance across Create/Import vs Refresh modes
  - reinforce separation of project DNA from behavioral guidance
  - add a post-refresh reminder for findings that do not belong cleanly in `config.yaml`
- Updated `skills/accelint-onboard-openspec/README.md` to:
  - align troubleshooting with the skill's preferred parallel workflow
  - document refresh-mode handling more accurately
  - reinforce fact-vs-behavior separation
  - correct the displayed current version summary to 1.5.0

## Recommendations
- Keep README maintenance in sync with metadata/changelog whenever the skill changes.
- If this skill gets another substantive revision, consider adding lightweight eval prompts for create/import/refresh paths so future audits can compare behavior more systematically.
- If docs are regenerated from skill content elsewhere in the repo, consider refreshing the published docs artifact next.
