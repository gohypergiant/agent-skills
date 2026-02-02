# CSRF Protection

Never accept state-changing operations without CSRF tokens. Cross-Site Request Forgery (CSRF) tricks authenticated users into performing unwanted actions without their knowledge.

## Why This Matters

CSRF attacks enable:
- **Unauthorized Transfers**: Transfer money from victim's bank account
- **Account Takeover**: Change email/password while user is logged in
- **Malicious Actions**: Post spam, delete data, change settings as the victim
- **Privilege Escalation**: Perform admin actions if victim is administrator

An attacker embeds a malicious form in their website. When an authenticated user visits, the form auto-submits to your application using the victim's cookies. Without CSRF protection, the request appears legitimate.

## Anti-Patterns to Avoid

### ❌ NEVER: Accept State-Changing Requests Without CSRF Protection

```typescript
// ❌ NEVER: No CSRF protection on state-changing endpoint
app.post('/api/transfer', authenticate, async (req, res) => {
  const { toAccount, amount } = req.body;

  // CRITICAL: No CSRF token validation!
  await transferMoney(req.user!.userId, toAccount, amount);

  res.json({ success: true });
});

// Attacker's malicious site:
// <form action="https://yoursite.com/api/transfer" method="POST">
//   <input name="toAccount" value="attacker-account" />
//   <input name="amount" value="10000" />
// </form>
// <script>document.forms[0].submit();</script>
// Victim's cookies automatically sent, transfer succeeds!
```

**Risk:** Critical - Attackers perform actions as authenticated user

---

### ❌ NEVER: Rely Only on Cookie Authentication for State Changes

```typescript
// ❌ NEVER: Cookie-only authentication without CSRF tokens
app.delete('/api/account', authenticate, async (req, res) => {
  // Only checks cookie (automatically sent by browser)
  await db.users.delete({
    where: { id: req.user!.userId },
  });

  res.json({ message: 'Account deleted' });
});

// Attacker exploits:
// <img src="https://yoursite.com/api/account" />
// GET requests automatically include cookies!
```

**Risk:** Critical - Any page can trigger destructive actions

---

### ❌ NEVER: Use GET Requests for State Changes

```typescript
// ❌ NEVER: State-changing operations via GET
app.get('/api/users/:id/delete', authenticate, async (req, res) => {
  await db.users.delete({
    where: { id: req.params.id },
  });

  res.redirect('/users');
});

// Exploitable via:
// <img src="https://yoursite.com/api/users/123/delete" />
// Simple image tag triggers deletion!
```

**Risk:** High - GET requests easily triggered via img, link prefetch, etc.

---

### ❌ NEVER: Accept CSRF Tokens in Cookies Only

```typescript
// ❌ NEVER: CSRF token in cookie alone (no validation)
app.post('/api/update-profile', authenticate, async (req, res) => {
  const csrfToken = req.cookies.csrf_token;

  // ❌ Only checks if token exists, not if it matches!
  if (!csrfToken) {
    return res.status(403).json({ error: 'Missing CSRF token' });
  }

  // Attacker can read victim's cookie and include it in malicious request
  await updateProfile(req.user!.userId, req.body);
});
```

**Risk:** High - Cookie-only validation insufficient

---

### ❌ NEVER: Use Referrer Header for CSRF Protection

```typescript
// ❌ NEVER: Rely on Referrer header (easily spoofed)
app.post('/api/transfer', authenticate, async (req, res) => {
  const referrer = req.headers.referer;

  // ❌ Referrer can be omitted or spoofed
  if (!referrer || !referrer.startsWith('https://yoursite.com')) {
    return res.status(403).json({ error: 'Invalid referrer' });
  }

  await transferMoney(req.user!.userId, req.body.toAccount, req.body.amount);
});
```

**Risk:** High - Referrer header unreliable, can be blocked by privacy tools

---

## Correct Patterns

### ✅ ALWAYS: Use SameSite Cookies

```typescript
// ✅ SameSite cookies prevent CSRF
app.post('/api/login', async (req, res) => {
  const token = generateToken(user);

  res.cookie('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // ✅ Cookie only sent for same-site requests
    maxAge: 3600000, // 1 hour
  });

  res.json({ message: 'Logged in' });
});

// ✅ SameSite: 'strict' - Most secure (recommended for sensitive operations)
// Cookie never sent on cross-site requests (including navigation from external sites)

// ✅ SameSite: 'lax' - Balance of security and usability
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax', // ✅ Cookie sent on top-level navigation GET requests
  maxAge: 3600000,
});
// Good for general applications where users click links from emails

// ❌ NEVER use SameSite: 'none' without additional CSRF protection
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'none', // ❌ Cookie sent on all cross-site requests!
  maxAge: 3600000,
});
```

