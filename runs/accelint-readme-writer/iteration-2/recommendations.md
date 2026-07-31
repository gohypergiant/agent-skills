# Stage 2 Recommendations — accelint-readme-writer

## Recommendation 1
- **issue observed:** `SKILL.md` gives conflicting instructions for the case where `accelint-english-manager` is unavailable.
- **evidence type:** Static audit evidence
- **evidence:** In `skills/accelint-readme-writer/SKILL.md`, one section instructs the agent to provide a grounded non-final draft and clearly label the missing dependency, while a later section says to stop and tell the user the workflow cannot finish as designed.
- **recommended improvement:** Consolidate this into one rule: continue the README workflow as far as possible, deliver a clearly labeled non-final draft, and explicitly state that final prose polish is blocked until `accelint-english-manager` is available.
- **expected benefit:** Removes inconsistent runtime behavior and aligns dependency fallback handling across the skill.
- **confidence level:** High

## Recommendation 2
- **issue observed:** The exact `accelint-english-manager` invocation block is duplicated in `SKILL.md`.
- **evidence type:** Static audit evidence
- **evidence:** The same slash-command prompt shape appears in both the “Required skill” and “Human-sounding writing” sections of `skills/accelint-readme-writer/SKILL.md`.
- **recommended improvement:** Keep one canonical invocation block and convert the second location into a short cross-reference or condensed reminder.
- **expected benefit:** Reduces future drift risk and makes the core dependency rule easier to maintain.
- **confidence level:** High

## Recommendation 3
- **issue observed:** The rule requiring parallel subagents whenever available is too absolute for small or constrained targets.
- **evidence type:** Static audit evidence
- **evidence:** `skills/accelint-readme-writer/SKILL.md` says discovery must never run serially when sub-agents are available. This is stronger than the user’s current workflow requirement to use subagents only when they materially help, and it can over-constrain tiny README-local audits.
- **recommended improvement:** Reword the rule so parallel subagents are the default for broad discovery, but allow inline systematic discovery when the target is small or subagents would not materially help.
- **expected benefit:** Better fit for headless and focused runs while preserving the performance advantage of parallel discovery on larger targets.
- **confidence level:** High

## Recommendation 4
- **issue observed:** The workflow still contains mild ambiguity about whether updates require confirmation.
- **evidence type:** Static audit evidence
- **evidence:** The README workflow decision tree in `SKILL.md` says “Apply updates (with user confirmation),” but the surrounding Step 4 text separately allows direct draft/update when the request clearly asks for the rewrite.
- **recommended improvement:** Clarify that confirmation is appropriate for audit-plus-suggested-changes mode, while direct draft/update is appropriate when the user explicitly asked for a rewrite.
- **expected benefit:** Cleaner execution logic and fewer unnecessary pauses during non-interactive runs.
- **confidence level:** Medium-High

## Recommendation 5
- **issue observed:** Supporting docs still lean too much toward package/library README structure.
- **evidence type:** Static audit evidence plus prior executed audit evidence
- **evidence:** `AGENTS.md` and parts of `references/readme-structure.md` read as more fixed, package-oriented guidance than the adaptive library/app/service/CLI/monorepo strategy now documented in `SKILL.md`. This aligns with the prior executed audit in `runs/accelint-readme-writer/iteration-1/audit-report.md`, which noted over-library bias as a weakness.
- **recommended improvement:** Tighten supporting guidance so it explicitly preserves adaptive structure based on artifact type and avoids implying that every README needs package-style sections.
- **expected benefit:** Better consistency across the skill package and lower risk of over-structuring app/service READMEs.
- **confidence level:** Medium-High

## Confidence note
No executed benchmark or grading artifacts were available under `runs/accelint-readme-writer/iteration-1/`, so these recommendations are grounded mainly in direct repository inspection plus the recorded prior audit artifacts, not in fresh runtime eval outputs.
