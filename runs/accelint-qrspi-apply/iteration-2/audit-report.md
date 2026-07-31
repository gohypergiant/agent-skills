# Audit Report: `skills/accelint-qrspi-apply`

## Scope

Audited exactly one skill package:

- `skills/accelint-qrspi-apply/SKILL.md`
- `skills/accelint-qrspi-apply/README.md`
- `skills/accelint-qrspi-apply/CHANGELOG.md`
- `skills/accelint-qrspi-apply/evals/evals.json`

No files were edited.

## Overall Grade

**A-**

This is a strong, mature orchestration skill with unusually explicit safety rails, good trigger targeting, and evidence of iterative hardening through changelog-driven fixes. Its biggest quality risks are instruction volume/complexity, some maintainability drift signals, and a few places where the skill depends on the model making non-trivial judgments from prose rather than from tighter operational structures.

---

## Strengths

### 1. Triggering is clear, scoped, and well-defended
The frontmatter description is specific about both when to use and when not to use the skill:

- It targets “**an existing QRSPI-planned OpenSpec change**”
- It names concrete triggers like “**apply or resume a QRSPI change package**,” “**execute checkbox-tracked vertical slices from tasks.md**,” and “**continue from a partial implementation**”
- It excludes adjacent workflows: “**Do not use for planning a change, hand-implementing work outside /opsx:apply, archiving completed changes**”

That is strong routing hygiene for an orchestration skill, especially because it distinguishes itself from plain `/opsx:apply` rather than just saying “use this for OpenSpec apply.”

### 2. Workflow safety is a major strength
The skill is packed with explicit guardrails that reduce common agent failure modes:

- Invalid `tasks.md` formats are rejected early rather than worked around
- Verification is mandatory: “**NEVER skip verification**”
- Direct implementation is prohibited: “**NEVER implement tasks directly**”
- Dependency levels must be respected: “**NEVER skip dependency levels**”
- Malformed `config.yaml` context must not be injected: “**warn the user and proceed without injected context**”
- Potential parallel overlap is explicitly checked before parallelization

These safety rules are not just generic warnings; they map directly to known orchestration risks in the body of the skill. That makes the skill safer than average and shows good operational thinking.

### 3. The skill demonstrates strong failure-awareness and recovery design
The skill handles several realistic edge cases with concrete behavior:

- partial completion / resume from checkboxes
- circular dependencies
- missing slices referenced in strategy
- sub-agent failure or timeout
- no sub-agent support
- likely parallel merge conflicts
- ambiguous slice boundaries

This is backed by the eval set, which includes prompts for each of those cases in `evals/evals.json`, such as:

- `invalid-tasks-format-stops-early`
- `resume-after-partial-completion`
- `parallel-slices-with-overlap-risk-trigger-caution`
- `circular-dependency-in-strategy-rejected`
- `do-not-implement-directly-even-when-user-asks`

That alignment between instructions and eval coverage is a strong quality signal.

### 4. Living-document synchronization is thoughtfully integrated
The skill does more than implementation orchestration. It explicitly updates:

- `openspec/config.yaml`
- `ARCHITECTURE.md`
- `AGENTS.md`
- `README.md`

It also distinguishes each document’s purpose and includes manual fallback guidance if helper skills are unavailable. That is unusually thorough and reduces drift after implementation. The ordering is also intentional: the skill requires doc updates **before** verification so verification can inspect documentation completeness.

### 5. Changelog shows empirical iteration, not just cosmetic version bumps
`CHANGELOG.md` documents repeated audit-driven refinements tied to concrete failure modes:

- v1.6.0 added config-context sanity checks, overlap checks, and collision review
- v1.5.0 removed phase boundaries because they caused premature stopping
- v1.3.0 fixed the skill stopping after the first living document and skipping verification
- v1.2.0 added explicit `config.yaml` context loading because OpenSpec apply did not inject it automatically

That history suggests the package has been tested against real agent behavior, not just written once and left alone.

---

## Weaknesses

### 1. Instruction load is very high and creates maintainability pressure
`README.md` states the core instruction file is:

- “**SKILL.md - Complete orchestration workflow (783 lines)**”

That is a real maintainability risk for an agent skill. Even though the content is structured, 783 lines is well beyond the “keep SKILL.md under 500 lines ideal” guidance from the loaded `skill-creator` skill. Long instruction files increase the odds of:

- internal inconsistency
- partial adherence
- section overshadowing
- future edits breaking cross-references or workflow order

This is the clearest empirical maintainability concern in the package.

### 2. Some instructions rely on prose-heavy interpretation instead of more operational primitives
Several critical behaviors depend on the model inferring structure from text, for example:

