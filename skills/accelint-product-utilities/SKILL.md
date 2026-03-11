---
name: product-utilities
description: Use when users say "create persona", "map user journey", "build mermaid diagram", "trade-off document", "decision doc", "generate AC", "acceptance criteria", or when working through product workflows from research to development-ready requirements. Generates five sequential artifacts (persona, journey, diagram, trade-off doc, AC) grounded in user research.
license: Apache-2.0
metadata:
  author: gohypergiant
  version: "1.1"
---

# Product Utilities

Generates structured product artifacts in a research-to-development workflow: persona → user journey → mermaid diagram → trade-off document → acceptance criteria.

## NEVER Do Product Artifacts

- **NEVER create personas without evidence** - Over-fictionalization destroys credibility. Explicitly mark inferred details as assumptions, ground everything else in research observations.
- **NEVER idealize user journeys** - Realistic flows reveal friction. Documenting where users struggle is more valuable than showing perfect happy paths.
- **NEVER collapse multiple options in trade-off docs** - The document exists to show alternatives, not advocate for one solution. Present 2-4 viable options with honest pros/cons.
- **NEVER write AC before finalizing the decision** - Acceptance criteria encode implementation. Creating them before trade-off evaluation leads to premature solutions and lost rationale.
- **NEVER invent mermaid steps absent from the journey** - The diagram visualizes existing journey structure. Adding invented nodes creates divergence between artifacts.
- **NEVER skip decision rationale in trade-off docs** - "Selected Option X" without reasoning fails to inform future decisions or AC derivation. Explain why X beats Y and Z.
- **NEVER write AC that can't trace back to decisions** - Every requirement should map to a choice in the trade-off document. Orphaned AC suggests scope creep or missing decision analysis.

## Before Creating Artifacts, Ask

Apply these frameworks to ensure artifacts are grounded and useful:

### Evidence Grounding
- **What research backs this claim?** Personas and journeys should cite sources. If inferring, mark it explicitly.
- **Where does the user actually struggle?** Pain points drive product decisions. Surface them prominently in personas and journeys.

### Structural Integrity
- **Do artifacts reference each other?** Persona feeds journey, journey feeds diagram, decisions trace through to AC. Ensure the chain is intact.
- **Are decision points explicit?** Trade-off docs exist to surface choices. If you're not showing 2-4 options with trade-offs, the artifact has no value.

### Implementation Readiness
- **Can a developer test this AC?** Acceptance criteria should be specific and verifiable, not aspirational or vague.
- **Does the AC reflect the chosen option, not all options?** Don't carry forward rejected alternatives into requirements.

## How to Use

Follow the 5-phase workflow below. Each phase has MANDATORY template loading at the start and produces one artifact that feeds the next. Validate traceability chain after completion.

## Artifact Generation Workflow

Generate five artifacts sequentially, each building on the previous:

**Copy this checklist to track progress:**

```
- [ ] Phase 1: Persona Artifact - structured role definition
- [ ] Phase 2: User Journey Artifact - scenario-based flow
- [ ] Phase 3: Mermaid Journey Artifact - visual diagram
- [ ] Phase 4: Trade-Off and Decision Document - option evaluation
- [ ] Phase 5: Development Acceptance Criteria - testable requirements
```

### Phase 1: Persona Artifact

**MANDATORY**: Load [`persona-template.md`](assets/templates/persona-template.md) completely before creating persona. Use this exact structure.

**Do NOT Load** other templates yet.

**Expert requirements** (distinguishes this from generic personas):
- **Evidence-ground every claim** - Each persona statement must cite research source or be marked "[INFERRED - REQUIRES VALIDATION]"
- **Surface pain points prominently** - These drive all downstream decisions. Pain points are more valuable than demographic details.
- **Distinguish what they Hear/See/Say/Do** - System touchpoints and communication patterns reveal friction points that journeys will explore.

**Marking inference correctly**:
```
❌ "Users prefer dark mode"
✅ "Users prefer dark mode [INFERRED from feature requests, not validated]"

❌ "Average age: 35"
✅ "Age: 30-40 (based on 12 interview participants)"
```

### Phase 2: User Journey Artifact

