---
name: accelint-security-best-practices
description: "Use for JavaScript/TypeScript security audits, vulnerability reviews, and secure implementation work focused on authentication, authorization, API endpoints, file uploads, outbound fetch/SSRF flows, secrets, dependency risk, user-input handling, or pre-deployment hardening. Trigger on requests like 'security review', 'audit for vulnerabilities', 'secure this code', 'review auth flow', 'check file upload security', 'assess SSRF risk', or 'harden this API'. Best for repo-, service-, or feature-scoped security work that identifies real risks, prioritizes critical/high issues, maps findings to OWASP categories and severity, and either reports findings or applies concrete fixes without drifting into generic non-security cleanup."
license: Apache-2.0
metadata:
  author: accelint
  version: "1.1.1"
---

# Security Best Practices

Systematic security auditing and vulnerability detection for JavaScript/TypeScript applications. This skill combines an audit workflow with OWASP Top 10 security patterns for production-ready code.

**Framework-Agnostic Guidance**: This skill gives security principles that apply across frameworks (Express, Fastify, Nest.js, Next.js, and others). Code examples illustrate common patterns. Adapt them to your project's framework and package manager (npm, yarn, pnpm, bun).

## Start by scoping the security task

Before you audit or edit anything, establish these boundaries:

- **Target scope** — exact path, package, service, endpoint set, or feature area
- **Execution mode** — audit-only findings or apply-fixes implementation
- **Repo size** — small/localized, medium, or large/multi-surface
- **Highest-risk surfaces** — auth, secrets, API handlers, file uploads, outbound fetches, dependency management, privileged actions

If the user does not provide scope, infer the smallest credible scope from the request and state that assumption.

## NEVER Do When Implementing Security

**Note:** For general best practices (type safety, code quality, documentation), use the respective accelint skills. This section focuses exclusively on security-specific anti-patterns.

- **NEVER hardcode secrets** - API keys, tokens, passwords, or credentials in source code are immediately compromised when pushed to version control. Even private repositories leak secrets through employee turnover, third-party access, and git history. In 2024 breach analysis, 47% of exposed credentials came from `.env` files accidentally committed then 'deleted' (but preserved in git history). Attackers scan public GitHub commits within minutes of push. Use environment variables or a dedicated secret manager, and keep secret material out of source control.

- **NEVER trust user input** - Validate with schemas (Zod, Joi) covering type, format, size, and content.

- **NEVER concatenate user input into queries** - Use parameterized queries, ORMs, or prepared statements exclusively. String concatenation in SQL, NoSQL, or shell commands enables injection attacks.

- **NEVER store sensitive data in localStorage** - localStorage is vulnerable to XSS attacks where malicious scripts steal tokens. JWT tokens, session IDs, or credentials in localStorage persist across sessions and are accessible to any JavaScript code. Use httpOnly cookies for auth tokens.

- **NEVER skip authorization checks** - Authentication verifies identity; authorization verifies permission. Attackers will manipulate IDs, skip authentication, or guess URLs. Every endpoint accessing resources must verify the requesting user owns that resource or has appropriate role.

- **NEVER expose detailed errors to users** - Log server-side, return generic messages. Stack traces leak architecture for reconnaissance.

- **NEVER rely on ad-hoc permission checks** - Permission logic scattered across arrays, string comparisons, or route handlers is easy to bypass or implement inconsistently. Prefer explicit ownership checks, well-defined RBAC/ABAC policies, and data structures that make permission checks hard to misuse.

- **NEVER skip rate limiting on APIs** - Unlimited API requests enable brute force attacks (1000 password attempts/second), denial of service (exhaust server resources), or data scraping (enumerate all users/resources). Apply rate limits to all endpoints, with stricter limits on authentication and expensive operations.

- **NEVER log sensitive data** - Passwords, tokens, credit cards, or personal information in logs persist in log aggregation systems, backups, and third-party services. Logs are accessible to more people than the application itself. Redact sensitive fields before logging.

