# Stage 3 Optimizations — accelint-ac-to-playwright

## Applied changes

### 1) Update vulnerable dependency graph
- **Recommendation addressed:** Update vulnerable dependency graph
- **Evidence type supporting it:** Executed tooling evidence
- **Files changed:** `skills/accelint-ac-to-playwright/package-lock.json`
- **Summary of implementation:** Ran `npm audit fix` in the skill package, which updated the lockfile and removed the previously reported vulnerable transitive `postcss` path.
- **Reason this change matches the evidence:** Stage 1 found a reproducible high-severity vulnerability with `fixAvailable: true`. After the update, `npm audit --json` reported `0` vulnerabilities.

### 2) Tighten README to match the current runtime contract
- **Recommendation addressed:** Tighten README so maintainers see the same contract the skill enforces
- **Evidence type supporting it:** Static audit evidence only
- **Files changed:** `skills/accelint-ac-to-playwright/README.md`
- **Summary of implementation:** Added an operational-rules note covering assessment-first execution, whole-batch stop on failed assessment, and explicit output-directory requirements before writing files. Also added a short maintainer note that `SKILL.md` remains the runtime source of truth.
- **Reason this change matches the evidence:** Stage 1 found README drift relative to `SKILL.md`. This narrow doc update aligns the package docs without changing runtime behavior.

### 3) Rewrite body-only skill prose for scanability without changing behavior
- **Recommendation addressed:** Rewrite non-frontmatter skill prose for faster scanning without changing behavior
- **Evidence type supporting it:** Static audit evidence only
- **Files changed:** `skills/accelint-ac-to-playwright/SKILL.md`
- **Summary of implementation:** Tightened the opening instructions into a clearer “Before you start” section, added a short “Mode boundaries” label, reformatted the validation retry block for easier scanning, and simplified the test-level assertion wording while preserving the same guardrails and requirements.
- **Reason this change matches the evidence:** The build/test evidence showed the package was already behaviorally sound, so the evidence supported a minimal prose-only refinement rather than a structural rewrite.

## Not applied
- **Broad behavioral refactors or code changes beyond dependency maintenance**
  - **Why not applied:** Stage 1 and Stage 3 validation showed the core package already works (`npm run build` passed, `npm test` passed all 293 tests). No executed eval transcripts or runtime defects justified broader changes.

## Verification
- `cd skills/accelint-ac-to-playwright && npm run build` ✅
- `cd skills/accelint-ac-to-playwright && npm test` ✅ (`293/293` tests passed)
- `cd skills/accelint-ac-to-playwright && npm audit --json` ✅ (`0` vulnerabilities)
