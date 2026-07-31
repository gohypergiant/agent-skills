# Audit Report — `accelint-archive-synthesis`

**Skill package:** `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis`  
**Audit scope:** Stage 1 static audit only; no file changes made  
**Method:** Followed `skill-creator` instructions in `/Users/brandon.pierce/.agents/skills/skill-creator/SKILL.md` and audited the package for trigger quality, frontmatter, structure, workflow clarity, guardrails, progressive disclosure, version/changelog alignment, and eval presence/coverage.

## Overall Grade

**B+**

Strong package with unusually good guardrails, explicit human-review gating, and solid eval presence. The main weaknesses are instruction sprawl in `SKILL.md`, a few internal naming/wording inconsistencies, and limited quantitative eval metadata/assertion scaffolding relative to what `skill-creator` recommends for iterative benchmarking.

## What’s Working Well

### 1) Frontmatter is strong and mostly production-ready
**Static evidence**
- `SKILL.md:1-8` includes required `name` and `description`, plus `license`, `compatibility`, and `metadata.version`.
- Description is specific, “pushy” enough to help triggering, and clearly excludes adjacent workflows:
  - `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/SKILL.md`
- Version is present in frontmatter: `metadata.version: "1.1.2"`.

**Assessment**
- Good trigger framing.
- Good boundary language against propose/apply/archive/single-change verification.
- Compatibility is unusually informative.

### 2) Trigger quality is a major strength
**Static evidence**
- `SKILL.md` frontmatter description explicitly names:
  - archive synthesis
  - contradictory/stale archived decisions
  - `openspec/specs/INDEX.md` drift
  - capability over-coupling
  - accelint-qrspi-archive suggestion + explicit human approval
- It also states when **not** to use the skill.

**Assessment**
- This should route well for the intended niche.
- The description distinguishes this skill from adjacent OpenSpec skills better than average.
- README trigger examples reinforce the same usage patterns:
  - `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/README.md`

### 3) Workflow clarity and guardrails are excellent
**Static evidence**
- `SKILL.md` includes:
  - `## Interaction Contract`
  - `## Degraded-Mode Rules`
  - `## Workflow Overview`
  - `## Implementation Steps`
  - `## Final Summary Template`
  - `## Explicitly Out of Scope`
  - `## Error Handling`
  - `## NEVER Do This`
- Human stop points are explicit:
  - “The first mandatory stop is Step 7”
  - confirmation gating before any write
- Narrow write permissions are clearly constrained:
  - `archive/INDEX.md`: Status only
  - `specs/INDEX.md`: single-row patch/removal only
  - `SYNTHESIS-LOG.md`: append-only

**Assessment**
- Very good safety posture.
- Clear separation between detection, human confirmation, and routing.
- Strong “principle of lack of surprise” alignment with `skill-creator`.

### 4) Evals exist and cover the main behavior classes
**Static evidence**
- `evals/evals.json` exists:
  - `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/evals/evals.json`
- Contains **12** scenarios covering:
  - explicit invocation vs auto-run refusal
  - decision drift
  - reconciliation mismatches
  - missing spec file
  - structural coupling
  - low-corpus handling
  - missing `findings:` support
  - no subagent support
  - partial confirmation / deferred findings

**Assessment**
- Good breadth for a default eval set.
- Coverage matches the skill’s risk areas well.
- Presence of evals is a clear positive versus many skill packages.

### 5) Version/changelog alignment is currently correct
**Static evidence**
- `SKILL.md` frontmatter version: `1.1.2`
- `README.md` version section: `1.1.2 (2026-07-30)`
- `CHANGELOG.md` top entry: `## [1.1.2] - 2026-07-30`

**Assessment**
- Current version alignment looks good across core package files.

## Main Issues / Improvement Opportunities

### 1) `SKILL.md` is at the progressive-disclosure ceiling and likely too dense
**Static evidence**
- Directly observed line count: `614` lines in
  `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/SKILL.md`
- README also advertises “complete agent execution instructions (614 lines)”.

**Assessment**
- `skill-creator` says `SKILL.md` should ideally stay under ~500 lines and suggests pushing detail into bundled resources when it grows large.
- This file is still usable, but it is dense enough to risk:
  - scan fatigue
  - duplicated concepts
  - weaker progressive disclosure
  - more chances for internal drift

**Why it matters**
- This skill is safety-sensitive and procedural; density increases the chance the executing model misses a nuance or overfocuses on examples.

