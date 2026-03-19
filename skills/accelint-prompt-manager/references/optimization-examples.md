# Optimization Examples

Before/after transformations showing how to optimize vague prompts into clear, actionable ones.

## What

Real-world examples of prompt optimization across different task types. Each example shows the original vague prompt, analysis of issues, and the optimized version with rationale.

## Why It Matters

Seeing concrete transformations builds intuition faster than abstract principles. These examples demonstrate optimization techniques in action.

---

## Example 1: Vague Implementation Request

### ❌ Before (Vague)
```
"Make the app handle errors better"
```

### Issues Detected
- **Vague success criteria:** "Better" is unmeasurable
- **Undefined scope:** Which errors? All of them?
- **Missing context:** What's wrong with current error handling?
- **No specifications:** How should errors be handled?

### ✅ After (Optimized)
```
Improve error handling in the API layer to provide better user experience and debuggability.

Current problems:
- Generic "Something went wrong" messages don't help users
- Stack traces exposed to frontend (security risk)
- No structured logging for debugging
- Inconsistent error formats across endpoints

Requirements:
1. Return user-friendly error messages with actionable guidance
2. Use consistent error response format: { error: { code, message, details } }
3. Log errors with context (user_id, endpoint, timestamp, stack trace)
4. Map HTTP status codes appropriately (400 for validation, 401 for auth, 500 for server errors)
5. Never expose stack traces or internal details in production

Example error responses:
- Validation: { error: { code: "INVALID_EMAIL", message: "Please enter a valid email address", details: { field: "email" } } }
- Auth: { error: { code: "UNAUTHORIZED", message: "Please log in to access this resource", details: {} } }

Success criteria:
✓ All API endpoints use consistent error format
✓ User-facing messages are helpful and actionable
✓ Errors logged with sufficient context for debugging
✓ No sensitive information exposed
```

### Techniques Applied
- Specificity injection (defined "better")
- Context addition (current problems)
- Success criteria definition (measurable outcomes)
- Constraint addition (security requirements)
- Examples (concrete error responses)

---

## Example 2: Ambiguous Creative Task

### ❌ Before (Ambiguous)
```
"Write documentation for the API"
```

### Issues Detected
- **Undefined audience:** Who will read this?
- **Unclear scope:** All endpoints or specific ones?
- **No format specified:** Reference docs vs tutorial?
- **Missing tone guidance:** Technical vs beginner-friendly?

### ✅ After (Optimized)
```
Write API reference documentation for frontend developers integrating our user management API for the first time.

Audience: Frontend devs familiar with REST APIs but new to our system.

Scope: Cover these endpoints:
- POST /auth/login (authentication)
- GET /users/:id (fetch user)
- PUT /users/:id (update user)
- DELETE /users/:id (delete user)

Required sections for each endpoint:
1. Purpose (what it does, when to use it)
2. Authentication requirements
3. Request format (with curl example)
4. Response format (success and error cases)
5. Common pitfalls and how to avoid them

Tone: Professional but helpful. Explain non-obvious behavior, skip basics (they know REST).

Format:
- Markdown with syntax-highlighted code blocks
- Curl examples that users can copy-paste
- Tables for parameters/fields

Success criteria: A frontend dev can integrate these endpoints without asking questions or reading source code.
```

### Techniques Applied
- Audience definition (frontend devs, skill level)
- Scope clarification (specific endpoints)
- Format specification (markdown, structure)
- Constraint addition (tone, what to include/exclude)
- Success criteria definition (actionable metric)

---

## Example 3: Underspecified Bug Fix

### ❌ Before (Underspecified)
```
"The login isn't working. Fix it."
```

### Issues Detected
- **Vague symptoms:** "Isn't working" how?
- **Missing error details:** No error messages or logs
- **No environment info:** Where is it failing?
- **Unknown root cause:** Need investigation approach

### ✅ After (Optimized)
```
Debug login failure issue affecting users on mobile devices.

Observed behavior:
- Users tap "Login" button
- Loading spinner shows briefly
- Login fails silently (no error message)
- User remains on login screen

Expected behavior:
- Successful login redirects to dashboard
- Failed login shows error message
- Network errors show "Please check connection" message

Environment:
- Occurs on: iOS Safari, Android Chrome
- Does NOT occur on: Desktop browsers
- Started: After deployment yesterday (2024-03-15)
- Affects: ~15% of mobile users

Error logs:
[Paste relevant error logs if available, or note "No errors logged"]

Already tried:
- Verified API endpoint returns 200 OK
- Checked network tab: request completes successfully
- Issue seems frontend-specific

Investigation approach:
1. Reproduce issue in mobile browser dev tools
2. Check mobile-specific code paths in login handler
3. Verify session storage works on mobile browsers
4. Test token handling for mobile vs desktop differences
5. Identify root cause and propose fix

Success criteria:
✓ Root cause identified
✓ Fix resolves issue for affected mobile users
✓ No regressions on desktop
✓ Add test case to prevent regression
```

