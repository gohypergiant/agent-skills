# Evidence-Based Recommendations: `accelint-skill-manager`

## 1) Align description guidance across canonical files
- **issue observed:** The package teaches conflicting rules for frontmatter descriptions.
- **evidence type:** Static audit evidence
- **evidence:** `references/skill.md` says the description should only express triggering conditions and must not summarize workflow. `SKILL.md` says the description should include WHAT / WHEN / KEYWORDS. `assets/skill-template/SKILL.md` also instructs authors to include WHAT / WHEN / KEYWORDS in the description comments.
- **recommended improvement:** Choose one canonical rule and update `SKILL.md`, `references/skill.md`, and `assets/skill-template/SKILL.md` to match it. The safest alignment is: description should start with “Use when…”, focus on trigger conditions, include searchable keywords, and avoid workflow summaries.
- **expected benefit:** Reduces downstream skill-authoring inconsistency and prevents the package from teaching mutually conflicting frontmatter behavior.
- **confidence level:** High

## 2) Update the audit rubric to match current skill-package shapes
- **issue observed:** The audit workflow describes a generic expected section model that does not match this package’s own structure.
- **evidence type:** Static audit evidence
- **evidence:** The audit rubric in `SKILL.md` expects `NEVER Do`, `Before [Action] Ask`, `How to Use`, and `Main Workflow`. The actual package uses `Which Workflow Should You Follow?`, `Default execution paths`, `Skill Creation Workflow`, and `Skill Audit Workflow`.
- **recommended improvement:** Revise the audit rubric so it checks for required concepts rather than a single section label, and explicitly accepts modern variants such as separate creation and audit workflows plus optional routing sections.
- **expected benefit:** Makes the meta-skill’s audit guidance more accurate and reduces false negatives when auditing well-structured skills that do not use a literal `Main Workflow` heading.
- **confidence level:** High

## 3) Normalize version-format guidance to full semver
- **issue observed:** Current reference guidance allows multiple version formats even though the package has already standardized on full semver in active practice.
- **evidence type:** Static audit evidence
- **evidence:** `references/skill.md` allows `X.Y` or `X.Y.Z`. The live skill uses `2.1.3`, and `CHANGELOG.md` explicitly records a prior move toward full semver.
- **recommended improvement:** Update `references/skill.md` and any template comments to prefer `X.Y.Z` only, with examples and bump rules expressed consistently in full semver.
- **expected benefit:** Improves package consistency and lowers the chance that future skills mix abbreviated and full semver formats.
- **confidence level:** High

## 4) Reduce duplicated policy text where drift risk is already observable
- **issue observed:** The same policy areas are repeated across multiple package artifacts, and drift is already visible.
- **evidence type:** Static audit evidence
- **evidence:** Progressive disclosure, description expectations, and version/changelog rules appear across `SKILL.md`, `README.md`, `AGENTS.md`, and `references/*`. The description rule conflict is a direct example of this drift.
- **recommended improvement:** Make one file canonical per topic and shorten the others to summary-plus-link form where possible, especially for description and versioning rules.
- **expected benefit:** Lowers maintenance burden and reduces future contradictions across the skill package.
- **confidence level:** Medium

## 5) Trim README sections that restate generic skill concepts instead of package-specific guidance
- **issue observed:** Parts of `README.md` explain general concepts that are less evidence-dense and less package-specific than the rest of the artifact set.
- **evidence type:** Static audit evidence
- **evidence:** `README.md` contains broad sections such as `What Skills Provide`, `Example Skills`, and general architecture philosophy. The Stage 1 audit found these sections more redundant than expert-only.
- **recommended improvement:** Compress or trim generic explanatory sections while preserving package-specific usage, workflow, and maintenance information.
- **expected benefit:** Improves knowledge density and reduces context spent on material that agents likely already know.
- **confidence level:** Medium

## Evidence limits
- These recommendations are based on direct repository inspection and the Stage 1 audit only.
- No executed eval runs were performed in this workflow, so no recommendation is grounded in runtime outputs or score deltas.
- Because evidence is static-only, recommendations favor minimal consistency fixes over broad structural rewrites.
