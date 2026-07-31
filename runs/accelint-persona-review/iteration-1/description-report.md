# accelint-persona-review description update

## What changed
- Broadened the trigger wording from only "Figma designs" to operator-facing interfaces more generally so the skill can catch dashboard, screen, workflow, and control-panel review requests already represented in the eval set.
- Added explicit supported-role examples in the description: air-surveillance-tech, surveillance-tech, weapons-director, senior-director, and mission-crew-commander.
- Expanded trigger cues to include decision support, coordination, context switching, tempo, and responsibility fit, matching the positive eval prompts more closely.
- Clarified valid input modes: Figma URL review, desktop-selection review, and screenshot-only fallback when MCP access is unavailable.
- Strengthened boundaries by explicitly excluding generic visual-polish feedback, broad product-strategy work, and non-design writing tasks such as SOPs.

## Why
- The default eval set includes several positive cases that do not frame the task only as "Figma design critique"; they ask about workflows, mission tempo, decision support, and operator fit. The updated description makes those triggers more discoverable.
- The negative evals are near misses: generic UI-polish review and SOP writing. Adding explicit non-goals should reduce accidental triggering on those requests.
- The updated wording preserves the skill's core purpose while making persona selection, operational-review framing, and fallback modes easier to infer from the frontmatter alone.
