# Plan Mode Triggers

When to recommend plan mode before proceeding with execution. Getting this decision right prevents costly rework.

## What

Specific criteria that indicate a task needs design-before-execution approach. Plan mode lets you explore, research, and design before committing to implementation.

## Why It Matters

Complex tasks executed without planning lead to:
- Rework when wrong approach chosen
- Missed requirements discovered mid-implementation
- Architectural decisions that conflict with each other
- Expensive backtracking after significant progress

Five minutes of planning prevents hours of rework.

---

## Always Recommend Plan Mode When

### 1. High Decision Interdependency

**Trigger:** >3 decisions where choosing A affects whether B is viable.

**Example:** "Add user authentication to the app"
- Session vs JWT affects storage strategy
- Storage strategy affects scalability approach
- Scalability approach affects infrastructure needs
- Infrastructure needs affect cost and complexity

**Why plan mode:** Need to see full decision tree before committing to path.

---

### 2. Many Sequential Phases

**Trigger:** >5 phases where each produces artifacts needed by next phase.

**Example:** "Migrate database from MySQL to PostgreSQL"
- Phase 1: Audit schema differences
- Phase 2: Write migration scripts
- Phase 3: Set up dual-write system
- Phase 4: Backfill data
- Phase 5: Validate data integrity
- Phase 6: Switch read traffic
- Phase 7: Decommission MySQL

**Why plan mode:** Each phase depends on previous, wrong approach early cascades.

---

### 3. Significant Ambiguity with Cascading Implications

**Trigger:** Vague requirements where each interpretation leads to fundamentally different implementations.

**Example:** "Make the system scalable"
- Scalable to what load? (10x vs 100x vs 1000x)
- Vertical scaling or horizontal scaling?
- Stateless architecture or distributed state?
- Cost constraints? (Budget affects approach)

**Why plan mode:** Must resolve ambiguity before committing to architecture.

---

### 4. User Explicitly Asks for Design Help

**Trigger:** Questions like "how should I approach this?", "what's the best way to?", "help me figure out..."

**Example:** "How should I approach adding real-time features to our app?"

**Why plan mode:** User explicitly wants design guidance, not immediate execution.

---

### 5. High Failure Consequence

**Trigger:** Mistakes are expensive or dangerous to fix.

**Example:** "Refactor authentication system"
- Security implications if wrong
- Hard to rollback once in production
- Affects all users if broken
- Data breach risk

**Why plan mode:** Cost of getting it wrong >> cost of planning.

---

### 6. Multiple Valid Approaches with Different Trade-offs

**Trigger:** Several reasonable implementation paths with incompatible trade-offs.

