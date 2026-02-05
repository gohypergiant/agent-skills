# Brainstorming Ideas Into Designs

> **Note:**
> This document is mainly for agents and LLMs to follow when helping users brainstorm new ideas, features, POCs, and RFCs. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive workflow for transforming vague ideas into validated designs through structured dialogue. Covers 6 phases from understanding to documentation, with emphasis on incremental validation and YAGNI principles.

**Key rules:**
- One question at a time (never batch)
- Multiple choice preferred over open-ended
- Present design in 200-300 word sections
- Research only when user requests
- Challenge every feature's necessity

---

## How to Use This Guide

1. **Start with Phase 1** - Always begin by understanding the idea type
2. **Follow phases sequentially** - Each builds on the previous
3. **Load references as needed** - Click through for detailed templates/examples
4. **Use decision trees** - Skip phases when appropriate (see references/decision-trees.md)
5. **Apply YAGNI ruthlessly** - Challenge complexity at every phase

This structure minimizes token usage while providing complete guidance.

---

## 1. Core Workflow

### 1.1 Process Overview

```
┌─────────────┐
│  Phase 1    │  Understand idea type (Feature/POC/RFC/Explore)
│  Understand │  ↓
└─────────────┘  Edge case? → Apply special handling
       │
       ↓
┌─────────────┐
│  Phase 2    │  5WH Questions (one at a time)
│ Requirements│  ↓
└─────────────┘  Can skip question? → Check decision table
       │         User doesn't know? → Provide options
       │         Scope exploding? → YAGNI checkpoint
       ↓
┌─────────────┐
│  Phase 3    │  Ask: Research or skip?
│  Research   │  ↓
└─────────────┘  If research → Load research-synthesis.md
       │         If skip → Proceed to approaches
       ↓
┌─────────────┐
│  Phase 4    │  Present 2-4 approaches with trade-offs
│  Approaches │  ↓
└─────────────┘  User can't decide? → Narrow to top 2
       │
       ↓
┌─────────────┐
│  Phase 5    │  Present design in 200-300 word sections
│  Validate   │  ↓
└─────────────┘  Section rejected? → Revise and re-present
       │         Go back? → Return to earlier phase
       ↓
┌─────────────┐
│  Phase 6    │  Create design document
│  Document   │  ↓
└─────────────┘  Save to .agents/brainstorming/
       │
       ↓
  [Complete] → Hand off to acceptance planning
```

### 1.2 Core Principles

- **Dialogue first** - Ask user directly, no agents until requested
- **One question per message** - Never batch multiple questions
- **Multiple choice when possible** - Easier to answer, include "Other" for free text
- **YAGNI ruthlessly** - Challenge necessity of every feature
- **Incremental validation** - Present 200-300 words, then verify
- **Research on request** - Only explore when user explicitly chooses

---

## 2. Phase 1: Understand the Idea

**Goal:** Identify what type of work and gather initial context.

### 2.1 Initial Question

Ask about work type:

**Question:** "What would you like to brainstorm?"

**Options:**
1. New feature - Add functionality to existing system
2. POC (Proof of Concept) - Validate technical feasibility
3. RFC (Request for Comment) - Design doc for team review
4. General exploration - Not sure yet, discover together

### 2.2 Follow-up Questions

Based on response, ask clarifying questions **one at a time**:

- "Can you describe this in a sentence or two?" (free text via "Other")
- "What triggered this idea?"
- "Is there an existing system this builds on?"
- "Who is this for?"

**Rule:** One question per message. If you need more context, ask another question in next message.

### 2.3 Edge Case Handling

Special scenarios that need different approaches:

**Legacy system replacement:**
- Extra emphasis on constraints: "What MUST remain compatible?"
- Document migration path as core requirement
- Success criteria must include "no disruption to existing users"

**Unproven/bleeding-edge technology POC:**
- Focus WHY on "what are we validating?" not "what problem are we solving?"
- Success criteria: "What would make us abandon this approach?"
- Time-box research heavily - bleeding edge has limited prior art

**Politically controversial changes:**
- Ask "Who are the stakeholders?" (not just users)
- Document "Risks" section prominently
- Success criteria includes "stakeholder buy-in from X, Y, Z"

