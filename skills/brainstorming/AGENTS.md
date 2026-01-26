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
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐
│   Phase 1   │ -> │   Phase 2    │ -> │   Phase 3   │ -> │   Phase 4    │ -> │   Phase 5    │ -> │ Phase 6  │
│  Understand │    │ Requirements │    │  Research   │    │  Approaches  │    │  Validate    │    │ Document │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘    └──────────────┘    └──────────┘
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

### 3.2 Question Templates

**REQUIRED:** Load references/question-templates.md for pre-built questions tailored to Features, POCs, RFCs, and Exploration.

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

- Features: `.agents/designs/YYYY-MM-DD-feature-name.md`
- POCs: `.agents/pocs/YYYY-MM-DD-poc-name.md`
- RFCs: `.agents/rfcs/YYYY-MM-DD-rfc-name.md`

---

## 8. Time Management

**RECOMMENDED:** Load references/time-estimates.md for duration guidance.

**Quick reference:**
- Simple feature: 15-30 min
- Medium feature: 30-60 min
- Complex feature: 1-2 hours
- POC: 20-90 min
- RFC: 1-4 hours

**Time box when:**
- Open-ended explorations
- First-time brainstorming
- Topics prone to endless discussion

---

## 9. Methodology Reference

Techniques incorporated:

| Technique | Applied In |
|-----------|------------|
| **Starbursting (5WH)** | Phase 2 questions |
| **Design Thinking** | Empathize → Define → Ideate → Prototype |
| **SCAMPER** | Modifications: Substitute, Combine, Adapt |
| **YAGNI** | All phases |

---

## 10. Progressive Disclosure

Load additional context only when needed:

- **references/decision-trees.md** - Skip logic for phases
- **references/question-templates.md** - Pre-built questions
- **references/research-synthesis.md** - Research output format
- **references/anti-patterns.md** - Common mistakes to avoid
- **references/time-estimates.md** - Duration expectations
- **references/document-templates.md** - Design doc structures
