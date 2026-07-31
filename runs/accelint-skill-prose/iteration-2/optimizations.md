# Stage 3 Optimizations — accelint-skill-prose

## Applied changes

### 1. Sharpened frontmatter differentiation against general prose-editing skills
- **Recommendation addressed:** Tighten the frontmatter description to better differentiate this skill from general prose-editing skills.
- **Evidence type supporting it:** Static audit evidence
- **Files changed:** `skills/accelint-skill-prose/SKILL.md`
- **Summary of implementation:**
  - Updated the `description` frontmatter to say more explicitly that this skill should be preferred when wording itself controls trigger coverage, workflow order, guardrails, approval semantics, or exact technical meaning.
  - Clarified the non-goal boundary by explicitly excluding ordinary prose cleanup with no behavior risk.
- **Reason this change matches the evidence:**
  - Stage 1 found that the package already had strong boundaries, but the frontmatter could more sharply distinguish itself from general prose-editing skills. Because frontmatter is the trigger surface, a small description edit is the highest-value way to address that evidence.

### 2. Reduced low-value duplication pressure in the root skill without changing the contract
- **Recommendation addressed:** Reduce duplication pressure in the root skill by tightening repeated guidance where references already specialize it.
- **Evidence type supporting it:** Static audit evidence
- **Files changed:** `skills/accelint-skill-prose/SKILL.md`
- **Summary of implementation:**
  - Tightened a few repeated explanatory lines in the root file.
  - Simplified the frontmatter-as-trigger-logic framing and the progressive-disclosure lead-in.
  - Clarified the “different from general prose editing” section with a shorter operational sentence.
- **Reason this change matches the evidence:**
  - The evidence supported reducing density, not restructuring the skill. These were small, local consolidations in high-duplication sections, so they lower cognitive load without changing workflow semantics or support-file handoffs.

### 3. Improved maintainer-facing README guidance for eval coverage and versioning expectations
- **Recommendation addressed:** Improve maintainer-facing README guidance so observed eval coverage and versioning expectations are easier to discover.
- **Evidence type supporting it:** Static audit evidence + direct repository evidence
- **Files changed:** `skills/accelint-skill-prose/README.md`
- **Summary of implementation:**
  - Added a concise note describing the eval set’s current coverage areas.
  - Expanded the Contributing section with explicit maintainer reminders to keep `metadata.version` aligned with `CHANGELOG.md`, update evals when behavior boundaries change, and prefer minimal evidence-backed edits.
- **Reason this change matches the evidence:**
  - The repository already contains strong eval coverage and explicit version-alignment rules, but that posture was underrepresented in the README. This change surfaces existing governance expectations without changing package behavior.

## Recommendations not applied

### 4. Broad structural rewrites based on performance claims
- **Recommendation addressed:** Do not make broad structural rewrites based on performance claims, because no executed eval outputs were observed in this run.
- **Evidence type supporting it:** Reproducible evidence gap / repository observation
- **Files changed:** None beyond minimal local edits above
- **Reason not applied more broadly:**
  - No grading, benchmark, or transcript artifacts were observed during this workflow stage, so there was not enough empirical runtime evidence to justify broad contract or reference-structure changes.

## Scope control note
All applied changes were intentionally minimal and traceable to static audit findings or directly observed repository evidence. No unrelated refactors were introduced.