**Benefit:** Browser prevents cookies from being sent in cross-site requests

---

### ✅ ALWAYS: Implement Double Submit Cookie Pattern

```typescript
import crypto from 'crypto';

// ✅ Generate CSRF token
function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ✅ Set CSRF token cookie
app.use((req, res, next) => {
  if (!req.cookies.csrf_token) {
    const csrfToken = generateCsrfToken();

    // ✅ Set CSRF token in cookie (readable by JavaScript)
    res.cookie('csrf_token', csrfToken, {
      httpOnly: false, // ✅ Must be readable by JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });
  }

  next();
});

// ✅ Validate CSRF token middleware
function validateCsrfToken(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next(); // ✅ Skip validation for safe methods
  }

  const tokenFromCookie = req.cookies.csrf_token;
  const tokenFromHeader = req.headers['x-csrf-token'];

  // ✅ Both tokens must exist and match
  if (!tokenFromCookie || !tokenFromHeader) {
    return res.status(403).json({ error: 'Missing CSRF token' });
  }

  if (tokenFromCookie !== tokenFromHeader) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
}

// ✅ Apply CSRF protection to state-changing endpoints
app.post('/api/transfer',
  authenticate,
  validateCsrfToken, // ✅ Validate CSRF token
  async (req, res) => {
    await transferMoney(req.user!.userId, req.body.toAccount, req.body.amount);
    res.json({ success: true });
  }
);

// ✅ Frontend: Send CSRF token in header
async function transfer(toAccount: string, amount: number) {
  // ✅ Read CSRF token from cookie
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf_token='))
    ?.split('=')[1];

  const response = await fetch('/api/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken!, // ✅ Include token in header
    },
    body: JSON.stringify({ toAccount, amount }),
    credentials: 'include', // ✅ Include cookies
  });

  return response.json();
}
```

**Benefit:** Attacker cannot read victim's CSRF cookie due to same-origin policy

---

### ✅ ALWAYS: Use Synchronizer Token Pattern (More Secure)

```typescript
import crypto from 'crypto';

// ✅ Store CSRF tokens in server-side session
interface Session {
  userId: string;
  csrfToken: string;
}

const sessions = new Map<string, Session>(); // Use Redis in production

// ✅ Generate and store CSRF token
app.post('/api/login', async (req, res) => {
  const user = await validateUser(req.body.email, req.body.password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const sessionId = crypto.randomBytes(32).toString('hex');
  const csrfToken = crypto.randomBytes(32).toString('hex');

  // ✅ Store CSRF token in server-side session
  sessions.set(sessionId, {
    userId: user.id,
    csrfToken,
  });

  // ✅ Send session ID in httpOnly cookie
  res.cookie('session_id', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 3600000,
  });

  // ✅ Send CSRF token in response (not in cookie)
  res.json({
    message: 'Logged in',
    csrfToken, // ✅ Client stores this and includes in requests
  });
});

// ✅ Validate CSRF token against session
function validateCsrfTokenSync(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  const sessionId = req.cookies.session_id;
  const csrfToken = req.headers['x-csrf-token'] as string;

  if (!sessionId || !csrfToken) {
    return res.status(403).json({ error: 'Missing CSRF token' });
  }

  const session = sessions.get(sessionId);

  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  // ✅ Validate token matches session
  if (session.csrfToken !== csrfToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  // ✅ Attach session to request
  req.user = { userId: session.userId };

  next();
}

// ✅ Usage
app.post('/api/transfer',
  validateCsrfTokenSync, // ✅ Validates session AND CSRF token
  async (req, res) => {
    await transferMoney(req.user!.userId, req.body.toAccount, req.body.amount);
    res.json({ success: true });
  }
);

// ✅ Frontend: Store CSRF token and send with requests
let csrfToken: string | null = null;

async function login(email: string, password: string) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  const data = await response.json();

  // ✅ Store CSRF token in memory (not localStorage - XSS protection)
  csrfToken = data.csrfToken;
}

async function transfer(toAccount: string, amount: number) {
  if (!csrfToken) {
    throw new Error('Not authenticated');
  }

  const response = await fetch('/api/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken, // ✅ Include token from login response
    },
    body: JSON.stringify({ toAccount, amount }),
    credentials: 'include',
  });

  return response.json();
}
```

