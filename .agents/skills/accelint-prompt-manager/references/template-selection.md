# Template Selection

Guide for choosing the right prompt template based on task type. Each template optimizes for specific workflows.

## What

12 pre-built prompt templates organized by common software engineering task types. Each template includes structure, tone, and quality criteria tuned for its domain.

## Why It Matters

Different tasks need different prompt structures. Code review prompts differ from debugging prompts differ from creative writing prompts. Templates accelerate optimization by starting from proven patterns.

---

## Template Library

### 1. Analytical

**When to use:** Data analysis, metrics interpretation, research synthesis, pattern finding.

**Characteristics:**
- Objective, evidence-based reasoning
- Structured findings (often numbered or bulleted)
- Data-driven conclusions
- Clear methodology

**Key elements to specify:**
- Data source/format
- Analysis objectives (what questions to answer)
- Required output format (charts, tables, summary)
- Statistical rigor level

**Example prompt structure:**
```
Analyze [data source] to answer: [specific questions]

Data format: [structure description]
Analysis methods: [statistical techniques, if applicable]

Output format:
1. Executive summary (key findings)
2. Detailed analysis (evidence + reasoning)
3. Recommendations (actionable next steps)
4. Limitations/caveats

Success criteria: [measurable validation]
```

**Full template:** `assets/prompt-templates/analytical.md`

---

### 2. Creative

**When to use:** Writing, design, ideation, naming, marketing copy, storytelling.

**Characteristics:**
- Subjective quality criteria
- Tone and style matter significantly
- Multiple valid approaches exist
- Requires examples for calibration

**Key elements to specify:**
- Target audience
- Tone (professional, casual, playful, etc.)
- Constraints (length, what to avoid, brand guidelines)
- Examples of desired style
- Success criteria (even if subjective)

**Example prompt structure:**
```
Create [creative artifact] for [audience]

Context: [background, purpose, constraints]

Tone/Style: [desired feel, with examples if possible]
Must include: [required elements]
Avoid: [things that don't fit brand/purpose]

Examples of desired style:
[2-3 concrete examples showing the pattern]

Length: [word count or time/size limits]
Format: [structure requirements]
```

**Full template:** `assets/prompt-templates/creative.md`

---

### 3. Debugging

**When to use:** Error investigation, bug fixing, root cause analysis, troubleshooting.

**Characteristics:**
- Problem-first orientation
- Systematic investigation approach
- Hypothesis-driven debugging
- Verification of fixes

**Key elements to specify:**
- Observed problem (symptoms)
- Expected behavior
- Environment details
- Steps already tried
- Error messages/logs

**Example prompt structure:**
```
Debug this issue: [symptom description]

Expected behavior: [what should happen]
Actual behavior: [what's happening instead]
Error messages: [exact error text/logs]

Environment:
- [relevant versions, configuration]

Already tried:
- [attempts that didn't work]

Investigation approach:
1. Reproduce the issue
2. Isolate the root cause
3. Propose fix with rationale
4. Verify fix resolves issue

Success criteria: Issue resolved, root cause understood
```

**Full template:** `assets/prompt-templates/debugging.md`

---

### 4. Documentation

**When to use:** READMEs, API docs, guides, tutorials, code comments.

**Characteristics:**
- Audience-aware explanations
- Clear structure (often hierarchical)
- Examples and code snippets
- Practical, actionable information

**Key elements to specify:**
- Audience (skill level, domain knowledge)
- Documentation type (reference, tutorial, guide)
- Required sections
- Depth level (overview vs comprehensive)
- Format requirements

**Example prompt structure:**
```
Write [doc type] for [audience]

Purpose: [what reader will learn/accomplish]

Required sections:
1. [section name]: [what to cover]
2. [section name]: [what to cover]
...

For each section:
- Include code examples with explanations
- Highlight common pitfalls
- Provide practical use cases

Tone: [helpful/professional/technical]
Depth: [overview/intermediate/comprehensive]

Success criteria: Reader can [accomplish goal] without additional help
```

**Full template:** `assets/prompt-templates/documentation.md`

---

### 5. Exploration

**When to use:** Codebase discovery, pattern finding, understanding architecture, learning new systems.

**Characteristics:**
- Discovery-oriented
- Systematic exploration strategy
- Documentation of findings
- Identifies key files/patterns

**Key elements to specify:**
- Exploration goal (what to understand)
- Scope (whole codebase vs specific area)
- Output format (notes, diagram, summary)
- Depth level

**Example prompt structure:**
```
Explore [codebase/area] to understand [specific aspect]

Goals:
- [what to discover]
- [patterns to identify]
- [questions to answer]

Exploration approach:
1. Start with [entry points]
2. Map [relationships/dependencies]
3. Identify [key patterns/conventions]

Output format:
- Summary of architecture/patterns
- Key files with their purposes
- Findings organized by [category]

Stop condition: [when is exploration complete]
```

