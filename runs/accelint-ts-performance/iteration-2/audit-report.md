# Audit Report: accelint-ts-performance

## Scope

Audited exactly this skill package:

`/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-performance`

Reviewed material package files present in the repo:
- `SKILL.md`
- `AGENTS.md`
- `README.md`
- `CHANGELOG.md`
- `assets/output-report-template.md`
- `evals/evals.json`
- `references/quick-reference.md`
- spot-checked representative references:
  - `references/reduce-looping.md`
  - `references/memoization.md`
  - `references/defer-await.md`
  - `references/performance-misc.md`

No files were edited. No evals were executed.

---

## Overall Grade

**Grade: B+**

### Rationale
This is a strong, usable skill package with clear scope, good progressive-disclosure structure, a substantial eval set, and solid repository hygiene. Its best qualities are:
- sharply defined performance-only trigger boundary
- explicit audit vs implementation modes
- good reference taxonomy by optimization category
- practical report template for audit mode
- broad eval coverage including boundary/near-miss cases

It falls short of an A mainly because some instructions are internally tense with each other, a few examples/references look mechanically correct but not fully performance-safe or polished, and the package shows stronger static structure than executed proof. In other words: the package is well-designed, but the evidence that it reliably produces the intended behavior is mostly repository-level, not run-level.

---

## Static Repository Evidence

### Strengths

#### 1. Strong trigger definition and scope control
Evidence:
- `SKILL.md` frontmatter description is specific to runtime performance, hot paths, throughput, profiling follow-up, and performance-category classification.
- It explicitly excludes non-performance work such as type safety, JSDoc, and general maintainability reviews.
- `evals/evals.json` includes negative/near-miss coverage for:
  - type-safety review (`id: 23`)
  - JSDoc/comment cleanup (`id: 24`)

Why this matters:
- This reduces trigger drift into adjacent TypeScript skills.
- The evals reinforce the boundary rather than only stating it in prose.

#### 2. Good workflow architecture
Evidence:
- `SKILL.md` defines a coherent 4-phase model: Profile → Analyze → Optimize → Verify.
- It clearly distinguishes:
  - **Audit Mode** for report-first review
  - **Implementation Mode** for direct fixes
- Progressive disclosure is deliberate:
  - `SKILL.md` for workflow
  - `AGENTS.md` for compressed rule summaries
  - `references/` for category-specific deep dives

Why this matters:
- The package is structured to minimize context bloat while still supporting deep execution.
- The split between workflow and reference material is disciplined.

#### 3. Useful supporting assets and references
Evidence:
- `assets/output-report-template.md` gives a concrete audit format with:
  - issue grouping rules
  - required fields
  - expected gain ranges
  - summary table shape
- `references/quick-reference.md` provides bottleneck-to-category mapping and profiler-to-category lookup.
- Category reference coverage is broad and well-organized across algorithmic, caching, I/O, memory, locality, safety, and micro-opt topics.

Why this matters:
- The skill does not rely only on high-level advice; it gives the model reusable scaffolding for output quality and pattern selection.

#### 4. Eval coverage is materially better than average
Evidence:
- `evals/evals.json` contains **24 cases**.
- Coverage spans:
  - direct audit-mode behavior
  - implementation-mode behavior
  - profiling-backed prioritization
  - static-review hypothesis framing
  - algorithmic, caching, I/O, allocation, locality, safety, micro-opt categories
  - verification expectations
  - environment portability caution
  - trigger-boundary negatives

Why this matters:
- The eval set tests both behavior and scope.
- It is not just keyword-based; many cases are realistic and discriminating.

#### 5. Versioning and changelog alignment are good
Evidence:
- `SKILL.md` metadata version is `1.1.1`.
- `CHANGELOG.md` contains `## [1.1.1]`.
- Changelog entries match the current package emphasis: evals, trigger tightening, progressive-disclosure clarification, and prose cleanup.

Why this matters:
- The package appears maintained with repo conventions in mind.

---

## Most Important Weaknesses