**Benefit:** Server validates token against session, more secure than double-submit

---

### ✅ ALWAYS: Use CSRF Protection Middleware (csurf)

```typescript
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

// ✅ Configure csurf middleware
const csrfProtection = csrf({
  cookie: {
    httpOnly: false, // Must be readable by JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

app.use(cookieParser());

// ✅ Apply globally or per-route
app.use(csrfProtection); // All routes protected

// ✅ Send CSRF token to client
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ✅ Protected endpoints automatically validate
app.post('/api/transfer', csrfProtection, authenticate, async (req, res) => {
  // ✅ csurf middleware validates CSRF token automatically
  await transferMoney(req.user!.userId, req.body.toAccount, req.body.amount);
  res.json({ success: true });
});

// ✅ Frontend: Fetch and use CSRF token
async function setupCsrf() {
  const response = await fetch('/api/csrf-token', {
    credentials: 'include',
  });

  const { csrfToken } = await response.json();

  // ✅ Store token for use in subsequent requests
  return csrfToken;
}

let csrfToken: string;

async function init() {
  csrfToken = await setupCsrf();
}

async function transfer(toAccount: string, amount: number) {
  const response = await fetch('/api/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({ toAccount, amount }),
    credentials: 'include',
  });

  return response.json();
}
```

**Benefit:** Battle-tested library handles edge cases and token generation

---

### ✅ ALWAYS: Require Re-Authentication for Sensitive Actions

```typescript
// ✅ Require password confirmation for sensitive operations
app.post('/api/account/delete', authenticate, async (req, res) => {
  const { password } = req.body;

  // ✅ Verify password before destructive action
  const user = await db.users.findUnique({
    where: { id: req.user!.userId },
  });

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // ✅ Delete account only after password confirmation
  await db.users.delete({
    where: { id: req.user!.userId },
  });

  res.json({ message: 'Account deleted' });
});

// ✅ Require recent authentication for sensitive changes
app.post('/api/account/change-email', authenticate, async (req, res) => {
  const { newEmail } = req.body;

  // ✅ Check last authentication time
  const lastAuth = req.user!.lastAuthTime;
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

  if (lastAuth < fiveMinutesAgo) {
    return res.status(403).json({
      error: 'Recent authentication required',
      code: 'REAUTHENTICATION_REQUIRED',
    });
  }

  await db.users.update({
    where: { id: req.user!.userId },
    data: { email: newEmail },
  });

  res.json({ message: 'Email updated' });
});
```

**Benefit:** Even if CSRF protection bypassed, attacker cannot complete action without password

---

### ✅ ALWAYS: Use Custom Request Headers

```typescript
// ✅ Require custom header for API requests
function requireCustomHeader(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  // ✅ Require X-Requested-With header (simple requests cannot set this)
  const requestedWith = req.headers['x-requested-with'];

  if (requestedWith !== 'XMLHttpRequest') {
    return res.status(403).json({ error: 'Invalid request' });
  }

  next();
}

// ✅ Apply to API routes
app.use('/api', requireCustomHeader);

// ✅ Frontend: Include custom header
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  return fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // ✅ Custom header
      ...options.headers,
    },
    credentials: 'include',
  });
}
```

**Benefit:** Simple CSRF attacks (form submit, img tag) cannot set custom headers

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] SameSite cookies configured (strict or lax)
- [ ] CSRF tokens implemented for all state-changing operations
- [ ] CSRF token validation in middleware before processing requests
- [ ] No state-changing operations via GET requests
- [ ] Double-submit cookie pattern OR synchronizer token pattern implemented
- [ ] CSRF tokens included in custom headers (not URL parameters)
- [ ] Custom X-Requested-With header required for API endpoints
- [ ] Re-authentication required for sensitive operations (delete account, change email/password)
- [ ] CSRF protection tested with automated tools
- [ ] Error messages don't reveal CSRF token validation details
- [ ] CSRF tokens regenerated after authentication
- [ ] Safe HTTP methods (GET, HEAD, OPTIONS) excluded from CSRF validation
