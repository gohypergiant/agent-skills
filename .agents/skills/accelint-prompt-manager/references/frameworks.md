# Prompt Frameworks

Three proven frameworks for structuring prompts based on task type. Each framework excels in specific scenarios.

## What

Structured templates that organize prompt elements systematically. Frameworks ensure completeness while maintaining clarity. They're organizational tools, not rigid formulas.

## Why It Matters

Ad-hoc prompts miss critical elements. Frameworks provide checklist-like completeness while adapting to context. The key insight: different task types need different structures.

---

## Framework Selection Logic

| Task Type | Framework | Why |
|-----------|-----------|-----|
| **Structured output needed** | CO-STAR | Format-driven: emphasizes response structure |
| **Multi-step procedure** | RISEN | Process-driven: focuses on sequential steps |
| **Needs examples for clarity** | RODES | Example-driven: shows desired output patterns |

---

## CO-STAR Framework (Format-Driven)

**Best For:** Tasks requiring specific output formats, structured responses, or consistent styling.

**Components:**
- **C**ontext: Background information, setting, constraints
- **O**bjective: What you want accomplished
- **S**tyle: Tone, formality level, writing style
- **T**one: Emotional coloring (professional, friendly, technical)
- **A**udience: Who will consume this output
- **R**esponse format: Structure, length, formatting requirements

**Example Application:**

*User request:* "Write API documentation"

*CO-STAR optimization (silent routing):*
```
You're documenting a REST API for frontend developers integrating it for the first time.

Create clear, practical API documentation covering authentication, rate limits, and error handling.

Use clear technical writing with practical examples. Maintain a helpful, professional tone suitable for developers new to our system.

Output format:
- Overview section (2-3 sentences)
- Authentication (code example with curl)
- Rate limits (specific numbers and headers)
- Error responses (table with codes, meanings, actions)
- Example requests/responses for each endpoint
```

**When to Use:**
- Documentation requiring specific structure
- Outputs with formatting requirements
- Audience-specific tailoring needed
- Style consistency matters

---

## RISEN Framework (Process-Driven)

**Best For:** Multi-step procedures, workflows, tasks requiring sequential execution.

**Components:**
- **R**ole: Perspective or expertise level to adopt
- **I**nstructions: High-level guidance and constraints
- **S**teps: Specific sequential actions to take
- **E**nd goal: What success looks like
- **N**arrowing: Clarifications, edge cases, what to avoid

**Example Application:**

*User request:* "Help me refactor this authentication code"

*RISEN optimization (silent routing):*
```
You're a senior engineer reviewing legacy authentication code for security and maintainability improvements.

Refactor this code following security best practices. Preserve existing functionality while improving structure, error handling, and testability.

Steps:
1. Analyze current implementation for security vulnerabilities
2. Identify code smells and structural issues
3. Propose refactoring approach with specific improvements
4. Implement changes incrementally (auth logic → error handling → tests)
5. Verify functionality matches original behavior

End goal: Secure, maintainable authentication code with 80%+ test coverage and no breaking changes to existing API contracts.

Clarifications:
- Do NOT change the authentication protocol (OAuth 2.0)
- Preserve existing database schema
- Add tests alongside refactoring, not after
- Flag any breaking changes for review before implementing
```

**When to Use:**
- Complex multi-step tasks
- Workflow optimization needed
- Sequential dependencies exist
- Role perspective improves quality

---

## RODES Framework (Example-Driven)

**Best For:** Tasks where showing examples clarifies intent better than describing it.

**Components:**
- **R**ole: Expertise or perspective to adopt
- **O**bjective: What you want accomplished
- **D**etails: Constraints, requirements, context
- **E**xamples: Concrete instances of desired output
- **S**ense check: Validation criteria or quality checks

**Example Application:**

*User request:* "Write commit messages for these changes"

*RODES optimization (silent routing):*
```
You're a senior engineer writing commit messages following conventional commit format.

Write clear, consistent commit messages for this pull request's changes.

Details:
- Follow conventional commits: type(scope): description
- Types: feat, fix, chore, docs, refactor, test, perf
- Description: imperative mood, lowercase, no period, max 72 chars
- Include body for non-obvious changes explaining why (not what)

Examples:
✅ feat(auth): add rate limiting to login endpoint
✅ fix: resolve race condition in websocket handler
✅ chore: update dependencies for CVE-2024-1234
✅ refactor(api): extract validation logic into middleware

❌ Fixed some bugs (too vague)
❌ feat: Added rate limiting feature. (period, not imperative)
❌ Updated code to make it better (what changed? why?)

Sense check:
- Does each message explain what changed and why?
- Can someone understand the change without seeing the code?
- Are breaking changes flagged with BREAKING CHANGE: in body?
```

**When to Use:**
- Style/format matching required
- Abstract descriptions are ambiguous
- Quality improves by showing not telling
- Pattern recognition helpful

---

## Silent Framework Routing

**Critical Rule:** NEVER expose framework names or methodology in output.

❌ **Bad:**
```
"Using the CO-STAR framework to optimize your prompt:
[Context] You're a senior engineer...
[Objective] Refactor the authentication system..."
```

✅ **Good:**
```
"You're a senior engineer refactoring legacy authentication code. Make it secure, maintainable, and test-covered while preserving existing API contracts..."
```

**Rationale:** Users care about clarity and results, not prompt engineering methodology. Framework names add noise without value.

---

## Combining Frameworks

Some tasks benefit from hybrid approaches:

**Example: Complex Implementation Task**
- Use RISEN for overall workflow structure (Steps)
- Use RODES for code style examples (Examples)
- Use CO-STAR for output format specifications (Response format)

**When combining:**
1. Choose primary framework based on task type
2. Borrow specific components from others as needed
3. Maintain coherent structure (don't create Frankenstein prompts)

---

## Framework Adaptation

Frameworks are starting points, not rigid templates. Adapt based on:

**Task Complexity:**
- Simple tasks: May need only 3-4 components
- Complex tasks: Use full framework + additional context

**User Expertise:**
- Newcomers: Add more examples and explanations
- Experts: Reduce verbosity, assume context

**Execution Context:**
- Interactive: Progressive disclosure possible
- API/batch: Must be complete and self-contained

**Token Budget:**
- Constrained: Compress components, prioritize essentials
- Generous: Expand with examples and edge cases

---

## Quality Checks

After applying any framework, verify:

✓ All ambiguities resolved or flagged for decision
✓ Success criteria are measurable
✓ Constraints specified where needed
✓ Audience clearly defined
✓ Format requirements explicit
✓ No framework terminology in output

---

## Common Mistakes

**Mistake 1: Rigid Application**
Don't force every component if unnecessary. "Tone" may be irrelevant for data extraction tasks.

**Mistake 2: Framework Proliferation**
Don't invent new frameworks. These three cover 95% of use cases. Resist "Not Invented Here" syndrome.

**Mistake 3: Exposing Methodology**
Users don't care about CO-STAR vs RISEN. They care about clear, actionable prompts.

**Mistake 4: Missing the Task Type**
Applying format-driven framework to process-heavy task misaligns structure with need. Match framework to task type.

---

## When to Skip Frameworks

Frameworks add structure but aren't always necessary:

**Skip when:**
- Request is already clear and complete
- Adding structure would add complexity without benefit
- User explicitly wants informal, conversational approach
- Task is too simple to warrant systematic structure

**Use when:**
- Ambiguity exists in original request
- Multiple interpretations possible
- Complex task requires organization
- Output quality depends on completeness

Remember: Frameworks are tools for clarity, not goals in themselves.
