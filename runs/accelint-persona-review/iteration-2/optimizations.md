# Stage 3 Optimizations — accelint-persona-review

## Applied change 1
- **Recommendation addressed:** Add a clearer MCP failure-mode playbook and make non-blocking fallback behavior easier to follow.
- **Evidence type supporting it:** Static audit evidence.
- **Files changed:** `skills/accelint-persona-review/SKILL.md`
- **Summary of implementation:**
  - Clarified the Figma decision path for valid URLs whose target node cannot be fetched.
  - Added guidance to clarify scope before critiquing when desktop access is partial or selection context is unclear.
  - Strengthened the screenshot fallback language so it is treated as a valid continuation path, not a blocker.
  - Made Outline fallback more explicit by covering both unavailable MCP access and cases where no relevant docs are found.
  - Named the specific missing source types that should be called out when supporting-document evidence is absent.
- **Reason this change matches the evidence:** Stage 1 and Stage 2 both identified that fallback behavior existed but was spread across the workflow and underspecified for common failure modes. This change improves execution consistency without changing the skill’s core scope or public behavior.

## Applied change 2
- **Recommendation addressed:** Align README wording with auto-triggered skill usage.
- **Evidence type supporting it:** Static audit evidence.
- **Files changed:** `skills/accelint-persona-review/README.md`
- **Summary of implementation:** Added a short note near the top stating that the skill is intended to auto-trigger and that the examples are shorthand prompt patterns rather than required command syntax.
- **Reason this change matches the evidence:** The Stage 1 audit found that README usage could imply a command-only interface. This small clarification reduces maintainability and usage confusion while preserving existing examples.

## Not applied
- **Recommendation not applied:** Tighten eval assertions in `skills/accelint-persona-review/evals/evals.json`.
- **Why not applied:** Current evidence is static-only, and the existing eval set already covers the key boundary conditions. Without executed grading inconsistency or benchmark evidence, changing eval wording would add churn without strong support.

## Scope control
Only minimal, evidence-backed wording and workflow clarifications were applied. No broad structural rewrite, frontmatter change, or version metadata change was made in this stage.