### 1. Some instruction tension around “audit everything” vs evidence-based prioritization
Evidence:
- `SKILL.md` repeatedly says to audit all code and all anti-patterns regardless of current usage context.
- The same file also says to prefer profiler-backed hotspots and label static findings as hypotheses.
- `assets/output-report-template.md` includes a warning block that says “assume hot path” when in doubt.
- `evals/evals.json` case `id: 22` expects calibrated handling for cold-path code.

Why this matters for optimization:
- This is the single biggest quality risk in the package.
- A model could over-audit cold code, overstate urgency, or produce broader-than-needed findings while still feeling compliant with the skill.
- The package partially compensates for this with the cold-path eval, but the prose still pulls in two directions.

### 2. Static assets and references are stronger than demonstrated execution evidence
Evidence:
- `CHANGELOG.md` mentions run-state audit reports under `runs/accelint-ts-performance/`, but this audit did not inspect or validate those artifacts.
- The package includes `evals/evals.json`, but there is no executed result in this audit showing pass rates, failure clusters, or observed trigger behavior.
- No benchmark, grading output, or reviewer output was executed here.

Why this matters for optimization:
- The package is well-specified, but this Stage 1 audit can only confirm design quality, not actual performance of the skill in practice.
- That keeps the grade below A-range.

### 3. A few reference examples appear insufficiently polished for a performance-focused canonical package
Evidence:
- In `references/reduce-looping.md`, the “single pass” example uses:
  - `arr.reduce((acc, curr) => predicate(curr) ? [...acc, mapper(curr)] : acc, [])`
- That replacement removes an intermediate array from chained methods, but still allocates a new array on each successful branch because of `[...acc, ...]`.
- In a performance skill, that example is directionally right about pass count but weak as a canonical low-allocation example.
- `references/memoization.md` appears to have a formatting/content issue near the “Repeated Function Calls with Same Arguments” example; the code fence/content structure looks questionable in the captured file.

Why this matters for optimization:
- Reference files are supposed to be authoritative defaults.
- If examples are even slightly off-pattern, the skill risks teaching a weaker optimization than intended.

### 4. README quality is solid but lighter than the core package sophistication
Evidence:
- `README.md` is accurate and useful, but mostly summarizes structure and categories.
- It does not surface known tradeoffs or subtle behavior tensions as clearly as `SKILL.md` does.

Why this matters for optimization:
- Not a blocking issue, but for a mature skill package, the README could better mirror the nuanced operating model already present in the skill itself.

---

## Executed / Observable Evidence

### What was executed
- Read and inspected the package files listed in Scope.
- Verified package structure and presence of:
  - `assets/`
  - `evals/`
  - `references/`
- Verified version alignment between:
  - `SKILL.md`
  - `CHANGELOG.md`
- Checked approximate file size discipline:
  - `SKILL.md`: 294 lines
  - `AGENTS.md`: 171 lines

### What was not executed
- No eval prompts were run.
- No benchmark or grading pipeline was run.
- No viewer or review workflow was run.
- No trigger-optimization loop was run.
- No qualitative output review was performed against actual model runs.

### Explicit statement
**No evals were executed in this audit.**  
All conclusions are based on static repository evidence plus direct file inspection, not observed skill-run performance.

---

## Concise Grade Justification

### Why it earns a B+
- Clear and disciplined skill scope
- Strong workflow structure
- Good progressive-disclosure design
- Good audit-mode reporting asset
- Broad and thoughtful eval coverage
- Version/changelog hygiene is in good shape

### Why it does not earn an A
- Some internal guidance tension could cause overreach in practice
- At least a few reference examples need closer performance-authority scrutiny
- The package currently shows more design maturity than executed validation evidence in this audit

---

## Priority Weaknesses to Watch in Optimization
1. **Resolve the hot-path-vs-audit-everything tension**
2. **Tighten canonical examples in references so “correct pattern” is truly performance-safe**
3. **Back static quality with observed eval evidence before making stronger claims**

---

Work complete. Ready for review.
