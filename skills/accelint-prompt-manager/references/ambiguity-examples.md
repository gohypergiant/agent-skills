# Ambiguity Examples

Common vague terms and how to resolve them with specific, measurable alternatives.

## What

Catalog of frequently-ambiguous terminology in prompts, along with concrete interpretation options and resolution strategies.

## Why It Matters

Vague terms create misalignment. "Comprehensive" means different things to different people. Without disambiguation, you're guessing at user intent. Good prompts eliminate guesswork.

---

## Resolution Pattern

For each ambiguous term:
1. **Identify** the vague term
2. **Present 2-3 interpretation options** with implications
3. **Let user decide** (never assume)
4. **Rewrite** with chosen specificity

---

## Common Vague Terms

### "Comprehensive"

**Why ambiguous:** Ranges from "covers everything" to "hits main points" depending on context and time constraints.

**Interpretation options:**
- **A) Exhaustive** — All edge cases, error conditions, and scenarios [+time, +thoroughness]
- **B) Complete** — Common scenarios and important edge cases [balanced, most common choice]
- **C) Overview** — Main functionality with representative examples [+speed, -depth]

**Resolution example:**

❌ Vague: "Write comprehensive tests for this API"
✅ Specific: "Write tests covering: (1) happy path for each endpoint, (2) auth failures (401/403), (3) rate limiting (429), (4) malformed input (400). Target 80%+ branch coverage."

---

### "Fast" / "Quick"

**Why ambiguous:** Could mean response time, development time, or execution time.

**Interpretation options:**
- **A) Fast response time** — Optimize for low latency [may increase complexity]
- **B) Fast development** — Quick to implement [may sacrifice optimization]
- **C) Fast execution** — Efficient algorithm [may increase dev time]

**Resolution example:**

❌ Vague: "Make this API call fast"
✅ Specific: "Optimize this API call for response time <200ms at p95. Use caching, parallel requests, and connection pooling."

---

### "Simple" / "Clean"

**Why ambiguous:** Could mean minimal code, easy to understand, few dependencies, or follows conventions.

**Interpretation options:**
- **A) Minimal code** — Fewest lines possible [may sacrifice readability]
- **B) Easy to understand** — Clear logic and naming [may be more verbose]
- **C) Few dependencies** — Minimal external libraries [may reinvent wheels]
- **D) Follows conventions** — Matches existing patterns [depends on codebase style]

**Resolution example:**

❌ Vague: "Write simple error handling"
✅ Specific: "Write error handling that: (1) uses try/catch consistently, (2) logs errors with context, (3) returns user-friendly messages, (4) follows existing ErrorHandler class pattern."

---

### "Better" / "Improve"

**Why ambiguous:** No baseline, no dimension of improvement specified.

**Interpretation options:**
- **A) Better performance** — Faster execution [measure: response time, throughput]
- **B) Better readability** — Easier to understand [measure: complexity metrics, team review]
- **C) Better maintainability** — Easier to change [measure: coupling, cohesion]
- **D) Better security** — Fewer vulnerabilities [measure: security scan results]

**Resolution example:**

❌ Vague: "Make this code better"
✅ Specific: "Refactor this code for readability: (1) extract magic numbers to named constants, (2) split 50-line function into smaller focused functions, (3) add docstrings explaining non-obvious logic."

---

### "Optimize"

**Why ambiguous:** Optimize for what dimension? Trade-offs exist between dimensions.

**Interpretation options:**
- **A) Speed** — Reduce execution time [may increase memory or complexity]
- **B) Memory** — Reduce RAM usage [may increase execution time]
- **C) Cost** — Reduce cloud spend [may increase latency]
- **D) Maintainability** — Easier to change [may not be "optimal" by other metrics]

**Resolution example:**

❌ Vague: "Optimize this database query"
✅ Specific: "Optimize this query for speed: target <50ms execution time. Add indexes on user_id and created_at. Use EXPLAIN ANALYZE to verify."

---

### "Secure"

**Why ambiguous:** Security has many dimensions, each requiring different approaches.

**Interpretation options:**
- **A) Input validation** — Prevent injection attacks [SQL, XSS, command injection]
- **B) Authentication** — Verify user identity [sessions, tokens, OAuth]
- **C) Authorization** — Control access [roles, permissions, policies]
- **D) Data protection** — Encrypt sensitive data [at rest, in transit]

**Resolution example:**

❌ Vague: "Make this API secure"
✅ Specific: "Add security measures: (1) validate all inputs against schema, (2) require JWT authentication on all endpoints, (3) implement rate limiting (100 req/min per user), (4) sanitize error messages to avoid leaking internals."

---

### "Scalable"

**Why ambiguous:** Scale to what load? Vertical or horizontal? What's the constraint?

**Interpretation options:**
- **A) Vertical scaling** — Handle more load on single machine [easier, limited ceiling]
- **B) Horizontal scaling** — Distribute across machines [complex, nearly unlimited]
- **C) Load-specific** — Handle 10x current load [concrete target]
- **D) Cost-effective scaling** — Scale within budget constraint [may limit peak capacity]

**Resolution example:**

❌ Vague: "Design a scalable architecture"
✅ Specific: "Design architecture to handle 10x current load (100k daily active users → 1M). Use horizontal scaling with stateless application servers, Redis for shared state, PostgreSQL with read replicas. Target: <500ms p95 latency, <$5000/month infrastructure cost."

---

### "User-friendly"

