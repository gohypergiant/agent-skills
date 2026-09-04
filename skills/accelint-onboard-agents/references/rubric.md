# Rubric for Evaluating `AGENTS.md` Files with the `accelint-onboard-agents` Skill

Use this rubric to evaluate the quality of an `AGENTS.md` file as a behavior guide for coding agents.

This is a review heuristic, not a validated measurement instrument. It is meant to make evaluation more consistent, more explicit, and easier to compare across projects.

## What this rubric assumes

A strong `AGENTS.md` file should help an agent behave well inside a specific project. In most projects, that means the file should:

- define how the agent should communicate and work,
- reduce avoidable decision-making cost,
- separate durable behavior guidance from ordinary project documentation,
- state approval boundaries and safety constraints clearly,
- stay grounded in repository evidence,
- remain easy to scan and maintain,
- and avoid treating advisory prose as technical enforcement.


## How to use this rubric

### Step 1: Confirm the review artifact
Review:
- the `AGENTS.md` file,
- any nearby agent-instruction wrappers such as `CLAUDE.md` if present,
- and any linked project documents only when needed to verify scope, facts, or references.

Done when: the review artifact is explicit.

### Step 2: Gather the right evidence
Requires: Step 1 is complete.

Use the smallest evidence set that supports a fair review.

Done when: the evidence is sufficient to score the categories without guessing.

### Step 3: Score each category
Requires: Step 2 is complete.

For each category:
1. assign a raw score on a **0-5 scale**, then
2. multiply that score by the category weight.

Use this **0-5 scale**:

- **0** = absent or actively harmful
- **1** = seriously deficient
- **2** = weak
- **3** = adequate
- **4** = strong
- **5** = excellent

Done when: all categories have a raw score and a weighted score.

### Step 4: Add the review notes
Requires: Step 3 is complete.

Record:
- the biggest strengths,
- the highest-risk weaknesses,
- and any uncertainty about the score.

Done when: another reviewer could understand why you gave the score.

### Step 5: Add the non-scored effectiveness check
Requires: Step 4 is complete.

Add a short note that answers these questions:

- What concrete failure, ambiguity, or coordination problem is this file or skill trying to prevent?
- Would it likely change agent behavior in a real project?
- What evidence supports that conclusion?
- Which parts appear strong in practice, and which parts only sound strong on paper?

Done when: the review includes both the scored assessment and the non-scored effectiveness check.

## Suggested overall rating bands

Use these bands after completing Step 5:

- **90-100**: Excellent; highly effective, well-scoped, and low-drift
- **75-89**: Good; strong overall, with bounded weaknesses
- **60-74**: Mixed; useful, but inconsistent or under-constrained
- **40-59**: Weak; likely to cause drift, ambiguity, or poor outputs
- **0-39**: Poor; low trust, low usability, or fundamentally mis-scoped

---

## 1. Purpose alignment and scope discipline
**Weight: 22%**

### What this measures
Whether the `AGENTS.md` file stays focused on agent behavior guidance instead of turning into a general project handbook.

### Why it matters
`AGENTS.md` is most effective when it defines how an agent should work: communication style, workflow rules, approval boundaries, validation expectations, guardrails, and decision heuristics. It gets weaker when it absorbs architecture docs, product specs, onboarding manuals, or other material that belongs elsewhere.

### Weak
- Treats `AGENTS.md` as a general repository handbook.
- Mixes behavior guidance with large amounts of stack facts, architecture facts, or domain reference material.
- Fails to separate agent behavior rules from ordinary project documentation.
- Pulls in broad content that should be linked or referenced instead of duplicated.

### Adequate
- Keeps the file mostly behavior-focused.
- Shows boundary control, but still allows recurring scope leakage.
- Uses references inconsistently or keeps too much adjacent documentation inline.

### Strong
- Centers agent behavior, workflow, communication, and guardrails clearly.
- Keeps project facts concise and includes them only when they materially shape agent behavior.
- Uses links or references for adjacent documentation instead of duplicating it.
- Makes it easy to tell what belongs in `AGENTS.md` and what belongs elsewhere.