**Performance/scalability problems:**
- Require baseline metrics: "Current: X req/sec, Target: Y req/sec"
- Push for specific numbers, reject vague "faster" or "better"
- Approaches must include measurement strategy

**"I don't know what I want" exploration:**
- Start with problem domain, not solution: "What area frustrates users?"
- Provide 3-4 common problem patterns as options
- Use research phase heavily to show existing solutions
- Time-box to avoid endless exploration

---

## 3. Phase 2: Explore Requirements

**Goal:** Use 5WH framework to gather requirements.

### 3.1 Question Sequence

Ask questions **one at a time** in this order:

| Question | Purpose | When to Skip |
|----------|---------|--------------|
| **WHO** | Identify users/stakeholders | Never skip |
| **WHY** | Understand problem | When obvious from context |
| **WHAT** | Define core capability | When user already specified |
| **WHERE** | Determine system placement | For new systems only |
| **HOW** | Explore implementation | After gathering context |
| **WHEN** | Understand timing | For phased work only |

### 3.1.1 Decision Criteria: When to Skip Questions

Use this table to determine if a question can be safely skipped:

| Question | Skip When | Ask When |
|----------|-----------|----------|
| **WHO** | User type mentioned OR single user type implied | Multiple possible user types |
| **WHY** | Problem explicitly stated OR obviously broken | Unclear value or problem |
| **WHAT** | User specified exact capability | Feature scope unclear |
| **WHERE** | Modifying existing system | New system or unclear placement |
| **HOW** | Single obvious approach | Multiple valid approaches exist |
| **WHEN** | Single-phase delivery | Phased rollout or timing critical |

### 3.2 Question Templates

**REQUIRED:** Load references/question-templates.md for pre-built questions tailored to Features, POCs, RFCs, and Exploration.

**Do NOT load** decision-trees.md, anti-patterns.md, or document-templates.md during requirements phase.

### 3.3 YAGNI Checkpoint

During requirements, challenge features:

**Question:** "Do we really need [feature] now, or can it wait?"

**Options:**
1. Need it now - Core to problem
2. Nice to have - Not essential
3. Defer it - Add later if needed
4. Remove it - Unnecessary complexity

### 3.4 Adaptive Questioning

- Skip questions when answers obvious from context
- If user certain → move faster to approaches
- If user uncertain → explore deeper with sub-questions
- Use "Other" for custom responses

**OPTIONAL:** Load references/decision-trees.md for guidance on requirements depth.

### 3.5 Common Failure Modes and Fallbacks

When the standard workflow breaks down, use these recovery strategies:

| Failure Mode | Symptoms | Fallback Strategy |
|--------------|----------|-------------------|
| **User doesn't know** | "I'm not sure", "I don't know", vague answers | Provide 3-4 options based on common patterns: "Most teams do A, B, or C. Which fits best?" |
| **Requirements churn** | User changes answer to previous questions, "actually..." | Stop and summarize: "So far we have [X, Y, Z]. Should we lock these in before proceeding?" |
| **Scope explosion** | Each answer adds 3 new features, "what about..." | Invoke YAGNI checkpoint immediately. Park new items: "Let's note that for v2. Focus on core problem first." |
| **Solution fixation** | User repeatedly jumps to "use technology X" | Redirect with WHY: "Before choosing tech, what specific problem are we solving? What's broken about current approach?" |
| **Research paralysis** | Research phase finds 10 approaches, can't decide | Narrow to 2-3: "Based on your constraints, only A and B fit. Which aligns with your team's expertise?" |
| **Validation rejection** | User rejects multiple design sections | Step back to requirements: "Let's revisit the problem statement. What changed from our original understanding?" |

**When to abort brainstorming:**
- User cannot articulate any concrete problem after 3-4 questions
- Requirements change fundamentally 3+ times (indicates unclear vision)
- User rejects all approaches without clear reasoning

**Abort gracefully:** "This needs more clarity before design. Recommend: (1) Talk to actual users, (2) Identify specific pain points, (3) Return with concrete examples."

---

## 4. Phase 3: Research Checkpoint

**Goal:** Ask before exploring codebase or researching solutions.

### 4.1 Checkpoint Question

