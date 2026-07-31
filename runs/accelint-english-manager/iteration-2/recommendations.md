# Stage 2 Recommendations — accelint-english-manager

Only evidence-backed recommendations are included below.

## 1. Reduce doctrinal repetition between `SKILL.md` and support references
- **Issue observed:** Several support files restate core principles already established in `SKILL.md`, especially stable terminology, condition-before-command, scanability, and actionability.
- **Evidence type:** Static audit evidence
- **Evidence:** Overlapping guidance appears in:
  - `skills/accelint-english-manager/SKILL.md`
  - `skills/accelint-english-manager/references/checklist.md`
  - `skills/accelint-english-manager/references/use-cases.md`
  - `skills/accelint-english-manager/references/examples.md`
- **Recommended improvement:** Trim repeated doctrine from support references and keep each file focused on its unique job: checklist = verification, use-cases = context adaptation, examples = concrete pattern anchors.
- **Expected benefit:** Higher knowledge density, less context waste when references are loaded, and clearer progressive disclosure.
- **Confidence level:** High

## 2. Tighten README language so it does not soften an operational rule from `SKILL.md`
- **Issue observed:** `README.md` says users should specify the job and mode “for best results,” while `SKILL.md` treats mode selection as an operational routing rule unless already specified.
- **Evidence type:** Static audit evidence
- **Evidence:**
  - `README.md` Quick Start: “Specify both the job and the mode for best results”
  - `SKILL.md` Start here → “Ask for the mode first ... unless the user already specified the mode explicitly.”
- **Recommended improvement:** Reword the README quick-start and explanatory text so it better reflects the actual workflow: mode should be specified up front, or the skill should ask.
- **Expected benefit:** Better package consistency and less ambiguity for maintainers or downstream skill authors using the README as an operational reference.
- **Confidence level:** High

## 3. Increase the distinct value of `references/examples.md`
- **Issue observed:** Some material in `references/examples.md` re-explains principles that already exist elsewhere, instead of maximizing concrete before/after anchors.
- **Evidence type:** Static audit evidence
- **Evidence:** The file includes principle restatements such as “state the point early” and “apply stronger structure only when it helps the reader,” which overlap with `SKILL.md` and `references/use-cases.md`.
- **Recommended improvement:** Tighten the intro and trailing reminders so the file functions more as an example bank and less as a second doctrine summary.
- **Expected benefit:** Better division of labor between files and more efficient on-demand loading during actual skill use.
- **Confidence level:** Medium-high

## 4. Preserve the current behavioral model; avoid broad rewrites
- **Issue observed:** The audit found strong workflow clarity, aligned versioning, and broad eval coverage, with no empirical evidence of behavior failure.
- **Evidence type:** Static audit evidence
- **Evidence:**
  - Clear mode/output routing in `SKILL.md`
  - Aligned `metadata.version` and `CHANGELOG.md`
  - Broad eval coverage in `evals/evals.json` across 32 prompts
- **Recommended improvement:** Limit changes to compression, consistency, and file-role clarity. Do not rewrite the skill’s behavioral contract or trigger model without stronger evidence.
- **Expected benefit:** Preserves a strong existing skill while improving efficiency and maintainability.
- **Confidence level:** High

## Confidence note
No executed eval transcripts or benchmark outputs were provided in this run. Recommendations therefore rely on **direct repository inspection only**, not runtime behavior evidence. That limits confidence on behavioral changes and supports a **minimal-change optimization strategy**.