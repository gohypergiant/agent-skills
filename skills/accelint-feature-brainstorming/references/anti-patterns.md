# Common Pitfalls

Anti-patterns to avoid during brainstorming sessions.

---

## ❌ Over-Engineering

**Problem:** Designing for theoretical future needs without concrete requirements.

### Signs

- "What if we need to support 100x scale someday?"
- "Let's make it pluggable in case we want to swap it out"
- Multiple layers of abstraction for a simple feature
- Discussing "enterprise-grade" for MVP
- "We should architect for X even though we don't need it yet"

### Why It Happens

- Fear of future rework
- Resume-driven development
- Misunderstanding "extensible" vs "premature abstraction"
- Optimizing for imaginary constraints

### Fix

1. Focus on solving current problem with clean code
2. Add "Future Considerations" section in design doc for deferred ideas
3. Ask: "What pain are we solving today vs hypothetically?"
4. Use YAGNI checkpoint: "Need now, nice to have, or defer?"
5. Trust that well-written simple code can be extended later

### Example

**❌ Over-engineered:**
```
User: "Add CSV export to reports"
Agent: "We should build a plugin system for exporters so we can
       add PDF, Excel, JSON later. Each exporter implements an
       interface with pre/post hooks..."
```

**✅ Right-sized:**
```
User: "Add CSV export to reports"
Agent: "Let's add CSV export function. We can extract an interface
       later if we add more formats. Does CSV-only work for now?"
```

---

## ❌ Analysis Paralysis

**Problem:** Gathering information indefinitely without making decisions.

### Signs

- More than 10 questions in requirements phase
- "I need to research one more thing..."
- Revisiting the same decisions repeatedly
- "Let me check one more source..."
- Unable to choose between approaches after 3+ iterations

### Why It Happens

- Fear of making wrong choice
- Perfectionism
- Avoiding commitment
- Lack of decision criteria

### Fix

1. Set time boxes upfront: "30 minutes for requirements"
2. Make decisions with "good enough" information
3. Document assumptions: "We're assuming X based on Y"
4. Use "reversible vs irreversible decision" framework
5. If reversible, make quick decision and move on
6. If irreversible, research deeply but still set limit

### Example

**❌ Analysis paralysis:**
```
User: "Add user notifications"
Agent: (After 8 questions) "One more thing - should notifications
       support attachments? What about internationalization? Should
       we consider..."
```

**✅ Time-boxed:**
```
User: "Add user notifications"
Agent: (After 5 questions) "I have enough to proceed. Let me present
       approaches. We can revisit details during validation."
```

---

## ❌ Solution Fixation

**Problem:** Falling in love with first approach without exploring alternatives.

### Signs

- Only one approach presented
- Dismissing alternatives without analysis
- "This is obviously the right way"
- Defensive when questioned
- No trade-offs discussed

### Why It Happens

- Anchoring bias (first idea sticks)
- Expertise in one approach
- Wanting to start coding quickly
- Not considering user's perspective

### Fix

1. Always present 2-4 approaches with trade-offs
2. Force yourself to find downsides of preferred option
3. Ask: "What would I recommend if I couldn't use [favorite approach]?"
4. Present YAGNI/minimal option even if you don't prefer it
5. Let user choose; they may have context you don't

### Example

**❌ Solution fixation:**
```
Agent: "We should use WebSockets for real-time notifications.
       It's the modern approach."
```

**✅ Multiple options:**
```
Agent: "Which approach fits best?
       1. WebSocket - Real-time, complex infrastructure
       2. SSE - Simpler, sufficient for one-way
       3. Polling - Simplest, slight delay acceptable?
       I recommend SSE for balance of simplicity and real-time."
```

---

## ❌ Skipping Validation

**Problem:** Waiting until end to verify understanding with stakeholders.

### Signs

- Complete design presented all at once
- No incremental check-ins
- "I'll show them when it's done"
- Multi-page design document without interim approval
- Surprised reactions when finally presenting

### Why It Happens

- Wanting to impress with complete solution
- Fear of looking uncertain
- Misunderstanding iterative design
- Time pressure ("faster to just finish")

### Fix

1. Validate every 200-300 words
2. Ask "Does this look right so far?" after each section
3. Pause at key decision points
4. Early validation prevents expensive rework
5. Iterative approval builds confidence

### Example

**❌ No validation:**
```
Agent: (Writes 2000-word complete design)
       "Here's the full design for review."
User: "Wait, I thought this was for internal tools, not public API..."
```

**✅ Incremental validation:**
```
Agent: (After problem statement section)
       "Does this problem statement look right?"
User: "Yes, continue"
Agent: (After architecture section)
       "Does this architecture look right?"
```

---

## ❌ Scope Creep

**Problem:** Continuously adding features during design phase.

