# Stage 2 Recommendations — accelint-qrspi-archive

## 1. Reduce repeated rationale inside `SKILL.md`
- **issue observed:** The skill body is longer than the skill-creator guidance target and repeats some rationale across workflow, principles, out-of-scope, and error-handling sections.
- **evidence type:** Static audit evidence
- **evidence:** `skills/accelint-qrspi-archive/SKILL.md` is 561 lines. `/Users/brandon.pierce/.agents/skills/skill-creator/SKILL.md` says SKILL bodies should ideally stay under 500 lines and move overflow into hierarchy/resources when needed.
- **recommended improvement:** Tighten repeated explanation where the same constraint is already defined clearly elsewhere, especially around inline archive execution, additive-only behavior, and index-drift caveats. Prefer one canonical explanation plus short reminders.
- **expected benefit:** Better scanability, lower maintenance cost, and less risk of future internal drift.
- **confidence level:** High

## 2. Reduce step-reference fragility
- **issue observed:** The skill depends heavily on numbered steps and already showed cross-reference drift in the previous iteration.
- **evidence type:** Repository observation
- **evidence:** `runs/accelint-qrspi-archive/iteration-1/audit-report.md` explicitly notes stale step references were corrected. The current `SKILL.md` still contains many numbered-step references.
- **recommended improvement:** Where possible, replace fragile exact step-number references in explanatory prose with stable section-language references, or consolidate nearby references so fewer step numbers must stay synchronized.
- **expected benefit:** Fewer future maintenance breaks when the workflow is edited.
- **confidence level:** High

## 3. Lower README drift risk by making it more explicitly derivative
- **issue observed:** The package previously experienced README/SKILL drift, and both artifacts remain substantial.
- **evidence type:** Repository observation
- **evidence:** `runs/accelint-qrspi-archive/iteration-1/skill-prose-report.md` documents a rewrite of `README.md` because it no longer matched `SKILL.md` behavior.
- **recommended improvement:** Add or tighten language in `README.md` so it is clearly a concise companion summary, with `SKILL.md` as the canonical operational contract. Avoid duplicating fine-grained workflow detail unless necessary.
- **expected benefit:** Lower chance of future artifact divergence and easier package upkeep.
- **confidence level:** Medium-High

## 4. Avoid broad trigger changes without fresh eval evidence
- **issue observed:** There is no fresh executed eval or trigger evidence in this run, despite a large eval set existing.
- **evidence type:** Blocker / missing empirical run evidence
- **evidence:** `skills/accelint-qrspi-archive/evals/evals.json` contains 28 eval cases, but `runs/accelint-qrspi-archive/iteration-2/` had no new benchmark, transcript, or trigger-rate artifacts at audit time.
- **recommended improvement:** Keep this optimization pass focused on maintainability and prose clarity, not major description or behavioral rewrites.
- **expected benefit:** Prevents overfitting or unsupported trigger changes based only on intuition.
- **confidence level:** High

## 5. Preserve version alignment as part of any package edit
- **issue observed:** The package uses manual file-driven versioning, so even small skill edits require synchronized metadata/changelog updates.
- **evidence type:** Static audit evidence
- **evidence:** `skills/accelint-qrspi-archive/SKILL.md` frontmatter contains `metadata.version: "1.3.3"`, and `skills/accelint-qrspi-archive/CHANGELOG.md` tracks manual version bumps. Project guidance in `AGENTS.md` requires changelog/version alignment for skill changes.
- **recommended improvement:** If any Stage 3 or 4 edits land, update both `CHANGELOG.md` and `metadata.version` together.
- **expected benefit:** Keeps the skill package reviewable and release-ready.
- **confidence level:** High

## Recommendation strength note
Because this run lacks fresh executed eval evidence, all recommendations above are grounded in static audit evidence, prior repository artifacts, and reproducible file observations rather than new behavioral benchmarks. That supports targeted maintenance edits, but not broad semantic rewrites.
