# Question Templates

Pre-built questions to accelerate requirements gathering.

---

## For Features

### WHO Questions

- "Who will use this feature?"
  - Options: Existing users, New user segment, Internal teams, API consumers, Other
- "Who currently handles [problem] today?"
  - Options: Users manually, Support team, External service, Nobody, Other
- "Which [user type] needs this most urgently?"
  - Options: [Context-specific user types based on previous answers]

### WHY Questions

- "What problem does this solve?"
  - Options: [Based on research or user context]
- "What happens if we don't build this?"
  - Options: Users find workaround, Lost opportunity, Competitive disadvantage, Operations cost, Other
- "Why now vs 6 months from now?"
  - Options: Customer commitment, Market pressure, Technical dependency, Team capacity, Other

### WHAT Questions

- "What's the core capability needed?"
  - Options: [Based on problem statement]
- "What would success look like?"
  - Options: Measurable metrics, User satisfaction, Cost reduction, Time savings, Other

### WHERE Questions

- "Where should this live in the system?"
  - Options: [Based on codebase exploration]
- "Where do users expect to find this?"
  - Options: Main navigation, Settings, Dashboard, Contextual, Other

### HOW Questions

- "How do users work around this limitation today?"
  - Options: Manual process, Third-party tool, Spreadsheet, Don't have workaround, Other
- "How will this integrate with [existing system]?"
  - Options: API calls, Event bus, Database queries, File system, Other

### Additional Feature Questions

- "What's the impact if this takes 3 months vs 3 weeks?"
  - Options: Critical timeline, Competitive risk, No significant difference, Depends on scope, Other
- "Should this be configurable or hard-coded?"
  - Options: User configurable, Admin configurable, Hard-coded initially, Other

---

## For POCs

### Core POC Questions

- "What technical unknowns are we trying to resolve?"
  - Free text via "Other" or specific options if known
- "What's the success criteria for this experiment?"
  - Options: Performance threshold, Feasibility proof, Integration test, User validation, Other
- "What's the minimum we need to prove/disprove?"
  - Free text recommended
- "What happens if this POC shows it's not feasible?"
  - Options: Try alternative approach, Abandon feature, Reconsider requirements, Other
- "How will we measure if this approach is viable?"
  - Options: Benchmark metrics, User testing, Technical review, Cost analysis, Other

### POC Scope Questions

- "What's the time box for this POC?"
  - Options: 1 day, 1 week, 2 weeks, 1 month, Other
- "What quality bar for the POC code?"
  - Options: Throwaway, Production-ready, Prototype quality, Other
- "Who will review the POC results?"
  - Options: Team lead, Architect, Stakeholders, Just you, Other

---

## For RFCs

### Stakeholder Questions

- "Who needs to approve this before implementation?"
  - Options: Tech lead, Architect, Product, Security, All of above, Other
- "Who will be impacted by this change?"
  - Options: End users, Internal teams, External partners, Operations, Other

### Impact Questions

- "What existing systems will this impact?"
  - Options: [Based on system knowledge]
- "What are the rollback/migration concerns?"
  - Options: Data migration needed, Breaking changes, Backward compatible, No concerns, Other
- "How does this align with broader architecture?"
  - Options: Fits existing patterns, Introduces new pattern, Conflicts with direction, Unsure, Other

### Timeline Questions

- "What's the timeline for feedback and approval?"
  - Options: 1 week, 2 weeks, 1 month, No deadline, Other
- "Are there dependencies blocking this?"
  - Options: Other teams, External vendor, Infrastructure, Budget, None, Other

---

## For General Exploration

### Discovery Questions

- "What problem are you trying to understand better?"
  - Free text via "Other"
- "What would success look like at the end of this session?"
  - Options: Clear direction, Multiple options, Understanding trade-offs, Document to share, Other
- "Are there any constraints we should know upfront?"
  - Options: Budget, Timeline, Technology, Team size, None, Other
- "How much time should we spend on this exploration?"
  - Options: 30 min, 1 hour, 2 hours, No limit, Other

### Context Questions

- "Is this related to existing work?"
  - Options: Yes - [specify], Brand new, Replacing old system, Other
- "What's the ultimate goal?"
  - Options: Ship feature, Learn technology, Inform decision, Convince stakeholders, Other

---

## YAGNI Challenge Questions

Use these to challenge scope:

- "Do we really need [feature] now, or can it wait?"
  - Options: Need it now, Nice to have, Defer it, Remove it
- "What's the simplest version that solves the problem?"
  - Free text via "Other"
- "Could we ship without [feature] and add it later?"
  - Options: Yes - defer it, No - blocking, Unsure, Other
- "Is this solving a real problem or a theoretical one?"
  - Options: Real user pain, Future-proofing, Nice to have, Unsure, Other

---

## Follow-up Question Patterns

### When Answer is "Other" (Free Text)

If user provides free text, acknowledge and ask:
- "Got it. [Paraphrase their answer]. Does that mean [interpretation]?"
  - Options: Yes, Not quite - [let me clarify], Other

### When Answer Reveals New Information

If answer opens new area:
- "Interesting - that impacts [X]. Should we explore [X]?"
  - Options: Yes - explore it, No - note it for later, Other

### When Answer is Ambiguous

If answer could mean multiple things:
- "When you say [their answer], do you mean [option A] or [option B]?"
  - Options: Option A, Option B, Something else - [explain], Other

---

## Anti-Patterns to Avoid

### ❌ Incorrect: Batched questions
```
"Who will use this, what problem does it solve, and where should it live?"
```

### ✅ Correct: One at a time
```
"Who will use this feature?"
[Wait for answer]
(Next message) "What problem does it solve for them?"
```

### ❌ Incorrect: Leading questions
```
"This should be for power users, right?"
```

### ✅ Correct: Neutral framing
```
"Who will use this feature?"
Options: Power users, All users, Admins, External API, Other
```

### ❌ Incorrect: Too many options
```
Options: A, B, C, D, E, F, G, H, I, J, Other
```

### ✅ Correct: 2-5 options + Other
```
Options: Option A, Option B, Option C, Other
```