**MANDATORY**: Load [`journey-template.md`](assets/templates/journey-template.md) completely before creating journey.

**Do NOT Load** mermaid, tradeoff, or AC templates yet.

**Expert requirements** (anti-idealization focus):
- **Document friction as primary value** - Perfect happy paths are useless. Show where users get stuck, make mistakes, or experience ambiguity.
- **Explicit decision points at every branch** - Every "if/then" in the flow needs: decision criteria + information available + what happens if wrong choice is made.
- **Link pain points to persona** - Journey friction must trace back to "Pain Points" in Phase 1 persona. This validates the persona.
- **Evidence citations at each stage** - "Stage 3 based on observation #7" not "users probably do this."

Journey must be structured enough to convert to diagram - every stage becomes a node, every decision becomes a diamond.

### Phase 3: Mermaid Journey Artifact

**MANDATORY**: Load [`mermaid-template.md`](assets/templates/mermaid-template.md) for syntax structure and validation checklist.

**Do NOT Load** tradeoff or AC templates yet.

**Expert requirements** (faithfulness to journey):
- **ZERO invented steps** - Every node in diagram must exist in Phase 2 journey. Diagram divergence from journey = failed artifact.
- **Validate syntax before delivery** - Use mermaid.live or similar to confirm diagram renders. Common error: missing `graph TD` or `graph LR` direction declaration.
- **Decision nodes (diamonds) are mandatory** - Every "Decision Point" from Phase 2 must be represented as `{Decision?}` with explicit branches.
- **Style pain points visually** - Use `style PainPoint1 fill:#ffcccc` to highlight friction from journey.

Validation: Load journey artifact and diagram side-by-side. Every journey stage must map to a diagram node. Every decision must map to a diamond.

### Phase 4: Trade-Off and Decision Document

**MANDATORY**: Load [`tradeoff-template.md`](assets/templates/tradeoff-template.md) for complete decision structure.

**Do NOT Load** AC template yet.

**Expert requirements** (showing alternatives, not advocacy):
- **Present 2-4 viable options** - Single option = not a trade-off doc, just a proposal. If you've converged to one answer, you skipped analysis.
- **Honest trade-offs for each** - Every option optimizes something and sacrifices something. "Option A: all pros, no cons" = you're not thinking hard enough.
- **Rationale must explain rejections** - "Selected Option B" is incomplete. Must say "Selected B over A because [friction X], and over C because [constraint Y]."
- **Decision can be left blank** - Valid to present options without choosing. Lets stakeholder decide. Mark clearly: "Decision: TBD - stakeholder input required."

**Core framing structure**: User Need → Challenge/Friction → Options (2-4) → Trade-Offs → Decision → Rationale

**Common trade-off categories**: Speed vs clarity, visibility vs clutter, automation vs control, consistency vs flexibility, information density vs cognitive load, confidence vs efficiency.

Link every option to persona pain points from Phase 1 and journey friction from Phase 2.

### Phase 5: Development Acceptance Criteria Output

**MANDATORY**: Load [`ac-template.md`](assets/templates/ac-template.md) for openspec format structure.

**Expert requirements** (strict traceability + openspec format):
- **Every AC must trace to decision doc** - Use traceability table: `AC 1 → Decision Doc Section X → Journey Stage Y → Persona Pain Point Z`. Orphaned AC = scope creep.
- **Encode chosen option ONLY** - If Phase 4 selected Option B, AC reflects B's implementation. Rejected Options A and C go in "Non-goals" section with reason why excluded.
- **Openspec structure**: Functional AC (Given/When/Then), Interaction AC (UI behavior), State-based AC (state transitions), Edge cases (boundary conditions).
- **Testable and verifiable** - "User is satisfied" is not testable. "User can complete checkout in <3 clicks" is testable.

**Before finalizing AC, validate traceability**:
```
- [ ] Every AC references a decision doc section
- [ ] Chosen option is encoded, rejected options are not
- [ ] No "orphaned" requirements lacking decision justification
- [ ] Persona pain points from Phase 1 are addressed in AC
```

**Cannot proceed if**: Phase 4 decision is blank (TBD). Must have chosen option before encoding AC.

