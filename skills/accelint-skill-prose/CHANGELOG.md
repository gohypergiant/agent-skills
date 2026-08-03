# Changelog

## [0.7.13] - 2026-08-03

### Changed
- Updated `references/serial-instruction-guidance.md` to prefer neutral stage-container wording (`Stage` or a descriptive section heading) instead of `Phase` when discussing higher-level workflow containers. This is a low-risk precaution based on repo evidence that some agents treat phase-style headings as checkpoint boundaries.

### Version
- Patch release at `0.7.13`.

## [0.7.12] - 2026-08-03

### Changed
- Tightened the serial-order rules in `SKILL.md` to align more closely with the house standard: numbered lists for 2 to 3 short steps, `Step 0` plus a checklist for 4 or more steps, stronger `Requires:` and `Done when:` expectations, and a harder rule against plain bullets for ordered work.
- Added explicit `Step 0` progress tracking to the required self-check workflow so long verification sequences have visible state and better skip observability.
- Tightened `references/serial-instruction-guidance.md` so `Step 0` is the default for 4 or more ordered steps and the plain-bullets rule is stated as a hard prohibition.

### Version
- Patch release at `0.7.12`.

## [0.7.11] - 2026-08-03

### Changed
- Reworked `SKILL.md` to express key operating flows as explicit ordered steps with stronger dependency and gating language around output-mode selection, artifact discovery, rewrite sequencing, and pre-delivery checks.
- Added a dedicated serial-order section to `SKILL.md` so explicit and implied sequencing cues in skills, prompts, and general prose are detected and strengthened instead of left as soft paragraph logic.
- Added `references/serial-instruction-guidance.md` for progressive disclosure of sequencing detection, preferred structures, branch handling, and audit questions for workflow-bearing prose.

### Version
- Patch release at `0.7.11`.

## [0.7.10] - 2026-07-31

### Fixed
- Tightened the `SKILL.md` frontmatter description so trigger routing more clearly prefers `accelint-skill-prose` when wording controls behavior, while preserving the existing boundary against broader content strategy, policy work, and ordinary prose cleanup.
- Reduced a few repeated explanatory lines in `SKILL.md` so the root contract is easier to scan without changing workflow semantics, guardrail strength, or progressive-disclosure handoffs.
- Added concise maintainer guidance to `README.md` about eval coverage, version alignment, and when to keep changes minimal because no benchmark or transcript evidence justifies broader rewrites.
- Applied a strict-mode local prose pass to `SKILL.md` and `references/checklist.md`, excluding frontmatter as required, to clarify root-first artifact discovery and improve local sentence flow without changing the behavior contract.

### Version
- Patch release at `0.7.10`.

## [0.7.9] - 2026-07-30

### Fixed
- Tightened `assets/output-template.md` so unchanged behavior-bearing artifact-set files must use the exact unchanged-file classifications required by the root skill, and clarified that the template `Why:` field must carry that classification.
- Applied a strict-mode prose pass across `SKILL.md` and the behavior-bearing `references/*.md` files to improve scanability, local sentence structure, and repeated phrasing without changing trigger coverage, workflow semantics, guardrail strength, or exact technical references.
- Expanded `evals/evals.json` with additional cases for audit-only output-mode violations, `mode=default` local rewrite limits, folder-level artifact discovery, frontmatter boundary drift, exact verb preservation in workflow warnings, and unchanged-file classification checks.

### Version
- Patch release at `0.7.9`.

## [0.7.8] - 2026-07-30

### Fixed
- Tightened `SKILL.md` wording around artifact-set discovery and progressive disclosure so the action path reads more directly in strict folder-level audits without changing the required crawl order or rewrite scope.
- Clarified in `SKILL.md` that cross-file alignment is `REQUIRED`, making the obligation level explicit while preserving the existing hard requirement.
- Removed the stale `No edit needed` example from `assets/output-template.md` so the template no longer contradicts the root skill's required unchanged-file classifications.

### Version
- Patch release at `0.7.8`.

## [0.7.7] - 2026-07-30

### Fixed
- Clarified in `SKILL.md` that strict folder-level audits and rewrites must judge local sentence-structure quality inside each behavior-bearing file, not only cross-file alignment.
- Tightened `references/checklist.md` and `references/workflow-guardrails.md` so unchanged artifact-set files must be defensible on local prose clarity as well as behavioral consistency.
- Split a few dense passages in `SKILL.md` and converted the artifact-focus lenses into a compact list so strict-mode guidance is easier to scan without changing behavior.

### Version
- Patch release at `0.7.7`.

## [0.7.6] - 2026-07-30

