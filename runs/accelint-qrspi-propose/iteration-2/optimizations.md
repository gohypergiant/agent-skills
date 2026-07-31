# Stage 3 Optimizations — accelint-qrspi-propose

## Applied changes

### 1) Fix the onboarding skill name reference
- **recommendation addressed:** Fix the onboarding skill name reference
- **evidence type supporting it:** Static audit evidence + repository observation
- **files changed:**
  - `skills/accelint-qrspi-propose/SKILL.md`
  - `skills/accelint-qrspi-propose/README.md`
- **summary of implementation:** Replaced the incorrect singular reference `accelint-onboard-agent` with `accelint-onboard-agents` in package guidance.
- **reason this change matches the evidence:** The repository skill name is plural. Keeping the singular form would misdirect users and create follow-up friction.

### 2) Correct README drift where directly observed
- **recommendation addressed:** Align README wording with the canonical skill guidance where naming or scope boundaries could drift
- **evidence type supporting it:** Static audit evidence
- **files changed:**
  - `skills/accelint-qrspi-propose/README.md`
- **summary of implementation:** Updated the workflow table to show that the Design stage produces both `proposal.md` and `design.md`; added the approved-design frontmatter capture note after the design checkpoint; tightened Error Handling so manual fallback is clearly limited to Questions/Research; and corrected the onboarding skill name in Configuration Requirements.
- **reason this change matches the evidence:** These were concrete mismatches between `README.md` and the canonical workflow in `SKILL.md`, so targeted fixes improve consistency without broad rewriting.

## Not applied

### 3) Reduce redundant control-language repetition in SKILL.md
- **recommendation addressed:** Reduce redundant control-language repetition in `SKILL.md`
- **evidence type supporting it:** Static audit evidence only
- **files changed:** None
- **summary of implementation:** Not applied.
- **reason this change matches the evidence:** The evidence showed density, but not a specific proven failure caused by repetition. Because this is behavior-defining prompt text, reducing repetition without stronger runtime evidence would risk weakening guardrails.

### 4) Add more structure-verifiable eval coverage
- **recommendation addressed:** Add more structure-verifiable eval coverage for procedural guarantees
- **evidence type supporting it:** Static audit evidence only
- **files changed:** None
- **summary of implementation:** Not applied in this run.
- **reason this change matches the evidence:** The current eval set already covers the major workflow behaviors broadly. More granular eval work may help later, but there was no direct empirical miss justifying a larger scope increase in this single-skill optimization pass.
