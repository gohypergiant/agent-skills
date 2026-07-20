# Safe Optimization Techniques

Five proven techniques that reliably improve prompt quality without risk of degradation.

## What

Specific, actionable optimization methods that work across task types and models. These techniques have been validated through extensive production use.

## Why It Matters

Not all optimization attempts improve quality. Some techniques help in specific contexts but harm in others. These five are universally safe—they improve clarity without introducing new problems.

---

## Technique 1: Specificity Injection

**What:** Replace vague terms with concrete, measurable criteria.

**Why it works:** Models perform better with specific targets than abstract goals. "Better" is subjective; "80%+ test coverage" is objective.

**How to apply:**
1. Identify vague terms (better, comprehensive, fast, clean, secure)
2. Ask: "What would 'success' look like concretely?"
3. Replace with measurable criteria or specific examples

**Examples:**

❌ **Before:** "Write comprehensive tests"
✅ **After:** "Write tests covering: (1) happy path, (2) authentication failures (401/403), (3) rate limiting (429), (4) malformed input (400). Target 80%+ branch coverage."

❌ **Before:** "Optimize performance"
✅ **After:** "Reduce API response time from current 800ms to <200ms at p95. Focus on: (1) database query optimization, (2) caching frequently-accessed data, (3) parallel requests where possible."

❌ **Before:** "Make code cleaner"
✅ **After:** "Refactor for readability: (1) extract magic numbers to named constants, (2) split functions >50 lines into smaller focused functions, (3) add JSDoc comments for non-obvious logic."

**When to use:** Every time you see unmeasurable success criteria.

---

## Technique 2: Constraint Addition

**What:** Define boundaries for creative freedom to ensure consistent, relevant outputs.

**Why it works:** Without constraints, creative tasks produce wildly inconsistent results. Constraints don't limit creativity—they channel it productively.

**How to apply:**
1. Identify creative/subjective elements (tone, style, format, scope)
2. Specify: what to include, what to avoid, length, audience, examples
3. Balance: enough constraint for consistency, enough freedom for quality

**Examples:**

❌ **Before:** "Write a blog post about our new feature"
✅ **After:** "Write a 500-word blog post for technical decision-makers announcing our new caching feature. Tone: professional but approachable. Structure: problem statement, solution overview, 2-3 specific benefits with metrics, call-to-action. Avoid: marketing hype, buzzwords, technical jargon without explanation."

❌ **Before:** "Design an API"
✅ **After:** "Design a RESTful API for user management. Constraints: (1) follow JSON:API specification, (2) use JWT authentication, (3) support pagination on list endpoints, (4) version with /v1/ prefix, (5) match existing naming conventions (snake_case for fields)."

❌ **Before:** "Explain this code"
✅ **After:** "Explain this authentication code for frontend developers new to our system. Include: (1) high-level flow diagram, (2) explanation of each function's purpose, (3) common pitfalls and how to avoid them. Length: 2-3 paragraphs max. Avoid: implementation details they don't need to know."

**When to use:** Any task with subjective success criteria or creative elements.

---

## Technique 3: Context Positioning

**What:** Place critical information at the beginning and end of prompts, not in the middle.

**Why it works:** The "lost-in-the-middle" phenomenon causes models to weaken attention on middle sections of long inputs. Start and end positions get highest attention weight.

**How to apply:**
1. **Front-load:** Most critical instructions, primary objective
2. **Middle:** Supporting details, examples, reference material
3. **End:** Quality checks, constraints, success criteria (second-highest importance)
4. **Alternative:** Reference external files for extensive context instead of inlining

**Examples:**

❌ **Before:**
```
[2000 words of API documentation]
Based on all of the above, implement authentication middleware that handles JWT validation.
Also make sure to check token expiration and refresh if needed.
```

✅ **After:**
```
Implement authentication middleware for Express.js that validates JWT tokens, checks expiration, and refreshes if needed.

API documentation: [link or separate file]

Critical requirements:
- Validate signature using RS256 algorithm
- Check token expiration within 5-minute window
- Refresh tokens automatically if <10 minutes until expiration
- Return 401 for invalid/expired tokens
- Attach decoded user info to req.user
```

❌ **Before (long research context):**
```
Here's a research paper about sorting algorithms [3000 words]...
somewhere in the middle: "implement quicksort"
```

✅ **After:**
```
Implement quicksort algorithm in Python with these requirements:
- In-place sorting (O(log n) space)
- Randomized pivot selection to avoid worst-case
- Handle edge cases: empty array, single element, duplicates

Background research on quicksort: [link to paper]

Success criteria:
- Passes test suite with arrays up to 10k elements
- Average O(n log n) time complexity verified via profiling
```

**When to use:** Any prompt >500 words or with extensive reference material.

---

## Technique 4: Pronoun Elimination

**What:** Replace ambiguous pronouns ("it", "this", "that", "them") with specific nouns in multi-step instructions.

**Why it works:** In complex workflows, pronouns become ambiguous after several steps. Explicit nouns eliminate confusion and reduce execution drift.

