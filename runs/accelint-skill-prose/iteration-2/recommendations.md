# Stage 2 Recommendations — accelint-skill-prose

Only evidence-backed recommendations are included below.

## 1. Tighten the frontmatter description to better differentiate this skill from general prose-editing skills
- **Issue observed:** The current `description` clearly covers behavior-defining prose, but it does not explicitly state as strongly as it could that this skill should win when wording controls trigger behavior, workflow order, guardrails, or approval semantics.
- **Evidence type:** Static audit evidence
- **Evidence:**
  - `skills/accelint-skill-prose/SKILL.md` description already distinguishes this skill from broader content strategy work.
  - Stage 1 audit found that the boundary with adjacent English/prompt-polishing skills could still be sharper in edge cases.
  - `README.md` already states: “If you only need general prose cleanup with no behavior risk, a general English-editing skill is usually a better fit,” which indicates the package itself recognizes that distinction, but the frontmatter description carries the actual trigger load.
- **Recommended improvement:** Add a short clause to the frontmatter description that more explicitly says to prefer this skill when wording itself controls behavior, not just readability.
- **Expected benefit:** Better trigger precision in edge cases where a generic prose skill and `accelint-skill-prose` could both appear relevant.
- **Confidence level:** High

## 2. Reduce low-value duplication pressure in the root skill by tightening repeated guidance where references already specialize it
- **Issue observed:** The root `SKILL.md` is clear but dense, and some guidance is repeated across the root file and references, increasing maintenance and drift risk.
- **Evidence type:** Static audit evidence
- **Evidence:**
  - Stage 1 audit identified repeated concepts across `SKILL.md`, `references/checklist.md`, and `references/workflow-guardrails.md`.
  - Direct inspection shows overlapping phrasing around artifact-set coverage, workflow safety, and exactness checks.
- **Recommended improvement:** Make small, local edits in `SKILL.md` to reduce duplicated explanation where the referenced files already carry the detailed rule, while preserving the root contract and progressive-disclosure handoff.
- **Expected benefit:** Lower cognitive load for readers and lower future inconsistency risk without changing behavior.
- **Confidence level:** Medium-High

## 3. Improve maintainer-facing README guidance so observed eval coverage and versioning expectations are easier to discover
- **Issue observed:** The README is accurate but does not surface the package’s evaluation/governance posture as clearly as the skill files themselves.
- **Evidence type:** Static audit evidence + direct repository evidence
- **Evidence:**
  - `README.md` documents purpose, layout, and examples.
  - `evals/evals.json` contains 35 evals covering multiple risk classes, but the README only briefly says the file is useful to maintainers.
  - `CHANGELOG.md` and `SKILL.md` already show version-alignment expectations, but the README only mentions alignment briefly in Contributing.
- **Recommended improvement:** Add a compact maintainer-oriented note in `README.md` describing what the eval set covers and restate the changelog/`metadata.version` alignment expectation near the API or maintenance section.
- **Expected benefit:** Faster maintainer understanding of how to validate future edits and less chance of versioning drift.
- **Confidence level:** High

## 4. Do not make broad structural rewrites based on performance claims, because no executed eval outputs were observed in this run
- **Issue observed:** There is not enough empirical runtime evidence in this workflow stage to justify large changes to contract structure or support-file layout.
- **Evidence type:** Reproducible evidence gap / repository observation
- **Evidence:**
  - Stage 1 directly observed `evals/evals.json` but did not observe grading, benchmark, or transcript artifacts for this skill package.
  - The absence of executed eval outputs reduces confidence in any claim that the current structure causes actual runtime failures.
- **Recommended improvement:** Keep Stage 3 changes minimal and local unless additional concrete evidence appears during implementation.
- **Expected benefit:** Avoids overfitting or destabilizing a skill that already has strong static structure.
- **Confidence level:** High

## Recommendation strength summary
- **Strong recommendations:** 1, 3, 4
- **Moderate recommendation:** 2
- **Blocked from stronger claims by evidence gap:** Any large structural rewrite justified by runtime-performance assertions