### Fixed
- Clarified in `SKILL.md` that folder-level artifact-set review must evaluate local sentence structure in each behavior-bearing file, not only cross-file consistency.
- Tightened the required self-check so unchanged artifact-set files must be defensible on local prose quality as well as behavioral alignment.
- Updated `assets/output-template.md` so report reasons can explicitly cite local sentence-structure quality when explaining why a file changed or stayed unchanged.

### Version
- Patch release at `0.7.6`.

## [0.7.5] - 2026-07-30

### Changed
- Updated `SKILL.md` so audit-only outputs now also include the consistent report from `assets/output-template.md`, making the report format consistent across all output modes.
- Updated `assets/output-template.md` usage guidance so audit-only outputs give the audit findings first and then append the completed report.
- Realigned `metadata.version` in `SKILL.md` with the changelog at `0.7.5`.

### Version
- Patch release at `0.7.5`.

## [0.7.4] - 2026-07-30

### Changed
- Updated `SKILL.md` so all rewrite-bearing outputs now include the consistent report from `assets/output-template.md`, including rewrite-only outputs.
- Updated `assets/output-template.md` usage guidance so rewrite-only outputs return the rewrite first and then append the completed report.
- Realigned `metadata.version` in `SKILL.md` with the changelog at `0.7.4`.

### Version
- Patch release at `0.7.4`.

## [0.7.3] - 2026-07-30

### Changed
- Updated `SKILL.md` so audit-plus-rewrite outputs always include the consistent report from `assets/output-template.md`.
- Updated `assets/output-template.md` usage guidance so the report is mandatory for audit-plus-rewrite outputs and still optional only when the user explicitly requests rewrite-only output with no added report.
- Realigned `metadata.version` in `SKILL.md` with the changelog at `0.7.3`.

### Version
- Patch release at `0.7.3`.

## [0.7.2] - 2026-07-30

### Added
- Added `assets/output-template.md` with a consistent delivery-report template for `accelint-skill-prose` work, including what changed, why it changed, and which other artifact-set files changed or stayed unchanged and why.

### Changed
- Updated `SKILL.md` to point agents to `assets/output-template.md` when the user wants a consistent rewrite report or artifact-set status report, while preserving rewrite-only output constraints.

### Version
- Patch release at `0.7.2`.

## [0.7.1] - 2026-07-30

### Fixed
- Clarified that folder-level skill-prose work should treat the root `SKILL.md`, sibling `AGENTS.md` when present, and behavior-bearing `references/*.md` files as the default artifact set rather than as optional follow-up context.
- Tightened rewrite and self-check guidance so agents rewrite any artifact-set files that need alignment and can explain why any behavior-bearing file stayed unchanged.
- Updated checklist, workflow, and example references to treat support-file rewriting as part of the main task, including progressive-disclosure handoffs across files.
- Expanded eval coverage for folder-level artifact-set behavior so `AGENTS.md` and `references/*.md` are more reliably treated as editable deliverables when consistency requires it.

### Version
- Patch release at `0.7.1`.

## [0.7.0] - 2026-07-30

### Changed
- Rewrote `SKILL.md` in `mode=strict` to lead with operational controls, separate core rules from rewrite method, and make the action path easier to scan without changing trigger coverage, workflow semantics, guardrail strength, or exact technical meaning.
- Tightened the frontmatter description so the trigger logic stays explicit while reading more directly.
- Standardized terminology and section flow across the root skill so output mode, rewrite mode, artifact focus, rewrite method, and self-check guidance are easier to audit.

### Version
- Minor release at `0.7.0`.

## [0.6.0] - 2026-07-30

### Added
- Added explicit `mode=default` and `mode=strict` rewrite-mode control to `SKILL.md`, alongside the existing output-mode distinctions.
- Added a positive default writing method for behavior-defining prose so the skill teaches how to shape descriptions, workflows, guardrails, rationale, and examples rather than only what to avoid.
- Added `references/artifact-patterns.md` with artifact-specific shaping guidance for descriptions, workflows, guardrails, rationale, examples, and audit findings.
- Added new worked examples covering positive guardrail rewrites, workflow shaping, and local-versus-structural rewrite choices.

### Changed
- Rebalanced `SKILL.md` toward constructive instruction while preserving the existing safety model, hard stops, and exactness rules.
- Clarified that rewrite mode controls scope while output mode controls the deliverable.
- Tightened RFC 2119 guidance so normalization happens when it clarifies true normative force, not mechanically or just for formality.
- Tightened the reference set to reduce duplication: `artifact-patterns.md` now focuses on artifact-specific shaping, `ste-compatible-rules.md` defers broad final verification to `checklist.md`, and `rfc-2119.md` now matches the root skill's more selective normalization framing.
- Expanded the checklist to verify constructive rewrite quality, including early rule visibility, instruction-versus-explanation separation, and mode-aware output compliance.