- parsing the “Parallelization Strategy” into a dependency graph
- detecting overlap risk from slice wording
- manually isolating YAML `context: |`
- deciding whether a document update is in scope

The skill does add safety checks around these, which helps, but these are still fuzzy operations. The package contains no helper scripts or structured resources to reduce ambiguity. For a complex orchestration skill, that means quality depends heavily on instruction-following rather than deterministic support.

### 3. There are signs of naming drift around related skills
In `SKILL.md`, AGENTS updates check for:

- `accelint-onboard-agent`

But the available related skill in the repository ecosystem is named `accelint-onboard-agents` elsewhere in this repo context. The same singular form appears in the README’s related skills list. That may be intentional package naming in this skill’s world, but from the package evidence alone it looks like a potential routing/invocation mismatch risk.

Because this audit is constrained to the skill package, I cannot prove it is broken, but it is a notable maintainability and integration smell.

### 4. The skill is robust, but somewhat brittle to future workflow changes
The package is tightly coupled to specific assumptions:

- QRSPI-generated changes
- checklist-formatted `tasks.md`
- a “Parallelization Strategy” section
- OpenSpec command behavior
- sub-agent orchestration model
- living-document conventions

That specialization is partly a strength, but it also means upstream workflow changes could invalidate important parts of the skill. The changelog already shows multiple revisions triggered by behavioral mismatches. This suggests future drift is plausible and ongoing maintenance will matter.

### 5. README and SKILL are mostly aligned, but the package remains instruction-dense rather than modular
The README usefully summarizes the skill, but the actual implementation logic remains concentrated in one large SKILL file. There are no bundled references or helper artifacts to isolate subproblems like:

- task parsing rules
- config extraction rules
- doc-update decision rubric
- failure-handling templates

For a skill of this complexity, that raises long-term editing cost and review difficulty.

---

## Trigger Clarity

**Grade: A**

Why:

- Frontmatter description clearly differentiates this skill from nearby workflows.
- README reinforces usage boundaries with concrete trigger phrases.
- The package repeatedly emphasizes “QRSPI-planned,” “existing change,” “parallel slices,” and “resume/apply/verify.”

Minor deduction:

- Triggering depends on understanding QRSPI/OpenSpec-specific terminology, so it is excellent for the intended audience but not especially forgiving outside that ecosystem.

---

## Workflow Safety

**Grade: A**

Why:

- Strong preflight validation
- Explicit refusal modes
- Mandatory verification
- Parallel conflict checks
- resume support
- context injection sanity checks
- human-in-the-loop pause points at meaningful boundaries

This is one of the package’s strongest areas.

---

## Empirical Maintainability Risks

**Grade: B**

Evidence-driven concerns:

- `SKILL.md` is 783 lines per `README.md`
- `CHANGELOG.md` shows repeated fixes for real behavior failures, including stopping early, missing document passes, and skipped verification
- High coupling to multiple external workflow assumptions
- Potential naming drift around `accelint-onboard-agent`

Counterweight:

- The changelog discipline and eval coverage reduce some of this risk by making drift visible.

---

## Instruction Quality

**Grade: A-**

Strengths:

- Clear step ordering
- Good rationale sections
- Concrete examples
- Strong “NEVER Do This” section
- Useful edge-case handling
- Good balance of orchestration intent and protective guardrails

Deductions:

- It is verbose enough that models may unevenly weight sections
- Some steps ask for sophisticated interpretation without structured support files
- The skill could benefit from decomposition into references or helper artifacts

---

## Blockers or Confidence Limits

### Confidence limits
This audit is grounded only in the skill package files listed above. I did **not** execute evals, run the skill, or inspect external OpenSpec behavior directly.

### Potential blocker to full confidence
There may be an integration mismatch around the referenced helper skill name:

- `accelint-onboard-agent` in this package
- possibly `accelint-onboard-agents` in the broader repo ecosystem

I cannot fully validate that from the package alone, so I am treating it as a risk, not a confirmed defect.

### Additional confidence limit
The package’s quality claims about improved behavior are supported by changelog and eval intent, but not by stored run results in the audited files.

---

## Bottom Line

`accelint-qrspi-apply` is a high-quality, safety-conscious orchestration skill with strong trigger discipline and unusually thoughtful handling of real agent failure modes. Its main weaknesses are not conceptual; they are operational and maintainability-oriented: the file is long, the workflow is dense, and some critical behaviors still rely on prose interpretation rather than structured support. If kept actively maintained, it is a strong package. If left to drift, its size and coupling make it more fragile than simpler skills.

**Final grade: A-**
