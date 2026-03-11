# Product Utilities — Quick Reference

Sequential artifact generation from research to development-ready requirements.

## Workflow Overview

Each phase has MANDATORY template loading before starting:

1. **Persona** — evidence-grounded role definition, mark all inferences as "[INFERRED - REQUIRES VALIDATION]"
2. **Journey** — anti-idealized flow, friction is the value, link to persona pain points
3. **Mermaid** — faithful visualization, zero invented steps, validate at mermaid.live
4. **Trade-Off** — 2-4 options with honest trade-offs, rationale explains why chosen over others
5. **AC** — strict traceability to decisions, openspec format, testable requirements only

## Key Rules

- **Evidence-ground everything** — Mark inferences explicitly, cite research sources
- **Anti-idealization** — Document where users struggle, not perfect paths
- **Show 2-4 alternatives** — Single option = not a trade-off doc, just a proposal
- **Strict traceability** — Every AC traces: Decision → Journey → Persona → Research
- **MANDATORY loading** — Load template at each phase start, "Do NOT Load" others to prevent over-loading

## Anti-Pattern Quick Check

Before generating any artifact, verify you're avoiding these:

- ❌ Fictional personas without research backing
- ❌ Idealized journeys missing pain points
- ❌ Mermaid diagrams with invented steps
- ❌ Trade-off docs with only one option
- ❌ AC written before decision finalized
- ❌ Requirements that can't trace to decisions

## Common Scenarios (See SKILL.md for details)

- **No research** → Mark "[HYPOTHESIS - REQUIRES VALIDATION]", use proxy signals
- **No decision** → Phase 5 (AC) cannot proceed, ask user to choose option
- **Mermaid errors** → Validate at mermaid.live, check `graph TD` direction
- **Orphaned AC** → Every AC must trace to decision, else scope creep
- **Persona/journey contradict** → Update persona or complete journey, keep synchronized
- **Stakeholder rejects option** → Regenerate AC from scratch, don't adapt

## Templates

All artifact templates available in [assets/templates/](assets/templates/):

- `persona-template.md` — Structured persona format
- `journey-template.md` — User journey outline
- `mermaid-template.md` — Diagram structure + validation checklist
- `tradeoff-template.md` — Decision document framework
- `ac-template.md` — Acceptance criteria format (openspec)

## Freedom Levels by Artifact

| Artifact | Freedom | Key Constraint |
|----------|---------|----------------|
| Persona | Medium | Must cite evidence |
| Journey | Medium | Must show friction |
| Mermaid | Low | Syntactic validity + no invented steps |
| Trade-Off | Medium-High | Must show 2-4 options |
| AC | Medium-Low | Must trace to decisions + be testable |