- **NEVER use default configurations in production** - Default secrets, disabled security headers, permissive CORS, or development modes in production create known vulnerabilities. Attackers scan for defaults. Harden all configurations for production environments.

## Before Implementing Security, Ask

Apply these tests to keep security coverage comprehensive:

### Threat Assessment
- **What's the attack surface?** Identify all points where user input enters the system (forms, APIs, file uploads, URLs)
- **What's the worst-case scenario?** Consider data breaches, unauthorized access, service disruption, or financial loss
- **Who are the attackers?** Script kiddies exploit known vulnerabilities; sophisticated attackers chain multiple weaknesses

### Compliance Verification
- **Do I have authentication on all protected routes?** Public APIs may be intentional, but verify each endpoint's access policy
- **Are authorization checks before operations?** Verify ownership/permissions before reading, writing, or deleting resources
- **Is all user input validated?** Check type, format, size, and content with schemas before processing

### Defense in Depth
- **Is there a single point of failure?** Layer defenses so one bypass doesn't compromise entire system
- **Are errors handled gracefully?** Unhandled errors leak information; proper handling maintains security posture
- **Is logging sufficient for audit trails?** Security events (login attempts, access denials, suspicious patterns) must be logged for incident response

## How to Use

This skill uses **progressive disclosure** to minimize context usage:

### 1. Start with the workflow (`SKILL.md`)
Follow the 4-phase audit workflow below for systematic security analysis.

### 2. Review the security rules overview (`AGENTS.md`)
Load [AGENTS.md](AGENTS.md) to scan compressed security rule summaries organized by category.

### 3. Load specific security patterns as needed
When you identify a specific security issue, load the corresponding reference file for detailed ❌/✅ examples.

### 4. Use the report template
When this skill is invoked, use the standardized report format:

**Template:** [`assets/output-report-template.md`](assets/output-report-template.md)

## Security Audit Workflow

**Two modes of operation:**

1. **Audit Mode** - The skill is invoked directly (`/accelint-security-best-practices <path>`) or the user explicitly requests a security audit, review, assessment, or findings report
   - Generate a structured audit report using the template (Phases 1-2 only unless the user also asks for fixes)
   - Report findings for user review before implementation
   - Default to this mode when the user asks for analysis, risk review, or a pre-deploy check

2. **Implementation Mode** - The skill triggers during feature work or the user explicitly wants vulnerabilities fixed
   - Identify and apply security fixes directly (all 4 phases)
   - No formal report needed unless the user asks for one
   - Default to this mode when the user asks to secure or harden code, auth, uploads, endpoints, or other specific flows

**Copy this checklist to track progress:**

```
- [ ] Phase 1: Discover - Identify security vulnerabilities through systematic code analysis
- [ ] Phase 2: Categorize - Classify issues by OWASP category and severity
- [ ] Phase 3: Remediate - Apply security patterns from references/
- [ ] Phase 4: Verify - Validate fixes and confirm vulnerability closure
```

### Phase 1: Discover Security Vulnerabilities

**CRITICAL: Audit all in-scope code for security vulnerabilities.** Do not skip code inside the chosen scope based on assumptions about exposure. Internal utilities, helpers, and data transformations are often exposed through APIs, file uploads, or user interactions even when the implementation looks isolated.

**Perform systematic static code analysis across the chosen scope to identify security anti-patterns:**
- Hardcoded secrets (API keys, passwords, tokens)
- Missing input validation (user data, file uploads, API responses)
- Injection vulnerabilities (SQL, NoSQL, Command, XSS)
- Broken access control (missing auth, no ownership checks, IDOR)
- Insecure authentication (tokens in localStorage, weak session management)
- Missing rate limiting (auth endpoints, expensive operations)
- Sensitive data exposure (logs, error messages, client responses)
- Security misconfiguration (default configs, missing headers, permissive CORS)
- Vulnerable dependencies (outdated packages, known CVEs)
- Missing CSRF protection (state-changing operations)
- SSRF vulnerabilities (unvalidated URL fetching)

