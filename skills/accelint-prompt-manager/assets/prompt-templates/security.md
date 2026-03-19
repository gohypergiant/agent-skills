# Security Template

Use for: Vulnerability analysis, threat modeling, security audits, penetration testing planning.

## Structure

```
Security analysis of [SYSTEM/CODE]

Scope: [What to analyze - specific component, full system, API surface]

Threat model:
- Attacker profile: [Capabilities, motivation, access level]
- Assets to protect: [Data, functionality, availability]
- Attack vectors to consider: [List of threat categories]

Analysis approach:
1. Identify potential vulnerabilities
2. Assess severity using [CVSS / Internal framework]
3. Propose mitigations
4. Prioritize fixes by risk

For each finding:
- Vulnerability: [Description]
- Attack scenario: [How it could be exploited]
- Impact: [What attacker could achieve]
- Severity: [Critical/High/Medium/Low + score]
- Affected component: [Specific code/config location]
- Mitigation: [How to fix, with code example if applicable]
- Effort to fix: [Hours/days estimate]

Output format:
1. Executive summary (critical findings)
2. Detailed findings (prioritized by severity)
3. Quick wins (easy fixes with high impact)
4. Long-term recommendations

Success criteria:
✓ All [severity level] vulnerabilities identified
✓ Mitigations are actionable and specific
✓ Risk accurately assessed
```

## Example Usage

```
Security analysis of user authentication API endpoints.

Scope:
- POST /auth/login
- POST /auth/register
- POST /auth/refresh
- POST /auth/logout
- Related middleware: authMiddleware, rateLimitMiddleware

Threat model:
- Attacker profile:
  - External attacker on internet
  - Moderate technical skill
  - Motivation: Account takeover, data theft
  - Access: Public API endpoints only (no internal network access)
- Assets to protect:
  - User credentials and PII
  - User sessions and authentication tokens
  - Account integrity (prevent unauthorized access)
- Attack vectors:
  - Brute force attacks
  - SQL injection
  - Session hijacking
  - Token manipulation
  - Account enumeration

Analysis approach:
1. Review authentication logic for common vulnerabilities (OWASP Top 10)
2. Test input validation on all endpoints
3. Analyze session management for weaknesses
4. Check rate limiting effectiveness
5. Review error messages for information leakage

FINDINGS:

[CRITICAL] SQL Injection in Login Endpoint
- Vulnerability: User input concatenated into raw SQL query
- Location: src/auth/login.ts:45
  ```javascript
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  ```
- Attack scenario:
  1. Attacker sends email: `admin'--`
  2. Query becomes: `SELECT * FROM users WHERE email = 'admin'--'`
  3. Comment operator `--` ignores password check
  4. Attacker gains access to admin account without password
- Impact: Full account takeover of any user, data breach
- Severity: CRITICAL (CVSS 9.8)
- Mitigation:
  ```javascript
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await db.query(query, [email]);
  ```
- Effort: 30 minutes

[HIGH] No Rate Limiting on Login Endpoint
- Vulnerability: Unlimited login attempts allow brute force attacks
- Location: src/auth/login.ts (no rate limiting middleware applied)
- Attack scenario:
  1. Attacker enumerates common emails (info@, admin@)
  2. Brute forces passwords using dictionary (10k attempts/minute)
  3. Eventually guesses weak passwords
- Impact: Account compromise, credential stuffing attacks
- Severity: HIGH (CVSS 7.5)
- Mitigation:
  ```javascript
  router.post('/login',
    rateLimiter({ windowMs: 60000, max: 5 }), // 5 attempts per minute
    loginHandler
  );
  ```
  Plus: Lock account after 10 failed attempts, require CAPTCHA after 3
- Effort: 2 hours

[HIGH] Tokens Don't Expire
- Vulnerability: JWT tokens have no expiration time
- Location: src/auth/jwt.ts:12
  ```javascript
  const token = jwt.sign({ userId }, SECRET); // No exp claim
  ```
