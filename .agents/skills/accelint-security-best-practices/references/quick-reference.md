# Quick Reference: Vulnerability Detection and Mapping

This reference provides rapid vulnerability identification and categorization for security audits.

## Vulnerability Detection Table

| Code Pattern | Vulnerability | OWASP Category | Severity | Reference File |
|--------------|---------------|----------------|----------|----------------|
| `const apiKey = "sk-..."` or `password = "..."` | Hardcoded secrets | A02: Cryptographic Failures | Critical | secrets-management.md |
| `SELECT * FROM users WHERE id = '${id}'` | SQL injection | A03: Injection | Critical | injection-prevention.md |
| `User.findOne({ username: req.body.username })` | NoSQL injection | A03: Injection | Critical | injection-prevention.md |
| `exec(\`command ${userInput}\`)` | Command injection | A03: Injection | Critical | injection-prevention.md |
| `localStorage.setItem('token', token)` | Insecure token storage | A07: Auth Failures | High | authentication.md |
| `<div dangerouslySetInnerHTML={{__html: userHtml}} />` | XSS vulnerability | A03: Injection | High | xss-prevention.md |
| No `authenticate` middleware on route | Missing authentication | A01: Broken Access Control | Critical | authorization.md |
| No ownership check before resource access | Missing authorization | A01: Broken Access Control | High | authorization.md |
| Sequential IDs without ownership verification | IDOR vulnerability | A01: Broken Access Control | High | authorization.md |
| User input without `z.object()` or schema | Missing input validation | A04: Insecure Design | High | input-validation.md |
| File upload without size/type validation | File upload vulnerability | A04: Insecure Design | High | file-uploads.md |
| No rate limiting on `/api/login` | Brute force vulnerability | A04: Insecure Design | High | rate-limiting.md |
| No rate limiting on any API endpoint | DoS vulnerability | A04: Insecure Design | Medium | rate-limiting.md |
| State-changing POST without CSRF token | CSRF vulnerability | A08: Data Integrity Failures | High | csrf-protection.md |
| Cookies without `SameSite=Strict` | CSRF vulnerability | A08: Data Integrity Failures | Medium | csrf-protection.md |
| `console.log(password)` or `logger.info(token)` | Sensitive data in logs | A09: Logging Failures | Medium | sensitive-data.md |
| `res.status(500).json({ error: err.stack })` | Information leakage | A05: Security Misconfiguration | Medium | sensitive-data.md |
| `npm audit` shows vulnerabilities | Vulnerable dependencies | A06: Vulnerable Components | Critical-Low | dependency-security.md |
| No CSP, HSTS, or security headers | Missing security headers | A05: Security Misconfiguration | Medium | security-headers.md |
| `fetch(userProvidedUrl)` without validation | SSRF vulnerability | A10: SSRF | High | ssrf-prevention.md |
| `cors({ origin: '*' })` in production | Permissive CORS | A05: Security Misconfiguration | Medium | security-headers.md |
| Password hashed with MD5/SHA1 | Weak hashing | A02: Cryptographic Failures | High | authentication.md |
| JWT without expiration (`expiresIn`) | Token hijacking risk | A07: Auth Failures | Medium | authentication.md |
| No MFA on admin accounts | Weak authentication | A07: Auth Failures | High | mfa.md |
| `Array.includes(userRole)` for permissions | Inefficient permission check | A01: Broken Access Control | Low | authorization.md |
| Error messages reveal existence of resources | Information leakage | A05: Security Misconfiguration | Low | sensitive-data.md |

## Severity Decision Matrix

Use this matrix to determine vulnerability severity:

### Critical Severity
**Direct path to data breach, RCE, or complete system compromise**

**Indicators:**
- Allows arbitrary code execution (SQL injection, command injection)
- Production secrets hardcoded in source code
- No authentication on admin/sensitive endpoints
- Allows reading arbitrary files or database records

**Examples:**
```typescript
// ❌ Critical: SQL injection
const user = await db.query(`SELECT * FROM users WHERE id = '${req.params.id}'`);

// ❌ Critical: Hardcoded production secret
const apiKey = "sk-prod-xxxxxxxxxxxxx";

// ❌ Critical: No authentication
app.delete('/api/users/:id', deleteUser); // Anyone can delete users
```

