# Time Estimates

Duration guidance and time management for brainstorming sessions.

---

## Typical Durations by Type

| Type | Time Range | Phases Used | Notes |
|------|------------|-------------|-------|
| **Simple feature** | 15-30 minutes | Light Phase 2, skip research, 3-4 design sections | Clear requirements, single user type |
| **Medium feature** | 30-60 minutes | Full Phase 2, optional research, 5-6 design sections | Multiple stakeholders or moderate complexity |
| **Complex feature** | 1-2 hours | Full process, research recommended, all 8 design sections | Novel problem or high impact |
| **POC (small)** | 20-40 minutes | Focus on WHAT/HOW, light validation | Narrow technical question |
| **POC (large)** | 45-90 minutes | Deep technical exploration, risk analysis | Architectural decision or new tech |
| **RFC (standard)** | 1-2 hours | Full process, comprehensive validation | Team-level design decision |
| **RFC (architectural)** | 2-4 hours | Extended research, stakeholder alignment | Company-level or cross-team impact |
| **Exploration** | Variable | Set time box upfront (30-60 min recommended) | Open-ended discovery |

---

## Time Allocation Guidelines

### For a 60-Minute Session

```
Phase 1: Understand        →  5-10 min  (10-15%)
Phase 2: Requirements      → 10-15 min  (15-25%)
Phase 3: Research         → 10-15 min  (15-25%) [if chosen]
Phase 4: Present Approaches→  5-10 min  (10-15%)
Phase 5: Validate Design   → 20-30 min  (35-50%)
Phase 6: Document         →  5-10 min  (10-15%)
```

**Note:** If research is skipped, redistribute time to validation.

### For a 30-Minute Session

```
Phase 1: Understand        →  3-5 min
Phase 2: Requirements      →  5-8 min
Phase 3: Research         →  Skip
Phase 4: Present Approaches→  3-5 min
Phase 5: Validate Design   → 10-15 min (fewer sections)
Phase 6: Document         →  2-4 min
```

### For a 2-Hour Session

```
Phase 1: Understand        → 10-15 min
Phase 2: Requirements      → 20-30 min
Phase 3: Research         → 30-45 min
Phase 4: Present Approaches→ 10-15 min
Phase 5: Validate Design   → 40-60 min (all sections, thorough)
Phase 6: Document         → 10-15 min
```

---

## When to Time Box

### Always Time Box For

- **Open-ended explorations** - "Let's brainstorm ideas" needs bounds
- **First-time brainstorming** - Establish session norms
- **Topics prone to endless discussion** - Architecture, naming, abstractions
- **When user seems unsure** - Prevents wandering

### How to Set Time Box

**At start of session:**
```
Agent: "I recommend we spend 45 minutes on this brainstorming.
       Does that work, or should we adjust?"
```

**When user says "let's explore":**
```
Agent: "Happy to explore. Should we time-box this at 30 minutes
       or 60 minutes?"
```

**Mid-session if going long:**
```
Agent: "We've been brainstorming for 45 minutes. Want to continue
       or wrap up with what we have?"
```

---

## Time-Based Adjustments

### Running Short on Time

If 10 minutes left and still in Phase 3:

1. **Skip research:** "We're short on time. Let me present approaches based on experience."
2. **Reduce validation depth:** Cover 3-4 core sections instead of 8
3. **Document and continue:** "Let's save progress and continue later if needed."

### Running Long

If past time box:

1. **Check in:** "We're at [X] minutes. Should we continue or save progress?"
2. **Offer break point:** "Good stopping point here. We have [sections done]. Continue?"
3. **Document state:** "Let me document where we are for next session."

### User Rushing

If user says "Let's be quick" or "I have 15 minutes":

1. **Set expectations:** "15 minutes will cover understanding and approaches. We'll need another session for detailed design."
2. **Adjust scope:** "Let's focus on getting to a recommended approach. We can validate the design later."
3. **Fast-track:** Skip research, minimal requirements (3-4 questions), one approach with brief rationale

---

## Incomplete Session Handling

### Save Progress Template

