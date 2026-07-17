# Documentation Template

Use for: READMEs, API docs, guides, tutorials, code comments.

## Structure

```
Write [DOC_TYPE] for [TARGET_AUDIENCE]

Purpose: [What reader will learn/accomplish after reading]

Audience:
- Skill level: [Beginner/Intermediate/Expert]
- Domain knowledge: [What they already know]
- What they're trying to accomplish: [Their goal]

Required sections:
1. [Section name]: [What to cover, level of detail]
2. [Section name]: [What to cover, level of detail]
3. [Section name]: [What to cover, level of detail]

For each section:
- Include code examples with explanations
- Highlight common pitfalls and how to avoid them
- Provide practical use cases

Tone: [Helpful/Professional/Technical/Friendly]
Depth: [Overview/Intermediate/Comprehensive]

Format:
- [Markdown/RST/other]
- Code blocks with syntax highlighting
- [Tables/diagrams if needed]

Success criteria:
Reader can [accomplish goal] without additional help or needing to read source code
```

## Example Usage

```
Write API reference documentation for the User Management API, targeting frontend developers integrating it for the first time.

Purpose: Enable frontend devs to integrate user auth and management features without backend support

Audience:
- Skill level: Intermediate frontend developers
- Domain knowledge: Familiar with REST APIs, HTTP, JSON, but new to our system
- Goal: Integrate login, user profile, and account management features

Required sections:
1. Authentication: How to get and use JWT tokens
   - Login flow with example
   - Token refresh mechanism
   - Handling auth errors
2. User endpoints: CRUD operations for users
   - GET /users/:id (fetch profile)
   - PUT /users/:id (update profile)
   - DELETE /users/:id (delete account)
3. Error handling: Common errors and how to handle them
   - 401 Unauthorized → redirect to login
   - 403 Forbidden → show "permission denied"
   - 429 Rate Limited → show "too many requests, try again in X seconds"

For each endpoint:
- Purpose and when to use it
- Request format (headers, body) with curl example
- Response format (success and error cases) with JSON examples
- Common pitfalls
  - "Don't forget to include Authorization header"
  - "User IDs must be UUIDs, not integers"

Tone: Professional but helpful. Explain non-obvious behavior, skip REST basics they already know.

Depth: Intermediate—enough detail to integrate successfully, not exhaustive edge cases

Format:
- Markdown
- Syntax-highlighted code blocks (JSON, curl, JavaScript)
- Table for error codes
- Callout boxes for important warnings

Success criteria:
✓ Frontend dev can implement login, profile view, and account deletion
✓ Common integration mistakes are prevented by warnings
✓ Error handling is clear and actionable
✓ Zero questions asked in Slack after reading
```

## Common Pitfalls

- **Wrong audience level:** Too basic for experts, too advanced for beginners
- **Missing examples:** Abstract descriptions without concrete code
- **No common pitfalls:** Users hit same issues repeatedly
- **Outdated:** Docs don't match current implementation