### Techniques Applied
- Specificity injection (exact symptoms)
- Context addition (environment, timeline)
- Systematic approach (investigation steps)
- Success criteria (verification strategy)

---

## Example 4: Overloaded Prompt

### ❌ Before (Overloaded)
```
"Review this PR for bugs, performance issues, security vulnerabilities, code style, test coverage, documentation completeness, and architectural concerns."
```

### Issues Detected
- **Too many objectives:** 7 distinct concerns
- **Attention dilution:** Quality suffers across all areas
- **No prioritization:** What's most important?
- **Better as sequence:** Some reviews depend on others

### ✅ After (Split & Prioritized)
```
[First review pass - Critical issues]
Review this PR for critical issues that would block merging:

Priority checks:
1. Security: SQL injection, XSS, auth bypass, secrets exposure
2. Correctness: Logic errors, off-by-one, null pointer issues
3. Breaking changes: API contract violations, schema changes without migration

For each finding:
- Severity: blocking/non-blocking
- Location: file:line
- Issue: what's wrong
- Fix: specific recommendation

[Second review pass - Quality]
After critical issues are resolved, review for code quality:

1. Performance: O(n²) algorithms, missing indexes, unnecessary queries
2. Testing: Edge cases covered, test quality, coverage gaps
3. Code style: Follows conventions, naming clarity, DRY violations

[Third review pass - Architecture]
After quality review, assess architectural concerns:

1. Design patterns: Appropriate abstractions, separation of concerns
2. Future maintainability: Flexibility, extensibility, technical debt
3. Documentation: Complex logic explained, API docs updated
```

### Techniques Applied
- Split into sequential reviews (focus)
- Prioritization (critical → quality → architecture)
- Specific criteria for each pass (no ambiguity)
- Output format specified (structured findings)

---

## Example 5: Missing Constraints

### ❌ Before (Unconstrained)
```
"Write a script to process user data"
```

### Issues Detected
- **No input format specified:** CSV? JSON? Database?
- **Undefined processing:** What transformations?
- **No output format:** What's the result?
- **Missing error handling:** What if data is malformed?
- **No success criteria:** How to validate?

### ✅ After (Constrained)
```
Write a Python script to transform user data from CSV export to JSON format for API import.

Input:
- File: users_export.csv
- Format: columns [id, email, first_name, last_name, created_at]
- Size: ~10k rows
- Encoding: UTF-8

Transformation:
- Combine first_name + last_name → full_name
- Parse created_at (format: "YYYY-MM-DD HH:MM:SS") → Unix timestamp
- Validate email format (basic regex check)
- Skip rows with invalid emails (log skipped rows)

Output:
- File: users_import.json
- Format: Array of objects [{id, email, full_name, created_at}]
- Pretty-printed JSON (indent=2)

Error handling:
- Invalid email → skip row, log to errors.txt with row number
- Missing required field → skip row, log with details
- File not found → clear error message and exit
- Write errors → fail gracefully with partial results saved

Success criteria:
✓ All valid rows transformed correctly
✓ Invalid rows logged to errors.txt
✓ Output JSON is valid and parseable
✓ Script completes in <30 seconds for 10k rows

Constraints:
- Use Python 3.8+
- Standard library only (no external dependencies)
- Follow PEP 8 style guidelines
```

### Techniques Applied
- Format specification (input/output)
- Constraint addition (Python version, libraries)
- Error handling strategy (what to do when things fail)
- Success criteria (performance, correctness)
- Context positioning (organized by section)

---

## Example 6: Lost-in-the-Middle Context

### ❌ Before (Poor Context Positioning)
```
[5000 words of database schema documentation]
...somewhere in the middle: "write migration script"...
[2000 more words of API endpoints]
```

### Issues Detected
- **Critical instruction buried:** Hard to find the actual task
- **Context overload:** Too much inline documentation
- **Attention dilution:** Important details lost in volume

### ✅ After (Improved Context Positioning)
```
Write database migration script to add email_verified column to users table.

Critical requirements:
- Add column: email_verified BOOLEAN DEFAULT false NOT NULL
- Existing users: Set to true for users with confirmed_at IS NOT NULL
- Create index: idx_users_email_verified for query performance
- Reversible: Include both up() and down() migrations
- Zero-downtime: Use online DDL where possible

Database schema reference: docs/schema.md (see users table section)
API endpoint impacts: docs/api.md (see /users endpoints)

Migration checklist:
1. Add column with default value (allows existing rows)
2. Backfill data based on confirmed_at status
3. Add index after backfill (avoid locking)
4. Update application code to use new column
5. Test rollback procedure

Success criteria:
✓ Migration runs without errors on test database
✓ Existing users have correct email_verified value
✓ New users default to false
✓ Queries using email_verified use index (verify with EXPLAIN)
✓ Rollback migration restores original state
```

