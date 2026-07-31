# Stage 2 Recommendations — accelint-ts-documentation

## 1) Align internal-code documentation policy across `SKILL.md` and `references/jsdoc.md`
- **issue observed**: The skill body uses a two-tier rule with judgment for internal code, but `references/jsdoc.md` currently states that all functions, type aliases, interfaces, constants, and classes must have well-formed JSDoc comments.
- **evidence type**: Static audit evidence
- **evidence**: Direct file inspection in Stage 1 found a policy mismatch between `.agents/skills/accelint-ts-documentation/SKILL.md` and `.agents/skills/accelint-ts-documentation/references/jsdoc.md`.
- **recommended improvement**: Rewrite the opening guidance in `references/jsdoc.md` so it explicitly matches the export-vs-internal decision model already defined in `SKILL.md`.
- **expected benefit**: Reduces instruction conflict, improves model consistency on internal-code audits, and lowers risk of over-documenting internals.
- **confidence level**: High

## 2) Reduce duplicate policy text that is already established in the skill body
- **issue observed**: The audit found repeated standards across `SKILL.md`, `README.md`, and references, especially around scope boundaries and documentation philosophy.
- **evidence type**: Static audit evidence
- **evidence**: Stage 1 direct inspection showed that `README.md` repeats substantial policy guidance already present in `SKILL.md` and the reference files.
- **recommended improvement**: Tighten duplicated prose in the package so `SKILL.md` remains the main operating surface, while README/reference files stay focused on orientation or deep syntax guidance.
- **expected benefit**: Better progressive disclosure, less prompt dilution, and lower maintenance burden when guidance changes.
- **confidence level**: Medium

## 3) Strengthen cross-file wording so reference-loading rules are easier to follow under pressure
- **issue observed**: The core reference-loading workflow is good, but the audit identified verbosity as a mild weakness that can dilute high-value operational instructions.
- **evidence type**: Static audit evidence
- **evidence**: Stage 1 audit summary explicitly noted verbosity and duplication as a package-level weakness despite otherwise strong workflow structure.
- **recommended improvement**: Tighten wording around when to load `jsdoc.md`, `comments.md`, or neither, without changing behavior.
- **expected benefit**: Faster compliance during real skill invocation and reduced chance that the model loads unnecessary references.
- **confidence level**: Medium

## 4) Keep changes narrow and avoid broad structural rewrites
- **issue observed**: No executed eval evidence currently shows functional failure in assets, eval coverage, or changelog/version hygiene; the observed issues are mostly consistency and prose-efficiency problems.
- **evidence type**: Static audit evidence
- **evidence**: Stage 1 found strong eval coverage in `.agents/skills/accelint-ts-documentation/evals/evals.json`, good asset alignment, and version/changelog consistency.
- **recommended improvement**: Limit Stage 3 changes to wording, alignment, and package clarity rather than restructuring files or changing supported workflows.
- **expected benefit**: Preserves validated strengths while addressing the highest-confidence issues.
- **confidence level**: High

## Blockers / confidence notes
- **issue observed**: No executed eval transcripts or rerun outputs were produced in this workflow, so recommendations rely on direct repository inspection rather than runtime behavior.
- **evidence type**: Reproducible workflow constraint / static-only evidence
- **evidence**: The requested workflow stages for this session did not include a fresh skill-eval execution loop before optimization.
- **recommended improvement**: Treat prose and policy-alignment changes as safe, but avoid behavior-changing rewrites that would require rerun evidence.
- **expected benefit**: Keeps the iteration grounded in observed evidence and reduces overfitting risk.
- **confidence level**: High for narrow edits, low for broader workflow changes