### 2) Some internal naming inconsistencies weaken precision
**Static evidence**
- Available skill in repo context is `accelint-onboard-agents`, but `SKILL.md` routes to `accelint-onboard-agent` in Step 8:
  - `SKILL.md:302`
- Compatibility line uses `shared findings - interface` with a spaced hyphen rather than the normal ``findings:`` phrasing:
  - `SKILL.md:5`
- Repeated awkward references:
  - `Step 3 Step 3`
  - `Step 3 Step 2`
  seen in Error Handling / Terminology sections.

**Assessment**
- These are small but important quality issues in a routing-heavy skill.
- The `accelint-onboard-agent` vs `accelint-onboard-agents` mismatch is the most important one because it affects downstream handoff clarity.

### 3) Structure is strong conceptually, but there is still some duplication
**Static evidence**
- Similar rules appear in multiple sections:
  - `Interaction Contract`
  - `Degraded-Mode Rules`
  - `Explicitly Out of Scope`
  - `Error Handling`
  - `NEVER Do This`
- Same ideas recur around:
  - no auto-run
  - human confirmation before writes
  - dismissed vs deferred behavior
  - reconciliation write limits

**Assessment**
- Repetition improves safety, but here it sometimes crosses into instruction sprawl.
- A future refactor could preserve behavior while reducing repeated prose and cross-reference friction.

### 4) Eval presence is good, but eval format is still lightweight versus `skill-creator`’s full loop
**Static evidence**
- `evals/evals.json` contains `id`, `prompt`, `expected_output`, and `files`.
- It does **not** include assertions or richer grading metadata in the file as currently stored.

**Assessment**
- For Stage 1 quality, eval existence is a clear positive.
- But compared with `skill-creator`’s benchmark-oriented workflow, coverage is currently more scenario-definition than assertion-backed evaluation.
- This makes the package better prepared for qualitative review than repeatable quantitative grading.

### 5) Directly observed repo evidence for writer-skill dependency is mixed
**Directly observed repo evidence**
- Present in available skills list:
  - `accelint-architecture-doc`
  - `accelint-onboard-openspec`
  - `accelint-readme-writer`
  - `accelint-onboard-agents`
- Not observed under the singular name used in this skill:
  - `accelint-onboard-agent`

**Assessment**
- Static package text assumes a routing target name that does not match the directly observed available skill naming in this repo/session context.

## Category Scores

| Category | Grade | Notes |
|---|---:|---|
| Frontmatter | A- | Complete, specific, and versioned |
| Trigger quality | A | Strong scope definition and exclusions |
| Structure | B | Well-organized, but too long and somewhat repetitive |
| Workflow clarity | A- | Clear step order and human gates |
| Guardrails | A | Excellent write boundaries and safety rules |
| Progressive disclosure | C+ | Valuable content, but overloaded into one long SKILL.md |
| Version/changelog alignment | A | Aligned across SKILL.md, README.md, CHANGELOG.md |
| Eval presence/coverage | B+ | Good breadth, but lightweight assertion scaffolding |

## Static Audit Evidence

- `/Users/brandon.pierce/.agents/skills/skill-creator/SKILL.md`
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/SKILL.md`
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/README.md`
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/CHANGELOG.md`
- `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis/evals/evals.json`

## Directly Observed Repo Evidence

- Skill package file inventory observed under:
  `/Users/brandon.pierce/Projects/agent-skills/.agents/skills/accelint-archive-synthesis`
  - `SKILL.md`
  - `README.md`
  - `CHANGELOG.md`
  - `evals/evals.json`
- Direct line-count observation:
  - `SKILL.md` = `614` lines
- Directly observed available-skill naming in current repo/session context includes `accelint-onboard-agents`, not `accelint-onboard-agent`.

## Recommended Next Fixes

1. Split `SKILL.md` support material into bundled references while keeping the execution path concise.
2. Fix internal naming inconsistencies, especially `accelint-onboard-agent` vs `accelint-onboard-agents`.
3. Normalize wording around the `findings:` interface and remove malformed cross-references like `Step 3 Step 3`.
4. Add assertion-ready eval metadata so the package is easier to benchmark through the full `skill-creator` loop.
5. Reduce duplicated policy prose by making one section canonical and shortening the repeats.

## Bottom Line

This is a high-quality, safety-conscious skill package with strong triggers, strong guardrails, and meaningful eval coverage. Its biggest liabilities are not conceptual gaps but packaging quality issues: excessive SKILL length, some duplication, and a few naming/reference inconsistencies that reduce polish and could affect routing accuracy.

**Overall letter grade: B+**