- Attack scenario:
  1. Attacker steals token (XSS, network sniffing, device theft)
  2. Token works forever
  3. Even if user changes password, old token still valid
- Impact: Indefinite unauthorized access after token theft
- Severity: HIGH (CVSS 7.1)
- Mitigation:
  ```javascript
  const token = jwt.sign(
    { userId },
    SECRET,
    { expiresIn: '1h' } // Add expiration
  );
  ```
  Plus: Implement refresh token rotation
- Effort: 4 hours (including refresh token flow)

[MEDIUM] Account Enumeration via Error Messages
- Vulnerability: Different error messages reveal if email exists
- Location: src/auth/login.ts:55-60
  ```javascript
  if (!user) return res.json({ error: 'Email not found' });
  if (!validPassword) return res.json({ error: 'Incorrect password' });
  ```
- Attack scenario:
  1. Attacker tests emails: attacker submits test@example.com
  2. "Email not found" → email doesn't exist
  3. "Incorrect password" → email exists, user confirmed
  4. Attacker builds list of valid emails for targeted phishing
- Impact: User enumeration, targeted attacks
- Severity: MEDIUM (CVSS 5.3)
- Mitigation:
  ```javascript
  // Same message for both cases
  return res.json({ error: 'Invalid email or password' });
  ```
- Effort: 15 minutes

[MEDIUM] Weak Password Requirements
- Vulnerability: No minimum password strength enforced
- Location: src/auth/register.ts:30 (accepts any non-empty password)
- Attack scenario:
  1. Users create weak passwords (e.g., "123456")
  2. Easily guessed in brute force attacks
- Impact: Increased success rate of brute force attacks
- Severity: MEDIUM (CVSS 5.0)
- Mitigation:
  ```javascript
  const passwordRequirements = {
    minLength: 12,
    requireUppercase: true,
    requireNumber: true,
    requireSpecial: true
  };
  if (!meetsRequirements(password, passwordRequirements)) {
    return res.status(400).json({
      error: 'Password must be at least 12 characters with uppercase, number, and special character'
    });
  }
  ```
- Effort: 1 hour

[LOW] Session Tokens in URL Parameters
- Vulnerability: Refresh tokens accepted via query parameters
- Location: src/auth/refresh.ts:18
  ```javascript
  const refreshToken = req.query.token || req.body.token;
  ```
- Attack scenario:
  1. User shares URL accidentally (browser history, server logs, referrer headers)
  2. Token leaks via various channels
- Impact: Token exposure through URL logging
- Severity: LOW (CVSS 3.1) - mitigated by short expiry
- Mitigation:
  ```javascript
  // Only accept from body or header, not query params
  const refreshToken = req.body.token || req.headers['x-refresh-token'];
  ```
- Effort: 20 minutes

QUICK WINS (high impact, low effort):
1. Fix SQL injection (CRITICAL, 30 min)
2. Use generic error messages (MEDIUM, 15 min)
3. Remove token from URL params (LOW, 20 min)

Total: ~1 hour for significant security improvement

LONG-TERM RECOMMENDATIONS:
1. Implement comprehensive audit logging (all auth events)
2. Add multi-factor authentication option
3. Conduct regular penetration testing
4. Implement security headers (CSP, HSTS, etc.)
5. Set up intrusion detection monitoring

OVERALL ASSESSMENT:
Critical SQL injection vulnerability must be fixed immediately. No rate limiting makes brute force trivial. Once critical issues addressed, authentication will be reasonably secure for MVP. Recommend security review before production launch.
```

## Common Pitfalls

- **Generic findings:** "Add input validation" → Specify which inputs, how to validate
- **Missing attack scenarios:** Vulnerability without explaining exploitation path
- **No prioritization:** All issues treated equally → Can't allocate resources effectively
- **Vague mitigations:** "Improve security" → Provide specific, actionable fixes
