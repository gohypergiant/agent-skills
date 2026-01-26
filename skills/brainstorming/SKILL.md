---
name: brainstorming
description: Use when user wants to brainstorm new ideas, design features, create POCs, draft RFCs, or explore approaches before implementation. Use for early-stage conceptual work.
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

### Time Expectations

- Simple feature: 15-30 minutes
- Medium feature: 30-60 minutes
- Complex feature: 1-2 hours
- POC: 20-90 minutes (varies by complexity)
- RFC: 1-4 hours (varies by scope)

### Output Location

Design documents are saved to:
- Features: `.agents/designs/YYYY-MM-DD-feature-name.md`
- POCs: `.agents/pocs/YYYY-MM-DD-poc-name.md`
- RFCs: `.agents/rfcs/YYYY-MM-DD-rfc-name.md`

## Additional Context

This skill incorporates proven techniques:
- **Starbursting (5WH)** - Structured requirements questions
- **Design Thinking** - Empathize → Define → Ideate → Prototype
- **YAGNI** - Ruthless scope reduction
- **Incremental validation** - Section-by-section approval

For detailed workflow, reference AGENTS.md. For templates and examples, see references/ directory.