**How to apply:**
1. Scan multi-step instructions for pronouns
2. Identify what each pronoun refers to
3. Replace with specific noun (even if repetitive)
4. Prioritize clarity over elegance

**Examples:**

❌ **Before:**
```
1. Parse the JSON input
2. Validate it against the schema
3. Transform it using the rules
4. Save it to the database
```

✅ **After:**
```
1. Parse the JSON input into a data object
2. Validate the data object against schema.json
3. Transform the validated data using transform_rules.py
4. Save the transformed data to the users table
```

❌ **Before:**
```
Read the config file, parse it, validate that it has all required fields, and if it's valid, use it to initialize the application. If it's not valid, log the errors and exit.
```

✅ **After:**
```
Read the config file at config/app.json.
Parse the config file into a config object.
Validate the config object has required fields: database_url, api_key, port.
If the config object is valid: use the config object to initialize the application.
If the config object is invalid: log validation errors to stderr and exit with code 1.
```

**When to use:** Any instructions with >3 sequential steps or nested conditions.

---

## Technique 5: Success Criteria Definition

**What:** Pin objectives to measurable outcomes, specific edge cases, or concrete examples of acceptable output.

**Why it works:** Models can't hit a target they can't see. Explicit success criteria enable self-validation and consistent quality.

**How to apply:**
1. Ask: "How will I know this is complete and correct?"
2. Convert answer into measurable checklist
3. Include: positive criteria (what success looks like) and negative criteria (what to avoid)
4. Add examples if description alone is ambiguous

**Examples:**

❌ **Before:** "Write good error messages"
✅ **After:** "Write error messages that include: (1) what went wrong in user-friendly language, (2) what the user can do to fix it, (3) error code for support reference. Example: 'Invalid email format (ERR_001). Please enter a valid email address like user@example.com.'"

❌ **Before:** "Refactor this code"
✅ **After:** "Refactor this code to meet these criteria: (1) all functions <30 lines, (2) cyclomatic complexity <10, (3) no duplicate code blocks >5 lines, (4) all public functions have JSDoc comments, (5) existing tests still pass without modification."

❌ **Before:** "Create documentation"
✅ **After:** "Create API documentation with these sections: (1) Authentication (with curl example), (2) Rate limits (specific numbers), (3) Error codes (table with code, meaning, action), (4) Example requests/responses for each endpoint. Success criteria: a new developer can integrate the API without asking questions."

**When to use:** Every task. If you can't define success criteria, clarify with user before optimizing.

---

## Combining Techniques

These techniques compound—using multiple together amplifies effectiveness:

**Example: Combining all 5 techniques**

❌ **Original:** "Write tests for the API and make sure they're good"

✅ **Optimized:**

**[Technique 1: Specificity Injection]**
- Target: 80%+ branch coverage, all endpoints tested

**[Technique 2: Constraint Addition]**
- Use Jest framework, follow existing test file structure
- Test files in `tests/api/` directory
- Mock external dependencies (database, third-party APIs)

**[Technique 3: Context Positioning]**
```
Write comprehensive tests for the user management API.

Critical test cases (priority order):
1. Authentication: valid JWT → 200, missing JWT → 401, expired JWT → 401
2. Authorization: admin can delete users, regular user cannot → 403
3. Input validation: malformed email → 400 with error details
4. Rate limiting: >100 requests/min → 429 with Retry-After header
5. Edge cases: delete non-existent user → 404, create duplicate user → 409

Existing API documentation: docs/api.md

Success criteria below ⬇️
```

**[Technique 4: Pronoun Elimination]**
- "Test the authentication endpoint" not "test it"
- "Mock the database with test fixtures" not "mock it"

**[Technique 5: Success Criteria Definition]**
```
Success criteria:
✓ All 5 critical test cases pass
✓ 80%+ branch coverage (verify with `npm run coverage`)
✓ Tests run in <5 seconds total
✓ No tests depend on external services (all mocked)
✓ Clear test names: `POST /users returns 400 for invalid email`
```

---

## When NOT to Apply

**Don't over-optimize simple tasks:**
- "Fix typo in line 42" doesn't need extensive constraints
- Simple, unambiguous requests don't benefit from heavyweight optimization

**Don't add constraints that limit necessary flexibility:**
- Creative writing may need freedom more than constraints
- Exploratory research shouldn't be over-constrained upfront

**Don't make prompts longer than necessary:**
- Balance: specific enough for quality, concise enough for readability
- If optimization doubles prompt length for 5% quality gain, reconsider

---

## Verification

After applying these techniques, check:

✓ Can someone else execute this prompt and get the same result?
✓ Are success criteria measurable/verifiable?
✓ Are ambiguous terms eliminated or defined?
✓ Is critical information front-loaded or at the end?
✓ Are multi-step instructions free of ambiguous pronouns?

If all five checks pass, optimization is complete.

---

## Key Principle

Safe techniques share a common property: they add clarity without adding risk. They never degrade quality—worst case, they have no effect. That's why they're safe to apply universally.

Unsafe techniques (e.g., adding CoT to reasoning models, using fabrication patterns) can actively harm quality. Know the difference.
