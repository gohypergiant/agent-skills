# accelint-qrspi-propose eval coverage report

Generated 34 eval cases for `skills/accelint-qrspi-propose/evals/evals.json`.

## Scenario categories

### Trigger coverage
- Explicit QRSPI planning requests
- OpenSpec change planning language
- Scope and breakdown requests that must stop before coding

Why it matters: the skill should activate for formal planning work, not just direct mentions of the skill name.

### Input validation and setup
- Empty invocation with no ticket or feature description
- Missing required OpenSpec workflows
- Valid configuration path that continues only after checks

Why it matters: the workflow depends on real planning input and the expanded OpenSpec profile.

### Context isolation
- Questions stage stays solution-free
- Research stage sees only questions
- Design stage uses questions plus research, not the original ticket

Why it matters: context isolation is the core QRSPI behavior that prevents solution-first drift.

### Checkpoints and approval gates
- Mandatory design review pause
- Design edit loop and manual edit path
- Mandatory tasks review pause
- Tasks edit loop and manual edit path

Why it matters: the skill's main value comes from cheap corrections before implementation.

### Artifact generation boundaries
- Stop after proposal.md and design.md before specs/tasks
- Verify design.md, specs, and tasks files exist
- Completion stops before implementation and points to `accelint-qrspi-apply`

Why it matters: the skill must orchestrate `/opsx` planning only and never slide into implementation.

### Frontmatter bookkeeping
- Capture `specs_touched` and `decisions` only after approval
- Merge existing frontmatter correctly
- Use inline array syntax for `specs_touched`
- Flag missing metadata instead of guessing
- Allow later planning stages even if bookkeeping is incomplete

Why it matters: this metadata feeds later archive workflows and must be accurate.

### Task quality enforcement
- Detect and convert horizontal slicing
- Preserve markdown checklist format
- Add or update `## Parallelization Strategy`

Why it matters: `accelint-qrspi-apply` depends on vertical slices, checklist tasks, and usable dependency guidance.

### Failure handling
- OpenSpec command failure stops and asks for retry or abort
- Sub-agent failure allows manual fallback only for Questions and Research
- Missing artifacts block unsafe continuation

Why it matters: failure paths are easy places for a planning skill to violate its own guardrails.

### Non-trigger boundaries
- Implementation request
- Archive request
- Generic architecture-doc request
- Artifact polish only

Why it matters: these cases protect against false positives and keep the skill scoped to formal QRSPI planning.
