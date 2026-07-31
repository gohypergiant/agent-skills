# Recommendations — `accelint-archive-synthesis`

## 1. Correct the writer-skill routing name in Step 8
- **issue observed:** `SKILL.md` routes agent-workflow contradictions to `accelint-onboard-agent`, but the directly observed available skill name in this repo/session is `accelint-onboard-agents`.
- **evidence type:** Directly observed repo evidence
- **evidence:** The skill text references `accelint-onboard-agent` in `.agents/skills/accelint-archive-synthesis/SKILL.md`, while the available skills list for this session includes `accelint-onboard-agents` and does not show the singular form.
- **recommended improvement:** Replace the singular routing target with `accelint-onboard-agents` everywhere this skill names the downstream handoff target.
- **expected benefit:** Reduces the risk of incorrect or confusing downstream routing instructions during confirmed findings handoff.
- **confidence level:** High

## 2. Normalize malformed `findings:` and step-reference wording
- **issue observed:** The skill contains wording inconsistencies such as `shared findings - interface` and malformed references like `Step 3 Step 3` / `Step 3 Step 2`.
- **evidence type:** Static audit evidence
- **evidence:** Stage 1 audit identified these exact phrases in `.agents/skills/accelint-archive-synthesis/SKILL.md`. They are mechanically inconsistent with the skill’s own terminology and with the established `findings:` interface wording.
- **recommended improvement:** Replace the inconsistent phrases with the canonical `findings:` spelling and correct malformed step references to their intended numbered steps.
- **expected benefit:** Improves execution clarity in a routing-heavy, safety-sensitive skill and reduces ambiguity during long runs.
- **confidence level:** High

## 3. Reduce instruction sprawl by moving non-execution support material out of `SKILL.md`
- **issue observed:** `SKILL.md` is 614 lines long, exceeding the rough progressive-disclosure ceiling cited in `skill-creator`, which increases scan burden.
- **evidence type:** Static audit evidence + directly observed repo evidence
- **evidence:** Stage 1 audit measured `.agents/skills/accelint-archive-synthesis/SKILL.md` at 614 lines. `skill-creator` recommends keeping the core workflow in `SKILL.md` and moving detailed content to references when files grow large.
- **recommended improvement:** Extract low-frequency support content such as long examples and terminology/reference-heavy sections into `references/` files, then replace them with brief load-on-demand pointers from `SKILL.md`.
- **expected benefit:** Strengthens progressive disclosure, lowers context load, and makes the execution path easier to scan without changing behavior.
- **confidence level:** Medium-High

## 4. Add stronger eval assertions or evaluation metadata to improve repeatable benchmarking
- **issue observed:** The package has scenario coverage but lightweight eval structure for repeatable scoring.
- **evidence type:** Static audit evidence
- **evidence:** `.agents/skills/accelint-archive-synthesis/evals/evals.json` contains scenario definitions (`id`, `prompt`, `expected_output`, `files`) but the Stage 1 audit did not observe richer assertion metadata or benchmark scaffolding.
- **recommended improvement:** Expand eval cases with assertion-friendly expected criteria or structured grading metadata where the repository’s eval conventions allow it.
- **expected benefit:** Improves empirical optimization loops and makes future regressions easier to detect consistently.
- **confidence level:** Medium
- **note:** This recommendation is based only on static audit evidence; no eval runner output was executed in this stage.

## 5. Trim duplicated policy prose while preserving guardrails
- **issue observed:** Similar constraints appear across `Interaction Contract`, `Degraded-Mode Rules`, `Explicitly Out of Scope`, `Error Handling`, and `NEVER Do This`.
- **evidence type:** Static audit evidence
- **evidence:** Stage 1 audit observed repeated statements covering no auto-run behavior, human confirmation before writes, dismissal/defer semantics, and narrow write permissions across multiple sections of `.agents/skills/accelint-archive-synthesis/SKILL.md`.
- **recommended improvement:** Make one section the canonical source for repeated policy statements, shorten duplicate restatements elsewhere, and retain cross-references where needed.
- **expected benefit:** Improves scanability and reduces future drift risk while keeping the same safety rules intact.
- **confidence level:** Medium
- **note:** This recommendation is based only on static audit evidence; no executed eval transcript demonstrated an actual failure caused by duplication.