**Output**: A complete list of verified vulnerabilities within scope, with locations, severity, and OWASP category. In large repos, report Critical and High findings first, then include Medium and Low findings as time and scope allow. Do not overclaim findings you did not verify.

### Phase 2: Categorize and Assess Risk

For EVERY vulnerability identified in Phase 1, categorize it by OWASP category and severity:

**Categorize ALL vulnerabilities by OWASP Top 10 category:**

| OWASP Category | Common Issues | Severity Range |
|----------------|---------------|----------------|
| A01: Broken Access Control | Missing auth, no ownership checks, IDOR | Critical-High |
| A02: Cryptographic Failures | Hardcoded secrets, weak hashing, insecure storage | Critical-Medium |
| A03: Injection | SQL, NoSQL, Command, XSS vulnerabilities | Critical-High |
| A04: Insecure Design | Missing rate limiting, no input validation | High-Medium |
| A05: Security Misconfiguration | Default configs, missing headers, dev mode in prod | High-Low |
| A06: Vulnerable Components | Outdated dependencies, known CVEs | Critical-Low |
| A07: Auth Failures | Weak session management, no MFA, credential stuffing | Critical-High |
| A08: Data Integrity Failures | Missing CSRF, unsigned updates | High-Medium |
| A09: Logging Failures | No security logging, insufficient monitoring | Medium-Low |
| A10: SSRF | Unvalidated URL fetching, internal network access | High-Medium |

**Severity Levels:**

- **Critical**: Direct path to data breach, remote code execution, or complete system compromise
  - Examples: SQL injection, hardcoded production secrets, no authentication on admin endpoints

- **High**: Likely to enable unauthorized access, data theft, or service disruption
  - Examples: Missing authorization checks, XSS vulnerabilities, insecure session management

- **Medium**: Could be exploited with specific conditions or chained with other vulnerabilities
  - Examples: Missing rate limiting, weak CORS policy, insufficient logging

- **Low**: Defense-in-depth improvements, best practices, or edge case protections
  - Examples: Missing security headers, overly detailed error messages

**Quick reference for mapping vulnerabilities:**

Load [references/quick-reference.md](references/quick-reference.md) for detailed vulnerability-to-category mapping and anti-pattern detection.

**Output:** Categorized list of verified vulnerabilities with their OWASP categories and severity levels. Preserve full coverage for the chosen scope, but prioritize Critical and High items first when presenting results.

### Phase 3: Remediate Using Security Patterns

**Step 1: Identify your vulnerability category** from Phase 2 analysis.

**Step 2**: Load the MANDATORY references for the category. Read each file completely with no range limits.

| Category | MANDATORY Files | Optional | Do NOT Load |
|----------|----------------|----------|-------------|
| **Secrets Management** | secrets-management.md | — | all others |
| **Input Validation** | input-validation.md | file-uploads.md (for file upload features) | secrets, auth |
| **Injection Prevention** | injection-prevention.md | — | input validation, XSS |
| **Authentication** | authentication.md | mfa.md (for multi-factor auth features) | authorization, secrets |
| **Authorization** | authorization.md | — | authentication |
| **XSS Prevention** | xss-prevention.md | — | injection, CSRF |
| **CSRF Protection** | csrf-protection.md | — | XSS, auth |
| **Rate Limiting** | rate-limiting.md | — | auth, injection |
| **Sensitive Data** | sensitive-data.md | — | secrets, logging |
| **Dependency Security** | dependency-security.md | — | all others |
| **Security Headers** | security-headers.md | — | XSS, CSRF |
| **SSRF Prevention** | ssrf-prevention.md | — | injection, input validation |

**Notes**:
- If a vulnerability spans multiple categories, load references for all relevant categories
- Security patterns are cumulative. Apply defense in depth by addressing all relevant categories
- Load optional files when implementing specific features (file uploads, MFA, and others)

---

**Step 3: Scan for quick reference during remediation**

Load [AGENTS.md](AGENTS.md) to see compressed security rule summaries organized by category. Use it as a quick lookup while you implement patterns from the detailed reference files above.

**Apply patterns systematically:**