### Indicators to look for
- Explicit statements about the file’s purpose.
- Clear separation between behavior rules and general project docs.
- Limited duplication of architecture, product, or setup content.
- Example outputs that stay behavior-focused.

---

## 2. Clarity and structural discipline
**Weight: 14%**

### What this measures
Whether the file produces guidance that is easy to scan, internally coherent, and structurally disciplined.

### Why it matters
Agents and humans both need to find the right instruction quickly. Duplicate sections, bloated prose, buried rules, and inconsistent headings reduce practical usefulness.

### Weak
- Hard to scan or follow.
- Uses inconsistent sections or unclear hierarchy.
- Repeats the same rule in multiple places without reason.
- Buries important instructions in long paragraphs.

### Adequate
- Uses a recognizable structure.
- Is readable, but still shows duplication, drift, or local bloat.
- Gives a reasonable output shape without preventing structural sprawl.

### Strong
- Uses a clear, stable structure.
- Makes section responsibilities easy to understand.
- Keeps important rules visible and easy to review.
- Produces compact, dense guidance with little duplication.

### Indicators to look for
- Consistent headings and section roles.
- Minimal overlap between sections.
- Short scan paths to high-value rules.
- Example outputs with coherent structure.

---

## 3. Actionability and decision reduction
**Weight: 18%**

### What this measures
Whether the guidance gives concrete directions that reduce costly ambiguity for the agent.

### Why it matters
Good agent guidance reduces avoidable judgment calls. It makes preferred commands, file locations, validation steps, approval boundaries, and completion standards explicit.

### Weak
- Uses vague advice such as “write good code” or “be careful.”
- Leaves major decisions to the agent without a clear reason.
- States rules without actionable next steps, conditions, or examples.
- Relies on tone or persona language instead of operational guidance.

### Adequate
- Includes concrete directions.
- Reduces ambiguity in some areas, but important decisions are still underspecified.
- Mixes useful instructions with generic aspirations.

### Strong
- Gives explicit, reviewable instructions.
- Names exact commands, paths, workflows, or stop-and-ask boundaries when they matter.
- Defines what done looks like in practical terms.
- Uses examples only when they materially reduce ambiguity.

### Indicators to look for
- Concrete validation instructions.
- Explicit approval boundaries.
- Named file locations or workflow expectations when relevant.
- Low reliance on abstract “best practice” wording.

---

## 4. Grounding, evidence use, and repository discovery
**Weight: 16%**

### What this measures
Whether the guidance is grounded in real repository evidence and whether it tells the agent how to learn enough before acting.

### Why it matters
An agent should not invent project rules. Strong guidance either encodes verified conventions or tells the agent what to inspect before making decisions.

### Weak
- Encourages confident action without enough repository discovery.
- Makes unsupported claims about project structure or workflow.
- Gives brittle specifics with no evidence path.
- Omits fallback behavior when information is missing.

### Adequate
- Encourages file reading or repo inspection.
- Is grounded overall, but discovery steps or uncertainty handling are incomplete.
- Makes reasonable inferences, though not always transparently.

### Strong
- Requires the agent to inspect the relevant files before acting.
- Distinguishes facts, inferences, and unknowns clearly.
- Uses narrow assumptions and honest uncertainty when evidence is incomplete.
- Helps the agent discover the right local conventions instead of guessing.

### Indicators to look for
- Explicit discovery steps.
- Honest handling of missing information.
- Limited unsupported specificity.
- Output that feels repository-aware rather than invented.

---

## 5. Operational safety and enforcement fit
**Weight: 14%**

### What this measures
Whether the file handles safety, approvals, and mandatory controls at the right level.

### Why it matters
A guidance file can shape behavior, but it cannot enforce everything. Strong `AGENTS.md` guidance makes approval boundaries and safety expectations clear without pretending prose alone is a hard control system.

### Weak
- Claims or implies that advisory instructions guarantee compliance.
- Confuses guidance with enforcement.
- Omits approval gates for risky actions.
- Fails to address sensitive areas such as secrets, destructive changes, or external publication.

### Adequate
- Includes cautionary boundaries.
- Distinguishes guidance from enforcement in some places, but not consistently.
- Mentions approvals or checks, though the control model is not always clear.

