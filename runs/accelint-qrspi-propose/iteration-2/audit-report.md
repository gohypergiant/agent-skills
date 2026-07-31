# Stage 1 Audit Report — accelint-qrspi-propose

## Grade
A-

## Audit summary
This is a strong, mature planning-orchestration skill with clear boundaries, good guardrails, and unusually thorough behavioral eval coverage. The biggest remaining risks are instruction density, a likely cross-file naming inconsistency, and limited precision in the current eval structure for some procedural guarantees.

## Strengths

1. **Clear planning-only boundary**
   - Evidence: `skills/accelint-qrspi-propose/SKILL.md` frontmatter description excludes implementation, archive, architecture-doc, and artifact-polish-only work.
   - Evidence: `SKILL.md` sections `What This Skill Does`, `No Automatic Implementation`, and `NEVER Do This` repeat the stop-before-implementation constraint.
   - Evidence: `skills/accelint-qrspi-propose/README.md` mirrors the handoff to `/accelint-qrspi-apply <change-name>`.

2. **High workflow specificity for a complex skill**
   - Evidence: `SKILL.md` numbered steps 1–47 define sequencing, context isolation, artifact verification, checkpoints, and failure handling in concrete terms.
   - Evidence: `SKILL.md` steps 26–31 and 43–47 enforce explicit approval gates before proceeding.

3. **Strong behavioral eval coverage**
   - Evidence: `skills/accelint-qrspi-propose/evals/evals.json` covers happy path, missing input, configuration failures, context-isolation behavior, missing artifacts, frontmatter timing/format, vertical-slice correction, review loops, and out-of-scope negative triggers.
   - Evidence: negative boundary cases in evals 31–34 protect against misrouting to apply, archive, architecture-doc, and prose-only editing.

4. **Good versioning hygiene**
   - Evidence: `SKILL.md` metadata version is `1.6.4`, matching `skills/accelint-qrspi-propose/CHANGELOG.md` latest entry.

## Issues and risks

1. **Instruction density may reduce reliability**
   - Evidence: `SKILL.md` repeatedly uses `REQUIRED`, `CRITICAL`, and `NEVER` across workflow steps and guardrails.
   - Risk: a long, highly repetitive control surface can make agents skim, overweight local wording, or miss later constraints.

2. **Likely skill-name inconsistency in related references**
   - Evidence: `SKILL.md` Configuration Requirements item 4 says `accelint-onboard-agent`.
   - Evidence: `README.md` Related Skills also lists `accelint-onboard-agent`.
   - Repository evidence: the available skill in this repo is `accelint-onboard-agents` (plural), not the singular form.

3. **Evals are broad but mostly natural-language expectation checks**
   - Evidence: `evals/evals.json` is rich in scenario coverage, but most entries rely on `expected_output` prose and few attached fixtures.
   - Risk: this lowers precision for regressions around exact ordering, exact checkpoint pause behavior, frontmatter merge behavior, and task rewrite formatting.

## Likely high-value optimization areas

- Reduce redundant instruction wording in `SKILL.md` without weakening guardrails.
- Fix the onboarding-skill naming mismatch in package docs/instructions.
- Add more structure-verifiable eval coverage for exact procedural guarantees.
