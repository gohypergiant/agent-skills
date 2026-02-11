# Security Best Practices

## Abstract

Comprehensive security guide for JavaScript and TypeScript applications following OWASP Top 10, designed for AI agents and LLMs. Each rule includes one-line summaries here, with links to detailed examples in the `references/` folder. Load reference files only when you need detailed implementation guidance for a specific rule.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify relevant security patterns
2. **Load references as needed**: Click through to detailed examples only when implementing
3. **Progressive loading**: Each reference file is self-contained with ❌/✅ examples

This structure minimizes context usage while providing complete security guidance when needed.

---

## Critical Security Anti-Patterns

**NEVER** do these - they appear in codebases frequently but create severe vulnerabilities:

- **NEVER** hardcode secrets - API keys, passwords, tokens in source code are immediately compromised via version control; use environment variables exclusively
- **NEVER** concatenate user input into queries - creates SQL/NoSQL injection; use parameterized queries and ORMs (10-1000x safer)
- **NEVER** store tokens in localStorage - vulnerable to XSS attacks; use httpOnly cookies for authentication tokens
- **NEVER** skip authorization checks - authentication verifies identity, authorization verifies permission; check both on every protected operation
- **NEVER** trust user input - all input from users, APIs, files is potentially malicious; validate type, format, size with schemas (Zod, Joi)
- **NEVER** expose detailed errors to users - stack traces and database errors leak architecture; log server-side, return generic messages
- **NEVER** skip rate limiting - enables brute force (1000 password attempts/sec), DoS, data scraping; apply to all endpoints
- **NEVER** log sensitive data - passwords, tokens, PII in logs persist in aggregation systems accessible to many; redact before logging
- **NEVER** use default configurations in production - default secrets, disabled security headers, permissive CORS create known vulnerabilities
- **NEVER** use Array.includes() for permission checks - O(n) lookup and type safety issues; use Set.has() (O(1)) or proper RBAC

See individual reference files for detailed alternatives and ✅ correct patterns.

---

## Security Categories (OWASP Top 10)

**Before implementing security**: Identify attack surface and worst-case scenarios. Layer defenses so single vulnerability doesn't compromise entire system.

Defense in depth: `authentication + authorization + input validation + rate limiting + logging`

---

### 1. Secrets Management (OWASP A02)

Never hardcode secrets; use environment variables; validate secrets exist at startup; rotate secrets regularly; use secret management services.
[View detailed examples](references/secrets-management.md)

---

### 2. Input Validation (OWASP A04)

Validate all user input with schemas (Zod, Joi); whitelist validation (not blacklist); check type, format, size, content; sanitize before processing.
[View detailed examples](references/input-validation.md)

#### 2.1 File Upload Validation
Validate file size, type (MIME type), extension; store outside webroot; use CDN/object storage; scan for malware; generate unique filenames.
[View detailed examples](references/file-uploads.md)

---

### 3. Injection Prevention (OWASP A03)

Use parameterized queries for SQL; type-check NoSQL inputs; use `execFile` (not `exec`) for commands; validate and sanitize all dynamic content.
[View detailed examples](references/injection-prevention.md)

---

### 4. Authentication (OWASP A07)

Store tokens in httpOnly cookies (not localStorage); use bcrypt with cost ≥12 for passwords; implement secure session management; short-lived access tokens with refresh tokens.
[View detailed examples](references/authentication.md)

#### 4.1 Multi-Factor Authentication
Implement TOTP (time-based one-time passwords); verify MFA on sensitive operations; provide backup codes; secure QR code generation.
[View detailed examples](references/mfa.md)

---

### 5. Authorization (OWASP A01)

Check ownership/permissions before every operation; implement RBAC (role-based access control); prevent IDOR (insecure direct object reference); use UUIDs instead of sequential IDs.
[View detailed examples](references/authorization.md)

---

### 6. XSS Prevention (OWASP A03)

React auto-escapes by default (safe); sanitize HTML with DOMPurify if using `dangerouslySetInnerHTML`; implement Content Security Policy (CSP); avoid inline scripts.
[View detailed examples](references/xss-prevention.md)

---

### 7. CSRF Protection (OWASP A08)

Use CSRF tokens on state-changing operations; set SameSite=Strict on cookies; implement double-submit cookie pattern; verify origin headers.
[View detailed examples](references/csrf-protection.md)

---

### 8. Rate Limiting (OWASP A04)

Apply rate limits to all API endpoints; stricter limits on authentication (5/hour) and expensive operations (10/min); IP-based and user-based limiting; return 429 status code.
[View detailed examples](references/rate-limiting.md)

---

### 9. Sensitive Data Protection (OWASP A09)

Never log passwords, tokens, credit cards, or PII; redact sensitive fields before logging; return generic error messages to users; log detailed errors server-side only.
[View detailed examples](references/sensitive-data.md)

---

### 10. Dependency Security (OWASP A06)

Run `npm audit` regularly; update dependencies with `npm update`; use exact versions or controlled ranges; enable Dependabot; monitor for CVEs; use `npm ci` in CI/CD.
[View detailed examples](references/dependency-security.md)

---

### 11. Security Headers (OWASP A05)

Use helmet.js for security headers; implement CSP (Content Security Policy); enable HSTS (HTTP Strict Transport Security); set X-Frame-Options, X-Content-Type-Options; disable X-Powered-By.
[View detailed examples](references/security-headers.md)

---

### 12. SSRF Prevention (OWASP A10)

Validate URLs against allowlist; block private IPs (localhost, 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16); prevent redirect chains; use URL parsing to extract hostname.
[View detailed examples](references/ssrf-prevention.md)

---

## Quick Reference for Vulnerability Mapping

For systematic vulnerability identification and categorization, load [references/quick-reference.md](references/quick-reference.md) which provides:
- Vulnerability symptom → OWASP category mapping
- Code pattern → Security risk lookup
- Anti-pattern detection with concrete code examples
- Decision matrix for severity assessment

---

## Severity Impact Summary

| Severity | Impact | When to Fix | Examples |
|----------|--------|-------------|----------|
| Critical | Data breach, RCE, complete compromise | Immediately (emergency deploy) | SQL injection, hardcoded production secrets, no auth on admin endpoints |
| High | Unauthorized access, data theft, service disruption | Next release (days) | Missing authorization, XSS, insecure session management |
| Medium | Exploitable with conditions or when chained | Scheduled release | Missing rate limiting, weak CORS, insufficient logging |
| Low | Defense-in-depth, best practices | When convenient | Missing security headers, detailed error messages |

**Priority order:** Fix Critical vulnerabilities first (emergency), then High (planned), then Medium/Low (scheduled).

---

## Important Notes

- **Audit everything philosophy** - Audit ALL code for security vulnerabilities. Internal utilities and helpers are frequently exposed through APIs or user interactions.
- **Defense in depth** - Layer security controls so single vulnerability doesn't compromise entire system. Never rely on single protection.
- **Fail securely** - When validation fails, deny access. Default to most secure option when uncertain.
- **Principle of least privilege** - Grant minimum permissions necessary. Verify every operation.
- **Security testing** - Test with malicious inputs and edge cases. Add tests for attack scenarios.
- **Incident response** - Log security events with sufficient detail for investigation and response.