### Strong
- States high-impact approval and safety boundaries clearly.
- Separates “do this” guidance from controls that must be enforced elsewhere.
- Reflects environment limits accurately.
- Avoids false-confidence wording about what the file can guarantee.

### Indicators to look for
- Ask-first boundaries for risky actions.
- Clear treatment of secrets and destructive changes.
- No overclaiming about enforcement.
- Realistic wording about tool, sandbox, or workflow limits when relevant.

---

## 6. Output effectiveness and observed results
**Weight: 8%**

### What this measures
Whether the guidance works in practice.

### Why it matters
A well-written skill or template is not enough if the resulting `AGENTS.md` files are bloated, confusing, mis-scoped, or inconsistent.

Score whether the file itself appears behaviorally useful, practical, and likely to improve agent performance in the real project.

### Weak
- The output is bloated, contradictory, generic, or hard to use.
- The file does not clearly improve agent behavior.

### Adequate
- The output is useful overall, but uneven.
- It solves concrete problems while leaving recurring clarity or scope issues.

### Strong
- The output is clearly useful in practice.
- It supports better agent behavior without obvious drift or clutter.

### Indicators to look for
- Concrete, usable outputs.
- Low contradiction and low duplication.
- Clear signs the file would change agent behavior in a meaningful way.

---

## 7. Maintainability and governance
**Weight: 8%**

### What this measures
Whether the file can stay correct as the project, tooling, and agent ecosystem change.

### Why it matters
Agent guidance tends to decay when it is too brittle, too specific, too duplicated, or too tied to short-lived tools or models.

### Weak
- Obviously stale, bloated, or contradictory.
- Overfits to one temporary setup, tool version, or provider quirk.
- Gives no clear path for update, pruning, or local override.

### Adequate
- Is likely maintainable, but some stale-risk is visible.
- Shows boundary control, but long-term governance is mostly implicit.
- Contains a manageable amount of brittle or time-bound detail.

### Strong
- Is written in a way that supports incremental updates.
- Uses durable guidance where possible and localizes narrow exceptions.
- Makes it easier to prune, split, or relocate stale content later.
- Keeps ownership and scope boundaries clear enough to reduce drift.

### Indicators to look for
- Limited dependence on transient tooling details.
- Clear separation of shared rules from local exceptions.
- Low duplication.
- Guidance that can be updated without rewriting the whole file.

---

## Suggested scoring worksheet

| Category | Weight | Score (0-5) | Weighted Score |
|---|---:|---:|---:|
| 1. Purpose alignment and scope discipline | 22 |  |  |
| 2. Clarity and structural discipline | 14 |  |  |
| 3. Actionability and decision reduction | 18 |  |  |
| 4. Grounding, evidence use, and repository discovery | 16 |  |  |
| 5. Operational safety and enforcement fit | 14 |  |  |
| 6. Output effectiveness and observed results | 8 |  |  |
| 7. Maintainability and governance | 8 |  |  |
| **Total** | **100** |  |  |

## Reviewer calibration notes

Use these notes to keep scoring consistent:

- Score against the review target’s actual job, not against an imaginary universal template.
- Reward files that improve real agent behavior, not just files that sound polished.
- Penalize duplication, drift risk, unsupported specificity, and weak scope boundaries.
- Do not give extra credit for persona framing unless it clearly improves behavior.
- Reward brevity only when the file still covers the important behavior rules.
- Do not reward mention of approvals, evidence, safety, or workflow unless those are handled concretely and correctly.
- If one flaw affects multiple categories, avoid double-counting without analysis. Note the distinct harm in each category you score down.
- When evidence is incomplete, note the uncertainty instead of pretending the score is exact.

## What strong results should look like

A strong `AGENTS.md` file should:

- keep the focus on agent behavior,
- make important decisions easier and safer,
- stay grounded in project evidence,
- state approval boundaries clearly,
- avoid pretending prose is enforcement,
- remain easy to scan,
- reduce duplication and drift,
- and stay maintainable as the project evolves.

That is the standard this rubric is meant to measure.