### Signs

- "While we're at it, we should also..."
- Growing list of requirements
- No pushback on "nice to have" features
- Original problem obscured by additions
- Timeline estimates keep increasing

### Why It Happens

- Excitement about possibilities
- Fear of missing opportunity
- Stakeholder requests
- "Might as well" mentality

### Fix

1. Use YAGNI checkpoints after each new feature suggestion
2. Explicitly categorize: Must Have, Should Have, Could Have, Won't Have (MoSCoW)
3. Ask: "Does this solve the original problem?"
4. Maintain "Out of Scope" section in design doc
5. Say "Great idea - let's add to backlog for later"

### Example

**❌ Scope creep:**
```
User: "Add CSV export"
Agent: "Got it. Should we also add PDF, Excel, scheduled exports,
       email delivery, custom templates..."
```

**✅ Scope control:**
```
User: "Add CSV export"
Agent: "CSV export. Got it. PDF/Excel would be nice - should we
       include those now or defer them?"
User: "Defer for now"
Agent: "Perfect. Adding to 'Future Considerations' section."
```

---

## ❌ Ignoring Constraints

**Problem:** Designing without considering real-world limitations.

### Signs

- No discussion of budget, timeline, or resources
- Assuming ideal technical conditions
- "We'll just rewrite everything"
- Ignoring legacy system integration
- "The team will learn [new technology]"

### Why It Happens

- Green-field thinking
- Optimism bias
- Disconnect from implementation reality
- Not asking about constraints

### Fix

1. Ask about constraints early (Phase 1)
2. Include "Constraints" section in design doc
3. Reality-check technical assumptions
4. Consider team expertise and learning curve
5. Account for existing systems and data

### Constraint Checklist

- ✅ Budget/resource limits?
- ✅ Timeline/deadline?
- ✅ Team size and expertise?
- ✅ Technology stack restrictions?
- ✅ Legacy system integration?
- ✅ Compliance/security requirements?
- ✅ Performance requirements?
- ✅ Data migration needs?

### Example

**❌ Ignoring constraints:**
```
Agent: "Let's rebuild in microservices with Kubernetes"
User: "We have 2 developers and 3 months..."
```

**✅ Constraint-aware:**
```
Agent: "Before we design, what constraints should I know?"
User: "2 developers, 3 months, must integrate with legacy DB"
Agent: "Got it. I'll design for incremental changes to existing
       monolith rather than rewrite."
```

---

## ❌ Perfect Design Syndrome

**Problem:** Trying to solve every edge case before starting.

### Signs

- Design document exceeds 5 pages
- Weeks spent in design phase
- "Just one more scenario to consider..."
- Discussing rare edge cases extensively
- Never reaching "good enough"

### Why It Happens

- Perfectionism
- Fear of mistakes
- Unclear definition of "done"
- Confusing design with implementation planning

### Fix

1. Remember: designs evolve during implementation
2. Get to "good enough" and move forward
3. Document open questions rather than solving everything
4. Focus on common cases; defer edge cases
5. Set explicit time limit for brainstorming
6. Use "Decision Log" for tracking choices, not solving everything upfront

### Example

**❌ Perfect design syndrome:**
```
Agent: "What if user's timezone changes mid-session? What if network
       fails during export? What if file exceeds quota? What if..."
User: "Can we just start with basic export working?"
```

**✅ Pragmatic design:**
```
Agent: "Here's the core design. I'm documenting these edge cases
       as 'Open Questions' to solve during implementation:
       - Timezone handling
       - Network failure recovery
       - File size limits
       Does the core approach look right?"
```

---

## Detection and Prevention

### Self-Check Questions

Before presenting design, ask yourself:

1. **Over-engineering?** - Can I remove a layer of abstraction?
2. **Analysis paralysis?** - Have I been researching for >60 min?
3. **Solution fixation?** - Did I present 2+ real alternatives?
4. **Skipping validation?** - Did I check in every 300 words?
5. **Scope creep?** - Is this solving the original problem?
6. **Ignoring constraints?** - Did I ask about limits?
7. **Perfect design?** - Am I solving edge cases before core?

### User Signals

Watch for these user responses:

- **"Just show me something"** → You're over-analyzing
- **"Wait, I meant..."** → You skipped validation
- **"That's too complex"** → You're over-engineering
- **"That's a lot"** → Scope creep
- **"We can't..."** → You ignored constraints
- **"When can we start?"** → Perfect design syndrome

### Recovery

If you catch yourself in anti-pattern:

1. **Acknowledge:** "I may be over-complicating this"
2. **Reset:** "Let me step back to the core problem"
3. **Simplify:** "What's the simplest version?"
4. **Validate:** "Does this simpler approach work?"
5. **Move forward:** Don't dwell on the detour