**Question:** "How should we proceed?"

**Options:**
1. Research solutions - Look up how others solve this
2. Skip to approaches - I know what I want
3. Both - Research first, then approaches

### 4.2 If User Chooses Research

Explain what you'll search:

**Template:**
```
I'll research:
- How [industry] products implement [feature type]
- Common architectural patterns for [problem]
- Trade-offs and lessons learned

Should I proceed?
```

After research, synthesize findings using references/research-synthesis.md template.

**REQUIRED:** Load references/research-synthesis.md when user chooses research.

**Do NOT load** question-templates.md or anti-patterns.md during research phase.

---

## 5. Phase 4: Present Approaches

**Goal:** Present 2-4 distinct approaches with trade-offs.

### 5.1 Approach Question

**Question:** "Which approach fits best?"

**Options:**
1. **[Recommended]** - Description + key trade-off
2. **[Alternative 1]** - Description + key trade-off
3. **[Alternative 2]** - Description + key trade-off
4. **Minimal/YAGNI** - Simplest version

### 5.2 Approach Template

For each option, include:

- **Core concept** - What makes this distinct (1-2 sentences)
- **Trade-offs** - What you gain vs sacrifice
- **Best when** - Scenario where this shines

**Example:**
```
1. Event-driven [Recommended]
   Core: Components via event bus
   Trade-offs: Complex setup, easier extension
   Best when: System will grow

2. Direct API calls
   Core: Components call directly
   Trade-offs: Simpler now, harder later
   Best when: Stable requirements
```

---

## 6. Phase 5: Validate Design

**Goal:** Present design in sections, validate incrementally.

### 6.1 Section Validation

After each section (200-300 words):

**Question:** "Does this [section name] look right?"

**Options:**
1. Yes, continue - Next section
2. Needs changes - I'll explain
3. Go back - Revisit decisions

### 6.2 Design Sections

Cover in order:

1. **Problem Statement** - What/why we're solving
2. **Architecture Overview** - Components and responsibilities
3. **Component Relationships** - Interaction patterns
4. **Data Flow** - Information movement
5. **Key Decisions** - Critical choices and rationale
6. **Error Handling** - Failure modes and recovery
7. **Success Criteria** - How we measure success
8. **Future Considerations** - What we're NOT doing now

**OPTIONAL:** Adjust sections based on work type (see references/decision-trees.md for validation depth).

### 6.3 YAGNI During Validation

Challenge complexity at each section:

- "Do we need this component now, or is it speculative?"
- "What's the simplest version that solves the problem?"
- "Can we defer this decision?"

**RECOMMENDED:** Load references/anti-patterns.md to avoid common mistakes during validation.

---

## 7. Phase 6: Document

**Goal:** Create design document.

### 7.1 Document Structure

**REQUIRED:** Load references/document-templates.md for complete structure.

**Do NOT load** question-templates.md, research-synthesis.md, or decision-trees.md during documentation phase.

**Brief template:**
```markdown
# [Name] Design

**Date:** YYYY-MM-DD
**Type:** [Feature | POC | RFC]
**Status:** Draft

## Problem Statement
## Solution Overview
## Architecture
## Key Decisions
## Success Criteria
## Out of Scope
## Open Questions
## References
```

### 7.2 File Naming

- Features: `.agents/brainstorming/YYYY-MM-DD-feature-name.md`
- POCs: `.agents/brainstorming/YYYY-MM-DD-poc-name.md`
- RFCs: `.agents/brainstorming/YYYY-MM-DD-rfc-name.md`

---

## 8. Methodology Reference

Techniques incorporated:

| Technique | Applied In |
|-----------|------------|
| **Starbursting (5WH)** | Phase 2 questions |
| **Design Thinking** | Empathize → Define → Ideate → Prototype |
| **SCAMPER** | Modifications: Substitute, Combine, Adapt |
| **YAGNI** | All phases |

---

## 9. Progressive Disclosure

Load additional context only when needed:

- **references/decision-trees.md** - Skip logic for phases
- **references/question-templates.md** - Pre-built questions
- **references/research-synthesis.md** - Research output format
- **references/anti-patterns.md** - Common mistakes to avoid
- **references/document-templates.md** - Design doc structures