## Common Scenarios and Fallbacks

**Scenario: Limited or no research available**
- Mark entire persona as "[HYPOTHESIS - REQUIRES VALIDATION]" at the top
- Focus "Pain Points" on observable proxy signals: support tickets, feature requests, usage analytics, competitor reviews
- Explicitly list assumptions and recommended validation research
- Alert user: "This persona is hypothesis-based. Validation research strongly recommended before major decisions."

**Scenario: Decision document left blank (no decision made)**
- This is VALID for trade-off docs when presenting options for stakeholder choice
- Phase 5 (AC) cannot proceed without a decision
- When reaching Phase 5 with blank decision, ask user: "Trade-offs presented in Phase 4. Which option should we implement? (Options: A, B, C, or request more analysis)"
- Do not invent a decision or default to "Option A"

**Scenario: Mermaid syntax errors or rendering failures**
- Validate at mermaid.live before delivering diagram
- Common errors:
  - Missing direction: Use `graph TD` (top-down) or `graph LR` (left-right)
  - Unescaped special chars in labels: Wrap in quotes `["Label with (parens)"]`
  - Invalid node connections: Every `-->` must connect existing node IDs
- If complex branching causes issues, simplify to 2-3 main paths, note detailed branches in journey artifact

**Scenario: AC traceability breaks (orphaned requirements)**
- Every AC should reference a decision doc section. If AC seems orphaned, ask:
  - "Does this requirement come from [Decision X] or is this new scope?"
  - "Which option from Phase 4 does this support?"
- New scope = needs new decision analysis (return to Phase 4), don't add to existing AC
- If requirement is necessary but not in decision doc, that's a gap: add to trade-off doc, then encode in AC

**Scenario: Persona and journey contradict each other**
- Journey reveals pain points not in persona → Update persona Phase 1, add to "Pain Points"
- Persona has pain points not in journey → Journey is incomplete, add stage showing friction
- Artifacts must stay synchronized. Journey is the "proof" that persona pain points are real.

**Scenario: Stakeholder rejects chosen option after AC is written**
- Don't try to "adapt" existing AC to different option. Options have fundamentally different implementations.
- Return to Phase 4, select new option, document new rationale
- Regenerate Phase 5 AC from scratch based on newly chosen option
- Move rejected AC to "Non-goals" section with note: "Previously considered Option X, rejected in favor of Option Y because [reason]"

## Freedom Calibration

Calibrate guidance specificity to artifact type:

| Artifact Type | Freedom Level | Guidance Format | Notes |
|---------------|---------------|-----------------|-------|
| **Persona** | Medium freedom | Structured template with creative evidence-based content | Balance structure with authentic research voice |
| **Journey** | Medium freedom | Structured outline with realistic flow details | Flexibility in representing complexity, rigidity in avoiding idealization |
| **Mermaid** | Low freedom | Exact syntax requirements, faithful to journey | No invented nodes, syntactic correctness required |
| **Trade-Off Doc** | Medium-high freedom | Structured framework with deep analytical content | Option generation is creative, but structure and honesty are rigid |
| **AC** | Medium-low freedom | Structured format, testable requirements, strict traceability | Must derive from decisions, must be verifiable |

**The test:** "If this artifact is wrong, what's the consequence?"
- Persona: Misguided product decisions based on fictional users
- Journey: Missing real friction, solving wrong problems
- Mermaid: Divergence between documentation and actual flow
- Trade-Off: Premature convergence, lost alternatives, missing rationale
- AC: Building the wrong thing, scope creep, lost context

## Important Notes

- **Traceability is non-negotiable** - Each artifact must reference the previous. Broken chains suggest missing analysis.
- **"User need" is not "user want"** - Focus on underlying goals and constraints, not feature requests.
- **Trade-off docs can leave decisions blank** - It's valid to present options without selecting one, letting stakeholders decide.
- **AC for openspec requires specific structure** - Openspec format has conventions for functional, interaction, and state-based criteria.
- **Evidence gaps should be explicit** - Mark assumptions and inferences clearly. Better to acknowledge unknowns than to fabricate certainty.
