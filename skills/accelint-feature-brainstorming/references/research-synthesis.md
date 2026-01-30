# Research Synthesis

Template and examples for synthesizing research findings.

---

## Research Synthesis Template

Use this template to structure findings consistently:

```markdown
## Research Summary

### Pattern: [Name]
- **Where used:** [Company/Project examples]
- **Core idea:** [1-2 sentence description]
- **Strengths:** [What it excels at]
- **Weaknesses:** [Known limitations]
- **Fit score:** [High/Medium/Low] - [Why for our context]

### Pattern: [Name]
- **Where used:** [Company/Project examples]
- **Core idea:** [1-2 sentence description]
- **Strengths:** [What it excels at]
- **Weaknesses:** [Known limitations]
- **Fit score:** [High/Medium/Low] - [Why for our context]

### Recommendation
Based on [key requirement], I recommend [Pattern] because [rationale].
```

---

## Research Process

### Step 1: Search

Identify 2-4 relevant sources:
- Industry leaders' engineering blogs
- Open source projects solving similar problems
- Academic papers (if applicable)
- Conference talks or case studies

### Step 2: Extract Patterns

For each source, identify:
- Core architectural approach
- Key design decisions
- Trade-offs they faced
- Lessons learned

### Step 3: Categorize

Group similar approaches into patterns:
- Pattern A: [Approach type]
- Pattern B: [Alternative approach]
- Pattern C: [Third option if significantly different]

### Step 4: Evaluate Fit

For each pattern, score against requirements:
- **High fit:** Solves our exact problem, aligns with constraints
- **Medium fit:** Solves problem but has trade-offs
- **Low fit:** Interesting but not applicable

### Step 5: Recommend

Choose one pattern and explain why based on:
- Alignment with requirements
- Team expertise
- Technical constraints
- Time/resource availability

---

## Example: User Notification System

### Pattern: Polling-based
- **Where used:** Early GitHub, Simple web apps
- **Core idea:** Client periodically checks server for new notifications
- **Strengths:** Simple to implement, works everywhere, easy to debug
- **Weaknesses:** Network overhead, delayed delivery, server load with many users
- **Fit score:** Medium - Simple but doesn't meet real-time requirement

### Pattern: WebSocket push
- **Where used:** Slack, Discord, modern chat apps
- **Core idea:** Persistent connection, server pushes notifications instantly
- **Strengths:** Real-time delivery, efficient for active users, bidirectional
- **Weaknesses:** Complex infrastructure, connection management, scaling challenges
- **Fit score:** High - Meets real-time needs, team has WebSocket experience

### Pattern: Server-Sent Events (SSE)
- **Where used:** Facebook notifications, Basecamp
- **Core idea:** One-way server-to-client stream over HTTP
- **Strengths:** Simpler than WebSocket, automatic reconnection, HTTP-friendly
- **Weaknesses:** One-way only, limited browser support on old clients
- **Fit score:** High - Simpler than WebSocket, sufficient for notifications

### Recommendation
Based on real-time requirement and team experience, I recommend **Server-Sent Events**. It's simpler than WebSocket (no bidirectional complexity), provides real-time delivery, and leverages existing HTTP infrastructure. The team can implement it faster than WebSocket while meeting all requirements.

---

## Synthesis Anti-Patterns

### ❌ Incorrect: Info dump without structure
```
I found that Company X uses approach A and Company Y uses approach B.
Company Z tried approach C but it didn't work well. There are many
options available...
```

**Why wrong:** No clear patterns, no evaluation, no recommendation.

### ✅ Correct: Structured patterns with recommendation
```
## Research Summary

### Pattern: Approach A
- Where used: Company X, Company Y
- Core idea: [1-2 sentences]
- Strengths: [specific]
- Weaknesses: [specific]
- Fit: High - [why]

### Recommendation
Approach A because [rationale].
```

### ❌ Incorrect: Too many patterns
```
I found 7 different approaches: A, B, C, D, E, F, G...
```

**Why wrong:** Overwhelming, analysis paralysis.

### ✅ Correct: 2-3 distinct patterns
```
I found three main approaches: Event-driven, Polling, and Hybrid.
```

### ❌ Incorrect: No recommendation
```
Here are the patterns I found. Which do you prefer?
```

**Why wrong:** User hired you to have opinions. Recommend something.

### ✅ Correct: Recommend with rationale
```
I recommend Pattern A because [requirement alignment]. Pattern B
is also viable if [alternative scenario].
```

---

## Fit Scoring Rubric

### High Fit (7-10 points)

Score if pattern:
- ✅ Solves exact problem (3 pts)
- ✅ Team has relevant expertise (2 pts)
- ✅ Fits technical constraints (2 pts)
- ✅ Reasonable implementation cost (2 pts)
- ✅ Proven in production at scale (1 pt)

### Medium Fit (4-6 points)

Score if pattern:
- ⚠️ Solves most of problem (2 pts)
- ⚠️ Team can learn it (1 pt)
- ⚠️ Requires some constraint adjustments (1 pt)
- ⚠️ Moderate implementation cost (1 pt)
- ⚠️ Used in production somewhere (1 pt)

### Low Fit (0-3 points)

Score if pattern:
- ❌ Partial solution only (1 pt)
- ❌ Team unfamiliar, steep learning curve (0 pts)
- ❌ Conflicts with constraints (0 pts)
- ❌ High implementation cost (0 pts)
- ❌ Experimental, not proven (0 pts)

---

## Research Time Limits

**15-minute research:** 
- Search 2 sources
- Extract 2 patterns
- Basic fit assessment

**30-minute research:**
- Search 3-4 sources
- Extract 2-3 patterns
- Detailed fit assessment with scoring

**60-minute research:**
- Search 5+ sources
- Extract 3-4 patterns
- Comprehensive analysis with trade-offs
- Consider hybrid approaches

**Never exceed:** 90 minutes of research. If not enough info by then, document assumptions and proceed.

---

## Example: Brief vs Comprehensive

### Brief (15 min)
```
## Research Summary

Pattern A (Event-driven): Used by Slack. Push-based, real-time.
Fit: High - meets requirements.

Pattern B (Polling): Simpler but delayed delivery.
Fit: Low - doesn't meet real-time need.

Recommend: Pattern A
```

### Comprehensive (60 min)
```
## Research Summary

### Pattern: Event-driven (WebSocket)
- Where: Slack, Discord, Figma
- Core: Persistent bidirectional connection
- Strengths: True real-time, efficient for high activity
- Weaknesses: Complex connection management, requires WebSocket infrastructure
- Fit: High (9/10) - Team experience, meets all requirements
- Implementation: 2-3 weeks with existing framework

### Pattern: Event-driven (SSE)
- Where: Facebook, GitHub, Basecamp
- Core: Server-push over HTTP
- Strengths: Simpler than WebSocket, auto-reconnect, HTTP-friendly
- Weaknesses: One-way only, older browser issues
- Fit: High (8/10) - Simpler implementation, sufficient
- Implementation: 1-2 weeks

### Pattern: Polling with long-polling optimization
- Where: Early WhatsApp Web, legacy systems
- Core: Smart polling that holds connection until data
- Strengths: Works everywhere, gradual degradation
- Weaknesses: Network overhead, not truly real-time
- Fit: Medium (6/10) - Fallback option only
- Implementation: 1 week

### Recommendation
**Server-Sent Events (SSE)** - Faster implementation (1-2 weeks vs 2-3 weeks), simpler architecture, meets all requirements. WebSocket is overkill since we don't need bidirectional communication. Use polling as automatic fallback for old browsers.
```