### Version
- Minor release at `0.6.0`.

## [0.5.4] - 2026-07-29

### Fixed
- Required skill-folder crawls to follow explicit links and references from `SKILL.md`, `AGENTS.md`, and other instruction files before broadening to generic support-file discovery.
- Added an explicit recovery rule for inconclusive file discovery so agents MUST retry with a simpler listing method or direct directory inspection, or tell the user the crawl is incomplete before proceeding.
- Expanded the required self-check and checklist guidance so incomplete support-file discovery is caught before delivery.

### Version
- Patch release at `0.5.4`.

## [0.5.3] - 2026-07-29

### Fixed
- Tightened a few wording hotspots in `SKILL.md` and supporting references without changing trigger coverage, workflow semantics, or guardrail strength.
- Standardized recurring phrasing such as “the same requests” across the root skill and references to reduce low-risk synonym drift.
- Marked the RFC 2119 source URL as inline code in `references/rfc-2119.md` so it stays visually distinct from ordinary prose.

### Version
- Patch release at `0.5.3`.

## [0.5.2] - 2026-07-29

### Fixed
- Clarified that skill-folder work should start with the root `SKILL.md` and then recursively inspect other likely behavior-bearing files in the folder, not only explicitly linked files.
- Clarified that `references/` content and other inspected support files are eligible for edit when cross-file consistency requires it.
- Updated reference guidance and checklist language so folder-path invocations like `/accelint-skill-prose <path-to-skill-folder>` more reliably cover full-folder audits and rewrites.

### Version
- Patch release at `0.5.2`.

## [0.5.1] - 2026-07-29

### Added
- Added explicit skill-folder crawling guidance so edits start by reading the root `SKILL.md` and relevant linked support files before tightening behavior-bearing prose.
- Added cross-file consistency checks to ensure `references/` content stays aligned with revised root instructions.

### Changed
- Updated `SKILL.md` and linked reference files to treat cross-file wording consistency as part of safe skill-prose editing.
- Clarified that description tightening and workflow reviews should consider the full behavior-bearing file set, not only the quoted passage.

### Fixed
- Clarified that short practical notes should stay notes, not expand into more procedural or policy-like prose during scanability rewrites.
- Added checklist and example guidance to preserve compact source formats such as notes, checklists, banners, and headings.

### Version
- Minor+patch changes combined in release `0.5.1`.

## [0.4.2] - 2026-07-29

### Fixed
- Clarified that RFC 2119 normalization applies to heading-level and banner-level severity labels such as `MANDATORY CHECKPOINT`, not only sentence-level prose.
- Required an explicit exactness-based justification when preserving informal severity labels like `MANDATORY` or `CRITICAL` in behavior-defining rewrites.
- Expanded the required self-check to inspect headings, banners, and checkpoint labels for unnormalized severity wording.

### Version
- Patch release at `0.4.2`.

## [0.4.1] - 2026-07-29

### Changed
- Tightened audit-only mode in `SKILL.md` to prohibit sentence-level replacement wording unless the user explicitly asks for examples, reducing the risk of accidental rewrites in audit-only responses.
- Updated the audit-only output rules and required self-check to explicitly verify that audit-only deliverables stay findings-only.

### Version
- Patch release at `0.4.1`.

## [0.4.0] - 2026-07-29

### Added
- Added `references/rfc-2119.md` with normalization guidance for converting informal severity labels into RFC 2119 obligation terms in behavior-defining prose.
- Added `references/ste-compatible-rules.md` with a skill-specific distilled set of Simplified Technical English patterns adapted for behavior-preserving prompt editing.

### Changed
- Updated `SKILL.md` to normalize labels such as `critical` and `important` into RFC 2119 obligation terms when rewriting behavior-defining text, while preserving quoted text and exact untouchables.
- Added progressive-disclosure guidance to load the RFC 2119 and STE-compatible references when obligation strength, sentence clarity, omission risk, or procedure-versus-description separation matters.
- Strengthened the required self-check to verify that any RFC 2119 normalization matches the real requirement level rather than rhetorical emphasis.
- Clarified that Simplified Technical English and ADHD-friendly patterns are optional supporting disciplines, not governing rewrite modes, and that behavior preservation remains the controlling priority.
- Tightened skill prose and reference wording to remove stale citation-style phrasing, improve self-containment, and align the folder around the new bundled references.
- Expanded eval coverage for RFC 2119 normalization and obligation-drift auditing.

### Version
- Minor release at `0.4.0`.
