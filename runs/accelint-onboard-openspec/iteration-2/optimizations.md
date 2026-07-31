# Stage 3 Optimizations — accelint-onboard-openspec

## 1. Reduce `SKILL.md` size by moving reference-heavy material into `references/`
- **recommendation addressed:** Move YAML safety rules and the full config template out of the main skill body.
- **evidence type supporting it:** Executed audit evidence + static audit evidence
- **files changed:**
  - `skills/accelint-onboard-openspec/SKILL.md`
  - `skills/accelint-onboard-openspec/references/yaml-safety.md`
  - `skills/accelint-onboard-openspec/references/config-template.md`
- **summary of implementation:** Extracted the YAML safety section into `references/yaml-safety.md` and the full config template into `references/config-template.md`. Updated Phase 4 and the Reference files section in `SKILL.md` to load these only when needed.
- **reason this change matches the evidence:** Stage 1 measured `SKILL.md` at `688` lines. After extraction it is `415` lines, directly addressing the progressive-disclosure and context-load problem without changing the workflow contract.

## 2. Trim repeated boundary prose while preserving the canonical separation rule
- **recommendation addressed:** Reduce repeated explanation of project-DNA vs behavior guidance.
- **evidence type supporting it:** Static audit evidence
- **files changed:**
  - `skills/accelint-onboard-openspec/SKILL.md`
- **summary of implementation:** Kept the strongest companion-skill explanation and avoided adding more repeated in-body prose while restructuring the Phase 4/template section.
- **reason this change matches the evidence:** Stage 1 found repetition around separation-of-concerns and preview/TODO guidance. The extraction reduced repetition pressure in the core body while preserving the main operational reminder.

## 3. Soften the serial-scan guardrail so it matches the documented fallback path
- **recommendation addressed:** Rephrase the hard-stop warning to align with inline fallback when subagents are unavailable.
- **evidence type supporting it:** Static audit evidence
- **files changed:**
  - `skills/accelint-onboard-openspec/SKILL.md`
- **summary of implementation:** Reworded the anti-pattern from an absolute "NEVER run serially" statement to a decision rule: do not default to serial inference when subagents are available; if they are unavailable, disclose that and run the same four-domain pass inline.
- **reason this change matches the evidence:** This preserves the performance intent while removing a small internal-consistency risk identified in Stage 1.

## 4. Regenerate published docs so published content matches current source
- **recommendation addressed:** Refresh stale published docs.
- **evidence type supporting it:** Static audit evidence
- **files changed:**
  - none in Stage 3
- **summary of implementation:** Not applied in this stage.
- **reason this change matches the evidence:** The evidence supports the recommendation, but this run is constrained to minimal high-value skill-package changes first. Docs sync was deferred to avoid widening scope before core skill updates and versioning were finalized.

## 5. Preserve current trigger coverage instead of broadening scope
- **recommendation addressed:** Avoid unnecessary frontmatter churn.
- **evidence type supporting it:** Static audit evidence
- **files changed:**
  - none
- **summary of implementation:** Left frontmatter description unchanged.
- **reason this change matches the evidence:** Stage 1 found strong existing trigger coverage and no executed evidence of under-triggering, so keeping the description stable matched the evidence better than speculative expansion.
