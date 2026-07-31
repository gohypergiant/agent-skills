# accelint-prompt-manager — Stage 2 Recommendations

## 1. Add explicit clipboard-command fallback guidance
- **Issue observed:** The skill instructs the agent to copy prompts using OS-specific clipboard commands, but it does not explicitly require checking whether those commands exist before trying them.
- **Evidence type:** Static audit evidence
- **Evidence:** `skills/accelint-prompt-manager/SKILL.md` tells the agent to use `pbcopy`, `xclip`, `xsel`, or `clip` for clipboard copy. No nearby instruction explicitly says to verify command availability first or fall back to manual copy guidance if none are present.
- **Recommended improvement:** Add one short rule in the post-delivery clipboard section: verify the clipboard command exists first; if not available, tell the user the prompt is already in a markdown code block for manual copy.
- **Expected benefit:** Reduces avoidable runtime failures in headless or minimally provisioned environments while preserving the convenience feature.
- **Confidence level:** High

## 2. Tighten the root skill by trimming low-value repetition around delivery/iteration guidance
- **Issue observed:** The root skill is strong but moderately dense, which can dilute the highest-priority boundaries.
- **Evidence type:** Static audit evidence
- **Evidence:** `skills/accelint-prompt-manager/SKILL.md` repeats the delivery-first boundary and post-delivery options in several nearby sections. The core message is correct, but some phrasing overlaps enough that it adds instruction weight without new behavioral guidance.
- **Recommended improvement:** Remove or compress repeated wording where the same rule is already clearly stated, especially in Phase 4. Preserve the boundary itself, but reduce duplicate explanation.
- **Expected benefit:** Improves scanability and raises the relative prominence of the most important rules.
- **Confidence level:** Medium-High

## 3. Add run-level evidence notes that the current iteration did not include executed eval outputs
- **Issue observed:** The visible run folder preserves reports but not executed eval/benchmark artifacts, which lowers confidence in optimization claims.
- **Evidence type:** Repository observation
- **Evidence:** `runs/accelint-prompt-manager/iteration-1/` contains only report files. No benchmark JSON/MD, grading JSON, or saved eval outputs were found under `runs/accelint-prompt-manager/`.
- **Recommended improvement:** Record this as a blocker/limitation in the optimization summary and avoid making claims that depend on missing executed eval evidence.
- **Expected benefit:** Keeps the iteration evidence-honest and prevents overclaiming.
- **Confidence level:** High

## 4. Avoid changing harness-specific tool assumptions unless the repo shows they are wrong
- **Issue observed:** The frontmatter includes `AskUserQuestion`, which is not directly visible in this session’s tool surface, but there is not enough evidence here to prove it is invalid for the intended runtime.
- **Evidence type:** Static audit evidence plus blocker note
- **Evidence:** `skills/accelint-prompt-manager/SKILL.md` frontmatter includes `allowed-tools: Read AskUserQuestion Write Bash`. This session does not expose a matching tool, but that alone does not prove the skill metadata is wrong in its target environment.
- **Recommended improvement:** Do not change frontmatter tool declarations based only on this session. Instead, document the portability uncertainty in the reports and keep implementation changes focused on directly supported issues.
- **Expected benefit:** Avoids unsupported refactors and keeps the optimization grounded in evidence.
- **Confidence level:** Medium