### Techniques Applied
- Context positioning (critical info first, reference docs linked)
- Specificity (exact column definition)
- Process breakdown (step-by-step checklist)
- Success criteria (measurable outcomes)
- External reference (avoid embedding full docs)

---

## Example 7: Ambiguous Pronouns

### ❌ Before (Pronoun Confusion)
```
"Parse the JSON, validate it, transform it according to the rules, then save it to the database. If it fails, log it and retry it up to 3 times."
```

### Issues Detected
- **Ambiguous "it":** Refers to different things
- **Multi-step complexity:** Pronoun ambiguity compounds
- **Unclear error handling:** "If it fails" - which step?

### ✅ After (Explicit Nouns)
```
Process JSON data through a multi-step pipeline with error handling:

Step 1: Parse JSON input
- Read the JSON file from input/data.json
- Parse the JSON file into a data object
- If JSON parsing fails: log error details and exit (no retry)

Step 2: Validate data
- Validate the data object against schema.json
- If schema validation fails: log validation errors and exit (no retry)

Step 3: Transform data
- Transform the validated data using rules from transform_rules.py
- If transformation fails: log error details and retry up to 3 times
- If all transformation retries fail: save the validated data to failed_transforms table

Step 4: Save to database
- Save the transformed data to the users table
- If database save fails: log error and retry up to 3 times with exponential backoff
- If all save retries fail: write the transformed data to output/failed_saves.json for manual recovery

Error logging:
- Log each step's input and output for debugging
- Include timestamps, step name, and error details
- Write logs to logs/pipeline.log
```

### Techniques Applied
- Pronoun elimination (explicit "JSON file", "data object", "validated data")
- Step-by-step breakdown (clear progression)
- Specific error handling per step (different strategies)
- Success/failure paths defined

---

## Example 8: Undefined Trade-offs

### ❌ Before (No Trade-off Awareness)
```
"Implement caching for the API"
```

### Issues Detected
- **Multiple approaches:** Redis, in-memory, CDN, HTTP caching
- **Incompatible trade-offs:** Speed vs consistency vs cost
- **Missing constraints:** What are the priorities?

### ✅ After (Trade-offs Explicit)
```
Implement caching for the /products API endpoint to improve response times.

Current state:
- Response time: ~800ms (database query + processing)
- Traffic: ~1000 requests/minute
- Data freshness: Products update every 10 minutes

Caching approach options:

Option A: Redis Cache
✅ Pros: Fast (5-10ms), shared across instances, supports invalidation
❌ Cons: Additional infrastructure, $50/month cost, complexity
Trade-off: Best performance, but adds operational overhead

Option B: In-Memory Cache (Node.js Map)
✅ Pros: Simple, no infra cost, very fast (1-2ms)
❌ Cons: Not shared (each instance has own cache), lost on restart, memory limits
Trade-off: Simplest implementation, but less effective with multiple instances

Option C: HTTP Cache-Control Headers
✅ Pros: Browser/CDN caching, no backend changes, free
❌ Cons: Can't invalidate easily, less control, doesn't help API-to-API calls
Trade-off: Helps browser clients, but not server-side consumers

Which option fits your priorities?
- Speed priority + budget OK → Option A (Redis)
- Simplicity priority + single instance → Option B (In-memory)
- Browser performance priority → Option C (HTTP headers)

Or specify your constraints (budget, complexity tolerance, performance target) and I'll recommend the best fit.
```

### Techniques Applied
- Multiple approaches presented (not assuming one correct answer)
- Trade-offs made explicit (pros/cons/implications)
- Decision criteria provided (helps user choose)
- User input requested (collaborative optimization)

---

## Pattern Summary

Across all examples, successful optimization follows patterns:

1. **Identify vague terms** → Replace with specific criteria
2. **Add missing context** → Environment, constraints, current state
3. **Define success explicitly** → Measurable, verifiable outcomes
4. **Structure complex tasks** → Break into sequential steps
5. **Eliminate ambiguity** → Use precise language, avoid pronouns
6. **Position context smartly** → Important info first/last, details referenced
7. **Expose trade-offs** → Don't hide complexity, help user decide

---

## Key Principle

Optimization transforms guesswork into clarity. Every vague term is an opportunity to align with user intent. Every ambiguity is a chance to prevent misalignment. Good optimization makes implicit assumptions explicit and unmeasurable goals measurable.
