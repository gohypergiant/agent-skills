# accelint-prompt-manager — Stage 4 Skill Prose Report

## Scope
- Audited and partially rewrote `skills/accelint-prompt-manager/` in strict mode.
- Frontmatter was intentionally excluded from both audit and rewrite, per instruction.

## Artifact-set summary

### `skills/accelint-prompt-manager/SKILL.md`
- **Changed:** Yes
- **Why:** Tightened prose in body sections and improved clarity in the post-delivery handling guidance without changing the skill’s intended behavior.
- **Observed rewrite scope:**
  - `## Your Role and Output` was tightened for scanability.
  - `## How to Use` was tightened for clearer selective-loading guidance.
  - `### Phase 4: Validation & Handoff` was tightened for more direct wording.
  - Clipboard fallback wording now explicitly tells the agent to check command availability and fall back to manual copy guidance when needed.

### `skills/accelint-prompt-manager/AGENTS.md`
- **Changed:** No changes observed in this stage.
- **Why:** No additional evidence in this pass required an AGENTS quick-reference rewrite.

### `skills/accelint-prompt-manager/references/*`
- **Changed:** No changes observed in this stage.
- **Why:** This workflow iteration focused on the root skill body because that is where the directly observed issue lived.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrails: preserved
- Frontmatter: unchanged by design

## Risks or limits
- The subagent stopped early at the turn limit, so this stage report is based on verified file inspection after the partial rewrite rather than a completed subagent-authored sweep.
- No executed eval artifacts were available in this iteration workspace, so this prose pass stayed narrow and evidence-based.