**Full template:** `assets/prompt-templates/exploration.md`

---

### 6. Implementation

**When to use:** Feature building, coding, algorithm implementation, system building.

**Characteristics:**
- Specification-driven
- Quality criteria explicit
- Error handling defined
- Testing requirements included

**Key elements to specify:**
- Functional requirements (what it must do)
- Non-functional requirements (performance, security)
- Constraints (libraries, patterns, compatibility)
- Error handling strategy
- Testing expectations

**Example prompt structure:**
```
Implement [feature/component] that [core functionality]

Requirements:
- [functional requirement 1]
- [functional requirement 2]
...

Constraints:
- Use [libraries/frameworks]
- Follow [patterns/conventions]
- Compatible with [existing code]

Error handling:
- [scenario 1]: [how to handle]
- [scenario 2]: [how to handle]

Testing:
- Unit tests for [components]
- Test these edge cases: [list]

Success criteria:
✓ [requirement 1 met]
✓ [requirement 2 met]
✓ Tests pass
✓ No breaking changes to existing functionality
```

**Full template:** `assets/prompt-templates/implementation.md`

---

### 7. Planning

**When to use:** Architecture design, approach design, project planning, task breakdown.

**Characteristics:**
- Design-before-execution
- Trade-off analysis
- Phased approach
- Decision rationale documented

**Key elements to specify:**
- Goals and constraints
- Known requirements and unknowns
- Trade-off dimensions (speed, cost, complexity)
- Success criteria
- Timeline/resource constraints

**Example prompt structure:**
```
Design approach for [project/feature]

Goals:
- [primary objective]
- [secondary objectives]

Constraints:
- [technical constraints]
- [resource constraints]
- [timeline]

Current state:
- [relevant existing architecture]
- [systems this will interact with]

Unknowns to resolve:
- [questions needing answers]

Expected output:
- Recommended approach with rationale
- Alternative approaches with trade-offs
- Phased implementation plan
- Risk assessment
- Decision points needing user input

Success criteria: Clear, actionable plan that can be executed
```

**Full template:** `assets/prompt-templates/planning.md`

---

### 8. Refactoring

**When to use:** Code improvement, restructuring, technical debt reduction, pattern extraction.

**Characteristics:**
- Preserve existing functionality
- Incremental changes
- Testing alongside refactoring
- Clear improvement metrics

**Key elements to specify:**
- Current problems (what needs improvement)
- Goals (readability, performance, maintainability)
- Constraints (no breaking changes, maintain API)
- Testing strategy
- Definition of "improvement"

**Example prompt structure:**
```
Refactor [code/component] to improve [specific aspect]

Current problems:
- [issue 1]
- [issue 2]

Goals:
- [improvement 1]: measured by [metric]
- [improvement 2]: measured by [metric]

Constraints:
- Preserve existing functionality
- Maintain public API
- No breaking changes without explicit approval

Approach:
1. Add tests for current behavior (if missing)
2. Refactor incrementally
3. Verify tests still pass after each change
4. Document significant changes

Success criteria:
✓ [goal 1 metric achieved]
✓ All existing tests pass
✓ No regressions in functionality
```

**Full template:** `assets/prompt-templates/refactoring.md`

---

### 9. Review

**When to use:** Code review, design review, PR review, quality assessment.

**Characteristics:**
- Constructive feedback
- Structured critique
- Specific, actionable suggestions
- Balances positives and concerns

**Key elements to specify:**
- What to review (code, design, docs)
- Review criteria (security, performance, style)
- Tone (supportive vs strict)
- Output format (inline comments vs summary)

**Example prompt structure:**
```
Review [artifact] focusing on [aspects]

Review criteria:
- [criterion 1]: [what to check]
- [criterion 2]: [what to check]

For each finding:
- Severity: [critical/major/minor/nit]
- Location: [specific line/section]
- Issue: [what's wrong]
- Suggestion: [how to improve]
- Rationale: [why this matters]

Tone: [constructive/supportive/strict]

Output format:
1. Overall assessment
2. Critical issues (must fix)
3. Major concerns (should fix)
4. Minor suggestions (nice to have)
5. Positive observations (what's done well)
```

**Full template:** `assets/prompt-templates/review.md`

---

### 10. Security

**When to use:** Vulnerability analysis, threat modeling, security audits, penetration testing planning.

**Characteristics:**
- Risk-focused
- Attack vector enumeration
- Mitigation strategies
- Severity classification

**Key elements to specify:**
- System/code under review
- Threat model (what attacks to consider)
- Security requirements
- Compliance requirements (if applicable)
- Output format

