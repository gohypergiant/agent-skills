# Stage 2 Recommendations — accelint-architecture-doc

## 1. Add structured expectations to more eval scenarios
- **issue observed**: Important behaviors such as create-mode sequencing, refresh-mode read-first behavior, and findings-merge behavior are described in the skill but not consistently represented as structured eval expectations.
- **evidence type**: Static audit evidence
- **evidence**:
  - `skills/accelint-architecture-doc/evals/evals.json` has 11 evals.
  - Evals 3, 5, 8, and 11 include `expectations`, but evals 1, 2, 7, 9, and 10 rely mainly on narrative `expected_output` text.
  - Stage 1 audit found eval rigor uneven.
- **recommended improvement**: Add concise `expectations` arrays to the highest-value missing scenarios, especially create, refresh, OpenSpec-aware, and external-findings refresh flows.
- **expected benefit**: Better future grading consistency and stronger empirical verification for transcript-sensitive behaviors.
- **confidence level**: High

## 2. Tighten behavior-defining prose to reduce execution risk without changing behavior
- **issue observed**: The instruction body is dense and obligation-heavy in places, which can make complex paths less reliable even when the underlying workflow is good.
- **evidence type**: Static audit evidence plus repository evidence
- **evidence**:
  - Direct inspection of `skills/accelint-architecture-doc/SKILL.md` shows a long, multi-phase instruction body with many conditional rules.
  - `runs/accelint-architecture-doc/iteration-1/skill-prose-report.md` previously identified scanability and wording clarity as material concerns and reported successful tightening without changing workflow semantics.
  - Stage 1 audit again flagged instruction density as a current weakness.
- **recommended improvement**: Apply a strict prose pass to the instruction body only, preserving frontmatter and workflow semantics while compressing repeated operational wording and clarifying obligation levels.
- **expected benefit**: Lower cognitive load for the executing agent and improved reliability on transcript-sensitive paths.
- **confidence level**: High

## 3. Keep optimization scope narrow and avoid structural rewrites
- **issue observed**: Current weaknesses are local and evidence-supported; there is no empirical basis for a broad package refactor.
- **evidence type**: Static audit evidence
- **evidence**:
  - `SKILL.md`, `CHANGELOG.md`, and `README.md` are internally aligned.
  - Version/changelog alignment is correct at `1.1.2`.
  - Existing eval coverage is already broad at the scenario level.
- **recommended improvement**: Limit Stage 3 changes to targeted eval upgrades and any directly justified skill-file clarifications, avoiding new files, new workflow branches, or template rewrites.
- **expected benefit**: Preserves a strong package while reducing the risk of introducing unsupported behavior changes.
- **confidence level**: High

## 4. Treat missing executed eval artifacts as a confidence limiter, not a reason for speculative changes
- **issue observed**: No current iteration benchmark or grading artifacts exist for this stage, so some conclusions remain audit-led rather than run-led.
- **evidence type**: Repository evidence
- **evidence**:
  - `runs/accelint-architecture-doc/iteration-2/` initially contained only `status.json`.
  - No benchmark, grading, transcript, or timing artifacts for iteration 2 were present.
- **recommended improvement**: Phrase optimization decisions conservatively and only apply changes directly supported by static audit evidence or prior repo artifacts.
- **expected benefit**: Prevents overfitting to intuition and keeps the optimization defensible.
- **confidence level**: High
