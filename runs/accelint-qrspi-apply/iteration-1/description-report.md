# accelint-qrspi-apply description report

## Summary
Updated the frontmatter description in `skills/accelint-qrspi-apply/SKILL.md` to improve trigger quality and sharpen routing boundaries using the existing default eval set as the target behavior.

## What changed
- Reframed the core action as implementing an existing QRSPI-planned change by orchestrating `/opsx:apply`, dependency-aware slice execution, living-document updates, and mandatory verification.
- Expanded trigger language beyond just "parallelization" to cover:
  - applying an existing QRSPI/OpenSpec change package
  - running or resuming slices from `tasks.md`
  - continuing partially completed checkbox-tracked work
  - executing dependency-level task plans safely
- Added stronger positive-routing cues for requests about:
  - QRSPI-generated changes
  - vertical slices
  - resuming progress
  - delegated implementation with loaded context
  - full apply-through-verify workflow
- Added explicit negative boundaries so the skill does not compete for:
  - planning/proposal work
  - direct manual implementation outside `/opsx:apply`
  - archive workflows
  - generic OpenSpec requests that are not about executing an existing QRSPI task package

## Rationale
The eval set emphasized that this skill should trigger not only for obvious "run the parallel slices" requests, but also for adjacent execution cases such as resumption, dependency-aware apply, config-context injection, safe sequential fallback, and mandatory verification. The old description covered the parallel-slice case well, but it was weaker on:

- end-to-end apply-through-verify scope
- resume/progress-tracking language
- explicit distinction from planning and archive skills
- distinction from plain `/opsx:apply` for non-QRSPI work

The new description broadens true-positive coverage for those cases while tightening boundaries against common near-misses in the evals.