1. **Load the reference file** for the identified vulnerability category
2. **Scan the ❌/✅ examples** to find matching patterns
3. **Apply the security fix** ensuring defense in depth
4. **Add comments only when helpful** to explain non-obvious security considerations or trade-offs; do not add noisy comments to obvious fixes

**Example remediation:**
```typescript
// ❌ Before: SQL Injection vulnerability
const query = `SELECT * FROM users WHERE email = '${email}'`;
const user = await db.query(query);

// ✅ After: Parameterized query prevents injection
// Security: injection-prevention.md - parameterized queries
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
```

### Phase 4: Verify Security Fixes

**Validate vulnerability closure:**
1. Review the code to confirm the vulnerability is fully addressed
2. Verify that the fix did not introduce new vulnerabilities
3. Check defense in depth. Confirm that multiple layers protect critical resources

**Security testing:**
1. Run the existing test suite. All tests must pass
2. Add security-specific tests for the vulnerability
3. Consider penetration testing for critical vulnerabilities

**Document security fix:**
```typescript
// Security fix applied: 2026-02-01
// Vulnerability: SQL injection via email parameter (Critical)
// OWASP Category: A03 - Injection
// Pattern: injection-prevention.md - parameterized queries
// Verified: All tests pass, manual SQL injection attempts blocked
```

**Deciding whether to deploy the fix:**
- **Critical vulnerabilities:** Deploy immediately with emergency process if needed
- **High vulnerabilities:** Deploy in next release cycle (days, not weeks)
- **Medium vulnerabilities:** Deploy with next scheduled release
- **Low vulnerabilities:** Deploy when convenient or batch with other security improvements

**If tests fail:** Fix the security implementation or find alternative solution. Security fixes should not break functionality.

## Common Implementation Pitfalls

Security fixes sometimes conflict with existing functionality. Here are expert solutions for common scenarios:

| Issue | ❌ Wrong Approach | ✅ Correct Approach |
|-------|------------------|---------------------|
| Parameterized queries break dynamic column sorting | Add try-catch, fall back to concatenation | Use column name whitelist: `const allowed = ['name', 'email', 'created_at']; if (!allowed.includes(column)) throw Error;` then safely concatenate |
| Rate limiting breaks load tests | Disable rate limiting in test environment | Use separate rate limit config for tests based on environment detection |
| CSRF tokens break API integration tests | Skip CSRF validation in tests | Generate valid CSRF tokens in test setup using your CSRF library's token generation function |
| Input validation rejects legitimate edge cases | Loosen validation rules | Investigate the edge case - is it legitimate? If yes, update schema. If no, reject it. Real users shouldn't hit validation errors. |
| Authorization checks break admin impersonation | Skip auth checks for admin users | Implement proper impersonation: admin gets temporary token with target user's permissions, logged for audit |
| HTTPOnly cookies break mobile app auth | Store tokens in localStorage for mobile | Use secure token storage: iOS Keychain, Android Keystore, or platform-specific secure storage APIs |

### When Security and Functionality Conflict

**Priority order:**
1. **Never compromise on Critical vulnerabilities** (SQL injection, hardcoded secrets, missing auth) - find alternative architecture
2. **High vulnerabilities** can have slight trade-offs if properly documented and compensated with other controls
3. **Medium/Low vulnerabilities** may be deferred if business justification is strong and risk is accepted

**Documentation requirement for trade-offs:**
```typescript
// SECURITY TRADE-OFF DOCUMENTED: 2026-02-01
// Issue: Rate limiting breaks webhook ingestion from trusted partner
// Decision: Exempt partner IP range from rate limiting
// Compensating controls:
//   - IP whitelist strictly maintained (only 2 partner IPs)
//   - Separate monitoring for partner traffic
//   - Manual review of partner traffic daily
//   - 30-day review scheduled to implement alternative solution
// Risk accepted by: [Name], [Title]
```

## Freedom Calibration

**Calibrate guidance specificity to vulnerability severity:**

