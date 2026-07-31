# Stage 3 Optimizations — accelint-readme-writer

## Applied changes

### 1) Resolve missing-dependency contradiction
- **recommendation addressed:** Unify behavior when `accelint-english-manager` is unavailable.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-readme-writer/SKILL.md`
- **summary of implementation:** Updated the required-skill and human-sounding-writing sections so both now instruct the agent to continue README analysis and drafting, clearly label the result as **not yet prose-polished**, and explicitly say final polish is blocked on `accelint-english-manager`.
- **reason this change matches the evidence:** The audit found two conflicting behaviors for the same scenario. This change removes the contradiction directly rather than broadening scope.

### 2) De-duplicate the prose-polish invocation rule
- **recommendation addressed:** Reduce drift risk from repeated `accelint-english-manager` instructions.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-readme-writer/SKILL.md`
- **summary of implementation:** Kept one canonical strict-mode prompt block in the required-skill section and changed the later section to reference that canonical prompt instead of repeating it.
- **reason this change matches the evidence:** The audit showed duplicated prompt text. Keeping one source of truth is the minimal evidence-aligned fix.

### 3) Relax the absolute subagent rule
- **recommendation addressed:** Make discovery guidance less brittle for small or constrained targets.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-readme-writer/SKILL.md`
- **summary of implementation:** Rewrote the hard-stop language so broad README work should use parallel subagents when they materially help, while small README-local targets may use systematic inline discovery.
- **reason this change matches the evidence:** The prior wording over-constrained execution in cases where subagents are technically available but not useful. The new wording preserves the performance intent without forcing unnecessary overhead.

### 4) Clarify confirmation versus direct-update mode
- **recommendation addressed:** Remove workflow ambiguity about when confirmation is needed.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-readme-writer/SKILL.md`
- **summary of implementation:** Adjusted the workflow decision tree and added a short note explaining that audit-plus-suggested-changes mode may pause for confirmation, while explicit rewrite requests should proceed directly.
- **reason this change matches the evidence:** The audit found the ambiguity in the decision tree versus Step 4. This targeted clarification aligns the two instructions.

### 5) Align support docs with adaptive README strategy
- **recommendation addressed:** Reduce lingering package/library bias in supporting guidance.
- **evidence type supporting it:** Static audit evidence plus prior executed audit evidence
- **files changed:** `skills/accelint-readme-writer/AGENTS.md`, `skills/accelint-readme-writer/references/readme-structure.md`
- **summary of implementation:** Updated support docs to say the fixed section order is the default for package and library READMEs, but app, service, CLI, and monorepo-root READMEs should adapt the middle sections to their real public surface.
- **reason this change matches the evidence:** The core skill already claims adaptive scope. These support-doc edits close the gap noted in the current audit and the prior iteration-1 audit.

## Not applied
- **Add fresh executed eval outputs or benchmark artifacts**
  - **why not applied:** This workflow did not include running a full eval/benchmark loop for this skill, and no existing runnable benchmark artifacts were present for iteration 1. The current task was limited to evidence-based package optimization, so I avoided inventing runtime claims.