```markdown
# [Feature] Brainstorming - IN PROGRESS

**Date:** YYYY-MM-DD
**Time spent:** X minutes
**Status:** Phase [N] - [Phase name]

## Completed
- ✅ Phase 1: Understand
- ✅ Phase 2: Requirements
- ⏸️ Phase 3: Research (paused)
- ⏹️ Phase 4: Not started

## Next Steps
- Complete research on [topic]
- Present 3 approaches
- Validate design sections

## Key Decisions So Far
- [Decision 1]
- [Decision 2]

## Notes
- [Any important context for next session]
```

### Resuming Incomplete Session

1. **Acknowledge gap:** "We stopped at [phase]. Let me review what we covered."
2. **Summarize:** "We established [X, Y, Z]. Should we continue from there?"
3. **Verify context:** "Has anything changed since last session?"
4. **Continue:** Pick up where you left off

---

## Time Efficiency Tips

### Reduce Questions

- Use decision trees to skip obvious questions
- If user provides detailed context upfront, don't re-ask
- Combine related questions when natural

### Parallel Work

- If research phase, summarize requirements while searching
- If documentation phase, structure while user reviews last section

### Cut Scope

- Defer nice-to-haves to "Future Considerations"
- Use "Out of Scope" section liberally
- Focus on MVP design, not perfect design

---

## Time Budgets by Phase

### Phase 1: Understand (5-10% of total)

**Quick (2-3 min):**
- User clear on type
- Minimal follow-up needed

**Normal (5-7 min):**
- Standard type question
- 1-2 follow-ups

**Extended (10-15 min):**
- User uncertain about type
- Needs exploration to clarify

### Phase 2: Requirements (15-25% of total)

**Quick (5-10 min):**
- 3-4 questions total
- Clear WHO/WHY/WHAT

**Normal (10-20 min):**
- 5-7 questions
- Full 5WH coverage

**Extended (20-30 min):**
- 8-10 questions
- Multiple stakeholders
- Complex domain

### Phase 3: Research (15-25% if used)

**Quick (10-15 min):**
- 2 sources
- 2 patterns
- Basic recommendation

**Normal (20-30 min):**
- 3-4 sources
- 2-3 patterns
- Detailed fit analysis

**Extended (40-60 min):**
- 5+ sources
- 3-4 patterns
- Comprehensive trade-offs

### Phase 4: Approaches (10-15% of total)

**Quick (3-5 min):**
- 2 approaches
- Brief trade-offs

**Normal (5-10 min):**
- 2-3 approaches
- Detailed trade-offs
- Recommendation

**Extended (10-15 min):**
- 3-4 approaches
- Comprehensive analysis
- Hybrid options

### Phase 5: Validate (35-50% of total)

**Quick (15-20 min):**
- 3-4 sections
- Brief validation

**Normal (25-40 min):**
- 5-6 sections
- Standard validation

**Extended (45-90 min):**
- All 8 sections
- Thorough validation
- Stakeholder alignment

### Phase 6: Document (10-15% of total)

**Quick (2-5 min):**
- Minimal template
- Key decisions only

**Normal (5-10 min):**
- Standard template
- All sections filled

**Extended (10-20 min):**
- Comprehensive doc
- References added
- Polished formatting

---

## Warning Signs You're Over Time

- More than 10 questions in Phase 2
- More than 4 sources researched
- More than 4 approaches presented
- User says "Let's just pick one"
- You're repeating earlier points
- Discussing implementation details (out of scope)
- Solving edge cases before core design

---

## Time Tracking

Track actual time to calibrate:

```markdown
## Session Log

**Feature:** User notifications
**Estimated:** 45 min
**Actual:** 62 min

**Breakdown:**
- Phase 1: 8 min (est: 5)
- Phase 2: 18 min (est: 12)
- Phase 3: 22 min (est: 15) ← Went long
- Phase 4: 6 min (est: 8)
- Phase 5: 8 min (est: 20) ← Cut short due to time
- Phase 6: 0 min ← Deferred

**Lessons:**
- Research took longer than expected (5 sources vs 3)
- Should have time-boxed research at 15 min
- Validation was rushed - need follow-up
```

Use this to improve estimates for similar work.
