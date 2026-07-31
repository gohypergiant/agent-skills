# Stage 1 Audit Report — accelint-readme-writer

## Grade
B

## Audit summary
The skill is solid and well-scoped, but it still has a few instruction conflicts and support-doc drifts that reduce reliability. The biggest issue is a direct contradiction in `SKILL.md` about what to do when `accelint-english-manager` is unavailable. There is also duplicated dependency-invocation prose, a brittle requirement to always use parallel subagents whenever available, and lingering package/library bias in supporting docs despite the core skill now claiming broader README coverage.

## Executed-eval evidence
Evidence source: prior run artifacts under `runs/accelint-readme-writer/iteration-1/`

- `audit-report.md` records earlier weaknesses around trigger undercoverage, over-library bias, brittle fallback behavior, and lagging human-facing docs.
- `eval-cases-report.md` shows seven targeted eval cases were created for monorepo scoping, findings merging, dependency-unavailable fallback, invented-command avoidance, and conditional related-doc sections.
- `description-report.md` and `skill-prose-report.md` confirm the skill was already broadened and tightened in a prior iteration.

### Executed-eval evidence limit
No benchmark outputs, per-eval run outputs, transcripts, or grading artifacts are present in `runs/accelint-readme-writer/iteration-1/`, so execution quality cannot be verified from this run package alone.

## Static audit evidence
Evidence source: direct inspection of `skills/accelint-readme-writer/`

### Strengths
- `skills/accelint-readme-writer/SKILL.md` has strong trigger coverage for create/update/audit/refresh README work.
- The skill clearly distinguishes README strategies for library/package, app/service, CLI, and monorepo-root contexts.
- `evals/evals.json` covers realistic edge cases instead of only obvious happy paths.
- `metadata.version` in `SKILL.md` matches the latest `CHANGELOG.md` entry (`1.2.4`).
- `README.md`, `AGENTS.md`, and `references/writing-principles.md` consistently use `accelint-english-manager` by exact name.

### Problems found
1. **Contradictory missing-dependency behavior in `SKILL.md`**
   - One section says to provide a grounded, clearly labeled non-final draft if `accelint-english-manager` is unavailable.
   - A later section says to stop and tell the user the workflow cannot finish as designed.
   - This is the clearest reliability issue because it can cause inconsistent behavior in the same scenario.

2. **Duplicated prose-polish invocation instructions in `SKILL.md`**
   - The same exact invocation pattern for `accelint-english-manager` appears in two places.
   - Duplication increases drift risk when future edits change one copy but not the other.

3. **Brittle subagent requirement**
   - `SKILL.md` says discovery must never run serially when subagents are available.
   - That is too rigid for tiny targets or constrained/headless runs where subagents are technically available but not materially helpful.

4. **Mild workflow ambiguity around confirmation**
   - The decision tree still says “Apply updates (with user confirmation)” while Step 4 also allows direct draft/update when the request clearly asks for the rewrite.
   - This is not fatal, but it weakens operational clarity.

5. **Support-doc drift toward package/library structure**
   - `AGENTS.md` and parts of `references/readme-structure.md` still read more like fixed package-README guidance than the adaptive strategy described in `SKILL.md`.
   - That creates subtle pressure toward over-structuring app/service READMEs.

## Reproducible blockers
- `python` was not available on PATH during inspection; `python3` is required in this environment.
- No executed benchmark artifacts were present for iteration 1, limiting confidence in runtime effectiveness.

## Overall assessment
The skill package is directionally strong and already improved from earlier work, but it still needs a small set of targeted fixes to remove contradictory instructions, reduce drift risk, and better align support docs with the adaptive README strategy.
