# Decision Trees

Flow charts for determining which phases to skip or emphasize.

---

## Skip to Approaches?

```
Requirements already clear? ──Yes─> Skip Phase 2, go to Phase 4
                           │
                           No
                           │
                           v
                    Continue Phase 2 (5WH)
```

**Use when:**
- User provides detailed requirements upfront
- Modifying existing well-understood feature
- Context from earlier discussion is complete

---

## How Deep to Explore Requirements?

```
Multiple stakeholders? ──Yes─> Deep dive WHO/WHY questions
                      │        (3-5 questions each)
                      No
                      │
                      v
                Single user type? ──Yes─> Lighter WHO/WHY
                                 │        (1-2 questions each)
                                 No
                                 │
                                 v
                          Internal tool? ──Yes─> Focus on WHAT/HOW
                                        │
                                        No
                                        │
                                        v
                                 Ask WHO first
```

**Decision factors:**
- Number of stakeholder groups
- User diversity (internal vs external)
- Scope of impact (team vs company vs public)

---

## When to Research?

```
Novel problem space? ──Yes─> Recommend research
                     │
                     No
                     │
                     v
           Similar to past work? ──Yes─> Skip research unless
                                │        user requests it
                                No
                                │
                                v
                    Competitive landscape matters? ──Yes─> Recommend research
                                                  │
                                                  No
                                                  │
                                                  v
                                          Let user decide at checkpoint
```

**Recommend research when:**
- First time solving this type of problem
- High-stakes decision (architectural, public-facing)
- User expresses uncertainty about approaches
- Industry has established patterns worth learning from

**Skip research when:**
- Team has solved similar problems before
- Simple, well-understood feature
- Time-constrained POC
- User is confident in approach

---

## Validation Depth?

```
POC (experiment)? ──Yes─> Lighter validation
                  │       (3-4 sections max)
                  No
                  │
                  v
         RFC (formal)? ──Yes─> Full validation
                      │       (all 8 sections)
                      No
                      │
                      v
      Feature (standard)? ──Yes─> Standard validation
                                  (5-6 sections)
```

### Section Selection by Type

**POC (3-4 sections):**
1. Problem Statement
2. Approach
3. Success Criteria
4. Open Questions

**Feature (5-6 sections):**
1. Problem Statement
2. Architecture Overview
3. Data Flow
4. Key Decisions
5. Success Criteria
6. Future Considerations (optional)

**RFC (all 8 sections):**
1. Problem Statement
2. Architecture Overview
3. Component Relationships
4. Data Flow
5. Key Decisions
6. Error Handling
7. Success Criteria
8. Future Considerations

---

## Question Count Guide

```
Idea clarity ──High─> 2-4 total questions
            │
            Low
            │
            v
        Idea complexity ──High─> 6-10 questions
                        │
                        Low
                        │
                        v
                    4-6 questions
```

**Stop asking when:**
- Repeating information already gathered
- User shows frustration ("just show me options")
- Core WHO/WHY/WHAT are clear
- More than 10 questions asked in Phase 2

---

## Phase Skip Examples

### ❌ Incorrect: Never skip
```
User: "Add export button"
Agent: (Continues with full WHO/WHY/WHAT questioning)
```

### ✅ Correct: Skip to approaches
```
User: "Add PDF export button to the reports page for managers"
Agent: "I can see who (managers), what (PDF export), where (reports page).
       Which approach fits best?
       1. Client-side PDF generation...
       2. Server-side rendering..."
```

### ❌ Incorrect: Skip validation
```
User: "RFC for auth changes"
Agent: (Presents entire design at once)
```

### ✅ Correct: Full validation
```
User: "RFC for auth changes"
Agent: (Gathers requirements, presents Problem Statement section)
       "Does this problem statement look right?"
       (Waits for approval before continuing)
```
