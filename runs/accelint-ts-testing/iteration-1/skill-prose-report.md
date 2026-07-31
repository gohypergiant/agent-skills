Highest-risk issues first
- `skills/accelint-ts-testing/AGENTS.md` used banner-style severity wording (`CRITICAL`) where RFC 2119-style obligation wording was clearer for a behavior-bearing completion requirement. I normalized the label to `REQUIRED` without changing the requirement strength.
- `skills/accelint-ts-testing/SKILL.md`, `AGENTS.md`, `README.md`, and `references/quick-start.md` had minor terminology and sentence-shape drift (`vitest` vs `Vitest`, inflated lead-ins, and less direct phrasing) that made the package slightly harder to scan. I tightened those passages without changing trigger scope, workflow order, or rule strength.
- The rest of the inspected artifact set was already behaviorally aligned and near minimum safe form. I left those files unchanged after the local-tightening sweep because further edits would add drift risk without meaningful clarity gain.

Rewrite summary
- Tightened lead sentences and scope framing in `skills/accelint-ts-testing/SKILL.md`.
- Tightened AI-audience framing and workflow wording in `skills/accelint-ts-testing/AGENTS.md`.
- Tightened explanatory prose in `skills/accelint-ts-testing/README.md`.
- Tightened local structure and terminology in `skills/accelint-ts-testing/references/quick-start.md`.

## Summary
- Task: Audit plus rewrite the `skills/accelint-ts-testing` skill package in strict mode, tighten behavior-defining prose and related package prose artifacts, and write the report to `runs/accelint-ts-testing/skill-prose-report.md`
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `skills/accelint-ts-testing/SKILL.md`, `skills/accelint-ts-testing/AGENTS.md`, `skills/accelint-ts-testing/README.md`, `skills/accelint-ts-testing/assets/output-report-template.md`, `skills/accelint-ts-testing/references/aaa-pattern.md`, `skills/accelint-ts-testing/references/assertions.md`, `skills/accelint-ts-testing/references/async-testing.md`, `skills/accelint-ts-testing/references/error-handling.md`, `skills/accelint-ts-testing/references/organization.md`, `skills/accelint-ts-testing/references/parameterized-tests.md`, `skills/accelint-ts-testing/references/performance.md`, `skills/accelint-ts-testing/references/property-based-testing.md`, `skills/accelint-ts-testing/references/quick-start.md`, `skills/accelint-ts-testing/references/snapshot-testing.md`, `skills/accelint-ts-testing/references/test-doubles.md`, `skills/accelint-ts-testing/references/vitest-features.md`, `skills/accelint-ts-testing/evals/evals.json`

## What changed
- `skills/accelint-ts-testing/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving structure tightening and terminology normalization improved scanability without changing trigger coverage or workflow semantics
  - Notes: tightened lead-in prose, normalized `Vitest` capitalization in narrative text, and simplified non-behavior-bearing explanatory sentences

## Other artifact-set files
- `skills/accelint-ts-testing/AGENTS.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved workflow readability and normalized severity wording without changing obligation strength
  - Notes: tightened audience framing, simplified usage instructions, and changed banner-style `CRITICAL` labels tied to completion workflow reminders to `REQUIRED`
- `skills/accelint-ts-testing/README.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved clarity and terminology consistency across the package
  - Notes: normalized `Vitest` capitalization in prose and tightened explanatory wording around config guidance and package overview
- `skills/accelint-ts-testing/references/quick-start.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved local sentence structure and terminology consistency with the rest of the package
  - Notes: tightened overview text and before/after framing without changing the example behavior
- `skills/accelint-ts-testing/assets/output-report-template.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: template already had direct, behaviorally precise instructions
- `skills/accelint-ts-testing/references/aaa-pattern.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: already structurally clear and behaviorally precise after local-tightening sweep
- `skills/accelint-ts-testing/references/assertions.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: obligation strength and examples were already explicit and stable
- `skills/accelint-ts-testing/references/async-testing.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: async workflow wording and examples were already clear and tightly aligned to the contract
- `skills/accelint-ts-testing/references/error-handling.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: dense but already well-structured for its scope and preserved important rationale
- `skills/accelint-ts-testing/references/organization.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: section ordering, examples, and guardrails were already doing behavior-bearing work cleanly
- `skills/accelint-ts-testing/references/parameterized-tests.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: examples and workflow distinctions were already easy to follow
- `skills/accelint-ts-testing/references/performance.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: explicit config-versus-hook guidance was already clear and behaviorally stable
- `skills/accelint-ts-testing/references/property-based-testing.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: property hierarchy, guardrails, and installation approval boundary were already clear
- `skills/accelint-ts-testing/references/snapshot-testing.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: examples and anti-pattern boundaries were already explicit
- `skills/accelint-ts-testing/references/test-doubles.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: hierarchy wording and mock-usage boundaries were already direct and stable
- `skills/accelint-ts-testing/references/vitest-features.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: feature-routing guidance and progressive-disclosure handoffs were already clear
- `skills/accelint-ts-testing/evals/evals.json`
  - Changed: no
  - Why: out of scope
  - Notes: eval data is not a prose artifact for tightening in this pass

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- None noted
