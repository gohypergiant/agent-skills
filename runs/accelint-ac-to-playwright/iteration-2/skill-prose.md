# Stage 4 Skill Prose Audit — accelint-ac-to-playwright

## Scope
Audited and rewrote **non-frontmatter prose only** in `skills/accelint-ac-to-playwright/SKILL.md`.

Frontmatter was intentionally not reviewed or changed.

## Files inspected
- `skills/accelint-ac-to-playwright/SKILL.md`
- `skills/accelint-ac-to-playwright/references/acceptance-criteria.md`
- `skills/accelint-ac-to-playwright/references/test-hooks.md`

## Observed issues
1. **Opening instructions were accurate but visually dense**
   - Evidence: the pre-edit opening block combined mandatory-read rules, re-read timing, and test-hooks loading guidance in one uninterrupted section.
2. **Mode boundaries were present but easy to skim past**
   - Evidence: assessment-only and conversion behavior appeared as plain sentences immediately after the fallback rules.
3. **The validation retry protocol was correct but harder to parse quickly**
   - Evidence: both attempts were embedded in a compact nested list, making the single-fix/two-attempt policy easier to miss.
4. **Test-level assertion rules mixed core requirements with emphasis wording**
   - Evidence: the assertion section used accurate but visually heavier phrasing such as “NEVER infer unstated information” inline with field requirements.

## Rewrites applied
- Added a `## Before you start` heading to isolate the mandatory-read contract.
- Split the opening instructions into shorter blocks without changing requirements.
- Added a `Mode boundaries` label so assessment-only vs conversion behavior is easier to find.
- Reformatted the two-attempt validation protocol into cleaner attempt sub-bullets.
- Tightened the test-level assertion wording so explicit-field requirements remain clear without changing behavior.

## What did not change
- No frontmatter changes.
- No workflow changes.
- No mode-selection changes.
- No guardrail changes.
- No reference-file changes.

## Confidence
**Medium-high**

Reason: the edits are grounded in direct file inspection and were limited to scanability improvements. No empirical runtime transcript evidence was available for this stage, so confidence is about prose safety, not newly observed execution gains.
