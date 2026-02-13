---
name: accelint-feature-brainstorming
description: Use when user wants to brainstorm new ideas, design features, create POCs, draft RFCs, or explore approaches before implementation. Use for early-stage conceptual work when requirements are not yet clear. Precedes acceptance planning. Keywords: brainstorm, design, POC, RFC, explore approaches, ideation, feature discovery.
license: Apache-2.0
metadata:
  author: gohypergiant
  version: "1.0"
---

# Brainstorming Ideas Into Designs

Transform vague ideas into fully-formed designs through structured collaborative dialogue.

## When to Activate This Skill

Use this skill when the user wants to:

- **Brainstorm new features** - Explore functionality before implementation
- **Create POCs** - Validate technical feasibility of an approach
- **Draft RFCs** - Design documents for team review and approval
- **Explore approaches** - Compare multiple solutions before deciding
- **Refine ideas** - Turn vague concepts into concrete designs
- **Validate assumptions** - Test understanding before committing resources

**Trigger phrases:**
- "I want to brainstorm..."
- "Let's design..."
- "What's the best approach for..."
- "How should we implement..."
- "I have an idea for..."
- "Can you help me think through..."

## When NOT to Use This Skill

- When implementation details are already decided
- When executing an existing plan or design
- When making small incremental changes to existing code
- When debugging or fixing specific bugs
- When requirements are fully specified and approved
- When the user asks for code without design discussion

## NEVER Do When Brainstorming

- **NEVER accept solution-as-problem** - "Add a button" or "Use Redis" are solutions, not problems. Force back to root cause: "What are users unable to do?" "Why does that limitation matter?"

- **NEVER skip documenting rejected approaches** - Document "We considered X but chose Y because Z" in design docs. Prevents future teams from revisiting dead ends or wondering "why didn't they consider X?"

- **NEVER let scope creep during validation** - Each "what about..." creates a new feature. Park them in "Future Considerations" section. Validate the original scope first.

- **NEVER design without constraints** - "Make it better" or "improve performance" are unbounded. Extract specific success criteria: "Load in <200ms" or "Support 10k users."

- **NEVER accept vague value propositions** - "Users will like it" or "makes it better" are not measurable benefits. Push for: "Reduces checkout time by 30%" or "Eliminates manual data entry."

- **NEVER let research become copying** - "Make it like [competitor]" without understanding why their approach works or if it fits your context leads to poor design choices.

- **NEVER batch multiple questions** - Overwhelming users with "Tell me about WHO, WHAT, WHEN, WHERE, WHY" gets poor answers. One focused question gets thoughtful responses.

## How to Use

This skill guides you through a structured process:

```
Understand → Requirements → Research → Approaches → Validate → Document
```

**Key principles:**
1. Ask one question at a time
2. Prefer multiple choice over open-ended
3. Challenge unnecessary features (YAGNI)
4. Present design in 200-300 word sections
5. Only research when user requests it

**Typical flow:**
1. Understand what type of work (Feature/POC/RFC)
2. Ask 5WH questions (Who/Why/What/Where/How)
3. Optionally research similar solutions
4. Present 2-4 approaches with trade-offs
5. Validate design incrementally
6. Document as design doc

## Examples

**Feature brainstorming:**
```
User: "I want to add user notifications"
Agent: "What would you like to brainstorm?"
       [Options: New feature, POC, RFC, Exploration]
User: "New feature"
Agent: "Who will use these notifications?"
       [Options: Existing users, New segment, Internal teams, API consumers]
```

**POC exploration:**
```
User: "POC for real-time collaboration"
Agent: "What technical unknowns are we trying to resolve?"
       [Multiple choice or free text via "Other"]
```

**RFC creation:**
```
User: "RFC for authentication changes"
Agent: "What problem does this solve?"
       [Options based on context]
```

## Important Notes

### Scope Boundaries

**This skill produces:**
- ✅ Validated design documents
- ✅ Clear problem statements
- ✅ Chosen approach with rationale
- ✅ Success criteria
- ✅ Risk and trade-off documentation

**This skill does NOT produce:**
- ❌ Implementation plans
- ❌ Story breakdowns
- ❌ Code examples
- ❌ Detailed technical specs
- ❌ Effort estimates

### Output Location

Design documents are saved to:
- Features: `.agents/brainstorming/YYYY-MM-DD-feature-name.md`
- POCs: `.agents/brainstorming/YYYY-MM-DD-poc-name.md`
- RFCs: `.agents/brainstorming/YYYY-MM-DD-rfc-name.md`

### Next Steps

After completing brainstorming and design validation:
- **Proceed to acceptance planning** - Use `accelint-feature-acceptance-planning` to define requirements, acceptance criteria, and success metrics
- The brainstorming design document serves as input to the acceptance planning process

## Additional Context

This skill incorporates 5WH questioning (Starbursting), Design Thinking iteration, and YAGNI principles.

For detailed workflow, reference AGENTS.md. For templates and examples, see references/ directory.