### High Severity
**Likely to enable unauthorized access, data theft, or service disruption**

**Indicators:**
- Missing authorization (can access others' resources)
- XSS vulnerabilities (can steal session tokens)
- Insecure authentication (tokens in localStorage)
- IDOR without permission checks
- File upload without validation

**Examples:**
```typescript
// ❌ High: Missing authorization - user can access any invoice
app.get('/api/invoices/:id', authenticate, async (req, res) => {
  const invoice = await db.invoices.findById(req.params.id);
  res.json(invoice); // No ownership check!
});

// ❌ High: XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userComment }} />

// ❌ High: Tokens in localStorage (vulnerable to XSS)
localStorage.setItem('authToken', token);
```

### Medium Severity
**Exploitable with specific conditions or when chained with other vulnerabilities**

**Indicators:**
- Missing rate limiting (enables brute force)
- Weak CORS configuration
- Insufficient logging (can't detect attacks)
- Sensitive data in error messages
- No security headers

**Examples:**
```typescript
// ❌ Medium: No rate limiting (brute force possible)
app.post('/api/login', handleLogin); // No rate limit

// ❌ Medium: Sensitive data in logs
console.log('Login attempt:', { email, password });

// ❌ Medium: Detailed error to user
catch (error) {
  res.status(500).json({ error: error.message, stack: error.stack });
}
```

### Low Severity
**Defense-in-depth improvements, best practices, edge case protections**

**Indicators:**
- Missing security headers (defense in depth)
- Overly detailed error messages (architecture leakage)
- Inefficient permission checks (performance issue)
- Minor information disclosure

**Examples:**
```typescript
// ❌ Low: Missing security headers
// No helmet.js or CSP configured

// ❌ Low: Error message reveals user existence
if (!user) {
  return res.status(404).json({ error: 'User not found' });
  // Should be generic "Invalid credentials"
}

// ❌ Low: Inefficient permission check
if (allowedRoles.includes(user.role)) { // O(n) lookup
  // Use Set.has() for O(1)
}
```

## Anti-Pattern Detection Guide

### Pattern: User Input Handling

**Scan for these patterns:**
```typescript
// Missing validation
req.body.* // Used directly without schema validation
req.params.* // Used directly without type checking
req.query.* // Used directly without sanitization

// Missing sanitization
${userInput} // Template literal with user data
userInput + // String concatenation with user data
```

**Risk:** Injection vulnerabilities, type confusion, malformed data

**Fix:** Use Zod/Joi schemas to validate type, format, and constraints

**Reference:** input-validation.md

---

### Pattern: Database Queries

**Scan for these patterns:**
```typescript
// String concatenation in queries
`SELECT * FROM ${table} WHERE id = '${id}'`
`db.${collection}.find(${filter})`

// Direct user input in queries
{ username: req.body.username } // NoSQL injection if username is object
```

**Risk:** SQL injection (Critical), NoSQL injection (Critical)

**Fix:** Use parameterized queries, ORMs, or type-validated input

**Reference:** injection-prevention.md

---

### Pattern: Authentication & Authorization

**Scan for these patterns:**
```typescript
// No authentication middleware
app.get('/api/sensitive', handler) // No auth check

// No authorization check
const resource = await db.resources.findById(req.params.id);
// No check if req.user.id owns this resource

// Token storage
localStorage.setItem('token', ...) // XSS vulnerable
sessionStorage.setItem('token', ...) // XSS vulnerable
```

**Risk:** Broken access control (Critical-High), token theft (High)

**Fix:** Add authentication middleware, verify ownership, use httpOnly cookies

**Reference:** authorization.md, authentication.md

---

### Pattern: Secrets & Configuration

**Scan for these patterns:**
```typescript
// Hardcoded secrets
const apiKey = "sk-" // API key in source
const password = // Password in source
const token = "eyJ" // JWT in source

// Missing validation
process.env.API_KEY // Used without checking if it exists
```

**Risk:** Secret exposure (Critical), runtime crashes (High)

**Fix:** Use environment variables, validate at startup

**Reference:** secrets-management.md

---

### Pattern: Error Handling

**Scan for these patterns:**
```typescript
// Detailed errors to users
res.json({ error: err.message, stack: err.stack })
res.json({ error: err.toString() })

// Sensitive data in logs
console.log(password, token, ssn, creditCard)
logger.info('User data:', userData) // May contain PII
```

**Risk:** Information leakage (Medium), data exposure (Medium-High)

**Fix:** Generic user messages, server-side detailed logs, redact sensitive data

**Reference:** sensitive-data.md

---

### Pattern: Rate Limiting

**Scan for these patterns:**
```typescript
// No rate limiting
app.post('/api/login', ...) // Authentication endpoint without rate limit
app.post('/api/register', ...) // Registration without rate limit
app.get('/api/search', ...) // Expensive operation without rate limit
```

**Risk:** Brute force (High), DoS (Medium), resource exhaustion (Medium)

**Fix:** Apply rate limiting with express-rate-limit or similar

**Reference:** rate-limiting.md

---

## OWASP Category Quick Lookup

| OWASP Category | Common Anti-Patterns | Typical Severity |
|----------------|---------------------|------------------|
| **A01: Broken Access Control** | No auth middleware, no ownership checks, sequential IDs, missing RBAC | Critical-High |
| **A02: Cryptographic Failures** | Hardcoded secrets, weak hashing (MD5/SHA1), plain text storage | Critical-High |
| **A03: Injection** | String concatenation in queries, unvalidated user input, no sanitization | Critical-High |
| **A04: Insecure Design** | No input validation, no rate limiting, missing file upload checks | High-Medium |
| **A05: Security Misconfiguration** | Default configs, no security headers, detailed errors to users, dev mode in prod | High-Low |
| **A06: Vulnerable Components** | Outdated npm packages, known CVEs, no dependency scanning | Critical-Low |
| **A07: Auth Failures** | localStorage tokens, no MFA, weak sessions, no token expiration | High-Medium |
| **A08: Data Integrity Failures** | No CSRF tokens, missing SameSite, unsigned updates | High-Medium |
| **A09: Logging Failures** | No security logging, sensitive data in logs, insufficient monitoring | Medium-Low |
| **A10: SSRF** | Unvalidated URLs, no allowlist, fetch to user-provided URLs | High-Medium |

## Audit Checklist

Use this checklist to ensure comprehensive coverage:

### Authentication & Authorization
- [ ] All protected routes have authentication middleware
- [ ] All resource access has ownership/permission checks
- [ ] JWT tokens have expiration (`expiresIn`)
- [ ] Tokens stored in httpOnly cookies (not localStorage)
- [ ] Passwords hashed with bcrypt (cost ≥12)

### Input Validation
- [ ] All user input validated with Zod/Joi schemas
- [ ] File uploads restricted (size, type, extension)
- [ ] URL parameters validated and sanitized
- [ ] Query parameters type-checked

### Injection Prevention
- [ ] All SQL queries use parameterized queries or ORMs
- [ ] NoSQL inputs type-validated (no object injection)
- [ ] Command execution uses `execFile` (not `exec`)
- [ ] HTML sanitized with DOMPurify if using `dangerouslySetInnerHTML`

### Secrets & Configuration
- [ ] No hardcoded secrets in source code
- [ ] All secrets in environment variables
- [ ] Environment variables validated at startup
- [ ] `.env` files in `.gitignore`

### Rate Limiting
- [ ] Rate limiting on authentication endpoints (5/hour)
- [ ] Rate limiting on all API endpoints (100/15min)
- [ ] Stricter limits on expensive operations (10/min)

### Sensitive Data
- [ ] No passwords, tokens, or PII in logs
- [ ] Generic error messages for users
- [ ] Detailed errors logged server-side only
- [ ] Error handling catches and logs all errors

### Security Headers
- [ ] CSP (Content Security Policy) configured
- [ ] HSTS enabled
- [ ] X-Frame-Options set to DENY/SAMEORIGIN
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Powered-By header disabled

### CSRF Protection
- [ ] CSRF tokens on all state-changing operations
- [ ] SameSite=Strict on all cookies
- [ ] Origin/Referer validation

### Dependencies
- [ ] `npm audit` shows no vulnerabilities
- [ ] Dependencies updated regularly
- [ ] Dependabot or similar enabled
- [ ] Lock files committed

### SSRF Prevention
- [ ] URL fetching validated against allowlist
- [ ] Private IPs blocked (localhost, 10.*, 192.168.*, etc.)
- [ ] Redirect chains prevented