**Why ambiguous:** Friendly for which users? Novices vs experts have opposite needs.

**Interpretation options:**
- **A) Novice-friendly** — Guided, explanatory, forgiving [may frustrate experts]
- **B) Expert-friendly** — Fast, keyboard-driven, powerful [may confuse novices]
- **C) Self-explanatory** — Intuitive without documentation [limits feature density]

**Resolution example:**

❌ Vague: "Make this CLI user-friendly"
✅ Specific: "Make CLI novice-friendly: (1) interactive prompts for required args, (2) helpful error messages with examples, (3) --help with concrete use cases, (4) confirm before destructive actions."

---

### "Production-ready"

**Why ambiguous:** Production has different requirements depending on context.

**Interpretation options:**
- **A) MVP** — Core functionality works [minimal error handling, no monitoring]
- **B) Beta** — Works with monitoring [handles common errors, basic logging]
- **C) GA** — Battle-tested [comprehensive error handling, metrics, alerts, runbooks]

**Resolution example:**

❌ Vague: "Make this feature production-ready"
✅ Specific: "Prepare for GA launch: (1) add comprehensive error handling with retries, (2) instrument with metrics (latency, error rate, throughput), (3) add alerts for >5% error rate, (4) write runbook for on-call, (5) achieve 90%+ test coverage."

---

### "Modern"

**Why ambiguous:** Modern by what standard? Technology changes rapidly.

**Interpretation options:**
- **A) Latest versions** — Newest language/framework features [may be unstable]
- **B) Current best practices** — Industry-standard patterns [proven but not bleeding edge]
- **C) Maintained dependencies** — No deprecated/EOL libraries [practical baseline]

**Resolution example:**

❌ Vague: "Use modern React patterns"
✅ Specific: "Use React patterns from 2024+: (1) functional components with hooks, (2) React Query for data fetching, (3) TypeScript for type safety, (4) Vite for build tooling. Avoid: class components, Redux (unless complex state), Create React App."

---

### "Flexible" / "Extensible"

**Why ambiguous:** Flexible how? Over-engineering for hypothetical future needs is wasteful.

**Interpretation options:**
- **A) Configurable** — Runtime configuration via settings [adds complexity]
- **B) Pluggable** — Can swap implementations [adds abstraction layers]
- **C) Future-proof** — Won't need rewrite for known upcoming changes [depends on roadmap]

**Resolution example:**

❌ Vague: "Design a flexible API"
✅ Specific: "Design API to support: (1) adding new payment providers without changing consumers, (2) versioning to avoid breaking changes, (3) configurable rate limits per customer tier. Don't over-engineer for hypothetical needs—extend when requirements are clear."

---

## Multi-Term Ambiguity

Sometimes multiple vague terms compound:

**Example:** "Write a comprehensive, user-friendly guide"
- Comprehensive for whom? (Novices vs experts)
- User-friendly how? (Tutorial vs reference)
- Guide about what specifically? (Getting started vs advanced features)

**Resolution approach:**
Disambiguate each term systematically:
1. Audience: novices or experts?
2. Format: tutorial (step-by-step) or reference (lookup)?
3. Scope: getting started or full feature coverage?

---

## Contextual Disambiguation

Sometimes context clarifies ambiguity:

**Example 1:** "Optimize this sorting algorithm"
- Context: Computer science interview
- Inference: Optimize for time complexity (standard interview focus)
- But still confirm: "Optimize for time complexity? (Standard for interviews, but I can optimize for space if needed)"

**Example 2:** "Make this API secure"
- Context: Auth endpoint
- Inference: Focus on authentication/authorization
- But still confirm: "Focus on auth security (rate limiting, token validation)? Or also input validation and injection prevention?"

**Rule:** Use context to guide interpretation, but always confirm assumptions.

---

## Resolution Template

When you detect ambiguity:

```
I noticed "[vague term]" could mean:
- Option A: [interpretation 1] [implication]
- Option B: [interpretation 2] [implication]
- Option C: [interpretation 3] [implication]

Which matches your intent? Or if I'm overthinking, just tell me to proceed with [reasonable default].
```

---

## When NOT to Disambiguate

Don't over-disambiguate obvious cases:

**Example:** User is clearly an expert giving precise technical instructions
- "Use memoization to optimize re-renders"
- Context makes it clear, don't ask "What do you mean by optimize?"

**Example:** Trivial low-stakes task
- "Add a comment explaining this regex"
- Just pick a reasonable interpretation, no need to ask

**Rule:** Disambiguate when:
1. High stakes (wrong choice costly)
2. Multiple viable interpretations
3. No clear context clues
4. User will benefit from being explicit

---

## Common Mistakes

**Mistake 1: Assuming Without Asking**
Guessing user intent leads to misalignment. "I thought you meant comprehensive as in exhaustive, but you wanted an overview."

**Mistake 2: Asking Too Many Questions**
Bombarding with questions is exhausting. Group related ambiguities, prioritize critical ones.

**Mistake 3: Offering Too Many Options**
More than 3-4 options is decision paralysis. Present most likely interpretations.

**Mistake 4: Not Providing Defaults**
"Which do you prefer?" without guidance makes users do unnecessary work. Recommend when appropriate: "I suggest Option B (balanced approach) unless you have specific constraints."

---

## Key Principle

Ambiguity is normal in natural language. The skill isn't avoiding ambiguity—it's detecting and resolving it systematically before execution. Good prompts make implicit assumptions explicit.
