# Stage 3 Optimizations — accelint-react-testing

## 1. Calibrated the destructured-query guidance
- **recommendation addressed:** Soften or correct the destructured-query warning
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-react-testing/SKILL.md`
- **summary of implementation:** Replaced the claim that destructured render queries create stale DOM-snapshot behavior with a narrower recommendation that prefers `screen` for consistency, centralized querying, and easier debugging. The new wording still discourages destructured queries as the default, but no longer relies on the earlier overstatement.
- **reason this change matches the evidence:** Stage 1 identified this claim as the least well-supported statement in the top-level guidance. The update preserves the intended recommendation while removing unsupported certainty.

## 2. Softened selected overly rigid top-level phrasing
- **recommendation addressed:** Replace overly rigid universal phrasing where reasoning is enough
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-react-testing/SKILL.md`
- **summary of implementation:** Reworded several top-level bullets from hard-universal phrasing to more calibrated defaults, specifically around test-only ARIA, whole-tree snapshots, and undocumented custom renders.
- **reason this change matches the evidence:** The audit found that repeated absolute phrasing made some guidance feel more brittle than necessary. These localized prose changes retain the same practical direction while making edge-case handling less dogmatic.

## 3. Added eval coverage for the identified weak spots
- **recommendation addressed:** Add eval coverage for disputed-prose and routing behavior
- **evidence type supporting it:** Static repository evidence
- **files changed:** `skills/accelint-react-testing/evals/evals.json`
- **summary of implementation:** Added two new evals: one checks that advice about `screen` versus destructured queries stays calibrated and evidence-based; the other tests proportional behavior in a borderline review-versus-direct-fix scenario.
- **reason this change matches the evidence:** Existing evals were broad but did not directly test the exact weak points found in Stage 1. These additions create future evidence around those specific behaviors without broadening scope.

## Not applied

### Trim the top-level `SKILL.md` more aggressively
- **reason not applied:** Confidence was only medium, and the static evidence did not justify a broader rewrite inside Stage 3. The current package already uses references effectively, so a larger reduction would have risked changing behavior without executed eval evidence.