**Example prompt structure:**
```
Security analysis of [system/code]

Scope: [what to analyze]

Threat model:
- Attacker profile: [capabilities, motivation]
- Assets to protect: [data, functionality]
- Attack vectors to consider: [list]

Analysis approach:
1. Identify potential vulnerabilities
2. Assess severity (CVSS or similar)
3. Propose mitigations
4. Prioritize fixes

For each finding:
- Vulnerability: [description]
- Attack scenario: [how it could be exploited]
- Impact: [what attacker could achieve]
- Severity: [critical/high/medium/low]
- Mitigation: [how to fix]

Output: Prioritized list of findings with actionable mitigations
```

**Full template:** `assets/prompt-templates/security.md`

---

### 11. Testing

**When to use:** Test writing, test strategy, QA planning, coverage improvement.

**Characteristics:**
- Coverage-oriented
- Edge case enumeration
- Clear pass/fail criteria
- Test organization strategy

**Key elements to specify:**
- What to test (unit, integration, E2E)
- Coverage targets
- Critical scenarios
- Test framework/conventions
- Mocking strategy

**Example prompt structure:**
```
Write [test type] tests for [component/feature]

Test framework: [Jest/pytest/etc]
Coverage target: [percentage or specific scenarios]

Critical test cases (priority order):
1. [scenario]: [expected behavior]
2. [scenario]: [expected behavior]
...

Edge cases to cover:
- [edge case 1]
- [edge case 2]

Mocking strategy:
- Mock [external dependencies]
- Use real [internal dependencies]

Test organization:
- File location: [path]
- Naming convention: [pattern]
- Setup/teardown: [requirements]

Success criteria:
✓ All critical scenarios covered
✓ Edge cases tested
✓ [coverage target] achieved
✓ Tests are deterministic (no flakiness)
```

**Full template:** `assets/prompt-templates/testing.md`

---

### 12. Troubleshooting

**When to use:** System issues, performance problems, incident response, operational debugging.

**Characteristics:**
- Urgency-aware
- Systematic diagnostic approach
- Mitigation before root cause
- Documentation of findings

**Key elements to specify:**
- Problem symptoms
- Impact (users affected, severity)
- Timeline/urgency
- Available tools/access
- Investigation constraints

**Example prompt structure:**
```
Troubleshoot [system/issue]

Symptoms:
- [observable problem]
- Started: [when]
- Impact: [affected users/systems]

Urgency: [critical/high/medium/low]

Available tools:
- [monitoring dashboards]
- [log access]
- [diagnostic commands]

Investigation approach:
1. Immediate mitigation (if needed)
2. Gather diagnostic data
3. Form hypotheses
4. Test hypotheses systematically
5. Identify root cause
6. Implement permanent fix

For each hypothesis:
- Theory: [explanation]
- Test: [how to validate/invalidate]
- Result: [findings]

Output:
- Immediate mitigation (if needed)
- Root cause analysis
- Permanent fix recommendation
- Prevention strategies
```

**Full template:** `assets/prompt-templates/troubleshooting.md`

---

## Selection Logic

**Decision tree:**

1. **Is the task primarily creative/subjective?**
   - Yes → Creative template
   - No → Continue

2. **Is there a problem to solve?**
   - Bug/error → Debugging template
   - System issue → Troubleshooting template
   - Security concern → Security template
   - No problem → Continue

3. **What's the primary action?**
   - Building new → Implementation template
   - Improving existing → Refactoring template
   - Understanding existing → Exploration template
   - Planning future work → Planning template
   - Evaluating quality → Review template

4. **What's the output type?**
   - Tests → Testing template
   - Documentation → Documentation template
   - Analysis/insights → Analytical template

---

## Customization

Templates are starting points, not rigid formulas:

**Customize based on:**
- User expertise (adjust explanation depth)
- Project context (add domain-specific elements)
- Time constraints (expand or compress)
- Quality requirements (adjust rigor)

**Common customizations:**
- Add project-specific conventions
- Include relevant examples from codebase
- Adjust tone for audience
- Add/remove sections based on scope

---

## When NOT to Use Templates

**Skip templates when:**
- Request is already clear and complete
- Task is too simple to warrant structure
- User explicitly wants informal approach
- Template would add complexity without benefit

Templates optimize unclear prompts. Don't force structure onto clarity.

---

## Loading Templates

Templates live in `assets/prompt-templates/`. Load on explicit request or when optimization benefits from detailed structure:

**Explicit loading:**
User: "Use the debugging template"
Action: Load `assets/prompt-templates/debugging.md`

**Implicit loading:**
User: "Help me debug this error"
Action: Apply debugging template structure silently (don't load full file unless complex case needs detailed reference)

**Progressive disclosure:**
Start with template structure outline (in this file).
Load full template only if detailed guidance needed.

---

## Key Principle

Templates accelerate optimization by providing proven patterns. They're tools for clarity, not bureaucratic requirements. Use when helpful, skip when not.