| Vulnerability Severity | Freedom Level | Guidance Format | Example |
|------------------------|---------------|-----------------|---------|
| **Critical (data breach, RCE)** | Low freedom | Exact pattern from reference, no deviation | "Use parameterized query: `db.query('SELECT * FROM users WHERE id = $1', [id])`" |
| **High (unauthorized access)** | Medium freedom | Pattern with examples, verify coverage | "Implement RBAC or ownership checks before resource access" |
| **Medium (defense in depth)** | Medium freedom | Multiple valid approaches, pick based on architecture | "Use rate limiting with express-rate-limit or implement custom middleware" |
| **Low (best practices)** | High freedom | General guidance, implementation varies | "Consider adding security headers for defense in depth" |

**The test:** "What's the severity and blast radius?"
- Critical/High severity → Low freedom with exact patterns to prevent mistakes
- Medium severity → Medium freedom with validated approaches
- Low severity → High freedom with general best practices

## Important Notes

- **Audit everything philosophy** - Audit ALL in-scope code for security vulnerabilities. Internal utilities, helpers, and data transformations are often exposed through APIs or user interactions even when they appear isolated. Do not assume security boundaries.
- **Report all findings** - Perform systematic static analysis to identify and report ALL verified vulnerabilities with their severity and OWASP category. Do not filter based on "likelihood" of exploitation.
- **Reference files are authoritative** - The patterns in `references/` follow OWASP best practices. Follow them exactly unless security requirements dictate otherwise.
- **Defense in depth** - Layer security controls so a single vulnerability does not compromise the entire system. Authentication + authorization + input validation + rate limiting.
- **Security testing** - Security fixes require testing with malicious inputs and edge cases. Add tests for attack scenarios before deploying.
- **Incident response** - Security logging and monitoring enable detection and response to attacks. Log all security events with enough detail for investigation.

## Quick Decision Tree

Use this table to identify the security category and typical severity quickly.

**Audit everything**: Identify ALL security vulnerabilities in the code regardless of current exposure. Report all findings with severity and OWASP category.

| If You See... | Vulnerability Type | OWASP Category | Typical Severity |
|---------------|-------------------|----------------|------------------|
| API key, password, or token in source code | Hardcoded secrets | A02: Cryptographic Failures | Critical |
| User input directly in SQL/NoSQL query | Injection vulnerability | A03: Injection | Critical |
| No `authenticate` middleware on protected route | Missing authentication | A01: Broken Access Control | Critical |
| No ownership/permission check before resource access | Missing authorization | A01: Broken Access Control | High |
| JWT token in `localStorage.setItem()` | Insecure token storage | A07: Auth Failures | High |
| User input without schema validation | Missing input validation | A04: Insecure Design | High |
| No rate limiting on `/api/login` or `/api/register` | Missing rate limiting | A04: Insecure Design | High |
| `dangerouslySetInnerHTML` without sanitization | XSS vulnerability | A03: Injection | High |
| State-changing operation without CSRF token | Missing CSRF protection | A08: Data Integrity Failures | High |
| Password, token, or PII in `console.log()` | Sensitive data in logs | A09: Logging Failures | Medium |
| Stack trace or database error sent to user | Information leakage | A05: Security Misconfiguration | Medium |
| `npm audit` shows vulnerabilities | Vulnerable dependencies | A06: Vulnerable Components | Critical-Low (varies) |
| `fetch(userProvidedUrl)` without validation | SSRF vulnerability | A10: SSRF | High |
| No security headers (CSP, HSTS) | Missing security headers | A05: Security Misconfiguration | Medium |
| Sequential user IDs without ownership check | IDOR vulnerability | A01: Broken Access Control | High |
| `CORS: *` in production | Permissive CORS | A05: Security Misconfiguration | Medium |
| `process.env.NODE_ENV !== 'production'` check missing | Dev mode in production | A05: Security Misconfiguration | Medium-Low |

**How to use this table:**
1. Identify the pattern from code review
2. Find matching row in "If You See..." column
3. Note the OWASP Category and Typical Severity
4. Jump to corresponding Security Category in Phase 3
5. Load MANDATORY reference files for that category
