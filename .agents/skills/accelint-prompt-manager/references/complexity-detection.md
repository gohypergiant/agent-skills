# Complexity Detection

How to assess whether a task is simple (execute directly), moderate (proceed with monitoring), or complex (recommend plan mode).

## What

Systematic criteria for categorizing task complexity before execution. Complexity determines optimization strategy and whether plan mode should be recommended.

## Why It Matters

Executing complex tasks without planning causes rework, missed requirements, and suboptimal architectures. Simple tasks don't need elaborate planning. The skill is distinguishing between them.

---

## Complexity Levels

### Simple Tasks

**Characteristics:**
- Single clear objective
- <3 sequential steps
- No ambiguity in requirements
- No interdependent decisions
- Consequence of failure is low
- Easily reversible

**Examples:**
- "Fix this typo in the README"
- "Add a console.log to debug this function"
- "Write a function that reverses a string"
- "Extract email addresses from this log file"

**Optimization Strategy:**
- Execute directly with optimized prompt
- Minimal clarification needed
- Framework application optional

**Plan Mode:** NOT recommended

---

### Moderate Tasks

**Characteristics:**
- Some ambiguity in requirements (2-3 vague terms)
- 3-5 sequential steps
- Few dependencies between steps
- Limited decision points (<3)
- Moderate consequence of failure
- Reversible with reasonable effort

**Examples:**
- "Create a REST API with auth and rate limiting" (some implementation choices, but standard patterns exist)
- "Write tests for this component" (need to clarify coverage expectations)
- "Refactor this function for readability" (subjective criteria, but low risk)
- "Document this API" (need audience and format specs)

**Optimization Strategy:**
- Clarify ambiguities upfront
- Apply appropriate framework
- Specify success criteria explicitly
- Monitor for blocking issues during execution

**Plan Mode:** Optional, usually not needed if ambiguities are resolved

---

### Complex Tasks

**Characteristics:**
- >3 interdependent decisions that affect each other
- >5 sequential phases requiring coordination
- Significant ambiguity with cascading implications
- High consequence of failure
- Hard to reverse once started
- Multiple valid approaches with different trade-offs

**Examples:**
- "Design distributed system for real-time analytics" (architecture decisions affect each other)
- "Refactor authentication system" (touches many files, affects security, requires migration strategy)
- "Implement ML pipeline with data validation" (multiple components, unclear requirements, performance constraints)
- "Add user authentication to the app" (session vs JWT, where to store, middleware structure, migration path)

**Optimization Strategy:**
- ALWAYS recommend plan mode
- Don't proceed with execution until plan is approved
- Explain reasoning: "This task involves [X dependencies and Y phases]. Plan mode will help design the approach before execution, preventing costly rework."

**Plan Mode:** REQUIRED

---

## Detection Criteria

### Decision Point Counting

**Count interdependent decisions** where choosing A affects the viability of B:

**Example: "Add user authentication"**
- Decision 1: Session-based vs JWT tokens
- Decision 2: Where to store tokens (cookies, localStorage, memory)
- Decision 3: Middleware structure (global vs route-specific)
- Decision 4: How to handle existing users (migration strategy)

**Interdependencies:**
- If JWT → can't use server-side sessions → affects scalability
- If localStorage → vulnerable to XSS → affects security approach
- If global middleware → affects all routes → different structure needed

**Result:** 4 interdependent decisions → COMPLEX → Recommend plan mode

---

### Phase Counting

**Count sequential phases** that each produce artifacts needed by next phase:

**Example: "Refactor authentication system"**
- Phase 1: Audit current implementation for issues
- Phase 2: Design new architecture
- Phase 3: Write tests for existing behavior
- Phase 4: Implement new auth logic
- Phase 5: Migrate existing sessions
- Phase 6: Deploy with rollback strategy

**Result:** 6 sequential phases → COMPLEX → Recommend plan mode

---

### Ambiguity Impact Assessment

**Evaluate whether ambiguity has cascading implications:**

**Low Impact Ambiguity (Moderate):**
- "Write comprehensive tests" → Clarify "comprehensive" upfront → Proceed
- Ambiguity resolved before execution starts
- Decision doesn't affect other decisions

**High Impact Ambiguity (Complex):**
- "Make this scalable" → What's the target load? How to handle state? What's the budget? → Plan mode
- Each answer affects multiple architectural decisions
- Resolving one ambiguity reveals more ambiguities

---

### Failure Consequence Assessment

