# Review Template

Use for: Code review, design review, PR review, quality assessment.

## Structure

```
Review [ARTIFACT] focusing on [ASPECTS]

Review criteria:
- [Criterion 1]: [What to check, standards to apply]
- [Criterion 2]: [What to check, standards to apply]
- [Criterion 3]: [What to check, standards to apply]

Context:
- Purpose: [What this code/design is trying to accomplish]
- Audience: [Who will maintain/use this]
- Constraints: [Requirements, limitations to consider]

For each finding:
- Severity: [critical/major/minor/nit]
- Location: [Specific file:line or section]
- Issue: [What's wrong or could be improved]
- Suggestion: [How to improve, with example if helpful]
- Rationale: [Why this matters]

Tone: [Constructive/Supportive/Strict]

Output format:
1. Overall assessment (summary in 2-3 sentences)
2. Critical issues (must fix before merging)
3. Major concerns (should fix, may block if unaddressed)
4. Minor suggestions (nice to have, optional)
5. Positive observations (what's done well)

Success criteria:
✓ All [criterion 1] issues identified
✓ Feedback is specific and actionable
✓ Balance between concerns and positives
```

## Example Usage

```
Review this pull request adding user profile API endpoint, focusing on security, code quality, and test coverage.

Review criteria:
- Security: Input validation, SQL injection prevention, auth/authorization, data exposure
- Code quality: Readability, maintainability, follows project conventions, error handling
- Test coverage: Unit tests for business logic, integration tests for API, edge cases covered

Context:
- Purpose: Add GET /users/:id and PUT /users/:id endpoints for user profile management
- Audience: Junior engineer new to the team, learning our patterns
- Constraints: Must use existing auth middleware, follow RESTful conventions, maintain <100ms p95 latency

Review findings:

CRITICAL ISSUES (must fix):

1. SQL Injection Vulnerability
   - Severity: CRITICAL
   - Location: src/routes/users.ts:23
   - Issue: User ID concatenated directly into SQL query
   ```javascript
   const query = `SELECT * FROM users WHERE id = '${userId}'`;
   ```
   - Suggestion: Use parameterized queries
   ```javascript
   const query = 'SELECT * FROM users WHERE id = $1';
   const result = await db.query(query, [userId]);
   ```
   - Rationale: Direct concatenation allows SQL injection attacks. A malicious user could inject `' OR '1'='1` to access all users.

2. Sensitive Data Exposure
   - Severity: CRITICAL
   - Location: src/routes/users.ts:45
   - Issue: Response includes password hash in user object
   ```javascript
   res.json(user); // user object contains password_hash field
   ```
   - Suggestion: Exclude sensitive fields
   ```javascript
   const { password_hash, ...safeUser } = user;
   res.json(safeUser);
   ```
   - Rationale: Even hashed passwords shouldn't be exposed via API. Reduces attack surface.

MAJOR CONCERNS (should fix):

3. Missing Authorization Check
   - Severity: MAJOR
   - Location: src/routes/users.ts:18
   - Issue: Any authenticated user can update any other user's profile
   - Suggestion: Add authorization check
   ```javascript
   if (req.user.id !== userId && !req.user.isAdmin) {
     return res.status(403).json({ error: 'Cannot update other users' });
   }
   ```
   - Rationale: Users should only edit their own profiles unless they're admins.

4. Insufficient Error Handling
   - Severity: MAJOR
   - Location: src/routes/users.ts:28-35
   - Issue: Database errors expose stack traces to client
   ```javascript
   } catch (error) {
     res.status(500).json({ error: error.message, stack: error.stack });
   }
   ```
   - Suggestion: Log errors server-side, return generic message
   ```javascript
   } catch (error) {
     logger.error('User fetch failed', { userId, error });
     res.status(500).json({ error: 'Failed to fetch user' });
   }
   ```
   - Rationale: Stack traces leak implementation details and file paths to attackers.

MINOR SUGGESTIONS (nice to have):

5. Magic Number
   - Severity: MINOR
   - Location: src/routes/users.ts:40
   - Issue: Hardcoded `403` status code without explanation
   - Suggestion: Use named constant or add comment
   ```javascript
   const HTTP_FORBIDDEN = 403;
   res.status(HTTP_FORBIDDEN).json(...);
   ```
   - Rationale: Improves readability, easier to maintain consistently.

6. Missing Input Validation
   - Severity: MINOR
   - Location: src/routes/users.ts:51
   - Issue: PUT request doesn't validate email format
   - Suggestion: Add validation with helpful error
   ```javascript
   if (!isValidEmail(updateData.email)) {
     return res.status(400).json({
       error: 'Invalid email format',
       field: 'email'
     });
   }
   ```
   - Rationale: Catch invalid data early with clear feedback.

7. Test Coverage Gap
   - Severity: MINOR
   - Location: tests/users.test.ts
   - Issue: No test for user updating another user's profile (should 403)
   - Suggestion: Add test case
   ```javascript
   it('returns 403 when user tries to update another user', async () => {
     const response = await request(app)
       .put('/users/other-user-id')
       .set('Authorization', `Bearer ${userToken}`)
       .send({ name: 'Hacker' });
     expect(response.status).toBe(403);
   });
   ```
   - Rationale: This is a security-critical path that should be tested.

POSITIVE OBSERVATIONS:

✅ Clean, readable code structure
✅ Good use of async/await (no callback hell)
✅ Appropriate HTTP status codes for success cases
✅ Tests included (good practice for new code)
✅ Follows project naming conventions

OVERALL ASSESSMENT:

This PR adds useful functionality with clean structure, but has critical security issues that must be addressed before merging. The SQL injection vulnerability and password exposure are serious concerns. Once the critical and major issues are fixed, this will be solid work. Nice job including tests—just need a few more edge cases covered.

**Recommendation: Request changes (critical issues must be fixed)**
```

## Common Pitfalls

- **Only negative feedback:** Demoralizes, doesn't reinforce good practices
- **Vague criticism:** "This is bad" → Explain why and how to improve
- **Missing severity:** Treating all issues equally → Can't prioritize
- **Prescriptive without rationale:** "Do it this way" → Explain why
