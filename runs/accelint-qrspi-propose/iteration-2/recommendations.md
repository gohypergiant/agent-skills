# Stage 2 Recommendations — accelint-qrspi-propose

## 1) Fix the onboarding skill name reference
- **issue observed:** The package references `accelint-onboard-agent`, but the repository skill is `accelint-onboard-agents`.
- **evidence type:** Static audit evidence + repository observation
- **evidence:** `skills/accelint-qrspi-propose/SKILL.md` Configuration Requirements item 4 and `skills/accelint-qrspi-propose/README.md` Related Skills both use the singular form. The repo’s available skill list contains `accelint-onboard-agents`.
- **recommended improvement:** Update all user-facing references in this skill package from `accelint-onboard-agent` to `accelint-onboard-agents`.
- **expected benefit:** Prevents discoverability failures and misdirected follow-up commands.
- **confidence level:** High

## 2) Reduce redundant control-language repetition in SKILL.md
- **issue observed:** The skill body repeats many checkpoint, stop, and artifact-generation warnings across multiple sections.
- **evidence type:** Static audit evidence
- **evidence:** `skills/accelint-qrspi-propose/SKILL.md` contains repeated `REQUIRED`, `CRITICAL`, and `NEVER` constraints across Implementation Steps, Key Principles, Error Handling, and NEVER Do This.
- **recommended improvement:** Tighten or merge duplicated warnings where the same operational rule is already stated nearby, while preserving the strongest canonical statement in the highest-leverage location.
- **expected benefit:** Improves scanability and lowers the chance an agent overfocuses on repeated local wording instead of the full workflow.
- **confidence level:** Medium-high

## 3) Add more structure-verifiable eval coverage for procedural guarantees
- **issue observed:** The eval set is broad, but most checks are expressed as natural-language expected outcomes rather than explicit structure-oriented assertions or fixture-backed cases.
- **evidence type:** Static audit evidence
- **evidence:** `skills/accelint-qrspi-propose/evals/evals.json` covers many scenarios, but most entries use prose-only `expected_output`; only a few include files.
- **recommended improvement:** Add or refine eval cases so key guarantees are easier to verify mechanically or unambiguously, especially for: exact pause at checkpoints, frontmatter merge behavior, inline `specs_touched` array formatting, and checklist preservation during task restructuring.
- **expected benefit:** Improves regression detection for the skill’s most failure-prone procedural rules.
- **confidence level:** Medium

## 4) Align README wording with the canonical skill guidance where naming or scope boundaries could drift
- **issue observed:** README is directionally aligned, but because it is much shorter than `SKILL.md`, it can drift on exact naming and guardrail wording.
- **evidence type:** Static audit evidence
- **evidence:** `skills/accelint-qrspi-propose/README.md` summarizes the workflow well, but already contains the incorrect onboarding-skill name. This shows drift risk in secondary docs.
- **recommended improvement:** Make only targeted README corrections tied to observed drift, not a broad rewrite.
- **expected benefit:** Keeps human-facing docs consistent with the canonical skill package and reduces maintenance confusion.
- **confidence level:** High

## Blockers / confidence notes
- No executed eval transcripts or runtime failures were produced in this stage, so these recommendations are based on direct repository evidence rather than observed runtime behavior.
- Because the evidence is static, recommendations stay intentionally narrow and avoid broad rewrites.
