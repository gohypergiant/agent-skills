# accelint-prompt-manager — Stage 3 Optimizations

## Applied changes

### 1. Add explicit clipboard fallback guidance
- **Recommendation addressed:** Add explicit clipboard-command fallback guidance
- **Evidence type supporting it:** Static audit evidence
- **Files changed:** `skills/accelint-prompt-manager/SKILL.md`
- **Summary of implementation:** Updated the Phase 4 post-delivery instructions so clipboard copy is attempted only after confirming a supported command exists. Added fallback language telling the agent to say so briefly and rely on the already-delivered markdown code block for manual copying when clipboard support is unavailable.
- **Reason this change matches the evidence:** The audit found concrete clipboard instructions but no explicit availability check or fallback. This change directly addresses that observed gap without expanding scope.

## Not applied

### 2. Trim broader instruction density in the root skill
- **Recommendation addressed:** Tighten the root skill by trimming low-value repetition around delivery/iteration guidance
- **Evidence type supporting it:** Static audit evidence
- **Files changed:** None
- **Summary of implementation:** Not applied in this iteration.
- **Reason this change matches the evidence:** The evidence supported only a moderate-confidence cleanliness improvement, not a necessary behavior fix. Because this workflow prioritizes minimal, evidence-backed changes, I avoided a broader prose refactor here.

### 3. Change harness-specific tool assumptions
- **Recommendation addressed:** Avoid changing harness-specific tool assumptions unless the repo shows they are wrong
- **Evidence type supporting it:** Static audit evidence plus blocker note
- **Files changed:** None
- **Summary of implementation:** Intentionally left frontmatter tool declarations unchanged.
- **Reason this change matches the evidence:** This session alone does not prove the target runtime metadata is wrong, so changing it would be unsupported.

## Evidence limitation carried forward
- The visible run artifacts for this skill do not include executed eval outputs, benchmark files, or grading files. Because of that, this optimization pass stayed conservative and focused on directly observable instruction issues rather than behavior claims that would require missing execution evidence.