**Example:** "Implement caching for API responses"
- Approach A: Redis (fast, complex setup, cost)
- Approach B: In-memory (simple, not distributed, data loss on restart)
- Approach C: CDN (fastest for static, can't invalidate easily)
- Trade-offs: Speed vs cost vs complexity vs consistency

**Why plan mode:** User needs to evaluate trade-offs before choosing path.

---

### 7. Touches Multiple Systems

**Trigger:** Changes affect >3 separate systems or services.

**Example:** "Add shopping cart feature"
- Frontend: UI components
- Backend: Cart API, inventory checks
- Database: Cart schema, persistence
- Payment system: Integration with Stripe
- Email system: Cart abandonment emails

**Why plan mode:** Coordinating changes across systems requires design.

---

### 8. Unclear Success Criteria at Start

**Trigger:** User can't articulate what "done" looks like.

**Example:** "Improve the performance"
- Improve by how much?
- Which operations specifically?
- What's acceptable response time?
- What's the current baseline?

**Why plan mode:** Can't execute without knowing success criteria, planning phase defines them.

---

## Sometimes Recommend Plan Mode When

### Moderate Complexity with User Inexperience

If task is moderately complex AND user seems unfamiliar with domain:
- Offer plan mode as option
- Explain benefits
- Let user decide

**Example:** Junior developer asks to "set up CI/CD pipeline"
- Not inherently complex for experts
- But many decisions unfamiliar to newcomers
- Plan mode helps them understand before committing

---

### First Major Feature in New Codebase

If this is user's first significant change to unfamiliar codebase:
- Offer plan mode to explore architecture first
- Understanding existing patterns prevents conflicts

**Example:** "Add OAuth login" in codebase user just cloned
- Need to understand existing auth patterns
- Need to find where to integrate
- Need to match code style

---

## Never Recommend Plan Mode When

### 1. Simple, Well-Defined Tasks

**Example:** "Fix typo in line 42 of README.md"
- Single clear action
- No decisions
- No dependencies

**Why not:** Planning overhead exceeds execution time.

---

### 2. User Has Complete Specification

**Example:** "Implement according to this detailed RFC document [complete spec provided]"
- All decisions already made
- Just needs execution

**Why not:** Planning already done.

---

### 3. Exploration/Research Tasks

**Example:** "What files handle user authentication?"
- Not building anything
- Just investigating

**Why not:** Use explore agent instead, plan mode is for implementation design.

---

### 4. User Explicitly Declines

If you recommend plan mode but user says "just proceed":
- Document complexity concerns
- Flag decision points explicitly
- Proceed without plan mode

**Why not:** User has final say, respect their decision.

---

## How to Recommend Plan Mode

### For Complex Tasks (Clear Recommendation)

**Template:**
```
This task involves [X interdependent decisions and Y sequential phases].
Plan mode will help design the approach before execution, preventing costly
rework.

Key complexity factors:
- [Factor 1: e.g., "Choosing auth method affects scalability"]
- [Factor 2: e.g., "7 sequential phases each depending on previous"]
- [Factor 3: e.g., "High failure consequence—security implications"]

Shall I enter plan mode to design the approach first?
```

**Tone:** Confident, clear reasoning

---

### For Moderate Tasks (Offer as Option)

**Template:**
```
This task has some complexity: [describe ambiguities or decisions].

Options:
1. **Clarify now, then execute:** I ask clarifying questions, then proceed
2. **Plan mode:** Design full approach first, get your approval, then execute

I recommend option 1 for this scope. Which would you prefer?
```

**Tone:** Neutral, user decides

---

### For Simple Tasks (Don't Mention)

Just proceed. Mentioning plan mode adds unnecessary complexity to simple tasks.

---

## Presenting the Decision

### What to Include

1. **Specific complexity factors** (not generic "it's complex")
2. **Consequence of wrong approach** (why planning matters)
3. **What plan mode will accomplish** (design approach, get approval)
4. **Option to proceed anyway** (user has final say)

### What to Avoid

- Don't make user feel stupid for asking
- Don't overstate complexity (fear-mongering)
- Don't decide unilaterally (always offer choice)
- Don't make plan mode sound bureaucratic

---

## Examples

### Example 1: Clear Plan Mode Trigger

**User:** "Help me implement real-time collaboration features in our document editor"

**Response:**
```
This task involves significant interdependent decisions:
- Conflict resolution strategy (OT vs CRDT) affects data model
- Data model affects storage and sync architecture
- Sync architecture affects scalability and cost
- User experience depends on all of the above

Plan mode will help design the approach systematically before implementation,
preventing rework when early decisions prove incompatible with later needs.

Shall I enter plan mode to design this?
```

**Rationale:** High interdependency, many phases, multiple approaches with incompatible trade-offs.

---

### Example 2: Offer But Don't Push

**User:** "Add pagination to this API endpoint"

**Response:**
```
I can proceed with this. A few quick questions to clarify the approach:
- Offset-based (page 1, 2, 3) or cursor-based (opaque tokens)?
- Page size: fixed or configurable? What default?
- Total count in response (requires COUNT query—performance impact)?

If you'd prefer to design the full pagination strategy across all endpoints,
we could use plan mode. Otherwise, I can optimize this single endpoint now.

What would you prefer?
```

**Rationale:** Moderate complexity, standard pattern exists, but coordination across endpoints might benefit from planning.

---

### Example 3: Don't Mention Plan Mode

**User:** "Add a console.log statement to see what this variable contains"

**Response:**
```
[Just adds the console.log—no plan mode discussion]
```

**Rationale:** Trivially simple, mentioning plan mode is absurd.

---

## Calibration Over Time

As you work with a user, learn their preference:

**Signals user wants more planning:**
- Frequently asks "wait, should we do it this way instead?"
- Expresses regret about past hasty implementations
- Asks many clarifying questions upfront

**Signals user wants less planning:**
- Says "let's just try it" frequently
- Comfortable with iteration and rework
- Treats plan mode suggestions as overhead

**Adapt:** Calibrate your plan mode threshold to user's preference, but still flag genuinely complex tasks.

---

## Common Mistakes

**Mistake 1: Recommending for Simple Tasks**
Mentioning plan mode for "fix typo" makes you seem out of touch with task scope.

**Mistake 2: Not Recommending for Complex Tasks**
Executing complex task without design leads to expensive rework, user loses trust.

**Mistake 3: Deciding Unilaterally**
Never enter plan mode without user agreement. Always present option and rationale.

**Mistake 4: Vague Reasoning**
"This is complex" isn't helpful. "This involves 5 interdependent decisions where choosing auth method affects storage, scaling, and cost" is.

---

## Key Principle

Plan mode is about **design before execution** when execution is expensive to redo. It's not about bureaucracy or overthinking. The cost of planning should be less than the expected cost of rework without planning.

**Formula:** Recommend plan mode when `(Probability of wrong approach × Cost of rework) > Cost of planning`
