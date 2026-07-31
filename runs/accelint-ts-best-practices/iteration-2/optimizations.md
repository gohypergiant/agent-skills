# Stage 3 Optimizations — accelint-ts-best-practices

## 1. Removed the broken example-file dependency from the audit template
- **Recommendation addressed:** Remove or replace the missing audit example reference
- **Evidence type supporting it:** Static audit evidence
- **Files changed:** `skills/accelint-ts-best-practices/assets/output-report-template.md`
- **Summary of implementation:** Replaced the instruction that pointed to non-existent `assets/audit-report-example.md` with a direct instruction to use the template as-is when no package-specific example exists.
- **Reason this change matches the evidence:** The evidence showed a broken reference in the template itself, so the smallest evidence-aligned fix was to remove the dead dependency rather than introduce unrelated files.

## 2. Surfaced the minimum operational workflow in `SKILL.md`
- **Recommendation addressed:** Make the operational workflow harder to miss from `SKILL.md`
- **Evidence type supporting it:** Static audit evidence
- **Files changed:** `skills/accelint-ts-best-practices/SKILL.md`
- **Summary of implementation:** Added a short “minimum workflow” block under the `AGENTS.md` entry that explicitly calls out reading `references/quick-start.md` for implementation/refactor work, reading `references/input-validation.md` for boundary data, and choosing between the formal audit template and a lightweight direct-fix response.
- **Reason this change matches the evidence:** The audit found that key execution guidance was split across files. This change exposes the highest-value next steps at the top-level entry point without restructuring the package.

## 3. Softened over-absolute guidance in `AGENTS.md`
- **Recommendation addressed:** Soften absolute rule wording where context may matter
- **Evidence type supporting it:** Static audit evidence
- **Files changed:** `skills/accelint-ts-best-practices/AGENTS.md`
- **Summary of implementation:** Reframed the “Critical Anti-Patterns” section from universal prohibitions into strong defaults, while preserving the hardest safety rule on unbounded iteration and keeping the existing opinionated guidance intact.
- **Reason this change matches the evidence:** The audit showed that several rules were presented as universals. Reframing them as defaults lowers over-application risk while keeping the same best-practice direction.

## 4. Added explicit lightweight output guidance for non-audit uses
- **Recommendation addressed:** Add a lightweight response shape for non-audit uses
- **Evidence type supporting it:** Static audit evidence
- **Files changed:** `skills/accelint-ts-best-practices/SKILL.md`
- **Summary of implementation:** Added a compact response pattern for focused fixes and quick reviews: identify the issue, explain why it matters, cite the relevant reference, then apply or recommend the fix directly.
- **Reason this change matches the evidence:** The skill already defined when not to use the formal template, but not what to do instead. This fills that gap with minimal scope.

## Not applied
- No broad package restructuring was applied.
- **Reason:** Static evidence did not justify a rewrite of references, evals, or package layout.
