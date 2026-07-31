# Optimizations Applied: `accelint-skill-manager`

## 1. Align description guidance across canonical files
- **recommendation addressed:** Align frontmatter-description guidance across the package.
- **evidence type supporting it:** Static audit evidence
- **files changed:**
  - `.agents/skills/accelint-skill-manager/SKILL.md`
  - `.agents/skills/accelint-skill-manager/references/skill.md`
  - `.agents/skills/accelint-skill-manager/assets/skill-template/SKILL.md`
- **summary of implementation:**
  - Updated the audit rule in `SKILL.md` so descriptions are checked for `Use when...`, trigger-first framing, searchable keywords, and avoidance of workflow summaries.
  - Revised `references/skill.md` to make the canonical rule explicit: focus on triggering conditions first, optionally identify function briefly, never summarize workflow.
  - Updated the template comments in `assets/skill-template/SKILL.md` so new skills inherit the same trigger-first rule.
- **reason this change matches the evidence:** Stage 1 found a direct contradiction between `SKILL.md`, `references/skill.md`, and the template about whether descriptions should include WHAT/WHEN/KEYWORDS versus only trigger conditions. These edits resolve that contradiction without broadening scope.

## 2. Update the audit rubric to match current workflow variants
- **recommendation addressed:** Make structure audits check for required concepts instead of one literal heading layout.
- **evidence type supporting it:** Static audit evidence
- **files changed:**
  - `.agents/skills/accelint-skill-manager/SKILL.md`
- **summary of implementation:**
  - Rewrote the `Structure Audit` guidance to accept concept-level equivalents such as separate creation/audit workflows, decision-tree sections, and routing sections like `Which Workflow Should You Follow?` and `Default execution paths`.
- **reason this change matches the evidence:** The audited package itself used valid modern variants that the old audit rubric would have treated as drift. Updating the rubric removes that false mismatch.

## 3. Normalize version guidance to full semver
- **recommendation addressed:** Standardize version-format guidance on `X.Y.Z`.
- **evidence type supporting it:** Static audit evidence
- **files changed:**
  - `.agents/skills/accelint-skill-manager/SKILL.md`
  - `.agents/skills/accelint-skill-manager/references/skill.md`
  - `.agents/skills/accelint-skill-manager/references/changelog.md`
- **summary of implementation:**
  - Changed `SKILL.md` frontmatter-audit expectations to require full semver.
  - Updated `references/skill.md` examples and bump guidance from mixed `X.Y` / `X.Y.Z` to full semver only.
  - Updated `references/changelog.md` examples and bump notes so major/minor/patch examples all use three-part versions.
- **reason this change matches the evidence:** Stage 1 found that the live package already used full semver while reference guidance still allowed abbreviated versions, creating policy drift.

## 4. Tighten README guidance where generic material reduced knowledge density
- **recommendation addressed:** Reduce generic README material and keep the file focused on this package.
- **evidence type supporting it:** Static audit evidence
- **files changed:**
  - `.agents/skills/accelint-skill-manager/README.md`
- **summary of implementation:**
  - Replaced the generic `What Skills Provide` and `Example Skills` sections with a short `Package Focus` section.
  - Tightened progressive-disclosure guidance to match the package’s concise-SKILL.md convention rather than a broader `<5000 tokens` line.
- **reason this change matches the evidence:** Stage 1 identified these sections as less expert-only and less package-specific than the rest of the artifact set, so they were compressed instead of broadly rewritten.

## Not applied broadly
- **recommendation not fully applied:** Reduce all duplicated policy text across every artifact.
- **why not:** Evidence supported a consistency fix, but not a broad repo-scale rewrite within this single run. I limited changes to the files directly implicated by the observed drift.