**Evaluate the cost of getting it wrong:**

**Low Consequence (Simple/Moderate):**
- Easy to rollback (git revert)
- Affects limited scope (single file/function)
- No data loss risk
- No security implications
- Quick to redo if wrong approach

**High Consequence (Complex):**
- Hard to reverse (database migrations, API contracts)
- Wide blast radius (affects multiple systems)
- Data loss or corruption risk
- Security vulnerabilities possible
- Expensive to redo (weeks of work)

---

## Edge Cases

### "Simple" Request, Complex Implications

**User says:** "Add a delete button to user profile"

**Seems simple but actually complex:**
- Where to place button? (UI decision)
- Confirmation dialog? (UX decision)
- Soft delete vs hard delete? (Data retention decision)
- What gets deleted? (Just user or cascade to related data?)
- API endpoint design? (Backend decision)
- Error handling strategy? (What if deletion fails?)
- State management? (How to update UI after delete?)

**Detection trigger:** Count decisions → 7 decision points → COMPLEX

---

### Complex Request, Simple Execution

**User says:** "Design distributed system for real-time analytics with data validation, streaming pipelines, and fault tolerance"

**Seems complex but user provides complete spec:**
- Uses Apache Kafka for streaming (specified)
- Uses Flink for processing (specified)
- Uses PostgreSQL for storage (specified)
- Schema validation with JSON Schema (specified)
- Fault tolerance via checkpointing (specified)
- All decisions already made, just needs implementation

**Detection trigger:** Decisions pre-made → MODERATE (implementation, not design)

**Lesson:** Listen for whether user has already done the planning.

---

## Questions to Ask

When complexity is unclear, ask:

1. **Have you already decided on the approach?** (Reduces complexity if yes)
2. **What happens if this fails?** (Determines consequence severity)
3. **How many parts of the system does this touch?** (Indicates blast radius)
4. **Are there multiple ways to do this with different trade-offs?** (Indicates decision complexity)
5. **Do you need me to design the approach or just implement it?** (Clarifies role)

---

## Calibration Examples

### Example 1: "Optimize database queries"

**Analysis:**
- Ambiguity: "Optimize" for what? (Speed, memory, cost)
- Phases: Profile → Identify bottlenecks → Apply fixes → Validate
- Decisions: Index strategy, caching layer, query rewrite, schema changes
- Dependencies: Index choice affects caching needs affects schema
- Failure impact: Could degrade performance if wrong approach

**Result:** COMPLEX → Recommend plan mode

---

### Example 2: "Write a function to validate email addresses"

**Analysis:**
- Ambiguity: Minimal (email validation is well-defined)
- Phases: Write function → Write tests (2 phases)
- Decisions: Regex vs library (1 decision, not interdependent)
- Dependencies: None
- Failure impact: Low (easy to fix if wrong)

**Result:** SIMPLE → Execute directly

---

### Example 3: "Create REST API with auth and rate limiting"

**Analysis:**
- Ambiguity: Some (which auth method, what rate limits)
- Phases: Design routes → Implement auth → Add rate limiting → Write tests (4 phases)
- Decisions: Auth method, rate limit strategy, storage (3 decisions, some dependency)
- Dependencies: Auth method affects rate limiting (per-user vs per-IP)
- Failure impact: Moderate (security implications but standard patterns exist)

**Result:** MODERATE → Clarify ambiguities → Proceed

---

## Automation Opportunity

Build pattern recognition for common complex task indicators:

**Keywords signaling complexity:**
- "Design", "architecture", "system", "distributed"
- "Refactor [major component]", "migrate", "upgrade"
- "Scalable", "fault-tolerant", "high-availability"
- Multiple AND conjunctions: "with X and Y and Z"

**Keywords signaling simplicity:**
- "Fix typo", "add log", "rename variable"
- "Write function to [single action]"
- "Extract [data] from [source]"

**Caution:** Keywords are hints, not deterministic. Always count decisions/phases/dependencies.

---

## When User Resists Plan Mode

If you recommend plan mode but user wants to proceed immediately:

**Acceptable:**
- Document the complexity concerns
- Note areas that may need iteration
- Proceed but flag decision points explicitly
- Offer to switch to plan mode if execution stalls

**Not acceptable:**
- Silently proceeding without flagging complexity
- Making major architectural decisions without user input
- Assuming answers to ambiguous questions

**Key principle:** User has final say, but you must transparently communicate the risks.
